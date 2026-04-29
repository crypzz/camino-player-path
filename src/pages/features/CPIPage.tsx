import { LegalLayout } from '@/components/landing/LegalLayout';

export default function CPIPage() {
  return (
    <LegalLayout title="Camino Player Index" eyebrow="Platform · CPI" updated="April 28, 2026">
      <p>
        The Camino Player Index (CPI) is a single 0–100 score that captures where a player stands
        across <strong>23 technical, tactical, physical, and mental attributes</strong>. It is the
        backbone of every profile, ranking, and report on the platform.
      </p>

      <h2>Why a single number</h2>
      <p>
        Youth football generates a flood of data — evaluations, fitness tests, match events,
        attendance — and almost none of it gets used. The CPI compresses that signal into one
        comparable number so coaches can sort, players can chase, and parents can finally see
        progress without reading a 20-page report.
      </p>

      <h2>What feeds the score</h2>
      <ul>
        <li><strong>Coach evaluations</strong> across the 23 attributes (weighted by category).</li>
        <li><strong>Verified fitness results</strong> — sprint, agility, vertical, beep test.</li>
        <li><strong>Match performance</strong> — events tagged from uploaded video.</li>
        <li><strong>Consistency</strong> — how often a player performs at their level.</li>
      </ul>

      <h2>Category weighting</h2>
      <p>
        Technique and decision-making count more than raw athleticism. The full breakdown ships
        in-product so players can see exactly which attribute moved their score.
      </p>

      <h2>Always recomputed</h2>
      <p>
        Every new evaluation, fitness test, or verified clip recomputes the score. There is no
        end-of-season bottleneck — development is visible in real time.
      </p>
    </LegalLayout>
  );
}
