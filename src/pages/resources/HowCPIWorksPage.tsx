import { LegalLayout } from '@/components/landing/LegalLayout';
import { CPIFlowDiagram } from '@/components/landing/CPIFlowDiagram';

export default function HowCPIWorksPage() {
  return (
    <LegalLayout title="How CPI Works" eyebrow="Resources · CPI" updated="April 28, 2026">
      <p>
        The Camino Player Index (CPI) is a 0–100 score built from three layers of evidence:
        <strong> coach evaluation</strong>, <strong>verified performance</strong>, and{' '}
        <strong>tested fitness</strong>. Every layer is transparent, and every change is shown
        in-product.
      </p>

      <p className="text-sm italic text-muted-foreground/80">
        Scroll through the diagram below to see the full flow — from 23 raw attributes to a single
        live-recomputing score.
      </p>

      {/* Scrollytelling diagram */}
      <CPIFlowDiagram />

      <h2>Step 1 — Capture the 23 attributes</h2>
      <p>
        Each player is evaluated on 23 attributes split across four categories: Technical,
        Tactical, Physical, and Mental. Coaches score on a 1–10 scale per attribute.
      </p>

      <h2>Step 2 — Weight the categories</h2>
      <p>
        Categories are not equal. Technique and decision-making carry more weight than raw
        athleticism, reflecting how players actually develop into elite footballers.
      </p>

      <h2>Step 3 — Layer in verified data</h2>
      <ul>
        <li>Fitness test results map to the Physical category via youth-athlete benchmarks.</li>
        <li>Coach-verified video events feed Technical and Tactical scores.</li>
        <li>Attendance and training frequency act as a multiplier, not a primary input.</li>
      </ul>

      <h2>Step 4 — Recompute on every change</h2>
      <p>
        The CPI updates the moment new evidence is added — no end-of-season recalculation, no
        opaque "coach feel" adjustments. If your score moves, you can see exactly which attribute
        moved it.
      </p>

      <h2>Rankings — beyond the CPI</h2>
      <p>
        Leaderboards layer in two more factors:
      </p>
      <ul>
        <li><strong>Consistency (20%)</strong> — how often a player performs at their level.</li>
        <li><strong>Improvement (20%)</strong> — the slope of the last 90 days.</li>
        <li><strong>CPI (60%)</strong> — current ability.</li>
      </ul>
    </LegalLayout>
  );
}
