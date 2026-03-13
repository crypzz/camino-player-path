import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ArrowUp, BarChart3, Shield, Users, Video, Target, 
  TrendingUp, Zap, Globe, ChevronRight, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroPattern from '@/assets/hero-pattern.jpg';

const features = [
  {
    icon: BarChart3,
    title: 'Camino Player Index',
    description: 'Proprietary 0–100 scoring system combining technical, tactical, physical, and mental attributes into one actionable metric.',
  },
  {
    icon: Target,
    title: 'Player Evaluations',
    description: 'Rate players across 23 metrics with interactive radar charts and real-time CPI calculations.',
  },
  {
    icon: Video,
    title: 'Video Analysis',
    description: 'Upload match and training footage, tag key moments, and attach coach commentary for review.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Visualize development over time with quarterly reports, trend graphs, and automated insights.',
  },
  {
    icon: Users,
    title: 'Multi-Role Access',
    description: 'Dedicated dashboards for coaches, players, and parents — each with tailored views and permissions.',
  },
  {
    icon: Shield,
    title: 'Development Reports',
    description: 'Generate comprehensive quarterly reports with skill ratings, recommendations, and exportable PDFs.',
  },
];

const stats = [
  { value: '23', label: 'Performance Metrics' },
  { value: '3', label: 'Dashboard Views' },
  { value: '100', label: 'CPI Score Range' },
  { value: '4', label: 'Skill Categories' },
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
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-xs">C</span>
            </div>
            <span className="font-display font-bold text-foreground text-sm tracking-tight">Camino</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[12px] text-muted-foreground">
            <button onClick={() => scrollTo('features')} className="hover:text-foreground transition-colors">Features</button>
            <button onClick={() => scrollTo('cpi')} className="hover:text-foreground transition-colors">CPI</button>
            <button onClick={() => scrollTo('roles')} className="hover:text-foreground transition-colors">Roles</button>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground text-[13px] h-8">
                Log in
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="h-8 text-[13px] font-semibold gap-1.5">
                Get Started <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-14">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-10" />
          <img
            src={heroPattern}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto px-5 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-[11px] font-medium text-primary tracking-wide">PLAYER DEVELOPMENT PLATFORM</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl lg:text-5xl font-display font-extrabold text-foreground leading-[1.1] tracking-tight"
            >
              The digital passport for{' '}
              <span className="text-primary">elite player</span>{' '}
              development
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-[15px] text-muted-foreground leading-relaxed max-w-lg"
            >
              Camino gives academies a complete toolkit to track, evaluate, and accelerate youth player development — from first touch to first team.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex items-center gap-3"
            >
              <Link to="/dashboard">
                <Button size="lg" className="h-11 px-6 text-[13px] font-semibold gap-2">
                  Open Platform <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-11 px-6 text-[13px] font-semibold border-border text-muted-foreground hover:text-foreground">
                Watch Demo
              </Button>
            </motion.div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card p-5 text-center">
                <div className="text-2xl font-display font-bold text-primary tracking-tight">{stat.value}</div>
                <div className="text-[11px] text-muted-foreground font-medium mt-0.5 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-20 lg:py-28 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em] mb-3">
              Features
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl lg:text-3xl font-display font-bold text-foreground tracking-tight">
              Everything your academy needs
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-3 text-[14px] text-muted-foreground max-w-md mx-auto">
              A complete platform designed for modern football academies to develop world-class talent.
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
                <p className="text-[12.5px] text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CPI Section */}
      <section id="cpi" className="relative py-20 lg:py-28 border-t border-border/40 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <motion.p variants={fadeUp} custom={0} className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em] mb-3">
                Camino Player Index
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="text-2xl lg:text-3xl font-display font-bold text-foreground tracking-tight">
                One score. Complete picture.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="mt-3 text-[14px] text-muted-foreground leading-relaxed">
                The CPI distills 23 performance metrics into a single 0–100 score, weighted to reflect what matters most in player development.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="mt-6 space-y-3">
                {[
                  { weight: '40%', label: 'Technical Ability', desc: '8 metrics including first touch, dribbling, weak foot' },
                  { weight: '30%', label: 'Tactical Intelligence', desc: '5 metrics covering positioning, decision making, game reading' },
                  { weight: '20%', label: 'Physical Performance', desc: '5 metrics from sprint speed to endurance' },
                  { weight: '10%', label: 'Mental Attributes', desc: '5 metrics including composure, leadership, resilience' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 p-3 rounded-md bg-card border border-border/50">
                    <span className="text-xs font-display font-bold text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">{item.weight}</span>
                    <div>
                      <h4 className="text-[13px] font-semibold text-foreground">{item.label}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
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
                {/* Large CPI ring visualization */}
                <div className="w-64 h-64 relative">
                  <svg width="256" height="256" className="-rotate-90">
                    <circle cx="128" cy="128" r="110" fill="none" stroke="hsl(225, 15%, 13%)" strokeWidth="8" />
                    <circle
                      cx="128" cy="128" r="110" fill="none"
                      stroke="hsl(45, 100%, 58%)" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 110}
                      strokeDashoffset={2 * Math.PI * 110 * (1 - 0.73)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-display font-extrabold text-primary tracking-tight">73</span>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium mt-1">CPI Score</span>
                  </div>
                </div>
                {/* Floating labels */}
                <div className="absolute -top-2 -right-4 bg-card border border-border rounded-md px-2.5 py-1.5 shadow-lg">
                  <div className="text-[10px] text-muted-foreground">Technical</div>
                  <div className="text-sm font-display font-bold text-foreground">7.5</div>
                </div>
                <div className="absolute top-16 -left-8 bg-card border border-border rounded-md px-2.5 py-1.5 shadow-lg">
                  <div className="text-[10px] text-muted-foreground">Tactical</div>
                  <div className="text-sm font-display font-bold text-info">6.8</div>
                </div>
                <div className="absolute bottom-16 -right-6 bg-card border border-border rounded-md px-2.5 py-1.5 shadow-lg">
                  <div className="text-[10px] text-muted-foreground">Physical</div>
                  <div className="text-sm font-display font-bold text-success">7.8</div>
                </div>
                <div className="absolute -bottom-2 -left-2 bg-card border border-border rounded-md px-2.5 py-1.5 shadow-lg">
                  <div className="text-[10px] text-muted-foreground">Mental</div>
                  <div className="text-sm font-display font-bold text-[hsl(275,65%,55%)]">7.2</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="relative py-20 lg:py-28 border-t border-border/40 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em] mb-3">
              Built for everyone
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl lg:text-3xl font-display font-bold text-foreground tracking-tight">
              Three views. One platform.
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            {[
              {
                icon: Shield,
                role: 'Coach',
                desc: 'Manage squads, run evaluations, track attendance, analyze video, and generate development reports.',
                features: ['Player management', 'Evaluation system', 'Video analysis', 'Attendance tracking'],
              },
              {
                icon: Star,
                role: 'Player',
                desc: 'View your CPI score, track progress over time, review goals, and watch your highlight clips.',
                features: ['CPI dashboard', 'Skill radar charts', 'Goal tracking', 'Video highlights'],
              },
              {
                icon: Users,
                role: 'Parent',
                desc: 'Stay informed with progress reports, performance graphs, coach notes, and upcoming schedules.',
                features: ['Progress reports', 'Performance trends', 'Coach feedback', 'Training schedule'],
              },
            ].map((item, i) => (
              <motion.div
                key={item.role}
                variants={fadeUp}
                custom={i + 2}
                className="glass-card p-6 text-center group hover:border-primary/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/12 transition-colors">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground text-base mb-2">{item.role}</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed mb-4">{item.desc}</p>
                <ul className="space-y-1.5">
                  {item.features.map(f => (
                    <li key={f} className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                      <ChevronRight className="h-3 w-3 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 lg:py-28 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-2xl lg:text-3xl font-display font-bold text-foreground tracking-tight">
              Ready to transform your academy?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-3 text-[14px] text-muted-foreground max-w-md mx-auto">
              Join the next generation of player development. Start tracking, evaluating, and accelerating talent today.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="mt-8 flex items-center justify-center gap-3">
              <Link to="/dashboard">
                <Button size="lg" className="h-11 px-8 text-[13px] font-semibold gap-2">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} custom={3} className="mt-12 flex items-center justify-center gap-8 text-[11px] text-muted-foreground/60">
              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                Multi-academy support
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Secure & private
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                Real-time analytics
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-[10px]">C</span>
            </div>
            <span className="font-display font-semibold text-foreground text-xs">Camino</span>
          </div>
          <p className="text-[11px] text-muted-foreground/50">© 2026 Camino. Player Development Platform.</p>
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
