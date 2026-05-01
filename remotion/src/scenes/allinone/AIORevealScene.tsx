import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { display, body, GOLD, IVORY, NAVY } from "./_shared";

const DUR = 90;

export const AIORevealScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // gold sweep wipe
  const sweepX = interpolate(frame, [0, 20], [-1200, 1200], { extrapolateRight: "clamp" });

  const logoS = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 120 } });
  const logoScale = interpolate(logoS, [0, 1], [0.6, 1]);
  const logoO = interpolate(logoS, [0, 1], [0, 1]);

  const lineW = interpolate(frame, [28, 48], [0, 100], { extrapolateRight: "clamp" });

  const subS = spring({ frame: frame - 38, fps, config: { damping: 22 } });
  const subO = interpolate(subS, [0, 1], [0, 1]);
  const subY = interpolate(subS, [0, 1], [20, 0]);

  const fadeOut = interpolate(frame, [DUR - 10, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, opacity: fadeOut }}>
      {/* radial gold glow */}
      <AbsoluteFill style={{
        background: `radial-gradient(circle at 50% 50%, rgba(232,180,0,0.18) 0%, rgba(10,12,18,0) 60%)`,
        opacity: logoO,
      }} />
      {/* sweep */}
      <div style={{
        position: "absolute", top: 0, bottom: 0,
        left: sweepX, width: 400,
        background: "linear-gradient(90deg, transparent, rgba(232,180,0,0.5), transparent)",
        filter: "blur(12px)",
      }} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 180,
          color: IVORY, letterSpacing: "-0.05em", lineHeight: 1,
          opacity: logoO, transform: `scale(${logoScale})`,
        }}>
          camino
          <span style={{ color: GOLD }}>.</span>
        </div>
        <div style={{
          marginTop: 30, height: 3, backgroundColor: GOLD,
          width: `${lineW * 4}px`, maxWidth: 600,
          boxShadow: "0 0 20px rgba(232,180,0,0.6)",
        }} />
        <div style={{
          marginTop: 32,
          fontFamily: body, fontWeight: 500, fontSize: 30,
          color: "rgba(245,245,245,0.85)", textAlign: "center",
          opacity: subO, transform: `translateY(${subY}px)`,
          letterSpacing: 4, textTransform: "uppercase",
        }}>
          The Digital Passport for Soccer
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
