
CREATE TABLE public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date date NOT NULL,
  team text,
  notes text,
  video_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','processing','complete','error')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.players_video (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text,
  avatar_url text,
  team text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES public.matches(id) ON DELETE CASCADE,
  track_id integer NOT NULL,
  player_id uuid REFERENCES public.players_video(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.video_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id uuid REFERENCES public.players_video(id),
  track_id integer,
  touches integer DEFAULT 0,
  distance_m float DEFAULT 0,
  possession_seconds float DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.matches TO authenticated;
GRANT ALL ON public.matches TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.players_video TO authenticated;
GRANT ALL ON public.players_video TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tracks TO authenticated;
GRANT ALL ON public.tracks TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_stats TO authenticated;
GRANT ALL ON public.video_stats TO service_role;

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players_video ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view matches" ON public.matches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert matches" ON public.matches FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update matches" ON public.matches FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete matches" ON public.matches FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated can view players_video" ON public.players_video FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert players_video" ON public.players_video FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update players_video" ON public.players_video FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete players_video" ON public.players_video FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated can view tracks" ON public.tracks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert tracks" ON public.tracks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update tracks" ON public.tracks FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete tracks" ON public.tracks FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated can view video_stats" ON public.video_stats FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert video_stats" ON public.video_stats FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update video_stats" ON public.video_stats FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete video_stats" ON public.video_stats FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated can read match videos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'match-videos');
CREATE POLICY "Authenticated can upload match videos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'match-videos');
CREATE POLICY "Authenticated can update match videos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'match-videos');
CREATE POLICY "Authenticated can delete match videos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'match-videos');
