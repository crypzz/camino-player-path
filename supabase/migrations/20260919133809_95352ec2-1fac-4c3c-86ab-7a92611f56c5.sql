ALTER TABLE public.player_cvs
  ADD COLUMN IF NOT EXISTS contact_email text,
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS nationality text,
  ADD COLUMN IF NOT EXISTS social_handle text,
  ADD COLUMN IF NOT EXISTS cpi numeric,
  ADD COLUMN IF NOT EXISTS technical_score numeric,
  ADD COLUMN IF NOT EXISTS tactical_score numeric,
  ADD COLUMN IF NOT EXISTS physical_score numeric,
  ADD COLUMN IF NOT EXISTS mental_score numeric,
  ADD COLUMN IF NOT EXISTS global_rank integer,
  ADD COLUMN IF NOT EXISTS local_rank integer;