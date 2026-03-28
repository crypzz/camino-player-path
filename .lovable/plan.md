

# Vertical Instagram Launch Video — Camino

## Creative Direction

**Format**: 1080x1920 (9:16), 25 seconds, 750 frames @ 30fps

**Vibe**: Launch hype — fast-paced opening with bold Instagram-style text hooks, then transitions into polished app showcase. Think product launch announcement meets sports brand reveal.

**Brand Palette**: Same as existing — `#0D0F14` background, `#E8B400` gold, `#141821` card, `#1DB870` green, `#2B7FE8` blue, `#8B3FCC` purple.

**Typography**: Plus Jakarta Sans (bold display) + Inter (body). Large, punchy text fills for hooks.

**Motion**: Kinetic Energy for hooks (fast cuts, bold scale, snappy springs), Cinematic Minimal for app screens (smooth reveals, parallax slides).

## Scene Breakdown

### Scene 1 — "The Hook" (0–3s, 90 frames)
- Black screen. Gold text SLAMS in huge: **"Your players deserve better."**
- Text scales from 200% to 100% with a hard spring, slight shake
- Quick cut to black

### Scene 2 — "The Problem" (3–6s, 90 frames)
- Bold white text types/reveals: **"Spreadsheets. Guesswork. No visibility."**
- Each word strikes in staggered with red-ish tint, then wipes away
- Builds urgency

### Scene 3 — "The Reveal" (6–9s, 90 frames)
- Gold particles drift up, Camino logo springs in center
- Text below: **"Introducing Camino"**
- Gold arc sweeps across frame

### Scene 4 — "Dashboard Showcase" (9–14s, 150 frames)
- Screenshot of Coach Dashboard slides up with parallax
- Gold highlight scans across the screenshot
- Small label: "Complete player intelligence"

### Scene 5 — "CPI Score" (14–18s, 120 frames)
- Animated CPI ring 0→73 (SVG arc, no screenshot needed)
- Category labels spring in: TEC 7.5, TAC 6.8, PHY 7.8, MEN 7.2
- Label: "One score. Total clarity."

### Scene 6 — "App Screens Montage" (18–22s, 120 frames)
- Quick staggered reveals of 3 app screenshots (Evaluations, Progress, Attendance)
- Each slides in, pauses briefly, slides out for the next
- Vertical phone-frame mockup style

### Scene 7 — "The Close" (22–25s, 90 frames)
- "Camino" large display text, slow scale
- Tagline: "The digital passport for elite player development"
- Gold ring pulse, logo resolves

## Asset Strategy

- **App screenshots**: Captured programmatically during render using `bunx remotion still` of mock UI built as React components within scenes (no external screenshots needed — we'll build simplified mock UIs directly in the scene components using the brand styles)
- **Logo**: `public/camino-logo.png` (already exists)

## Technical Plan

### File Structure
```
remotion/
  tsconfig.json
  scripts/render-remotion.mjs
  src/
    index.ts
    Root.tsx              # 1080x1920, 30fps, 750 frames
    MainVideo.tsx         # TransitionSeries with 7 sequences
    scenes/
      HookScene.tsx       # "Your players deserve better"
      ProblemScene.tsx    # "Spreadsheets. Guesswork."
      RevealScene.tsx     # Logo reveal
      DashboardScene.tsx  # Mock dashboard UI
      CPIScene.tsx        # Animated CPI ring
      MontageScene.tsx    # App screen montage
      CloseScene.tsx      # Final branding
    components/
      GoldArc.tsx
      MockPhone.tsx       # Phone frame wrapper
```

### Steps
1. Scaffold Remotion project in `remotion/`, install deps, fix compositor
2. Build all 7 scene components with frame-based animations
3. Wire scenes in `MainVideo.tsx` with transitions
4. Spot-check key frames with `bunx remotion still`
5. Full render to `/mnt/documents/camino-vertical-ig.mp4`

### Key Details
- All animations via `useCurrentFrame()` + `interpolate()`/`spring()` — no CSS animations
- Hook scenes use oversized typography (80-120px) for Instagram impact
- Mock UI panels built as styled divs matching brand colors (no actual app imports)
- Muted render (no audio in sandbox)
- Output: `/mnt/documents/camino-vertical-ig.mp4`

