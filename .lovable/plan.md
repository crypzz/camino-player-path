## 30s Teaser: "Every Spot Counts"

A 30-second vertical (9:16) teaser positioning Camino as the all-in-one home for clubs fighting for league spots. Uses the live CMSA standings we just wired up as the hook, then shows how Camino unifies standings, player development, and proof — all in one place.

### Narrative Arc (30s @ 30fps = 900 frames)

1. **Hook — "Every spot counts."** (0–4s / 120f)
   Tight standings table, top 4 teams highlighted, separated by 1–2 points. Gold pulse on the cut line.

2. **Tension — The grind is invisible.** (4–9s / 150f)
   Quick montage: scattered notebooks, group chat blur, lost video clips. "Your players grind. Nobody sees it."

3. **Reveal — One platform.** (9–13s / 120f)
   Gold sweep into Camino logo lockup. "Camino. All in one place."

4. **Proof stack — what's inside** (13–24s / 330f)
   Fast-cut UI showcase, 3 beats:
   - **Live Standings** (CMSA table animating in) — "Track every league, live."
   - **Player CPI + Profiles** (radar chart + player card) — "Score every player, fairly."
   - **Video + Verified Stats** (video frame with overlay) — "Prove every moment."

5. **Close — Climb your way up.** (24–30s / 180f)
   Standings table with a team rising from rank 6 → rank 2 with gold trail. End card: "camino. The path is yours." + waitlist URL.

### Visual System
- **Palette:** Navy `#0A0C12`, Gold `#E8B400`, Ivory `#F5F5F5` (existing brand)
- **Type:** Plus Jakarta Sans (display) + Inter (body) — already loaded in `_shared.tsx`
- **Motion:** Fast-cut kinetic with 1 hero gold-sweep transition. Reuse the `PhotoBG` Ken-Burns + `GoldChip` patterns from the All-In-One promo for consistency.
- **Aesthetic:** Sports-tech serious (per memory), high data density, glassmorphism on UI cards.

### Technical Plan

**New Remotion composition** registered as `every-spot-counts`:

```
remotion/src/EverySpotCountsPromo.tsx          (root composition wiring 5 scenes)
remotion/src/scenes/everyspot/
  ESCHookScene.tsx          (120f — standings table, top 4 highlight)
  ESCTensionScene.tsx       (150f — montage of "the gap")
  ESCRevealScene.tsx        (120f — gold sweep + logo)
  ESCProofScene.tsx         (330f — 3 sub-beats: standings / CPI / video)
  ESCCloseScene.tsx         (180f — team rising + end card)
  _shared.tsx               (re-export tokens from allinone/_shared)
```

**Reused assets:**
- `aio/problem-notes.jpg`, `aio/dashboard-academy.jpg`, `aio/videoai-match.jpg`, `aio/cpi-portrait.jpg`, `aio/cta-stadium.jpg` (already in `remotion/public/aio/`)

**Mock UI components built in-scene** (no real data fetch — Remotion is offline):
- Faux standings table styled to match `CMSAStandingsTable.tsx` (Navy rows, gold accent on rank 1, animated rank-up trail)
- Faux CPI radar (SVG polygon morphing from low → high)
- Faux video frame with bounding box + "VERIFIED" badge

**Wiring:**
- Add `<Composition id="every-spot-counts" component={EverySpotCountsPromo} durationInFrames={900} fps={30} width={1080} height={1920} />` to `remotion/src/Root.tsx`
- Add output mapping `"every-spot-counts": "/mnt/documents/camino-every-spot-counts.mp4"` to `remotion/scripts/render-remotion.mjs`
- Render via `node scripts/render-remotion.mjs every-spot-counts`

**QA:** Render 3 spot-check stills (frame 60, 450, 870) to verify hook, mid-proof, and close before full render.

### Deliverable
`/mnt/documents/camino-every-spot-counts.mp4` (~30s, 1080x1920, h264, muted)
