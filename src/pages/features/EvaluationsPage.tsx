import { LegalLayout } from '@/components/landing/LegalLayout';

export default function EvaluationsInfoPage() {
  return (
    <LegalLayout title="Evaluations" eyebrow="Platform · Evaluations" updated="April 28, 2026">
      <p>
        Coach evaluations are the human signal behind every CPI score. Camino gives coaches a
        fast, structured way to score players across 23 attributes without ever opening a
        spreadsheet.
      </p>

      <h2>23 attributes, four categories</h2>
      <ul>
        <li><strong>Technical</strong> — first touch, passing range, finishing, 1v1.</li>
        <li><strong>Tactical</strong> — positioning, decision-making, off-ball movement.</li>
        <li><strong>Physical</strong> — speed, strength, agility, endurance.</li>
        <li><strong>Mental</strong> — composure, leadership, work rate, coachability.</li>
      </ul>

      <h2>Built for the touchline</h2>
      <p>
        Mobile-first sliders, draft-saving, and quick templates mean a full team can be evaluated
        in the time it used to take to score one player.
      </p>

      <h2>Tied to development</h2>
      <p>
        Every evaluation feeds the CPI, the player's progression chart, and the parent dashboard.
        Players see exactly which attributes are pulling their score up — or holding it back.
      </p>

      <h2>Director oversight</h2>
      <p>
        Club directors get a roll-up of every coach's evaluations across every team, so the
        scoring stays consistent across age groups.
      </p>
    </LegalLayout>
  );
}
