## Problem

The current `process-video` edge function ships the entire MP4 (≤20 MB) to one chat completion and asks GPT-5.5 to imagine bounding boxes across all timestamps. Multimodal LLMs hallucinate spatial coordinates on video blobs, so output is unusable — wrong boxes, wrong counts, wrong timestamps. Your architecture diagram already calls this out (YOLOv8 + DeepSORT is the right answer, but we can't run Python in Lovable).

Best compromise: **extract real frames in the browser, send each frame as an image to Gemini Vision, and trust per-frame detection**. Single-image detection is what these models are actually good at.

## What changes

```text
Coach ─► VideoWorkspace ─┐
                         │ 1. seek to t=0,2,4… via <video>
                         │ 2. draw frame to <canvas>, encode JPEG
                         │ 3. POST {videoId, ts, jpegB64} ──► detect-frame edge fn
                         │                                       │
                         │                                       ▼
                         │                              Gemini Vision (single image)
                         │                                       │
                         │                                       ▼
                         │                              player_tracking insert
                         │ 4. progress bar 0–100%, live overlay
                         ▼
                  match_videos.status = ready
```

No Python service, no whole-video LLM call, no demo data.

## Frontend (`src/components/video/VideoWorkspace.tsx` + new hook)

1. New hook `useFrameByFrameTracker(videoId, videoRef)`:
   - Reads `duration_seconds` and `video_url` from the row.
   - Walks timestamps `0, 2, 4, …` (configurable interval).
   - For each ts: `video.currentTime = ts`, await `seeked`, draw to a 640px-wide `<canvas>`, `toBlob('image/jpeg', 0.7)`, base64-encode.
   - `supabase.functions.invoke('detect-frame', { body: { video_id, timestamp_seconds, frame_jpeg_b64 } })`.
   - Reports `{processed, total, lastFrameDetections}` so we can render a progress bar and live overlay.
2. Trigger UI: replace the existing "Run AI tracker" button with a new control that runs the hook. Show progress, current ts, and a cancel button. Persist `status='processing'` on start and `status='ready'` on finish (via a tiny RPC or direct update because creator owns the row).
3. Drop the old `process-video` invocation site; keep the function around for now but unused.

## Backend (new edge function `supabase/functions/detect-frame/index.ts`)

- `verify_jwt = true` (creator only).
- Validate body with zod: `{ video_id: uuid, timestamp_seconds: number, frame_jpeg_b64: string (≤ ~1.5 MB) }`.
- Confirm caller `auth.uid()` equals `match_videos.created_by`.
- Call Lovable AI Gateway with `google/gemini-3-flash-preview` (fast, vision-capable, cheap) using a **single-image** prompt + tool call:

  ```text
  Detect every soccer player visible in this frame.
  Return bbox as percentages of the image (0–100), team_color, jersey_number when readable, confidence.
  Also return ball: {x,y} as percentages, or null.
  ```

  Tool schema mirrors the existing one but for ONE frame (not an array).
- On success, INSERT one row per player into `player_tracking` (`source='ai'`, `frame_number = round(ts*30)`, normalized 0–100 bbox). Insert a ball row too when present (tracking_id `ai_ball`).
- Return `{ detections: N, ball: bool }` so the frontend can render immediately.
- 429 / 402 / network errors are surfaced; frontend keeps going but marks that frame as failed and continues.

Performance: ~1 request/sec, Gemini Flash latency ~1–2 s. A 90 s clip at 2 s spacing = 45 frames ≈ 60–90 s end-to-end with a live progress bar — far better UX than the current "spin for 2 min then show garbage".

## Settings exposed to the coach

A small popover on the workspace:
- **Frame interval** (default 2 s, range 1–5).
- **Detection size** (default 640px, range 480–960) — bigger = more accurate, slower.
- **Include ball detection** toggle.

Stored in component state only; no schema change.

## Cleanup

- Mark `process-video` function as deprecated in its header comment; remove its UI invocation. Don't delete it yet so any in-flight rows resolve.
- Keep `player_tracking.source='ai'` semantics; the new pipeline writes the same shape so all downstream consumers (`usePlayerTracking`, pitch overlay, mini-map) keep working unchanged.

## Files

- New: `supabase/functions/detect-frame/index.ts`
- New: `src/hooks/useFrameByFrameTracker.ts`
- Edit: `src/components/video/VideoWorkspace.tsx` (replace tracker trigger UI, wire hook, progress bar)
- Edit: `src/lib/videoProcessing.ts` (helper for client-side row status updates if needed)
- No DB migration required (reuses `player_tracking` + `match_videos`).

## Out of scope (intentionally)

- Persistent track IDs across frames (DeepSORT). The model gets a `tracking_id` hint per frame but cross-frame identity will be best-effort; the existing manual tagging UI is how the coach reconciles identity.
- Demo/seed data — per your decision, real detections only.

## Risks

- Gemini will still occasionally miss players or double-count. Acceptable for testing; coach can delete bad rows from the tagging UI.
- 45+ sequential AI calls cost more credits per video than the single batch call did. We can later switch to parallel batches of 3–5 if cost is fine.
