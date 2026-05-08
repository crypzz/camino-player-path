import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
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

function Panel({ index, total, scrollYProgress }: any) {
  const reduced = useReducedMotion();
  const start = index / total;
  const end = (index + 1) / total;
  const mid = (start + end) / 2;
  const scale = useTransform(scrollYProgress, [start, mid, end], [0.97, 1, 0.97]);
  const y = useTransform(scrollYProgress, [start, mid, end], [20, 0, -20]);

  const step = steps[index];

  return (
    <motion.div
      style={
        reduced
          ? undefined
          : { scale, y, willChange: 'transform' }
      }
      className="flex min-w-full items-center justify-center px-1"
    >
      <div className="w-full max-w-xl rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-8 lg:p-10 shadow-[0_30px_120px_-30px_hsl(var(--primary)/0.4)]">
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
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${((steps.length - 1) / steps.length) * 100}%`]);

  return (
    <section ref={ref} className="relative" style={{ height: `${steps.length * 85}vh` }}>
      <div className="sticky top-0 h-screen flex flex-col">
        <div className="pt-20 px-6 lg:px-10">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-primary mb-3">
              How it works
            </p>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-foreground">
              Three steps. <span className="font-serif italic font-normal text-primary">Zero</span> guesswork.
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-hidden px-6 lg:px-10">
          <motion.div
            style={reduced ? undefined : { x, willChange: 'transform' }}
            className="flex h-full"
          >
            {steps.map((_, i) => (
              <Panel key={i} index={i} total={steps.length} scrollYProgress={scrollYProgress} />
            ))}
          </motion.div>
        </div>

        {/* step indicator */}
        <div className="pb-12 px-6 lg:px-10">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
            {steps.map((_, i) => (
              <Indicator key={i} index={i} total={steps.length} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
