

# "Level Up" — 15-Second Fitness & Progress Video

## Creative Direction

**Format**: 1080x1920, 15 seconds, 450 frames @ 30fps
**Tone**: Aspirational, personal. "The work shows. The data proves it. Your coach sees it." Speaks directly to the player.
**Motion**: Kinetic Energy for the hook, Cinematic Minimal for the data moments.
**Palette**: Same brand — `#0D0F14` bg, `#E8B400` gold, `#1DB870` green, `#2B7FE8` blue.

## Scene Breakdown (5 scenes)

### Scene 1 — "The Hook" (0–3s, 90 frames)
- Text SLAMS in: **"You put in the work."**
- Massive gold, 100px, hard spring with shake effect (like HookScene pattern)
- Beat. Then second line springs in below: **"Now prove it."**
- Gold accent line sweeps across

### Scene 2 — "Fitness Test" (3–6s, 90 frames)
- Mock fitness test results card slides up
- Animated stat bars filling in: Sprint 8.2s, Beep Test Lv12, Agility 4.1s
- Each bar springs to its value with staggered timing
- Label: **"Every test. Measured."**

### Scene 3 — "Progress Tracker" (6–9s, 90 frames)
- Animated line chart drawing itself (SVG path with strokeDashoffset)
- Shows upward trend over 6 months with dot markers
- Score counter: 58 → 74 (interpolated number)
- Label: **"Every gain. Tracked."**

### Scene 4 — "Coach Feedback" (9–12s, 90 frames)
- Chat-bubble style coach feedback cards spring in staggered:
  - "Great improvement on ball control" ✓
  - "Focus on weak foot next session"
  - "Ready for match selection"
- Gold avatar icon for coach
- Label: **"Your coach. Always watching."**

### Scene 5 — "The Close" (12–15s, 90 frames)
- "Camino" logo with pulsing gold ring
- Tagline: **"Your progress. Proven."**
- Converging particles

## Technical Plan

### Files to create
- `remotion/src/scenes/LevelUpHookScene.tsx`
- `remotion/src/scenes/FitnessTestScene.tsx`
- `remotion/src/scenes/ProgressTrackerScene.tsx`
- `remotion/src/scenes/CoachFeedbackScene.tsx`
- `remotion/src/scenes/LevelUpCloseScene.tsx`
- `remotion/src/LevelUpVideo.tsx` — TransitionSeries with 5 scenes + fade/wipe transitions

### Files to update
- `remotion/src/Root.tsx` — Add `"level-up"` composition, 450 frames, 1080x1920
- `remotion/scripts/render-remotion.mjs` — Add `"level-up"` to output map

### Render
- `node scripts/render-remotion.mjs level-up` → `/mnt/documents/camino-level-up.mp4`
- 450 frames total, accounting for ~15-frame transition overlaps
- All animation via `useCurrentFrame()` + `interpolate()`/`spring()`

