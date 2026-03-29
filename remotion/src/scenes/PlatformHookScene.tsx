import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

export const PlatformHookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "YOUR GAME." — smash in
  const s1 = spring({ frame, fps, config: { damping: 10, stiffness: 200 } });
  const scale1 = interpolate(s1, [0, 1], [4, 1]);
  const opacity1 = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const shake1 = frame > 6 && frame < 16
    ? Math.sin(frame * 9) * interpolate(frame, [6, 16], [8, 0], { extrapolateRight: "clamp" })
    : 0;

  // "YOUR DATA." — delayed smash
  const s2 = spring({ frame: frame - 25, fps, config: { damping: 10, stiffness: 200 } });
  const scale2 = interpolate(s2, [0, 1], [4, 1]);
  const opacity2 = interpolate(frame, [25, 31], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake2 = frame > 31 && frame < 41
    ? Math.sin(frame * 11) * interpolate(frame, [31, 41], [8, 0], { extrapolateRight: "clamp" })
    : 0;

  // "YOUR REPUTATION." — gold, biggest
  const s3 = spring({ frame: frame - 55, fps, config: { damping: 8, stiffness: 160 } });
  const scale3 = interpolate(s3, [0, 1], [5, 1]);
  const opacity3 = interpolate(frame, [55, 61], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Pulse ring
  const ringScale = interpolate(frame, [55, 90], [0.5, 2.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringOpacity = interpolate(frame, [55, 90], [0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fade out
  const fadeOut = interpolate(frame, [95, 108], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      {/* Pulse ring behind text */}
      <div style={{
        position: "absolute",
        width: 600, height: 600,
        borderRadius: "50%",
        border: "3px solid #E8B400",
        opacity: ringOpacity * fadeOut,
        transform: `scale(${ringScale})`,
      }} />

      <div style={{ opacity: fadeOut, textAlign: "center", padding: "0 60px" }}>
        <div style={{
          fontFamily, fontSize: 96, fontWeight: 800, color: "#FFFFFF",
          lineHeight: 1.05, letterSpacing: "-0.04em",
          opacity: opacity1,
          transform: `scale(${scale1}) translateX(${shake1}px)`,
        }}>
          YOUR GAME.
        </div>

        <div style={{
          fontFamily, fontSize: 96, fontWeight: 800, color: "#FFFFFF",
          lineHeight: 1.05, letterSpacing: "-0.04em", marginTop: 20,
          opacity: opacity2,
          transform: `scale(${scale2}) translateX(${shake2}px)`,
        }}>
          YOUR DATA.
        </div>

        <div style={{
          fontFamily, fontSize: 96, fontWeight: 800, color: "#E8B400",
          lineHeight: 1.05, letterSpacing: "-0.04em", marginTop: 20,
          opacity: opacity3,
          transform: `scale(${scale3})`,
        }}>
          YOUR<br />REPUTATION.
        </div>
      </div>
    </AbsoluteFill>
  );
};
