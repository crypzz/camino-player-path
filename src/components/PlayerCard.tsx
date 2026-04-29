import { Player, calculateCPI } from '@/types/player';
import { motion } from 'framer-motion';

interface Props {
  player: Player;
  onClick: () => void;
  index: number;
}

export function PlayerCard({ player, onClick, index }: Props) {
  const cpi = calculateCPI(player);
  const attendanceColor =
    player.attendance >= 90 ? 'bg-success' : player.attendance >= 75 ? 'bg-warning' : 'bg-destructive';

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      onClick={onClick}
      className="group relative w-full text-left glass-card-hover overflow-hidden flex items-center gap-3 p-3.5 pl-4"
    >
      {/* Attendance health indicator — subtle left border */}
      <span className={`absolute left-0 top-0 bottom-0 w-[3px] ${attendanceColor} opacity-70`} />

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-display font-semibold text-primary text-[13px] tracking-tight shrink-0 ring-1 ring-border/40 group-hover:ring-primary/30 transition-all">
        {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>

      {/* Identity */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-[14px] text-foreground group-hover:text-primary transition-colors leading-tight truncate">
          {player.name}
        </h3>
        <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 truncate">
          {player.position} · {player.team} · {player.age}y
        </p>
      </div>

      {/* Single CPI pill */}
      <div className="shrink-0 flex items-baseline gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
        <span className="font-display font-bold text-[13px] text-primary leading-none tabular-nums">{cpi}</span>
        <span className="text-[9px] uppercase tracking-wider text-primary/70 font-medium">CPI</span>
      </div>
    </motion.button>
  );
}
