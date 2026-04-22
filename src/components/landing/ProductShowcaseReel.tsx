import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair, Star, Trophy, ChevronUp } from 'lucide-react';

type Frame = {
  id: 'evaluation' | 'video' | 'leaderboard';
  label: string;
  caption: string;
};

const frames: Frame[] = [
  { id: 'evaluation', label: 'Coach Evaluation', caption: 'Rate 23 metrics. CPI updates live.' },
  { id: 'video', label: 'Video Analysis', caption: 'AI-tagged events. Pitch overlay.' },
  { id: 'leaderboard', label: 'Live Rankings', caption: 'Composite score. Updated nightly.' },
];

const radarPolygon = (values: number[], cx: number, cy: number, r: number) => {
  const n = values.length;
  return values
    .map((v, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const radius = (v / 10) * r;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
};

function EvaluationFrame() {
  const baseline = [4, 5, 6, 4, 5, 6, 4, 5];
  const values = [8, 7, 9, 6, 8, 9, 7, 8];
  const cx = 110;
  const cy = 110;
  const r = 80;
  const grid = [0.25, 0.5, 0.75, 1].map((s) =>
    Array.from({ length: 8 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
      return `${cx + Math.cos(angle) * r * s},${cy + Math.sin(angle) * r * s}`;
    }).join(' '),
  );

  return (
    <div className="absolute inset-0 grid grid-cols-2 gap-6 p-6">
      <div className="flex flex-col">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Player</div>
        <div className="font-display font-bold text-foreground text-base">Marcus Adeyemi</div>
        <div className="text-xs text-muted-foreground mb-4">U-16 · Midfielder</div>

        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Composite Index</div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-display font-extrabold text-primary text-4xl tracking-tighter">82</span>
          <span className="text-xs text-success font-semibold">+6 this session</span>
        </div>

        <div className="space-y-2 mt-auto">
          {[
            { label: 'Technical', v: 88 },
            { label: 'Tactical', v: 79 },
            { label: 'Physical', v: 84 },
            { label: 'Mental', v: 76 },
          ].map((p, i) => (
            <div key={p.label} className="flex items-center gap-2 text-[10px]">
              <span className="w-14 text-muted-foreground">{p.label}</span>
              <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${p.v}%` }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.7 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
              <span className="w-6 text-right font-mono font-semibold tabular-nums text-foreground">{p.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <svg width={220} height={220} viewBox="0 0 220 220">
          {grid.map((g, i) => (
            <polygon key={i} points={g} fill="none" stroke="hsl(var(--border))" strokeWidth={0.6} opacity={0.5} />
          ))}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={cx + Math.cos(angle) * r}
                y2={cy + Math.sin(angle) * r}
                stroke="hsl(var(--border))"
                strokeWidth={0.4}
                opacity={0.4}
              />
            );
          })}
          <polygon points={radarPolygon(baseline, cx, cy, r)} fill="hsl(var(--muted-foreground) / 0.15)" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth={0.8} strokeDasharray="2 2" />
          <motion.polygon
            points={radarPolygon(values, cx, cy, r)}
            fill="hsl(var(--primary) / 0.2)"
            stroke="hsl(var(--primary))"
            strokeWidth={1.4}
            initial={{ scale: 0, transformOrigin: `${cx}px ${cy}px` }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      </div>
    </div>
  );
}

function VideoFrame() {
  const events = [
    { t: '12:04', label: 'Pass · Adeyemi', x: 28, y: 62 },
    { t: '14:31', label: 'Shot · Chen', x: 78, y: 30 },
    { t: '17:22', label: 'Tackle · Silva', x: 52, y: 78 },
  ];
  return (
    <div className="absolute inset-0 grid grid-cols-[1fr_180px] gap-4 p-5">
      {/* Pitch */}
      <div className="relative rounded-lg bg-gradient-to-b from-success/10 to-success/5 border border-border/40 overflow-hidden">
        <div className="absolute inset-3 border border-success/20 rounded" />
        <div className="absolute left-1/2 top-3 bottom-3 w-px bg-success/20" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-success/30" />
        {/* Scan line */}
        <motion.div
          animate={{ x: ['-10%', '110%'] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 bottom-0 w-[2px]"
          style={{ background: 'linear-gradient(180deg, transparent, hsl(var(--primary)), transparent)', boxShadow: '0 0 12px hsl(var(--primary))' }}
        />
        {events.map((e, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.3, duration: 0.4 }}
            className="absolute"
            style={{ left: `${e.x}%`, top: `${e.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="relative w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]">
              <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-50" />
            </div>
          </motion.div>
        ))}
        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-background/70 backdrop-blur text-[9px] font-mono text-muted-foreground border border-border/30">
          18:32 / 90:00
        </div>
      </div>
      {/* Event list */}
      <div className="flex flex-col">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Tagged Events</div>
        <div className="space-y-1.5 flex-1">
          {events.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.3, duration: 0.4 }}
              className="flex items-center gap-2 p-1.5 rounded-md bg-card border border-border/40"
            >
              <Crosshair className="h-3 w-3 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-primary tabular-nums">{e.t}</div>
                <div className="text-[10px] text-foreground truncate">{e.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-2 text-[9px] text-muted-foreground font-mono">AI · 24 events</div>
      </div>
    </div>
  );
}

function LeaderboardFrame() {
  const rows = [
    { rank: 1, name: 'Sofia Chen', team: 'U-16 A', cpi: 87, rise: true, delta: '+2' },
    { rank: 2, name: 'Marcus Adeyemi', team: 'U-16 A', cpi: 82, rise: false, delta: '−1' },
    { rank: 3, name: 'Léo Silva', team: 'U-14 B', cpi: 79, rise: false, delta: '−1' },
    { rank: 4, name: 'Yusuf Bello', team: 'U-16 B', cpi: 76, rise: false, delta: '0' },
    { rank: 5, name: 'Nina Costa', team: 'U-14 A', cpi: 74, rise: true, delta: '+1' },
  ];
  return (
    <div className="absolute inset-0 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Club Leaderboard</div>
          <div className="font-display font-bold text-foreground text-sm">Top Performers · This Week</div>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-success font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> LIVE
        </div>
      </div>
      <div className="grid grid-cols-[24px_1fr_60px_50px_28px] gap-2 px-2 py-1.5 text-[9px] uppercase tracking-wider text-muted-foreground border-b border-border/40">
        <span>#</span><span>Player</span><span className="text-right">Team</span><span className="text-right">CPI</span><span></span>
      </div>
      <div className="flex-1 flex flex-col">
        {rows.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}
            className={`grid grid-cols-[24px_1fr_60px_50px_28px] gap-2 items-center px-2 py-2 text-[11px] border-b border-border/30 ${r.rank === 1 ? 'bg-primary/5' : ''}`}
          >
            <div className={`font-display font-extrabold tabular-nums ${r.rank === 1 ? 'text-primary' : 'text-foreground'}`}>
              {r.rank}
            </div>
            <div className="text-foreground font-semibold truncate">{r.name}</div>
            <div className="text-right text-muted-foreground font-mono">{r.team}</div>
            <div className="text-right font-display font-extrabold text-primary tabular-nums">{r.cpi}</div>
            <div className={`flex items-center justify-end text-[9px] font-bold ${r.rise ? 'text-success' : 'text-muted-foreground'}`}>
              {r.rise && <ChevronUp className="h-2.5 w-2.5" />}
              {r.delta}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const FrameComponents = {
  evaluation: EvaluationFrame,
  video: VideoFrame,
  leaderboard: LeaderboardFrame,
};

const FrameIcons = {
  evaluation: Star,
  video: Crosshair,
  leaderboard: Trophy,
};

export function ProductShowcaseReel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % frames.length), 4500);
    return () => clearInterval(id);
  }, []);

  const Active = FrameComponents[frames[idx].id];

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Browser chrome */}
      <div
        className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl overflow-hidden"
        style={{ boxShadow: '0 40px 100px -30px hsl(0 0% 0% / 0.7), 0 0 0 1px hsl(var(--primary) / 0.05)' }}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40 bg-card/40">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-success/70" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-background/50 border border-border/40 text-[10px] font-mono text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              camino · live
            </div>
          </div>
          <div className="w-12" />
        </div>

        {/* Frame stage */}
        <div className="relative aspect-[16/9] bg-gradient-to-b from-background/40 to-background/80">
          <AnimatePresence mode="wait">
            <motion.div
              key={frames[idx].id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Active />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Tabs / progress */}
      <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
        {frames.map((f, i) => {
          const Icon = FrameIcons[f.id];
          const active = i === idx;
          return (
            <button
              key={f.id}
              onClick={() => setIdx(i)}
              className={`group flex items-center gap-2.5 px-4 py-2 rounded-full border transition-all ${
                active
                  ? 'border-primary/50 bg-primary/10 text-foreground'
                  : 'border-border/50 bg-card/30 text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${active ? 'text-primary' : ''}`} />
              <span className="text-xs font-semibold">{f.label}</span>
              {active && (
                <motion.div
                  layoutId="reel-progress"
                  className="ml-1 h-1 w-10 rounded-full bg-border overflow-hidden"
                >
                  <motion.div
                    key={idx}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4.5, ease: 'linear' }}
                    className="h-full bg-primary"
                  />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">{frames[idx].caption}</p>
    </div>
  );
}
