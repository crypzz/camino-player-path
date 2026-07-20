## AI Soccer Analytics Engine — v1 Plan

Build a modular analytics pipeline: coach uploads a match → self-hosted FastAPI/YOLO11 worker processes it → normalized event/stat tables in Lovable Cloud → player dashboards + AI coaching insights + auto highlight clips + PDF reports.

Team analytics, formation detection, and player comparisons are **phase 2** per your scope choice.

---

### 1. New normalized database schema

Fresh tables (in parallel with the existing `match_videos` UI, which stays untouched). New tables all live in `public` with RLS + GRANTs:

- `analytics_matches` — one row per uploaded game (video_url, fps, duration, home/away, status, worker_job_id, model_version).
- `analytics_players` — canonical player registry per club (links to existing `players.id` when known, plus jersey #, team side).
- `analytics_tracks` — raw tracker output (match_id, track_id, player_id nullable until tagged, first/last frame).
- `analytics_frames` — down-sampled per-frame positions (match_id, track_id, frame, t_seconds, x, y on 0–100 normalized pitch, has_ball).
- `analytics_events` — the tagged actions (match_id, player_id, track_id, type enum, t_start, t_end, x, y, outcome, target_player_id, xg nullable, meta jsonb). Type enum covers all 20 event types you listed.
- `analytics_player_match_stats` — per-player per-match rollup (touches, passes, pass_acc, key_passes, shots, shots_on_target, goals, assists, dribbles, tackles, interceptions, clearances, duels, duels_won, aerials, aerials_won, recoveries, fouls, offsides, saves, crosses, corners, throw_ins, distance_m, sprint_count, rating, heatmap jsonb, touchmap jsonb).
- `analytics_player_season_stats` — season-level rollup per player, refreshed by trigger on match stat inserts.
- `analytics_highlight_clips` — generated clip metadata (event_id, player_id, storage_path, t_start, t_end).
- `analytics_coaching_insights` — AI-generated per-player-per-match text (strengths, weaknesses, priorities, comparison_delta jsonb).

Indexes on `(match_id)`, `(player_id, match_date)`, `(type)`, `(t_seconds)` for fast filtering.

**RLS**: coaches read/write matches for clubs they own (via `has_role` + a club membership check); players read only rows where `player_id` maps to their own profile; a `has_role(auth.uid(),'admin')` bypass. Highlight clips are stored in a **private** storage bucket `analytics-clips` with signed URLs.

### 2. FastAPI worker (extends existing `pipeline/`)

Fill in the existing scaffold under `pipeline/` + `docker-compose.yml`:

- `pipeline/detector.py` — YOLO11 (ultralytics) player + ball detection.
- `pipeline/tracker.py` — ByteTrack for stable track IDs across frames.
- `pipeline/pitch_homography.py` — 4-point pitch calibration → normalized 0–100 coordinates.
- `pipeline/events/` — one file per detector, each implementing `detect(frames, tracks, ball) -> Event[]`:
  - `touch.py`, `pass.py` (+ completed/key), `shot.py`, `goal.py`, `assist.py`, `dribble.py`, `tackle.py`, `interception.py`, `clearance.py`, `duel.py` (+ aerial), `recovery.py`, `foul.py` (heuristic), `offside.py`, `save.py`, `cross.py`, `corner.py`, `throw_in.py`.
  - Registry pattern (`EVENT_DETECTORS = [...]`) so new detectors plug in without touching the orchestrator.
- `pipeline/stats_extractor.py` — rolls events into per-match stats + heatmap/touchmap bins + rating formula.
- `pipeline/main.py` — FastAPI: `POST /jobs` (enqueue), `GET /jobs/{id}` (status), background worker writes results into Supabase via service-role key (URL + key injected via env; no secrets in repo).
- `docker-compose.yml` — worker + redis for job queue; GPU passthrough documented in README.

The Lovable app talks to the worker via `VITE_API_URL` (already wired in `src/lib/videoApi.ts`). No edge function tries to run ML.

### 3. Upload → processing flow

- Coach uses existing upload dialog (extended to write into `analytics_matches` instead of only `match_videos`).
- New edge function `enqueue-analysis` — validates coach role, POSTs to worker `/jobs`, stores `worker_job_id`, sets status `queued`.
- Existing polling hook pattern (`useVideoProcessingPoll`) reused for status updates.
- Worker writes tracks/frames/events/stats directly via Supabase service role, then flips status to `done` and triggers `generate-highlights` + `generate-insights` edge functions.

### 4. Auto highlight clips

- Edge function `generate-highlights` — for each event of type goal/assist/key_pass/shot/save/dribble with high confidence, runs `ffmpeg` (already in sandbox) via the worker to cut a 6s clip around `t_start`, uploads to `analytics-clips` bucket, inserts `analytics_highlight_clips` row linked to event + player.

### 5. AI coaching insights

- Edge function `generate-insights` — after stats land, calls Lovable AI (`google/gemini-2.5-flash`) with the player's current match stats + last 3 matches + season averages, asks for structured JSON `{ strengths[], weaknesses[], training_priorities[], trend: 'up'|'flat'|'down' }`. Stored in `analytics_coaching_insights`.

### 6. Player analytics dashboard (frontend)

New routes:

- `/analytics/matches` — coach list of processed matches.
- `/analytics/matches/:id` — match overview: possession, event feed, team touchmap.
- `/analytics/players/:playerId` — the main player dashboard:
  - Season totals cards.
  - Per-match table + sparkline trend lines (Recharts).
  - Passing accuracy, shot accuracy, duel success, defensive actions donut/bars.
  - Heatmap + touchmap SVG overlays on pitch (reuse `SquadByPosition` pitch style).
  - Player rating trend over time.
  - Position-specific metric block (attacker vs mid vs def vs GK — different visible metrics).
  - AI insights panel (strengths / weaknesses / priorities).
  - Highlight clips grid with signed-URL playback.
  - "Compare with previous match" delta strip.

New hooks: `useAnalyticsMatch`, `useAnalyticsPlayerStats`, `useAnalyticsSeasonStats`, `useAnalyticsHighlights`, `useAnalyticsInsights` — all filtering via indexed queries.

**Access control in UI**: players routed to their own `/analytics/players/:me` and cannot open other players' pages (RLS enforces the same at DB level).

### 7. Downloadable PDF reports

Client-side HTML print window (per existing `pdf-export-strategy` memory) rendering the player dashboard into a printable layout. Coach also gets per-match team report.

### 8. Modularity guarantees

- Event detectors: registry list — add a file, register it, migrations already include the enum + `ALTER TYPE ... ADD VALUE`.
- ML models: `pipeline/models/` folder with a `ModelSpec` interface (`detect(frame) -> boxes`); YOLO11 is one impl, swap by env var `DETECTOR_MODEL`.
- Stats: `stats_extractor.py` composes reducers over events; adding a new stat = add a reducer + column (migration).

---

### What ships in this build (v1)

1. Migrations for all 9 new tables + RLS + GRANTs + `analytics-clips` bucket.
2. FastAPI worker with YOLO11 + ByteTrack + touch/pass/shot/goal detectors (remaining event detectors stubbed with the registry in place so they're one-file additions later — you approved "touch/pass/shot events" for v1 scope).
3. `enqueue-analysis`, `generate-highlights`, `generate-insights` edge functions.
4. Player analytics dashboard (`/analytics/players/:id`) with heatmap, touchmap, ratings, trends, insights, clips.
5. Per-match overview page.
6. PDF export.
7. All 20 event types defined in the enum + schema now so phase-2 detectors write straight into the same tables.

Team analytics, formation analysis, and player comparisons are **not** in v1 per your scope selection — the schema supports them so phase 2 is UI-only.

### Notes / assumptions to confirm before build

- Worker deployment: user runs `docker compose up` on a GPU box and sets `VITE_API_URL` + a `WORKER_SHARED_SECRET`. Lovable Cloud can't host it.
- YOLO11 weights: bundled `yolo11n.pt` (nano) by default; user can swap to `yolo11x.pt` in the compose env for accuracy.
- Foul / offside / handball detection are heuristic-only in v1 (marked `confidence: low`); real refereeing-grade detection is out of scope.