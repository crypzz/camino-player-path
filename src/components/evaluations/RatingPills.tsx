import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  value: number;
  onChange: (v: number) => void;
  label?: string;
  compact?: boolean;
}

function bandClass(score: number, active: boolean) {
  if (!active) return 'bg-muted/30 text-muted-foreground/50 hover:bg-muted/60 hover:text-foreground';
  if (score <= 3) return 'bg-red-500/90 text-white shadow-[0_0_0_1px_hsl(0_72%_45%)]';
  if (score <= 6) return 'bg-amber-500/90 text-black shadow-[0_0_0_1px_hsl(40_95%_45%)]';
  if (score <= 8) return 'bg-emerald-500/90 text-white shadow-[0_0_0_1px_hsl(160_72%_38%)]';
  return 'bg-primary text-primary-foreground shadow-[0_0_0_1px_hsl(var(--primary))]';
}

export function RatingPills({ value, onChange, label, compact }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 w-full">
      {label && (
        <span className={cn('text-foreground/90 truncate', compact ? 'text-xs' : 'text-sm')}>
          {label}
        </span>
      )}
      <div className="flex items-center gap-1" role="radiogroup" aria-label={label}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const active = n === value;
          return (
            <motion.button
              key={n}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(n)}
              whileTap={{ scale: 0.85 }}
              animate={{ scale: active ? 1.08 : 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className={cn(
                'rounded-md font-display font-bold transition-colors',
                compact ? 'h-6 w-6 text-[10px]' : 'h-7 w-7 text-[11px]',
                bandClass(n, active),
              )}
            >
              {n}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
