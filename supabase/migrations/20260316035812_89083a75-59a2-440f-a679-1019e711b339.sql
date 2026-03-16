
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'coach' CHECK (role IN ('coach', 'player', 'parent')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Players table
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  position TEXT NOT NULL,
  team TEXT NOT NULL,
  avatar TEXT DEFAULT '',
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  nationality TEXT DEFAULT '',
  preferred_foot TEXT DEFAULT 'Right' CHECK (preferred_foot IN ('Left', 'Right', 'Both')),
  height INTEGER DEFAULT 170,
  weight INTEGER DEFAULT 65,
  technical JSONB NOT NULL DEFAULT '{}',
  tactical JSONB NOT NULL DEFAULT '{}',
  physical JSONB NOT NULL DEFAULT '{}',
  mental JSONB NOT NULL DEFAULT '{}',
  attendance INTEGER DEFAULT 0,
  overall_rating NUMERIC(3,1) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all players" ON public.players FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create players" ON public.players FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own players" ON public.players FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own players" ON public.players FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Evaluations (CPI history entries)
CREATE TABLE public.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  evaluated_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  score NUMERIC(4,1) NOT NULL,
  technical NUMERIC(3,1) NOT NULL,
  tactical NUMERIC(3,1) NOT NULL,
  physical NUMERIC(3,1) NOT NULL,
  mental NUMERIC(3,1) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all evaluations" ON public.evaluations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create evaluations" ON public.evaluations FOR INSERT TO authenticated WITH CHECK (auth.uid() = evaluated_by);
CREATE POLICY "Users can update own evaluations" ON public.evaluations FOR UPDATE TO authenticated USING (auth.uid() = evaluated_by);
CREATE POLICY "Users can delete own evaluations" ON public.evaluations FOR DELETE TO authenticated USING (auth.uid() = evaluated_by);

-- Development goals
CREATE TABLE public.development_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'not-started' CHECK (status IN ('in-progress', 'completed', 'not-started')),
  due_date DATE,
  category TEXT NOT NULL CHECK (category IN ('technical', 'tactical', 'physical', 'mental')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.development_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all goals" ON public.development_goals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create goals" ON public.development_goals FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update goals" ON public.development_goals FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete goals" ON public.development_goals FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.development_goals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
