"""Tackles, interceptions, recoveries, clearances.

Fires when possession changes hands and the intercepting player is on the defensive
half relative to the ball's prior direction.
"""
from __future__ import annotations
from typing import List, Dict, Any
from .registry import register


@register
def detect(ctx) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    last = None
    for i, (t, bx, by, vx, vy) in enumerate(ctx.ball):
        holder_tid = ctx.holder_at(t)
        pid = ctx.track_to_player.get(holder_tid) if holder_tid else None
        if not pid:
            last = None; continue
        if last and last["pid"] != pid and last["team"] and ctx.team_of(pid) and last["team"] != ctx.team_of(pid):
            gap = t - last["t"]
            etype = "interception" if gap < 0.8 else "tackle" if gap < 2.5 else "recovery"
            out.append({
                "analytics_player_id": pid,
                "event_type": etype, "t_start": t, "x": bx, "y": by,
                "confidence": 0.5,
            })
            if (ctx.team_of(pid) == "home" and bx < 20) or (ctx.team_of(pid) == "away" and bx > 80):
                out.append({
                    "analytics_player_id": pid, "event_type": "clearance",
                    "t_start": t, "x": bx, "y": by, "confidence": 0.45,
                })
        last = {"pid": pid, "t": t, "team": ctx.team_of(pid)}
    return out
