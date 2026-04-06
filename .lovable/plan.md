
# "Want To Go Pro?" — Pre-Launch Promo (30s)

## Concept

A direct, punchy video that speaks to young players. Opens with a bold question, exposes the broken academy system, then shows how Camino fixes it.

**Flow: Hook → Problems → Solution → Profile Tease → Close**

---

## Creative Direction

**Style: Bold Street/Sport — high contrast, direct address**

- **Background**: Deep navy-black `#0A0E1A` with a subtle blue glow
- **Palette**: Electric white `#FFFFFF` (primary), Camino gold `#E8B400` (accent), danger red `#FF3B3B` (problems), success green `#1DB870` (solutions)
- **Font**: `Bebas Neue` (impact headlines) + `Inter` (body) — different from all existing videos
- **Motion**: Fast snappy cuts for problems, smooth reveals for solutions. Mix of spring slams and clean fades.

---

## Structure — 8 Scenes

```
Scene 1 (0-3s)     — HOOK: "You want to go pro?" — big slam, screen shake
Scene 2 (3-7s)     — REALITY: "But here's the truth..." — quick pause, tone shift
Scene 3 (7-13s)    — PROBLEMS: 4 pain points rapid-fire (red, struck through)
                      "No one tracks your progress"
                      "Coaches forget your best games"  
                      "No data. No proof."
                      "You're invisible."
Scene 4 (13-17s)   — PIVOT: "What if someone was watching?" — gold text, slow reveal
Scene 5 (17-22s)   — SOLUTION STACK: Camino features fly in as cards
                      "Every session tracked" / "CPI Score" / "Rankings" / "Public Profile"
Scene 6 (22-25s)   — PROFILE: Mock player card rises — shows the proof in action
Scene 7 (25-28s)   — TAGLINE: "Put in the work. Get seen." — two-line punch
Scene 8 (28-30s)   — CLOSE: "CAMINO" logo + "Coming Soon" + breathing glow
```

---

## Technical Plan

### New Files (9)
1. `remotion/src/scenes/GoProHookScene.tsx` — "You want to go pro?" slam
2. `remotion/src/scenes/RealityCheckScene.tsx` — "But here's the truth..." tone shift
3. `remotion/src/scenes/ProblemStackScene.tsx` — 4 rapid-fire problems with red strikethrough
4. `remotion/src/scenes/PivotScene.tsx` — "What if someone was watching?" gold reveal
5. `remotion/src/scenes/SolutionStackScene.tsx` — Feature cards flying in (tracked/CPI/rankings/profile)
6. `remotion/src/scenes/ProofProfileScene.tsx` — Mock player card with live stats
7. `remotion/src/scenes/GetSeenScene.tsx` — "Put in the work. Get seen."
8. `remotion/src/scenes/GoProCloseScene.tsx` — CAMINO logo + Coming Soon
9. `remotion/src/GoProVideo.tsx` — TransitionSeries wiring all 8 scenes

### Files to Update (2)
- `remotion/src/Root.tsx` — Add `"go-pro"` composition (900 frames, 30fps)
- `remotion/scripts/render-remotion.mjs` — Add `"go-pro"` output mapping

### What Makes This Different

| Aspect | Existing Videos | This One |
|---|---|---|
| Font | Plus Jakarta Sans / Playfair | Bebas Neue (condensed impact) |
| Hook | Abstract ("Something is coming") | Direct ("You want to go pro?") |
| Tone | Brand/corporate | Speaking to the player |
| Problems | Listed calmly | Rapid-fire, aggressive red |
| Solution | Feature list | Cards stacking like a deck |
| Close | Generic CTA | "Put in the work. Get seen." |

### Rendering
- Composition: `go-pro`, 900 frames @ 30fps = 30 seconds
- Output: `/mnt/documents/camino-go-pro.mp4`
