import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const TOTAL_SPOTS = 50;

/**
 * Urgency badge. Derives "X of 50 spots left" from this week's signups,
 * clamped so it always reads as genuinely scarce.
 */
export function SpotsCounter() {
  const [left, setLeft] = useState<number>(7);

  useEffect(() => {
    let cancelled = false;
    supabase.rpc('count_waitlist_this_week').then(({ data, error }) => {
      if (cancelled || error || typeof data !== 'number') return;
      const remaining = Math.max(2, Math.min(TOTAL_SPOTS, TOTAL_SPOTS - data));
      setLeft(remaining);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur-sm"
    >
      <Flame className="h-3.5 w-3.5" strokeWidth={2.5} />
      Limited spots —
      <span className="font-mono tabular-nums text-foreground">
        {left} of {TOTAL_SPOTS}
      </span>
      left
    </motion.div>
  );
}
