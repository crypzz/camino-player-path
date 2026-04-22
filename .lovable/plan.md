

## Make the Homepage Feel Like a $100M Sports Company

The page already has the right information — what's missing is the **finish**. Right now it reads as "many good sections stacked." Top-tier sports tech (Whoop, Catapult, StatsBomb, Strava Pro) reads as **one continuous cinematic narrative** with obsessive detail, real product surfaces, and zero filler.

This plan keeps every existing section and piece of info — and rebuilds the *feel* across 8 targeted upgrades.

### The 8 Upgrades

#### 1. Cinematic Hero — show the product, not decoration
Replace the floating "P-07 / P-22" tracking labels with a **realistic product window** floating beside the headline: a mini live CPI dashboard (player avatar, 87 score dial, 4 pillar bars, micro-sparkline, "Verified by Coach" stamp). Add a thin gold scan-line sweeping across it every 6s. The 3D pitch stays as ambient backdrop but gets a darker vignette so the product reads first.

#### 2. Premium typography system
Switch display font from `Outfit` to **`Inter Display` / keep `Plus Jakarta Sans` but tighten everything**: kerning `-0.04em` on H1s, `-0.025em` on H2s, introduce a **serif accent font (`Instrument Serif` italic)** for one signature word per section ("*proven.*", "*live.*", "*passport.*") — this is the single move that makes premium sites feel premium (Linear, Vercel, Arc, Whoop all do this).

#### 3. Section transitions — kill the "card wall"
Remove the repeated `border-t border-border/40` between sections. Replace with **continuous gradient washes** and a single persistent vertical gold rail on the left edge with section progress dots — gives the whole scroll a unified spine like a product tour.

#### 4. Stat Spine — replace the 3-stat row with a hero metrics strip
Build a full-width sticky **"Live Metrics Bar"** that appears after hero scroll: shows real rolling counters (Players Tracked · Evaluations Logged · Videos Analyzed · Avg CPI Gain) with subtle micro-charts and a green pulse. Disappears when waitlist is in view. Feels like a live ops dashboard.

#### 5. Product Showcase Reel — new section between Floating Cards and CPI
A **3-frame mock product carousel** that auto-advances every 4s: (a) Coach evaluation panel with radar chart filling, (b) Video analysis with pitch overlay + tagged events, (c) Director leaderboard with row climbing. Real component-level fidelity, not screenshots. Subtle browser chrome around it (rounded window, traffic-light dots, faint URL pill saying "camino · live"). This is the single biggest "looks real" upgrade.

#### 6. CPI section — turn it into a signature moment
Replace the orbit-only treatment with a **giant centered CPI dial (animated 0→87 on viewport)** with the 4 pillars splaying out as labeled spokes, each with their weight and a 6-month sparkline. Surrounded by faint engraved circular type ("CAMINO PLAYER INDEX · 23 METRICS · LIVE"). This becomes the "screenshot moment" of the page.

#### 7. Logo wall + press-style trust strip
Add a subtle **"Built for the next generation of academies"** strip with 6 placeholder club crests rendered as monochrome gold-on-dark badges (we'll use lucide shield icons styled as crests with U-12 / U-14 / U-16 / U-18 labels until real partners). Sits between Roles and Testimonials — the move every premium B2B site uses to signal seriousness.

#### 8. Footer — actually finish the page
Current footer is one line. Build a real 4-column footer: Platform · Roles · Resources · Company, with the Camino wordmark large, a tagline, social/contact, copyright, and a thin gold underline. This single change makes the site stop feeling like a deck and start feeling like a company.

### Bonus polish (small but high-impact)

- **Cursor**: add a custom cursor-follower gold dot (12px, mix-blend-difference) on desktop only — instantly elevates feel
- **Section labels**: replace "Verified Performance" / "Platform" eyebrow text with **numbered chapters** (`01 — IDENTITY`, `02 — INDEX`, `03 — INTELLIGENCE`, `04 — INFRASTRUCTURE`) — editorial sports-magazine vibe
- **Buttons**: primary CTAs get a **subtle inner-glow gradient + 1px gold border + soft drop-shadow** so they look minted, not flat
- **Noise overlay**: 2% film-grain SVG over the whole page — kills the "flat web" look
- **Reduced motion**: all new animations respect `prefers-reduced-motion`

### What I am NOT changing

- ❌ No copy rewrites — taglines, features, steps, testimonials all stay
- ❌ No new routes or dependencies
- ❌ Leaderboard data, waitlist form, role cards data — all unchanged
- ❌ Mobile fallback hero stays (with same upgrades scaled down)
- ❌ Color palette stays (navy + gold + the existing semantic tokens)

### File Structure

```text
src/components/landing/
  HeroProductWindow.tsx         ← new: floating live CPI mock for hero
  LiveMetricsBar.tsx            ← new: sticky scroll-revealed metrics strip
  ProductShowcaseReel.tsx       ← new: 3-frame auto-advancing product mock
  CPIDial.tsx                   ← new: signature animated CPI dial w/ pillars
  ClubCrestWall.tsx             ← new: gold-on-dark trust strip
  SiteFooter.tsx                ← new: 4-column premium footer
  ChapterLabel.tsx              ← new: editorial numbered section eyebrow
  CursorFollower.tsx            ← new: desktop gold-dot cursor
  SerifAccent.tsx               ← new: tiny wrapper for italic signature words

src/pages/LandingPage.tsx       ← integrate above, remove section borders, restructure flow
src/index.css                   ← add Instrument Serif import, noise overlay, refined type tokens
tailwind.config.ts              ← add `serif: ['Instrument Serif']`, noise utility
```

### Final Section Order (after upgrades)

```text
NAV (unchanged)
HERO + Product Window (new) + 3D pitch backdrop
LIVE METRICS BAR (new, sticky-on-scroll)
LiveTickerBar (unchanged)
01 — IDENTITY: Floating Player Cards
02 — SHOWCASE: Product Showcase Reel (new)
03 — INDEX: Signature CPI Dial section (rebuilt)
04 — RANKINGS: Live leaderboard
05 — INTELLIGENCE: Feature tilt cards
06 — FLOW: How it works
07 — INFRASTRUCTURE: Roles
08 — TRUST: Club Crest Wall (new)
09 — VOICES: Testimonials
WAITLIST
FINAL CTA (Particle Burst)
SITE FOOTER (new, 4-column)
```

### Risk / Performance

- All new components are pure React + Tailwind + framer-motion (already installed) — no new deps
- Hero product window is a static mock, no extra Three.js cost
- Showcase reel is CSS/SVG only, sub-1KB JS
- Cursor follower is desktop-only behind `useIsMobile` guard
- All sections respect `prefers-reduced-motion`

