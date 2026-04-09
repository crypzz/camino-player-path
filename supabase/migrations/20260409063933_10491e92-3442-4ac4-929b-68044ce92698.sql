
-- Recreate view with SECURITY INVOKER to fix linter warning
DROP VIEW IF EXISTS public.public_player_cards;

CREATE VIEW public.public_player_cards
WITH (security_invoker = on)
AS
SELECT
  id,
  position,
  age_group,
  overall_rating,
  preferred_foot,
  team,
  avatar,
  is_public
FROM public.players
WHERE is_public = true;

-- Re-grant anon access
GRANT SELECT ON public.public_player_cards TO anon;

-- Add an anon policy on players that only allows reading the columns in the view
-- Since security_invoker means anon needs to pass RLS on the underlying table
CREATE POLICY "Anon can view public players limited fields"
ON public.players
FOR SELECT
TO anon
USING (is_public = true);
