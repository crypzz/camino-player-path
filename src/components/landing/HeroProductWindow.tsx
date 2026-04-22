import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp } from 'lucide-react';

/**
 * Realistic floating product window for hero — a mini live CPI dashboard.
 * Replaces the decorative P-07 / P-22 tracking labels.
 */
export function HeroProductWindow() {
  const pillars = [
    { label: 'Technical', value: 91, color: 'hsl(var(--primary))' },
    { label: 'Tactical', value: 84, color: 'hsl(var(--info))' },
    { label: 'Physical', value: 88, color: 'hsl(var(--success))' },
    { label: 'Mental', value: 82, color: 'hsl(var(--foreground))' },
  ];

  // Static sparkline data
  const spark = [42, 48, 55, 51, 60, 67, 71, 74, 78, 81, 85, 87];
  const w = 168;
  const h = 36;
  const max = Math.max(...spark);
  const min = Math.min(...spark);
  const path = spark
    .map((v, i) => {
      const x = (i / (spark.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * h;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: -8 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay: 1.0, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1200, transformStyle: 'preserve-3d' }}
      className="relative w-[340px] max-w-full"
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-2xl bg-gradient-to-b from-card to-card/80 backdrop-blur-2xl border border-primary/20 overflow-hidden"
        style={{
          boxShadow:
            '0 30px 80px -20px hsl(0 0% 0% / 0.6), 0 0 0 1px hsl(var(--primary) / 0.08), inset 0 1px 0 hsl(var(--foreground) / 0.04)',
        }}
      >
        {/* Window chrome */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-card/60">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/70" />
          </div>
          <div className="px-2.5 py-0.5 rounded-md bg-background/60 border border-border/40 text-[10px] font-mono text-muted-foreground tracking-wide">
            camino · live
          </div>
          <div className="w-9" />
        </div>

        {/* Content */}
        <div className="relative p-5">
          {/* Player header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-primary/30 to-primary/5 border border-primary/30 flex items-center justify-center font-display font-extrabold text-primary text-base">
              SC
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-card" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-foreground text-sm leading-tight">Sofia Chen</div>
              <div className="text-[10px] text-muted-foreground font-mono tracking-wide">U-16 · Forward · #9</div>
            </div>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-success/10 border border-success/30">
              <CheckCircle2 className="h-2.5 w-2.5 text-success" />
              <span className="text-[9px] font-bold text-success tracking-wide">VERIFIED</span>
            </div>
          </div>

          {/* CPI score + sparkline */}
          <div className="flex items-end justify-between gap-3 mb-5">
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-0.5">CPI Score</div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-extrabold text-primary text-[2.75rem] leading-none tracking-tighter">
                  87
                </span>
                <div className="flex items-center gap-0.5 text-success text-[10px] font-bold">
                  <TrendingUp className="h-2.5 w-2.5" />
                  +12
                </div>
              </div>
            </div>
            <svg width={w} height={h} className="overflow-visible">
              <defs>
                <linearGradient id="hpw-spark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${path} L ${w} ${h} L 0 ${h} Z`} fill="url(#hpw-spark)" />
              <motion.path
                d={path}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.6, duration: 1.5, ease: 'easeOut' }}
              />
              <circle cx={w} cy={h - ((spark[spark.length - 1] - min) / (max - min)) * h} r={2.5} fill="hsl(var(--primary))" />
            </svg>
          </div>

          {/* Pillar bars */}
          <div className="space-y-2">
            {pillars.map((p, i) => (
              <div key={p.label} className="flex items-center gap-2.5">
                <div className="w-14 text-[10px] font-medium text-muted-foreground">{p.label}</div>
                <div className="flex-1 h-1 rounded-full bg-border/60 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.value}%` }}
                    transition={{ delay: 1.4 + i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: p.color }}
                  />
                </div>
                <div className="w-7 text-right font-mono text-[10px] font-semibold text-foreground tabular-nums">
                  {p.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gold scan line — sweeps every 6s */}
        <motion.div
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: ['−10%', '110%'], opacity: [0, 0.7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 4.4, ease: 'easeInOut', delay: 2.5 }}
          className="absolute inset-x-0 h-[2px] pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.9), transparent)',
            boxShadow: '0 0 12px hsl(var(--primary) / 0.6)',
          }}
        />
      </motion.div>

      {/* Floating LIVE pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, duration: 0.5 }}
        className="absolute -top-3 -right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-success/40 shadow-lg"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
        </span>
        <span className="text-[9px] font-bold text-success tracking-[0.15em]">LIVE</span>
      </motion.div>
    </motion.div>
  );
}
