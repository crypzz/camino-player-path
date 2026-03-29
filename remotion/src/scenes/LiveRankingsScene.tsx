import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const players = [
  { rank: 1, name: "Sofia Chen", cpi: 76, pos: "MF", medal: "🥇" },
  { rank: 2, name: "Lucas Martinez", cpi: 75, pos: "FW", medal: "🥈" },
  { rank: 3, name: "Jake Robertson", cpi: 74, pos: "FW", medal: "🥉" },
  { rank: 4, name: "Mia Thompson", cpi: 73, pos: "MF", medal: "" },
  { rank: 5, name: "Marcus Johnson", cpi: 72, pos: "ST", medal: "" },
];

export const LiveRankingsScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 160 } });
  const titleOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Label
  const labelSpring = spring({ frame: frame - 95, fps, config: { damping: 20 } });

  // Fade out
  const fadeOut = interpolate(frame, [120, 133], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut, width: 880, padding: "0 50px" }}>
        {/* Title */}
        <div style={{
          fontFamily, fontSize: 50, fontWeight: 800, color: "#FFFFFF",
          textAlign: "center", marginBottom: 50,
          opacity: titleOpacity,
          transform: `scale(${interpolate(titleSpring, [0, 1], [0.8, 1])})`,
          letterSpacing: "-0.03em",
        }}>
          🏆 <span style={{ color: "#E8B400" }}>Live</span> Rankings
        </div>

        {/* Rows */}
        {players.map((p, i) => {
          const delay = 12 + i * 10;
          const rowSpring = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 120 } });
          const rowX = interpolate(rowSpring, [0, 1], [120, 0]);
          const rowOpacity = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const isTop = i === 0;
          const isTop3 = i < 3;

          const cpiSpring = spring({ frame: frame - delay - 5, fps, config: { damping: 20 } });
          const cpiVal = Math.round(interpolate(cpiSpring, [0, 1], [0, p.cpi]));

          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 18,
              padding: "20px 26px", marginBottom: 10,
              borderRadius: 18,
              background: isTop
                ? "rgba(232,180,0,0.1)"
                : isTop3 ? "rgba(232,180,0,0.04)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${isTop ? "rgba(232,180,0,0.2)" : isTop3 ? "rgba(232,180,0,0.08)" : "rgba(255,255,255,0.05)"}`,
              boxShadow: isTop ? "0 0 40px rgba(232,180,0,0.08)" : "none",
              opacity: rowOpacity, transform: `translateX(${rowX}px)`,
            }}>
              <div style={{
                fontFamily, fontSize: p.medal ? 34 : 26, fontWeight: 800,
                color: isTop3 ? "#E8B400" : "rgba(255,255,255,0.4)", width: 48, textAlign: "center",
              }}>
                {p.medal || `#${p.rank}`}
              </div>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: isTop3
                  ? "linear-gradient(135deg, #E8B400, #E8B40066)"
                  : "rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily, fontSize: 20, fontWeight: 700,
                color: isTop3 ? "#0D0F14" : "#FFFFFF",
              }}>
                {p.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: bodyFont, fontSize: 24, fontWeight: 700, color: "#FFFFFF" }}>{p.name}</div>
                <div style={{ fontFamily: bodyFont, fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.35)" }}>{p.pos}</div>
              </div>
              <div style={{ fontFamily, fontSize: 32, fontWeight: 800, color: isTop3 ? "#E8B400" : "#FFFFFF" }}>
                {cpiVal}
              </div>
            </div>
          );
        })}

        {/* Label */}
        <div style={{
          textAlign: "center", marginTop: 40,
          opacity: interpolate(labelSpring, [0, 1], [0, 1]),
          fontFamily, fontSize: 38, fontWeight: 800, color: "rgba(255,255,255,0.7)",
          letterSpacing: "-0.02em",
        }}>
          Climb the ranks. <span style={{ color: "#E8B400" }}>Get seen.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
