## The Video: "Camino Is Live" — 30-second launch promo

A 30-second 9:16 vertical Remotion video designed for Instagram Reels, TikTok, and YouTube Shorts. It's the launch announcement piece — it tells viewers what Camino *is*, why it matters, and where to go (caminodevelopment.com). Entertaining first, informative second, brand-locked throughout.

### Why this video (not a recut of existing ones)

Looking at the existing 14 Remotion compositions:
- **Main, PathToPro, LevelUp, Identity, GoPro, VideoAnalysis, AICoachReel** — each goes deep on one feature
- **Promo15 / CountdownTeaser / PreLaunchHype** — short teasers with no platform overview
- **AcademyPromo / ProfessionalPromo** — long-form, audience-specific, 1080p horizontal

There is no piece that does **"here's the whole platform in 30 seconds + we're live now + go to the URL."** That's the gap this fills.

### Creative direction

**Aesthetic:** Kinetic Energy meets Tech Product. Fast cuts, snappy springs, real UI moments, gold accent flashes. Serious sports-tech tone (per brand memory) — no game-y bounce, no neon. Feels like an Apple product launch crossed with a Nike drop.

**Palette (locked to brand):**
- Background `#0A0C12` (deep navy-black)
- Primary gold `#E8B400`
- Cool accent `#2B7FE8` (used sparingly for "live/data" moments)
- White `#FFFFFF` for type, muted whites for body

**Typography:** Plus Jakarta Sans 800 for display, Inter 500/600 for body. Already used across the project.

**Motion system:**
- Default entrance: spring-in from 8px below + opacity 0→1, damping 18 / stiffness 180
- Accent moments: scale punch 0.92 → 1.0 with slight overshoot
- Default transition between scenes: hard cut on the beat (no crossfade) for kinetic feel
- 2 special transitions: a vertical wipe into the dashboard reveal, a gold flash before the URL card

### 30-second structure (900 frames @ 30fps)

```text
Scene                    Frames   Time     Beat
──────────────────────── ──────   ──────   ────────────────────────
1. Hook / Question        0-75    0.0-2.5  "What if every player had proof?"
2. Problem flash         75-150   2.5-5.0  Stacked pain points (3 quick lines)
3. Reveal / logo lockup 150-240   5.0-8.0  Camino wordmark punches in
4. CPI dial counter     240-360   8.0-12.0 0 → 76 dial fill, "One score. 23 attributes."
5. Dashboard glance     360-510   12-17    Real UI mock — radar chart, video tag, leaderboard row
6. Roles montage        510-660   17-22    Coach / Player / Parent / Director — 4 quick cards
7. "We're live" stamp   660-780   22-26    Gold stamp drop + "Now open to clubs"
8. Domain card          780-900   26-30    caminodevelopment.com locked center, gold underline draw
```

Pacing logic: open punchy (sub-3s hook), build informational density in the middle (CPI + dashboard + roles do the educational work), then resolve to a single calm card with the URL so the viewer can read and remember it. The last 4 seconds are intentionally slower than the rest — that's where the domain has to land.

### What each scene shows

**1. Hook (`LaunchHookScene`)** — Black frame, single line of huge Plus Jakarta type animates in word-by-word: "What if every player had **proof**?" Word "proof" lands in gold with a 1-frame flash.

**2. Problem (`LaunchProblemStackScene`)** — Three lines stamp in fast, one per ~25 frames, each with a strikethrough animation: "Lost highlight reels." "Forgotten stats." "Coaches guessing." Tight, kinetic, no fluff.

**3. Reveal (`LaunchRevealScene`)** — Camino wordmark scales in from 1.4 → 1.0 with a gold underline drawing left-to-right via `strokeDashoffset`. Subtitle fades in: "The player development platform."

**4. CPI (`LaunchCPIScene`)** — Reuses the visual language of the existing `CPIDial` component but rebuilt for video. Animated dial fills 0 → 76 over 60 frames using `interpolate`. Caption appears on the right: "One score. 23 attributes. Verified."

**5. Dashboard glance (`LaunchDashboardScene`)** — Mock UI cards stagger in: a radar chart spinning into place (top), a tagged video frame with bounding box (middle), a leaderboard row with rank +3 animating (bottom). This is the "what does it actually look like" beat.

**6. Roles (`LaunchRolesScene`)** — 2x2 grid of role tiles snap in with 4-frame stagger: Coaches / Players / Parents / Directors. Each tile has icon + one-word value: "Track / Grow / Watch / Lead."

**7. Live stamp (`LaunchLiveStampScene`)** — Big gold "NOW LIVE" stamp drops with rotation (-8° → 0°) and a soft impact shake on the frame. Subtitle: "Open to clubs across North America."

**8. Domain card (`LaunchDomainScene`)** — Calm, centered. The URL `caminodevelopment.com` in large white type. Gold underline draws beneath it (reusing the underline motif from scene 3). Tiny line below in muted white: "Join the waitlist." Camino logo bottom-center. Holds for ~2 seconds so the viewer can read it.

### The domain (key requirement)

The closing scene shows **caminodevelopment.com** as the primary callout. That's the live custom domain already connected to the project (confirmed from project URLs). No "lovable.app" subdomain shown. The URL is the only thing on screen for the final ~2 seconds — no competing motion.

### File plan

```text
remotion/src/
  LaunchPromoVideo.tsx                   ← new composition root
  scenes/launch/
    LaunchHookScene.tsx
    LaunchProblemStackScene.tsx
    LaunchRevealScene.tsx
    LaunchCPIScene.tsx
    LaunchDashboardScene.tsx
    LaunchRolesScene.tsx
    LaunchLiveStampScene.tsx
    LaunchDomainScene.tsx
  Root.tsx                               ← register new composition id "launch-promo"
  scripts/render-remotion.mjs            ← add output mapping for "launch-promo"
```

Composition spec: `id="launch-promo"`, `durationInFrames={900}`, `fps={30}`, `width={1080}`, `height={1920}`.

### Render

Output to `/mnt/documents/camino-launch-promo.mp4` using the existing programmatic render script pattern (already proven across 14 prior compositions). Headless, muted (per sandbox ffmpeg constraint), single concurrency.

### What the user gets

- One new 30-second 9:16 MP4 ready for Reels/Shorts/TikTok
- Source TSX files committed under `remotion/src/scenes/launch/` so it can be re-rendered or tweaked later
- New composition id `launch-promo` registered alongside the existing 14
- Video QA'd via still-frame spot checks at scene boundaries before final render
