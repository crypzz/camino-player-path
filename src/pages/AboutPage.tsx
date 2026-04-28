import { LegalLayout } from '@/components/landing/LegalLayout';

export default function AboutPage() {
  return (
    <LegalLayout title="About Camino" eyebrow="Our story" updated="April 28, 2026">
      <p>
        Camino is the operating system for player development. One passport. Every player.
        Tracked from U-8 to pro.
      </p>
      <p>
        We started Camino because youth football moves fast and the data around it doesn't. Talent
        gets missed. Effort gets forgotten. Coaches lose hours to spreadsheets, parents lose sight
        of progress, and players lose the proof of how far they've come.
      </p>

      <h2>What we're building</h2>
      <p>
        A single platform that follows a player through their entire journey — every training
        session, evaluation, match, fitness test, and clip — and turns it into a clear, comparable
        story.
      </p>
      <ul>
        <li><strong>Camino Player Index (CPI)</strong> — a 0–100 score across 23 technical, tactical, physical, and mental attributes.</li>
        <li><strong>Rankings</strong> — composite scores that weight performance, consistency, and improvement.</li>
        <li><strong>Video analysis</strong> — frame-accurate event tagging tied to a pitch mini-map.</li>
        <li><strong>Fitness testing</strong> — sprint, agility, vertical jump, and beep-test data benchmarked against youth standards.</li>
        <li><strong>Communication hub</strong> — role-based messaging that replaces club WhatsApp groups.</li>
      </ul>

      <h2>Methodology</h2>
      <p>
        The CPI is the heart of Camino. Each attribute is captured by a coach evaluation, a fitness
        result, or a verified match event. We weight categories deliberately — technique and
        decision-making count more than raw athleticism — and recompute the score every time new
        evidence is added. Rankings then layer in two more factors: <strong>consistency</strong>
        {' '}(how often a player performs at their level) and <strong>improvement</strong> (the
        slope of their last 90 days). The full breakdown ships in-product so players, parents, and
        coaches can see exactly why a number changed.
      </p>

      <h2>Where we are</h2>
      <p>
        We're onboarding our first cohort of clubs in <strong>Calgary, Canada</strong>. Access is
        rolling — clubs come on one at a time so every team gets a real onboarding, not a generic
        sign-up flow. If your club is interested, the fastest way in is the
        {' '}<a href="/#waitlist">waitlist</a>.
      </p>

      <h2>Get in touch</h2>
      <p>
        Press, partnerships, or just curious?{' '}
        <a href="mailto:hello@caminodevelopment.com">hello@caminodevelopment.com</a>
      </p>
    </LegalLayout>
  );
}
