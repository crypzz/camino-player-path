## Camino × Bags Hackathon — 30s Vertical Promo for X

A punchy, entertaining 30-second 9:16 video aimed at X (Twitter) announcing Camino's entry into **The Bags Hackathon** ($4M fund / $1M in grants to 100 teams). Built in Remotion, matching the existing Camino brand system (Deep Navy, Gold, Plus Jakarta Sans / Inter, sports-tech aesthetic).

### Hook angle
"Real tech. Real traction. Real athletes." — frame Camino as the perfect Bags hackathon entry: shipping product, real users (academies, coaches, players), and onchain-ready growth trajectory.

### 8-scene structure (900 frames @ 30fps = 30s)

| # | Scene | Frames | Beat |
|---|---|---|---|
| 1 | **Hook** — "$4,000,000." giant gold number slams in, stacks reveal "100 teams. 1 mission." | 75 | Grab attention with the prize |
| 2 | **Bags × Camino lockup** — "Camino is entering The Bags Hackathon" with Bags wordmark + Camino mark colliding | 90 | Establish the matchup |
| 3 | **The pitch** — "We built the digital passport for soccer." Animated player card + CPI score dial | 105 | What Camino is, fast |
| 4 | **Real product montage** — quick UI flashes (dashboard, AI video analysis pitch overlay, leaderboard, coach feedback) with snappy cuts | 120 | "Built good tech" proof |
| 5 | **Real traction** — animated counters (Players · Academies · Videos analyzed · Countries) ticking up, "Growth trajectory ↗" | 105 | Match Bags' selection criteria language |
| 6 | **Why we win** — three stamps slam in: "Real product · Real users · Real growth" | 90 | Echo hackathon judging criteria |
| 7 | **Live stamp** — "LIVE NOW" diagonal stamp with caminodevelopment.com domain card | 90 | Drives the click |
| 8 | **CTA / handle** — "@CaminoDev × @bagsapp · #BagsHackathon" final lockup over animated gold gradient | 75 | Social-native sign-off |

### Visual & motion direction
- **Palette**: Deep Navy `#0A0C12` bg, Gold `#F2C75A` primary, Cool Accent `#5AB7F2`, off-white `#F4F4F2`
- **Typography**: Plus Jakarta Sans Bold for kinetic display; Inter for body/UI mocks
- **Motion**: spring-in entrances (damping 18), snappy 6-frame cuts between proof beats in scene 4, slow zoom on hook + final stamp for cinematic punch
- **Motifs**: gold underline sweep, stamp slams (rotation + overshoot), counter rolls, glassmorphism UI cards reused from existing launch scenes

### Technical implementation
- New composition `bags-hackathon-promo` (1080×1920, 900 frames, 30fps) registered in `remotion/src/Root.tsx`
- New `remotion/src/BagsHackathonVideo.tsx` orchestrating a `<Series>` of 8 scenes
- New scene files under `remotion/src/scenes/bags/`:
  - `BagsHookScene.tsx`, `BagsLockupScene.tsx`, `BagsPitchScene.tsx`, `BagsProductMontageScene.tsx`, `BagsTractionScene.tsx`, `BagsCriteriaScene.tsx`, `BagsLiveScene.tsx`, `BagsCtaScene.tsx`
- Add `bags-hackathon-promo → /mnt/documents/camino-bags-hackathon-promo.mp4` to `remotion/scripts/render-remotion.mjs` outputMap
- Render headlessly via existing pipeline (`node scripts/render-remotion.mjs bags-hackathon-promo`)
- QA: pull stills at frames 30, 200, 450, 700, 870 to verify each beat before delivering

### Deliverable
`/mnt/documents/camino-bags-hackathon-promo.mp4` — a 30s 1080×1920 H.264 MP4 ready to upload directly to X.
