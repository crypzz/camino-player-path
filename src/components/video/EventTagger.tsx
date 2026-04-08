import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateVideoEvent, EVENT_TYPES } from '@/hooks/useVideoEvents';
import { toast } from 'sonner';
import { Crosshair, Goal, Shield, Footprints, Zap, Hand, AlertTriangle, Star, MapPin, X } from 'lucide-react';

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
  const [pitchOpen, setPitchOpen] = useState(false);
  const [pitchPos, setPitchPos] = useState<{ x: number; y: number } | null>(null);
  const createEvent = useCreateVideoEvent();

  const tag = async (eventType: string) => {
    if (!selectedPlayer) { toast.error('Select a player first'); return; }
    try {
      await createEvent.mutateAsync({
        video_id: videoId,
        player_id: selectedPlayer,
        event_type: eventType,
        timestamp_seconds: currentTime,
        x_position: pitchPos?.x,
        y_position: pitchPos?.y,
      });
      toast.success(`${eventType} tagged`);
      setPitchPos(null);
    } catch { toast.error('Failed to tag event'); }
  };

  return (
    <div className="space-y-2">
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

        <div className="h-6 w-px bg-border" />

        <Button
          variant={pitchOpen ? 'default' : 'outline'}
          size="sm"
          className="h-8 text-xs gap-1"
          onClick={() => setPitchOpen(!pitchOpen)}
        >
          <MapPin className="h-3.5 w-3.5" />
          {pitchPos ? `(${pitchPos.x}, ${pitchPos.y})` : 'Pitch'}
        </Button>

        {pitchPos && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setPitchPos(null)}>
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {pitchOpen && (
        <PitchMiniMap position={pitchPos} onSelect={(pos) => setPitchPos(pos)} />
      )}
    </div>
  );
}

function PitchMiniMap({ position, onSelect }: { position: { x: number; y: number } | null; onSelect: (pos: { x: number; y: number }) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    onSelect({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }, [onSelect]);

  return (
    <div className="p-3 rounded-xl bg-card border border-border">
      <p className="text-[10px] text-muted-foreground mb-2">Click on the pitch to mark event position</p>
      <svg
        ref={svgRef}
        viewBox="0 0 340 220"
        className="w-full max-w-md cursor-crosshair rounded-lg"
        onClick={handleClick}
        style={{ aspectRatio: '340/220' }}
      >
        {/* Pitch background */}
        <rect x="0" y="0" width="340" height="220" rx="4" fill="hsl(140, 40%, 22%)" />

        {/* Outer boundary */}
        <rect x="10" y="10" width="320" height="200" rx="2" fill="none" stroke="hsla(0,0%,100%,0.35)" strokeWidth="1.5" />

        {/* Center line */}
        <line x1="170" y1="10" x2="170" y2="210" stroke="hsla(0,0%,100%,0.35)" strokeWidth="1" />

        {/* Center circle */}
        <circle cx="170" cy="110" r="30" fill="none" stroke="hsla(0,0%,100%,0.35)" strokeWidth="1" />
        <circle cx="170" cy="110" r="2" fill="hsla(0,0%,100%,0.5)" />

        {/* Left penalty area */}
        <rect x="10" y="50" width="52" height="120" fill="none" stroke="hsla(0,0%,100%,0.3)" strokeWidth="1" />
        {/* Left goal area */}
        <rect x="10" y="78" width="20" height="64" fill="none" stroke="hsla(0,0%,100%,0.3)" strokeWidth="1" />
        {/* Left penalty spot */}
        <circle cx="46" cy="110" r="2" fill="hsla(0,0%,100%,0.5)" />
        {/* Left penalty arc */}
        <path d="M 62 88 A 30 30 0 0 1 62 132" fill="none" stroke="hsla(0,0%,100%,0.25)" strokeWidth="1" />

        {/* Right penalty area */}
        <rect x="278" y="50" width="52" height="120" fill="none" stroke="hsla(0,0%,100%,0.3)" strokeWidth="1" />
        {/* Right goal area */}
        <rect x="310" y="78" width="20" height="64" fill="none" stroke="hsla(0,0%,100%,0.3)" strokeWidth="1" />
        {/* Right penalty spot */}
        <circle cx="294" cy="110" r="2" fill="hsla(0,0%,100%,0.5)" />
        {/* Right penalty arc */}
        <path d="M 278 88 A 30 30 0 0 0 278 132" fill="none" stroke="hsla(0,0%,100%,0.25)" strokeWidth="1" />

        {/* Corner arcs */}
        <path d="M 10 16 A 6 6 0 0 1 16 10" fill="none" stroke="hsla(0,0%,100%,0.25)" strokeWidth="1" />
        <path d="M 324 10 A 6 6 0 0 1 330 16" fill="none" stroke="hsla(0,0%,100%,0.25)" strokeWidth="1" />
        <path d="M 16 210 A 6 6 0 0 1 10 204" fill="none" stroke="hsla(0,0%,100%,0.25)" strokeWidth="1" />
        <path d="M 330 204 A 6 6 0 0 1 324 210" fill="none" stroke="hsla(0,0%,100%,0.25)" strokeWidth="1" />

        {/* Selected position marker */}
        {position && (
          <>
            <circle
              cx={(position.x / 100) * 340}
              cy={(position.y / 100) * 220}
              r="8"
              fill="hsl(45, 100%, 58%)"
              fillOpacity="0.3"
              stroke="hsl(45, 100%, 58%)"
              strokeWidth="2"
            />
            <circle
              cx={(position.x / 100) * 340}
              cy={(position.y / 100) * 220}
              r="3"
              fill="hsl(45, 100%, 58%)"
            />
          </>
        )}
      </svg>
    </div>
  );
}
