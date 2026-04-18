

## Plan: Cinematic 3D Landing Page Overhaul

Transform the landing page into an immersive, high-engagement experience inspired by PlayVision's cinematic AI aesthetic — every scroll triggers a "wow moment."

### Inspiration takeaways from PlayVision
- Dark cinematic hero with **silhouetted players + live tracking overlays** (bounding boxes, x/y coords)
- Big editorial typography ("AI Moneyball for Sports") with YC-style credibility tag
- Section-by-section **scroll-driven reveals** with massive numbers ("1 Million Data Points")
- Minimal palette, high contrast, lots of negative space + dramatic motion

### Engagement strategy: "Something happens every 2 seconds"
Every section will have a continuous motion loop OR a scroll-triggered animation so the eye never rests.

### Sections (top → bottom)

**1. Hero — 3D Tracked Player Field**
- Three.js `Canvas` with a 3D football pitch tilted in perspective
- Animated player nodes (glowing dots) moving in passing patterns
- Live AI tracking overlays (bounding boxes + "x: 1225 y: 252" coords) floating in 3D space
- Headline: **"Your progress, proven."** with kinetic text reveal (word-by-word stagger)
- CPI score counter ticking 0 → 87 on load
- Subtle parallax — mouse move tilts the pitch

**2. Live CPI Showcase — Floating Stat Cards**
- 3 floating glassmorphic player cards in 3D space, gently rotating
- Cards orbit slowly, react to mouse hover (tilt + glow)
- Shows real player + CPI score + radar chart preview

**3. "1 Number. 23 Metrics." — Big Stat Reveal**
- PlayVision-style massive typography
- Number "**100**" scales in with scroll (CPI max score)
- 23 metric chips orbit around it, each labeled (Pace, Vision, Finishing...)
- Continuous orbital animation

**4. Feature Pillars — 3D Card Stack**
- 6 features as 3D tilting cards (mouse-reactive, react-tilt style)
- Each card has its own micro-animation (icon morphs, line draws)
- Scroll-snap horizontal carousel on mobile

**5. "How It Works" — Animated Path**
- 3-step journey with an animated SVG line connecting them
- Numbers "01 / 02 / 03" rendered huge, in 3D depth
- Each step icon has a continuous pulse

**6. Live Leaderboard — Scrolling Ticker**
- Real rankings table + a **continuous marquee ticker** above it showing live CPI updates
- Rows fade-in on scroll with gold highlight pulse on top 3

**7. Roles — 4 Holographic Cards**
- Director, Coach, Player, Parent — each as a hologram-style card
- Cards float and gently rotate, responding to scroll direction

**8. Testimonials — Cinematic Quote Reveal**
- One quote at a time, full-screen, with letter-by-letter typing animation
- Auto-advances every 4s, big editorial type

**9. Final CTA — Particle Burst**
- Particle field (Three.js) that converges into the Camino logo as you scroll into view
- Big "Get Early Access" button with magnetic hover effect

### Tech stack additions
- `@react-three/fiber@^8.18` + `@react-three/drei@^9.122.0` + `three@^0.160` for 3D scenes
- Existing `framer-motion` for scroll-triggered reveals (`whileInView`, `useScroll`, `useTransform`)
- New components in `src/components/landing/`:
  - `Hero3DPitch.tsx` — Three.js pitch + tracked players
  - `FloatingPlayerCards.tsx` — orbiting 3D cards
  - `MetricOrbit.tsx` — 23 metrics orbiting "100"
  - `TiltCard.tsx` — mouse-reactive 3D card wrapper
  - `MagneticButton.tsx` — buttons that follow cursor
  - `ParticleBurst.tsx` — final CTA particles
  - `KineticHeadline.tsx` — word-stagger text reveals
  - `LiveTickerBar.tsx` — marquee of CPI updates

### Performance guardrails
- Lazy-load Three.js scenes with `React.Suspense`
- Cap pixel ratio at 1.5, `dpr={[1, 1.5]}`
- Pause 3D animation when section out of viewport (IntersectionObserver)
- Respect `prefers-reduced-motion` — fall back to static hero image

### Files
**New:**
- `src/components/landing/Hero3DPitch.tsx`
- `src/components/landing/FloatingPlayerCards.tsx`
- `src/components/landing/MetricOrbit.tsx`
- `src/components/landing/TiltCard.tsx`
- `src/components/landing/MagneticButton.tsx`
- `src/components/landing/ParticleBurst.tsx`
- `src/components/landing/KineticHeadline.tsx`
- `src/components/landing/LiveTickerBar.tsx`

**Edited:**
- `src/pages/LandingPage.tsx` — full restructure with new sections + 3D mounts
- `package.json` — add three, @react-three/fiber, @react-three/drei (pinned versions)
- `tailwind.config.ts` — add `marquee`, `float`, `tilt` keyframes

### Engagement checklist
- Word-stagger reveal in hero (every 100ms)
- 3D pitch always animating (passing patterns loop)
- Floating cards rotate continuously
- Metric orbit spins indefinitely
- Tilt cards react to every cursor move
- Marquee ticker scrolls forever
- Letter-by-letter testimonials
- Particle burst on final CTA
→ **Result:** something visually changing every <2s of scroll

