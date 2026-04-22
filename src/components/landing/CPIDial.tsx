import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const pillars = [
  { label: 'Technical', weight: 40, color: 'hsl(var(--primary))', spark: [62, 65, 68, 71, 74, 78] },
  { label: 'Tactical', weight: 30, color: 'hsl(var(--info))', spark: [55, 58, 60, 64, 68, 72] },
  { label: 'Physical', weight: 20, color: 'hsl(var(--success))', spark: [70, 72, 73, 75, 77, 80] },
  { label: 'Mental', weight: 10, color: 'hsl(var(--foreground))', spark: [60, 61, 64, 66, 68, 70] },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 60;
  const h = 18;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const path = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h}>
      <path d={path} fill="none" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    </svg>
  );
}

export function CPIDial() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-120px' });
  const [count, setCount] = useState(0);
  const target = 87;

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1800;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  // Dial geometry
  const size = 460;
  const cx = size / 2;
  const cy = size / 2;
  const r = 180;
  const stroke = 14;
  const circumference = 2 * Math.PI * r;
  const progress = (count / 100) * circumference;

  // Engraved circular text
  const textRadius = r + 36;

  return (
    <div ref={ref} className="relative w-full max-w-[640px] mx-auto aspect-square">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        <defs>
          <linearGradient id="cpiDialGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          </linearGradient>
          <filter id="cpiDialGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <path
            id="cpi-circle-text"
            d={`M ${cx} ${cy} m -${textRadius} 0 a ${textRadius} ${textRadius} 0 1 1 ${textRadius * 2} 0 a ${textRadius} ${textRadius} 0 1 1 -${textRadius * 2} 0`}
            fill="none"
          />
        </defs>

        {/* Engraved circular type */}
        <text fontSize="9" fontFamily="ui-monospace, SFMono-Regular, monospace" fill="hsl(var(--muted-foreground))" letterSpacing="6" opacity={0.6}>
          <textPath href="#cpi-circle-text" startOffset="0">
            CAMINO PLAYER INDEX · 23 METRICS · LIVE · CAMINO PLAYER INDEX · 23 METRICS · LIVE ·
          </textPath>
        </text>

        {/* Outer faint ring */}
        <circle cx={cx} cy={cy} r={r + 14} fill="none" stroke="hsl(var(--border))" strokeWidth={0.5} opacity={0.5} />

        {/* Tick marks */}
        {Array.from({ length: 60 }, (_, i) => {
          const angle = (Math.PI * 2 * i) / 60 - Math.PI / 2;
          const major = i % 5 === 0;
          const innerR = r - (major ? 22 : 16);
          const outerR = r - 8;
          return (
            <line
              key={i}
              x1={cx + Math.cos(angle) * innerR}
              y1={cy + Math.sin(angle) * innerR}
              x2={cx + Math.cos(angle) * outerR}
              y2={cy + Math.sin(angle) * outerR}
              stroke="hsl(var(--border))"
              strokeWidth={major ? 1.2 : 0.6}
              opacity={major ? 0.7 : 0.4}
            />
          );
        })}

        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} opacity={0.5} />

        {/* Progress arc */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="url(#cpiDialGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#cpiDialGlow)"
        />
      </svg>

      {/* Centered number */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-2">CPI</div>
        <div
          className="font-display font-extrabold text-foreground text-[clamp(5rem,14vw,9rem)] leading-none tracking-tighter tabular-nums"
          style={{ textShadow: '0 0 60px hsl(var(--primary) / 0.4)' }}
        >
          {count}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-success">VERIFIED · LIVE</span>
        </div>
      </div>

      {/* Pillar spokes — positioned around dial */}
      {pillars.map((p, i) => {
        // Place at corners: top-left, top-right, bottom-right, bottom-left
        const positions = [
          { left: '-2%', top: '8%', anchor: 'right' as const },
          { left: '72%', top: '8%', anchor: 'left' as const },
          { left: '72%', top: '78%', anchor: 'left' as const },
          { left: '-2%', top: '78%', anchor: 'right' as const },
        ];
        const pos = positions[i];
        return (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 + i * 0.15, duration: 0.6 }}
            className="absolute"
            style={{ left: pos.left, top: pos.top, width: '30%', minWidth: 130 }}
          >
            <div className={`flex flex-col gap-1.5 ${pos.anchor === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">{p.label}</span>
              </div>
              <div className="font-display font-extrabold text-foreground text-2xl tabular-nums tracking-tight">
                {p.weight}<span className="text-sm text-muted-foreground">%</span>
              </div>
              <Sparkline data={p.spark} color={p.color} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
