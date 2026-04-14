const VIDEO_PROCESSING_STALE_MS = 10 * 60 * 1000;

type VideoProcessingState = {
  status: string;
  ai_processing_started_at: string | null;
};

export function isVideoProcessingStatus(status: string | null | undefined) {
  return status === 'processing' || status === 'queued';
}

export function isVideoProcessingStale(
  video: VideoProcessingState | null | undefined,
  now = Date.now()
) {
  if (!video || !isVideoProcessingStatus(video.status) || !video.ai_processing_started_at) {
    return false;
  }

  const startedAt = new Date(video.ai_processing_started_at).getTime();
  return Number.isFinite(startedAt) && now - startedAt > VIDEO_PROCESSING_STALE_MS;
}

export function getVideoDisplayStatus(video: VideoProcessingState | null | undefined) {
  if (!video) return 'ready';
  return isVideoProcessingStale(video) ? 'stalled' : video.status;
}
