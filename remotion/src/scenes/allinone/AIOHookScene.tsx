import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhotoBG, display, body, GOLD, IVORY, GoldChip } from "./_shared";

const DUR = 90;

export const AIOHookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chipS = spring({ frame: frame - 8, fps, config: { damping: 18 } });
  const chipO = interpolate(chipS, [0, 1], [0, 1]);
  const chipY = interpolate(chipS, [0, 1], [20, 0]);

  const titleS = spring({ frame: frame - 18, fps, config: { damping: 20, stiffness: 120 } });
  const titleO = interpolate(titleS, [0, 1], [0, 1]);
  const titleY = interpolate(titleS, [0, 1], [40, 0]);

  const subS = spring({ frame: frame - 38, fps, config: { damping: 22 } });
  const subO = interpolate(subS, [0, 1], [0, 1]);
  const subY = interpolate(subS, [0, 1], [20, 0]);

  const fadeOut = interpolate(frame, [DUR - 12, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <PhotoBG src="aio/hook-player.jpg" duration={DUR} zoomFrom={1.08} zoomTo={1.22} panY={-20} overlayStrength={0.65} align="center" />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: "0 60px 180px", opacity: fadeOut }}>
        <div style={{ opacity: chipO, transform: `translateY(${chipY}px)`, marginBottom: 36 }}>
          <GoldChip>CAMINO</GoldChip>
        </div>
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 110, lineHeight: 0.95,
          color: IVORY, textAlign: "center", letterSpacing: "-0.04em",
          opacity: titleO, transform: `translateY(${titleY}px)`,
          textShadow: "0 4px 30px rgba(0,0,0,0.6)",
        }}>
          Talent is<br />
          <span style={{ color: GOLD }}>everywhere.</span>
        </div>
        <div style={{
          marginTop: 28,
          fontFamily: body, fontWeight: 500, fontSize: 32,
          color: "rgba(245,245,245,0.85)", textAlign: "center",
          opacity: subO, transform: `translateY(${subY}px)`,
        }}>
          Tracking it isn't.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
