import { LegalLayout } from '@/components/landing/LegalLayout';

export default function ForParentsPage() {
  return (
    <LegalLayout title="For Parents" eyebrow="Built for · Parents" updated="April 28, 2026">
      <p>
        Camino gives you a <strong>clear, honest view</strong> of your child's development —
        without chasing the coach for answers.
      </p>

      <h2>What you get</h2>
      <ul>
        <li><strong>Live progress</strong> — CPI, level, and recent evaluations updated in real time.</li>
        <li><strong>Weekly reports</strong> — a coach-generated summary of training, attendance, and growth.</li>
        <li><strong>Schedule visibility</strong> — sessions, matches, and fitness tests in one place.</li>
        <li><strong>Coach feedback threads</strong> — looped into the development conversation, never out of it.</li>
        <li><strong>Safeguarded messaging</strong> — every channel involving your child is moderated by role.</li>
      </ul>

      <h2>Why parents join</h2>
      <p>
        You stop guessing. You see the same data the coach sees. And when your child changes
        teams, clubs, or moves on, their entire development history goes with them.
      </p>
    </LegalLayout>
  );
}
