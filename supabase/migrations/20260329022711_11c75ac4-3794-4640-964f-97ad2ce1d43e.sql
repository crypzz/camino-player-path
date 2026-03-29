
-- Fitness test results table
CREATE TABLE public.fitness_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  tested_by uuid NOT NULL,
  test_date date NOT NULL DEFAULT CURRENT_DATE,
  
  -- Beep Test (shuttle run / VO2max proxy)
  beep_test_level numeric NULL,
  beep_test_shuttles integer NULL,
  
  -- Sprint times (seconds)
  sprint_10m numeric NULL,
  sprint_30m numeric NULL,
  
  -- Agility (seconds, e.g. T-test or Illinois)
  agility_time numeric NULL,
  
  -- Vertical jump (cm)
  vertical_jump numeric NULL,
  
  -- Endurance (e.g. distance in Cooper test, meters)
  endurance_distance numeric NULL,
  
  notes text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.fitness_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all fitness tests"
  ON public.fitness_tests FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create fitness tests"
  ON public.fitness_tests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = tested_by);

CREATE POLICY "Users can update own fitness tests"
  ON public.fitness_tests FOR UPDATE TO authenticated
  USING (auth.uid() = tested_by);

CREATE POLICY "Users can delete own fitness tests"
  ON public.fitness_tests FOR DELETE TO authenticated
  USING (auth.uid() = tested_by);

-- Function to convert raw fitness test results to 1-10 scores
-- and update the player's physical JSON metrics
CREATE OR REPLACE FUNCTION public.update_physical_from_fitness()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  latest RECORD;
  sprint10_score integer;
  sprint30_score integer;
  agility_score integer;
  vjump_score integer;
  endurance_score integer;
  current_physical jsonb;
BEGIN
  -- Get the latest fitness test for this player
  SELECT * INTO latest FROM public.fitness_tests
  WHERE player_id = NEW.player_id
  ORDER BY test_date DESC, created_at DESC
  LIMIT 1;

  IF latest IS NULL THEN RETURN NEW; END IF;

  -- Get current physical metrics
  SELECT physical INTO current_physical FROM public.players WHERE id = NEW.player_id;

  -- Convert 10m sprint (seconds) to 1-10 score (lower is better)
  -- U12-U18 range: ~1.5s (elite) to ~2.5s (beginner)
  IF latest.sprint_10m IS NOT NULL THEN
    sprint10_score := GREATEST(1, LEAST(10, ROUND(11 - (latest.sprint_10m - 1.4) * 9)));
  ELSE
    sprint10_score := COALESCE((current_physical->>'10m Sprint')::integer, 5);
  END IF;

  -- Convert 30m sprint (seconds): ~3.8s (elite) to ~5.5s (beginner)
  IF latest.sprint_30m IS NOT NULL THEN
    sprint30_score := GREATEST(1, LEAST(10, ROUND(11 - (latest.sprint_30m - 3.6) * 5.3)));
  ELSE
    sprint30_score := COALESCE((current_physical->>'30m Sprint')::integer, 5);
  END IF;

  -- Convert agility time (seconds): ~8s (elite) to ~13s (beginner)
  IF latest.agility_time IS NOT NULL THEN
    agility_score := GREATEST(1, LEAST(10, ROUND(11 - (latest.agility_time - 7.5) * 1.8)));
  ELSE
    agility_score := COALESCE((current_physical->>'Agility')::integer, 5);
  END IF;

  -- Convert vertical jump (cm): 20cm (low) to 60cm (elite)
  IF latest.vertical_jump IS NOT NULL THEN
    vjump_score := GREATEST(1, LEAST(10, ROUND((latest.vertical_jump - 15) / 5.0)));
  ELSE
    vjump_score := COALESCE((current_physical->>'Vertical Jump')::integer, 5);
  END IF;

  -- Convert endurance/Cooper distance (meters): 1500m (low) to 3000m (elite)
  IF latest.endurance_distance IS NOT NULL THEN
    endurance_score := GREATEST(1, LEAST(10, ROUND((latest.endurance_distance - 1400) / 180.0)));
  ELSE
    endurance_score := COALESCE((current_physical->>'Endurance')::integer, 5);
  END IF;

  -- Update the physical JSON on the player
  UPDATE public.players
  SET physical = jsonb_build_object(
    '10m Sprint', sprint10_score,
    '30m Sprint', sprint30_score,
    'Agility', agility_score,
    'Vertical Jump', vjump_score,
    'Endurance', endurance_score
  ),
  updated_at = now()
  WHERE id = NEW.player_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_physical_on_fitness_test
AFTER INSERT OR UPDATE ON public.fitness_tests
FOR EACH ROW EXECUTE FUNCTION public.update_physical_from_fitness();
