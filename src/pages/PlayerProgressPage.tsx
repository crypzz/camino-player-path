import { usePlayers } from '@/hooks/usePlayers';
import { PlayerRadarChart } from '@/components/PlayerRadarChart';
import { CPIScoreDisplay } from '@/components/CPIScoreDisplay';
import { CPIProgressChart } from '@/components/CPIProgressChart';
import { getCategoryAverage } from '@/types/player';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PlayerProgressPage() {
  const { data: players = [], isLoading } = usePlayers();
  const player = players[0]; // In player role, show first player (would be linked to auth user)

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">Loading...</div>;
  }

  if (!player) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
        No player data available yet.
      </div>
    );
  }

  const categories = ['technical', 'tactical', 'physical', 'mental'] as const;
  const categoryData = categories.map(cat => ({
    name: cat,
    avg: getCategoryAverage(player[cat]),
    metrics: player[cat] as Record<string, number>,
  }));

  const cpiHistory = player.cpiHistory;
  const latestCPI = cpiHistory[cpiHistory.length - 1]?.score ?? 0;
  const previousCPI = cpiHistory[cpiHistory.length - 2]?.score ?? latestCPI;
  const cpiDelta = latestCPI - previousCPI;

  const getTrendIcon = (delta: number) => {
    if (delta > 0) return <TrendingUp className="h-3.5 w-3.5 text-success" />;
    if (delta < 0) return <TrendingDown className="h-3.5 w-3.5 text-destructive" />;
    return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-bold text-foreground">My Progress</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your development over time</p>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-6">
          {/* CPI Trend Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" /> CPI Trend
              </h3>
              <div className="flex items-center gap-1.5 text-sm">
                {getTrendIcon(cpiDelta)}
                <span className={`font-display font-bold ${cpiDelta > 0 ? 'text-success' : cpiDelta < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {cpiDelta > 0 ? '+' : ''}{cpiDelta.toFixed(1)}
                </span>
              </div>
            </div>
            <CPIProgressChart player={player} />
          </motion.div>

          {/* Category Breakdown Tabs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Tabs defaultValue="technical" className="w-full">
              <TabsList className="w-full bg-secondary/50 h-9">
                {categories.map(cat => (
                  <TabsTrigger key={cat} value={cat} className="flex-1 text-xs capitalize">{cat}</TabsTrigger>
                ))}
              </TabsList>

              {categories.map(cat => {
                const metrics = player[cat] as Record<string, number>;
                const avg = getCategoryAverage(metrics);
                return (
                  <TabsContent key={cat} value={cat} className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="glass-card rounded-xl p-5">
                        <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 text-center capitalize">{cat} Radar</h4>
                        <PlayerRadarChart player={player} category={cat} />
                      </div>
                      <div className="glass-card rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xs uppercase tracking-wider text-muted-foreground capitalize">{cat} Metrics</h4>
                          <span className="text-sm font-display font-bold text-primary">{avg}/10</span>
                        </div>
                        <div className="space-y-3">
                          {Object.entries(metrics).map(([key, val]) => (
                            <div key={key}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground">{key}</span>
                                <span className="text-xs font-display font-bold text-foreground">{val}</span>
                              </div>
                              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: val >= 7 ? 'hsl(var(--success))' : val >= 5 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))' }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(val / 10) * 100}%` }}
                                  transition={{ duration: 0.6, delay: 0.1 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </motion.div>

          {/* All Categories Overview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-xl p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">Category Comparison</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categoryData.map(({ name, avg }) => {
                const weights: Record<string, string> = { technical: '40%', tactical: '30%', physical: '20%', mental: '10%' };
                return (
                  <div key={name} className="text-center p-4 rounded-lg bg-secondary/40">
                    <div className="text-2xl font-display font-bold text-foreground">{avg}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1 capitalize">{name}</div>
                    <div className="text-[10px] text-muted-foreground/50 mt-0.5">{weights[name]} weight</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5 flex justify-center">
            <CPIScoreDisplay player={player} size="lg" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-5">
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Player Info</h4>
            <div className="space-y-2.5 text-sm">
              {[
                ['Position', player.position],
                ['Team', player.team],
                ['Age', String(player.age)],
                ['Nationality', player.nationality],
                ['Height', `${player.height}cm`],
                ['Weight', `${player.weight}kg`],
                ['Preferred Foot', player.preferredFoot],
                ['Attendance', `${player.attendance}%`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CPI History Table */}
          {cpiHistory.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-xl p-5">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Evaluation History</h4>
              <div className="space-y-2">
                {cpiHistory.slice().reverse().map((entry, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                    <span className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</span>
                    <span className="text-xs font-display font-bold text-primary">{entry.score}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
