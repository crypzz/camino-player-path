import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Upload, Cpu, LineChart, ArrowRight } from 'lucide-react';

const steps = [
  {
    n: 1,
    icon: Upload,
    title: 'Upload Match Footage',
    desc: 'Drop in any game video — phone, camcorder or club stream. No special gear required.',
  },
  {
    n: 2,
    icon: Cpu,
    title: 'AI Does the Heavy Lifting',
    desc: 'Our engine tracks every player and tags key events automatically, in minutes.',
  },
  {
    n: 3,
    icon: LineChart,
    title: 'Unlock Insights',
    desc: 'Access detailed performance data, heat maps and timestamped coach feedback.',
  },
];

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 700);
      setVal(Math.round(p * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return <span ref={ref}>{val}</span>;
}

export function ProcessSteps() {
  return (
    <section className="relative py-28 px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">How it works</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            From the pitch to the{' '}
            <span className="font-serif font-normal italic text-primary">scholarship</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            We track every step. Three moves from raw footage to a verified performance record.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {steps.map((s, i) => (
            <div key={s.n} className="contents">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-7 text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/40"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="font-display text-5xl font-extrabold leading-none text-primary/25">
                  0<CountUp to={s.n} />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </motion.div>

              {i < steps.length - 1 && (
                <div className="hidden items-center justify-center md:flex">
                  <motion.span
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-primary/60"
                  >
                    <ArrowRight className="h-6 w-6" />
                  </motion.span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
