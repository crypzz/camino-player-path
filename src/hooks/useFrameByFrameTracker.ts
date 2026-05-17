import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export interface TrackerOptions {
  intervalSec: number;   // sample every N seconds
  frameWidth: number;    // resize width for the JPEG sent to the AI
  detectBall: boolean;
  replaceExisting: boolean; // wipe prior AI rows before starting
}

export const DEFAULT_TRACKER_OPTIONS: TrackerOptions = {
  intervalSec: 2,
  frameWidth: 720,
  detectBall: true,
  replaceExisting: true,
};

export interface TrackerProgress {
  running: boolean;
  processed: number;
  total: number;
  currentTs: number | null;
  lastDetections: number | null;
  failures: number;
  error: string | null;
}

const INITIAL: TrackerProgress = {
  running: false,
  processed: 0,
  total: 0,
  currentTs: null,
  lastDetections: null,
  failures: 0,
  error: null,
};

async function seekAndCapture(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  ts: number,
  targetWidth: number,
): Promise<string> {
  await new Promise<void>((resolve, reject) => {
    const onSeeked = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error('Seek failed')); };
    const cleanup = () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
    };
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    try {
      video.currentTime = ts;
    } catch (e) {
      cleanup();
      reject(e as Error);
    }
  });

  // Let the decoder render one paint
  await new Promise((r) => requestAnimationFrame(() => r(null)));

  const ratio = video.videoWidth > 0 ? video.videoHeight / video.videoWidth : 9 / 16;
  const w = Math.min(targetWidth, video.videoWidth || targetWidth);
  const h = Math.round(w * ratio);
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No 2D context');
  ctx.drawImage(video, 0, 0, w, h);

  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('toBlob failed'))),
      'image/jpeg',
      0.7,
    ),
  );

  // Encode to base64 (no data: prefix)
  const buf = await blob.arrayBuffer();
  let bin = '';
  const bytes = new Uint8Array(buf);
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

export function useFrameByFrameTracker(videoId: string) {
  const [progress, setProgress] = useState<TrackerProgress>(INITIAL);
  const cancelRef = useRef(false);
  const qc = useQueryClient();

  useEffect(() => () => { cancelRef.current = true; }, []);

  const cancel = useCallback(() => { cancelRef.current = true; }, []);

  const start = useCallback(async (signedVideoUrl: string, durationSec: number, opts: TrackerOptions) => {
    if (!signedVideoUrl || !Number.isFinite(durationSec) || durationSec <= 0) {
      setProgress({ ...INITIAL, error: 'Video not ready' });
      return;
    }

    cancelRef.current = false;
    const interval = Math.max(0.5, opts.intervalSec);
    const timestamps: number[] = [];
    for (let t = 0; t < durationSec; t += interval) timestamps.push(Math.min(t, durationSec - 0.05));
    if (timestamps.length === 0) timestamps.push(0);

    setProgress({ ...INITIAL, running: true, total: timestamps.length });

    // Set status -> processing
    await supabase
      .from('match_videos')
      .update({ status: 'processing', ai_processing_started_at: new Date().toISOString(), ai_processing_error: null })
      .eq('id', videoId);

    // Offscreen video + canvas
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.src = signedVideoUrl;
    const canvas = document.createElement('canvas');

    try {
      await new Promise<void>((resolve, reject) => {
        const ok = () => { cleanup(); resolve(); };
        const err = () => { cleanup(); reject(new Error('Could not load video for tracking')); };
        const cleanup = () => {
          video.removeEventListener('loadedmetadata', ok);
          video.removeEventListener('error', err);
        };
        video.addEventListener('loadedmetadata', ok);
        video.addEventListener('error', err);
      });

      let failures = 0;
      let lastDet: number | null = null;
      let firstFrame = true;

      for (let i = 0; i < timestamps.length; i++) {
        if (cancelRef.current) break;
        const ts = timestamps[i];
        setProgress((p) => ({ ...p, currentTs: ts }));

        try {
          const frame = await seekAndCapture(video, canvas, ts, opts.frameWidth);
          const { data, error } = await supabase.functions.invoke('detect-frame', {
            body: {
              video_id: videoId,
              timestamp_seconds: ts,
              frame_jpeg_b64: frame,
              detect_ball: opts.detectBall,
              replace_frame: firstFrame && opts.replaceExisting ? false : true,
              // We do a one-shot wipe right after we start, below.
            },
          });
          if (error) throw error;
          if (data?.error) throw new Error(String(data.error));
          lastDet = (data?.detections ?? 0) as number;

          if (firstFrame && opts.replaceExisting) {
            // Wipe old AI rows for this video (except the frame we just inserted)
            await supabase
              .from('player_tracking')
              .delete()
              .eq('video_id', videoId)
              .eq('source', 'ai')
              .neq('frame_number', data?.frame_number ?? -1);
            firstFrame = false;
          }
        } catch (e: any) {
          failures += 1;
          console.warn('Frame failed', ts, e?.message);
        }

        setProgress((p) => ({
          ...p,
          processed: i + 1,
          lastDetections: lastDet,
          failures,
        }));

        // Refresh tracking list every ~5 frames
        if ((i + 1) % 5 === 0) {
          qc.invalidateQueries({ queryKey: ['player-tracking', videoId] });
        }
      }

      qc.invalidateQueries({ queryKey: ['player-tracking', videoId] });

      const finalStatus = cancelRef.current ? 'ready' : 'ready';
      await supabase
        .from('match_videos')
        .update({ status: finalStatus, ai_processing_error: null })
        .eq('id', videoId);

      qc.invalidateQueries({ queryKey: ['match-video', videoId] });
      qc.invalidateQueries({ queryKey: ['match-videos'] });

      setProgress((p) => ({ ...p, running: false, currentTs: null }));
    } catch (e: any) {
      const msg = e?.message || 'Tracker failed';
      await supabase
        .from('match_videos')
        .update({ status: 'error', ai_processing_error: msg })
        .eq('id', videoId);
      setProgress((p) => ({ ...p, running: false, error: msg }));
    } finally {
      video.src = '';
      video.removeAttribute('src');
      video.load();
    }
  }, [videoId, qc]);

  return { progress, start, cancel };
}
