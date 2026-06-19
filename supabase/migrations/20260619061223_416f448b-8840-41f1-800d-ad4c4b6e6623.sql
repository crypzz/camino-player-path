-- =========================================================
-- TRAINING SESSIONS
-- =========================================================
CREATE TABLE public.training_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    session_date TIMESTAMPTZ,
    focus_area TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.training_sessions TO authenticated;
GRANT ALL ON public.training_sessions TO service_role;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches manage their own sessions"
ON public.training_sessions FOR ALL
USING (auth.uid() = coach_id)
WITH CHECK (auth.uid() = coach_id);

-- =========================================================
-- SESSION PLAYERS
-- =========================================================
CREATE TABLE public.session_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.training_sessions(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(session_id, player_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.session_players TO authenticated;
GRANT ALL ON public.session_players TO service_role;
ALTER TABLE public.session_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches manage players in their sessions"
ON public.session_players FOR ALL
USING (EXISTS (SELECT 1 FROM public.training_sessions s WHERE s.id = session_id AND s.coach_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.training_sessions s WHERE s.id = session_id AND s.coach_id = auth.uid()));

-- =========================================================
-- DRILLS
-- =========================================================
CREATE TABLE public.drills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    difficulty_level TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.drills TO authenticated;
GRANT ALL ON public.drills TO service_role;
ALTER TABLE public.drills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches manage their own drills"
ON public.drills FOR ALL
USING (auth.uid() = coach_id)
WITH CHECK (auth.uid() = coach_id);

-- =========================================================
-- SESSION DRILLS
-- =========================================================
CREATE TABLE public.session_drills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.training_sessions(id) ON DELETE CASCADE,
    drill_id UUID NOT NULL REFERENCES public.drills(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(session_id, drill_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.session_drills TO authenticated;
GRANT ALL ON public.session_drills TO service_role;
ALTER TABLE public.session_drills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches manage drills in their sessions"
ON public.session_drills FOR ALL
USING (EXISTS (SELECT 1 FROM public.training_sessions s WHERE s.id = session_id AND s.coach_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.training_sessions s WHERE s.id = session_id AND s.coach_id = auth.uid()));

-- =========================================================
-- COACHING NOTES (tied to match_videos)
-- =========================================================
CREATE TABLE public.coaching_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES public.match_videos(id) ON DELETE CASCADE,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    coach_id UUID NOT NULL,
    timestamp_seconds FLOAT,
    note TEXT NOT NULL,
    visibility TEXT NOT NULL DEFAULT 'private',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.coaching_notes TO authenticated;
GRANT ALL ON public.coaching_notes TO service_role;
ALTER TABLE public.coaching_notes ENABLE ROW LEVEL SECURITY;

-- Coaches fully manage their own notes
CREATE POLICY "Coaches manage their own notes"
ON public.coaching_notes FOR ALL
USING (auth.uid() = coach_id)
WITH CHECK (auth.uid() = coach_id);

-- Players can read notes shared with them (note about a player they own/are linked to)
CREATE POLICY "Players and parents read shared notes"
ON public.coaching_notes FOR SELECT
USING (
  visibility IN ('player', 'parent')
  AND EXISTS (
    SELECT 1 FROM public.players p
    WHERE p.id = coaching_notes.player_id
      AND p.created_by = auth.uid()
  )
);

-- =========================================================
-- updated_at triggers
-- =========================================================
CREATE TRIGGER update_training_sessions_updated_at
BEFORE UPDATE ON public.training_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_drills_updated_at
BEFORE UPDATE ON public.drills
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coaching_notes_updated_at
BEFORE UPDATE ON public.coaching_notes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();