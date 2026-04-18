import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  text: string;
  className?: string;
  highlightWords?: string[];
  delay?: number;
}

export function KineticHeadline({ text, className, highlightWords = [], delay = 0 }: Props) {
  const words = text.split(' ');
  return (
    <h1 className={cn('font-display font-extrabold tracking-tight leading-[1.02]', className)}>
      {words.map((word, i) => {
        const clean = word.replace(/[^a-zA-Z]/g, '');
        const highlighted = highlightWords.some(w => w.toLowerCase() === clean.toLowerCase());
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.7,
              delay: delay + i * 0.09,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn('inline-block mr-[0.25em]', highlighted && 'text-primary')}
          >
            {word}
          </motion.span>
        );
      })}
    </h1>
  );
}
