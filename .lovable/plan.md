

# AI-Powered Video Analysis Pipeline

## What This Builds

Based on your architecture diagram, this adds an automated AI analysis pipeline that processes uploaded match videos to detect players, track movement, and generate stats -- replacing the current manual-only tagging workflow.

Since Lovable runs client-side + Supabase Edge Functions (no Python/FastAPI server), we adapt the pipeline to use **AI vision models via Lovable AI Gateway** for frame analysis, with Edge Functions orchestrating the processing.

## Architecture (Adapted)

```text
Coach uploads MP4
       │
       ▼
┌─────────────────────┐
│  Upload handler      │  (existing VideoUploadDialog)
│  Sets status=queued  │
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  Edge Fn: process-   │  Orchestrator
│  video               │
│  1. Extract frames   │  (ffmpeg → snapshots)
│  2. Send to AI       │  (Gemini vision model)
│  3. Parse detections │  (bounding boxes)
│  4. Write tracking   │  (player_tracking table)
│  5. Compute stats    │  (match_player_stats)
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Frontend polls      │  status: queued → processing → ready
│  Shows results       │  Overlays, stats, analytics
└─────────────────────┘
```

## Implementation Steps

### 1. Edge Function: `process-video`
- Accepts `{ video_id }` via POST
- Downloads the video from `match-videos` storage bucket
- Uses **ffmpeg** (available in Deno/sandbox) to extract keyframes (1 frame every 2-3 seconds)
- Sends each frame to **Gemini 2.5 Flash** (vision model) with a structured prompt asking it to identify player positions as bounding boxes with jersey numbers/colors
- Parses the AI response into `player_tracking` rows (tracking_id, bbox coordinates, confidence, source='ai')
- Runs the stats engine logic server-side to populate `match_player_stats`
- Updates `match_videos.status` from `queued` → `processing` → `ready`

### 2. Database Changes
- Add `ai_processing_started_at`, `ai_processing_error` columns to `match_videos` for job tracking
- Add index on `player_tracking(video_id, timestamp_seconds)` for query performance

### 3. Frontend: Auto-Analyze Button
- Add "AI Analyze" button to `VideoWorkspace` header (next to existing "Generate Stats")
- Calls the edge function, shows processing status via `ProcessingStatusBadge`
- Poll `match_videos.status` every 3s while processing
- When complete, auto-refresh tracking data and switch to Analytics tab

### 4. Frontend: Processing Queue View
- Update `VideoAnalysisPage` to show processing status on video cards
- Disable "AI Analyze" when already processing

### 5. Identity Tagging (Coach Links track_id → player)
- Already exists in `PlayerTaggingPanel` -- the AI generates `tracking_id`s, coaches click overlays to assign player names
- No changes needed, the existing manual tagging workflow becomes the "identity store" from your diagram

### 6. Stats Pipeline Enhancement
- Enhance `videoStatsEngine.ts` to also compute **touch detection** (proximity of player bbox to ball bbox from AI), **distance tracking** (centroid deltas scaled to pitch dimensions), and **possession time** (consecutive frames near ball)
- Add these new metrics to the `ComputedPlayerStats` interface and `MatchAnalyticsDashboard`

## Technical Details

- **AI Model**: `google/gemini-2.5-flash` -- fast, multimodal, no API key needed (Lovable AI Gateway)
- **Frame extraction**: ffmpeg in the Edge Function runtime to grab PNGs from the video at intervals
- **Prompt engineering**: Structured JSON output requesting player positions, jersey info, ball position per frame
- **Rate limiting**: Process frames sequentially with small delays to avoid hitting rate limits
- **Video size**: For large videos, sample every 3-5 seconds (not every frame) to keep processing time reasonable
- **Source tagging**: All AI-generated tracking rows use `source: 'ai'` vs existing `source: 'manual'`

## What Changes

| File | Change |
|------|--------|
| `supabase/functions/process-video/index.ts` | New edge function -- orchestrates the pipeline |
| `src/hooks/useMatchVideos.ts` | Add polling hook for processing status |
| `src/components/video/VideoWorkspace.tsx` | Add "AI Analyze" button + polling |
| `src/lib/videoStatsEngine.ts` | Add touch/possession/distance metrics |
| `src/components/video/MatchAnalyticsDashboard.tsx` | Display new metrics |
| `src/components/video/ProcessingStatusBadge.tsx` | Add `analyzing` status |
| Migration SQL | Add columns + index |

