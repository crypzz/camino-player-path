import { motion } from 'framer-motion';
import { Trophy, Zap, Target } from 'lucide-react';

const cards = [
  {
    name: 'Marcus Johnson',
    pos: 'CAM · U-16',
    cpi: 87,
    icon: Trophy,
    badges: [
      { label: 'TEC', val: 9.1 },
      { label: 'TAC', val: 8.4 },
      { label: 'PHY', val: 8.8 },
      { label: 'MEN', val: 8.6 },
    ],
    rotate: -8,
    delay: 0,
  },
  {
    name: 'Diego Ramirez',
    pos: 'CB · U-18',
    cpi: 91,
    icon: Zap,
    badges: [
      { label: 'TEC', val: 8.6 },
      { label: 'TAC', val: 9.5 },
      { label: 'PHY', val: 9.2 },
      { label: 'MEN', val: 9.0 },
    ],
    rotate: 0,
    delay: 0.15,
  },
  {
    name: 'Liam Kowalski',
    pos: 'ST · U-15',
    cpi: 82,
    icon: Target,
    badges: [
      { label: 'TEC', val: 8.8 },
      { label: 'TAC', val: 7.9 },
      { label: 'PHY', val: 8.3 },
      { label: 'MEN', val: 8.1 },
    ],
    rotate: 8,
    delay: 0.3,
  },
];

export function FloatingPlayerCards() {
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60, rotateY: c.rotate * 2 }}
            whileInView={{ opacity: 1, y: 0, rotateY: c.rotate }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: c.delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -12, rotateY: 0, scale: 1.04 }}
            style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
            className="group"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              className="relative rounded-2xl p-6 bg-gradient-to-br from-card/95 to-card/70 backdrop-blur-xl border border-primary/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-colors" />

              {/* Header */}
              <div className="relative flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-primary/15 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-foreground text-sm leading-tight">{c.name}</div>
                    <div className="text-[11px] text-muted-foreground">{c.pos}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-extrabold text-primary text-3xl leading-none">{c.cpi}</div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">CPI</div>
                </div>
              </div>

              {/* Badges */}
              <div className="relative grid grid-cols-4 gap-2 mb-4">
                {c.badges.map((b) => (
                  <div key={b.label} className="bg-secondary/60 rounded-lg py-2 text-center">
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{b.label}</div>
                    <div className="font-display font-bold text-foreground text-sm mt-0.5">{b.val}</div>
                  </div>
                ))}
              </div>

              {/* Mini radar */}
              <div className="relative h-1.5 bg-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${c.cpi}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: c.delay + 0.4, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-primary to-primary/60"
                />
              </div>
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-[10px] text-muted-foreground">Verified by Coach</span>
                <span className="text-[10px] font-semibold text-success">● Live</span>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
