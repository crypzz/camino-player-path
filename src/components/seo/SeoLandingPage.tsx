import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { WaitlistForm } from '@/components/WaitlistForm';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { ScrollReveal } from '@/components/landing/ScrollReveal';
import type { SeoLandingContent } from '@/data/seoLandings';
import caminoLogo from '@/assets/camino-logo.png';

const SITE = 'https://caminodevelopment.com';

interface Props {
  content: SeoLandingContent;
  /** Source tag passed to the waitlist form (e.g. 'seo:ca/calgary/youth-soccer-app'). */
  sourceTag: string;
  /** Optional breadcrumb crumbs (label, href). */
  breadcrumbs?: { label: string; href: string }[];
}

export function SeoLandingPage({ content, sourceTag, breadcrumbs }: Props) {
  const canonical = `${SITE}/${content.slug.replace(/^\//, '')}`.replace(
    /\/solutions\//,
    '/solutions/'
  );

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Camino',
    applicationCategory: 'SportsApplication',
    operatingSystem: 'Web, iOS, Android',
    description: content.description,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const breadcrumbJsonLd = breadcrumbs && {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.label,
      item: `${SITE}${b.href}`,
    })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index,follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="Camino" />
        <meta property="og:image" content={`${SITE}/camino-logo.png`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CaminoFootball" />
        <meta name="twitter:title" content={content.title} />
        <meta name="twitter:description" content={content.description} />
        <meta name="twitter:image" content={`${SITE}/camino-logo.png`} />

        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        {breadcrumbJsonLd && (
          <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        )}
      </Helmet>

      {/* Top nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={caminoLogo} alt="Camino" className="h-8 w-8 rounded-md object-contain" />
            <span className="font-display font-extrabold text-foreground text-lg tracking-tight">
              Camino
            </span>
          </Link>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-primary text-primary-foreground text-xs font-semibold tracking-wide shadow-[0_0_24px_-6px_hsl(var(--primary)/0.7)] hover:shadow-[0_0_36px_-4px_hsl(var(--primary)/0.9)] transition-shadow"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Join Waitlist
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-32 pb-20 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.18),transparent_60%)]" />
        <div className="max-w-3xl mx-auto text-center">
          {breadcrumbs && (
            <nav aria-label="Breadcrumb" className="mb-6 text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              {breadcrumbs.map((b, i) => (
                <span key={b.href}>
                  {i > 0 && <span className="mx-2 text-border">/</span>}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-primary">{b.label}</span>
                  ) : (
                    <Link to={b.href} className="hover:text-foreground">
                      {b.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          )}

          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-mono uppercase tracking-[0.3em] text-primary mb-4"
          >
            {content.kicker}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display font-extrabold text-4xl md:text-6xl tracking-[-0.02em] leading-[1.05] text-foreground"
          >
            {content.h1}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {content.subhead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 backdrop-blur-md px-4 py-1.5 text-xs text-muted-foreground"
          >
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Limited onboarding spots — rolling access
          </motion.div>
        </div>
      </header>

      {/* Intro */}
      <ScrollReveal>
        <section className="px-6 lg:px-10 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed text-center">
              {content.intro}
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Features */}
      <ScrollReveal>
        <section className="px-6 lg:px-10 py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-foreground text-center mb-14">
              What you get with{' '}
              <span className="font-serif italic font-normal text-primary">Camino</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {content.features.map((f) => (
                <article
                  key={f.title}
                  className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-7 shadow-[0_8px_40px_-20px_hsl(var(--primary)/0.25)]"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-display font-bold text-lg text-foreground">{f.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ */}
      <ScrollReveal>
        <section className="px-6 lg:px-10 py-20 border-t border-border/30 bg-card/10">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight text-foreground text-center mb-12">
              Questions, answered.
            </h2>
            <dl className="space-y-5">
              {content.faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-xl border border-border/40 bg-background/40 p-6"
                >
                  <dt className="font-display font-semibold text-foreground text-base">{faq.q}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <section
        id="waitlist"
        className="relative px-6 lg:px-10 py-28 overflow-hidden scroll-mt-24"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.14),transparent_60%)]" />
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-primary mb-3">
            Join the inside
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-[-0.02em] leading-[1.05] text-foreground">
            {content.ctaHeadline}
          </h2>
          <p className="mt-5 text-muted-foreground text-base max-w-lg mx-auto">
            {content.ctaSub}
          </p>
          <div className="mt-10">
            <WaitlistForm variant="block" source={sourceTag} />
          </div>

          <div className="mt-12">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
            >
              Explore the full Camino platform
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
