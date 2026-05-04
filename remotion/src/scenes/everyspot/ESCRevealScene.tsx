import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { display, body, GOLD, IVORY, NAVY } from "./_shared";

const DUR = 120;

export const ESCRevealScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sweepX = interpolate(frame, [0, 22], [-1400, 1400], { extrapolateRight: "clamp" });
  const logoS = spring({ frame: frame - 14, fps, config: { damping: 14, stiffness: 130 } });
  const logoScale = interpolate(logoS, [0, 1], [0.7, 1]);
  const logoO = interpolate(logoS, [0, 1], [0, 1]);
  const lineW = interpolate(frame, [30, 52], [0, 100], { extrapolateRight: "clamp" });
  const subS = spring({ frame: frame - 42, fps, config: { damping: 22 } });
  const subO = interpolate(subS, [0, 1], [0, 1]);
  const subY = interpolate(subS, [0, 1], [20, 0]);
  const fadeOut = interpolate(frame, [DUR - 10, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, opacity: fadeOut }}>
      <AbsoluteFill style={{
        background: `radial-gradient(circle at 50% 50%, rgba(232,180,0,0.18) 0%, rgba(10,12,18,0) 60%)`,
        opacity: logoO,
      }} />
      <div style={{
        position: "absolute", top: 0, bottom: 0,
        left: sweepX, width: 500,
        background: "linear-gradient(90deg, transparent, rgba(232,180,0,0.55), transparent)",
        filter: "blur(14px)",
      }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 180,
          color: IVORY, letterSpacing: "-0.05em", lineHeight: 1,
          opacity: logoO, transform: `scale(${logoScale})`,
        }}>
          camino<span style={{ color: GOLD }}>.</span>
        </div>
        <div style={{
          marginTop: 28, height: 3, backgroundColor: GOLD,
          width: `${lineW * 5}px`, maxWidth: 700,
          boxShadow: "0 0 20px rgba(232,180,0,0.6)",
        }} />
        <div style={{
          marginTop: 30, fontFamily: body, fontWeight: 600, fontSize: 32,
          color: IVORY, textAlign: "center",
          opacity: subO, transform: `translateY(${subY}px)`,
          letterSpacing: 4, textTransform: "uppercase",
        }}>
          One platform. <span style={{ color: GOLD }}>All in.</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
