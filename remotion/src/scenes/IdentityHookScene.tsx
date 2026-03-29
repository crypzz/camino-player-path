import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

export const IdentityHookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { text: "YOUR WORK.", color: "#FFFFFF", delay: 0 },
    { text: "YOUR PROOF.", color: "#FFFFFF", delay: 25 },
    { text: "YOUR IDENTITY.", color: "#E8B400", delay: 55 },
  ];

  // Pulse ring behind text
  const ringScale = interpolate(frame, [55, 95], [0.5, 2.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringOpacity = interpolate(frame, [55, 95], [0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fade out
  const fadeOut = interpolate(frame, [100, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      {/* Pulse ring */}
      <div style={{
        position: "absolute",
        width: 600, height: 600,
        borderRadius: "50%",
        border: "3px solid #E8B400",
        opacity: ringOpacity * fadeOut,
        transform: `scale(${ringScale})`,
      }} />

      <div style={{ opacity: fadeOut, textAlign: "center", padding: "0 60px" }}>
        {lines.map((line, i) => {
          const s = spring({ frame: frame - line.delay, fps, config: { damping: 10, stiffness: 200 } });
          const scale = interpolate(s, [0, 1], [4, 1]);
          const opacity = interpolate(frame, [line.delay, line.delay + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const shakeStart = line.delay + 6;
          const shake = frame > shakeStart && frame < shakeStart + 10
            ? Math.sin(frame * 9) * interpolate(frame, [shakeStart, shakeStart + 10], [8, 0], { extrapolateRight: "clamp" })
            : 0;

          return (
            <div key={i} style={{
              fontFamily, fontSize: 96, fontWeight: 800, color: line.color,
              lineHeight: 1.1, letterSpacing: "-0.04em",
              marginTop: i > 0 ? 16 : 0,
              opacity, transform: `scale(${scale}) translateX(${shake}px)`,
            }}>
              {line.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
