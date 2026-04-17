
## Plan: "One App To Rule Them All" — Viral IG Reel

A 9:16 vertical Remotion video (~25s) that positions Camino as the single replacement for Veo, TeamSnap, Hudl, and spreadsheets. Designed to feel like a punchy TikTok/Reel: fast cuts, big type, satisfying "delete" moments, and a strong payoff.

### Concept & Hook
**Hook (0-3s):** "Your club is paying for 4 apps. Here's why you only need 1."
**Build (3-15s):** Show each competitor app card slamming in → get stamped "REPLACED BY CAMINO" → swipe off screen
**Payoff (15-22s):** All 4 logos collapse into the Camino logo → quick montage of Camino features that replace each one
**CTA (22-25s):** "One app. Everything your club needs." + handle

### Apps to Compare
- **Veo** → Camino's Video Analysis (AI tagging, highlights, match footage)
- **TeamSnap** → Camino's Communication Hub + Schedule + Attendance
- **Hudl** → Camino's Video Intelligence + Player Profiles
- **Spreadsheets/WhatsApp** → Camino's CPI tracking + structured dashboards

### Visual Direction
- **Aesthetic:** Kinetic Energy — fast cuts, bold type, snappy springs, high contrast
- **Palette:** Camino dark navy `#0D1117` + gold `#E8B400` + alert red `#DC2626` for "REPLACED" stamps + white text
- **Type:** Plus Jakarta Sans 800 (display) + Inter 600 (body) — matches existing brand
- **Motion motifs:**
  - Competitor cards slam in with shake → red "REPLACED" stamp rotates in → card fades/slides off
  - Payoff: 4 logos magnet-pull into center → morph into Camino logo with gold burst
- **Format:** 1080x1920 vertical (IG Reel native), 30fps, ~750 frames (25s)

### Scene Breakdown
| # | Duration | Scene | Beat |
|---|---|---|---|
| 1 | 90f (3s) | `ReelHookScene` | "Your club pays for 4 apps?" — punchy text reveal with money emoji counter |
| 2 | 110f | `ReplaceVeoScene` | Veo card slams in → "REPLACED" stamp → Camino video UI mock slides up |
| 3 | 110f | `ReplaceTeamSnapScene` | TeamSnap card → "REPLACED" → Camino comms/schedule mock |
| 4 | 110f | `ReplaceHudlScene` | Hudl card → "REPLACED" → Camino player profile mock |
| 5 | 90f | `ReplaceSpreadsheetScene` | Excel/WhatsApp → "REPLACED" → Camino CPI dashboard |
| 6 | 130f | `MergeScene` | All 4 logos pull into center, burst into Camino logo |
| 7 | 110f | `ReelCTAScene` | "One app. Everything." + URL + tagline |

Total: ~750 frames = 25s (accounting for transition overlaps)

### Technical Plan
**New files in `remotion/`:**
- `src/ReelComparisonVideo.tsx` — composition wrapper with TransitionSeries (fast cuts, ~10f fade transitions)
- `src/scenes/reel/ReelHookScene.tsx`
- `src/scenes/reel/ReplaceVeoScene.tsx`
- `src/scenes/reel/ReplaceTeamSnapScene.tsx`
- `src/scenes/reel/ReplaceHudlScene.tsx`
- `src/scenes/reel/ReplaceSpreadsheetScene.tsx`
- `src/scenes/reel/MergeScene.tsx`
- `src/scenes/reel/ReelCTAScene.tsx`

**Edited files:**
- `remotion/src/Root.tsx` — register new `reel-comparison` composition (1080x1920, 30fps, 750 frames)
- `remotion/scripts/render-remotion.mjs` — add output mapping for `reel-comparison` → `/mnt/documents/camino-reel-comparison.mp4`

**Reusable scene template:** Each "Replace[App]" scene follows identical structure (slam-in card → red stamp → Camino mock reveal) for visual consistency — only logo/color/mock content differs. This is the rhythm that makes it feel viral.

**Render:** `cd remotion && node scripts/render-remotion.mjs reel-comparison` → outputs MP4 to `/mnt/documents/`

### Viral Mechanics Built In
1. **Hook in first 1.5s** — "Your club pays for 4 apps?" creates instant curiosity
2. **Repetitive satisfying pattern** — 4× "REPLACED" stamps train the viewer to anticipate the next reveal
3. **Payoff moment** — 4 logos merging into 1 is the dopamine hit
4. **Loop-friendly** — final CTA frame visually echoes the hook so it loops cleanly on IG
5. **Mute-friendly** — readable with sound off (huge text, visual storytelling)

### Caption (delivered with the video)
A short, punchy IG caption + 3 hashtags for the user to copy/paste.
