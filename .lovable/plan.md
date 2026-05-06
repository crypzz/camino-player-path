## Why a new video

Existing videos average ~6s view time. Two patterns explain it:

1. **Hooks open soft.** Most of our scenes (HypeHookScene, AIOHookScene, ESCHookScene, VAHookScene) open with a question, a "something is coming" tease, or a slow brand reveal. By second 3 the viewer doesn't know what the product is or why they care.
2. **Tech samples drift.** Several reuse mock components that don't 1:1 match the live product (e.g. ReplaceHudl Profile mock, Spreadsheet CPI dash mock). On a small phone, animations also stack — text + ring + scanline + shake — which reads as "laggy" rather than premium.

This new video, **`scout-mode-30`**, fixes both: a 2-second punch hook, then 4 pristine "product moment" beats lifted directly from real Camino UI patterns, then a hard CTA.

## The video — 30s / 900 frames / 1080×1920

**Tone:** confident, scout-room serious. Navy + gold, Plus Jakarta Sans display, Inter body. No game-y bounce, no glitch.

```text
0.0–2.0s  HOOK         "Every game. Watched. Ranked."
2.0–8.0s  CPI MOMENT   Live CPI dial climbs 71 → 84, attribute bars fill
8.0–14s   LEADERBOARD  Top scorers table animates in, rank pills pop
14–20s    VIDEO AI     Pitch mini-map dots fire, event chips stack
20–26s    PASSPORT     Player passport card assembles (level + CPI + reel)
26–30s    CTA          "Camino. The player passport." + URL
```

### Hook fix (the critical 2 seconds)

- Frame 0: **gold word slams in already-readable** — no scale-from-8x, no glitch jitter. One word per beat: **"EVERY. GAME. WATCHED."** at 12fpw.
- Sub-line at frame 30: "Then ranked." in ivory.
- Background: single still photo (scout watching from sideline) with very slow Ken Burns. No scanlines, no rings, no shake. Stillness = premium.
- This is the inverse of HypeHookScene's busy stack — fewer moving parts means it _feels_ faster.

### Pristine product moments

Each of the four middle beats is a single, focused UI element animating cleanly. Rules:

- **One element on screen at a time** (dial OR table OR map OR card — never two competing).
- **Real component visuals.** Pull styling tokens from the live app:
  - CPI dial → mirror `src/components/CPIScoreDisplay.tsx` + `CPIProgressChart.tsx`
  - Leaderboard → mirror `src/components/cmsa/TopScorersTable.tsx` (rank icons, First-Name + Last-Initial obfuscation, gold accent row)
  - Video AI → mirror the SVG pitch overlay from `VideoOverlayCanvas.tsx` style (0–100 normalized dots, event chips)
  - Passport → mirror `src/components/PlayerCard.tsx` + `PlayerLevelBadge.tsx`
- **No mocks that diverge from product.** The Hudl-replacement profile mock and the Sheets-replacement CPI mock are not reused — they don't match what a user actually sees.
- **Motion budget per beat:** one entrance spring (damping 18) + one number/bar interpolation. No simultaneous shake/glitch/ring stacks. This kills the "laggy" feel on phones.

### CTA

- Logo + `caminodevelopment.com` + one line: **"Built for serious players."**
- Hold 90 frames so it's screenshot-able.

## Files to add

```
remotion/src/ScoutMode30.tsx                       # main composition
remotion/src/scenes/scout/SMHookScene.tsx          # 0–2s
remotion/src/scenes/scout/SMCpiScene.tsx           # 2–8s
remotion/src/scenes/scout/SMLeaderboardScene.tsx   # 8–14s
remotion/src/scenes/scout/SMVideoAIScene.tsx       # 14–20s
remotion/src/scenes/scout/SMPassportScene.tsx      # 20–26s
remotion/src/scenes/scout/SMCTAScene.tsx           # 26–30s
remotion/src/scenes/scout/_tokens.tsx              # shared colors/fonts/UI primitives mirroring live app
```

## Files to edit

- `remotion/src/Root.tsx` — register `<Composition id="scout-mode-30" .../>` at 900 frames, 1080×1920, 30fps.

## Render

- Render to `/mnt/documents/scout-mode-30.mp4` via the existing `scripts/render-remotion.mjs` (just change the composition id and output path) so we get the muted, sandbox-safe pipeline.
- QA: pull stills at frames 30, 90, 240, 450, 660, 810 to confirm each beat is clean before declaring done.

## Out of scope

- No changes to other compositions or the live app.
- No new copy variants — one tight script only. We can A/B later once we see if 30s lift beats the 6s baseline.