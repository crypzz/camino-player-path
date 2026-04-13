import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export interface VideoPlayerHandle {
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
  togglePlay: () => void;
}

interface Props {
  src: string;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, Props>(({ src, onTimeUpdate, onDurationChange }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  onTimeUpdateRef.current = onTimeUpdate;

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState('1');

  useImperativeHandle(ref, () => ({
    seekTo: (s) => { if (videoRef.current) videoRef.current.currentTime = s; },
    getCurrentTime: () => videoRef.current?.currentTime ?? 0,
    togglePlay: () => { playing ? videoRef.current?.pause() : videoRef.current?.play(); },
  }));

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    playing ? videoRef.current.pause() : videoRef.current.play();
  }, [playing]);

  const skip = useCallback((delta: number) => {
    if (videoRef.current) videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration, videoRef.current.currentTime + delta));
  }, []);

  // Use rAF loop for smooth time tracking instead of timeupdate event
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let lastReported = -1;

    const tick = () => {
      if (v.paused && lastReported === v.currentTime) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const t = v.currentTime;
      if (Math.abs(t - lastReported) > 0.05) {
        lastReported = t;
        setCurrentTime(t);
        onTimeUpdateRef.current?.(t);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const onPlay = () => setPlaying(true);
    const onPause = () => {
      setPlaying(false);
      // Report final time on pause
      setCurrentTime(v.currentTime);
      onTimeUpdateRef.current?.(v.currentTime);
    };
    const onSeeked = () => {
      setCurrentTime(v.currentTime);
      onTimeUpdateRef.current?.(v.currentTime);
    };
    const onDur = () => { setDuration(v.duration); onDurationChange?.(v.duration); };

    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('seeked', onSeeked);
    v.addEventListener('loadedmetadata', onDur);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('seeked', onSeeked);
      v.removeEventListener('loadedmetadata', onDur);
    };
  }, [onDurationChange]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = parseFloat(speed);
  }, [speed]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      if (e.code === 'ArrowLeft') { e.preventDefault(); skip(-5); }
      if (e.code === 'ArrowRight') { e.preventDefault(); skip(5); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [togglePlay, skip]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleScrub = (values: number[]) => {
    const t = values[0];
    if (videoRef.current) videoRef.current.currentTime = t;
  };

  return (
    <>
      <video ref={videoRef} src={src} className="w-full aspect-video object-contain bg-black" muted={muted} playsInline preload="auto" />
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 z-20">
        {/* Scrub bar */}
        <div className="px-1 mb-2">
          <Slider
            min={0}
            max={duration || 1}
            step={0.1}
            value={[currentTime]}
            onValueChange={handleScrub}
            className="w-full [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-primary [&_.relative]:h-1 [&_.absolute]:bg-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => skip(-5)}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white/20" onClick={togglePlay}>
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => skip(5)}>
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:bg-white/20" onClick={() => skip(-1/30)} title="Previous frame">
            <span className="text-[10px] font-mono">‹F</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:bg-white/20" onClick={() => skip(1/30)} title="Next frame">
            <span className="text-[10px] font-mono">F›</span>
          </Button>
          <span className="text-xs text-white/80 font-mono min-w-[70px]">{fmt(currentTime)} / {fmt(duration)}</span>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setMuted(!muted)}>
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Select value={speed} onValueChange={setSpeed}>
            <SelectTrigger className="h-7 w-16 text-xs bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.25">0.25x</SelectItem>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;
