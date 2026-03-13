import { Player, getCategoryAverage, calculateCPI } from '@/types/player';
import { motion } from 'framer-motion';

interface Props {
  player: Player;
  onClick: () => void;
  index: number;
}

export function PlayerCard({ player, onClick, index }: Props) {
  const cpi = calculateCPI(player);
  const stats = [
    { label: 'TEC', value: getCategoryAverage(player.technical) },
    { label: 'TAC', value: getCategoryAverage(player.tactical) },
    { label: 'PHY', value: getCategoryAverage(player.physical) },
    { label: 'MEN', value: getCategoryAverage(player.mental) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onClick={onClick}
      className="glass-card-hover p-4 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-md bg-accent flex items-center justify-center font-display font-bold text-primary text-xs tracking-tight">
            {player.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-tight">
              {player.name}
            </h3>
            <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{player.position} · {player.team} · {player.age}y</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-display font-bold text-primary leading-none">{cpi}</div>
          <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">CPI</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-secondary/60 rounded-md py-1.5 px-1 text-center">
            <div className="text-[10px] text-muted-foreground leading-none">{stat.label}</div>
            <div className="font-display font-bold text-foreground text-xs mt-0.5">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/50">
        <span className="text-[10px] text-muted-foreground font-medium">{player.nationality}</span>
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${player.attendance >= 90 ? 'bg-success' : player.attendance >= 75 ? 'bg-warning' : 'bg-destructive'}`} />
          <span className="text-[10px] text-muted-foreground">{player.attendance}%</span>
        </div>
      </div>
    </motion.div>
  );
}
