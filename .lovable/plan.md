## Problem

Right now the hero crams the full waitlist form (4 fields + submit) directly under the headline. Visitors see a sign-up wall before they understand what Camino actually does. We need to lead with **story and value**, then earn the signup further down — without losing the premium 3D feel, and adding more scroll-driven depth.

## Approach

Shift from "hero + form" to a **scrollytelling narrative**: a clean hero with a single CTA → progressive reveals that explain the platform → the form appears once the user is sold.

```text
[ HERO ]            Big headline + 1-line value + 2 CTA buttons (Join Waitlist / See How It Works)
   ↓                3D pitch behind, hero content fades+blurs out as you scroll
[ VALUE STRIP ]     3 pillars: Track · Rank · Get Seen (icons, fade-in on scroll)
   ↓
[ FOR WHO ]         4 cards: Players / Coaches / Parents / Directors — tilt + parallax
   ↓
[ RANKINGS ]        (existing, kept)
[ PROFILES ]        (existing, kept)
[ CPI DIAL ]        (existing, kept)
[ VIDEO INTEL ]     (existing, kept)
[ HOW IT WORKS ]    NEW — 3 steps: Upload → Analyze → Climb (sticky scroll, cards z-stack in)
[ FAQ ]             NEW — 5–6 collapsibles answering top objections
[ SOCIAL PROOF ]    (existing)
[ WAITLIST ]        Final CTA — full form here, with scarcity reinforcement
```

## What Changes

### 1. Hero — remove inline form
- Replace `<WaitlistForm variant="hero" />` with two buttons: a primary **"Join the Waitlist"** that smooth-scrolls to the bottom form, and a ghost **"See how it works"** that scrolls to the value strip.
- Keep `KineticHeadline`-style word-by-word reveal, scarcity chip, and the 3D pitch background.
- Add a **scroll-driven hero exit**: as the user scrolls the first viewport, hero content (headline + buttons) fades opacity 1→0, translates y 0→-60px, and applies `filter: blur(0→8px)` using `useScroll` + `useTransform`. The 3D pitch background fades to 0.2 opacity at the same time so the next section can breathe.

### 2. New: Value Strip (between Hero and Rankings)
- 3 columns: **Track every touch** · **Climb verified rankings** · **Get seen by the right people**.
- Each item: lucide icon in a primary-tinted square, short bold line, 1-sentence sub-copy.
- Stagger fade+rise on enter view (framer-motion `whileInView`).

### 3. New: "Who it's for" section (4 role cards)
- Cards for Player / Coach / Parent / Director.
- Reuse `TiltCard` component (already exists in `src/components/landing/`) for 3D mouse-tilt.
- Each card lists 3 bullet outcomes for that role. Subtle parallax: cards translate y based on scroll progress through the section.

### 4. New: "How it works" sticky scroll section
- A sticky left column ("01 · 02 · 03" step indicator that updates as you scroll) and a right column with 3 stacked step panels.
- Each panel scales/opacity-animates in as it enters, and the previous one fades+blurs out — the requested **disappearing-while-scrolling** effect.

### 5. New: FAQ
- Use existing `Accordion` ui component. 5–6 questions: "When does it launch?", "What does it cost?", "Do I need a coach to sign up?", "Is my data private?", "Which clubs are onboarding now?", "What devices does it work on?".

### 6. Final waitlist section (existing)
- Keep `<WaitlistForm variant="block" />` here. Add a small "100% free during early access · Calgary clubs first" reinforcement line above it.

### 7. Global scroll-disappearing effects
- Each major section gets a wrapper that uses `useScroll({ target, offset: ['start end', 'end start'] })` plus `useTransform` to drive `opacity` and `filter: blur(px)` on its content as it enters and exits the viewport. Sections fade in from blur(8px)→0 on enter, and fade out blur(0)→6px on exit. Respects `prefers-reduced-motion` (skip blur transforms when set).

### 8. TopNav
- Keep existing `Sign in` + `Join Waitlist` buttons unchanged.

## Files

**Edit**
- `src/pages/LandingPage.tsx` — restructure section order, swap hero form for CTA buttons, add hero scroll-exit transforms, mount new sections.

**Create**
- `src/components/landing/ValueStrip.tsx` — 3-column value props.
- `src/components/landing/RoleCards.tsx` — 4 tilt cards for Player/Coach/Parent/Director.
- `src/components/landing/HowItWorks.tsx` — sticky-scroll 3-step with disappearing transitions.
- `src/components/landing/FAQ.tsx` — accordion FAQ.
- `src/components/landing/ScrollReveal.tsx` — small reusable wrapper that applies the fade+blur in/out behavior to its children, used to wrap each major section.

**No changes**
- `WaitlistForm.tsx`, `Hero3DPitch.tsx`, `CPIDial.tsx`, `FloatingPlayerCards.tsx`, rankings/video/profiles sections — reused as-is.
- No DB or backend changes.

## Out of scope
- Copywriting polish beyond first-pass drafts (can iterate after).
- New illustrations/photography — uses existing icons + the 3D pitch + existing visual components.
