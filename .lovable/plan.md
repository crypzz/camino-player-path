## Camino IG Story Poster

A single 1080×1920 PNG saved to `/mnt/documents/camino-ig-story.png`, ready to upload to Instagram Stories (and works fine reposted to X).

### Concept — product-led, scout-room serious

Mock phone (Camino UI) center-stage on a deep navy backdrop, gold accents, oversized headline beneath. Premium, calm, no game-y feel. Matches the brand tokens already used across the Remotion promos (`#0A0C12` navy, `#E8B400` gold, Plus Jakarta Sans display, Inter body, ivory `#F5F5F5`).

```text
┌─────────────────────────────┐
│  CAMINO              ●LIVE  │  ← small wordmark + gold live dot
│                             │
│       ┌───────────┐         │
│       │  PHONE    │         │  ← rounded mock device,
│       │  CPI 84   │         │     showing CPI dial 71→84,
│       │  ▓▓▓▓▓▓▓  │         │     attribute bars, gold ring
│       │  Top 3%   │         │
│       └───────────┘         │
│                             │
│   ONE PASSPORT.             │  ← display, 130pt, ivory
│   EVERY PLAYER.             │     "every" word in gold
│                             │
│   ───                       │  ← gold rule
│   caminodevelopment.com     │  ← URL, gold accent on .com
└─────────────────────────────┘
```

### Approach

Render with a small Python (Pillow) script — not Remotion (overkill for a still). Pillow is already used for product-shot skill so it's available.

1. **Background** — solid `#0A0C12` with a soft gold radial glow centered behind the phone (`rgba(232,180,0, 0.18)` falling off at 55%). Subtle film-grain overlay (1–2% opacity) to kill banding.
2. **Phone mock** — drawn with rounded rect (28px radius), 540×1100, centered horizontally at ~y=480. Inside:
   - Top status bar (time, signal) in muted ivory.
   - Big CPI dial (SVG-style ring) — gold arc filling to 84%, "84" numeral in Plus Jakarta 140pt, "CPI" label below.
   - 3 attribute mini-bars (Technique 88, Decision 81, Pace 79) with gold fills.
   - Gold "Top 3% U-15" pill chip at the bottom.
3. **Headline** — "ONE PASSPORT." / "EVERY PLAYER." in Plus Jakarta 800, ~130pt, ivory, tight tracking (-0.04em). The word "EVERY" rendered in gold for accent. Positioned at ~y=1500.
4. **Footer** — thin gold rule (200×3px), then `caminodevelopment.com` in Inter 36pt, ivory with gold `.com`. Small "live now" red dot beside the wordmark up top to echo brand promos.
5. **Wordmark** — `CAMINO` top-left at 48pt, 0.4em letter-spacing, ivory.

### Tech details

- New script: `scripts/make-ig-poster.py` (one-off, Pillow only).
- Fonts loaded from Google Fonts (download to `/tmp` once): Plus Jakarta Sans 800, Inter 500/600.
- Output: `/mnt/documents/camino-ig-story.png` (1080×1920, RGB, no transparency).
- QA: open the PNG, inspect for clipping, contrast, alignment, and confirm headline + URL are fully inside safe area (Instagram crops top/bottom ~250px for UI — keep critical content between y=250 and y=1670).

### Out of scope

- No X-format variant (you chose IG only — easy to add later).
- No code changes to the live app or Remotion project.
- No animation (still poster).

### Deliverable

A single downloadable PNG attached via `<lov-artifact>`, plus a quick preview note so you can iterate on copy/layout if needed.
