-- Restrict SELECT on child tables to mirror match_videos access
DROP POLICY IF EXISTS "Authenticated users can view match stats" ON public.match_player_stats;
CREATE POLICY "Coach director or creator can view match stats"
ON public.match_player_stats FOR SELECT TO authenticated
USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'coach'::app_role) OR has_role(auth.uid(), 'director'::app_role));

DROP POLICY IF EXISTS "Authenticated users can view tracking" ON public.player_tracking;
CREATE POLICY "Coach director or creator can view tracking"
ON public.player_tracking FOR SELECT TO authenticated
USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'coach'::app_role) OR has_role(auth.uid(), 'director'::app_role));

DROP POLICY IF EXISTS "Authenticated users can view all annotations" ON public.video_annotations;
CREATE POLICY "Coach director or creator can view annotations"
ON public.video_annotations FOR SELECT TO authenticated
USING ((auth.uid() = created_by) OR has_role(auth.uid(), 'coach'::app_role) OR has_role(auth.uid(), 'director'::app_role));

DROP POLICY IF EXISTS "Authenticated users can view all events" ON public.video_events;
CREATE POLICY "Coach director or creator can view events"
ON public.video_events FOR SELECT TO authenticated
USING ((auth.uid() = tagged_by) OR has_role(auth.uid(), 'coach'::app_role) OR has_role(auth.uid(), 'director'::app_role));

-- Restrict storage SELECT on private match-videos bucket
DROP POLICY IF EXISTS "Authenticated users can view videos" ON storage.objects;
CREATE POLICY "Coach director or owner can view videos"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'match-videos'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR has_role(auth.uid(), 'coach'::app_role)
    OR has_role(auth.uid(), 'director'::app_role)
  )
);

-- Prevent users from escalating their own role via profiles
CREATE OR REPLACE FUNCTION public.prevent_profile_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    NEW.role := OLD.role;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_profile_role_change ON public.profiles;
CREATE TRIGGER trg_prevent_profile_role_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_role_change();