import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, Video, TrendingUp } from 'lucide-react';

interface Metric {
  icon: typeof Activity;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

const metrics: Metric[] = [
  { icon: Users, label: 'Players Tracked', value: 1247 },
  { icon: Activity, label: 'Evaluations Logged', value: 3892 },
  { icon: Video, label: 'Videos Analyzed', value: 412 },
  { icon: TrendingUp, label: 'Avg CPI Gain', value: 24, prefix: '+', suffix: '%' },
];

function useCount(target: number, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1500;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return val;
}

function MetricCell({ m, active }: { m: Metric; active: boolean }) {
  const v = useCount(m.value, active);
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
        <m.icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="min-w-0">
        <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-semibold truncate">
          {m.label}
        </div>
        <div className="font-display font-extrabold text-foreground text-base tabular-nums tracking-tight">
          {m.prefix}
          {v.toLocaleString()}
          {m.suffix}
        </div>
      </div>
    </div>
  );
}

/**
 * Sticky live ops dashboard strip. Reveals after hero scroll-out,
 * hides when a sentinel near the waitlist enters view.
 */
export function LiveMetricsBar() {
  const [visible, setVisible] = useState(false);
  const [counted, setCounted] = useState(false);
  const sentinelHide = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearBottom = sentinelHide.current
        ? sentinelHide.current.getBoundingClientRect().top < window.innerHeight - 40
        : false;
      const show = y > window.innerHeight * 0.55 && !nearBottom;
      setVisible(show);
      if (show && !counted) setCounted(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [counted]);

  // Place a hide sentinel near the bottom (rendered as a portal-ish absolute div not needed —
  // instead we expose a global window flag via a custom listener on a known element).
  useEffect(() => {
    sentinelHide.current = document.getElementById('live-metrics-hide-sentinel') as HTMLDivElement | null;
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-16 left-0 right-0 z-40 pointer-events-none"
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div
              className="pointer-events-auto rounded-xl border border-primary/15 bg-background/85 backdrop-blur-2xl px-5 py-3 flex items-center gap-6 lg:gap-10 overflow-x-auto"
              style={{
                boxShadow:
                  '0 10px 40px -10px hsl(0 0% 0% / 0.5), 0 0 0 1px hsl(var(--primary) / 0.06)',
              }}
            >
              {/* Left LIVE pulse */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
                <span className="text-[10px] font-bold text-success tracking-[0.2em]">LIVE</span>
              </div>
              <div className="h-8 w-px bg-border shrink-0" />
              {metrics.map((m, i) => (
                <div key={m.label} className="shrink-0 flex items-center gap-6 lg:gap-10">
                  <MetricCell m={m} active={counted} />
                  {i < metrics.length - 1 && <div className="h-8 w-px bg-border hidden md:block" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
