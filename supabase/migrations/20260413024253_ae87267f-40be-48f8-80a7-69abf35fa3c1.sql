
-- Create schedule_sessions table
CREATE TABLE public.schedule_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'training',
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  session_time TEXT NOT NULL DEFAULT '09:00',
  location TEXT NOT NULL DEFAULT '',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.schedule_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view sessions"
  ON public.schedule_sessions FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create sessions"
  ON public.schedule_sessions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own sessions"
  ON public.schedule_sessions FOR UPDATE TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own sessions"
  ON public.schedule_sessions FOR DELETE TO authenticated
  USING (auth.uid() = created_by);

CREATE TRIGGER update_schedule_sessions_updated_at
  BEFORE UPDATE ON public.schedule_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create attendance_records table
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.schedule_sessions(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_type TEXT NOT NULL DEFAULT 'training',
  session_title TEXT NOT NULL DEFAULT '',
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  present BOOLEAN NOT NULL DEFAULT false,
  recorded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_date, session_title, player_id)
);

ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view attendance"
  ON public.attendance_records FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can record attendance"
  ON public.attendance_records FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = recorded_by);

CREATE POLICY "Users can update own attendance records"
  ON public.attendance_records FOR UPDATE TO authenticated
  USING (auth.uid() = recorded_by);

CREATE POLICY "Users can delete own attendance records"
  ON public.attendance_records FOR DELETE TO authenticated
  USING (auth.uid() = recorded_by);

CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON public.attendance_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_attendance_session_date ON public.attendance_records(session_date);
CREATE INDEX idx_attendance_player ON public.attendance_records(player_id);
CREATE INDEX idx_schedule_date ON public.schedule_sessions(session_date);
