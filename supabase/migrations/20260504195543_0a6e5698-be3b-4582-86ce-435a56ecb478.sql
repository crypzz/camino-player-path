
-- Aggregated player stats (one row per player per team)
CREATE TABLE public.cmsa_player_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL,
  age_group_id TEXT NOT NULL,
  tier TEXT NOT NULL,
  player_name TEXT NOT NULL,
  goals INTEGER NOT NULL DEFAULT 0,
  assists INTEGER NOT NULL DEFAULT 0,
  games_played INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (team_id, player_name)
);

ALTER TABLE public.cmsa_player_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view player stats"
  ON public.cmsa_player_stats FOR SELECT
  TO anon, authenticated USING (true);

-- Per-match goal log (audit trail, drives the rollup)
CREATE TABLE public.cmsa_match_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL,
  age_group_id TEXT NOT NULL,
  tier TEXT NOT NULL,
  player_name TEXT NOT NULL,
  match_date DATE NOT NULL DEFAULT CURRENT_DATE,
  opponent TEXT,
  goals INTEGER NOT NULL DEFAULT 0,
  assists INTEGER NOT NULL DEFAULT 0,
  played BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  logged_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cmsa_match_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view match goals"
  ON public.cmsa_match_goals FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "Coaches and directors can log match goals"
  ON public.cmsa_match_goals FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = logged_by AND (
      public.has_role(auth.uid(), 'coach'::app_role) OR
      public.has_role(auth.uid(), 'director'::app_role)
    )
  );

CREATE POLICY "Loggers can update own match goals"
  ON public.cmsa_match_goals FOR UPDATE
  TO authenticated USING (auth.uid() = logged_by);

CREATE POLICY "Loggers can delete own match goals"
  ON public.cmsa_match_goals FOR DELETE
  TO authenticated USING (auth.uid() = logged_by);

-- Rollup function: recompute aggregates for an affected (team, player)
CREATE OR REPLACE FUNCTION public.rollup_cmsa_player_stats()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  t_team UUID;
  t_player TEXT;
  t_age TEXT;
  t_tier TEXT;
  agg_goals INT;
  agg_assists INT;
  agg_games INT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    t_team := OLD.team_id; t_player := OLD.player_name;
    t_age := OLD.age_group_id; t_tier := OLD.tier;
  ELSE
    t_team := NEW.team_id; t_player := NEW.player_name;
    t_age := NEW.age_group_id; t_tier := NEW.tier;
  END IF;

  SELECT
    COALESCE(SUM(goals), 0),
    COALESCE(SUM(assists), 0),
    COUNT(*) FILTER (WHERE played)
  INTO agg_goals, agg_assists, agg_games
  FROM public.cmsa_match_goals
  WHERE team_id = t_team AND player_name = t_player;

  IF agg_goals = 0 AND agg_assists = 0 AND agg_games = 0 THEN
    DELETE FROM public.cmsa_player_stats
    WHERE team_id = t_team AND player_name = t_player;
  ELSE
    INSERT INTO public.cmsa_player_stats
      (team_id, age_group_id, tier, player_name, goals, assists, games_played, updated_at)
    VALUES (t_team, t_age, t_tier, t_player, agg_goals, agg_assists, agg_games, now())
    ON CONFLICT (team_id, player_name) DO UPDATE
      SET goals = EXCLUDED.goals,
          assists = EXCLUDED.assists,
          games_played = EXCLUDED.games_played,
          age_group_id = EXCLUDED.age_group_id,
          tier = EXCLUDED.tier,
          updated_at = now();
  END IF;

  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_rollup_cmsa_player_stats
AFTER INSERT OR UPDATE OR DELETE ON public.cmsa_match_goals
FOR EACH ROW EXECUTE FUNCTION public.rollup_cmsa_player_stats();

-- Match results (scraped)
CREATE TABLE public.cmsa_match_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_key TEXT NOT NULL UNIQUE,
  age_group_id TEXT,
  tier TEXT,
  home_team_id UUID,
  away_team_id UUID,
  home_team_external_id TEXT,
  away_team_external_id TEXT,
  home_score INTEGER,
  away_score INTEGER,
  match_date DATE,
  played BOOLEAN NOT NULL DEFAULT false,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cmsa_match_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view match results"
  ON public.cmsa_match_results FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX idx_cmsa_match_results_date ON public.cmsa_match_results (match_date DESC);
CREATE INDEX idx_cmsa_match_results_home ON public.cmsa_match_results (home_team_id);
CREATE INDEX idx_cmsa_match_results_away ON public.cmsa_match_results (away_team_id);
CREATE INDEX idx_cmsa_player_stats_lookup ON public.cmsa_player_stats (age_group_id, tier);
