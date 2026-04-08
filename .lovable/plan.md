

# "Your Coaching Hub" — Video Analysis Feature Showcase (30s)

## Concept
A fast-paced product showcase that walks through Camino's new Video Analysis suite — upload, tag, timeline, stats, heat map — then teases the upcoming AI Analyzer. Feels like a tech product reveal: dark, clean, punchy. Positions Camino as the one-stop platform for player development.

## Creative Direction
- **Palette**: Navy-black `#0A0E1A` bg, gold `#E8B400` accent, `#2B7FE8` blue for UI elements, `#1DB870` green for stats, white text
- **Fonts**: Bebas Neue (display/headlines), Inter (body/UI labels) — consistent with existing videos
- **Motion**: Kinetic Energy — fast spring entrances, staggered reveals, screen shake on hero moments
- **Motifs**: Mock phone/tablet UI frames, timeline bars, pitch diagram SVG, glowing scan line for AI tease

## Scene Breakdown (8 scenes, 900 frames @ 30fps)

### Scene 1: Hook (0–3s, ~90 frames)
**"GAME FILM."** slams in large. Then below: **"FINALLY DONE RIGHT."**
Gold underline wipe. Establishes the video analysis context immediately.

### Scene 2: Upload Showcase (3–7s, ~120 frames)
Mock UI showing drag-and-drop upload zone. A progress bar fills from 0→100% with spring animation. File card appears with match metadata (team, date, opponent). Title: **"Upload. Organize. Analyze."**

### Scene 3: Timeline & Tagging (7–12s, ~150 frames)
Full-width timeline bar with colored event dots appearing one by one (staggered springs). Quick-tap event buttons flash: Touch, Pass, Shot, Goal. A player name dropdown appears. Shows the tagging workflow in motion. Subtitle: **"Tag every moment."**

### Scene 4: Pitch Mini-Map (12–16s, ~120 frames)
SVG soccer pitch slides in. Event dots appear on the field at various positions with glow effects — like the heat map feature. Dots pulse and accumulate. Title: **"See where it happens."**

### Scene 5: Stats Dashboard (16–20s, ~120 frames)
Stat cards fly in staggered: Touches 47, Passes 32, Goals 3, Tackles 12. A mini bar chart animates bars growing. Per-player breakdown. Title: **"Stats that write themselves."**

### Scene 6: Full Workspace (20–23s, ~90 frames)
Pull-back view showing the full workspace layout — video player on left, tabs on right (Events, Stats, Notes). Mock UI with populated data. Feels like looking at a real analytics tool. Title: **"One workspace. Everything."**

### Scene 7: AI Tease (23–27s, ~120 frames)
Screen goes darker. A scanning line sweeps across a pitch diagram or video frame. Glitch/pulse effect. Text fades in: **"AI MATCH ANALYZER"** then **"COMING SOON"** with a pulsing glow. Mystery and anticipation.

### Scene 8: Close (27–30s, ~90 frames)
**CAMINO** logo slam with gold glow. Tagline: **"Your complete player development platform."** Breathing scale effect.

## Files to Create (9)
1. `remotion/src/scenes/VAHookScene.tsx` — "Game Film. Finally Done Right."
2. `remotion/src/scenes/VAUploadScene.tsx` — Upload UI mock
3. `remotion/src/scenes/VATimelineScene.tsx` — Timeline + tagging showcase
4. `remotion/src/scenes/VAPitchMapScene.tsx` — Pitch heat map visualization
5. `remotion/src/scenes/VAStatsScene.tsx` — Stats dashboard montage
6. `remotion/src/scenes/VAWorkspaceScene.tsx` — Full workspace pull-back
7. `remotion/src/scenes/AITeaseScene.tsx` — AI Analyzer tease
8. `remotion/src/scenes/VACloseScene.tsx` — CAMINO close
9. `remotion/src/VideoAnalysisVideo.tsx` — TransitionSeries wiring

## Files to Update (2)
- `remotion/src/Root.tsx` — Add `"video-analysis"` composition (900 frames)
- `remotion/scripts/render-remotion.mjs` — Add output mapping

## Output
- Composition: `video-analysis`, 900 frames @ 30fps = 30s, 1080x1920 (vertical)
- Rendered to: `/mnt/documents/camino-video-analysis.mp4`

