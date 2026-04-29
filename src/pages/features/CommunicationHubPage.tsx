import { LegalLayout } from '@/components/landing/LegalLayout';

export default function CommunicationHubPage() {
  return (
    <LegalLayout title="Communication Hub" eyebrow="Platform · Communication" updated="April 28, 2026">
      <p>
        Camino replaces club WhatsApp groups, scattered emails, and forgotten paper notes with a
        single role-based communication hub built for the realities of youth football.
      </p>

      <h2>Role-based channels</h2>
      <ul>
        <li><strong>Team chat</strong> — coach-moderated, one per team.</li>
        <li><strong>Announcements</strong> — director-to-club, coach-to-team.</li>
        <li><strong>Direct messages</strong> — restricted by role to keep minors safe.</li>
        <li><strong>Feedback threads</strong> — private coach-to-player development notes.</li>
      </ul>

      <h2>Safeguarding by design</h2>
      <p>
        Players cannot DM coaches outside their own club, parents can be looped into any
        coach-to-player thread, and directors can audit every channel. Cross-club messaging is
        blocked entirely.
      </p>

      <h2>Notifications that matter</h2>
      <p>
        PostgreSQL triggers fan out alerts the moment a CPI changes, a clip is verified, a
        fitness test is logged, or a session is scheduled — so nobody misses the moments that
        matter.
      </p>
    </LegalLayout>
  );
}
