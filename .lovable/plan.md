## Camino "All-In-One" Marketing Promo

A 30-second vertical (1080×1920, 30fps) Remotion promo that tells the **complete Camino story** — from the gap in player development to the full platform — layered over **cinematic AI-generated soccer photography** for a documentary-grade feel. No hackathon mention. Pure platform.

### Visual Direction

- **Aesthetic:** Cinematic editorial — deep navy `#0A0C12`, signal gold `#E8B400`, ivory `#F5F5F5`. AI photos sit beneath glassy UI overlays with film-grain feel.
- **Typography:** Plus Jakarta Sans 800 (display) + Inter 500 (body) — brand standard.
- **Motion system:** Slow camera-style parallax push on photos (Ken Burns), staggered spring entrances on overlays, hard cuts between beats with brief slide-wipes for momentum.
- **Imagery:** 8 generated stills via Lovable AI (Nano Banana Pro) — youth players, academy training, coach-on-touchline, stadium silhouette, close-up boots, tactical board, etc. Color-graded toward navy/gold.

### 30-Second Beat Sheet (900 frames)

```text
0:00–0:04  HOOK         "Talent is everywhere. Tracking it isn't."     (90f)
0:04–0:08  PROBLEM      Lost notes, group chats, faded memories.       (120f)
0:08–0:12  REVEAL       Camino logo + "The digital passport for soccer" (90f)
0:12–0:16  CPI          0→87 score animation on player photo            (120f)
0:16–0:20  DASHBOARD    Squad CPI cards floating over academy photo    (120f)
0:20–0:24  VIDEO AI     Pitch overlay + AI-tagged events on match shot (120f)
0:24–0:27  ROLES        4 quadrants: Player·Coach·Director·Parent      (90f)
0:27–0:30  CTA          Domain + tagline over stadium silhouette        (150f)
```

### Files

**New composition:**
- `remotion/src/AllInOnePromo.tsx` — main composition wiring scenes via `<Series>`.

**New scenes (`remotion/src/scenes/allinone/`):**
- `AIOHookScene.tsx` — Ken Burns photo + kinetic headline.
- `AIOProblemScene.tsx` — crossed-out icons (notebook, chat bubble, USB) over training photo.
- `AIORevealScene.tsx` — gold logo lockup, photo desaturates behind.
- `AIOCPIScene.tsx` — animated CPI dial counting 0→87 on portrait.
- `AIODashboardScene.tsx` — 3 floating CPI cards over academy photo with parallax.
- `AIOVideoAIScene.tsx` — match still + SVG bounding boxes + pitch mini-map dot pulse.
- `AIORolesScene.tsx` — 2×2 grid of role photos with labels.
- `AIOCTAScene.tsx` — stadium photo, tagline, `caminodevelopment.com`.

**Image generation:**
- `remotion/scripts/generate-aio-images.mjs` — calls Lovable AI Gateway (`google/gemini-3-pro-image-preview`) to produce 8 brand-graded photos into `remotion/public/aio/`:
  - `hook-crowd.jpg`, `problem-notes.jpg`, `reveal-portrait.jpg`, `cpi-portrait.jpg`, `dashboard-academy.jpg`, `videoai-match.jpg`, `roles-*.jpg` (×4 mini), `cta-stadium.jpg`.

**Edits:**
- `remotion/src/Root.tsx` — register `all-in-one-promo` (900f / 30fps / 1080×1920).
- `remotion/scripts/render-remotion.mjs` — add `"all-in-one-promo": "/mnt/documents/camino-all-in-one-promo.mp4"`.

### Technical Notes

- Photos loaded via `staticFile('aio/<name>.jpg')` and wrapped in `<Img>` with frame-driven `transform: scale()/translate()` for Ken Burns.
- Each photo gets a navy gradient overlay (`linear-gradient(180deg, rgba(10,12,18,0.4), rgba(10,12,18,0.85))`) for text legibility.
- UI overlays reuse glassmorphism tokens from existing scenes (`backgroundColor: rgba(20,24,33,0.85)`, `border: 1px solid rgba(232,180,0,0.3)`).
- No `backdropFilter` (sandbox crash risk) — use solid-with-alpha + subtle `filter: blur()` only on accent dots.
- Render via existing programmatic script: outputs to `/mnt/documents/camino-all-in-one-promo.mp4`.

### Out of Scope
- No voiceover/audio (rendered muted, per existing pipeline).
- No FollowCam content (covered separately).
- No hackathon references.

Approve and I'll generate the imagery, build the 8 scenes, register the composition, and render the MP4.