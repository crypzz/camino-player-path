

## Camino — Bags Submission Demo Video (60s Hero Cut)

A submission-grade demo video for the Bags competition deadline (April 28). This is **not** another promo reel — it's a judge-facing product demo that proves Camino is real, working, and category-defining in 60 seconds.

### The Strategic Shift

Previous reels (15s promos, AI coach) optimized for **scroll retention**. This one optimizes for **judge conviction**. Judges watching submissions need to understand:

1. **What is it?** (5s)
2. **What problem does it solve?** (10s)
3. **Does it actually work?** (30s of real product)
4. **Why does it win?** (10s of traction + vision)
5. **What's next?** (5s roadmap stamp)

Different goal → different video. Longer, denser, more product-forward.

### Video Structure (60s = 1800 frames @ 30fps, 1920x1080 horizontal)

Horizontal 1080p — judges watch on desktop, not phones. Bigger canvas = more product surface area visible per frame.

| # | Scene | Duration | Beat |
|---|-------|----------|------|
| 1 | **ColdOpen** | 120f (4s) | Black screen → "100M kids play soccer." → "1 in 10,000 gets seen." Massive type, gold accent on "seen" |
| 2 | **ProblemFrame** | 150f (5s) | Split screen: messy spreadsheets / WhatsApp chaos / lost video files vs. the Camino logo emerging. "Academies run on chaos." |
| 3 | **ProductReveal** | 180f (6s) | Camino wordmark with tagline: "The player development platform." Subtitle: "One passport. Every player. Tracked from U8 to pro." |
| 4 | **CPIDemo** | 240f (8s) | Live CPI dial animating to 87, with the 4 pillar breakdown (Technical/Tactical/Physical/Mental) flying in. Caption: "CPI — one score across 23 attributes." |
| 5 | **VideoIntelDemo** | 240f (8s) | AI video tagging: pitch view with player tags appearing, scan line sweeping, event list populating on right. Caption: "AI video analysis. Every touch tagged." |
| 6 | **LeaderboardDemo** | 210f (7s) | Live ranking climb showing Sofia Chen rising to #1 across teams, with the formula stamp: "60% CPI · 20% consistency · 20% improvement" |
| 7 | **MultiRoleDemo** | 240f (8s) | 4-quadrant grid: Director dashboard / Coach view / Player profile / Parent report — all populated with real-feeling data, animating in sync |
| 8 | **TractionStamp** | 150f (5s) | Big numbers: "4 user roles · 23 attributes · AI-powered · Built on Lovable Cloud" with subtle count-up |
| 9 | **RoadmapTease** | 150f (5s) | Three-column tease: "Live · Beta Q2 · Native iOS Q3" with gold check-marks animating in |
| 10 | **CloseLogoStamp** | 120f (4s) | CAMINO wordmark, gold pulse, "The player development platform." Hold on final frame for screenshots |

Total: 1800 frames = 60s exactly.

### Why This Wins the Submission

- **Opens with a stat, not a logo** — judges scroll past logo intros
- **Shows real product UI** in 4 distinct demo scenes (CPI, video, leaderboard, multi-role) — proves it's built, not vapor
- **Names the unfair advantages** — proprietary CPI algorithm, AI video pipeline, multi-role architecture
- **Closes with traction + roadmap** — shows momentum and a credible 12-month vision
- **No URL, no waitlist CTA** — the X thread + Bags page handle conversion. The video does conviction.

### Visual Direction

- **Format**: 1920×1080 horizontal (judge desktop viewing)
- **Aesthetic**: Cinematic Tech Product — same dark navy `#0A0C12` + gold `#E8B400` system as existing promos for brand consistency
- **Type**: Plus Jakarta Sans 800 (display), Inter 500/600/700 (UI mocks)
- **Motion**: Reuse the established smash-cut + spring system from `Promo15ProofScene` and `DashboardScene`. White flash transitions between major sections, smooth springs within scenes.
- **Pacing**: Faster than typical product demos but slower than the 15s promo — judges need to read.

### File Structure

```text
remotion/src/
  CaminoBagsDemo.tsx                 ← new composition wrapper (1800f, 30fps, 1920x1080)
  scenes/bags/
    ColdOpenScene.tsx                ← scene 1: stat hook
    ProblemFrameScene.tsx            ← scene 2: chaos vs. order
    ProductRevealScene.tsx           ← scene 3: wordmark + tagline
    CPIDemoScene.tsx                 ← scene 4: CPI dial + pillars
    VideoIntelDemoScene.tsx          ← scene 5: AI pitch tagging
    LeaderboardDemoScene.tsx         ← scene 6: ranking climb + formula
    MultiRoleDemoScene.tsx           ← scene 7: 4-quadrant role grid
    TractionStampScene.tsx           ← scene 8: big numbers
    RoadmapTeaseScene.tsx            ← scene 9: live/beta/native
    CloseLogoScene.tsx               ← scene 10: final stamp
```

Plus:
- Register `camino-bags-demo` composition in `remotion/src/Root.tsx`
- Add render entry to `remotion/scripts/render-remotion.mjs`
- Output: `/mnt/documents/camino-bags-demo.mp4`

### Reuse Strategy (Speed + Consistency)

To hit the 7-day deadline cleanly, scenes 4-7 reuse motion patterns from existing files:
- **CPI dial** — adapt the `CPIBeat` component from `Promo15ProofScene.tsx`
- **Leaderboard climb** — adapt `LeaderboardBeat` from same file
- **Video tagging** — adapt `VideoTagBeat` from same file
- **Report card** — adapt `ReportBeat` from same file, refactored into the multi-role grid

This keeps brand fidelity tight and lets the new scenes (cold open, problem frame, traction stamp, roadmap, close) be the focus of new motion design work.

### Companion Deliverables (Generated After Video)

I'll also produce, alongside the MP4:

1. **X thread copy** (5–7 tweets) — hook → problem → product → traction → roadmap → ask, formatted to paste directly
2. **Bags app page caption** — short, judge-facing, links the X thread

Both delivered as text in chat after the render completes.

### What I'm NOT Doing

- ❌ No vertical 9:16 reformat — judges watch desktop
- ❌ No voiceover (silent autoplay realities apply on X too)
- ❌ No fictional traction numbers (no fake "10,000 users") — only verifiable claims
- ❌ No URL or "join waitlist" card in the video itself
- ❌ No new product features built for the demo — everything shown already exists in the codebase

### Technical Notes

- All motion via `useCurrentFrame()` + `spring()`/`interpolate()` — no CSS transitions
- 2-frame white flash overlays at major scene boundaries
- Each demo scene is a self-contained `<Series.Sequence>` with internal staggered entrances
- Final composition uses `<Series>` (not `<TransitionSeries>`) so durations sum cleanly to 1800f
- Render: programmatic `scripts/render-remotion.mjs` with `concurrency: 1`, `muted: true`, `chromeMode: "chrome-for-testing"` per sandbox rules

