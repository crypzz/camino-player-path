import { LegalLayout } from '@/components/landing/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" eyebrow="Legal" updated="April 28, 2026">
      <p>
        These Terms govern your use of the Camino Development website and waitlist
        (the "Service"). By joining the waitlist or using this site, you agree to these Terms.
      </p>

      <h2>1. The Service today</h2>
      <p>
        Camino is currently in pre-launch. The public site offers information about the platform
        and a waitlist signup. The full product (player profiles, the Camino Player Index,
        evaluations, video analysis, fitness testing, and the communication hub) is being rolled
        out to invited clubs.
      </p>

      <h2>2. Your account & waitlist entry</h2>
      <ul>
        <li>You must provide accurate information when signing up.</li>
        <li>You must be at least 13 years old to submit the waitlist form yourself. Younger players should be added by a parent, coach, or club director.</li>
        <li>One entry per email. Duplicate or automated submissions may be removed.</li>
      </ul>

      <h2>3. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Submit false, misleading, or third-party information without permission.</li>
        <li>Attempt to access non-public areas of the platform, probe security, or disrupt the Service.</li>
        <li>Use the Service to harass, defame, or harm minors in any way.</li>
      </ul>

      <h2>4. Intellectual property</h2>
      <p>
        The Camino name, logo, the Camino Player Index methodology, and all site content are owned
        by Camino Development. You may not copy, redistribute, or build derivative products from
        them without written permission.
      </p>

      <h2>5. No warranty</h2>
      <p>
        The Service is provided "as is" during pre-launch. Features, pricing, and availability may
        change. We do not guarantee uninterrupted access or that any specific feature shown on the
        landing page will ship in its current form.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Camino Development is not liable for indirect,
        incidental, or consequential damages arising from your use of the Service. Total liability
        is limited to CAD $100.
      </p>

      <h2>7. Termination</h2>
      <p>
        We may remove waitlist entries or restrict access at our discretion, particularly to
        prevent abuse. You can ask us to remove your entry at any time.
      </p>

      <h2>8. Governing law</h2>
      <p>These Terms are governed by the laws of Alberta, Canada.</p>

      <h2>9. Contact</h2>
      <p>
        Questions? <a href="mailto:hello@caminodevelopment.com">hello@caminodevelopment.com</a>
      </p>
    </LegalLayout>
  );
}
