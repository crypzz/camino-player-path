import { motion } from 'framer-motion';
import { User, Users, Heart, Building2, Check } from 'lucide-react';
import { TiltCard } from './TiltCard';

const roles = [
  {
    icon: User,
    label: 'Players',
    headline: 'Build your digital passport.',
    bullets: [
      'Verified stats coaches can trust',
      'Climb the leaderboard weekly',
      'Share a public profile with one link',
    ],
  },
  {
    icon: Users,
    label: 'Coaches',
    headline: 'Coach with receipts, not guesses.',
    bullets: [
      'Track squad attendance and form',
      'Tag match film with AI assistance',
      'Auto-generate weekly player reports',
    ],
  },
  {
    icon: Heart,
    label: 'Parents',
    headline: 'See real progress, not promises.',
    bullets: [
      'Follow your child’s development',
      'Get notified about training and games',
      'Understand what the numbers mean',
    ],
  },
  {
    icon: Building2,
    label: 'Directors',
    headline: 'Run the academy with one source of truth.',
    bullets: [
      'Cross-team rankings and fitness data',
      'Coach performance and roster health',
      'Unified communications across the club',
    ],
  },
];

export function RoleCards() {
  return (
    <section className="relative py-32 px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-primary mb-3">Who it's for</p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-foreground">
            One platform. <span className="font-serif italic font-normal text-primary">Four</span> perspectives.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7">
          {roles.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard className="h-full bg-card/50 backdrop-blur-sm">
                <div className="p-7 lg:p-8 flex flex-col gap-5 h-full">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                      <r.icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-1.5">
                      {r.label}
                    </p>
                    <h3 className="font-display font-extrabold text-foreground text-xl md:text-2xl leading-tight tracking-tight">
                      {r.headline}
                    </h3>
                  </div>
                  <ul className="mt-2 space-y-2.5">
                    {r.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" strokeWidth={2.5} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
