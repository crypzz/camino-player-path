import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const Promo15HookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line 1: "Your kid is the next big thing." — frames 0-45
  const l1Spring = spring({ frame, fps, config: { damping: 11, stiffness: 180 } });
  const l1Scale = interpolate(l1Spring, [0, 1], [1.6, 1]);
  const l1Opacity = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const l1Exit = interpolate(frame, [42, 50], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l1Blur = interpolate(frame, [0, 8], [12, 0], { extrapolateRight: "clamp" });

  // Line 2: "Prove it." — frames 50-90 — smash in
  const l2Local = frame - 50;
  const l2Spring = spring({ frame: l2Local, fps, config: { damping: 10, stiffness: 220 } });
  const l2Scale = interpolate(l2Spring, [0, 1], [2.2, 1]);
  const l2Opacity = interpolate(l2Local, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = l2Local > 4 && l2Local < 14
    ? Math.sin(l2Local * 7) * interpolate(l2Local, [4, 14], [6, 0], { extrapolateRight: "clamp" })
    : 0;

  // Gold underline reveal under "Prove"
  const underlineW = interpolate(l2Local, [10, 30], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Flash on smash
  const flashOpacity = interpolate(l2Local, [0, 2, 4], [0, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12", justifyContent: "center", alignItems: "center" }}>
      {/* subtle gold radial */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 50%, rgba(232,180,0,0.08) 0%, transparent 55%)",
      }} />

      {frame < 50 && (
        <div style={{
          opacity: l1Opacity * l1Exit,
          transform: `scale(${l1Scale})`,
          filter: `blur(${l1Blur}px)`,
          textAlign: "center",
          padding: "0 70px",
        }}>
          <div style={{
            fontFamily, fontSize: 84, fontWeight: 800,
            color: "#FFFFFF", lineHeight: 1.05, letterSpacing: "-0.035em",
          }}>
            Your kid is the<br />next big thing.
          </div>
        </div>
      )}

      {frame >= 50 && (
        <div style={{
          opacity: l2Opacity,
          transform: `scale(${l2Scale}) translateX(${shake}px)`,
          textAlign: "center",
        }}>
          <div style={{
            fontFamily, fontSize: 180, fontWeight: 800,
            color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1,
          }}>
            Prove it.
          </div>
          {/* gold underline */}
          <div style={{
            width: underlineW, height: 8,
            backgroundColor: "#E8B400",
            margin: "16px auto 0",
            borderRadius: 4,
            boxShadow: "0 0 24px rgba(232,180,0,0.6)",
          }} />
        </div>
      )}

      {/* white flash on smash */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: "#FFFFFF",
        opacity: flashOpacity,
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
