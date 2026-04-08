
-- Create match_videos table
CREATE TABLE public.match_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'match',
  video_url TEXT NOT NULL,
  duration_seconds INTEGER,
  thumbnail_url TEXT,
  match_date DATE DEFAULT CURRENT_DATE,
  team TEXT,
  opponent TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.match_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all videos" ON public.match_videos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create videos" ON public.match_videos FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own videos" ON public.match_videos FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own videos" ON public.match_videos FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE TRIGGER update_match_videos_updated_at BEFORE UPDATE ON public.match_videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create video_events table
CREATE TABLE public.video_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.match_videos(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  timestamp_seconds NUMERIC NOT NULL,
  x_position NUMERIC,
  y_position NUMERIC,
  notes TEXT,
  tagged_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.video_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all events" ON public.video_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create events" ON public.video_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = tagged_by);
CREATE POLICY "Users can update own events" ON public.video_events FOR UPDATE TO authenticated USING (auth.uid() = tagged_by);
CREATE POLICY "Users can delete own events" ON public.video_events FOR DELETE TO authenticated USING (auth.uid() = tagged_by);

CREATE INDEX idx_video_events_video_id ON public.video_events(video_id);

-- Create video_annotations table
CREATE TABLE public.video_annotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.match_videos(id) ON DELETE CASCADE,
  timestamp_seconds NUMERIC NOT NULL,
  content TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.video_annotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all annotations" ON public.video_annotations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create annotations" ON public.video_annotations FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own annotations" ON public.video_annotations FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own annotations" ON public.video_annotations FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE INDEX idx_video_annotations_video_id ON public.video_annotations(video_id);

-- Create match-videos storage bucket (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('match-videos', 'match-videos', false);

-- Storage policies
CREATE POLICY "Authenticated users can upload videos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'match-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Authenticated users can view videos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'match-videos');
CREATE POLICY "Users can update own videos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'match-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own videos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'match-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
