import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Zap, Target, Timer, TrendingUp, Activity } from 'lucide-react';
import { MatchPlayerStat } from '@/hooks/useMatchPlayerStats';

interface Props {
  stats: MatchPlayerStat[];
  players: { id: string; name: string }[];
}

export default function MatchAnalyticsDashboard({ stats, players }: Props) {
  const playerName = (id: string) => players.find(p => p.id === id)?.name || 'Unknown';

  const chartData = useMemo(() =>
    stats.map(s => ({
      name: playerName(s.player_id).split(' ')[0],
      activity: s.activity_score,
      movement: s.movement_intensity,
      touches: s.estimated_touches,
      sprints: s.sprint_count,
    })),
    [stats, players]
  );

  const radarData = useMemo(() => {
    if (stats.length === 0) return [];
    const top = stats[0];
    return [
      { metric: 'Activity', value: top.activity_score },
      { metric: 'Movement', value: top.movement_intensity },
      { metric: 'Touches', value: Math.min(100, top.estimated_touches * 5) },
      { metric: 'Sprints', value: Math.min(100, top.sprint_count * 10) },
      { metric: 'Distance', value: Math.min(100, top.distance_covered / 5) },
    ];
  }, [stats]);

  // Highlights
  const mostActive = stats[0];
  const mostConsistent = [...stats].sort((a, b) => {
    const aVar = Math.abs(a.movement_intensity - a.activity_score);
    const bVar = Math.abs(b.movement_intensity - b.activity_score);
    return aVar - bVar;
  })[0];

  if (stats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Activity className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">No stats generated yet</p>
        <p className="text-xs text-muted-foreground mt-1">Tag players and generate stats from tracking data</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="space-y-6 p-4">
        {/* Highlights */}
        <div className="grid grid-cols-2 gap-3">
          {mostActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Most Active</span>
              </div>
              <p className="text-sm font-display font-bold">{playerName(mostActive.player_id)}</p>
              <p className="text-2xl font-display font-bold text-primary">{mostActive.activity_score}</p>
            </motion.div>
          )}
          {mostConsistent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-xl bg-gradient-to-br from-success/10 to-transparent border border-success/20 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Most Consistent</span>
              </div>
              <p className="text-sm font-display font-bold">{playerName(mostConsistent.player_id)}</p>
              <p className="text-2xl font-display font-bold text-success">{mostConsistent.movement_intensity}</p>
            </motion.div>
          )}
        </div>

        {/* Bar Chart */}
        <div>
          <h4 className="text-xs font-semibold text-foreground mb-3">Player Performance Comparison</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 13%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(220, 15%, 50%)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(220, 15%, 50%)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(225, 25%, 8%)',
                    border: '1px solid hsl(225, 15%, 13%)',
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="activity" fill="hsl(45, 100%, 58%)" radius={[4, 4, 0, 0]} name="Activity" />
                <Bar dataKey="movement" fill="hsl(215, 95%, 58%)" radius={[4, 4, 0, 0]} name="Movement" />
                <Bar dataKey="touches" fill="hsl(160, 72%, 42%)" radius={[4, 4, 0, 0]} name="Touches" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Player Radar */}
        {radarData.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-3">
              Top Player — {playerName(stats[0].player_id)}
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(225, 15%, 15%)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'hsl(220, 15%, 50%)' }} />
                  <Radar dataKey="value" fill="hsl(45, 100%, 58%)" fillOpacity={0.2} stroke="hsl(45, 100%, 58%)" strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Player Stats Table */}
        <div>
          <h4 className="text-xs font-semibold text-foreground mb-3">All Player Stats</h4>
          <div className="space-y-2">
            {stats.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50"
              >
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{playerName(s.player_id)}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Zap className="h-2.5 w-2.5" /> {s.activity_score}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Target className="h-2.5 w-2.5" /> {s.estimated_touches} touches
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Timer className="h-2.5 w-2.5" /> {Math.round(s.time_on_field / 60)}m
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className={`text-[10px] h-5 ${s.integrated ? 'border-success/30 text-success' : 'border-muted-foreground/30'}`}>
                  {s.integrated ? 'Synced' : 'Pending'}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
