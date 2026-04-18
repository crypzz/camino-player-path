import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const metrics = [
  'Pace', 'Vision', 'Finishing', 'Passing', 'Dribbling', 'Shooting', 'Heading',
  'Tackling', 'Marking', 'Positioning', 'Stamina', 'Strength', 'Agility', 'Balance',
  'Jumping', 'Composure', 'Aggression', 'Awareness', 'Leadership', 'Reactions',
  'Teamwork', 'Decision', 'Coaching',
];

export function MetricOrbit() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setCount(Math.min(100, Math.round((frame / 60) * 100)));
      if (frame >= 60) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <div ref={ref} className="relative w-full aspect-square max-w-[640px] mx-auto">
      {/* Concentric rings */}
      {[1, 0.78, 0.56].map((scale, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-primary/15"
          style={{ transform: `scale(${scale})` }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 60 + i * 20, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* Center number */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-extrabold text-primary text-[clamp(7rem,18vw,14rem)] leading-none tracking-tighter"
          style={{ textShadow: '0 0 80px hsl(var(--primary) / 0.4)' }}
        >
          {count}
        </motion.div>
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-2">CPI Max</div>
      </div>

      {/* Orbiting metric chips */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      >
        {metrics.map((m, i) => {
          const angle = (i / metrics.length) * Math.PI * 2;
          const radius = 50; // % of container
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius;
          return (
            <motion.div
              key={m}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.04, duration: 0.4 }}
              className="absolute"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                className="px-2.5 py-1 rounded-full bg-card/90 backdrop-blur border border-border/60 text-[10px] font-medium text-foreground whitespace-nowrap shadow-lg"
              >
                {m}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
