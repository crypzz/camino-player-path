import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface Props {
  children: ReactNode;
  className?: string;
  /** Deprecated — kept for API compat. Blur is disabled for performance. */
  blur?: number;
  /** How far children translate vertically across the scroll range (px). */
  translate?: number;
}

/**
 * Lightweight reveal wrapper:
 *  - fades + slight translate as it enters the viewport
 *  - stays fully visible while in view (no exit fade -> no blank gaps)
 *  - no animated CSS filters (avoids per-frame compositing cost)
 *  - respects prefers-reduced-motion
 */
export function ScrollReveal({ children, className, translate = 24 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 90%', 'start 40%'],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [translate, 0]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, willChange: 'opacity, transform' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
