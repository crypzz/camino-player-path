
# Club Director Admin Dashboard

## Phase 1: Database Schema (Migration)

### New tables:
1. **`teams`** — `id`, `name`, `club_name`, `age_group`, `created_by` (director user_id), `created_at`, `updated_at`
2. **`coach_assignments`** — `id`, `team_id` (FK→teams), `coach_user_id` (FK→profiles.user_id), `status` (enum: pending/approved/removed), `assigned_at`, `updated_at`
3. **`user_roles`** — `id`, `user_id` (FK→auth.users), `role` (enum: coach/player/parent/director) — following the security pattern from instructions

### Modifications:
- Add `team_id` (FK→teams, nullable) to `players` table so players belong to teams
- RLS policies: directors can view all data club-wide; coaches manage only their assigned teams

### Security definer function:
- `has_role(user_id, role)` for safe RLS checks without recursion

## Phase 2: Auth & Role Updates

- Update `UserRole` type to include `'director'`
- Update `AppContext` to support director role
- Update `AppSidebar` with director-specific nav links
- Add director routes in `App.tsx`

## Phase 3: Director Dashboard Pages

### 3a. Overview Page (`DirectorDashboard.tsx`)
- Stat cards: Total Players, Total Teams, Active Players (30d), Avg CPI, Most Improved, Top Ranked
- Quick alerts/notifications section

### 3b. Club Leaderboard (`DirectorLeaderboardPage.tsx`)
- Full club-wide leaderboard with rank change indicators (↑↓)
- Filters: age group, team, timeframe

### 3c. Team Performance (`DirectorTeamsPage.tsx`)
- Table/card layout of all teams with Avg CPI, activity level, most improved player
- Click to view team detail

### 3d. Player Development Insights (`DirectorPlayersPage.tsx`)
- CPI progression chart (club average over time)
- Top 10 most improved players
- Flagged inactive players

### 3e. Coach Management (`DirectorCoachesPage.tsx`)
- List coaches with team, status, activity
- Approve/remove actions

## Phase 4: Export Features

- PDF player report generation (client-side)
- CSV team data export

## Files Created (~12-15 new files)
- `src/pages/DirectorDashboard.tsx`
- `src/pages/DirectorLeaderboardPage.tsx`
- `src/pages/DirectorTeamsPage.tsx`
- `src/pages/DirectorPlayersPage.tsx`
- `src/pages/DirectorCoachesPage.tsx`
- `src/hooks/useDirectorData.ts`
- `src/hooks/useTeams.ts`
- `src/components/DirectorStatCards.tsx`
- `src/components/ClubLeaderboard.tsx`
- `src/components/TeamPerformanceTable.tsx`
- `src/components/CoachManagementTable.tsx`
- `src/components/PlayerInsightsCharts.tsx`
- `src/lib/exportUtils.ts`

## Files Modified (~4 files)
- `src/types/player.ts` — add director role
- `src/App.tsx` — add director routes
- `src/components/AppSidebar.tsx` — add director nav
- `src/context/AppContext.tsx` — (minor, already handles dynamic roles)
