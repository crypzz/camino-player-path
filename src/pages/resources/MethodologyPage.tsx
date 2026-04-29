import { LegalLayout } from '@/components/landing/LegalLayout';

export default function MethodologyPage() {
  return (
    <LegalLayout title="Methodology" eyebrow="Resources · Methodology" updated="April 28, 2026">
      <p>
        Camino is built on the belief that <strong>player development should be measurable,
        comparable, and portable</strong>. This page explains the principles behind every score,
        ranking, and report on the platform.
      </p>

      <h2>1. Evidence over opinion</h2>
      <p>
        Every number on Camino traces back to a coach evaluation, a timed fitness test, or a
        verified-by-coach video event. There are no black-box adjustments and no anonymous
        scoring.
      </p>

      <h2>2. Compare fairly across age groups</h2>
      <p>
        Fitness results are benchmarked against age- and gender-adjusted youth standards.
        Evaluations are scored on the same 1–10 attribute scale league-wide. A U-12 and a U-18
        can sit on the same leaderboard without distortion.
      </p>

      <h2>3. Reward consistency and improvement, not just talent</h2>
      <p>
        Rankings weight current ability (60%), consistency (20%), and 90-day improvement (20%).
        Late bloomers and grinders are never invisible.
      </p>

      <h2>4. Protect minors first</h2>
      <p>
        All player media lives in private storage with signed-URL access. Messaging is role-based
        and audited. Cross-club DMs are blocked. Parental consent is captured before any minor
        profile is created.
      </p>

      <h2>5. Portable for life</h2>
      <p>
        A player's data belongs to the player. When they change teams, clubs, or move into senior
        football, their full development history goes with them as a CV-ready export.
      </p>

      <h2>6. Open about limitations</h2>
      <p>
        AI tagging is a starting point, not a verdict — every match event is verified by a human
        coach before it counts toward CPI. The score is a powerful summary, not a substitute for
        scouting.
      </p>
    </LegalLayout>
  );
}
