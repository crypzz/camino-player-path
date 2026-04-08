import { PlayerStat } from '@/hooks/useVideoStats';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  stats: PlayerStat[];
}

export default function VideoStatsPanel({ stats }: Props) {
  if (stats.length === 0) return <p className="text-sm text-muted-foreground p-4 text-center">No stats yet. Tag events to see player statistics.</p>;

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
