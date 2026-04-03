

# "Built Different" — Cinematic Countdown Teaser (30s)

## Why This Is Different

Every existing Camino video uses the same formula: dark `#0D0F14` background, gold/green/blue palette, Plus Jakarta Sans, spring-slam text, particle dots, pulsing rings. All six videos feel like variations of the same template.

This one breaks the mold completely.

---

## Creative Direction

**Aesthetic: Editorial / Magazine Film Grain**

Instead of dark-tech-product energy, this feels like a Nike or Adidas brand film — warm, textured, human.

- **Background**: Warm off-black `#1A1714` with film grain overlay (animated noise)
- **Palette**: Cream `#F2E8D5` (primary text), burnt orange `#D4622B` (accent), deep charcoal `#2A2520` (cards), muted sage `#7A8B6F` (secondary)
- **Font**: `Playfair Display` (serif, editorial headlines) + `Inter` (clean body) — zero overlap with existing Plus Jakarta Sans usage
- **Motion**: Slow, cinematic easing — no spring slams, no shakes. Smooth `interpolate` with ease-in-out curves. Elements glide, not punch.
- **Texture**: Horizontal film grain scan lines drifting slowly across every frame. Subtle vignette.

**Structure — 7 Scenes, Countdown Format**

Instead of "problem → solution → features → CTA," this uses a poetic countdown structure:

```
Scene 1 (0-3s)    — "5" — large serif number, grain, "Days of guessing are over"
Scene 2 (3-7s)    — "4" — "Reasons coaches lose track" (crossed out one by one)
Scene 3 (7-12s)   — "3" — "Pillars that define you" (CPI / Level / Rank) — elegant cards
Scene 4 (12-17s)  — "2" — Split screen: "Before Camino" (chaos) vs "After" (clarity)
Scene 5 (17-22s)  — "1" — "Platform. Your path." — mock profile rising from bottom
Scene 6 (22-26s)  — "0" — Logo reveal with horizontal line wipe, not particle burst
Scene 7 (26-30s)  — Tagline hold: "The standard is coming." — slow breathe, no flash
```

**Motifs**:
- Large serif countdown numbers (Playfair Display, ~300px) anchored to left edge
- Horizontal rules that extend as scene transitions
- Film grain overlay across entire video
- No circles, no rings, no particles — only lines and typography

---

## Technical Plan

### New Files (8)
1. `remotion/src/scenes/CountdownNumberScene.tsx` — Reusable countdown digit with editorial reveal
2. `remotion/src/scenes/ReasonsScene.tsx` — "4 reasons" strikethrough animation
3. `remotion/src/scenes/PillarsScene.tsx` — Three elegant metric cards gliding in
4. `remotion/src/scenes/BeforeAfterScene.tsx` — Split-screen contrast with horizontal wipe
5. `remotion/src/scenes/ProfileRiseScene.tsx` — Mock profile card rising from bottom with slow ease
6. `remotion/src/scenes/EditorialRevealScene.tsx` — Logo with horizontal line wipe
7. `remotion/src/scenes/StandardCloseScene.tsx` — "The standard is coming." slow hold
8. `remotion/src/CountdownTeaser.tsx` — TransitionSeries wiring all 7 scenes

### Files to Update (2)
- `remotion/src/Root.tsx` — Add `"countdown-teaser"` composition
- `remotion/scripts/render-remotion.mjs` — Add `"countdown-teaser"` to render

### Key Differences from Existing Videos

| Aspect | Existing 6 Videos | This Video |
|---|---|---|
| Background | `#0D0F14` cold dark | `#1A1714` warm dark |
| Accent | Gold `#E8B400` | Burnt orange `#D4622B` |
| Font | Plus Jakarta Sans (bold) | Playfair Display (serif) |
| Motion | Spring slams + shakes | Smooth cinematic easing |
| Effects | Particles, rings, pulses | Film grain, horizontal lines |
| Structure | Problem → Solution → CTA | Poetic countdown 5→0 |
| Layout | Always centered | Left-anchored, asymmetric |
| Vibe | Tech product hype | Nike brand film editorial |

### Rendering
- Composition: `countdown-teaser`, 900 frames @ 30fps = 30 seconds
- Output: `/mnt/documents/camino-countdown-teaser.mp4`

