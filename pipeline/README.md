# Camino Analytics Worker

Self-hosted Python worker that processes uploaded match videos and writes structured
player analytics back to Supabase via the `analytics-ingest` edge function.

## Pipeline

1. **Detection** — YOLO11 detects players, ball, referees per frame.
2. **Tracking** — ByteTrack assigns persistent track IDs across frames.
3. **Event detection** — modular detectors in `events/` tag touches, passes,
   completed passes, key passes, shots, goals, assists, dribbles, tackles,
   interceptions, clearances, duels, aerial duels, recoveries, fouls,
   offsides, saves, crosses, corners, throw-ins.
4. **Per-player stats** — aggregated into `analytics_player_match_stats` rows
   with heatmap + touchmap (normalized 0-100 pitch coordinates) and player rating.
5. **Highlight clips** — `ffmpeg` cuts per-event windows and uploads to the
   `analytics-clips` Supabase bucket.
6. **Ingest** — a single POST to `analytics-ingest` writes everything atomically.

## Adding a new event detector

Drop a module in `pipeline/events/` exposing:

```python
def detect(frames, tracks, ball, meta) -> list[Event]:
    ...
```

Register it in `pipeline/events/registry.py`. The runner calls every registered
detector and unions their output.

## Environment

- `SUPABASE_URL`, `ANALYTICS_WORKER_SECRET` — for ingest calls.
- `SUPABASE_SERVICE_ROLE_KEY` — for direct storage uploads of highlight clips
  (worker-side only, never shipped to the browser).
- `YOLO_WEIGHTS` — path to a fine-tuned YOLO11 checkpoint (soccer-players).
