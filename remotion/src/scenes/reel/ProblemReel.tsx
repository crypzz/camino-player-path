import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { CinematicClip, ImpactCaption } from "../../components/CinematicClip";
import { CLIPS } from "../../clips";
import { COLORS, FONT } from "../../theme";

const UncountedChip: React.FC<{ label: string; x: number; y: number; delay: number }> = ({ label, x, y, delay }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 6, delay + 24, delay + 32], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        opacity: o,
        padding: "10px 18px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.25)",
        background: "rgba(0,0,0,0.5)",
        color: "rgba(255,255,255,0.85)",
        fontSize: 26,
        fontWeight: 800,
        letterSpacing: 1,
        textShadow: "0 4px 14px rgba(0,0,0,0.8)",
      }}
    >
      {label} <span style={{ color: "#ff5a5a" }}>· UNCOUNTED</span>
    </div>
  );
};

// SCENE 2 — THE PROBLEM (3-8s). Fast montage, talent slipping through the cracks.
export const ProblemReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: FONT, backgroundColor: "#000" }}>
      <Sequence durationInFrames={42}>
        <CinematicClip src={CLIPS.heroPlay} durationInFrames={42} playbackRate={1} zoom={[1.18, 1.06]} startFrom={60} />
      </Sequence>
      <Sequence from={42} durationInFrames={42}>
        <CinematicClip src={CLIPS.bench} durationInFrames={42} playbackRate={0.9} zoom={[1.06, 1.2]} />
      </Sequence>
      <Sequence from={84}>
        <CinematicClip src={CLIPS.scoutMissed} durationInFrames={71} playbackRate={1} zoom={[1.2, 1.04]} startFrom={30} />
      </Sequence>

      {/* flashing uncounted stats */}
      <UncountedChip label="PERFECT TOUCH" x={12} y={24} delay={6} />
      <UncountedChip label="50M SPRINT" x={40} y={48} delay={26} />
      <UncountedChip label="KEY PASS" x={18} y={66} delay={50} />
      <UncountedChip label="SMART RUN" x={44} y={30} delay={92} />

      <Sequence from={20}>
        <ImpactCaption delay={0} size={92}>
          Every game.
          <span style={{ display: "block", color: COLORS.yellow, textShadow: `0 0 36px ${COLORS.yellow}` }}>
            Invisible.
          </span>
        </ImpactCaption>
      </Sequence>
    </AbsoluteFill>
  );
};
