CREATE TABLE public.adult_leagues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  site_url TEXT NOT NULL,
  seed_url TEXT NOT NULL,
  association_id TEXT NOT NULL,
  season_id TEXT,
  season_label TEXT,
  game_type_id TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.adult_leagues TO anon, authenticated;
GRANT ALL ON public.adult_leagues TO service_role;
ALTER TABLE public.adult_leagues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Adult leagues are viewable by everyone" ON public.adult_leagues FOR SELECT USING (true);

CREATE TABLE public.adult_divisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id TEXT NOT NULL REFERENCES public.adult_leagues(id) ON DELETE CASCADE,
  external_did TEXT NOT NULL,
  external_catid TEXT NOT NULL,
  name TEXT NOT NULL,
  category_name TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (league_id, external_did)
);
GRANT SELECT ON public.adult_divisions TO anon, authenticated;
GRANT ALL ON public.adult_divisions TO service_role;
ALTER TABLE public.adult_divisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Adult divisions are viewable by everyone" ON public.adult_divisions FOR SELECT USING (true);

CREATE TABLE public.adult_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id TEXT NOT NULL REFERENCES public.adult_leagues(id) ON DELETE CASCADE,
  division_id UUID REFERENCES public.adult_divisions(id) ON DELETE SET NULL,
  external_tid TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (league_id, external_tid)
);
GRANT SELECT ON public.adult_teams TO anon, authenticated;
GRANT ALL ON public.adult_teams TO service_role;
ALTER TABLE public.adult_teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Adult teams are viewable by everyone" ON public.adult_teams FOR SELECT USING (true);

CREATE TABLE public.adult_standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id TEXT NOT NULL REFERENCES public.adult_leagues(id) ON DELETE CASCADE,
  division_id UUID NOT NULL REFERENCES public.adult_divisions(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.adult_teams(id) ON DELETE CASCADE,
  season_id TEXT,
  rank INT,
  gp INT NOT NULL DEFAULT 0,
  w INT NOT NULL DEFAULT 0,
  l INT NOT NULL DEFAULT 0,
  t INT NOT NULL DEFAULT 0,
  pts INT NOT NULL DEFAULT 0,
  gf INT NOT NULL DEFAULT 0,
  ga INT NOT NULL DEFAULT 0,
  gd INT NOT NULL DEFAULT 0,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (division_id, team_id)
);
GRANT SELECT ON public.adult_standings TO anon, authenticated;
GRANT ALL ON public.adult_standings TO service_role;
ALTER TABLE public.adult_standings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Adult standings are viewable by everyone" ON public.adult_standings FOR SELECT USING (true);

CREATE TABLE public.adult_match_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id TEXT NOT NULL REFERENCES public.adult_leagues(id) ON DELETE CASCADE,
  division_id UUID REFERENCES public.adult_divisions(id) ON DELETE CASCADE,
  game_key TEXT NOT NULL UNIQUE,
  home_team_id UUID REFERENCES public.adult_teams(id) ON DELETE SET NULL,
  away_team_id UUID REFERENCES public.adult_teams(id) ON DELETE SET NULL,
  home_team_name TEXT,
  away_team_name TEXT,
  home_score INT,
  away_score INT,
  match_date DATE,
  venue TEXT,
  played BOOLEAN NOT NULL DEFAULT false,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.adult_match_results TO anon, authenticated;
GRANT ALL ON public.adult_match_results TO service_role;
ALTER TABLE public.adult_match_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Adult match results are viewable by everyone" ON public.adult_match_results FOR SELECT USING (true);

CREATE TABLE public.adult_scrape_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id TEXT,
  status TEXT NOT NULL,
  divisions_scraped INT DEFAULT 0,
  rows_upserted INT DEFAULT 0,
  error_message TEXT,
  ran_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.adult_scrape_runs TO anon, authenticated;
GRANT ALL ON public.adult_scrape_runs TO service_role;
ALTER TABLE public.adult_scrape_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Adult scrape runs are viewable by everyone" ON public.adult_scrape_runs FOR SELECT USING (true);

CREATE TRIGGER adult_leagues_set_updated_at BEFORE UPDATE ON public.adult_leagues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER adult_divisions_set_updated_at BEFORE UPDATE ON public.adult_divisions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER adult_teams_set_updated_at BEFORE UPDATE ON public.adult_teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_adult_standings_division ON public.adult_standings(division_id);
CREATE INDEX idx_adult_results_division_date ON public.adult_match_results(division_id, match_date DESC);