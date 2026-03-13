import { Player, getCategoryAverage, calculateCPI } from '@/types/player';
import { motion } from 'framer-motion';
import { Calendar, Flag } from 'lucide-react';

interface Props {
  player: Player;
  onClick: () => void;
  index: number;
}

export function PlayerCard({ player, onClick, index }: Props) {
  const cpi = calculateCPI(player);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      className="glass-card rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center font-display font-bold text-primary text-sm">
            {player.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
              {player.name}
            </h3>
            <p className="text-xs text-muted-foreground">{player.position} · {player.team}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-display font-bold text-primary">{cpi}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">CPI</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'TEC', value: getCategoryAverage(player.technical) },
          { label: 'TAC', value: getCategoryAverage(player.tactical) },
          { label: 'PHY', value: getCategoryAverage(player.physical) },
          { label: 'MEN', value: getCategoryAverage(player.mental) },
        ].map((stat) => (
          <div key={stat.label} className="stat-gradient rounded-lg p-2 text-center">
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            <div className="font-display font-bold text-foreground text-sm">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Flag className="h-3 w-3" />
          {player.nationality}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Age {player.age} · {player.attendance}% att.
        </span>
      </div>
    </motion.div>
  );
}
