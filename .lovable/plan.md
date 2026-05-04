# Calgary Top Scorers + Team Form

Two complementary leaderboards on the existing `/cmsa-standings` page.

## 1. Top Scorers (coach-entered)

Coaches log goals/assists per match. Camino aggregates a Calgary-wide leaderboard CMSA doesn't publish.

**New table `cmsa_player_stats`**
- `id`, `player_name` (text), `team_id` (→ `cmsa_teams`), `age_group_id`, `tier`
- `goals` (int), `assists` (int), `games_played` (int)
- `created_by` (uuid), `created_at`, `updated_at`
- Unique on `(team_id, player_name)` so one row per player; counters increment via match log
- RLS: anyone can SELECT; only authenticated users with `coach` or `director` role can INSERT/UPDATE; only `created_by` can DELETE

**New table `cmsa_match_goals`** (audit trail / per-match log)
- `id`, `team_id`, `player_name`, `match_date`, `goals`, `assists`, `notes`, `logged_by`, `created_at`
- A trigger rolls these up into `cmsa_player_stats` totals on insert/update/delete

**UI — "Log Match Stats" dialog (coach only)**
- Pick team (defaults to coach's assigned CMSA team — they choose once, saved to profile)
- Date, opponent (optional)
- Repeater: player name + goals + assists
- Submit → inserts rows into `cmsa_match_goals`

**UI — Top Scorers tab on `/cmsa-standings`**
- New tab next to Standings: **Standings | Top Scorers | Team Form**
- Filters: age group, tier, club (derived from team name prefix)
- Columns: Rank · Player · Team · GP · G · A · G+A
- Gold highlight top 3, same `CMSAStandingsTable` visual language

## 2. Team Form (auto from existing scrape)

Already-scraped data, no new entry. Surfaces momentum.

**Extend scraper** to also parse the schedule table (we saw scores like `5:0` in the team page HTML) into a new `cmsa_match_results` table:
- `home_team_id`, `away_team_id`, `home_score`, `away_score`, `match_date`, `game_key` (unique)

**UI — Team Form tab**
- Last 5 results per team as W/L/T pills (e.g. `W W L W W`)
- Sorted by points-from-last-5
- "Hot streak" badge for 3+ wins in a row
- "Biggest win this week" highlight card at top

## Files

**Migrations**
- New tables `cmsa_player_stats`, `cmsa_match_goals`, `cmsa_match_results`
- Trigger `rollup_player_stats_from_goals()`
- RLS policies above

**Edge function**
- Edit `supabase/functions/scrape-cmsa-standings/index.ts` — add schedule parser + upsert into `cmsa_match_results`

**Frontend**
- New `src/hooks/useCMSAPlayerStats.ts`, `useCMSAMatchResults.ts`
- New `src/components/cmsa/TopScorersTable.tsx`
- New `src/components/cmsa/TeamFormTable.tsx`
- New `src/components/cmsa/LogMatchStatsDialog.tsx`
- Edit `src/pages/CMSAStandingsPage.tsx` → add Tabs (Standings / Top Scorers / Team Form) + "Log Match Stats" button (coach/director only)

## Notes

- Player names are free-text (not linked to `players` table) — keeps friction low for coaches logging non-Camino players too.
- Privacy: minors. Only first name + last initial displayed publicly (e.g. "Marco D."); full name stored for coach view only. Toggle in settings later if needed.
- No CMSA scraping for player data — confirmed it's not public.