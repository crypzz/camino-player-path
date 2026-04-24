import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, ArrowDown, MapPin, Lock, Activity } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { WaitlistForm } from '@/components/WaitlistForm';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { CursorFollower } from '@/components/landing/CursorFollower';
import { CPIDial } from '@/components/landing/CPIDial';
import { FloatingPlayerCards } from '@/components/landing/FloatingPlayerCards';
import caminoLogo from '@/assets/camino-logo.png';

const Hero3DPitch = lazy(() =>
  import('@/components/landing/Hero3DPitch').then((m) => ({ default: m.Hero3DPitch }))
);

// ---------- Static mock data ----------
const mockRankings = [
  { rank: 1, name: 'Diego Ramirez', team: 'U-18 · CB', cpi: 91, delta: 2 },
  { rank: 2, name: 'Marcus Johnson', team: 'U-16 · CAM', cpi: 87, delta: 1 },
  { rank: 3, name: 'Liam Kowalski', team: 'U-15 · ST', cpi: 82, delta: -1 },
  { rank: 4, name: 'Sofia Mendes', team: 'U-17 · CM', cpi: 80, delta: 3 },
  { rank: 5, name: 'Arjun Patel', team: 'U-16 · LW', cpi: 78, delta: 0 },
];

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ---------- Subcomponents ----------
function ScarcityChip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-primary backdrop-blur-sm"
    >
      <Lock className="h-3 w-3" strokeWidth={2.5} />
      Limited onboarding spots
    </motion.div>
  );
}

function TopNav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solid ? 'bg-background/80 backdrop-blur-xl border-b border-border/40' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src={caminoLogo} alt="Camino" className="h-8 w-8 rounded-md object-contain" />
          <span className="font-display font-extrabold text-foreground text-lg tracking-tight">Camino</span>
        </div>
        <button
          onClick={() => scrollTo('waitlist')}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-primary text-primary-foreground text-xs font-semibold tracking-wide shadow-[0_0_24px_-6px_hsl(var(--primary)/0.7)] hover:shadow-[0_0_36px_-4px_hsl(var(--primary)/0.9)] transition-shadow"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Join Waitlist
        </button>
      </div>
    </nav>
  );
}

function HeroMobileFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.18),transparent_60%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,hsl(var(--primary)/0.08)_95%),linear-gradient(90deg,transparent_95%,hsl(var(--primary)/0.08)_95%)] bg-[size:60px_60px] opacity-40" />
    </div>
  );
}

function RankingsSection() {
  const [order, setOrder] = useState(mockRankings);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      if (v > 0.4 && v < 0.6 && order[0].rank === 1) {
        setOrder((prev) => {
          const next = [...prev];
          [next[1], next[2]] = [next[2], next[1]];
          return next.map((r, i) => ({ ...r, rank: i + 1 }));
        });
      }
    });
    return () => unsub();
  }, [scrollYProgress, order]);

  return (
    <section ref={ref} className="relative py-32 px-6 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-primary mb-3">01 — Rankings</p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-foreground">
            Climb a <span className="font-serif italic font-normal text-primary">real</span> leaderboard.
          </h2>
          <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto">
            Every touch, evaluation and fitness test feeds a single composite score. Move up, get noticed.
          </p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden shadow-[0_20px_80px_-30px_hsl(var(--primary)/0.3)]">
          <div className="grid grid-cols-12 px-5 py-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-border/40">
            <div className="col-span-1">#</div>
            <div className="col-span-6">Player</div>
            <div className="col-span-3">CPI</div>
            <div className="col-span-2 text-right">Δ 7d</div>
          </div>
          <AnimatePresence>
            {order.map((row) => (
              <motion.div
                key={row.name}
                layout
                transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                className={`grid grid-cols-12 items-center px-5 py-4 border-b border-border/30 last:border-0 ${
                  row.rank === 1 ? 'bg-primary/[0.06]' : ''
                }`}
              >
                <div className={`col-span-1 font-display font-extrabold text-lg ${row.rank === 1 ? 'text-primary' : 'text-foreground/70'}`}>
                  {row.rank}
                </div>
                <div className="col-span-6">
                  <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                    {row.name}
                    {row.rank === 1 && (
                      <Trophy className="h-3.5 w-3.5 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]" />
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono">{row.team}</div>
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 max-w-[120px] rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${row.cpi}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: row.rank * 0.08 }}
                        className={`h-full ${row.rank === 1 ? 'bg-primary' : 'bg-foreground/40'}`}
                      />
                    </div>
                    <span className="font-mono text-sm text-foreground tabular-nums">{row.cpi}</span>
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <span
                    className={`font-mono text-xs ${
                      row.delta > 0 ? 'text-success' : row.delta < 0 ? 'text-destructive' : 'text-muted-foreground'
                    }`}
                  >
                    {row.delta > 0 ? '+' : ''}
                    {row.delta}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ProfilesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yFar = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yMid = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const yNear = useTransform(scrollYProgress, [0, 1], [10, -10]);

  return (
    <section ref={ref} className="relative py-32 px-6 lg:px-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-primary mb-3">02 — Profiles</p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-foreground">
            Your digital <span className="font-serif italic font-normal text-primary">passport</span>.
          </h2>
          <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto">
            One profile. Verified by your coach. Visible to the right people.
          </p>
        </div>

        <div className="relative">
          <motion.div style={{ y: yFar }} className="absolute inset-0 -z-10 opacity-50">
            <div className="absolute left-[10%] top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute right-[15%] bottom-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          </motion.div>
          <motion.div style={{ y: yMid }}>
            <FloatingPlayerCards />
          </motion.div>
          <motion.div style={{ y: yNear }} className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary shadow-[0_0_40px_8px_hsl(var(--primary)/0.4)]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function VideoTrackingSection() {
  const dots = [
    { x: '20%', y: '40%', delay: 0 },
    { x: '40%', y: '55%', delay: 0.5 },
    { x: '60%', y: '30%', delay: 1 },
    { x: '75%', y: '60%', delay: 1.5 },
    { x: '50%', y: '70%', delay: 2 },
  ];
  return (
    <section className="relative py-32 px-6 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-primary mb-3">03 — Intelligence</p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-foreground">
            Be <span className="font-serif italic font-normal text-primary">seen</span>, not guessed.
          </h2>
          <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto">
            Upload match film. AI tags events. Your stats become receipts.
          </p>
        </div>

        <div className="relative aspect-[16/9] rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden shadow-[0_20px_80px_-30px_hsl(var(--primary)/0.3)]">
          <div className="absolute inset-0 bg-gradient-to-b from-success/15 via-success/5 to-success/15" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 56" preserveAspectRatio="none">
            <rect x="2" y="2" width="96" height="52" fill="none" stroke="hsl(var(--foreground)/0.15)" strokeWidth="0.3" />
            <line x1="50" y1="2" x2="50" y2="54" stroke="hsl(var(--foreground)/0.15)" strokeWidth="0.3" />
            <circle cx="50" cy="28" r="6" fill="none" stroke="hsl(var(--foreground)/0.15)" strokeWidth="0.3" />
            <rect x="2" y="14" width="14" height="28" fill="none" stroke="hsl(var(--foreground)/0.15)" strokeWidth="0.3" />
            <rect x="84" y="14" width="14" height="28" fill="none" stroke="hsl(var(--foreground)/0.15)" strokeWidth="0.3" />
          </svg>

          {dots.map((p, i) => (
            <motion.div
              key={i}
              className="absolute h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]"
              style={{ left: p.x, top: p.y }}
              animate={{ x: [0, 30, -10, 0], y: [0, -20, 10, 0] }}
              transition={{ duration: 6, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur-md border border-primary/30 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-primary">
            <Activity className="h-3 w-3" />
            AI tracking · preview
          </div>

          <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Touches', value: '47' },
              { label: 'Distance', value: '8.2 km' },
              { label: 'Sprints', value: '12' },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border/50 bg-background/70 backdrop-blur-md px-3 py-2">
                <div className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <div className="font-display font-bold text-lg text-foreground tabular-nums">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CPISection() {
  return (
    <section className="relative py-32 px-6 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-primary mb-3">The score</p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-foreground">
            One number. <span className="font-serif italic font-normal text-primary">Twenty-three</span> attributes.
          </h2>
        </div>
        <CPIDial />
      </div>
    </section>
  );
}

function SocialProofSection() {
  return (
    <section className="relative py-24 px-6 lg:px-10 border-y border-border/30 bg-card/20">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-display font-bold text-2xl md:text-3xl text-foreground tracking-tight">
          Built for competitive players and clubs.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Early access clubs in <span className="font-semibold text-foreground">Calgary</span>
          </div>
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Rolling access — limited spots remaining
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Main page ----------
export default function LandingPage() {
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      <CursorFollower />
      <TopNav />

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {isMobile ? (
            <HeroMobileFallback />
          ) : (
            <Suspense fallback={<HeroMobileFallback />}>
              <Hero3DPitch />
            </Suspense>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-3xl mx-auto px-6 text-center py-20"
        >
          <ScarcityChip />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mt-6 font-display font-extrabold text-5xl md:text-7xl lg:text-8xl tracking-[-0.03em] leading-[0.95] text-foreground"
          >
            The Future of
            <br />
            Player <span className="font-serif italic font-normal text-primary">Development</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            Track performance. Climb rankings. Get <span className="font-serif italic text-foreground">seen</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            id="waitlist-hero"
          >
            <WaitlistForm variant="hero" />
          </motion.div>

          <motion.button
            onClick={() => scrollTo('rankings')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-10 inline-flex flex-col items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors"
          >
            See how it works
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
          </motion.button>
        </motion.div>
      </section>

      <div id="rankings"><RankingsSection /></div>
      <ProfilesSection />
      <CPISection />
      <VideoTrackingSection />
      <SocialProofSection />

      {/* FINAL CTA */}
      <section id="waitlist" className="relative py-32 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-primary mb-3">Join the inside</p>
          <h2 className="font-display font-extrabold text-4xl md:text-6xl tracking-[-0.02em] leading-[1] text-foreground">
            Your spot is <span className="font-serif italic font-normal text-primary">waiting</span>.
          </h2>
          <p className="mt-5 text-muted-foreground text-base max-w-lg mx-auto">
            We're onboarding select clubs in Calgary first. Add yourself to the list — we'll reach out when it's your turn.
          </p>
          <div className="mt-10">
            <WaitlistForm variant="block" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
