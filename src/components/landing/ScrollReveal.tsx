import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from 'framer-motion';

interface Props {
  children: ReactNode;
  className?: string;
  /** How aggressive the blur is (px). Set 0 to disable blur. */
  blur?: number;
  /** How far children translate vertically across the scroll range (px). */
  translate?: number;
}

/**
 * Wraps a section with scroll-driven enter/exit:
 *  - fades + un-blurs as it enters the viewport
 *  - fades + re-blurs as it exits
 *  - subtle parallax translate
 * Respects prefers-reduced-motion.
 */
export function ScrollReveal({ children, className, blur = 6, translate = 30 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [translate, 0, 0, -translate]);
  const filter: MotionValue<string> = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    [`blur(${blur}px)`, 'blur(0px)', 'blur(0px)', `blur(${blur}px)`]
  );

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
      style={{ opacity, y, filter, willChange: 'opacity, transform, filter' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
