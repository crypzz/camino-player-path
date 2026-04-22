import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const crests = [
  { code: 'U-08', name: 'Junior Academy' },
  { code: 'U-10', name: 'Foundation Phase' },
  { code: 'U-12', name: 'Pre-Academy' },
  { code: 'U-14', name: 'Youth Development' },
  { code: 'U-16', name: 'Player Pathway' },
  { code: 'U-18', name: 'Pro Pipeline' },
];

export function ClubCrestWall() {
  return (
    <div className="relative">
      <div className="text-center mb-10">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">
          Built for the next generation of academies
        </p>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 lg:gap-5 max-w-5xl mx-auto">
        {crests.map((c, i) => (
          <motion.div
            key={c.code}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            className="group relative aspect-square rounded-xl border border-border/50 bg-card/40 backdrop-blur flex flex-col items-center justify-center gap-1.5 hover:border-primary/30 transition-all"
          >
            <Shield
              className="h-7 w-7 text-primary/70 group-hover:text-primary transition-colors"
              strokeWidth={1.4}
              fill="hsl(var(--primary) / 0.08)"
            />
            <div className="font-display font-extrabold text-foreground text-sm tabular-nums tracking-tight">{c.code}</div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-wider text-center px-1">{c.name}</div>
          </motion.div>
        ))}
      </div>
      <p className="text-center mt-6 text-[11px] text-muted-foreground/60 italic">
        Partner crests appear here as academies onboard.
      </p>
    </div>
  );
}
