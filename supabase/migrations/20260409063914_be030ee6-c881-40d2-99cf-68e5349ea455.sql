
-- 1. Fix notifications INSERT policy: restrict to self-insert only
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.notifications;
CREATE POLICY "Users can create own notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 2. Remove anon policies exposing minor player data
DROP POLICY IF EXISTS "Anyone can view public players" ON public.players;
DROP POLICY IF EXISTS "Anyone can view public player evaluations" ON public.evaluations;
DROP POLICY IF EXISTS "Anyone can view public player fitness tests" ON public.fitness_tests;
DROP POLICY IF EXISTS "Anyone can view public player goals" ON public.development_goals;

-- 3. Create a restricted public view with only non-identifying fields
CREATE OR REPLACE VIEW public.public_player_cards AS
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

-- Grant anon access to the view only
GRANT SELECT ON public.public_player_cards TO anon;
