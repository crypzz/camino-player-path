#!/usr/bin/env python3
"""Synthesize the original score + sound-design stem for the Camino Pathway film.

Output: remotion/public/audio/score.wav (44.1kHz stereo, 39.5s)
"""
import math
import os
import wave
import struct
import numpy as np

SR = 44100
FPS = 30
FRAMES = 1185
DUR = FRAMES / FPS  # 39.5s
N = int(SR * DUR)
t = np.arange(N) / SR

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "score.wav")

# Scene boundaries in seconds
SCENES = [f / FPS for f in (0, 150, 325, 565, 735, 960, 1185)]

mix = np.zeros(N)


def env(a, d, s_level, r, start, dur):
    """ADSR-ish envelope over a window."""
    e = np.zeros(N)
    i0 = int(start * SR)
    i1 = min(N, int((start + dur) * SR))
    if i1 <= i0:
        return e
    seg = i1 - i0
    ai = min(int(a * SR), seg)
    di = min(int(d * SR), seg - ai)
    ri = min(int(r * SR), seg - ai - di)
    si = seg - ai - di - ri
    parts = [np.linspace(0, 1, ai, endpoint=False)]
    parts.append(np.linspace(1, s_level, di, endpoint=False))
    parts.append(np.full(max(si, 0), s_level))
    parts.append(np.linspace(s_level, 0, ri))
    curve = np.concatenate(parts)[:seg]
    e[i0:i0 + len(curve)] = curve
    return e


def tone(freq, start, dur, amp, a=0.6, d=0.5, s=0.75, r=1.2, detune=0.004, harm=(1.0, 0.45, 0.2)):
    """Warm detuned pad voice."""
    e = env(a, d, s, r, start, dur) * amp
    sig = np.zeros(N)
    for k, h in enumerate(harm, start=1):
        sig += h * np.sin(2 * np.pi * freq * k * t)
        sig += h * 0.7 * np.sin(2 * np.pi * freq * k * (1 + detune) * t + 0.4)
    return sig * e / len(harm)


def sub_pulse(freq, times, amp=0.5, length=0.55):
    sig = np.zeros(N)
    for st in times:
        e = env(0.008, 0.18, 0.25, length, st, length)
        sig += np.sin(2 * np.pi * freq * t) * e * amp
    return sig


def noise_swell(start, dur, amp, hp=True):
    n = np.random.default_rng(int(start * 1000)).normal(0, 1, N)
    # simple one-pole filtering
    b = 0.02 if not hp else 0.3
    filt = np.zeros(N)
    acc = 0.0
    for_ = n
    # vectorised approximation: moving average smoothing
    win = 64 if not hp else 6
    kernel = np.ones(win) / win
    filt = np.convolve(for_, kernel, mode="same")
    if hp:
        filt = for_ - np.convolve(for_, np.ones(256) / 256, mode="same")
    e = env(dur * 0.6, 0.05, 1.0, dur * 0.4, start, dur)
    return filt * e * amp


def click(start, amp=0.22, freq=2200, length=0.06):
    e = env(0.001, 0.01, 0.2, length, start, length)
    return (np.sin(2 * np.pi * freq * t) * 0.5 + np.sin(2 * np.pi * freq * 1.7 * t) * 0.3) * e * amp


def impact(start, amp=0.85):
    e = env(0.002, 0.25, 0.12, 1.6, start, 1.9)
    body = np.sin(2 * np.pi * 46 * t) + 0.5 * np.sin(2 * np.pi * 92 * t)
    rng = np.random.default_rng(7)
    nz = np.convolve(rng.normal(0, 1, N), np.ones(48) / 48, mode="same")
    return (body * 0.8 + nz * 0.35) * e * amp


# ---- Harmonic plan: Am -> F -> C -> G (rising) ----
NOTES = {
    "A2": 110.0, "C3": 130.81, "E3": 164.81, "F2": 87.31, "A3": 220.0,
    "C4": 261.63, "G2": 98.0, "B3": 246.94, "D4": 293.66, "E4": 329.63, "G4": 392.0,
}

chords = [
    (SCENES[0], SCENES[1] - SCENES[0], ["A2", "C3", "E3"], 0.10),          # problem: sparse, low
    (SCENES[1], SCENES[2] - SCENES[1], ["F2", "C3", "A3"], 0.13),          # meet camino
    (SCENES[2], SCENES[3] - SCENES[2], ["C3", "E3", "G4"], 0.14),          # upload + AI
    (SCENES[3], SCENES[4] - SCENES[3], ["A2", "E3", "C4"], 0.14),          # feedback
    (SCENES[4], SCENES[5] - SCENES[4], ["F2", "C4", "A3"], 0.16),          # development
    (SCENES[5], SCENES[6] - SCENES[5], ["C3", "G4", "E4"], 0.20),          # ending
]

for start, dur, notes, amp in chords:
    for nname in notes:
        mix += tone(NOTES[nname], start, dur + 0.8, amp, a=0.9, d=0.6, s=0.8, r=1.4)

# Low drone throughout
mix += tone(55.0, 0.0, DUR, 0.10, a=2.0, d=1.0, s=0.9, r=3.0, harm=(1.0, 0.25))

# Heartbeat sub pulses — sparse at first, doubling through the film
pulse_times = []
bpm = 84
beat = 60.0 / bpm
tt = 0.0
while tt < DUR - 0.6:
    if tt < SCENES[1]:
        step = beat * 4
    elif tt < SCENES[2]:
        step = beat * 2
    elif tt < SCENES[5]:
        step = beat
    else:
        step = beat * 2
    pulse_times.append(tt)
    tt += step
mix += sub_pulse(55.0, pulse_times, amp=0.30)

# Percussive ticks during the AI-tagging beat
tick_start = SCENES[2] + 1.0
tk = tick_start
while tk < SCENES[3] - 0.2:
    mix += click(tk, amp=0.10, freq=3100, length=0.045)
    tk += beat / 2

# UI clicks on panel snaps
for c in [SCENES[1] + 0.4, SCENES[1] + 0.9, SCENES[1] + 1.4, SCENES[3] + 0.3, SCENES[3] + 1.1,
          SCENES[4] + 0.3, SCENES[4] + 0.9]:
    mix += click(c, amp=0.13, freq=1800)

# Transition whooshes at every scene change
for s in SCENES[1:6]:
    mix += noise_swell(s - 0.55, 0.75, 0.16)

# Riser into the ending + impact on the hard cut
mix += noise_swell(SCENES[5] - 2.2, 2.2, 0.22)
riser_e = env(2.0, 0.05, 1.0, 0.25, SCENES[5] - 2.2, 2.25)
riser_f = np.interp(t, [SCENES[5] - 2.2, SCENES[5]], [180, 900])
mix += np.sin(2 * np.pi * np.cumsum(riser_f) / SR) * riser_e * 0.10
mix += impact(SCENES[5])
mix += impact(SCENES[5] + 3.75, amp=0.5)  # wordmark hit

# ---- Ducking under voiceover ----
VO_STARTS = [(0 + 8) / FPS, (150 + 8) / FPS, (325 + 8) / FPS, (565 + 8) / FPS, (735 + 8) / FPS, (960 + 8) / FPS]
VO_LENS = [4.464, 5.269, 7.276, 5.040, 7.007, 6.917]
duck = np.ones(N)
for st, ln in zip(VO_STARTS, VO_LENS):
    i0, i1 = int(st * SR), int(min(DUR, st + ln + 0.35) * SR)
    fade = int(0.28 * SR)
    seg = np.full(i1 - i0, 0.45)
    seg[:fade] = np.linspace(1.0, 0.45, min(fade, len(seg)))
    seg[-fade:] = np.linspace(0.45, 1.0, min(fade, len(seg)))
    duck[i0:i1] = np.minimum(duck[i0:i1], seg)
mix *= duck

# Global fade in/out
fade_in = int(1.2 * SR)
fade_out = int(2.2 * SR)
mix[:fade_in] *= np.linspace(0, 1, fade_in)
mix[-fade_out:] *= np.linspace(1, 0, fade_out)

# Soft-clip + normalise
mix = np.tanh(mix * 1.3)
mix = mix / (np.max(np.abs(mix)) + 1e-9) * 0.82

# Light stereo width
delay = int(0.011 * SR)
left = mix.copy()
right = np.concatenate([np.zeros(delay), mix[:-delay]]) * 0.96 + mix * 0.04
stereo = np.stack([left, right], axis=1)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
pcm = (np.clip(stereo, -1, 1) * 32767).astype("<i2")
with wave.open(os.path.abspath(OUT), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", os.path.abspath(OUT), f"{DUR:.2f}s")
