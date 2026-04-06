import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/BebasNeue";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });

export const GetSeenScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line 1: "PUT IN THE WORK."
  const s1 = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 200 } });
  const line1Scale = interpolate(s1, [0, 1], [2.5, 1]);
  const line1O = interpolate(frame, [5, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Line 2: "GET SEEN." — delayed, gold
  const s2 = spring({ frame: frame - 30, fps, config: { damping: 8, stiffness: 180 } });
  const line2Scale = interpolate(s2, [0, 1], [3, 1]);
  const line2O = interpolate(frame, [30, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Shake on line 2
  const shake = frame > 38 && frame < 50
    ? Math.sin(frame * 10) * interpolate(frame, [38, 50], [6, 0], { extrapolateRight: "clamp" })
    : 0;

  // Breathe
  const breathe = 1 + Math.sin(frame * 0.05) * 0.005;

  const fadeOut = interpolate(frame, [75, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0E1A", justifyContent: "center", alignItems: "center" }}>
      <div style={{
        opacity: fadeOut, textAlign: "center", padding: "0 50px",
        transform: `scale(${breathe}) translateX(${shake}px)`,
      }}>
        <div style={{
          fontFamily, fontSize: 100, color: "#FFFFFF",
          letterSpacing: "0.04em", lineHeight: 1,
          opacity: line1O,
          transform: `scale(${line1Scale})`,
        }}>
          PUT IN THE WORK.
        </div>
        <div style={{
          fontFamily, fontSize: 120, color: "#E8B400",
          letterSpacing: "0.04em", lineHeight: 1, marginTop: 20,
          opacity: line2O,
          transform: `scale(${line2Scale})`,
        }}>
          GET SEEN.
        </div>
      </div>
    </AbsoluteFill>
  );
};
