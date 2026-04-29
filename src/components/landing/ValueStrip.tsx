import { motion } from 'framer-motion';
import { Activity, TrendingUp, Eye } from 'lucide-react';

const items = [
  {
    icon: Activity,
    title: 'Track every touch',
    body: 'Match film, fitness tests and coach evaluations feed one verified profile.',
  },
  {
    icon: TrendingUp,
    title: 'Climb a real ranking',
    body: '23 attributes condense into one CPI score. No vanity metrics.',
  },
  {
    icon: Eye,
    title: 'Get seen by the right people',
    body: 'Coaches, scouts and clubs can verify what your numbers actually mean.',
  },
];

export function ValueStrip() {
  return (
    <section className="relative py-24 px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              <div className="flex flex-col gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-[0_0_24px_-8px_hsl(var(--primary)/0.6)]">
                  <item.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="font-display font-extrabold text-foreground text-xl tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  {item.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
