

# "Want To Go Pro?" — Pre-Launch Video (30s)

## Concept
A direct, punchy video that speaks to young players. Opens with a bold question, exposes the broken academy system, then shows how Camino fixes it. Ends with "Put in the work. Get seen."

## Creative Direction
- **Style**: Bold sport/street — high contrast, direct address to the player
- **Background**: Deep navy-black `#0A0E1A`
- **Font**: Bebas Neue (condensed impact headlines) + Inter (body) — different from all existing videos
- **Palette**: White (primary), Gold `#E8B400` (accent), Red `#FF3B3B` (problems), Green `#1DB870` (solutions)
- **Motion**: Fast snappy spring slams for hooks, smooth card reveals for solutions

## Structure — 8 Scenes (30 seconds)

```text
Scene 1 (0-3s)    "YOU WANT TO GO PRO?" — big slam, shake
Scene 2 (3-6.5s)  "But here's THE TRUTH..." — tone shift, red dots
Scene 3 (6.5-12s) 4 problems rapid-fire in red with strikethrough
Scene 4 (12-16s)  "What if SOMEONE WAS WATCHING?" — gold reveal
Scene 5 (16-21s)  Solution cards stack in (tracked/CPI/rankings/profile)
Scene 6 (21-25s)  Mock player profile card rises with live stats
Scene 7 (25-28s)  "PUT IN THE WORK. GET SEEN." — two-line punch
Scene 8 (28-30s)  "CAMINO" logo + Coming Soon + breathing glow
```

## Technical Plan

### New Files (9)
1. `remotion/src/scenes/GoProHookScene.tsx` — "You want to go pro?" slam
2. `remotion/src/scenes/RealityCheckScene.tsx` — "But here's the truth..." tone shift
3. `remotion/src/scenes/ProblemStackScene.tsx` — 4 rapid-fire problems with red strikethrough
4. `remotion/src/scenes/PivotScene.tsx` — "What if someone was watching?" gold reveal
5. `remotion/src/scenes/SolutionStackScene.tsx` — Feature cards flying in
6. `remotion/src/scenes/ProofProfileScene.tsx` — Mock player card with live stats
7. `remotion/src/scenes/GetSeenScene.tsx` — "Put in the work. Get seen."
8. `remotion/src/scenes/GoProCloseScene.tsx` — CAMINO logo + Coming Soon
9. `remotion/src/GoProVideo.tsx` — TransitionSeries wiring all 8 scenes

### Files to Update (2)
- `remotion/src/Root.tsx` — Add `"go-pro"` composition (900 frames, 30fps)
- `remotion/scripts/render-remotion.mjs` — Add `"go-pro"` output mapping

### Output
- Composition: `go-pro`, 900 frames @ 30fps = 30 seconds, 1080x1920 (vertical)
- Rendered to: `/mnt/documents/camino-go-pro.mp4`

