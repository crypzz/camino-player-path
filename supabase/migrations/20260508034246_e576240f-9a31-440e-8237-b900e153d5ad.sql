
-- 1) player_cvs: remove anon access, restrict to coaches/directors/scouts
DROP POLICY IF EXISTS "Anyone can view published CVs" ON public.player_cvs;
DROP POLICY IF EXISTS "Directors can view all CVs" ON public.player_cvs;

CREATE POLICY "Coaches directors scouts can view published CVs"
ON public.player_cvs FOR SELECT TO authenticated
USING (
  is_published = true AND (
    public.has_role(auth.uid(), 'coach') OR
    public.has_role(auth.uid(), 'director') OR
    public.has_role(auth.uid(), 'scout')
  )
);

CREATE POLICY "Directors can view all CVs"
ON public.player_cvs FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'director'));

-- 2) evaluations: restrict SELECT
DROP POLICY IF EXISTS "Users can view all evaluations" ON public.evaluations;

CREATE POLICY "Restricted evaluation visibility"
ON public.evaluations FOR SELECT TO authenticated
USING (
  auth.uid() = evaluated_by
  OR public.has_role(auth.uid(), 'coach')
  OR public.has_role(auth.uid(), 'director')
  OR EXISTS (
    SELECT 1 FROM public.players p
    WHERE p.id = evaluations.player_id AND p.created_by = auth.uid()
  )
);

-- 3) Lock down SECURITY DEFINER helper functions (revoke EXECUTE from public/anon/authenticated)
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;

-- 4) Set search_path on helper functions missing it
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;
