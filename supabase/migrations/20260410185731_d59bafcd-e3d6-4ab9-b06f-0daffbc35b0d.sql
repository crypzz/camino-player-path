
-- Create player_cvs table for storing CV data
CREATE TABLE public.player_cvs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  slug text NOT NULL UNIQUE,
  full_name text NOT NULL,
  position text NOT NULL DEFAULT '',
  preferred_foot text DEFAULT 'Right',
  height integer,
  weight integer,
  age integer,
  date_of_birth date,
  current_team text DEFAULT '',
  previous_teams text[] DEFAULT '{}',
  achievements text[] DEFAULT '{}',
  bio text DEFAULT '',
  highlight_video_url text,
  template text NOT NULL DEFAULT 'classic',
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.player_cvs ENABLE ROW LEVEL SECURITY;

-- Owner can do everything
CREATE POLICY "Users can view own CVs"
  ON public.player_cvs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create CVs"
  ON public.player_cvs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CVs"
  ON public.player_cvs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own CVs"
  ON public.player_cvs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Public can view published CVs (for shareable links)
CREATE POLICY "Anyone can view published CVs"
  ON public.player_cvs FOR SELECT
  TO anon
  USING (is_published = true);

-- Directors can view all CVs
CREATE POLICY "Directors can view all CVs"
  ON public.player_cvs FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'director'));

-- Updated_at trigger
CREATE TRIGGER update_player_cvs_updated_at
  BEFORE UPDATE ON public.player_cvs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for slug lookups
CREATE INDEX idx_player_cvs_slug ON public.player_cvs(slug);
CREATE INDEX idx_player_cvs_player_id ON public.player_cvs(player_id);
