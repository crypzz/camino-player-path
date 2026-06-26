-- Phase 1: Player discovery fields
ALTER TABLE public.players
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS jersey_number integer,
  ADD COLUMN IF NOT EXISTS strengths text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS achievements text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS available_for_transfer boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS verification_badge boolean NOT NULL DEFAULT false;

-- Follows: a user follows a player
CREATE TABLE IF NOT EXISTS public.player_follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (follower_id, player_id)
);

GRANT SELECT, INSERT, DELETE ON public.player_follows TO authenticated;
GRANT ALL ON public.player_follows TO service_role;

ALTER TABLE public.player_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view follows"
  ON public.player_follows FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can follow"
  ON public.player_follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON public.player_follows FOR DELETE TO authenticated USING (auth.uid() = follower_id);

-- Expand the public discovery view to surface profile + discovery data
CREATE OR REPLACE VIEW public.public_player_cards AS
  SELECT id, "position", age_group, overall_rating, preferred_foot, team, avatar, is_public,
         name, location, nationality, age, bio, strengths, achievements,
         available_for_transfer, verification_badge
  FROM public.players
  WHERE is_public = true;

GRANT SELECT ON public.public_player_cards TO anon, authenticated;