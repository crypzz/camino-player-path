import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUp, BarChart3, Shield, Users, Video, Target,
  TrendingUp, Zap, Globe, ChevronRight, Star, Trophy, MessageSquare,
  Activity, CheckCircle2, Building2, Dumbbell, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { useRankings } from '@/hooks/useRankings';
import heroPattern from '@/assets/hero-pattern.jpg';
import { WaitlistForm } from '@/components/WaitlistForm';
import caminoLogo from '@/assets/camino-logo.png';

const features = [
  {
    icon: BarChart3,
    title: 'Camino Player Index',
    description: 'A proprietary 0–100 score combining 23 metrics across technical, tactical, physical, and mental domains. One number. Full clarity.',
  },
  {
    icon: Target,
    title: 'Player Evaluations',
    description: 'Rate athletes across every dimension with interactive radar charts, real-time CPI calculations, and exportable reports.',
  },
  {
    icon: Video,
    title: 'Video Analysis',
    description: 'Upload match footage, tag key moments by player, overlay coach commentary, and generate per-player performance stats.',
  },
  {
    icon: MessageSquare,
    title: 'Communication Hub',
    description: 'Club-wide announcements, direct messaging, team channels, and structured player feedback — all in one place. Replace WhatsApp.',
  },
  {
    icon: Dumbbell,
    title: 'Fitness Testing',
    description: 'Record sprint times, agility, vertical jump, and endurance tests. Results auto-update player physical ratings.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Visualize development over time with trend graphs, level progression, and automated performance insights.',
  },
];

const stats = [
  { value: '23', label: 'Performance Metrics' },
  { value: '4', label: 'User Roles' },
  { value: '100', label: 'CPI Score Range' },
  { value: '10', label: 'Player Levels' },
];

const steps = [
  {
    num: '01',
    title: 'Onboard your club',
    description: 'Create your academy, set up teams by age group, and invite coaches, players, and parents to the platform.',
  },
  {
    num: '02',
    title: 'Evaluate & track',
    description: 'Run evaluations, record fitness tests, upload match video, and watch CPI scores update in real time.',
  },
  {
    num: '03',
    title: 'Develop & prove',
    description: 'Players build verified profiles. Parents stay informed. Coaches make data-driven decisions. Everyone levels up.',
  },
];

const testimonials = [
  {
    quote: "Camino replaced three separate tools for us. Evaluations, video, and parent communication — all in one place.",
    name: 'Technical Director',
    org: 'Youth Academy',
  },
  {
    quote: "My son's CPI went from 42 to 67 in one season. For the first time I could actually see his progress clearly.",
    name: 'Parent',
    org: 'U-14 Player',
  },
  {
    quote: "The player profiles gave our kids something to own. They share their cards, check their rankings — it drives motivation.",
    name: 'Head Coach',
    org: 'Club Program',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function LandingPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [navSolid, setNavSolid] = useState(false);
  const { data: rankings = [] } = useRankings();

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      setNavSolid(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background" style={{ scrollBehavior: 'smooth' }}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${navSolid ? 'border-border/60 bg-background/95 backdrop-blur-xl' : 'border-transparent bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={caminoLogo} alt="Camino" className="h-9 w-9 rounded-md object-contain" />
            <span className="font-display font-bold text-foreground text-base tracking-tight">Camino</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground font-medium">
            <button onClick={() => scrollTo('rankings')} className="transition-colors text-secondary-foreground">Rankings</button>
            <button onClick={() => scrollTo('features')} className="transition-colors text-secondary-foreground">Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="transition-colors text-secondary-foreground">How It Works</button>
            <button onClick={() => scrollTo('roles')} className="transition-colors text-secondary-foreground">Roles</button>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-primary text-sm h-9">
                Log in
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="h-9 px-5 text-sm font-semibold gap-1.5">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/75 to-background z-10" />
          <img src={heroPattern} alt="" className="w-full h-full object-cover opacity-60" />
        </div>

        <div className="relative z-20 max-w-[1400px] mx-auto px-6 lg:px-10 pt-24 pb-20 lg:pt-32 lg:pb-24">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-7"
            >
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary tracking-wide">PLAYER DEVELOPMENT PLATFORM</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl xl:text-7xl font-display font-extrabold text-foreground leading-[1.05] tracking-tight"
            >
              Your progress,{' '}
              <span className="text-primary">proven.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl"
            >
              Camino is the all-in-one platform where academies evaluate, communicate, and develop talent.
              Track 23 performance metrics. Build verified player profiles. Replace guesswork with proof.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex items-center gap-4"
            >
              <Link to="/auth">
                <Button size="lg" className="h-12 px-8 text-sm font-semibold gap-2">
                  Start Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-sm font-semibold border-border/80 bg-card/40 text-foreground hover:bg-card hover:border-primary/30"
                onClick={() => scrollTo('how-it-works')}
              >
                See How It Works
              </Button>
            </motion.div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card p-6 text-center">
                <div className="text-3xl font-display font-bold text-primary tracking-tight">{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="relative py-14 scroll-mt-16">
        <div className="max-w-xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-8 text-center shadow-sm"
          >
            <h3 className="font-display font-bold text-foreground text-lg tracking-tight">
              See player development beyond match day
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Request early access to Camino.
            </p>
            <WaitlistForm />
          </motion.div>
        </div>
      </section>

      {/* Live Rankings */}
      <section id="rankings" className="relative py-20 lg:py-28 border-t border-border/40 scroll-mt-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-10"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Trophy className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-primary tracking-wide">LIVE RANKINGS</span>
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
              The Leaderboard Is Live
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-3 text-base text-muted-foreground max-w-md mx-auto">
              Rankings update after every evaluation. Weighted by CPI, consistency, and improvement trajectory.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
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

          <div className="text-center mt-6">
            <Link to="/auth">
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                Join & Get Ranked <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-20 lg:py-28 scroll-mt-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">
              Platform
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
              Everything your club needs. Nothing it doesn't.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-3 text-base text-muted-foreground max-w-lg mx-auto">
              Evaluations, communication, fitness, video analysis, and player profiles — unified in a single platform built for youth football.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                custom={i + 3}
                className="glass-card p-5 group hover:border-primary/20 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-md bg-primary/8 flex items-center justify-center mb-3.5 group-hover:bg-primary/12 transition-colors">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CPI Section */}
      <section id="cpi" className="relative py-20 lg:py-28 border-t border-border/40 scroll-mt-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <motion.p variants={fadeUp} custom={0} className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">
                Camino Player Index
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
                One score. Complete picture.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="mt-3 text-base text-muted-foreground leading-relaxed">
                The CPI distills 23 performance metrics into a single 0–100 score. Coaches evaluate. The system quantifies. Players own their proof.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="mt-6 space-y-3">
                {[
                  { weight: '40%', label: 'Technical Ability', desc: 'First touch, dribbling, passing, crossing, finishing, heading, weak foot, free kicks' },
                  { weight: '30%', label: 'Tactical Intelligence', desc: 'Positioning, decision making, game reading, pressing, transition play' },
                  { weight: '20%', label: 'Physical Performance', desc: '10m & 30m sprint, agility, vertical jump, endurance — auto-scored from fitness tests' },
                  { weight: '10%', label: 'Mental Attributes', desc: 'Composure, leadership, work rate, resilience, communication' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-3 rounded-md bg-card border border-border/50">
                    <span className="text-xs font-display font-bold text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">{item.weight}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{item.label}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="w-64 h-64 relative">
                  <svg width="256" height="256" className="-rotate-90">
                    <circle cx="128" cy="128" r="110" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                    <circle
                      cx="128" cy="128" r="110" fill="none"
                      stroke="hsl(var(--primary))" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 110}
                      strokeDashoffset={2 * Math.PI * 110 * (1 - 0.73)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-display font-extrabold text-primary tracking-tight">73</span>
                    <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-medium mt-1">CPI Score</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-4 bg-card border border-border rounded-md px-2.5 py-1.5 shadow-lg">
                  <div className="text-[11px] text-muted-foreground">Technical</div>
                  <div className="text-sm font-display font-bold text-foreground">7.5</div>
                </div>
                <div className="absolute top-16 -left-8 bg-card border border-border rounded-md px-2.5 py-1.5 shadow-lg">
                  <div className="text-[11px] text-muted-foreground">Tactical</div>
                  <div className="text-sm font-display font-bold text-info">6.8</div>
                </div>
                <div className="absolute bottom-16 -right-6 bg-card border border-border rounded-md px-2.5 py-1.5 shadow-lg">
                  <div className="text-[11px] text-muted-foreground">Physical</div>
                  <div className="text-sm font-display font-bold text-success">7.8</div>
                </div>
                <div className="absolute -bottom-2 -left-2 bg-card border border-border rounded-md px-2.5 py-1.5 shadow-lg">
                  <div className="text-[11px] text-muted-foreground">Mental</div>
                  <div className="text-sm font-display font-bold text-accent-foreground">7.2</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-20 lg:py-28 border-t border-border/40 scroll-mt-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">
              How It Works
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
              Three steps. Full visibility.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                custom={i + 2}
                className="relative glass-card p-6 group"
              >
                <span className="text-3xl font-display font-extrabold text-primary/15 absolute top-4 right-5">{step.num}</span>
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <span className="text-xs font-display font-bold text-primary">{step.num}</span>
                </div>
                <h3 className="font-display font-bold text-foreground text-sm mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="relative py-20 lg:py-28 border-t border-border/40 scroll-mt-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">
              Built for everyone
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
              Four roles. One platform.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-3 text-base text-muted-foreground max-w-md mx-auto">
              Every stakeholder in the development pathway gets a dedicated experience.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {[
              {
                icon: Shield,
                role: 'Coach',
                desc: 'Evaluate players, run fitness tests, analyze video, communicate with parents, and generate development reports.',
                features: ['Evaluations & CPI', 'Video analysis', 'Fitness testing', 'Player feedback'],
              },
              {
                icon: Star,
                role: 'Player',
                desc: 'Own your profile. Track your CPI, view radar charts, set goals, and share your verified stats with anyone.',
                features: ['CPI dashboard', 'Skill breakdowns', 'Goal tracking', 'Public profile'],
              },
              {
                icon: Users,
                role: 'Parent',
                desc: 'Stay informed with real-time progress updates, coach feedback, announcements, and direct messaging.',
                features: ['Progress reports', 'Coach messaging', 'Announcements', 'Performance trends'],
              },
              {
                icon: Building2,
                role: 'Director',
                desc: 'Oversee all teams, manage coaches, track club-wide performance, and drive development strategy with data.',
                features: ['Club overview', 'Coach management', 'Cross-team analytics', 'Player exports'],
              },
            ].map((item, i) => (
              <motion.div
                key={item.role}
                variants={fadeUp}
                custom={i + 3}
                className="glass-card p-5 text-center group hover:border-primary/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/12 transition-colors">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground text-sm mb-1.5">{item.role}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
                <ul className="space-y-1">
                  {item.features.map(f => (
                    <li key={f} className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-primary/60" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-16 lg:py-20 border-t border-border/40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">
              From the field
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
              Proof, not promises.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i + 2}
                className="glass-card p-6"
              >
                <p className="text-sm text-foreground/90 leading-relaxed italic mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.org}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 lg:py-20 border-t border-border/40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
              Stop guessing. Start proving.
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-3 text-base text-muted-foreground max-w-md mx-auto">
              Camino is the operating system for player development. Set up your club in minutes. Start evaluating today.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="mt-8 flex items-center justify-center gap-3">
              <Link to="/auth">
                <Button size="lg" className="h-11 px-8 text-sm font-semibold gap-2">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} custom={3} className="mt-10 flex items-center justify-center gap-8 text-xs text-muted-foreground/70 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                Multi-club support
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Privacy-first
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                Real-time data
              </div>
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                Built-in comms
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
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
            className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:brightness-110 transition-all"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
