import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Users, Heart, Building2, Check, ArrowRight, ChevronDown } from 'lucide-react';

type Role = {
  key: string;
  icon: typeof User;
  label: string;
  headline: string;
  summary: string;
  bullets: string[];
  stats: { value: string; label: string }[];
  more: { title: string; body: string }[];
  href: string;
};

const ROLES: Role[] = [
  {
    key: 'parents',
    icon: Heart,
    label: 'Parents',
    headline: 'See real progress, not promises.',
    summary:
      'You pay for the season. Camino shows you exactly what comes back — attendance, coach feedback and a development score that moves week to week.',
    bullets: [
      'Weekly reports written by your child’s coach',
      'Attendance and training load at a glance',
      'Plain-English explanation of every number',
    ],
    stats: [
      { value: 'Weekly', label: 'Coach reports' },
      { value: '100%', label: 'Sessions logged' },
      { value: '1 link', label: 'Player CV to share' },
    ],
    more: [
      {
        title: 'What you actually see',
        body: 'A parent view with your child’s attendance record, fitness test results, evaluation history and tagged video clips from games — all in one timeline.',
      },
      {
        title: 'How progress is measured',
        body: 'The Camino Player Index scores technical, tactical, physical and mental development on a 0–100 scale, so improvement is visible instead of assumed.',
      },
      {
        title: 'Staying in the loop',
        body: 'Schedule changes, announcements and coach feedback arrive as notifications — no more chasing a group chat.',
      },
    ],
    href: '/for/parents',
  },
  {
    key: 'coaches',
    icon: Users,
    label: 'Coaches',
    headline: 'Coach with receipts, not guesses.',
    summary:
      'Evaluate a full squad in minutes, tag match film with AI help and send reports parents actually read — without extra admin nights.',
    bullets: [
      'Fast squad evaluations grouped by position',
      'AI-tagged match clips and player highlights',
      'Auto-generated weekly reports and session plans',
    ],
    stats: [
      { value: '25+', label: 'Ready-made drills' },
      { value: 'Minutes', label: 'To evaluate a squad' },
      { value: 'Auto', label: 'Weekly reports' },
    ],
    more: [
      {
        title: 'Evaluations that take minutes',
        body: 'Rate players with quick tap-through pills across 23 attributes, split by goalkeepers, defenders, midfielders and attackers.',
      },
      {
        title: 'Video analysis without an analyst',
        body: 'Upload match footage and get player tracking, event tagging, heatmaps and shareable highlight clips generated for you.',
      },
      {
        title: 'Session and squad management',
        body: 'Build sessions from a drill library, track attendance, and keep notes attached to the player instead of a notebook.',
      },
    ],
    href: '/for/coaches',
  },
  {
    key: 'players',
    icon: User,
    label: 'Players',
    headline: 'Build your digital passport.',
    summary:
      'Every session, evaluation and clip becomes a record scouts can trust — and a CV you can share with one link.',
    bullets: [
      'Verified stats coaches can trust',
      'Climb the leaderboard week to week',
      'Public profile and downloadable CV',
    ],
    stats: [
      { value: '0–100', label: 'Player Index' },
      { value: 'Live', label: 'Leaderboard rank' },
      { value: '1 link', label: 'Shareable CV' },
    ],
    more: [
      {
        title: 'Your development record',
        body: 'Attribute scores, fitness tests, match stats and coach feedback build a history that follows you between clubs.',
      },
      {
        title: 'Getting seen',
        body: 'Publish a profile and CV with your stats, history, highlight reel and contact details — one link for any scout or coach.',
      },
    ],
    href: '/for/players',
  },
  {
    key: 'directors',
    icon: Building2,
    label: 'Directors',
    headline: 'Run the club from one source of truth.',
    summary:
      'Compare teams, track coach output and see development across every age group without chasing spreadsheets.',
    bullets: [
      'Cross-team rankings and fitness data',
      'Coach activity and roster health',
      'Club-wide communication in one place',
    ],
    stats: [
      { value: 'All teams', label: 'One dashboard' },
      { value: 'Weekly', label: 'Club reporting' },
      { value: 'Full', label: 'Roster visibility' },
    ],
    more: [
      {
        title: 'Club-wide visibility',
        body: 'Leaderboards, squad depth by position and development trends across every team, updated as coaches log data.',
      },
      {
        title: 'Accountability',
        body: 'See which coaches are evaluating, logging attendance and sending reports — and where players are being missed.',
      },
    ],
    href: '/for/directors',
  },
];

export function RoleExplorer() {
  const [active, setActive] = useState('parents');
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const role = ROLES.find((r) => r.key === active)!;

  const pick = (key: string) => {
    setActive(key);
    setOpenIdx(null);
  };

  return (
    <section className="relative py-24 px-6 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-primary mb-3">Who it's for</p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-foreground">
            Pick your <span className="font-serif italic font-normal text-primary">side</span> of the game.
          </h2>
          <p className="mt-4 text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Tap a role to see exactly what Camino does for you.
          </p>
        </div>

        {/* Role buttons */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {ROLES.map((r) => {
            const isActive = r.key === active;
            return (
              <button
                key={r.key}
                onClick={() => pick(r.key)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-2 h-11 px-5 rounded-full text-sm font-semibold transition-all border ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_28px_-8px_hsl(var(--primary)/0.8)]'
                    : 'bg-card/50 text-foreground/80 border-border/60 hover:border-primary/40 hover:text-foreground'
                }`}
              >
                <r.icon className="h-4 w-4" strokeWidth={2} />
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={role.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-7 md:p-10"
          >
            <h3 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-foreground">
              {role.headline}
            </h3>
            <p className="mt-3 text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
              {role.summary}
            </p>

            <div className="mt-7 grid gap-6 md:grid-cols-2">
              <ul className="space-y-3">
                {role.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/85">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" strokeWidth={2.5} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-3 gap-3">
                {role.stats.map((s) => (
                  <div key={s.label} className="rounded-xl border border-border/50 bg-background/40 p-3 text-center">
                    <p className="font-display font-extrabold text-lg text-primary leading-none">{s.value}</p>
                    <p className="mt-1.5 text-[10px] uppercase tracking-wider text-muted-foreground leading-tight">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Learn more accordions */}
            <div className="mt-8 divide-y divide-border/50 border-t border-border/50">
              {role.more.map((m, i) => {
                const open = openIdx === i;
                return (
                  <div key={m.title}>
                    <button
                      onClick={() => setOpenIdx(open ? null : i)}
                      aria-expanded={open}
                      className="w-full flex items-center justify-between gap-4 py-4 text-left group"
                    >
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {m.title}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180 text-primary' : ''}`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pb-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">{m.body}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={role.href}
                className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold tracking-wide"
              >
                More for {role.label.toLowerCase()} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center h-10 px-5 rounded-full border border-border/60 text-xs font-semibold tracking-wide text-foreground/85 hover:border-primary/40"
              >
                Join the waitlist
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
