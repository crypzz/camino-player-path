

# Camino Promotional Video Reel

## Creative Direction

**Vibe**: Luxury sports tech — dark, cinematic, gold accents. Think Nike Academy meets Bloomberg Terminal.

**Brand Palette** (from codebase):
- Background: `#0D0F14` (deep navy-black)
- Primary/Gold: `#E8B400` (from HSL 45, 100%, 58%)
- Card surface: `#141821`
- Muted text: `#6B7280`
- Success green: `#1DB870`
- Info blue: `#2B7FE8`
- Mental purple: `#8B3FCC`

**Typography**: Plus Jakarta Sans (display/headings) + Inter (body) — matching the app exactly.

**Motion style**: Cinematic Minimal — slow reveals, snappy springs for data, smooth wipes between scenes. Gold accent lines trace across frames.

**Visual motifs**: (1) Gold arc/ring echoing CPI score display, (2) horizontal gold lines as dividers/reveals, (3) subtle grid pattern in backgrounds.

**Emotional arc**: Mystery → Reveal → Power → Detail → Aspiration

---

## Scene Breakdown (~25 seconds, 750 frames at 30fps)

### Scene 1 — "The Hook" (0–4s, 120 frames)
- Dark screen, gold particles drift upward
- Camino logo fades in with scale spring
- Tagline types in: "The digital passport for elite player development"
- Gold arc sweeps across

### Scene 2 — "The Dashboard" (4–9s, 150 frames)
- Screenshot of Coach Dashboard slides in from right with parallax
- Key stats animate in as counters (23 metrics, 100 CPI range)
- Gold highlight scans across the screenshot

### Scene 3 — "The CPI Score" (9–14s, 150 frames)
- CPI ring animates from 0 to 73 (matching the app's visualization)
- Category labels spring in: Technical 7.5, Tactical 6.8, Physical 7.8, Mental 7.2
- Each in its brand color

### Scene 4 — "Multi-Role Access" (14–19s, 150 frames)
- Three panels slide in staggered: Coach / Player / Parent
- Icons and feature bullets cascade in
- Gold connecting line flows between panels

### Scene 5 — "The Close" (19–25s, 180 frames)
- "Camino" in large display type, slow scale
- Tagline fades in below
- Gold ring pulses once, then settles
- Logo mark resolves

---

## Technical Plan

### Assets
- `public/camino-logo.png` — copy from main project for logo scenes
- Screenshots captured earlier — copy the dashboard/CPI/roles screenshots into the video project's `public/images/`

### File Structure
```
/tmp/camino-video/
  tsconfig.json
  scripts/render.mjs
  src/
    index.ts
    Root.tsx
    MainVideo.tsx
    scenes/HookScene.tsx
    scenes/DashboardScene.tsx
    scenes/CPIScene.tsx
    scenes/RolesScene.tsx
    scenes/CloseScene.tsx
    components/GoldArc.tsx
    components/AnimatedCounter.tsx
  public/
    images/  (screenshots)
    camino-logo.png
```

### Rendering
- 1920×1080, 30fps, ~750 frames
- Programmatic render via `scripts/render.mjs`
- Output to `/mnt/documents/camino-promo.mp4`
- Muted (no audio in sandbox)
- Spot-check key frames before full render

