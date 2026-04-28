import { LegalLayout } from '@/components/landing/LegalLayout';

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" eyebrow="Legal" updated="April 28, 2026">
      <p>
        This page explains how Camino Development uses cookies and similar local-storage
        technologies on this website.
      </p>

      <h2>1. What we use</h2>
      <p>
        Our public waitlist site is intentionally light. We currently use:
      </p>
      <ul>
        <li>
          <strong>Session storage</strong> — used by our authentication system to keep internal
          team members signed in to the private dashboard. This is only set after signing in at our
          internal access point, never on the public landing page.
        </li>
        <li>
          <strong>Functional preferences</strong> — small values that remember UI preferences
          (e.g. dismissed banners) for the duration of your visit.
        </li>
      </ul>

      <h2>2. What we do not use</h2>
      <ul>
        <li>No advertising cookies.</li>
        <li>No third-party analytics or tracking pixels (no Google Analytics, no Meta Pixel, no LinkedIn Insight, etc.).</li>
        <li>No cross-site or behavioral profiling.</li>
      </ul>

      <h2>3. Managing cookies</h2>
      <p>
        Because we do not set non-essential cookies on the public site, no consent banner is
        required. You can clear local and session storage at any time through your browser's
        privacy settings; doing so will simply sign internal users out of the dashboard.
      </p>

      <h2>4. Changes</h2>
      <p>
        If we ever add analytics or marketing cookies, we will update this page first and add an
        in-product consent prompt before any non-essential cookie is set.
      </p>

      <h2>5. Contact</h2>
      <p>
        <a href="mailto:hello@caminodevelopment.com">hello@caminodevelopment.com</a>
      </p>
    </LegalLayout>
  );
}
