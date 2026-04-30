## Camino FollowCam — 30s Vertical Promo for X

A future-facing 30-second 9:16 video introducing **Camino FollowCam**: our upcoming autonomous sideline cameras that auto-follow play, stream straight to Camino servers, and unlock real-time half-time stats, post-game AI breakdowns, and a full **3D pitch replay** showing every player's position on every play.

### Hook angle
"The sideline just got a brain." Position FollowCam as the missing hardware layer that turns Camino from a video analysis app into an end-to-end matchday system — coaches walk off the pitch with stats already waiting, and a 3D replay of every phase.

### Tone
Cinematic tech-product reveal — think Apple keynote meets sports broadcast. Slower, weightier pacing than the hackathon promo (this is a product tease, not a hype reel). Marked **"COMING SOON"** so it reads as roadmap, not vapor.

### 8-scene structure (900 frames @ 30fps = 30s)

| # | Scene | Frames | Beat |
|---|---|---|---|
| 1 | **Hook** — black frame, single line types in: "What if the camera coached too?" Gold underline sweep | 90 | Curiosity hook |
| 2 | **Hardware reveal** — silhouette of FollowCam tripod rotates in from darkness, gold rim light, label "CAMINO FOLLOWCAM · COMING SOON" | 120 | Product unveil |
| 3 | **Auto-follow** — top-down pitch SVG, ball moves across pitch, camera-cone rotates and tracks it in real time, "AI auto-tracks every play" | 105 | What it does on the sideline |
| 4 | **Live stream to Camino** — animated upload arc from camera icon → cloud → phone mock showing live match feed with score + live stats ticker | 105 | Realtime pipeline |
| 5 | **Half-time stats drop** — phone mock fills with stat cards sliding in (Possession 62%, xG 1.4, Sprints 47, Distance 5.8km), stamp "HALF-TIME · LIVE" | 120 | The half-time payoff |
| 6 | **3D pitch replay** — isometric 3D pitch with 22 player dots animating through a phase of play, trails behind each, camera orbits slowly, label "3D REPLAY · EVERY PLAYER · EVERY PLAY" | 135 | The hero feature |
| 7 | **Coach POV** — split: tactics board on left ("Where was the LB on the 2nd goal?") → 3D replay answers it on right with one player highlighted in gold | 105 | Why coaches care |
| 8 | **CTA** — "FollowCam · Coming 2026" + caminodevelopment.com + @CaminoDev, gold gradient sweep | 120 | Sign-off |

### Visual & motion direction
- **Palette**: Deep Navy `#0A0C12` bg, Gold `#E8B400` primary, Cool Blue `#2B7FE8` accent, off-white `#F4F4F2` — matches existing Camino brand system
- **Typography**: Plus Jakarta Sans 800 (display), Inter 600 (UI/body) — same as launch & hackathon promos
- **Motion**: spring entrances (damping 18-22), slow 3-4s scene holds for product moments, snappy 8-frame cuts for stat reveals, slow camera orbit on 3D pitch
- **Hero motif**: the gold camera-cone (FOV triangle) — appears in scenes 2, 3, 6 as a recurring visual signature
- **3D pitch**: rendered with CSS 3D transforms (`perspective`, `rotateX(55deg)`, `rotateZ`) — pitch plane + player dots as positioned divs, trails as SVG paths. No Three.js needed; keeps render fast and on-brand with existing scene aesthetic.

### Technical implementation
- New composition `followcam-promo` (1080×1920, 900 frames, 30fps) registered in `remotion/src/Root.tsx`
- New `remotion/src/FollowCamVideo.tsx` orchestrating a `<Series>` of 8 scenes
- New scene files under `remotion/src/scenes/followcam/`:
  - `FCHookScene.tsx` — typewriter question
  - `FCHardwareRevealScene.tsx` — rotating tripod silhouette (SVG)
  - `FCAutoFollowScene.tsx` — top-down pitch + ball + tracking cone
  - `FCLiveStreamScene.tsx` — camera → cloud → phone pipeline
  - `FCHalfTimeStatsScene.tsx` — phone mock with sliding stat cards
  - `FC3DReplayScene.tsx` — CSS-3D isometric pitch with animated player dots & trails
  - `FCCoachPOVScene.tsx` — tactics board ↔ 3D replay split
  - `FCCTAScene.tsx` — Coming 2026 sign-off
- Add `followcam-promo → /mnt/documents/camino-followcam-promo.mp4` to `remotion/scripts/render-remotion.mjs` outputMap
- Render via existing pipeline: `node scripts/render-remotion.mjs followcam-promo`
- QA: pull stills at frames 45, 180, 320, 460, 600, 750, 870 to verify each beat, then deliver MP4

### Deliverable
`/mnt/documents/camino-followcam-promo.mp4` — 30s 1080×1920 H.264 MP4 ready for X, plus a suggested X caption to go with it.

### Out of scope
- No real photo-rendered camera hardware (pure SVG/CSS silhouette — we don't have product photos yet)
- No Three.js / WebGL 3D pitch (CSS 3D transforms keep render reliable in sandbox)
- No audio/voiceover (rendered muted, in line with existing promos)
