import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

export const QuestionScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });
  const scale = interpolate(s, [0, 1], [2.5, 1]);
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Shake at landing
  const shake = frame > 8 && frame < 18
    ? Math.sin(frame * 8) * interpolate(frame, [8, 18], [5, 0], { extrapolateRight: "clamp" })
    : 0;

  const fadeOut = interpolate(frame, [68, 88], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{
        opacity: opacity * fadeOut,
        transform: `scale(${scale}) translateX(${shake}px)`,
        textAlign: "center",
        padding: "0 60px",
      }}>
        <div style={{
          fontFamily, fontSize: 86, fontWeight: 800,
          color: "#E8B400", lineHeight: 1.1, letterSpacing: "-0.03em",
        }}>
          But who's tracking your progress?
        </div>
      </div>
    </AbsoluteFill>
  );
};
