import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Oswald";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: body } = loadBody("normal", { weights: ["500"], subsets: ["latin"] });

const features = [
  { icon: "📊", label: "LIVE STATS", delay: 15 },
  { icon: "🎯", label: "CPI SCORE", delay: 25 },
  { icon: "🎬", label: "VIDEO ANALYSIS", delay: 35 },
  { icon: "👤", label: "DIGITAL PROFILES", delay: 45 },
  { icon: "🏆", label: "LEADERBOARDS", delay: 55 },
];

export const BeatDropScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Initial flash/burst
  const burstO = interpolate(frame, [0, 5, 15], [0.8, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "This is where Camino changes everything."
  const headlineDelay = 5;
  const hS = spring({ frame: frame - headlineDelay, fps, config: { damping: 14, stiffness: 200 } });
  const hScale = interpolate(hS, [0, 1], [1.8, 1]);
  const hO = interpolate(frame, [headlineDelay, headlineDelay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Feature cards stagger
  const fadeOut = interpolate(frame, [140, 160], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Energy lines
  const energyLines = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45) + frame * 0.5;
    const len = interpolate(frame, [0, 30], [0, 400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { angle, len, opacity: interpolate(frame, [0, 10, 40], [0, 0.3, 0.05], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C10" }}>
      {/* Burst flash */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 40%, #E8B400, transparent 70%)",
        opacity: burstO,
      }} />

      {/* Energy lines radiating from center */}
      {energyLines.map((line, i) => (
        <div key={i} style={{
          position: "absolute", top: "40%", left: "50%",
          width: line.len, height: 1.5,
          backgroundColor: "#E8B400",
          opacity: line.opacity * fadeOut,
          transform: `rotate(${line.angle}deg)`,
          transformOrigin: "0 50%",
        }} />
      ))}

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "0 60px", opacity: fadeOut,
      }}>
        {/* Headline */}
        <div style={{
          fontFamily: display, fontSize: 56, fontWeight: 700,
          color: "#E8B400", textTransform: "uppercase",
          letterSpacing: "0.02em", textAlign: "center",
          lineHeight: 1.15, marginBottom: 60,
          opacity: hO, transform: `scale(${hScale})`,
        }}>
          This is where Camino
          <br />
          changes everything.
        </div>

        {/* Feature cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          {features.map((feat, i) => {
            const s = spring({ frame: frame - feat.delay, fps, config: { damping: 15, stiffness: 220 } });
            const x = interpolate(s, [0, 1], [i % 2 === 0 ? -120 : 120, 0]);
            const o = interpolate(frame, [feat.delay, feat.delay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 20,
                backgroundColor: "rgba(232,180,0,0.08)",
                border: "1px solid rgba(232,180,0,0.2)",
                borderRadius: 12, padding: "18px 28px",
                opacity: o, transform: `translateX(${x}px)`,
              }}>
                <span style={{ fontSize: 32 }}>{feat.icon}</span>
                <span style={{
                  fontFamily: display, fontSize: 28, fontWeight: 700,
                  color: "#F0EDE6", letterSpacing: "0.04em",
                }}>
                  {feat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(232,180,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(232,180,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * fadeOut,
      }} />
    </AbsoluteFill>
  );
};
