-- Allow anonymous (unauthenticated) users to read public players
CREATE POLICY "Anyone can view public players"
ON public.players
FOR SELECT
TO anon
USING (is_public = true);

-- Allow anonymous users to read evaluations for public players
CREATE POLICY "Anyone can view public player evaluations"
ON public.evaluations
FOR SELECT
TO anon
USING (EXISTS (
  SELECT 1 FROM public.players
  WHERE players.id = evaluations.player_id AND players.is_public = true
));

-- Allow anonymous users to read fitness tests for public players
CREATE POLICY "Anyone can view public player fitness tests"
ON public.fitness_tests
FOR SELECT
TO anon
USING (EXISTS (
  SELECT 1 FROM public.players
  WHERE players.id = fitness_tests.player_id AND players.is_public = true
));

-- Allow anonymous users to read development goals for public players
CREATE POLICY "Anyone can view public player goals"
ON public.development_goals
FOR SELECT
TO anon
USING (EXISTS (
  SELECT 1 FROM public.players
  WHERE players.id = development_goals.player_id AND players.is_public = true
));