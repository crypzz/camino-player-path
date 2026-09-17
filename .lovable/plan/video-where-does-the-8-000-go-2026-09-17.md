# Video: "Where Does the $8,000 Go?"

A 28-second vertical reel (1080x1920, 30fps) aimed at APDL parents. It names the league,
puts the season cost on screen as a range, asks what parents actually get back for it, and
lands Camino as the receipt — parent view first, then the player's development record.

## Script and timing

| Time | On screen | Line |
| --- | --- | --- |
| 0-4s | Black, cost counter ticking up to "$5,000-$8,000" | "APDL costs a family $5,000-$8,000 a season." |
| 4-8s | Three dull cards drifting past: a text from a coach, a printed schedule, a blank report | "So what do parents actually get back?" |
| 8-12s | Same cards fading out one by one | "A schedule. A group chat. And a guess." |
| 12-18s | Parent dashboard mock: attendance, weekly report, coach feedback | "Camino shows you exactly what you're paying for." |
| 18-24s | Player development record: CPI score climbing, evaluation history, highlight tiles | "Every session, every evaluation, every clip — tracked." |
| 24-28s | Camino wordmark, then CTA card | "Ask your club for receipts. / Camino — your development. Your pathway. / caminodevelopment.com" |

Tone: calm and factual, not a rant. The dollar figure is shown as a range, attributed on
screen as "reported season cost" so it reads as reporting, not a claim about the league's books.

## Visual direction

Matches the existing reel language: near-black `#0a0a0a`, gold `#FCD34D` accents, bold sans
headlines with italic serif emphasis, film grain and vignette. The BEFORE beats are flatter
and greyer; the Camino beats are lit, gold-accented and animated — same contrast device used
in the comparison reel.

All UI is animated mock components built in the video, not screen recordings.

## Technical notes

- New composition `remotion/src/ApdlValueReel.tsx`, registered in `remotion/src/Root.tsx` as
  `apdl-value-reel`, 1080x1920, 30fps, 840 frames.
- Scene components under `remotion/src/scenes/apdl/`: `_shared.tsx` (tokens, grain, cost
  counter), `CostScene`, `WhatYouGetScene`, `ParentViewScene`, `DevelopmentRecordScene`,
  `CloseScene`, sequenced with `TransitionSeries` and spring timing.
- Reuses `COLORS`/`FONT` from `remotion/src/theme.ts` and the Plus Jakarta Sans + Inter pairing
  already used in the CMSA scenes.
- Render script `remotion/scripts/render-apdl.mjs` modeled on `render-pathway.mjs`; final MP4
  copied to `/mnt/documents/` for download.
- Silent by default, consistent with the recent reels. Voiceover can be added after if wanted.

## Also included

- A ready-to-paste Instagram caption and an X version in chat once the video renders.

## Not included

- No changes to the app itself. This is video only.
- No claim about how any club spends its fees — the video asks the question and shows the
  alternative.
