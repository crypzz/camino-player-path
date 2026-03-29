

# "Your Profile. Your Proof." — 30-Second Marketing Video

## Creative Direction

**Format**: 1080×1920 (vertical/IG Reels), 30 seconds, 900 frames @ 30fps
**Tone**: Aspirational, identity-driven. "You're not just playing — you're building a reputation."
**Palette**: `#0D0F14` bg, `#E8B400` gold, `#1DB870` green, `#2B7FE8` blue — same brand system
**Fonts**: Plus Jakarta Sans (display) + Inter (body) — matching existing videos
**Motion**: Kinetic Energy for hook, Cinematic Minimal for showcase moments

## Scene Breakdown (7 scenes, ~900 frames)

### Scene 1 — "Identity Hook" (0–4s, ~120 frames)
Three lines slam in with scale + shake (matching PlatformHookScene pattern):
- **"YOUR WORK."** (white)
- **"YOUR PROOF."** (white)
- **"YOUR IDENTITY."** (gold)
Pulsing gold ring behind. Fade out at end.

### Scene 2 — "Public Profile" (4–8s, ~130 frames)
Mock public profile card slides up — the centerpiece of new features:
- Player avatar circle, name "Sofia Chen", position/team
- Level badge: "GOLD · Level 7" with gold accent
- CPI score animating up to 76
- "Built on Camino" branding at bottom
- Label: **"Your profile. Always public."**

### Scene 3 — "Level System" (8–12s, ~130 frames)
Showcase the tier/leveling system:
- Five tier badges spring in staggered: Bronze → Silver → Gold → Platinum → Elite
- A progress bar fills from Level 6 to Level 7
- Gold particle burst on level-up
- Label: **"Every session. Every level."**

### Scene 4 — "Ranking Formula" (12–16s, ~130 frames)
Animated breakdown of the ranking score:
- Three bars fill in staggered:
  - CPI 60% (gold bar)
  - Consistency 20% (green bar)
  - Improvement 20% (blue bar)
- Combined score counter: 0 → 82
- Label: **"Ranked by what matters."**

### Scene 5 — "Stat Card Share" (16–20.5s, ~135 frames)
Shareable stat card springs in with rotation (reuse ShareBadge aesthetic):
- Mock stat card with player name, CPI, category scores
- Card tilts and "floats" with subtle sine motion
- Social icons appear: IG, Twitter/X, TikTok
- Label: **"Share your card. Build your brand."**

### Scene 6 — "Live Rankings" (20.5–25s, ~135 frames)
Top 5 leaderboard rows slide in from right (reuse LeaderboardShowcase pattern):
- Each row: rank medal/number, avatar, name, CPI score
- Highlight #1 row with gold glow
- Label: **"Climb the ranks. Get seen."**

### Scene 7 — "The Close" (25–30s, ~120 frames)
- "CAMINO" logo with breathing scale
- Tagline: **"Your progress. Proven."**
- Feature pills spring in: "Public Profiles · Levels · Rankings · Stat Cards"
- Converging gold particles

## Technical Plan

### Files to Create (7 new)
1. `remotion/src/scenes/IdentityHookScene.tsx` — Hook with 3 slam-in lines
2. `remotion/src/scenes/PublicProfileScene.tsx` — Mock profile card showcase
3. `remotion/src/scenes/LevelSystemScene.tsx` — Tier badges + level-up animation
4. `remotion/src/scenes/RankingFormulaScene.tsx` — 3-bar formula breakdown
5. `remotion/src/scenes/StatCardScene.tsx` — Shareable stat card floating
6. `remotion/src/scenes/LiveRankingsScene.tsx` — Top 5 leaderboard rows
7. `remotion/src/IdentityPromoVideo.tsx` — TransitionSeries wiring all 7 scenes

### Files to Update (2)
- `remotion/src/Root.tsx` — Add `"identity-promo"` composition, 900 frames, 1080×1920
- `remotion/scripts/render-remotion.mjs` — Add `"identity-promo"` to output map

### Rendering
- Composition: `identity-promo`, 900 frames @ 30fps = 30 seconds
- 6 transitions × 15 frames = 90 frames of overlap accounted for
- Output: `/mnt/documents/camino-identity-promo.mp4`

