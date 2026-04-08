import { VideoEvent, EVENT_COLORS, useDeleteVideoEvent } from '@/hooks/useVideoEvents';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  events: VideoEvent[];
  players: { id: string; name: string }[];
  onSeek: (time: number) => void;
}

export default function EventsList({ events, players, onSeek }: Props) {
  const deleteEvent = useDeleteVideoEvent();

  const fmt = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  if (events.length === 0) return <p className="text-sm text-muted-foreground p-4 text-center">No events tagged yet. Use the toolbar above to start tagging.</p>;

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-1 p-2">
        {events.map(ev => {
          const player = players.find(p => p.id === ev.player_id);
          return (
            <div
              key={ev.id}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors group"
              onClick={() => onSeek(ev.timestamp_seconds)}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: EVENT_COLORS[ev.event_type] }} />
              <span className="text-xs font-mono text-muted-foreground w-10 shrink-0">{fmt(ev.timestamp_seconds)}</span>
              <span className="text-xs font-medium capitalize flex-1">{ev.event_type}</span>
              <span className="text-xs text-muted-foreground truncate max-w-24">{player?.name || '—'}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={e => {
                  e.stopPropagation();
                  deleteEvent.mutate({ id: ev.id, videoId: ev.video_id }, { onSuccess: () => toast.success('Event removed') });
                }}
              >
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
