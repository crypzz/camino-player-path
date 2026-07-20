"""Baseline detectors for touches, passes, completed passes, and shots.

Uses ball–player proximity + ball velocity change to segment possessions and
tag events. Coordinates are pitch-normalized 0–100.
"""
from __future__ import annotations
from typing import List, Dict, Any
from .registry import register

TOUCH_RADIUS = 2.5           # pitch units
SHOT_SPEED = 45.0            # pitch units / s
PASS_MIN_SPEED = 12.0
GOAL_X_HOME = 100.0
GOAL_X_AWAY = 0.0


def _dist(ax, ay, bx, by):
    return ((ax - bx) ** 2 + (ay - by) ** 2) ** 0.5


@register
def detect(ctx) -> List[Dict[str, Any]]:
    events: List[Dict[str, Any]] = []
    ball = ctx.ball  # list[(t, x, y, vx, vy)]
    tracks = ctx.tracks  # dict[track_id] -> list[(t, x, y)]
    track_to_player = ctx.track_to_player  # dict[track_id] -> analytics_player_id

    last_holder = None
    possession_start_t = None

    for i, (t, bx, by, vx, vy) in enumerate(ball):
        # nearest player
        best_tid, best_d = None, float("inf")
        for tid, pts in tracks.items():
            # nearest in time
            p = min(pts, key=lambda q: abs(q[0] - t))
            d = _dist(bx, by, p[1], p[2])
            if d < best_d:
                best_d, best_tid = d, tid

        if best_tid is None or best_d > TOUCH_RADIUS:
            continue

        pid = track_to_player.get(best_tid)
        if pid is None:
            continue

        # touch
        events.append({
            "analytics_player_id": pid, "track_id": best_tid,
            "event_type": "touch", "t_start": t, "x": bx, "y": by,
            "confidence": 0.6,
        })

        # possession transition
        if last_holder and last_holder != pid and possession_start_t is not None:
            speed = (vx ** 2 + vy ** 2) ** 0.5
            if speed > SHOT_SPEED and (bx > 90 or bx < 10):
                events.append({
                    "analytics_player_id": last_holder,
                    "event_type": "shot", "t_start": possession_start_t, "t_end": t,
                    "x": bx, "y": by, "confidence": 0.55,
                    "outcome": "on_target" if 20 <= by <= 40 else "off_target",
                })
            elif speed > PASS_MIN_SPEED:
                events.append({
                    "analytics_player_id": last_holder,
                    "target_player_id": pid,
                    "event_type": "pass", "t_start": possession_start_t, "t_end": t,
                    "x": bx, "y": by, "confidence": 0.6,
                })
                events.append({
                    "analytics_player_id": last_holder,
                    "target_player_id": pid,
                    "event_type": "completed_pass", "t_start": possession_start_t, "t_end": t,
                    "x": bx, "y": by, "confidence": 0.55,
                })

        if last_holder != pid:
            possession_start_t = t
        last_holder = pid

    return events
