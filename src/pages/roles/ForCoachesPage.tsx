import { LegalLayout } from '@/components/landing/LegalLayout';

export default function ForCoachesPage() {
  return (
    <LegalLayout title="For Coaches" eyebrow="Built for · Coaches" updated="April 28, 2026">
      <p>
        Camino gives coaches their <strong>time and authority back</strong>. No more spreadsheets,
        no more lost evaluations, no more "trust me" conversations with parents. Every decision
        you make is backed by data — and stays attached to the player forever.
      </p>

      <h2>What you get</h2>
      <ul>
        <li><strong>One squad view</strong> — players grouped by position, with live CPI, level, and recent trend.</li>
        <li><strong>Touchline-ready evaluations</strong> — score 23 attributes per player on your phone in minutes.</li>
        <li><strong>Video workspace</strong> — upload, tag, verify clips that become each player's permanent record.</li>
        <li><strong>Attendance & fitness</strong> — captured once, surfaced everywhere.</li>
        <li><strong>AI Coach Assistant</strong> — generate weekly reports and parent updates in seconds.</li>
      </ul>

      <h2>Why coaches join</h2>
      <p>
        You see development clearly. Parents stop asking "how is my kid doing?". Directors see the
        work you put in. And every player you've ever coached carries proof of it forward.
      </p>
    </LegalLayout>
  );
}
