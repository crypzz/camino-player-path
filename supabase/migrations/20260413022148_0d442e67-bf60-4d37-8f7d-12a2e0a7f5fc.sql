
-- Add AI processing columns to match_videos
ALTER TABLE public.match_videos
  ADD COLUMN IF NOT EXISTS ai_processing_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS ai_processing_error text;

-- Add performance index for player tracking queries
CREATE INDEX IF NOT EXISTS idx_player_tracking_video_timestamp
  ON public.player_tracking (video_id, timestamp_seconds);
