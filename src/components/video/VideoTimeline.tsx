import { useRef, useCallback } from 'react';
import { VideoEvent, EVENT_COLORS } from '@/hooks/useVideoEvents';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  duration: number;
  currentTime: number;
  events: VideoEvent[];
  onSeek: (time: number) => void;
}

export default function VideoTimeline({ duration, currentTime, events, onSeek }: Props) {
  const barRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!barRef.current || !duration) return;
    const rect = barRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(pct * duration);
  }, [duration, onSeek]);

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-1">
      <div
        ref={barRef}
        className="relative h-8 bg-secondary rounded-lg cursor-pointer group"
        onClick={handleClick}
      >
        {/* Progress */}
        <div className="absolute inset-y-0 left-0 bg-primary/20 rounded-lg transition-all" style={{ width: `${progressPct}%` }} />

        {/* Scrubber */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-primary z-20 transition-all" style={{ left: `${progressPct}%` }}>
          <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-primary border-2 border-background shadow" />
        </div>

        {/* Event markers */}
        {events.map(ev => {
          const pos = duration > 0 ? (ev.timestamp_seconds / duration) * 100 : 0;
          return (
            <Tooltip key={ev.id}>
              <TooltipTrigger asChild>
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full z-10 border border-background cursor-pointer hover:scale-150 transition-transform"
                  style={{ left: `${pos}%`, backgroundColor: EVENT_COLORS[ev.event_type] || 'hsl(var(--muted-foreground))' }}
                  onClick={e => { e.stopPropagation(); onSeek(ev.timestamp_seconds); }}
                />
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                <span className="capitalize font-medium">{ev.event_type}</span> @ {Math.floor(ev.timestamp_seconds / 60)}:{Math.floor(ev.timestamp_seconds % 60).toString().padStart(2, '0')}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
