-- 1. Remove anon access to players table (force anon through public_player_cards view)
DROP POLICY IF EXISTS "Anon can view public players limited fields" ON public.players;

-- Ensure the public_player_cards view is accessible to anon
GRANT SELECT ON public.public_player_cards TO anon, authenticated;

-- 2. Role-gate announcements INSERT
DROP POLICY IF EXISTS "Directors and coaches can create announcements" ON public.announcements;
CREATE POLICY "Directors and coaches can create announcements"
ON public.announcements
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = created_by
  AND (
    public.has_role(auth.uid(), 'director'::app_role)
    OR public.has_role(auth.uid(), 'coach'::app_role)
  )
);

-- 3. Restrict get_signup_email_status to authenticated users only
REVOKE EXECUTE ON FUNCTION public.get_signup_email_status(text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_signup_email_status(text) TO authenticated, service_role;

-- 4. Scope post-images INSERT policy to the uploader's own folder
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND (qual LIKE '%post-images%' OR with_check LIKE '%post-images%')
      AND cmd = 'INSERT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "Users can upload to own post-images folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);