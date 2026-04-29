import { LegalLayout } from '@/components/landing/LegalLayout';

export default function ForDirectorsPage() {
  return (
    <LegalLayout title="For Directors" eyebrow="Built for · Directors" updated="April 28, 2026">
      <p>
        Camino is the <strong>operating system for your academy</strong>. Every team, coach,
        player, and metric in one place — with the oversight you need and the autonomy your
        coaches want.
      </p>

      <h2>What you get</h2>
      <ul>
        <li><strong>Club-wide leaderboard</strong> — rank players across every age group on a single CPI scale.</li>
        <li><strong>Team and coach views</strong> — drill into any squad, any coach, any session.</li>
        <li><strong>Evaluation consistency</strong> — spot scoring drift between coaches before it becomes a problem.</li>
        <li><strong>Communication oversight</strong> — audit every channel involving minors.</li>
        <li><strong>Recruitment intelligence</strong> — surface rising players across the club instantly.</li>
      </ul>

      <h2>Why directors join</h2>
      <p>
        You stop running on memory and WhatsApp. You finally have one source of truth for talent
        identification, coach development, and parent communication — defensible, exportable, and
        always up to date.
      </p>
    </LegalLayout>
  );
}
