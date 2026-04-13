import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Oswald";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadFont("normal", { weights: ["600", "700"], subsets: ["latin"] });
const { fontFamily: body } = loadBody("normal", { weights: ["400"], subsets: ["latin"] });

const lines = [
  { text: "Players are putting in the work…", delay: 0, color: "#D4D0C8" },
  { text: "But no one is seeing it.", delay: 40, color: "#FF4444" },
];

export const UnseenScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [130, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Horizontal scan line
  const scanY = (frame * 4) % 1920;
  const scanO = interpolate(frame, [0, 20], [0, 0.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C10" }}>
      {/* Scan line */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: scanY,
        height: 2, backgroundColor: "#FF4444", opacity: scanO * fadeOut,
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "0 70px", opacity: fadeOut,
      }}>
        {lines.map((line, i) => {
          const s = spring({ frame: frame - line.delay, fps, config: { damping: 20, stiffness: 120 } });
          const y = interpolate(s, [0, 1], [50, 0]);
          const o = interpolate(frame, [line.delay, line.delay + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              fontFamily: display, fontSize: i === 1 ? 74 : 64,
              fontWeight: i === 1 ? 700 : 600,
              color: line.color,
              textTransform: "uppercase",
              letterSpacing: "0.01em", lineHeight: 1.2,
              textAlign: "center",
              opacity: o, transform: `translateY(${y}px)`,
              marginBottom: 30,
            }}>
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Red vignette at edges */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(255,40,40,0.08) 100%)",
        opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * fadeOut,
      }} />
    </AbsoluteFill>
  );
};
