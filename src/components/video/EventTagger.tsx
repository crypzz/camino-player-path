import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateVideoEvent, EVENT_TYPES } from '@/hooks/useVideoEvents';
import { toast } from 'sonner';
import { Crosshair, Goal, Shield, Footprints, Zap, Hand, AlertTriangle, Star } from 'lucide-react';

const EVENT_ICONS: Record<string, React.ReactNode> = {
  touch: <Footprints className="h-3.5 w-3.5" />,
  pass: <Zap className="h-3.5 w-3.5" />,
  shot: <Crosshair className="h-3.5 w-3.5" />,
  goal: <Goal className="h-3.5 w-3.5" />,
  assist: <Star className="h-3.5 w-3.5" />,
  tackle: <Shield className="h-3.5 w-3.5" />,
  foul: <AlertTriangle className="h-3.5 w-3.5" />,
  save: <Hand className="h-3.5 w-3.5" />,
};

interface Props {
  videoId: string;
  currentTime: number;
  players: { id: string; name: string }[];
}

export default function EventTagger({ videoId, currentTime, players }: Props) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const createEvent = useCreateVideoEvent();

  const tag = async (eventType: string) => {
    if (!selectedPlayer) { toast.error('Select a player first'); return; }
    try {
      await createEvent.mutateAsync({ video_id: videoId, player_id: selectedPlayer, event_type: eventType, timestamp_seconds: currentTime });
      toast.success(`${eventType} tagged`);
    } catch { toast.error('Failed to tag event'); }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap p-3 rounded-xl bg-card border border-border">
      <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
        <SelectTrigger className="w-40 h-8 text-xs">
          <SelectValue placeholder="Select player" />
        </SelectTrigger>
        <SelectContent>
          {players.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
        </SelectContent>
      </Select>

      <div className="h-6 w-px bg-border" />

      {EVENT_TYPES.map(et => (
        <Button
          key={et}
          variant="outline"
          size="sm"
          className="h-8 text-xs capitalize gap-1"
          onClick={() => tag(et)}
          disabled={createEvent.isPending}
        >
          {EVENT_ICONS[et] || null}
          {et}
        </Button>
      ))}
    </div>
  );
}
