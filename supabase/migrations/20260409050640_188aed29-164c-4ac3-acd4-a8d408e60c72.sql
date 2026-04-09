
-- Add status and age_group to match_videos
ALTER TABLE public.match_videos 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'ready',
ADD COLUMN IF NOT EXISTS age_group text;

-- Player tracking table for bounding box data
CREATE TABLE public.player_tracking (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id uuid NOT NULL REFERENCES public.match_videos(id) ON DELETE CASCADE,
  player_id uuid REFERENCES public.players(id) ON DELETE SET NULL,
  tracking_id text NOT NULL,
  frame_number integer NOT NULL,
  timestamp_seconds numeric NOT NULL,
  bbox_x numeric NOT NULL DEFAULT 0,
  bbox_y numeric NOT NULL DEFAULT 0,
  bbox_width numeric NOT NULL DEFAULT 0,
  bbox_height numeric NOT NULL DEFAULT 0,
  confidence numeric DEFAULT 1.0,
  source text NOT NULL DEFAULT 'manual',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.player_tracking ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_player_tracking_video ON public.player_tracking(video_id);
CREATE INDEX idx_player_tracking_player ON public.player_tracking(player_id);
CREATE INDEX idx_player_tracking_frame ON public.player_tracking(video_id, frame_number);

CREATE POLICY "Authenticated users can view tracking" ON public.player_tracking
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Video creators can insert tracking" ON public.player_tracking
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Video creators can update tracking" ON public.player_tracking
  FOR UPDATE TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Video creators can delete tracking" ON public.player_tracking
  FOR DELETE TO authenticated
  USING (auth.uid() = created_by);

-- Match player stats table
CREATE TABLE public.match_player_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id uuid NOT NULL REFERENCES public.match_videos(id) ON DELETE CASCADE,
  player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  movement_intensity numeric DEFAULT 0,
  activity_score numeric DEFAULT 0,
  estimated_touches integer DEFAULT 0,
  time_on_field numeric DEFAULT 0,
  positions_tracked integer DEFAULT 0,
  sprint_count integer DEFAULT 0,
  avg_speed numeric DEFAULT 0,
  distance_covered numeric DEFAULT 0,
  heatmap_data jsonb DEFAULT '[]'::jsonb,
  integrated boolean NOT NULL DEFAULT false,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(video_id, player_id)
);

ALTER TABLE public.match_player_stats ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_match_player_stats_video ON public.match_player_stats(video_id);
CREATE INDEX idx_match_player_stats_player ON public.match_player_stats(player_id);

CREATE POLICY "Authenticated users can view match stats" ON public.match_player_stats
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Video creators can insert match stats" ON public.match_player_stats
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Video creators can update match stats" ON public.match_player_stats
  FOR UPDATE TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Video creators can delete match stats" ON public.match_player_stats
  FOR DELETE TO authenticated
  USING (auth.uid() = created_by);

-- Trigger for updated_at on match_player_stats
CREATE TRIGGER update_match_player_stats_updated_at
  BEFORE UPDATE ON public.match_player_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
