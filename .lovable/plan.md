
# Video Intelligence System — Implementation Plan

## Approach
Extend the existing video analysis system (upload, events, stats) rather than rebuilding. Add new capabilities in phases, each delivering working functionality.

---

## Phase 1: Processing Pipeline & Enhanced Data Model
**Database changes:**
- Add `status` column to `match_videos` (uploading → processing → ready → error)
- Add `age_group` column to `match_videos`
- Create `player_tracking` table (video_id, player_id, tracking_id, bounding_box JSON, frame_number, timestamp)
- Create `match_player_stats` table (video_id, player_id, movement_intensity, activity_score, estimated_touches, time_on_field, etc.)

**Code:**
- Update VideoUploadDialog to show processing status flow
- Add status badges on video cards
- Simulate async processing (edge function or client-side timer)

## Phase 2: Interactive Video Player with Overlay System
**Enhance existing VideoPlayer:**
- Frame-by-frame controls (←/→ single frame)
- Bounding box overlay layer (canvas on top of video)
- Player label overlays with toggle ON/OFF
- Click-to-tag: pause video, click on pitch area, assign player from roster
- Persist tracking data to `player_tracking` table

## Phase 3: Player Tracking & Tagging UI
- Roster sidebar showing team players
- Click video → draw bounding box → assign player
- Show existing tracking markers on timeline
- "AI Suggested" placeholder UI (future-ready badge, no real AI)
- Tracking ID management

## Phase 4: Stats Engine & Match Analytics Dashboard
- Calculate stats from tracking data (movement intensity from position changes, activity score, time on field)
- New `/match/:id/analytics` dashboard page with:
  - Player list with per-player stats
  - Bar charts (Recharts) for comparisons
  - "Most Active" / "Most Consistent" highlights
  - Pitch heatmap per player

## Phase 5: Player Profile Integration
- Push `match_player_stats` into player evaluation history
- Update CPI calculation to optionally weight video-derived stats
- Show match participation history on player profile
- Rankings reflect video-sourced data

## Phase 6: Polish & Optional Features
- Clip creation tool (select time range → export)
- Shareable player highlights
- "Top Moments" placeholder section
- Smooth transitions, loading skeletons, premium feel

---

## Permissions (applied throughout)
- Existing RLS already handles coach-owns-video pattern
- Player tracking inherits video ownership
- Match stats viewable by authenticated users, writable by video owner
- Directors see everything via `has_role` function

## Tech Decisions
- All new tables use existing RLS patterns
- Service abstraction via separate hooks (`useVideoTracking`, `useMatchStats`, `useVideoProcessing`)
- Canvas overlay for bounding boxes (no external library needed)
- Stats calculations in a dedicated `lib/videoStatsEngine.ts` module
- Edge function for simulated "processing" step

---

## What I'll build first
**Phase 1 + Phase 2** — the database foundation, processing pipeline, and enhanced video player with overlay system. This gives you a working, tangible upgrade immediately.

Shall I proceed?
