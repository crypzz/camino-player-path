import { LegalLayout } from '@/components/landing/LegalLayout';

export default function VideoAnalysisInfoPage() {
  return (
    <LegalLayout title="Video Analysis" eyebrow="Platform · Video" updated="April 28, 2026">
      <p>
        Camino's video tools turn match film into structured data. Upload a clip, tag events
        frame-by-frame, and watch the highlights and stats flow straight into each player's
        profile.
      </p>

      <h2>Frame-accurate tagging</h2>
      <p>
        Step through video at <strong>1/30 second precision</strong>. Tag passes, shots, duels,
        recoveries — every event is anchored to a timestamp and a position on the pitch.
      </p>

      <h2>Pitch mini-map</h2>
      <p>
        Every tagged event renders on a tactical mini-map using a normalized 0–100 coordinate
        system. Heatmaps, action zones, and pass networks come for free.
      </p>

      <h2>AI assistance</h2>
      <p>
        Powered by Gemini 2.5 Flash, the AI pipeline pre-tags obvious events so coaches only have
        to verify, not annotate from scratch. Files up to 20MB are processed automatically.
      </p>

      <h2>Verified by Coach</h2>
      <p>
        Highlight clips marked <em>Verified by Coach</em> become permanent proof on a player's
        profile — perfect for showcase reels, college outreach, and CV exports.
      </p>
    </LegalLayout>
  );
}
