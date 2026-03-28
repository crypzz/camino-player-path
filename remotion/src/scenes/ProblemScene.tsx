import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

const words = ["Spreadsheets.", "Guesswork.", "No visibility."];

export const ProblemScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [70, 88], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", padding: "0 60px", opacity: fadeOut }}>
        {words.map((word, i) => {
          const delay = i * 18;
          const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 200 } });
          const y = interpolate(s, [0, 1], [60, 0]);
          const o = interpolate(s, [0, 1], [0, 1]);
          const sc = interpolate(s, [0, 1], [1.3, 1]);

          return (
            <div key={i} style={{
              fontFamily,
              fontSize: 78,
              fontWeight: 800,
              color: i === 2 ? "#E8B400" : "#F5F5F5",
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
              opacity: o,
              transform: `translateY(${y}px) scale(${sc})`,
            }}>
              {word}
            </div>
          );
        })}
      </div>

      {/* Red accent stripe */}
      <div style={{
        position: "absolute",
        bottom: 500,
        left: 100,
        right: 100,
        height: 2,
        backgroundColor: "#E84040",
        opacity: interpolate(frame, [40, 55], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * fadeOut,
      }} />
    </AbsoluteFill>
  );
};
