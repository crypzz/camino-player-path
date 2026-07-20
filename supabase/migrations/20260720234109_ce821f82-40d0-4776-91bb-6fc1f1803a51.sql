
CREATE TYPE public.analytics_event_type AS ENUM (
  'touch','pass','completed_pass','key_pass','shot','shot_on_target','goal','assist',
  'dribble','tackle','interception','clearance','duel','aerial_duel','recovery',
  'foul','offside','save','cross','corner','throw_in'
);
CREATE TYPE public.analytics_match_status AS ENUM ('queued','processing','done','error');

CREATE TABLE public.analytics_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  club_id UUID,
  title TEXT NOT NULL,
  match_date DATE,
  home_team TEXT,
  away_team TEXT,
  video_url TEXT NOT NULL,
  fps REAL,
  duration_seconds REAL,
  status public.analytics_match_status NOT NULL DEFAULT 'queued',
  worker_job_id TEXT,
  model_version TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_matches TO authenticated;
GRANT ALL ON public.analytics_matches TO service_role;
ALTER TABLE public.analytics_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage matches" ON public.analytics_matches
  FOR ALL USING (auth.uid() = created_by OR public.has_role(auth.uid(),'director'))
  WITH CHECK (auth.uid() = created_by OR public.has_role(auth.uid(),'director'));
CREATE POLICY "Coaches view matches" ON public.analytics_matches
  FOR SELECT USING (public.has_role(auth.uid(),'coach') OR public.has_role(auth.uid(),'director'));
CREATE INDEX idx_am_created_by ON public.analytics_matches(created_by);
CREATE INDEX idx_am_status ON public.analytics_matches(status);

CREATE TABLE public.analytics_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.analytics_matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  jersey_number INT,
  team_side TEXT CHECK (team_side IN ('home','away')),
  display_name TEXT,
  position TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(match_id, jersey_number, team_side)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_players TO authenticated;
GRANT ALL ON public.analytics_players TO service_role;
ALTER TABLE public.analytics_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Analytics players via match" ON public.analytics_players
  FOR ALL USING (EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director') OR public.has_role(auth.uid(),'coach'))))
  WITH CHECK (EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director'))));
CREATE INDEX idx_ap_match ON public.analytics_players(match_id);
CREATE INDEX idx_ap_player ON public.analytics_players(player_id);

CREATE TABLE public.analytics_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.analytics_matches(id) ON DELETE CASCADE,
  track_id INT NOT NULL,
  analytics_player_id UUID REFERENCES public.analytics_players(id) ON DELETE SET NULL,
  first_frame INT,
  last_frame INT,
  frame_count INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(match_id, track_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_tracks TO authenticated;
GRANT ALL ON public.analytics_tracks TO service_role;
ALTER TABLE public.analytics_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tracks via match" ON public.analytics_tracks
  FOR ALL USING (EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director') OR public.has_role(auth.uid(),'coach'))))
  WITH CHECK (EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director'))));
CREATE INDEX idx_at_match ON public.analytics_tracks(match_id);

CREATE TABLE public.analytics_frames (
  id BIGSERIAL PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.analytics_matches(id) ON DELETE CASCADE,
  track_id INT NOT NULL,
  frame_number INT NOT NULL,
  t_seconds REAL NOT NULL,
  x REAL NOT NULL,
  y REAL NOT NULL,
  has_ball BOOLEAN NOT NULL DEFAULT false
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_frames TO authenticated;
GRANT ALL ON public.analytics_frames TO service_role;
ALTER TABLE public.analytics_frames ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Frames via match" ON public.analytics_frames
  FOR ALL USING (EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director') OR public.has_role(auth.uid(),'coach'))))
  WITH CHECK (EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director'))));
CREATE INDEX idx_af_match_t ON public.analytics_frames(match_id, t_seconds);
CREATE INDEX idx_af_track ON public.analytics_frames(match_id, track_id);

CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.analytics_matches(id) ON DELETE CASCADE,
  analytics_player_id UUID REFERENCES public.analytics_players(id) ON DELETE SET NULL,
  target_player_id UUID REFERENCES public.analytics_players(id) ON DELETE SET NULL,
  track_id INT,
  event_type public.analytics_event_type NOT NULL,
  t_start REAL NOT NULL,
  t_end REAL,
  x REAL,
  y REAL,
  outcome TEXT,
  xg REAL,
  confidence REAL,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events via match" ON public.analytics_events
  FOR ALL USING (EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director') OR public.has_role(auth.uid(),'coach'))))
  WITH CHECK (EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director'))));
CREATE INDEX idx_ae_match ON public.analytics_events(match_id);
CREATE INDEX idx_ae_player ON public.analytics_events(analytics_player_id);
CREATE INDEX idx_ae_type ON public.analytics_events(event_type);
CREATE INDEX idx_ae_t ON public.analytics_events(match_id, t_start);

CREATE TABLE public.analytics_player_match_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.analytics_matches(id) ON DELETE CASCADE,
  analytics_player_id UUID NOT NULL REFERENCES public.analytics_players(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  touches INT DEFAULT 0,
  passes INT DEFAULT 0,
  passes_completed INT DEFAULT 0,
  pass_accuracy REAL DEFAULT 0,
  key_passes INT DEFAULT 0,
  shots INT DEFAULT 0,
  shots_on_target INT DEFAULT 0,
  shot_accuracy REAL DEFAULT 0,
  goals INT DEFAULT 0,
  assists INT DEFAULT 0,
  dribbles INT DEFAULT 0,
  tackles INT DEFAULT 0,
  interceptions INT DEFAULT 0,
  clearances INT DEFAULT 0,
  duels INT DEFAULT 0,
  duels_won INT DEFAULT 0,
  aerials INT DEFAULT 0,
  aerials_won INT DEFAULT 0,
  recoveries INT DEFAULT 0,
  fouls INT DEFAULT 0,
  offsides INT DEFAULT 0,
  saves INT DEFAULT 0,
  crosses INT DEFAULT 0,
  corners INT DEFAULT 0,
  throw_ins INT DEFAULT 0,
  distance_m REAL DEFAULT 0,
  sprint_count INT DEFAULT 0,
  minutes_played REAL DEFAULT 0,
  rating REAL DEFAULT 0,
  heatmap JSONB DEFAULT '[]'::jsonb,
  touchmap JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(match_id, analytics_player_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_player_match_stats TO authenticated;
GRANT ALL ON public.analytics_player_match_stats TO service_role;
ALTER TABLE public.analytics_player_match_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Player match stats read" ON public.analytics_player_match_stats
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director') OR public.has_role(auth.uid(),'coach')))
    OR EXISTS(SELECT 1 FROM public.players p WHERE p.id = player_id AND p.created_by = auth.uid())
  );
CREATE POLICY "Player match stats write via owner" ON public.analytics_player_match_stats
  FOR ALL USING (EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director'))))
  WITH CHECK (EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director'))));
CREATE INDEX idx_apms_match ON public.analytics_player_match_stats(match_id);
CREATE INDEX idx_apms_player ON public.analytics_player_match_stats(player_id);

CREATE TABLE public.analytics_player_season_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  season TEXT NOT NULL,
  matches_played INT DEFAULT 0,
  touches INT DEFAULT 0,
  passes INT DEFAULT 0,
  passes_completed INT DEFAULT 0,
  key_passes INT DEFAULT 0,
  shots INT DEFAULT 0,
  goals INT DEFAULT 0,
  assists INT DEFAULT 0,
  dribbles INT DEFAULT 0,
  tackles INT DEFAULT 0,
  interceptions INT DEFAULT 0,
  clearances INT DEFAULT 0,
  duels_won INT DEFAULT 0,
  aerials_won INT DEFAULT 0,
  recoveries INT DEFAULT 0,
  fouls INT DEFAULT 0,
  saves INT DEFAULT 0,
  crosses INT DEFAULT 0,
  avg_rating REAL DEFAULT 0,
  distance_m REAL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(player_id, season)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_player_season_stats TO authenticated;
GRANT ALL ON public.analytics_player_season_stats TO service_role;
ALTER TABLE public.analytics_player_season_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Season stats visible" ON public.analytics_player_season_stats
  FOR SELECT USING (
    public.has_role(auth.uid(),'coach') OR public.has_role(auth.uid(),'director')
    OR EXISTS(SELECT 1 FROM public.players p WHERE p.id = player_id AND p.created_by = auth.uid())
  );
CREATE POLICY "Season stats director write" ON public.analytics_player_season_stats
  FOR ALL USING (public.has_role(auth.uid(),'director'))
  WITH CHECK (public.has_role(auth.uid(),'director'));

CREATE TABLE public.analytics_highlight_clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.analytics_matches(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.analytics_events(id) ON DELETE CASCADE,
  analytics_player_id UUID REFERENCES public.analytics_players(id) ON DELETE SET NULL,
  player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  event_type public.analytics_event_type NOT NULL,
  storage_path TEXT NOT NULL,
  t_start REAL NOT NULL,
  t_end REAL NOT NULL,
  thumbnail_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_highlight_clips TO authenticated;
GRANT ALL ON public.analytics_highlight_clips TO service_role;
ALTER TABLE public.analytics_highlight_clips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Highlights read" ON public.analytics_highlight_clips
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director') OR public.has_role(auth.uid(),'coach')))
    OR EXISTS(SELECT 1 FROM public.players p WHERE p.id = player_id AND p.created_by = auth.uid())
  );
CREATE POLICY "Highlights write" ON public.analytics_highlight_clips
  FOR ALL USING (EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director'))))
  WITH CHECK (EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director'))));

CREATE TABLE public.analytics_coaching_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.analytics_matches(id) ON DELETE CASCADE,
  analytics_player_id UUID REFERENCES public.analytics_players(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  strengths JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  training_priorities JSONB DEFAULT '[]'::jsonb,
  trend TEXT CHECK (trend IN ('up','flat','down')),
  comparison_delta JSONB DEFAULT '{}'::jsonb,
  summary TEXT,
  model_used TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(match_id, analytics_player_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics_coaching_insights TO authenticated;
GRANT ALL ON public.analytics_coaching_insights TO service_role;
ALTER TABLE public.analytics_coaching_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insights read" ON public.analytics_coaching_insights
  FOR SELECT USING (
    EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director') OR public.has_role(auth.uid(),'coach')))
    OR EXISTS(SELECT 1 FROM public.players p WHERE p.id = player_id AND p.created_by = auth.uid())
  );
CREATE POLICY "Insights write" ON public.analytics_coaching_insights
  FOR ALL USING (EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director'))))
  WITH CHECK (EXISTS(SELECT 1 FROM public.analytics_matches m WHERE m.id = match_id AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director'))));

CREATE TRIGGER trg_am_updated BEFORE UPDATE ON public.analytics_matches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_apms_updated BEFORE UPDATE ON public.analytics_player_match_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.rollup_analytics_season()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_season TEXT;
BEGIN
  IF NEW.player_id IS NULL THEN RETURN NEW; END IF;
  SELECT to_char(COALESCE(m.match_date, m.created_at::date), 'YYYY') INTO v_season
  FROM public.analytics_matches m WHERE m.id = NEW.match_id;
  IF v_season IS NULL THEN v_season := to_char(now(),'YYYY'); END IF;

  INSERT INTO public.analytics_player_season_stats AS s
    (player_id, season, matches_played, touches, passes, passes_completed, key_passes,
     shots, goals, assists, dribbles, tackles, interceptions, clearances, duels_won,
     aerials_won, recoveries, fouls, saves, crosses, avg_rating, distance_m)
  VALUES (NEW.player_id, v_season, 1, NEW.touches, NEW.passes, NEW.passes_completed, NEW.key_passes,
     NEW.shots, NEW.goals, NEW.assists, NEW.dribbles, NEW.tackles, NEW.interceptions, NEW.clearances, NEW.duels_won,
     NEW.aerials_won, NEW.recoveries, NEW.fouls, NEW.saves, NEW.crosses, NEW.rating, NEW.distance_m)
  ON CONFLICT (player_id, season) DO UPDATE SET
    matches_played = s.matches_played + 1,
    touches = s.touches + EXCLUDED.touches,
    passes = s.passes + EXCLUDED.passes,
    passes_completed = s.passes_completed + EXCLUDED.passes_completed,
    key_passes = s.key_passes + EXCLUDED.key_passes,
    shots = s.shots + EXCLUDED.shots,
    goals = s.goals + EXCLUDED.goals,
    assists = s.assists + EXCLUDED.assists,
    dribbles = s.dribbles + EXCLUDED.dribbles,
    tackles = s.tackles + EXCLUDED.tackles,
    interceptions = s.interceptions + EXCLUDED.interceptions,
    clearances = s.clearances + EXCLUDED.clearances,
    duels_won = s.duels_won + EXCLUDED.duels_won,
    aerials_won = s.aerials_won + EXCLUDED.aerials_won,
    recoveries = s.recoveries + EXCLUDED.recoveries,
    fouls = s.fouls + EXCLUDED.fouls,
    saves = s.saves + EXCLUDED.saves,
    crosses = s.crosses + EXCLUDED.crosses,
    avg_rating = ((s.avg_rating * s.matches_played) + EXCLUDED.avg_rating) / (s.matches_played + 1),
    distance_m = s.distance_m + EXCLUDED.distance_m,
    updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_apms_season AFTER INSERT ON public.analytics_player_match_stats
  FOR EACH ROW EXECUTE FUNCTION public.rollup_analytics_season();
