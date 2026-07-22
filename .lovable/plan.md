
## Video: CMSA League Tracking Promo

**Format:** 9:16 vertical, 1080x1920, 30fps, ~28s (840 frames)
**Audience:** Calgary soccer community (coaches, players, parents)
**CTA:** "Log your match. Get on the leaderboard."
**Composition ID:** `cmsa-league-reel`

## Visual direction

Reuse Camino brand system from existing reels:
- Near-black navy `#0A0F1E`, gold accent `#FCD34D`, ivory text
- Plus Jakarta Sans display + Inter body
- Editorial motion: springs, staggered row reveals, subtle parallax
- Persistent grain + radial vignette layer

## Scene breakdown (28s / 840 frames @ 30fps)

```text
1. Hook            0.0s – 3.5s   (105f)
2. Standings       3.5s – 9.5s   (180f)
3. Top Scorers     9.5s – 14.5s  (150f)
4. Team Form       14.5s – 18.5s (120f)
5. Log Match UI    18.5s – 23.5s (150f)
6. CTA / Outro     23.5s – 28.0s (135f)
```

### 1. Hook — "Every CMSA game. One place."
Kinetic type on navy. Gold "CMSA" chip, headline springs in. Faint Calgary skyline silhouette.

### 2. Standings
Animated recreation of `CMSAStandingsTable`: tier header ("Tier 1 U15"), 6 rows cascade with rank icon, team name, GP/W/T/L/PTS/GD. Top 3 glow gold. Slow downward pan.

### 3. Top Scorers
Recreation of `TopScorersTable`: podium-style top 3 (gold/silver/bronze), rows 4–6 fade in. Goals numbers tick up. Subhead: "Real players. Real numbers."

### 4. Team Form
Grid of 4 teams with W/L/T pills for last 5 (from `TeamFormTable`). Streak flames pop on wins. Subhead: "Momentum, tracked."

### 5. Log Match Dialog
Mock of `LogMatchStatsDialog`: date, opponent, 3 player rows type in with goals/assists counters incrementing. "Log stats" button pulses gold. Subhead: "Coaches: 30 seconds to update."

### 6. CTA
Full-screen typography:
- "Log your match."
- Gold: "Get on the leaderboard."
- Camino wordmark + `@caminodevelopment` / `caminodevelopment.com`

## Motion system
- Entrance: spring `{damping: 18, stiffness: 140}` translate-Y + fade
- Row stagger: 4-frame delay per row
- Number ticks: `interpolate` easeOutCubic over 20f
- Between scenes: `TransitionSeries` fade (12f); slide-from-bottom for CTA
- Persistent grain + vignette outside TransitionSeries

## Files

**New**
- `remotion/src/CMSALeagueReel.tsx` — composition entry with persistent layer + TransitionSeries
- `remotion/src/scenes/cmsa/HookScene.tsx`
- `remotion/src/scenes/cmsa/StandingsScene.tsx`
- `remotion/src/scenes/cmsa/TopScorersScene.tsx`
- `remotion/src/scenes/cmsa/TeamFormScene.tsx`
- `remotion/src/scenes/cmsa/LogMatchScene.tsx`
- `remotion/src/scenes/cmsa/CTAScene.tsx`
- `remotion/src/scenes/cmsa/_shared.tsx` — brand token re-exports + mock team/scorer data + decorative SVG helpers

**Modified**
- `remotion/src/Root.tsx` — register `cmsa-league-reel` (1080x1920, 840f, 30fps)

## Rendering
Programmatic render via `scripts/render-remotion.mjs` pattern, muted, output to `/mnt/documents/cmsa-league-reel.mp4`.

## Out of scope
- No audio (silent reel, matches house style)
- No database or backend changes
- No modifications to actual CMSA pages/components
