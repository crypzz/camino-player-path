import { useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
  max?: number;
}

export function TiltCard({ children, className, max = 12 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * max * 2;
    const rx = -(py - 0.5) * max * 2;
    setTransform(`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`);
    setGlow({ x: px * 100, y: py * 100, opacity: 1 });
  };

  const reset = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)');
    setGlow({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ transform, transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out' }}
      className={cn(
        'relative rounded-2xl overflow-hidden border border-border/60 bg-card',
        'will-change-transform',
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: glow.opacity,
          background: `radial-gradient(400px circle at ${glow.x}% ${glow.y}%, hsl(var(--primary) / 0.18), transparent 60%)`,
        }}
      />
      <div style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }} className="relative">
        {children}
      </div>
    </motion.div>
  );
}
