
# Communication Hub — Implementation Plan

## Phase 1: Database Foundation
Create 5 new tables with RLS:
- **announcements** — title, content, target_type (club/team/players/parents), target_team_id, pinned, created_by
- **announcement_reads** — tracks seen/unseen per user
- **conversations** — type (team_chat/direct), team_id, participants metadata
- **messages** — conversation_id, sender_id, content, read status
- **player_feedback** — player_id, coach_id, strengths, improvements, notes (structured dev log)
- **notifications** — user_id, type, reference_id, read, title, body

RLS: role-based access using existing `has_role()` + team/player ownership checks.

## Phase 2: Core UI — Communication Hub Page
- New route `/dashboard/communications` added to sidebar for all roles
- Tabbed layout: **Announcements | Messages | Team Chat | Feedback**
- Each tab filters content by user role

## Phase 3: Announcements System
- Director/Coach can create announcements (title + body + target audience)
- Pin support, read receipts (seen/unseen badges)
- Players/Parents see filtered announcements for their team

## Phase 4: Team Chat
- One conversation per team (auto-created or on-demand)
- Real-time via Supabase Realtime
- Messages grouped by date, clean WhatsApp-style UI
- Coach admin controls placeholder

## Phase 5: Direct Messaging
- 1-on-1 conversations: Coach↔Player, Coach↔Parent, Director↔Coach
- New conversation dialog with role-filtered user list
- Thread view with timestamps

## Phase 6: Player Feedback System
- Structured feedback form (Strengths / Areas to Improve / Notes)
- Feedback history timeline on player profile
- Visible to player + parent

## Phase 7: Notifications
- Notification bell with unread count badge (already in header)
- Notifications table populated on new message/announcement/feedback
- Dropdown panel showing recent notifications

## Tech Decisions
- Realtime: `supabase_realtime` publication on messages table
- All colors via design tokens, dark theme consistent
- Search/filter on messages and announcements
- Existing sidebar navigation extended per role
