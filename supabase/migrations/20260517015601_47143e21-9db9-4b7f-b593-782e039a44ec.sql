
-- attendance_records
DROP POLICY IF EXISTS "Authenticated users can view attendance" ON public.attendance_records;
CREATE POLICY "Coaches directors or recorder can view attendance"
ON public.attendance_records FOR SELECT TO authenticated
USING (
  auth.uid() = recorded_by
  OR public.has_role(auth.uid(), 'coach'::app_role)
  OR public.has_role(auth.uid(), 'director'::app_role)
);

-- schedule_sessions
DROP POLICY IF EXISTS "Authenticated users can view sessions" ON public.schedule_sessions;
CREATE POLICY "Coaches directors or creator can view sessions"
ON public.schedule_sessions FOR SELECT TO authenticated
USING (
  auth.uid() = created_by
  OR public.has_role(auth.uid(), 'coach'::app_role)
  OR public.has_role(auth.uid(), 'director'::app_role)
);

-- player_feedback
DROP POLICY IF EXISTS "Authenticated users can view feedback" ON public.player_feedback;
CREATE POLICY "Coach director or player owner can view feedback"
ON public.player_feedback FOR SELECT TO authenticated
USING (
  auth.uid() = coach_id
  OR public.has_role(auth.uid(), 'coach'::app_role)
  OR public.has_role(auth.uid(), 'director'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.players p
    WHERE p.id = player_feedback.player_id AND p.created_by = auth.uid()
  )
);

-- fitness_tests
DROP POLICY IF EXISTS "Users can view all fitness tests" ON public.fitness_tests;
CREATE POLICY "Coach director tester or player owner can view fitness tests"
ON public.fitness_tests FOR SELECT TO authenticated
USING (
  auth.uid() = tested_by
  OR public.has_role(auth.uid(), 'coach'::app_role)
  OR public.has_role(auth.uid(), 'director'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.players p
    WHERE p.id = fitness_tests.player_id AND p.created_by = auth.uid()
  )
);

-- development_goals
DROP POLICY IF EXISTS "Users can view all goals" ON public.development_goals;
CREATE POLICY "Coach director or player owner can view goals"
ON public.development_goals FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'coach'::app_role)
  OR public.has_role(auth.uid(), 'director'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.players p
    WHERE p.id = development_goals.player_id AND p.created_by = auth.uid()
  )
);

-- match_videos
DROP POLICY IF EXISTS "Authenticated users can view all videos" ON public.match_videos;
CREATE POLICY "Coach director or creator can view videos"
ON public.match_videos FOR SELECT TO authenticated
USING (
  auth.uid() = created_by
  OR public.has_role(auth.uid(), 'coach'::app_role)
  OR public.has_role(auth.uid(), 'director'::app_role)
);
