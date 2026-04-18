import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUp, BarChart3, Shield, Users, Video, Target,
  TrendingUp, Zap, Globe, Star, Trophy, MessageSquare,
  Activity, CheckCircle2, Building2, Dumbbell, Award, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { useRankings } from '@/hooks/useRankings';
import { WaitlistForm } from '@/components/WaitlistForm';
import caminoLogo from '@/assets/camino-logo.png';
import { KineticHeadline } from '@/components/landing/KineticHeadline';
import { MagneticButton } from '@/components/landing/MagneticButton';
import { TiltCard } from '@/components/landing/TiltCard';
import { LiveTickerBar } from '@/components/landing/LiveTickerBar';
import { MetricOrbit } from '@/components/landing/MetricOrbit';
import { FloatingPlayerCards } from '@/components/landing/FloatingPlayerCards';
import { useIsMobile } from '@/hooks/use-mobile';

const Hero3DPitch = lazy(() => import('@/components/landing/Hero3DPitch').then(m => ({ default: m.Hero3DPitch })));
const ParticleBurst = lazy(() => import('@/components/landing/ParticleBurst').then(m => ({ default: m.ParticleBurst })));

function HeroMobileFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Static pitch gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.18)_0%,transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(180deg,transparent_0%,hsl(var(--primary)/0.08)_50%,transparent_100%)]" />
      {/* Subtle pitch line */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] aspect-[16/10] border border-primary/20 rounded-[40%] opacity-40" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-primary/30 rounded-full opacity-50" />
      {/* Animated glowing dots — lightweight */}
      {[
        { left: '20%', top: '38%', delay: '0s' },
        { left: '70%', top: '52%', delay: '0.6s' },
        { left: '45%', top: '65%', delay: '1.2s' },
      ].map((d, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary shadow-[0_0_16px_hsl(var(--primary))] animate-pulse"
          style={{ left: d.left, top: d.top, animationDelay: d.delay }}
        />
      ))}
    </div>
  );
}

const features = [
  { icon: BarChart3, title: 'Camino Player Index', description: 'A proprietary 0–100 score combining 23 metrics across technical, tactical, physical, and mental domains.', color: 'from-primary/30 to-primary/5' },
  { icon: Target, title: 'Player Evaluations', description: 'Rate athletes across every dimension with interactive radar charts and real-time CPI calculations.', color: 'from-info/30 to-info/5' },
  { icon: Video, title: 'Video Analysis', description: 'Upload match footage, AI-tag key moments by player, overlay coach commentary, and generate stats.', color: 'from-success/30 to-success/5' },
  { icon: MessageSquare, title: 'Communication Hub', description: 'Club-wide announcements, direct messaging, team channels, and structured player feedback.', color: 'from-primary/30 to-primary/5' },
  { icon: Dumbbell, title: 'Fitness Testing', description: 'Record sprint times, agility, vertical jump, and endurance tests. Auto-update player ratings.', color: 'from-info/30 to-info/5' },
  { icon: TrendingUp, title: 'Progress Tracking', description: 'Visualize development over time with trend graphs, level progression, and automated insights.', color: 'from-success/30 to-success/5' },
];

const steps = [
  { num: '01', title: 'Onboard your club', description: 'Create your academy, set up teams by age group, and invite coaches, players, and parents.' },
  { num: '02', title: 'Evaluate & track', description: 'Run evaluations, record fitness tests, upload match video, and watch CPI scores update in real time.' },
  { num: '03', title: 'Develop & prove', description: 'Players build verified profiles. Parents stay informed. Coaches make data-driven decisions.' },
];

const testimonials = [
  { quote: "Camino replaced three separate tools for us. Evaluations, video, and parent communication — all in one place.", name: 'Technical Director', org: 'Youth Academy' },
  { quote: "My son's CPI went from 42 to 67 in one season. For the first time I could actually see his progress clearly.", name: 'Parent', org: 'U-14 Player' },
  { quote: "The player profiles gave our kids something to own. They share their cards, check their rankings — it drives motivation.", name: 'Head Coach', org: 'Club Program' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

function CountUp({ to, duration = 1.6 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span>{val}</span>;
}

function TypingQuote({ text }: { text: string }) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    setShown('');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [text]);
  return <span>{shown}<span className="inline-block w-[2px] h-[1em] bg-primary align-middle ml-0.5 animate-pulse" /></span>;
}

export default function LandingPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const [activeQuote, setActiveQuote] = useState(0);
  const { data: rankings = [] } = useRankings();
  const isMobile = useIsMobile();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.95]);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      setNavSolid(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveQuote((q) => (q + 1) % testimonials.length), 5500);
    return () => clearInterval(id);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden" style={{ scrollBehavior: 'smooth' }}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${navSolid ? 'border-border/60 bg-background/85 backdrop-blur-xl' : 'border-transparent bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={caminoLogo} alt="Camino" className="h-9 w-9 rounded-md object-contain" />
            <span className="font-display font-bold text-foreground text-base tracking-tight">Camino</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground font-medium">
            <button onClick={() => scrollTo('rankings')} className="hover:text-primary transition-colors">Rankings</button>
            <button onClick={() => scrollTo('cpi')} className="hover:text-primary transition-colors">CPI</button>
            <button onClick={() => scrollTo('features')} className="hover:text-primary transition-colors">Features</button>
            <button onClick={() => scrollTo('roles')} className="hover:text-primary transition-colors">Roles</button>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth"><Button variant="ghost" size="sm" className="text-primary text-sm h-9">Log in</Button></Link>
            <Link to="/auth"><Button size="sm" className="h-9 px-5 text-sm font-semibold gap-1.5">Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </nav>

      {/* HERO — 3D Pitch */}
      <motion.section ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* 3D Canvas (desktop) / lightweight gradient (mobile) */}
        {isMobile ? (
          <HeroMobileFallback />
        ) : (
          <Suspense fallback={null}>
            <Hero3DPitch />
          </Suspense>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,hsl(var(--background))_75%)] pointer-events-none" />

        {/* AI Tracking overlays - decorative */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          {[
            { x: '12%', y: '32%', label: 'P-07', xc: 1225, yc: 252, delay: 0.6 },
            { x: '78%', y: '48%', label: 'P-22', xc: 894, yc: 410, delay: 0.9 },
            { x: '24%', y: '68%', label: 'P-11', xc: 532, yc: 712, delay: 1.2 },
          ].map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: b.delay, duration: 0.6 }}
              style={{ left: b.x, top: b.y }}
              className="absolute"
            >
              <div className="relative w-20 h-24 border-2 border-primary/70 rounded">
                <div className="absolute -top-6 left-0 px-1.5 py-0.5 bg-primary text-primary-foreground text-[10px] font-mono font-bold rounded-sm">{b.label}</div>
                <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              </div>
              <div className="mt-1 font-mono text-[10px] text-primary/80">x:{b.xc} y:{b.yc}</div>
            </motion.div>
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm mb-7"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide">AI-POWERED PLAYER DEVELOPMENT</span>
            </motion.div>

            <KineticHeadline
              text="Your progress, proven."
              highlightWords={['proven.']}
              className="text-[clamp(2.75rem,8vw,6.5rem)] text-foreground"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-7 text-base lg:text-xl text-muted-foreground leading-relaxed max-w-2xl"
            >
              Camino tracks <span className="text-foreground font-semibold">23 performance metrics</span>, replaces every disconnected tool your club uses, and turns every player's journey into verified proof.
            </motion.p>

            {/* CPI counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-8 flex items-center gap-4"
            >
              <div className="px-4 py-3 rounded-xl bg-card/70 backdrop-blur-md border border-primary/20">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Live CPI</div>
                <div className="font-display font-extrabold text-primary text-3xl leading-none mt-1"><CountUp to={87} /></div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Avg Improvement</div>
                <div className="font-display font-bold text-foreground text-xl mt-1">+<CountUp to={24} duration={1.4} />%</div>
              </div>
              <div className="h-12 w-px bg-border hidden sm:block" />
              <div className="hidden sm:block">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Tracked Players</div>
                <div className="font-display font-bold text-foreground text-xl mt-1"><CountUp to={1247} duration={2} /></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="mt-10 flex items-center gap-4 flex-wrap"
            >
              <Link to="/auth">
                <MagneticButton>
                  Start Free <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-sm font-semibold border-border/80 bg-card/40 backdrop-blur text-foreground hover:bg-card hover:border-primary/30"
                onClick={() => scrollTo('cpi')}
              >
                See the CPI
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/60"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/40 flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-primary rounded-full" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Live Ticker */}
      <LiveTickerBar />

      {/* Floating Player Cards */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-bold text-primary uppercase tracking-[0.25em] mb-4">
              Verified Performance
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl lg:text-6xl font-display font-extrabold text-foreground tracking-tight leading-[1.05]">
              Every player.<br /><span className="text-primary">A digital passport.</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-5 text-base lg:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Live CPI scores. Coach-verified stats. Shareable profiles. Every athlete's progress, captured and proven.
            </motion.p>
          </motion.div>

          <FloatingPlayerCards />
        </div>
      </section>

      {/* Big Stat — Metric Orbit */}
      <section id="cpi" className="relative py-28 lg:py-36 border-t border-border/40 overflow-hidden scroll-mt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.06),transparent_70%)]" />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-5">The Camino Player Index</p>
            <h2 className="text-5xl lg:text-7xl xl:text-8xl font-display font-extrabold text-foreground tracking-tighter leading-[0.95]">
              1 number.<br /><span className="text-primary">23 metrics.</span>
            </h2>
            <p className="mt-7 text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Technical, tactical, physical, and mental — every dimension of an athlete distilled into a single, weighted score.
            </p>
          </motion.div>

          <MetricOrbit />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-16 max-w-4xl mx-auto">
            {[
              { weight: '40%', label: 'Technical', color: 'text-primary' },
              { weight: '30%', label: 'Tactical', color: 'text-info' },
              { weight: '20%', label: 'Physical', color: 'text-success' },
              { weight: '10%', label: 'Mental', color: 'text-foreground' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="text-center p-5 rounded-xl bg-card/60 border border-border/50 backdrop-blur"
              >
                <div className={`font-display font-extrabold text-3xl ${item.color}`}>{item.weight}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1.5">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Rankings */}
      <section id="rankings" className="relative py-24 lg:py-28 border-t border-border/40 scroll-mt-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-12"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <Trophy className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide">LIVE RANKINGS</span>
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse ml-1" />
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl lg:text-5xl font-display font-extrabold text-foreground tracking-tight">
              The leaderboard <span className="text-primary">is live.</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-4 text-base lg:text-lg text-muted-foreground max-w-lg mx-auto">
              Rankings update after every evaluation. Weighted by CPI, consistency, and improvement trajectory.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-4 max-w-2xl mx-auto"
          >
            {rankings.length > 0 ? (
              <LeaderboardTable players={rankings.slice(0, 10)} />
            ) : (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No ranked players yet. Be the first to join.
              </div>
            )}
          </motion.div>

          <div className="text-center mt-8">
            <Link to="/auth">
              <Button variant="outline" size="default" className="gap-2">
                Join & Get Ranked <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features — Tilt Cards */}
      <section id="features" className="relative py-24 lg:py-32 border-t border-border/40 scroll-mt-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-bold text-primary uppercase tracking-[0.25em] mb-4">
              Platform
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl lg:text-6xl font-display font-extrabold text-foreground tracking-tight leading-[1.05]">
              Everything your club needs.<br /><span className="text-muted-foreground">Nothing it doesn't.</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
              >
                <TiltCard className="h-full p-6">
                  <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl bg-gradient-to-br ${feature.color} opacity-50`} />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 border border-primary/20">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-foreground text-lg mb-2.5 tracking-tight">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 lg:py-32 border-t border-border/40 scroll-mt-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-bold text-primary uppercase tracking-[0.25em] mb-4">
              How It Works
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl lg:text-6xl font-display font-extrabold text-foreground tracking-tight leading-[1.05]">
              Three steps. <span className="text-primary">Full visibility.</span>
            </motion.h2>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-20 left-[16%] right-[16%] h-px">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.3 }}
                style={{ transformOrigin: 'left' }}
                className="h-full bg-gradient-to-r from-transparent via-primary to-transparent"
              />
            </div>

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative"
              >
                <div className="relative glass-card p-7 group h-full">
                  <span
                    className="absolute -top-2 right-5 text-7xl font-display font-extrabold text-primary/10 leading-none select-none"
                    style={{ textShadow: '0 0 30px hsl(var(--primary) / 0.15)' }}
                  >
                    {step.num}
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                    className="relative w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-5"
                  >
                    <span className="text-base font-display font-extrabold text-primary">{step.num}</span>
                  </motion.div>
                  <h3 className="font-display font-bold text-foreground text-lg mb-2.5 tracking-tight">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles — Hologram cards */}
      <section id="roles" className="relative py-24 lg:py-32 border-t border-border/40 scroll-mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--primary)/0.06),transparent_60%)]" />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-bold text-primary uppercase tracking-[0.25em] mb-4">
              Built for everyone
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl lg:text-6xl font-display font-extrabold text-foreground tracking-tight leading-[1.05]">
              Four roles. <span className="text-primary">One platform.</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Shield, role: 'Coach', desc: 'Evaluate players, run fitness tests, analyze video, and generate development reports.', features: ['Evaluations & CPI', 'Video analysis', 'Fitness testing', 'Player feedback'] },
              { icon: Star, role: 'Player', desc: 'Own your profile. Track your CPI, view radar charts, set goals, and share verified stats.', features: ['CPI dashboard', 'Skill breakdowns', 'Goal tracking', 'Public profile'] },
              { icon: Users, role: 'Parent', desc: 'Stay informed with real-time updates, coach feedback, announcements, and messaging.', features: ['Progress reports', 'Coach messaging', 'Announcements', 'Performance trends'] },
              { icon: Building2, role: 'Director', desc: 'Oversee all teams, manage coaches, track club-wide performance with data.', features: ['Club overview', 'Coach management', 'Cross-team analytics', 'Player exports'] },
            ].map((item, i) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 40, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                  className="group relative h-full p-6 rounded-2xl bg-gradient-to-b from-card/95 to-card/60 backdrop-blur-xl border border-primary/15 hover:border-primary/40 transition-all overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                  <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />

                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/25">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-foreground text-lg mb-2 tracking-tight">{item.role}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">{item.desc}</p>
                    <ul className="space-y-1.5">
                      {item.features.map(f => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-primary/70 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — Cinematic Quote */}
      <section className="relative py-24 lg:py-32 border-t border-border/40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.05),transparent_70%)]" />
        <div className="relative max-w-[1100px] mx-auto px-6 lg:px-10">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-8 text-center"
          >
            From the field
          </motion.p>

          <div className="min-h-[280px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeQuote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <p className="font-display font-bold text-2xl md:text-4xl lg:text-5xl text-foreground tracking-tight leading-[1.2]">
                  "<TypingQuote text={testimonials[activeQuote].quote} />"
                </p>
                <div className="mt-8 flex items-center justify-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center border border-primary/25">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">{testimonials[activeQuote].name}</p>
                    <p className="text-xs text-muted-foreground">{testimonials[activeQuote].org}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveQuote(i)}
                className={`h-1.5 rounded-full transition-all ${i === activeQuote ? 'w-8 bg-primary' : 'w-1.5 bg-muted-foreground/30'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section className="relative py-20 scroll-mt-16">
        <div className="max-w-xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-md p-9 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <h3 className="font-display font-bold text-foreground text-xl tracking-tight">
              See player development beyond match day
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Request early access to Camino.
            </p>
            <WaitlistForm />
          </motion.div>
        </div>
      </section>

      {/* Final CTA — Particle Burst */}
      <section className="relative py-32 lg:py-40 border-t border-border/40 overflow-hidden">
        <Suspense fallback={null}>
          <ParticleBurst />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <img src={caminoLogo} alt="" className="h-16 w-16 mx-auto mb-8 rounded-xl" />
            <h2 className="text-4xl lg:text-7xl font-display font-extrabold text-foreground tracking-tighter leading-[1.02]">
              Stop guessing.<br /><span className="text-primary">Start proving.</span>
            </h2>
            <p className="mt-6 text-base lg:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Camino is the operating system for player development. Set up your club in minutes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-3">
              <Link to="/auth">
                <MagneticButton>
                  Get Early Access <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground/70 flex-wrap">
              <div className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" />Multi-club support</div>
              <div className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" />Privacy-first</div>
              <div className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" />Real-time data</div>
              <div className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" />Built-in comms</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 relative z-10 bg-background">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={caminoLogo} alt="Camino" className="h-6 w-6 rounded object-contain" />
            <span className="font-display font-semibold text-foreground text-xs">Camino</span>
          </div>
          <p className="text-xs text-muted-foreground/50">© 2026 Camino. The Pathway to Elite Football.</p>
        </div>
      </footer>

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)] hover:brightness-110 transition-all"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
