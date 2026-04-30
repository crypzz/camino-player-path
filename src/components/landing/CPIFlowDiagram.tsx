import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from 'framer-motion';
import { Grid3x3, Scale, ShieldCheck, RefreshCw, Activity, Video, Dumbbell, ClipboardCheck } from 'lucide-react';

const clamp = (v: number) => Math.max(0, Math.min(1, v));

const steps = [
  {
    eyebrow: 'Step 01',
    icon: Grid3x3,
    title: 'Capture 23 attributes',
    body: 'Every player is scored 1–10 across 23 attributes split into Technical, Tactical, Physical and Mental — the raw signal of who they are right now.',
  },
  {
    eyebrow: 'Step 02',
    icon: Scale,
    title: 'Weight the categories',
    body: 'Categories are not equal. Technique and decision-making carry more weight than raw athleticism, mirroring how players actually develop into elite footballers.',
  },
  {
    eyebrow: 'Step 03',
    icon: ShieldCheck,
    title: 'Layer verified data',
    body: 'Fitness benchmarks, coach-verified video events, and training frequency layer in as evidence — never opinion, never anonymous scoring.',
  },
  {
    eyebrow: 'Step 04',
    icon: RefreshCw,
    title: 'Recompute on every change',
    body: 'The CPI updates the moment new evidence arrives. No end-of-season recalculation. No black box. Every move in the score is traceable to the input that caused it.',
  },
];

// ============ Step visuals ============

function StepRange(index: number, total: number) {
  const start = index / total;
  const end = (index + 1) / total;
  const mid = (start + end) / 2;
  return { start, end, mid };
}

// Step 1 — 23-attribute grid lighting up
function AttributeGrid({ progress }: { progress: MotionValue<number> }) {
  const cells = Array.from({ length: 23 });
  const categoryColors = [
    'bg-primary',          // technical
    'bg-primary/80',
    'bg-foreground/60',    // tactical
    'bg-foreground/45',
    'bg-success',          // physical
    'bg-success/70',
    'bg-destructive/70',   // mental
  ];

  return (
    <div className="grid grid-cols-6 gap-2.5 max-w-md mx-auto">
      {cells.map((_, i) => {
        const cellProgress = useTransform(progress, [0.1, 0.95], [0, 1]);
        const threshold = i / cells.length;
        const opacity = useTransform(cellProgress, (v) =>
          v >= threshold ? 1 : 0.12
        );
        const scale = useTransform(cellProgress, (v) =>
          v >= threshold && v <= threshold + 0.06 ? 1.15 : 1
        );
        const color = categoryColors[i % categoryColors.length];
        return (
          <motion.div
            key={i}
            style={{ opacity, scale }}
            className={`aspect-square rounded-md ${color} shadow-[0_0_12px_-2px_currentColor]`}
          />
        );
      })}
    </div>
  );
}

// Step 2 — animated weighted bars
function CategoryWeights({ progress }: { progress: MotionValue<number> }) {
  const categories = [
    { label: 'Technical', weight: 35, color: 'bg-primary' },
    { label: 'Tactical', weight: 30, color: 'bg-foreground/70' },
    { label: 'Physical', weight: 20, color: 'bg-success' },
    { label: 'Mental', weight: 15, color: 'bg-destructive/80' },
  ];

  return (
    <div className="space-y-5 max-w-md mx-auto w-full">
      {categories.map((c, i) => {
        const localStart = 0.1 + i * 0.12;
        const localEnd = localStart + 0.35;
        const width = useTransform(progress, [localStart, localEnd], ['0%', `${c.weight}%`]);
        const num = useTransform(progress, [localStart, localEnd], [0, c.weight]);
        const display = useTransform(num, (v) => `${Math.round(v)}%`);

        return (
          <div key={c.label}>
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {c.label}
              </span>
              <motion.span className="font-display font-extrabold text-foreground text-lg tabular-nums">
                {display}
              </motion.span>
            </div>
            <div className="h-2.5 rounded-full bg-secondary/60 overflow-hidden">
              <motion.div style={{ width }} className={`h-full ${c.color} rounded-full`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Step 3 — verified data sources flowing into a center node
function VerifiedSources({ progress }: { progress: MotionValue<number> }) {
  const sources = [
    { label: 'Fitness tests', icon: Dumbbell, angle: 200 },
    { label: 'Verified video', icon: Video, angle: 340 },
    { label: 'Evaluations', icon: ClipboardCheck, angle: 110 },
  ];

  return (
    <div className="relative h-72 w-72 mx-auto">
      {/* center CPI node */}
      <motion.div
        style={{
          scale: useTransform(progress, [0, 0.5, 1], [0.85, 1.05, 1]),
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-primary/15 border-2 border-primary/60 backdrop-blur-md flex items-center justify-center shadow-[0_0_60px_-10px_hsl(var(--primary))]"
      >
        <div className="text-center">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary">CPI</div>
          <div className="font-display font-extrabold text-foreground text-xl tabular-nums">87</div>
        </div>
      </motion.div>

      {sources.map((s, i) => {
        const localStart = 0.15 + i * 0.18;
        const localEnd = localStart + 0.35;
        const rad = (s.angle * Math.PI) / 180;
        const x = Math.cos(rad) * 110;
        const y = Math.sin(rad) * 110;

        const opacity = useTransform(progress, [localStart, localEnd], [0, 1]);
        const tx = useTransform(progress, [localStart, localEnd], [x * 0.4, x]);
        const ty = useTransform(progress, [localStart, localEnd], [y * 0.4, y]);
        const lineProgress = useTransform(progress, [localStart + 0.05, localEnd], [0, 1]);
        const dashOffset = useTransform(lineProgress, [0, 1], [40, 0]);

        return (
          <div key={s.label}>
            {/* connector line */}
            <svg
              className="absolute left-1/2 top-1/2 pointer-events-none overflow-visible"
              style={{ width: 1, height: 1 }}
            >
              <motion.line
                x1={0}
                y1={0}
                x2={x}
                y2={y}
                stroke="hsl(var(--primary))"
                strokeWidth={1.2}
                strokeDasharray="4 4"
                style={{ strokeDashoffset: dashOffset, opacity: lineProgress }}
              />
            </svg>

            <motion.div
              style={{
                opacity,
                x: tx,
                y: ty,
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="flex flex-col items-center gap-1.5 -translate-y-[1px]">
                <div className="h-11 w-11 rounded-xl bg-card border border-border/70 flex items-center justify-center text-foreground shadow-lg">
                  <s.icon className="h-4 w-4" strokeWidth={2} />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground whitespace-nowrap">
                  {s.label}
                </span>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

// Step 4 — live recompute: ticking score + event ticker
function LiveRecompute({ progress }: { progress: MotionValue<number> }) {
  const score = useTransform(progress, [0, 0.4, 0.65, 1], [78, 81, 84, 87]);
  const display = useTransform(score, (v) => Math.round(v).toString());
  const delta = useTransform(progress, [0, 1], [0, 9]);
  const deltaDisplay = useTransform(delta, (v) => `+${Math.round(v)}`);

  const events = [
    { label: 'Sprint test logged', t: 0.15 },
    { label: 'Coach verified clip', t: 0.4 },
    { label: 'Evaluation updated', t: 0.65 },
    { label: 'CPI recomputed', t: 0.88 },
  ];

  return (
    <div className="max-w-md mx-auto w-full space-y-5">
      <div className="rounded-2xl border border-primary/30 bg-card/70 backdrop-blur-md p-6 shadow-[0_0_60px_-15px_hsl(var(--primary)/0.7)]">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Live CPI
          </span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-success">
              Recomputing
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-3">
          <motion.span className="font-display font-extrabold text-foreground text-7xl tabular-nums leading-none">
            {display}
          </motion.span>
          <motion.span className="font-mono text-success text-sm tabular-nums">
            {deltaDisplay}
          </motion.span>
        </div>
      </div>

      <div className="space-y-2">
        {events.map((e, i) => {
          const opacity = useTransform(progress, [e.t - 0.05, e.t], [0, 1]);
          const x = useTransform(progress, [e.t - 0.05, e.t], [-10, 0]);
          return (
            <motion.div
              key={i}
              style={{ opacity, x }}
              className="flex items-center gap-3 rounded-lg border border-border/40 bg-card/40 backdrop-blur-sm px-4 py-2.5"
            >
              <Activity className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="font-mono text-[11px] text-foreground">{e.label}</span>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                live
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ============ Panel (sticky stage) ============

function Panel({
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  const { start, end, mid } = StepRange(index, total);
  const span = end - start;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const fadeIn = isFirst ? 0 : clamp(start - span * 0.15);
  const holdStart = isFirst ? 0 : clamp(start + span * 0.15);
  const holdEnd = isLast ? 1 : clamp(end - span * 0.15);
  const fadeOut = isLast ? 1 : clamp(end + span * 0.15);

  const opacity = useTransform(
    scrollYProgress,
    [fadeIn, holdStart, holdEnd, fadeOut],
    [0, 1, 1, 0]
  );
  const y = useTransform(scrollYProgress, [start, mid, end], [20, 0, -20]);

  // Local progress 0→1 within this step's range, used by visual sub-components
  const localProgress = useTransform(scrollYProgress, [start, end], [0, 1]);

  const step = steps[index];

  const Visual = [AttributeGrid, CategoryWeights, VerifiedSources, LiveRecompute][index];

  return (
    <motion.div
      style={
        reduced
          ? undefined
          : { opacity, y, willChange: 'opacity, transform' }
      }
      className="absolute inset-0 flex items-center justify-center px-4"
    >
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full max-w-5xl">
        {/* Copy */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <step.icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {step.eyebrow}
            </span>
          </div>
          <h3 className="font-display font-extrabold text-foreground text-3xl md:text-4xl tracking-tight mb-4 leading-[1.05]">
            {step.title}
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed max-w-md">
            {step.body}
          </p>
        </div>

        {/* Visual */}
        <div className="relative min-h-[280px] flex items-center justify-center">
          <Visual progress={localProgress} />
        </div>
      </div>
    </motion.div>
  );
}

function Indicator({
  index,
  total,
  scrollYProgress,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const { start, end, mid } = StepRange(index, total);
  const opacity = useTransform(scrollYProgress, [start, mid, end], [0.25, 1, 0.25]);
  const width = useTransform(scrollYProgress, [start, mid, end], ['28px', '52px', '28px']);
  return (
    <motion.span
      style={{ opacity, width }}
      className="h-1 rounded-full bg-primary"
    />
  );
}

export function CPIFlowDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      ref={ref}
      className="relative not-prose -mx-4 lg:-mx-12"
      style={{ height: `${steps.length * 100}vh` }}
      aria-label="How the Camino Player Index is computed"
    >
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        {/* Backdrop */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Header */}
        <div className="pt-16 px-6 lg:px-10">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-primary mb-3">
              The CPI flow
            </p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-foreground">
              From 23 attributes to <span className="font-serif italic font-normal text-primary">one</span> score.
            </h2>
          </div>
        </div>

        {/* Stage */}
        <div className="flex-1 relative px-6 lg:px-10">
          {steps.map((_, i) => (
            <Panel
              key={i}
              index={i}
              total={steps.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Indicators */}
        <div className="pb-10 px-6 lg:px-10">
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-2.5">
            {steps.map((_, i) => (
              <Indicator
                key={i}
                index={i}
                total={steps.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
