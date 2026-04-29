import { LegalLayout } from '@/components/landing/LegalLayout';

export default function ForPlayersPage() {
  return (
    <LegalLayout title="For Players" eyebrow="Built for · Players" updated="April 28, 2026">
      <p>
        Camino is your <strong>digital passport</strong>. One profile that follows you from U-8
        to pro — every evaluation, every verified clip, every fitness test, every level you climb.
      </p>

      <h2>What you get</h2>
      <ul>
        <li><strong>Camino Player Index</strong> — your 0–100 score, updated every time you train, test, or play.</li>
        <li><strong>Verified rankings</strong> — climb a real leaderboard against players in your age band.</li>
        <li><strong>10-level progression</strong> — 5 tiers, real milestones, earned not given.</li>
        <li><strong>Highlight reel</strong> — verified-by-coach clips you can share anywhere.</li>
        <li><strong>CV builder</strong> — export a professional player CV in one click.</li>
      </ul>

      <h2>Why players join</h2>
      <p>
        The right people see your work. Scouts, directors, and future coaches see receipts — not
        rumors. You don't get forgotten when your coach changes clubs.
      </p>
    </LegalLayout>
  );
}
