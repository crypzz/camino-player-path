import { Trophy, Medal } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RankedPlayer } from '@/hooks/useRankings';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Props {
  players: RankedPlayer[];
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy className="h-4 w-4 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-4 w-4 text-gray-400" />;
  if (rank === 3) return <Medal className="h-4 w-4 text-amber-700" />;
  return <span className="text-xs text-muted-foreground font-mono w-4 text-center">{rank}</span>;
}

export function LeaderboardTable({ players }: Props) {
  const navigate = useNavigate();

  return (
    <div className="space-y-1">
      {players.map((player, i) => {
        const initials = player.name.split(' ').map(n => n[0]).join('').slice(0, 2);
        const isTop3 = player.globalRank <= 3;

        return (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => navigate(`/dashboard/player/${player.id}`)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/60 ${isTop3 ? 'bg-primary/5 border border-primary/10' : ''}`}
          >
            <div className="w-8 flex items-center justify-center">
              {getRankIcon(player.globalRank)}
            </div>
            <Avatar className="h-9 w-9">
              <AvatarFallback className={`text-xs font-bold ${isTop3 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{player.name}</p>
              <p className="text-[11px] text-muted-foreground">{player.position} · {player.team} · {player.age_group}</p>
            </div>
            <div className="text-right">
              <p className={`font-bold text-sm ${isTop3 ? 'text-primary' : 'text-foreground'}`}>
                {player.overall_rating.toFixed(1)}
              </p>
              <p className="text-[10px] text-muted-foreground">CPI</p>
            </div>
          </motion.div>
        );
      })}

      {players.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No players found matching filters
        </div>
      )}
    </div>
  );
}
