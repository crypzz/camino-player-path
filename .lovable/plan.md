

# Video Analysis Feature — Manual Tagging (Hudl-Style)

## Overview
Replace the current static video gallery with a full video analysis workspace. Coaches upload match footage, tag events on a timeline (touches, passes, shots, fouls), link events to players, and view auto-calculated stats. Clean sports analytics UI with timeline scrubber, event markers, and a stats dashboard.

## Database Changes (3 new tables)

### `match_videos`
Stores uploaded video metadata.
- `id`, `created_by` (coach), `title`, `type` (match/training/highlight), `video_url` (storage path), `duration_seconds`, `thumbnail_url`, `match_date`, `team`, `opponent`, `notes`, `created_at`, `updated_at`

### `video_events`
Individual tagged events on the timeline.
- `id`, `video_id` (FK → match_videos), `player_id` (FK → players), `event_type` (touch/pass/shot/tackle/foul/save/goal/assist/cross/dribble/interception), `timestamp_seconds` (position in video), `x_position`, `y_position` (optional pitch coordinates 0-100), `notes`, `tagged_by`, `created_at`

### `video_annotations`
Free-form coach notes at specific timestamps.
- `id`, `video_id` (FK → match_videos), `timestamp_seconds`, `content`, `created_by`, `created_at`

RLS: Authenticated users can read all; only creators can insert/update/delete.

### Storage
Create a `match-videos` storage bucket (public: false) for video file uploads.

## New Components

### 1. `VideoAnalysisPage.tsx` (rewrite)
Two views:
- **Library view**: Grid of uploaded videos with upload button, filters by type/date/team
- **Analysis view**: Opens when clicking a video — full workspace

### 2. `VideoUploadDialog.tsx`
- Drag & drop zone with progress bar
- Fields: title, type, match date, team, opponent, notes
- Uploads to `match-videos` storage bucket
- Shows upload percentage via Supabase storage `onUploadProgress`

### 3. `VideoWorkspace.tsx` (main analysis view)
Layout (left-right split):
- **Left (70%)**: Video player + timeline scrubber + event markers
- **Right (30%)**: Tabbed panel — Events list, Stats dashboard, Annotations

### 4. `VideoPlayer.tsx`
- HTML5 `<video>` element with custom controls
- Play/pause, seek, playback speed (0.5x, 1x, 1.5x, 2x)
- Current time display
- Keyboard shortcuts (space = play/pause, arrow keys = ±5s)

### 5. `VideoTimeline.tsx`
- Horizontal timeline bar showing full video duration
- Colored event markers (dots) positioned by timestamp
- Color-coded by event type
- Click to seek, drag scrubber handle
- Zoom in/out on timeline sections

### 6. `EventTagger.tsx`
- Floating toolbar overlay on the video
- Quick-tap buttons for common events: Touch, Pass, Shot, Tackle, Goal
- Select player from dropdown before tagging
- Clicking a button creates an event at current playback time
- Optional: click on a pitch mini-map to set x/y position

### 7. `EventsList.tsx`
- Scrollable list of all tagged events for this video
- Shows: timestamp, event type icon, player name, notes
- Click to seek video to that moment
- Delete/edit events

### 8. `VideoStatsPanel.tsx`
- Aggregated stats from tagged events per player:
  - Touches (count of touch events)
  - Passes (count of pass events)
  - Shots / Goals / Assists
  - Tackles / Interceptions
- Bar chart or table format
- Filter by player
- "Link to profile" button to navigate to player page

### 9. `AnnotationsPanel.tsx`
- Add timestamped text notes
- Display as a scrollable list with seek-to-time

### 10. `PitchOverlay.tsx` (optional mini-map)
- Small soccer pitch diagram
- Click to mark event position
- Shows event distribution as a heat-style dot map

## Hooks
- `useMatchVideos()` — CRUD for match_videos table
- `useVideoEvents(videoId)` — CRUD for video_events, filtered by video
- `useVideoAnnotations(videoId)` — CRUD for annotations
- `useVideoStats(videoId)` — Derived stats aggregation from events

## File Structure
```
src/
  components/
    video/
      VideoUploadDialog.tsx
      VideoWorkspace.tsx
      VideoPlayer.tsx
      VideoTimeline.tsx
      EventTagger.tsx
      EventsList.tsx
      VideoStatsPanel.tsx
      AnnotationsPanel.tsx
      PitchOverlay.tsx
  hooks/
    useMatchVideos.ts
    useVideoEvents.ts
    useVideoAnnotations.ts
    useVideoStats.ts
  pages/
    VideoAnalysisPage.tsx (rewrite)
```

## UI Design
- Dark card backgrounds consistent with existing app theme
- Timeline uses primary color for scrubber, muted dots for events
- Event type color coding: green (goals/assists), blue (passes/touches), orange (shots), red (fouls/tackles)
- Stats panel uses small bar charts (Recharts) or clean stat cards
- Responsive: on mobile, workspace stacks vertically (video on top, tabs below)

## Route
No route changes needed — already at `/dashboard/videos`.

## Implementation Order
1. Database migration (3 tables + storage bucket)
2. Hooks (useMatchVideos, useVideoEvents, useVideoAnnotations, useVideoStats)
3. VideoUploadDialog + rewritten VideoAnalysisPage (library view)
4. VideoPlayer + VideoTimeline + EventTagger
5. VideoWorkspace (assembles player + timeline + panels)
6. EventsList + AnnotationsPanel + VideoStatsPanel
7. PitchOverlay (if time permits)

