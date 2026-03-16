
-- Fix overly permissive policies on development_goals
DROP POLICY "Users can create goals" ON public.development_goals;
DROP POLICY "Users can update goals" ON public.development_goals;
DROP POLICY "Users can delete goals" ON public.development_goals;

-- Goals should be managed by the player's creator (coach)
CREATE POLICY "Users can create goals for their players" ON public.development_goals
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.players WHERE id = player_id AND created_by = auth.uid())
);

CREATE POLICY "Users can update goals for their players" ON public.development_goals
FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.players WHERE id = player_id AND created_by = auth.uid())
);

CREATE POLICY "Users can delete goals for their players" ON public.development_goals
FOR DELETE TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.players WHERE id = player_id AND created_by = auth.uid())
);
