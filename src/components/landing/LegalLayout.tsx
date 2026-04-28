import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import caminoLogo from '@/assets/camino-logo.png';
import { SiteFooter } from './SiteFooter';
import { Button } from '@/components/ui/button';

interface LegalLayoutProps {
  title: string;
  updated?: string;
  eyebrow?: string;
  children: ReactNode;
}

export function LegalLayout({ title, updated, eyebrow, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={caminoLogo} alt="Camino" className="h-8 w-8 rounded-md object-contain" />
            <span className="font-display font-extrabold text-lg tracking-tight">Camino</span>
          </Link>
          <Link to="/#waitlist">
            <Button size="sm" className="rounded-full font-semibold">Join Waitlist</Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 lg:px-10 py-20">
        <article className="max-w-3xl mx-auto">
          {eyebrow && (
            <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-primary mb-4">{eyebrow}</p>
          )}
          <h1 className="font-display font-extrabold text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05]">
            {title}
          </h1>
          <div className="mt-4 h-px w-16 bg-primary/60" />
          {updated && (
            <p className="mt-4 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Last updated: {updated}
            </p>
          )}

          <div className="mt-12 space-y-8 text-[15px] leading-[1.75] text-muted-foreground [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:text-2xl [&_h2]:tracking-tight [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_strong]:text-foreground">
            {children}
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
