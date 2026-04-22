import { motion } from 'framer-motion';

interface Props {
  number: string;
  label: string;
  className?: string;
}

/**
 * Editorial numbered chapter eyebrow. Sits above section H2s.
 * e.g. 01 — IDENTITY
 */
export function ChapterLabel({ number, label, className = '' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className={`inline-flex items-center gap-3 mb-6 ${className}`}
    >
      <span className="font-mono text-[11px] font-semibold text-primary tracking-[0.15em] tabular-nums">
        {number}
      </span>
      <span className="h-px w-8 bg-primary/40" />
      <span className="font-mono text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.3em]">
        {label}
      </span>
    </motion.div>
  );
}
