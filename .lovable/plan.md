

# Fix Video Tracking Overlays + AI Analyze UX

## Problems Found

**1. Bounding boxes are misaligned ("all over the place")**

The canvas scaling math double-counts the device pixel ratio. The `ResizeObserver` sets `canvas.width = cssWidth * dpr` and then calls `ctx.scale(dpr, dpr)`. But the `draw()` function computes `scaleX = canvas.width / 100` which equals `cssWidth * dpr / 100`. Since `ctx.scale(dpr)` is already applied, coordinates get multiplied by DPR twice, causing boxes to appear in wrong positions -- especially on Retina displays (2x).

**Fix**: Use CSS dimensions (`canvasSize.w / 100` and `canvasSize.h / 100`) instead of `canvas.width` for scaling, since the context already has the DPR transform applied.

**2. AI Analyze button gives no feedback or explanation**

The button just says "AI Analyze" with no context about what it does, what to expect, or what's happening during processing. No progress steps, no estimated time, no description of the output.

## Plan

### Step 1: Fix overlay coordinate scaling (VideoOverlayCanvas.tsx)

Replace the broken DPR-doubled scaling:
```
scaleX = canvas.width / (100 * dpr) * dpr  // simplifies to canvas.width/100 = cssW*dpr/100 -- WRONG
```
With correct CSS-based scaling:
```
scaleX = canvasSize.w / 100  // correct: percentage -> CSS pixels (ctx.scale handles DPR)
scaleY = canvasSize.h / 100
```

### Step 2: Improve AI Analyze button UX (VideoWorkspace.tsx)

- Add a tooltip/description below the button explaining what it does: "AI will detect players and track their positions across the video"
- During processing, show step-by-step progress text: "Downloading video...", "Detecting players...", "Saving results..."
- After completion, show a summary: "Found X players across Y timestamps"
- Add a small info section in the Tracking tab explaining what the AI detected and how to assign player names

### Step 3: Add processing detail panel

- When status is `processing` or `queued`, show a small card below the header with animated steps explaining what's happening
- Include estimated time ("Usually takes 30-60 seconds for short clips")

## Files Changed

| File | Change |
|------|--------|
| `src/components/video/VideoOverlayCanvas.tsx` | Fix scaleX/scaleY to use CSS dimensions |
| `src/components/video/VideoWorkspace.tsx` | Add AI analysis explanation, progress steps, completion summary |
| `src/components/video/ProcessingStatusBadge.tsx` | Add descriptive text for each status |

