import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["600"], subsets: ["latin"] });

const features = [
  { label: "EVERY SESSION TRACKED", icon: "📊" },
  { label: "CPI SCORE", icon: "⚡" },
  { label: "LIVE RANKINGS", icon: "🏆" },
  { label: "PUBLIC PROFILE", icon: "👤" },
];

export const SolutionStackScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [130, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0E1A", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut, width: "100%", padding: "0 60px" }}>
        {features.map((feat, i) => {
          const delay = i * 25;
          const s = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 180 } });
          const y = interpolate(s, [0, 1], [80, 0]);
          const o = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const cardScale = interpolate(s, [0, 1], [0.9, 1]);

          return (
            <div key={i} style={{
              opacity: o,
              transform: `translateY(${y}px) scale(${cardScale})`,
              marginBottom: 20,
              display: "flex", alignItems: "center", gap: 24,
              backgroundColor: "rgba(29,184,112,0.08)",
              border: "1px solid rgba(29,184,112,0.25)",
              borderRadius: 12,
              padding: "24px 30px",
            }}>
              <div style={{ fontSize: 40 }}>{feat.icon}</div>
              <div style={{
                fontFamily, fontSize: 44, color: "#1DB870",
                letterSpacing: "0.04em",
              }}>
                {feat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
