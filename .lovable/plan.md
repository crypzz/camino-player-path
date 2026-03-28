

# Inspirational "Path to Pro" Vertical Video — 30 seconds

## Creative Direction

**Audience**: Players (ages 12-18) and their parents. The video should feel like a Nike/Adidas sports ad — aspirational, emotional, cinematic.

**Tone**: "Every pro started somewhere. Camino tracks the journey." Inspirational, not salesy. The message is: your development matters, every session counts, the data tells your story.

**Format**: 1080x1920, 30 seconds, 900 frames @ 30fps

**Motion style**: Cinematic Minimal with bursts of Kinetic Energy on key phrases. Slow, dramatic reveals for emotional beats; fast cuts for data/feature moments.

**Palette**: Same brand — `#0D0F14` bg, `#E8B400` gold, `#1DB870` green, `#2B7FE8` blue. Gold is dominant for the aspirational feel.

**Typography**: Plus Jakarta Sans 800 (display), Inter (body). Even larger than the launch video — 100-120px for hero lines.

---

## Scene Breakdown (8 scenes)

### Scene 1 — "The Dream" (0–4s, 120 frames)
- Slow fade in: **"Every pro started somewhere."**
- Gold text, massive, centered. Slow scale 1.05→1.0 with gentle breathing motion.
- Subtle gold particles drifting upward. Cinematic pace — let it breathe.

### Scene 2 — "The Grind" (4–7.5s, 105 frames)
- Staggered word reveals: **"The training. The early mornings. The setbacks."**
- Each phrase springs in one at a time, white text with slight gold underline accents.
- Builds momentum — faster stagger than Scene 1.

### Scene 3 — "The Question" (7.5–10.5s, 90 frames)
- Bold gold text slams in: **"But who's tracking your progress?"**
- Hard spring with shake (like the hook scene from the launch video).
- Dramatic pause, then fade.

### Scene 4 — "The Answer" (10.5–13.5s, 90 frames)
- "Camino" logo reveals with gold arc sweep.
- Below: **"Your digital development passport"**
- Clean, confident. No rush.

### Scene 5 — "CPI Journey" (13.5–18s, 135 frames)
- Animated CPI ring counting up: 45 → 62 → 73 → 81
- Shows progression over time with month labels (Sep → Dec → Mar → Jun)
- Message: **"Watch yourself grow."**
- The ring color shifts from blue → green as score improves.

### Scene 6 — "Feature Flash" (18–22s, 120 frames)
- Quick 3-panel montage: Evaluations card, Progress chart, Goals checklist
- Each slides in from bottom, holds 1 second, cross-fades to next
- Small labels: "Every session scored", "Every trend tracked", "Every goal mapped"

### Scene 7 — "The Vision" (22–26s, 120 frames)
- Large text reveal: **"Your journey. Your data. Your future."**
- Each phrase on its own line, staggered spring-in
- Gold accent lines between phrases

### Scene 8 — "The Close" (26–30s, 120 frames)
- "Camino" large with pulsing gold ring
- Tagline: **"The path to pro starts here."**
- Particles converge inward toward logo (reverse of outward drift)

---

## Technical Plan

### Files to create/update in `remotion/`

All new scene files under `remotion/src/scenes/`:
- `DreamScene.tsx` — Scene 1
- `GrindScene.tsx` — Scene 2
- `QuestionScene.tsx` — Scene 3
- `AnswerScene.tsx` — Scene 4
- `CPIJourneyScene.tsx` — Scene 5
- `FeatureFlashScene.tsx` — Scene 6
- `VisionScene.tsx` — Scene 7
- `PathCloseScene.tsx` — Scene 8

Update:
- `remotion/src/Root.tsx` — New composition `"path-to-pro"`, 900 frames, 1080x1920
- `remotion/src/MainVideo.tsx` — Keep existing. Create new `PathToProVideo.tsx`
- `remotion/scripts/render-remotion.mjs` — Update to render `"path-to-pro"` composition

### Key details
- 900 frames total (30s @ 30fps), accounting for ~15-frame transition overlaps between scenes
- TransitionSeries with fade transitions for emotional scenes, wipe for energy scenes
- CPI ring reuses SVG arc pattern from existing CPIScene but adds temporal progression
- All animation via `useCurrentFrame()` + `interpolate()`/`spring()`
- Output: `/mnt/documents/camino-path-to-pro.mp4`

