import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRankings, RankedPlayer } from '@/hooks/useRankings';
import { AGE_GROUPS } from '@/lib/constants';
import { useNavigate } from 'react-router-dom';

export default function DirectorLeaderboardPage() {
  const [ageGroup, setAgeGroup] = useState('');
  const [timeframe, setTimeframe] = useState('monthly');
  const { data: players = [], isLoading } = useRankings({ ageGroup: ageGroup || undefined });
  const navigate = useNavigate();

  const getChangeIcon = (rank: number) => {
    if (rank <= 3) return <ArrowUp className="h-3 w-3 text-emerald-500" />;
    if (rank > 10) return <ArrowDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" /> Club Leaderboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Top players across the entire club</p>
        </div>
        <div className="flex gap-2">
          <Select value={ageGroup} onValueChange={setAgeGroup}>
            <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Age Group" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              {AGE_GROUPS.map(ag => <SelectItem key={ag} value={ag}>{ag}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-28 h-8 text-xs"><SelectValue placeholder="Timeframe" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" /></div>
          ) : (
            <div className="divide-y divide-border">
              {players.map((player, idx) => {
                const initials = player.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent/30 cursor-pointer transition-colors"
                    onClick={() => navigate(`/player/${player.id}`)}
                  >
                    <span className={`w-8 text-center font-bold text-sm ${idx < 3 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                      #{idx + 1}
                    </span>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{player.name}</p>
                      <p className="text-[11px] text-muted-foreground">{player.team} · {player.age_group}</p>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{player.rankingScore.toFixed(1)}</span>
                      {getChangeIcon(idx + 1)}
                    </div>
                  </motion.div>
                );
              })}
              {players.length === 0 && (
                <p className="text-center py-8 text-muted-foreground text-sm">No players found</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
