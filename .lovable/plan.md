

## Camino — 15s Hero Promo Video

A scroll-stopping 15-second vertical reel built to win the first 3 seconds. No feature dumps, no link cards — just identity, proof, and a closer that makes you want to know what Camino is.

### The Core Idea

Most promos fail because they explain. This one **provokes**. We open on a punch-in-the-face hook, prove the product exists with rapid-fire UI flashes, then land a brand stamp that lingers.

**Tagline arc:**
1. **0–3s** — "Your kid is the next big thing." *(skeptical pause)* "Prove it."
2. **3–9s** — Platform montage: CPI scores, rankings climbing, video tagging, parent reports — all real UI, all moving fast
3. **9–13s** — "Every player. Tracked. Ranked. Seen."
4. **13–15s** — CAMINO logo lockup with gold pulse. No URL.

### Why This Will Beat 5s Average View Time

- **Frame 0 = motion + bold type** (not a logo, not a fade-in)
- **Hook is a question the viewer answers in their head** ("...can you?")
- **Cuts every 0.6–1.2s** in the montage — algorithm-friendly pacing
- **Gold accent flashes** create micro-rewards that hold attention
- **Final logo arrives only after value is shown** — viewers stay to see "what is this?"

### Scene Breakdown (15s = 450 frames @ 30fps)

| # | Scene | Duration | Beat |
|---|-------|----------|------|
| 1 | **HookScene** | 90f (3s) | "Your kid is the next big thing." → "Prove it." Massive type, smash-in, gold underline on "Prove" |
| 2 | **ProofMontageScene** | 180f (6s) | Rapid-fire UI flashes: CPI dial spinning to 87, leaderboard row climbing rank, video clip with player tags, fitness test bars filling, parent report card sliding in. 5 cuts, ~36f each |
| 3 | **TaglineScene** | 90f (3s) | Three-word stamps: "TRACKED." "RANKED." "SEEN." Each smashes in with a frame of white flash. Gold on final word |
| 4 | **LogoCloseScene** | 90f (3s) | CAMINO wordmark, gold pulse ring, subtle tagline "The player development platform." Breathing motion. No URL. |

### Visual Direction

- **Aesthetic:** Cinematic Tech Product — dark navy `#0A0C12`, gold accent `#E8B400`, white `#FFFFFF`, muted grey `#8B92A3`
- **Type:** Plus Jakarta Sans 800 (display), Inter 600 (UI mocks). Massive scale, tight tracking
- **Motion language:** Smash-cuts with 2–3 frame white/gold flash transitions. Spring damping 10–12 for snap. No fades except logo close.
- **Motifs:** Gold underline reveals, scan lines, number count-ups, scale-from-0.4 on stat cards
- **Audio:** Muted (IG autoplay reality)

### File Structure

```text
remotion/src/
  CaminoPromo15.tsx              ← new composition wrapper
  scenes/promo15/
    Promo15HookScene.tsx         ← scene 1
    Promo15ProofScene.tsx        ← scene 2 (montage with 5 sub-beats)
    Promo15TaglineScene.tsx      ← scene 3
    Promo15CloseScene.tsx        ← scene 4
```

Plus:
- Register `camino-promo-15` composition in `remotion/src/Root.tsx` (450 frames, 30fps, 1080x1920)
- Add render entry to `remotion/scripts/render-remotion.mjs`
- Output: `/mnt/documents/camino-promo-15.mp4`

### Technical Notes

- All motion via `useCurrentFrame()` + `spring()`/`interpolate()` — no CSS transitions
- 2-frame white flash overlays at each montage cut for "edited" feel
- ProofScene uses 5 internal `Sequence` blocks with staggered entrances
- Reuse existing UI mock patterns from `DashboardScene` and `LeaderboardShowcaseScene` for the montage flashes (CPI dial, leaderboard rows, stat cards) — keeps brand consistency without rebuilding
- No "lovable.app" or any URL anywhere
- Logo close uses gold pulse ring + breathing scale, ends on a held frame so viewers can screenshot

### What I'm NOT Doing

- ❌ No website URL or "join waitlist" card
- ❌ No feature explanations ("AI coach", "video analysis", etc.) — those are for the dedicated reels
- ❌ No talking head or voiceover script
- ❌ No slow fade-ins — every cut is a smash
- ❌ No more than 4 scenes (tight = retainable)

