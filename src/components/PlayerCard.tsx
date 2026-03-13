import { Player } from '@/types/player';
import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';

interface Props {
  player: Player;
  onClick: () => void;
  index: number;
}

export function PlayerCard({ player, onClick, index }: Props) {
  const avgTechnical = Object.values(player.technical).reduce((a, b) => a + b, 0) / Object.values(player.technical).length;

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
          <div className="text-2xl font-display font-bold text-primary">{player.overallRating}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Overall</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'TEC', value: avgTechnical.toFixed(1) },
          { label: 'TAC', value: (Object.values(player.tactical).reduce((a, b) => a + b, 0) / Object.values(player.tactical).length).toFixed(1) },
          { label: 'PHY', value: (Object.values(player.physical).reduce((a, b) => a + b, 0) / Object.values(player.physical).length).toFixed(1) },
          { label: 'MEN', value: (Object.values(player.mental).reduce((a, b) => a + b, 0) / Object.values(player.mental).length).toFixed(1) },
        ].map((stat) => (
          <div key={stat.label} className="stat-gradient rounded-lg p-2 text-center">
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            <div className="font-display font-bold text-foreground text-sm">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Age {player.age}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {player.attendance}% attendance
        </span>
      </div>
    </motion.div>
  );
}
