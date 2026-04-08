import { useState } from 'react';
import { PlayerStat } from '@/hooks/useVideoStats';
import { VideoEvent } from '@/hooks/useVideoEvents';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EVENT_COLORS: Record<string, string> = {
  touch: 'hsl(215, 95%, 58%)',
  pass: 'hsl(45, 100%, 58%)',
  shot: 'hsl(30, 95%, 52%)',
  goal: 'hsl(160, 72%, 42%)',
  assist: 'hsl(160, 72%, 62%)',
  tackle: 'hsl(0, 72%, 51%)',
  foul: 'hsl(0, 50%, 40%)',
  save: 'hsl(270, 60%, 55%)',
  cross: 'hsl(190, 70%, 50%)',
  dribble: 'hsl(50, 90%, 50%)',
  interception: 'hsl(340, 60%, 50%)',
};

function PitchHeatMap({ events, filterType }: { events: VideoEvent[]; filterType: string }) {
  const dots = events.filter(e => e.x_position != null && e.y_position != null && (filterType === 'all' || e.event_type === filterType));

  if (dots.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-xs py-8">
        No positioned events yet. Use the pitch mini-map when tagging.
      </div>
    );
  }

  return (
    <svg viewBox="0 0 100 140" className="w-full h-full" style={{ maxHeight: 220 }}>
      <rect x="0" y="0" width="100" height="140" rx="2" fill="hsl(140, 40%, 28%)" />
      <rect x="5" y="5" width="90" height="130" rx="1" fill="none" stroke="hsla(0,0%,100%,0.3)" strokeWidth="0.5" />
      <line x1="5" y1="70" x2="95" y2="70" stroke="hsla(0,0%,100%,0.3)" strokeWidth="0.5" />
      <circle cx="50" cy="70" r="12" fill="none" stroke="hsla(0,0%,100%,0.3)" strokeWidth="0.5" />
      <circle cx="50" cy="70" r="1" fill="hsla(0,0%,100%,0.3)" />
      <rect x="20" y="5" width="60" height="22" fill="none" stroke="hsla(0,0%,100%,0.3)" strokeWidth="0.5" />
      <rect x="20" y="113" width="60" height="22" fill="none" stroke="hsla(0,0%,100%,0.3)" strokeWidth="0.5" />
      <rect x="32" y="5" width="36" height="10" fill="none" stroke="hsla(0,0%,100%,0.3)" strokeWidth="0.5" />
      <rect x="32" y="125" width="36" height="10" fill="none" stroke="hsla(0,0%,100%,0.3)" strokeWidth="0.5" />
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {dots.map((e, i) => {
        const x = 5 + (e.x_position! / 100) * 90;
        const y = 5 + (e.y_position! / 100) * 130;
        const color = EVENT_COLORS[e.event_type] || 'hsl(215, 95%, 58%)';
        return (
          <g key={e.id || i}>
            <circle cx={x} cy={y} r="4" fill={color} opacity={0.25} filter="url(#glow)" />
            <circle cx={x} cy={y} r="1.8" fill={color} opacity={0.85} />
          </g>
        );
      })}
    </svg>
  );
}

interface Props {
  stats: PlayerStat[];
  events?: VideoEvent[];
}

export default function VideoStatsPanel({ stats, events = [] }: Props) {
  const [heatFilter, setHeatFilter] = useState('all');

  if (stats.length === 0 && events.length === 0) return <p className="text-sm text-muted-foreground p-4 text-center">No stats yet. Tag events to see player statistics.</p>;

  const chartData = stats.map(s => ({
    name: s.playerName?.split(' ')[0] || '?',
    Touches: s.touches,
    Passes: s.passes,
    Shots: s.shots,
    Goals: s.goals,
    Tackles: s.tackles,
  }));

  return (
    <ScrollArea className="h-[400px]">
      <div className="p-3 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pitch Map</p>
            <Select value={heatFilter} onValueChange={setHeatFilter}>
              <SelectTrigger className="h-6 w-28 text-[10px] bg-secondary/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="touch">Touches</SelectItem>
                <SelectItem value="pass">Passes</SelectItem>
                <SelectItem value="shot">Shots</SelectItem>
                <SelectItem value="goal">Goals</SelectItem>
                <SelectItem value="tackle">Tackles</SelectItem>
                <SelectItem value="dribble">Dribbles</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-secondary/30 rounded-lg p-2 flex items-center justify-center" style={{ minHeight: 180 }}>
            <PitchHeatMap events={events} filterType={heatFilter} />
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={12}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} width={24} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="Touches" fill="hsl(215, 95%, 58%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Passes" fill="hsl(45, 100%, 58%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Shots" fill="hsl(30, 95%, 52%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Goals" fill="hsl(160, 72%, 42%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Tackles" fill="hsl(0, 72%, 51%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="space-y-3">
          {stats.map(s => (
            <div key={s.playerId} className="p-3 rounded-lg bg-secondary/50 space-y-2">
              <p className="text-sm font-semibold">{s.playerName}</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['Touches', s.touches], ['Passes', s.passes], ['Shots', s.shots],
                  ['Goals', s.goals], ['Assists', s.assists], ['Tackles', s.tackles],
                  ['Intercepts', s.interceptions], ['Fouls', s.fouls], ['Total', s.total],
                ].map(([label, val]) => (
                  <div key={label as string} className="text-center">
                    <p className="text-lg font-bold text-foreground">{val as number}</p>
                    <p className="text-[10px] text-muted-foreground">{label as string}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}