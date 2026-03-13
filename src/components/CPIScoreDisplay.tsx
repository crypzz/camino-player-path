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
    sm: { ring: 72, stroke: 5, fontSize: 'text-lg' },
    md: { ring: 110, stroke: 6, fontSize: 'text-2xl' },
    lg: { ring: 140, stroke: 7, fontSize: 'text-4xl' },
  }[size];

  const radius = (dimensions.ring - dimensions.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (cpi / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return 'hsl(160, 72%, 42%)';
    if (score >= 60) return 'hsl(45, 100%, 58%)';
    if (score >= 40) return 'hsl(40, 95%, 52%)';
    return 'hsl(0, 72%, 51%)';
  };

  const color = getColor(cpi);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: dimensions.ring, height: dimensions.ring }}>
        <svg width={dimensions.ring} height={dimensions.ring} className="-rotate-90">
          <circle
            cx={dimensions.ring / 2}
            cy={dimensions.ring / 2}
            r={radius}
            fill="none"
            stroke="hsl(225, 15%, 13%)"
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
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`font-display font-bold ${dimensions.fontSize} tracking-tight`}
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {cpi}
          </motion.span>
          {size !== 'sm' && (
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-medium">CPI</span>
          )}
        </div>
      </div>

      {size !== 'sm' && (
        <div className="grid grid-cols-4 gap-2 w-full max-w-[240px]">
          {[
            { label: 'TEC', value: techAvg, weight: '40%' },
            { label: 'TAC', value: tacAvg, weight: '30%' },
            { label: 'PHY', value: phyAvg, weight: '20%' },
            { label: 'MEN', value: menAvg, weight: '10%' },
          ].map((item) => (
            <div key={item.label} className="text-center bg-secondary/50 rounded-md py-1.5">
              <div className="text-xs font-display font-bold text-foreground">{item.value}</div>
              <div className="text-[9px] text-muted-foreground font-medium">{item.label}</div>
              <div className="text-[8px] text-muted-foreground/40">{item.weight}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
