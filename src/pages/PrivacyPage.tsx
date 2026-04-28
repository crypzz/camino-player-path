import { LegalLayout } from '@/components/landing/LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" eyebrow="Legal" updated="April 28, 2026">
      <p>
        Camino Development ("Camino", "we", "us") builds a player development platform for soccer
        academies. This Privacy Policy explains what information we collect during our pre-launch
        waitlist, how we use it, and the choices you have.
      </p>

      <h2>1. Information we collect</h2>
      <p>While Camino is in waitlist mode, we collect only what you give us through the signup form:</p>
      <ul>
        <li><strong>Full name</strong> — so we can address you when we reach out.</li>
        <li><strong>Email address</strong> — to send onboarding and product updates.</li>
        <li><strong>Role</strong> — player, coach, parent, or club director — to prioritize early access.</li>
        <li><strong>Club name</strong> (optional) — so we can roll access out by club.</li>
      </ul>
      <p>
        We also automatically log a signup timestamp. We do <strong>not</strong> use third-party
        analytics, advertising pixels, or cross-site trackers on this site.
      </p>

      <h2>2. How we use it</h2>
      <ul>
        <li>Contact you about waitlist status and early access.</li>
        <li>Send occasional product updates you can unsubscribe from at any time.</li>
        <li>Plan our Calgary-first rollout to clubs and academies.</li>
      </ul>

      <h2>3. How we store it</h2>
      <p>
        Waitlist data is stored in our managed backend with row-level security. Only authorized
        Camino staff (currently club directors during our pilot) can read entries. Connections are
        encrypted in transit (TLS) and at rest.
      </p>

      <h2>4. Minors</h2>
      <p>
        Camino is built for youth athletes, but the public waitlist is intended for adults
        (parents, coaches, directors) and players age 13+. Detailed minor profiles are only
        created after a club has onboarded and parental consent is captured inside the platform.
      </p>

      <h2>5. Sharing</h2>
      <p>
        We do not sell your data. We share it only with infrastructure providers strictly
        necessary to operate the service (e.g. our managed database and email delivery), under
        confidentiality and data-processing terms.
      </p>

      <h2>6. Your rights</h2>
      <p>
        You can request access, correction, or deletion of your waitlist entry at any time by
        emailing <a href="mailto:hello@caminodevelopment.com">hello@caminodevelopment.com</a>. We
        will respond within 30 days.
      </p>

      <h2>7. Changes</h2>
      <p>
        We will update this page if our practices change. Material changes will be announced by
        email to people on the waitlist.
      </p>

      <h2>8. Contact</h2>
      <p>
        Camino Development — Calgary, Canada.<br />
        <a href="mailto:hello@caminodevelopment.com">hello@caminodevelopment.com</a>
      </p>
    </LegalLayout>
  );
}
