import { motion } from 'framer-motion';
import { calculateCPI, Player, getCategoryAverage } from '@/types/player';

interface Props {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
}

export function CPIScoreDisplay({ player, size = 'md' }: Props) {
  const cpi = calculateCPI(player);
  const techAvg = getCategoryAverage(player.technical);
  const tacAvg = getCategoryAverage(player.tactical);
  const phyAvg = getCategoryAverage(player.physical);
  const menAvg = getCategoryAverage(player.mental);

  const dimensions = {
    sm: { ring: 80, stroke: 6, fontSize: 'text-xl' },
    md: { ring: 120, stroke: 8, fontSize: 'text-3xl' },
    lg: { ring: 160, stroke: 10, fontSize: 'text-5xl' },
  }[size];

  const radius = (dimensions.ring - dimensions.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (cpi / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return 'hsl(152, 69%, 45%)';
    if (score >= 60) return 'hsl(43, 96%, 56%)';
    if (score >= 40) return 'hsl(38, 92%, 50%)';
    return 'hsl(0, 72%, 51%)';
  };

  const color = getColor(cpi);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: dimensions.ring, height: dimensions.ring }}>
        <svg width={dimensions.ring} height={dimensions.ring} className="-rotate-90">
          <circle
            cx={dimensions.ring / 2}
            cy={dimensions.ring / 2}
            r={radius}
            fill="none"
            stroke="hsl(222, 30%, 14%)"
            strokeWidth={dimensions.stroke}
          />
          <motion.circle
            cx={dimensions.ring / 2}
            cy={dimensions.ring / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={dimensions.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`font-display font-bold ${dimensions.fontSize}`}
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {cpi}
          </motion.span>
          {size !== 'sm' && (
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">CPI</span>
          )}
        </div>
      </div>

      {size !== 'sm' && (
        <div className="grid grid-cols-4 gap-3 w-full max-w-xs">
          {[
            { label: 'TEC', value: techAvg, weight: '40%' },
            { label: 'TAC', value: tacAvg, weight: '30%' },
            { label: 'PHY', value: phyAvg, weight: '20%' },
            { label: 'MEN', value: menAvg, weight: '10%' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-sm font-display font-bold text-foreground">{item.value}</div>
              <div className="text-[10px] text-muted-foreground">{item.label}</div>
              <div className="text-[9px] text-muted-foreground/50">{item.weight}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
