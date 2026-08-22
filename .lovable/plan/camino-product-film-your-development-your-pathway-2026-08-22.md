# Camino Product Film — "Your development. Your pathway."

A 38-second vertical (1080x1920, 30fps, 1140 frames) Remotion film where the **UI is the hero**: a raw game clip transforms into data, highlights, feedback, and a living player development record. With original synthesized score, sound design, and AI voiceover.

New composition id: `camino-pathway` (all existing reels untouched).

## Story beats

```text
1. The problem        0:00 – 0:04   (120f)
2. Meet Camino        0:04 – 0:09   (150f)
3. Upload + AI        0:09 – 0:17   (240f)
4. Feedback           0:17 – 0:25   (240f)
5. Live development   0:25 – 0:32   (210f)
6. Big ending         0:32 – 0:38   (180f)
```

### 1. The problem
Desaturated raw footage frame, scattered artifacts drifting past — a paper attendance sheet, a coach text bubble, a lone stat scrap. Type: "Players are constantly developing." / gold: "But most of it isn't being tracked." Everything fades to noise.

### 2. Meet Camino
Dark grid snaps into a dashboard that assembles panel by panel (CPI dial, squad list, recent sessions) — the UI literally booting. "Meet Camino. A live development platform for players and coaches."

### 3. Upload + AI (longest UI beat)
Three-step transformation in one continuous shot:
- Upload card with progress bar filling
- Video frame with AI bounding boxes locking onto players, jersey numbers resolving, confidence ticks
- Tagged events streaming into a timeline, then highlight thumbnails popping into a grid
Caption: "Upload your footage. Camino's AI identifies players, tags key moments, builds highlights."

### 4. Feedback
Split UI: coach feedback card typing itself in, strengths/weaknesses bars filling (green/amber), radar chart drawing, key-moment chips. "Every game becomes actionable feedback."

### 5. Live development
Player profile: CPI progression line drawing left to right with a number ticking up, level badge advancing, a vertical timeline of match entries scrolling. "See what's improving. See what needs work. See the path forward."

### 6. Big ending
Hard cut to near-black. "Don't just play the game." / gold: "Track your development." → CAMINO wordmark → "Your development. Your pathway." + caminodevelopment.com

## Audio

- **Voiceover**: narration script generated per-scene through the Lovable AI text-to-speech endpoint (`openai/gpt-4o-mini-tts`, calm confident delivery), rendered to WAV files in `remotion/public/audio/vo/`, placed with `<Audio>` inside each scene sequence so lines land on their beats.
- **Score**: original synthesized bed built with a Python/numpy script — sub-bass pulse, filtered pad chords rising through the acts, percussive ticks on the AI-tagging beat, riser into the ending, tail-out on the wordmark. Written to `remotion/public/audio/score.wav`.
- **Sound design**: soft whooshes on scene transitions, UI clicks on panel snaps, a low impact on the final cut — synthesized in the same script, mixed into one stem.
- Music ducks under each voiceover line so narration stays clear.
- Final render is **not muted**: video renders silent first, then the score + VO stems are mixed and muxed to AAC with ffmpeg.

## Motion system

- Entrance: spring `{damping: 20, stiffness: 140}`, translate-Y + fade + slight blur-off
- UI panels snap in on a 5-frame stagger; data fills use easeOutCubic over 24f
- Scene changes: `TransitionSeries` — fast wipe for act changes, fade into the ending
- Persistent layers outside the series: film grain, radial vignette, subtle scanline drift

## Files

**New**
- `remotion/src/CaminoPathway.tsx` — composition root, persistent layers, `TransitionSeries`, audio tracks
- `remotion/src/scenes/pathway/_shared.tsx` — brand tokens, UI primitives (Panel, StatBar, Chip, CountUp, TypeOn)
- `remotion/src/scenes/pathway/ProblemScene.tsx`
- `remotion/src/scenes/pathway/DashboardScene.tsx`
- `remotion/src/scenes/pathway/UploadAIScene.tsx`
- `remotion/src/scenes/pathway/FeedbackScene.tsx`
- `remotion/src/scenes/pathway/DevelopmentScene.tsx`
- `remotion/src/scenes/pathway/EndingScene.tsx`
- `remotion/scripts/make-audio.py` — synthesizes score + SFX stem
- `remotion/scripts/make-vo.sh` — generates voiceover WAVs via the AI gateway TTS endpoint
- `remotion/scripts/render-pathway.mjs` — programmatic render, then ffmpeg mux of audio

**Modified**
- `remotion/src/Root.tsx` — register `camino-pathway` (1080x1920, 1140f, 30fps)

## Technical notes

- Brand: near-black `#0A0C12`, gold `#FCD34D`/`#E8B400`, ivory `#F5F5F5`; Plus Jakarta Sans display + Inter body (matches existing reels).
- Every mock UI is drawn in Remotion (no screen recordings) so it stays perfectly on-brand, per the existing promo architecture.
- Render pipeline: `renderMedia` with `chromeMode: "chrome-for-testing"`, concurrency 1, no `backdropFilter`; then `ffmpeg -c:a aac` to attach the mixed audio.
- Frame spot-checks with `remotion still` at key beats before the full render.
- Final MP4 delivered to `/mnt/documents/camino-pathway.mp4` and copied into `remotion/public/`.

## Out of scope
- No app code, database, or backend changes — this is a video build only.
- No real match footage; all visuals are designed motion graphics.
