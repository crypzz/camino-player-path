import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: 'This changed how I evaluate talent. I finally have receipts for what I see on the pitch.',
    name: 'Marcus Bennett',
    role: 'Head Coach · U-18 Academy',
    initials: 'MB',
  },
  {
    quote: "Finally seeing what my kid is actually doing on the field — not just the final score.",
    name: 'Priya Sharma',
    role: 'Parent',
    initials: 'PS',
  },
  {
    quote: "It's like having my own analytics team. I know exactly what to work on every week.",
    name: 'Diego Ramirez',
    role: 'Player · U-18 CB',
    initials: 'DR',
  },
];

export function Testimonials() {
  return (
    <section className="relative border-y border-border/30 bg-card/20 py-28 px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">Trusted on the pitch</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Stop wondering if you're good enough.
            <br />
            Let <span className="font-serif font-normal italic text-primary">data</span> show the world.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col rounded-2xl border border-border/50 bg-background/50 p-6 backdrop-blur-sm"
            >
              <Quote className="mb-4 h-6 w-6 text-primary/60" />
              <blockquote className="flex-1 text-base leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border/40 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-display text-sm font-bold text-primary">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="font-mono text-[11px] text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
