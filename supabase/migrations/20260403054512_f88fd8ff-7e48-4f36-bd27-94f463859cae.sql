
-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('coach', 'player', 'parent', 'director');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. RLS for user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Directors can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'director'));

CREATE POLICY "Directors can assign roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'director'));

CREATE POLICY "Directors can remove roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'director'));

-- 5. Create teams table
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  club_name text NOT NULL DEFAULT 'Camino FC',
  age_group text,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view teams"
ON public.teams FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Directors can create teams"
ON public.teams FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'director'));

CREATE POLICY "Directors can update teams"
ON public.teams FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'director'));

CREATE POLICY "Directors can delete teams"
ON public.teams FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'director'));

CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Create coach_assignments table
CREATE TABLE public.coach_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  coach_user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  assigned_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.coach_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view assignments"
ON public.coach_assignments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Directors can create assignments"
ON public.coach_assignments FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'director'));

CREATE POLICY "Directors can update assignments"
ON public.coach_assignments FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'director'));

CREATE POLICY "Directors can delete assignments"
ON public.coach_assignments FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'director'));

CREATE TRIGGER update_coach_assignments_updated_at
BEFORE UPDATE ON public.coach_assignments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Add team_id to players
ALTER TABLE public.players ADD COLUMN team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL;
