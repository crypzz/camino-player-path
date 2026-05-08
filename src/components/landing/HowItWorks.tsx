import { motion, useReducedMotion } from 'framer-motion';
import { Upload, Sparkles, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload',
    body: 'Match film, fitness test results, coach evaluations — drop them in. We handle the rest.',
  },
  {
    icon: Sparkles,
    title: 'Analyze',
    body: 'AI tags events, your coach verifies. Every touch becomes a data point on your profile.',
  },
  {
    icon: TrendingUp,
    title: 'Climb',
    body: 'Your CPI updates live. Climb your team, your club, your region. Get noticed.',
  },
];

function Panel({ index }: { index: number }) {
  const reduced = useReducedMotion();

  const step = steps[index];

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      className="min-w-[82vw] snap-center md:min-w-0"
    >
      <div className="h-full rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-7 lg:p-9 shadow-[0_30px_120px_-30px_hsl(var(--primary)/0.35)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <step.icon className="h-5 w-5" strokeWidth={2} />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Step 0{index + 1}
          </span>
        </div>
        <h3 className="font-display font-extrabold text-foreground text-3xl md:text-4xl tracking-tight mb-3">
          {step.title}
        </h3>
        <p className="text-base text-muted-foreground leading-relaxed">{step.body}</p>
      </div>
    </motion.div>
  );
}

function Indicator({ index, total, scrollYProgress }: any) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(scrollYProgress, [start, (start + end) / 2, end], [0.3, 1, 0.3]);
  return <motion.span style={{ opacity }} className="h-1 w-12 rounded-full bg-primary" />;
}

export function HowItWorks() {
  return (
    <section className="relative py-24 md:py-28 px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div>
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-primary mb-3">
              How it works
            </p>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-foreground">
              Three steps. <span className="font-serif italic font-normal text-primary">Zero</span> guesswork.
            </h2>
          </div>
        </div>

        <div className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {steps.map((_, i) => (
            <Panel key={i} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
