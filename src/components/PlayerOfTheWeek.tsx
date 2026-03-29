import { usePlayers } from '@/hooks/usePlayers';
import { useRankings } from '@/hooks/useRankings';
import { calculateCPI } from '@/types/player';
import { Trophy, TrendingUp, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RankingBadge } from './RankingBadge';
import { motion } from 'framer-motion';

export function PlayerOfTheWeek() {
  const { data: players = [] } = usePlayers();
  const { data: rankings = [] } = useRankings();

  if (players.length === 0) return null;

  // Find highest CPI player (top ranked)
  const topPlayer = players.reduce((best, p) => {
    const cpi = calculateCPI(p);
    const bestCpi = calculateCPI(best);
    return cpi > bestCpi ? p : best;
  }, players[0]);

  // Find highest CPI gain (compare last two CPI entries)
  const biggestGainer = players.reduce((best, p) => {
    if (p.cpiHistory.length < 2) return best;
    const gain = p.cpiHistory[p.cpiHistory.length - 1].score - p.cpiHistory[p.cpiHistory.length - 2].score;
    if (!best) return { player: p, gain };
    const bestGain = best.player.cpiHistory.length >= 2
      ? best.player.cpiHistory[best.player.cpiHistory.length - 1].score - best.player.cpiHistory[best.player.cpiHistory.length - 2].score
      : 0;
    return gain > bestGain ? { player: p, gain } : best;
  }, null as { player: typeof topPlayer; gain: number } | null);

  const topRank = rankings.find(r => r.id === topPlayer.id);
  const topCpi = calculateCPI(topPlayer);
  const topInitials = topPlayer.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 text-primary fill-primary" />
            Player Spotlight
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Top Ranked */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-primary/30">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{topInitials}</AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Trophy className="h-3 w-3 text-primary-foreground" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">{topPlayer.name}</p>
              <p className="text-[11px] text-muted-foreground">{topPlayer.position} · {topPlayer.team}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-primary">{topCpi} CPI</span>
                {topRank && (
                  <RankingBadge
                    globalRank={topRank.globalRank}
                    localRank={topRank.localRank}
                    ageGroup={topRank.age_group}
                    location={topRank.location}
                    size="sm"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Biggest Gainer */}
          {biggestGainer && biggestGainer.gain > 0 && (
            <div className="flex items-center gap-3 pt-3 border-t border-border/50">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Biggest Improvement</p>
                <p className="text-sm font-semibold text-foreground">{biggestGainer.player.name}</p>
                <p className="text-xs text-emerald-500 font-medium">+{biggestGainer.gain.toFixed(1)} CPI</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
