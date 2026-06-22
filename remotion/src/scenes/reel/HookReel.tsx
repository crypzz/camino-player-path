import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { CinematicClip, ImpactCaption } from "../../components/CinematicClip";
import { CLIPS } from "../../clips";
import { COLORS, FONT } from "../../theme";

// SCENE 1 — THE HOOK (0-3s). Cold open, no product. Footage + scroll-stopping line.
export const HookReel: React.FC = () => {
  const frame = useCurrentFrame();
  // hard shutter flash on the cut
  const flash = interpolate(frame, [44, 48, 52], [0, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: FONT, backgroundColor: "#000" }}>
      <Sequence durationInFrames={48}>
        <CinematicClip src={CLIPS.heroPlay} durationInFrames={48} playbackRate={0.6} zoom={[1.1, 1.25]} startFrom={20} />
      </Sequence>
      <Sequence from={48}>
        <CinematicClip src={CLIPS.scoutMissed} durationInFrames={50} playbackRate={0.8} zoom={[1.2, 1.05]} />
      </Sequence>

      {/* shutter flash on cut */}
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />

      <Sequence from={50}>
        <ImpactCaption delay={4} size={84}>
          They're out there.
          <span style={{ display: "block", color: COLORS.yellow, textShadow: `0 0 36px ${COLORS.yellow}` }}>
            They're just invisible.
          </span>
        </ImpactCaption>
      </Sequence>
    </AbsoluteFill>
  );
};
