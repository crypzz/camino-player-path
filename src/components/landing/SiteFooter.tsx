import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MouseEvent } from 'react';
import caminoLogo from '@/assets/camino-logo.png';

type FooterLink = { label: string; href: string };

const sections: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Camino Player Index', href: '/#cpi' },
      { label: 'Video Analysis', href: '/#video' },
      { label: 'Evaluations', href: '/#cpi' },
      { label: 'Fitness Testing', href: '/#cpi' },
      { label: 'Communication Hub', href: '/#profiles' },
    ],
  },
  {
    title: 'Built for',
    links: [
      { label: 'Coaches', href: '/#waitlist' },
      { label: 'Players', href: '/#waitlist' },
      { label: 'Parents', href: '/#waitlist' },
      { label: 'Directors', href: '/#waitlist' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'How CPI Works', href: '/#cpi' },
      { label: 'Methodology', href: '/about' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: 'mailto:hello@caminodevelopment.com' },
      { label: 'Press', href: 'mailto:hello@caminodevelopment.com?subject=Press%20inquiry' },
      { label: 'Join Waitlist', href: '/#waitlist' },
    ],
  },
];

function useFooterLink() {
  const location = useLocation();
  const navigate = useNavigate();

  return (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('mailto:') || href.startsWith('http')) return;
    const [path, hash] = href.split('#');
    if (!hash) return;
    e.preventDefault();
    if (location.pathname === (path || '/')) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(path || '/');
      // wait for landing page to mount, then scroll
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  };
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const onClick = useFooterLink()(href);
  if (href.startsWith('mailto:') || href.startsWith('http')) {
    return (
      <a href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
        {children}
      </a>
    );
  }
  if (href.includes('#')) {
    return (
      <a
        href={href}
        onClick={onClick}
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
      {children}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative bg-background pt-20 pb-10 overflow-hidden">
      {/* Top gold underline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 lg:gap-12 mb-16">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img src={caminoLogo} alt="Camino" className="h-10 w-10 rounded-lg object-contain" />
              <span className="font-display font-extrabold text-foreground text-2xl tracking-tight">Camino</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
              The operating system for player development. One passport. Every player. Tracked from U-8 to pro.
            </p>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-success">All systems live</span>
            </div>
          </div>

          {/* Link columns */}
          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="font-display font-bold text-foreground text-sm tracking-tight mb-4">{s.title}</h4>
              <ul className="space-y-2.5">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <FooterLink href={l.href}>{l.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Massive wordmark */}
        <div className="relative mb-10 overflow-hidden">
          <div className="font-display font-extrabold text-foreground/[0.04] text-[clamp(6rem,18vw,16rem)] leading-[0.8] tracking-tighter select-none">
            CAMINO
          </div>
          <div className="absolute bottom-3 right-0 hidden lg:block">
            <div className="font-serif italic text-muted-foreground text-base">— the pathway to elite football.</div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/70">
            © 2026 Camino Development. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground/70">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
            <span className="font-mono">v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
