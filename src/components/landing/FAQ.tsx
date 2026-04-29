import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const items = [
  {
    q: 'When does Camino launch?',
    a: 'We are onboarding select clubs in Calgary now, with a wider rollout through 2026. Joining the waitlist secures your spot in line.',
  },
  {
    q: 'How much does it cost?',
    a: 'Early-access clubs and players pay nothing during the pilot. Pricing for general availability will be announced before launch — waitlist members hear first.',
  },
  {
    q: 'Do I need a coach to sign up?',
    a: 'Players can join solo and start building a profile. Verified stats and CPI scoring unlock once your coach or club is on the platform.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Profiles default to private. You decide who sees your stats, video and contact info. Match film is stored in private storage with signed access only.',
  },
  {
    q: 'Which clubs are onboarding now?',
    a: 'A handful of academies in Calgary are in the closed pilot. We add new clubs every few weeks as capacity allows.',
  },
  {
    q: 'What devices does it work on?',
    a: 'Camino runs in any modern browser and ships as a native iOS and Android app for players, coaches, parents and directors.',
  },
];

export function FAQ() {
  return (
    <section className="relative py-32 px-6 lg:px-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-primary mb-3">FAQ</p>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-foreground">
            Questions, <span className="font-serif italic font-normal text-primary">answered</span>.
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border-border/40"
            >
              <AccordionTrigger className="text-left font-display font-bold text-base md:text-lg text-foreground hover:no-underline hover:text-primary transition-colors py-5">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed pb-5">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
