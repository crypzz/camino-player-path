import { motion } from 'framer-motion';
import {
  Activity,
  BarChart3,
  IdCard,
  ClipboardList,
  Smartphone,
  Sparkles,
} from 'lucide-react';

// ---------- Mini visuals ----------
function PitchVisual() {
  const dots = [
    { x: '22%', y: '38%', d: 0 },
    { x: '44%', y: '58%', d: 0.6 },
    { x: '64%', y: '32%', d: 1.1 },
    { x: '78%', y: '62%', d: 1.6 },
    { x: '52%', y: '72%', d: 2.1 },
  ];
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-gradient-to-b from-success/15 via-success/[0.04] to-success/15">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 56" preserveAspectRatio="none">
        <rect x="2" y="2" width="96" height="52" fill="none" stroke="hsl(var(--foreground)/0.14)" strokeWidth="0.3" />
        <line x1="50" y1="2" x2="50" y2="54" stroke="hsl(var(--foreground)/0.14)" strokeWidth="0.3" />
        <circle cx="50" cy="28" r="7" fill="none" stroke="hsl(var(--foreground)/0.14)" strokeWidth="0.3" />
      </svg>
      {dots.map((p, i) => (
        <motion.span
          key={i}
          className="absolute h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
          style={{ left: p.x, top: p.y }}
          animate={{ x: [0, 14, -8, 0], y: [0, -10, 8, 0] }}
          transition={{ duration: 6, delay: p.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function ChartVisual() {
  const bars = [40, 62, 48, 78, 90, 70, 84];
  return (
    <div className="flex h-full w-full items-end justify-between gap-1.5 rounded-lg bg-card/50 p-4">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm bg-gradient-to-t from-primary/40 to-primary"
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

function PassportVisual() {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-lg border border-primary/20 bg-card/60 p-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-display font-bold text-primary">
          DR
        </div>
        <div>
          <div className="text-xs font-semibold text-foreground">Diego Ramirez</div>
          <div className="text-[10px] font-mono text-muted-foreground">U-18 · CB</div>
        </div>
        <div className="ml-auto font-display text-xl font-extrabold text-primary tabular-nums">91</div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[['Pace', 88], ['Pass', 84], ['Def', 92]].map(([l, v]) => (
          <div key={l as string}>
            <div className="text-[9px] font-mono uppercase text-muted-foreground">{l}</div>
            <div className="mt-1 h-1 rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: `${v}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardVisual() {
  return (
    <div className="flex h-full w-full gap-2 rounded-lg bg-card/50 p-3">
      <div className="flex w-1/3 flex-col gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-2 rounded-full ${i === 1 ? 'bg-primary/70' : 'bg-secondary'}`} />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-md border border-border/50 bg-background/60 p-2">
              <div className="h-1.5 w-8 rounded-full bg-primary/50" />
              <div className="mt-1.5 h-3 w-10 rounded bg-foreground/15" />
            </div>
          ))}
        </div>
        <div className="flex-1 rounded-md border border-border/50 bg-background/60 p-2">
          <div className="flex h-full items-end gap-1">
            {[50, 80, 60, 95, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-primary/40" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneVisual() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-card/50">
      <div className="relative h-[88%] w-[42%] rounded-[14px] border-2 border-border/70 bg-background p-2">
        <div className="mx-auto mb-2 h-1 w-6 rounded-full bg-border" />
        <div className="space-y-1.5">
          <div className="h-8 rounded-md bg-primary/15" />
          <div className="h-2 w-3/4 rounded-full bg-secondary" />
          <div className="h-2 w-1/2 rounded-full bg-secondary" />
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <div className="h-6 rounded bg-secondary" />
            <div className="h-6 rounded bg-primary/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AIVisual() {
  const lines = ['Improve weak-foot finishing', 'Add 2 high-intensity sessions', 'Track sprint recovery'];
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2 rounded-lg bg-card/50 p-4">
      {lines.map((t, i) => (
        <motion.div
          key={t}
          className="flex items-center gap-2 rounded-md border border-primary/15 bg-background/60 px-2.5 py-1.5"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
        >
          <Sparkles className="h-3 w-3 shrink-0 text-primary" />
          <span className="text-[10px] text-foreground/80">{t}</span>
        </motion.div>
      ))}
    </div>
  );
}

const features = [
  {
    icon: Activity,
    eyebrow: 'AI Match Analysis',
    title: 'Every Touch Captured',
    desc: 'AI automatically tracks player positions and performance metrics straight from your game footage.',
    Visual: PitchVisual,
  },
  {
    icon: BarChart3,
    eyebrow: 'Performance Insights',
    title: "Data Doesn't Lie",
    desc: 'See the full picture: touches, distance, possession and intensity heat maps in one view.',
    Visual: ChartVisual,
  },
  {
    icon: IdCard,
    eyebrow: 'Digital Player Passport',
    title: 'Your Career Portfolio',
    desc: 'Build a verified performance record that scouts and academies actually trust.',
    Visual: PassportVisual,
  },
  {
    icon: ClipboardList,
    eyebrow: 'Coach Tools',
    title: 'Coach Like a Pro',
    desc: 'Organize training sessions, assign drills and give timestamped feedback — all in one place.',
    Visual: DashboardVisual,
  },
  {
    icon: Smartphone,
    eyebrow: 'Parent Updates',
    title: 'Parents Stay in the Loop',
    desc: 'Real progress tracking, tournament insights and video highlights shared securely.',
    Visual: PhoneVisual,
  },
  {
    icon: Sparkles,
    eyebrow: 'AI Coach Assistant',
    title: 'Your Personal AI Coach',
    desc: 'Get intelligent recommendations to sharpen specific skills, week after week.',
    Visual: AIVisual,
  },
];

export function FeatureShowcase() {
  return (
    <section className="relative py-28 px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">What makes Camino different</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Every player deserves to be{' '}
            <span className="font-serif font-normal italic text-primary">seen and understood</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_24px_70px_-30px_hsl(var(--primary)/0.5)]"
            >
              <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.1),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="mb-4 h-32 w-full">
                <f.Visual />
              </div>
              <div className="mb-2.5 inline-flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <f.icon className="h-3.5 w-3.5" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {f.eyebrow}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold tracking-tight text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
