import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Oswald";

const { fontFamily: display } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });

export const ExposureScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Exposure is." — dramatic reveal
  const revealS = spring({ frame: frame - 8, fps, config: { damping: 12, stiffness: 160 } });
  const scale = interpolate(revealS, [0, 1], [2.8, 1]);
  const opacity = interpolate(frame, [8, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Screen shake on impact
  const shakeX = frame > 16 && frame < 28
    ? Math.sin(frame * 12) * interpolate(frame, [16, 28], [8, 0], { extrapolateRight: "clamp" })
    : 0;
  const shakeY = frame > 16 && frame < 28
    ? Math.cos(frame * 10) * interpolate(frame, [16, 28], [5, 0], { extrapolateRight: "clamp" })
    : 0;

  // Gold flash on impact
  const flashO = interpolate(frame, [14, 18, 28], [0, 0.15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Horizontal line wipe accent
  const lineW = interpolate(frame, [30, 55], [0, 900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fade out
  const fadeOut = interpolate(frame, [75, 95], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C10" }}>
      {/* Gold flash overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: "#E8B400", opacity: flashO,
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", justifyContent: "center", alignItems: "center",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
        opacity: fadeOut,
      }}>
        <div style={{
          fontFamily: display, fontSize: 120, fontWeight: 700,
          color: "#E8B400", textTransform: "uppercase",
          letterSpacing: "0.06em", textAlign: "center",
          opacity, transform: `scale(${scale})`,
          textShadow: "0 0 60px rgba(232,180,0,0.3)",
        }}>
          Exposure is.
        </div>
      </div>

      {/* Horizontal accent line */}
      <div style={{
        position: "absolute", top: "58%", left: "50%",
        transform: "translateX(-50%)",
        width: lineW, height: 2,
        backgroundColor: "#E8B400", opacity: 0.4 * fadeOut,
        borderRadius: 1,
      }} />
    </AbsoluteFill>
  );
};
