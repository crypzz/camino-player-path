-- Explicit deny-by-default + director-only read access on waitlist
CREATE POLICY "Directors can view waitlist"
ON public.waitlist
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'director'::app_role));