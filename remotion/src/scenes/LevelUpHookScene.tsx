import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

export const LevelUpHookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line 1: "You put in the work."
  const s1 = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });
  const scale1 = interpolate(s1, [0, 1], [2.5, 1]);
  const opacity1 = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Shake on line 1
  const shake1 = frame > 8 && frame < 18
    ? Math.sin(frame * 8) * interpolate(frame, [8, 18], [5, 0], { extrapolateRight: "clamp" })
    : 0;

  // Line 2: "Now prove it." — delayed
  const s2 = spring({ frame: frame - 35, fps, config: { damping: 10, stiffness: 200 } });
  const scale2 = interpolate(s2, [0, 1], [3, 1]);
  const opacity2 = interpolate(frame, [35, 43], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const shake2 = frame > 43 && frame < 53
    ? Math.sin(frame * 10) * interpolate(frame, [43, 53], [6, 0], { extrapolateRight: "clamp" })
    : 0;

  // Gold accent line
  const lineWidth = interpolate(frame, [50, 75], [0, 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fade out
  const fadeOut = interpolate(frame, [75, 88], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut, textAlign: "center", padding: "0 60px" }}>
        <div style={{
          fontFamily,
          fontSize: 100,
          fontWeight: 800,
          color: "#E8B400",
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          opacity: opacity1,
          transform: `scale(${scale1}) translateX(${shake1}px)`,
        }}>
          You put in<br />the work.
        </div>

        <div style={{
          fontFamily,
          fontSize: 88,
          fontWeight: 800,
          color: "#FFFFFF",
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          marginTop: 40,
          opacity: opacity2,
          transform: `scale(${scale2}) translateX(${shake2}px)`,
        }}>
          Now prove it.
        </div>
      </div>

      {/* Gold accent line */}
      <div style={{
        position: "absolute",
        bottom: 550,
        left: "50%",
        transform: "translateX(-50%)",
        width: lineWidth,
        height: 4,
        backgroundColor: "#E8B400",
        borderRadius: 2,
        opacity: fadeOut * 0.7,
      }} />
    </AbsoluteFill>
  );
};
