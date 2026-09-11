
-- 1) matches ownership-scoped policies
DROP POLICY IF EXISTS "Authenticated can view matches" ON public.matches;
DROP POLICY IF EXISTS "Authenticated can insert matches" ON public.matches;
DROP POLICY IF EXISTS "Authenticated can update matches" ON public.matches;
DROP POLICY IF EXISTS "Authenticated can delete matches" ON public.matches;

CREATE POLICY "Owner coach or director can view matches" ON public.matches
FOR SELECT TO authenticated
USING (created_by = auth.uid() OR public.has_role(auth.uid(),'coach') OR public.has_role(auth.uid(),'director'));

CREATE POLICY "Users can insert own matches" ON public.matches
FOR INSERT TO authenticated
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Owner or director can update matches" ON public.matches
FOR UPDATE TO authenticated
USING (created_by = auth.uid() OR public.has_role(auth.uid(),'director'))
WITH CHECK (created_by = auth.uid() OR public.has_role(auth.uid(),'director'));

CREATE POLICY "Owner or director can delete matches" ON public.matches
FOR DELETE TO authenticated
USING (created_by = auth.uid() OR public.has_role(auth.uid(),'director'));

-- 2) tracks scoped through parent match
DROP POLICY IF EXISTS "Authenticated can view tracks" ON public.tracks;
DROP POLICY IF EXISTS "Authenticated can insert tracks" ON public.tracks;
DROP POLICY IF EXISTS "Authenticated can update tracks" ON public.tracks;
DROP POLICY IF EXISTS "Authenticated can delete tracks" ON public.tracks;

CREATE POLICY "Match access can view tracks" ON public.tracks
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.matches m WHERE m.id = tracks.match_id
  AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'coach') OR public.has_role(auth.uid(),'director'))));

CREATE POLICY "Match owner can insert tracks" ON public.tracks
FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.matches m WHERE m.id = tracks.match_id
  AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'coach') OR public.has_role(auth.uid(),'director'))));

CREATE POLICY "Match owner can update tracks" ON public.tracks
FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.matches m WHERE m.id = tracks.match_id
  AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director'))))
WITH CHECK (EXISTS (SELECT 1 FROM public.matches m WHERE m.id = tracks.match_id
  AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director'))));

CREATE POLICY "Match owner can delete tracks" ON public.tracks
FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.matches m WHERE m.id = tracks.match_id
  AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director'))));

-- 3) video_stats scoped through parent match
DROP POLICY IF EXISTS "Authenticated can view video_stats" ON public.video_stats;
DROP POLICY IF EXISTS "Authenticated can insert video_stats" ON public.video_stats;
DROP POLICY IF EXISTS "Authenticated can update video_stats" ON public.video_stats;
DROP POLICY IF EXISTS "Authenticated can delete video_stats" ON public.video_stats;

CREATE POLICY "Match access can view video_stats" ON public.video_stats
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.matches m WHERE m.id = video_stats.match_id
  AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'coach') OR public.has_role(auth.uid(),'director'))));

CREATE POLICY "Match owner can insert video_stats" ON public.video_stats
FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.matches m WHERE m.id = video_stats.match_id
  AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'coach') OR public.has_role(auth.uid(),'director'))));

CREATE POLICY "Match owner can update video_stats" ON public.video_stats
FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.matches m WHERE m.id = video_stats.match_id
  AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director'))))
WITH CHECK (EXISTS (SELECT 1 FROM public.matches m WHERE m.id = video_stats.match_id
  AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director'))));

CREATE POLICY "Match owner can delete video_stats" ON public.video_stats
FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.matches m WHERE m.id = video_stats.match_id
  AND (m.created_by = auth.uid() OR public.has_role(auth.uid(),'director'))));

-- 4) players_video ownership
ALTER TABLE public.players_video ADD COLUMN IF NOT EXISTS created_by uuid DEFAULT auth.uid();

DROP POLICY IF EXISTS "Authenticated can view players_video" ON public.players_video;
DROP POLICY IF EXISTS "Authenticated can insert players_video" ON public.players_video;
DROP POLICY IF EXISTS "Authenticated can update players_video" ON public.players_video;
DROP POLICY IF EXISTS "Authenticated can delete players_video" ON public.players_video;

CREATE POLICY "Authenticated can view players_video" ON public.players_video
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own players_video" ON public.players_video
FOR INSERT TO authenticated
WITH CHECK (created_by = auth.uid() OR public.has_role(auth.uid(),'coach') OR public.has_role(auth.uid(),'director'));

CREATE POLICY "Owner coach or director can update players_video" ON public.players_video
FOR UPDATE TO authenticated
USING (created_by = auth.uid() OR public.has_role(auth.uid(),'coach') OR public.has_role(auth.uid(),'director'))
WITH CHECK (created_by = auth.uid() OR public.has_role(auth.uid(),'coach') OR public.has_role(auth.uid(),'director'));

CREATE POLICY "Owner or director can delete players_video" ON public.players_video
FOR DELETE TO authenticated
USING (created_by = auth.uid() OR public.has_role(auth.uid(),'director'));

-- 5) storage: remove permissive bucket-only policies for match-videos
DROP POLICY IF EXISTS "Authenticated can read match videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload match videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update match videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete match videos" ON storage.objects;

-- 6) security definer view -> invoker, with column-scoped anon access
ALTER VIEW public.public_player_cards SET (security_invoker = on);

REVOKE ALL ON public.players FROM anon;
GRANT SELECT (id, "position", age_group, overall_rating, preferred_foot, team, avatar,
  is_public, name, location, nationality, age, bio, strengths, achievements,
  available_for_transfer, verification_badge) ON public.players TO anon;

DROP POLICY IF EXISTS "Anyone can view public player cards" ON public.players;
CREATE POLICY "Anyone can view public player cards" ON public.players
FOR SELECT TO anon USING (is_public = true);
