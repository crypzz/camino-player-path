"""Modular event-detector registry.

Every detector is a callable ``detect(ctx) -> list[dict]`` where each dict is a row
ready for ``analytics_events``. Register new detectors by appending to ``DETECTORS``
or calling ``register()`` at import time.
"""
from __future__ import annotations
from typing import Callable, List, Dict, Any

Detector = Callable[[Any], List[Dict[str, Any]]]
DETECTORS: List[Detector] = []


def register(fn: Detector) -> Detector:
    DETECTORS.append(fn)
    return fn


def run_all(ctx) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for d in DETECTORS:
        try:
            out.extend(d(ctx))
        except Exception as exc:  # noqa: BLE001 — one detector must not break the pipeline
            print(f"[events] detector {d.__name__} failed: {exc}")
    return out
