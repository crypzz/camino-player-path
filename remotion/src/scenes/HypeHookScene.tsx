import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

export const HypeHookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scan lines effect
  const scanY = interpolate(frame, [0, 120], [-200, 2200], { extrapolateRight: "clamp" });

  // "SOMETHING" — glitch slam
  const s1 = spring({ frame: frame - 5, fps, config: { damping: 8, stiffness: 220 } });
  const scale1 = interpolate(s1, [0, 1], [6, 1]);
  const opacity1 = interpolate(frame, [5, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glitch1 = frame > 12 && frame < 22
    ? Math.sin(frame * 12) * interpolate(frame, [12, 22], [12, 0], { extrapolateRight: "clamp" })
    : 0;

  // "IS" — fast snap
  const opacity2 = interpolate(frame, [30, 33], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "COMING." — biggest slam with gold
  const s3 = spring({ frame: frame - 45, fps, config: { damping: 6, stiffness: 180 } });
  const scale3 = interpolate(s3, [0, 1], [8, 1]);
  const opacity3 = interpolate(frame, [45, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake3 = frame > 52 && frame < 65
    ? Math.sin(frame * 15) * interpolate(frame, [52, 65], [15, 0], { extrapolateRight: "clamp" })
    : 0;

  // Pulse ring
  const ringScale = interpolate(frame, [45, 100], [0.3, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringOpacity = interpolate(frame, [45, 100], [0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fade out
  const fadeOut = interpolate(frame, [105, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      {/* Scan line */}
      <div style={{
        position: "absolute", top: scanY, left: 0, right: 0, height: 3,
        background: "linear-gradient(90deg, transparent, rgba(232,180,0,0.4), transparent)",
        opacity: fadeOut * 0.5,
      }} />

      {/* Pulse ring */}
      <div style={{
        position: "absolute",
        width: 500, height: 500, borderRadius: "50%",
        border: "2px solid #E8B400",
        opacity: ringOpacity * fadeOut,
        transform: `scale(${ringScale})`,
      }} />

      <div style={{ opacity: fadeOut, textAlign: "center", padding: "0 50px" }}>
        <div style={{
          fontFamily, fontSize: 110, fontWeight: 800, color: "#FFFFFF",
          lineHeight: 1, letterSpacing: "-0.05em",
          opacity: opacity1,
          transform: `scale(${scale1}) translateX(${glitch1}px)`,
        }}>
          SOMETHING
        </div>

        <div style={{
          fontFamily, fontSize: 80, fontWeight: 800, color: "rgba(255,255,255,0.5)",
          lineHeight: 1, letterSpacing: "0.2em", marginTop: 20,
          opacity: opacity2,
        }}>
          IS
        </div>

        <div style={{
          fontFamily, fontSize: 120, fontWeight: 800, color: "#E8B400",
          lineHeight: 1, letterSpacing: "-0.05em", marginTop: 20,
          opacity: opacity3,
          transform: `scale(${scale3}) translateX(${shake3}px)`,
        }}>
          COMING.
        </div>
      </div>
    </AbsoluteFill>
  );
};
