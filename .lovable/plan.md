
# CMSA Team Standings Leaderboard

Pull live team standings from Calgary Minor Soccer Association (CMSA) and display them inside Camino as a new "CMSA Standings" leaderboard that auto-updates as new results post.

## What I confirmed about the data source

CMSA itself doesn't expose individual player stats publicly. What it does expose is **team standings** per age group / tier, embedded from Demosphere:

- Hub: `https://calgaryminorsoccer.com/league/schedules-standings/standings`
- Real data feed: `https://elements.demosphere.com/75025/standings/Outdoor2026/116457993.html`
- Per-age-group schedule pages: `calgaryminorsoccer.ottosport.ai/schedule/u10` … `u19` (each links to a similar Demosphere standings page)

Each standings page is an HTML table with rows like:

```text
Boys U13 Tier 1 | GP | W | T | L | Pts | GF | GA | GD
1. LSCA Barcelona 13   | 2 | 2 | 0 | 0 | 6 | 10 | 0 | 10
2. New Frontier SC 14  | 2 | 2 | 0 | 0 | 6 |  7 | 1 |  6
...
```

So the leaderboard will be **team standings by age group + tier**, not per-player rankings. (The existing Camino "Leaderboard" stays untouched — this is a separate "CMSA Standings" view.)

## What we're building

1. A `cmsa_*` set of database tables to cache scraped standings.
2. A scheduled edge function that scrapes Demosphere and upserts the latest standings (runs hourly).
3. A new page `/cmsa-standings` with an age-group + tier filter, sortable by Pts / GD / GF.
4. A sidebar link under the existing Leaderboard nav: "CMSA Standings".

## Database (migration)

```sql
create table public.cmsa_age_groups (
  id text primary key,                 -- 'u13', 'u14', ...
  label text not null,                 -- 'U13', 'U14'
  source_url text not null,            -- Demosphere standings URL
  display_order int not null
);

create table public.cmsa_teams (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,             -- demosphere team URL slug
  name text not null,
  age_group_id text references public.cmsa_age_groups(id),
  tier text                            -- 'Tier 1', 'Tier 2', 'Boys U13 Tier 1' label
);

create table public.cmsa_standings (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references public.cmsa_teams(id) on delete cascade,
  age_group_id text references public.cmsa_age_groups(id),
  tier text not null,
  rank int,
  gp int, w int, t int, l int, pts int, gf int, ga int, gd int,
  scraped_at timestamptz default now(),
  unique (team_id, tier)
);

create table public.cmsa_scrape_runs (
  id uuid primary key default gen_random_uuid(),
  age_group_id text,
  status text,                          -- 'success' | 'error'
  rows_upserted int,
  error_message text,
  ran_at timestamptz default now()
);
```

RLS: enable on all four tables. `SELECT` is open to everyone (data is already public on CMSA). `INSERT/UPDATE/DELETE` is restricted to the service role (the edge function).

## Edge function: `scrape-cmsa-standings`

- Fetches each Demosphere standings URL in `cmsa_age_groups`.
- Parses the HTML tables (using `deno-dom` or a regex on the table rows — the structure is stable and simple).
- Upserts teams by `external_id` (Demosphere team URL).
- Replaces standings rows for that age group atomically.
- Logs the run into `cmsa_scrape_runs`.

Scheduled with `pg_cron` + `pg_net` to run every hour. Also exposes a manual `POST` endpoint so the UI can trigger a refresh on demand (rate-limited to once/minute via the run log).

## Frontend

New page `src/pages/CMSAStandingsPage.tsx`:

- Header: "CMSA Standings — Outdoor 2026" + "Last updated X mins ago" + Refresh button.
- Filters: Age group (U10–U19), Tier (auto-populated per age group), Search by team name.
- Standings table styled like the existing `LeaderboardTable` (dark navy + gold, top-3 highlighted, motion fade-in).
- Columns: Rank, Team, GP, W-T-L, Pts, GF, GA, GD. Click row to open a side panel with the team's recent rank history (sparkline from `cmsa_standings.scraped_at`).
- Empty / loading / error states.

Hook: `src/hooks/useCMSAStandings.ts` (React Query, 60s stale time).

Routing + nav:
- Add `/cmsa-standings` in `src/App.tsx`.
- Add a "CMSA Standings" entry in `src/components/AppSidebar.tsx` next to the existing Leaderboard.

## Seed data

Seed `cmsa_age_groups` with the 8 known leagues from the CMSA schedule page (U10 through U19) and their Demosphere URLs. Run the scraper once immediately after deploy so the page has data on first load.

## Out of scope (call-outs)

- **No per-player stats.** CMSA's public site does not publish individual player goals/assists, so we cannot build a player-level leaderboard from this source. If you want player stats later, you'd need either (a) coaches to enter them in Camino, or (b) a partnership/API access from CMSA/Demosphere.
- We're scraping a public HTML page. If Demosphere changes their markup the parser will need an update — `cmsa_scrape_runs` will surface failures so we can react.

## Files

**New**
- `supabase/functions/scrape-cmsa-standings/index.ts`
- `src/pages/CMSAStandingsPage.tsx`
- `src/components/cmsa/CMSAStandingsTable.tsx`
- `src/hooks/useCMSAStandings.ts`

**Edited**
- `src/App.tsx` — register `/cmsa-standings` route
- `src/components/AppSidebar.tsx` — add nav entry

**Migrations**
- Create the four `cmsa_*` tables + RLS policies
- Enable `pg_cron` + `pg_net`, schedule hourly invocation of the edge function
- Seed `cmsa_age_groups`
