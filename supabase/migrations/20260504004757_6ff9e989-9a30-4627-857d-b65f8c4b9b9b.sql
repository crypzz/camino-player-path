
-- Extensions for scheduled refresh
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Age groups (one row per league standings page we scrape)
CREATE TABLE public.cmsa_age_groups (
  id text PRIMARY KEY,
  label text NOT NULL,
  source_url text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cmsa_age_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view CMSA age groups"
  ON public.cmsa_age_groups FOR SELECT
  TO anon, authenticated
  USING (true);

-- Teams (deduped across age groups via external Demosphere id)
CREATE TABLE public.cmsa_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text UNIQUE NOT NULL,
  name text NOT NULL,
  age_group_id text REFERENCES public.cmsa_age_groups(id) ON DELETE SET NULL,
  tier text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cmsa_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view CMSA teams"
  ON public.cmsa_teams FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX cmsa_teams_age_group_idx ON public.cmsa_teams(age_group_id);

-- Standings rows (one per team per tier — replaced on each scrape)
CREATE TABLE public.cmsa_standings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.cmsa_teams(id) ON DELETE CASCADE,
  age_group_id text NOT NULL REFERENCES public.cmsa_age_groups(id) ON DELETE CASCADE,
  tier text NOT NULL,
  rank int,
  gp int DEFAULT 0,
  w  int DEFAULT 0,
  t  int DEFAULT 0,
  l  int DEFAULT 0,
  pts int DEFAULT 0,
  gf int DEFAULT 0,
  ga int DEFAULT 0,
  gd int DEFAULT 0,
  scraped_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (team_id, tier)
);

ALTER TABLE public.cmsa_standings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view CMSA standings"
  ON public.cmsa_standings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX cmsa_standings_age_group_idx ON public.cmsa_standings(age_group_id);
CREATE INDEX cmsa_standings_tier_idx ON public.cmsa_standings(tier);

-- Scrape audit log
CREATE TABLE public.cmsa_scrape_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  age_group_id text,
  status text NOT NULL,
  rows_upserted int DEFAULT 0,
  error_message text,
  ran_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cmsa_scrape_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view CMSA scrape runs"
  ON public.cmsa_scrape_runs FOR SELECT
  TO anon, authenticated
  USING (true);

-- Touch updated_at on cmsa_teams
CREATE TRIGGER cmsa_teams_set_updated_at
  BEFORE UPDATE ON public.cmsa_teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
