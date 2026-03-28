import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

export const HookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });
  const scale = interpolate(s, [0, 1], [2.5, 1]);
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Shake effect at landing
  const shake = frame > 8 && frame < 18
    ? Math.sin(frame * 8) * interpolate(frame, [8, 18], [4, 0], { extrapolateRight: "clamp" })
    : 0;

  // Fade out at end
  const fadeOut = interpolate(frame, [70, 88], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Gold line accent
  const lineWidth = interpolate(frame, [20, 50], [0, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{
        opacity: opacity * fadeOut,
        transform: `scale(${scale}) translateX(${shake}px)`,
        textAlign: "center",
        padding: "0 60px",
      }}>
        <div style={{
          fontFamily,
          fontSize: 92,
          fontWeight: 800,
          color: "#E8B400",
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
        }}>
          Your players<br />deserve better.
        </div>
      </div>

      {/* Gold accent line */}
      <div style={{
        position: "absolute",
        bottom: 600,
        left: "50%",
        transform: "translateX(-50%)",
        width: lineWidth,
        height: 3,
        backgroundColor: "#E8B400",
        borderRadius: 2,
        opacity: fadeOut * 0.6,
      }} />
    </AbsoluteFill>
  );
};
