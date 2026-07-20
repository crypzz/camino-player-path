"""End-to-end worker: video URL → detections → tracks → events → ingest.

Usage:
    python -m pipeline.worker <match_id> <video_url>

Reads env: SUPABASE_URL, ANALYTICS_WORKER_SECRET.
"""
from __future__ import annotations
import os, sys, json, math, subprocess, tempfile
import urllib.request
from dataclasses import dataclass, field
from typing import Dict, List, Tuple

# Optional heavy deps (ultralytics, supervision) are loaded lazily so the module
# imports cleanly in envs without them.
try:
    from ultralytics import YOLO
    import supervision as sv
    import cv2
except ImportError:  # pragma: no cover
    YOLO = None

from pipeline.events import run_all


@dataclass
class Ctx:
    ball: List[Tuple[float, float, float, float, float]] = field(default_factory=list)
    tracks: Dict[int, List[Tuple[float, float, float]]] = field(default_factory=dict)
    track_to_player: Dict[int, str] = field(default_factory=dict)
    track_team: Dict[int, str] = field(default_factory=dict)

    def holder_at(self, t):
        best_tid, best_d = None, float("inf")
        for _, bx, by, _, _ in self.ball:
            pass
        # simplified: reuse touch logic externally
        return None

    def team_of(self, pid):
        return None


def _ingest(match_id: str, payload: dict) -> None:
    url = os.environ["SUPABASE_URL"].rstrip("/") + "/functions/v1/analytics-ingest"
    body = json.dumps({"match_id": match_id, **payload}).encode()
    req = urllib.request.Request(url, data=body, method="POST", headers={
        "content-type": "application/json",
        "x-worker-secret": os.environ["ANALYTICS_WORKER_SECRET"],
    })
    with urllib.request.urlopen(req, timeout=60) as r:
        r.read()


def process(match_id: str, video_url: str) -> None:
    _ingest(match_id, {"status": "processing"})
    try:
        with tempfile.TemporaryDirectory() as td:
            local = os.path.join(td, "match.mp4")
            urllib.request.urlretrieve(video_url, local)
            ctx = _run_detection_and_tracking(local)
            events = run_all(ctx)
            stats = _aggregate(ctx, events)
            _ingest(match_id, {
                "status": "done",
                "model_version": "yolo11-bytetrack-v1",
                "events": events,
                "player_stats": stats,
            })
    except Exception as e:  # noqa: BLE001
        _ingest(match_id, {"status": "error", "error_message": str(e)})
        raise


def _run_detection_and_tracking(video_path: str) -> Ctx:
    if YOLO is None:
        raise RuntimeError("ultralytics/supervision/cv2 not installed on this worker")
    model = YOLO(os.environ.get("YOLO_WEIGHTS", "yolo11n.pt"))
    tracker = sv.ByteTrack()
    ctx = Ctx()
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    frame_idx = 0
    prev_ball = None
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        t = frame_idx / fps
        h, w = frame.shape[:2]
        res = model(frame, verbose=False)[0]
        det = sv.Detections.from_ultralytics(res)
        det = tracker.update_with_detections(det)
        for i, tid in enumerate(det.tracker_id or []):
            x1, y1, x2, y2 = det.xyxy[i]
            cx, cy = ((x1 + x2) / 2) / w * 100, ((y1 + y2) / 2) / h * 60
            ctx.tracks.setdefault(int(tid), []).append((t, cx, cy))
            if det.class_id[i] == 32:  # ball class id in COCO
                vx, vy = 0.0, 0.0
                if prev_ball:
                    dt = t - prev_ball[0]
                    if dt > 0:
                        vx = (cx - prev_ball[1]) / dt
                        vy = (cy - prev_ball[2]) / dt
                ctx.ball.append((t, cx, cy, vx, vy))
                prev_ball = (t, cx, cy)
        frame_idx += 1
    cap.release()
    return ctx


def _aggregate(ctx: Ctx, events: List[dict]) -> List[dict]:
    per_player: Dict[str, dict] = {}
    for e in events:
        pid = e.get("analytics_player_id")
        if not pid:
            continue
        s = per_player.setdefault(pid, {
            "analytics_player_id": pid, "touches": 0, "passes": 0, "passes_completed": 0,
            "shots": 0, "goals": 0, "assists": 0, "tackles": 0, "interceptions": 0,
            "clearances": 0, "recoveries": 0, "dribbles": 0, "distance_m": 0,
            "heatmap": [], "touchmap": [],
        })
        t = e["event_type"]
        if t == "touch":
            s["touches"] += 1
            s["touchmap"].append({"x": e["x"], "y": e["y"]})
        elif t == "pass": s["passes"] += 1
        elif t == "completed_pass": s["passes_completed"] += 1
        elif t == "shot": s["shots"] += 1
        elif t == "goal": s["goals"] += 1
        elif t == "assist": s["assists"] += 1
        elif t == "tackle": s["tackles"] += 1
        elif t == "interception": s["interceptions"] += 1
        elif t == "clearance": s["clearances"] += 1
        elif t == "recovery": s["recoveries"] += 1
        elif t == "dribble": s["dribbles"] += 1

    for tid, pts in ctx.tracks.items():
        pid = ctx.track_to_player.get(tid)
        if not pid or pid not in per_player:
            continue
        s = per_player[pid]
        for i, (_, x, y) in enumerate(pts):
            s["heatmap"].append({"x": x, "y": y})
            if i > 0:
                dx = x - pts[i - 1][1]; dy = y - pts[i - 1][2]
                s["distance_m"] += math.hypot(dx, dy)

    # simple rating: 6.0 base + 0.4 per goal + 0.2 per assist + 0.05 per key event
    for s in per_player.values():
        r = 6.0 + 0.4 * s["goals"] + 0.2 * s["assists"] + 0.01 * s["touches"] + 0.02 * s["passes_completed"] - 0.05 * (s["passes"] - s["passes_completed"])
        s["rating"] = max(1.0, min(10.0, r))
    return list(per_player.values())


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("usage: python -m pipeline.worker <match_id> <video_url>")
        sys.exit(1)
    process(sys.argv[1], sys.argv[2])
