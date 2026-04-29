import { LegalLayout } from '@/components/landing/LegalLayout';

export default function FitnessTestingPage() {
  return (
    <LegalLayout title="Fitness Testing" eyebrow="Platform · Fitness" updated="April 28, 2026">
      <p>
        Camino's fitness module turns raw test results into <strong>1–10 scores benchmarked
        against youth-athlete standards</strong>, so coaches and parents can finally compare
        apples to apples.
      </p>

      <h2>Tests we support</h2>
      <ul>
        <li><strong>10m / 30m sprint</strong> — acceleration and top-end speed.</li>
        <li><strong>505 agility</strong> — change of direction.</li>
        <li><strong>Vertical jump</strong> — lower-body power.</li>
        <li><strong>Beep test</strong> — aerobic capacity.</li>
      </ul>

      <h2>Age- and gender-adjusted</h2>
      <p>
        Raw seconds and centimeters are mapped to 1–10 scores against youth benchmarks for the
        player's age band, so a U-12's 5.2s sprint and a U-18's 4.4s sprint can be ranked side by
        side fairly.
      </p>

      <h2>Feeds the CPI</h2>
      <p>
        Fitness scores roll directly into the Physical category of the Camino Player Index — no
        manual entry, no double-counting.
      </p>

      <h2>Player level progression</h2>
      <p>
        Combined with CPI and training frequency, fitness drives the 10-level / 5-tier player
        progression system that makes development feel earned, not arbitrary.
      </p>
    </LegalLayout>
  );
}
