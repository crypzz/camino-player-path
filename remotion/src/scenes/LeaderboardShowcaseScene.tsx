import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const players = [
  { rank: 1, name: "Sofia Chen", cpi: 76, pos: "MF", loc: "Calgary U16", medal: "🥇" },
  { rank: 2, name: "Lucas Martinez", cpi: 75, pos: "FW", loc: "Calgary U16", medal: "🥈" },
  { rank: 3, name: "Jake Robertson", cpi: 74, pos: "FW", loc: "Calgary U18", medal: "🥉" },
  { rank: 4, name: "Mia Thompson", cpi: 73, pos: "MF", loc: "Toronto U16", medal: "" },
  { rank: 5, name: "Marcus Johnson", cpi: 72, pos: "ST", loc: "Toronto U18", medal: "" },
];

export const LeaderboardShowcaseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 160 } });
  const titleScale = interpolate(titleSpring, [0, 1], [0.7, 1]);
  const titleOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Fade out
  const fadeOut = interpolate(frame, [115, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut, width: 920, padding: "0 40px" }}>
        {/* Title */}
        <div style={{
          fontFamily, fontSize: 54, fontWeight: 800, color: "#FFFFFF",
          letterSpacing: "-0.03em", marginBottom: 14,
          opacity: titleOpacity, transform: `scale(${titleScale})`,
          textAlign: "center",
        }}>
          🏆 <span style={{ color: "#E8B400" }}>Live</span> Rankings
        </div>
        <div style={{
          fontFamily: bodyFont, fontSize: 26, fontWeight: 500, color: "rgba(255,255,255,0.45)",
          textAlign: "center", marginBottom: 50, opacity: titleOpacity,
        }}>
          Ranked by CPI · Updated in real-time
        </div>

        {/* Player rows */}
        {players.map((p, i) => {
          const delay = 12 + i * 10;
          const rowSpring = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 120 } });
          const rowX = interpolate(rowSpring, [0, 1], [120, 0]);
          const rowOpacity = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          const isTop3 = i < 3;
          const bgColor = isTop3 ? "rgba(232,180,0,0.06)" : "rgba(255,255,255,0.02)";
          const borderColor = isTop3 ? "rgba(232,180,0,0.12)" : "rgba(255,255,255,0.05)";

          // CPI counter
          const cpiSpring = spring({ frame: frame - delay - 5, fps, config: { damping: 20 } });
          const cpiVal = Math.round(interpolate(cpiSpring, [0, 1], [0, p.cpi]));

          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 18,
              padding: "22px 28px", marginBottom: 10,
              borderRadius: 18, background: bgColor,
              border: `1px solid ${borderColor}`,
              opacity: rowOpacity, transform: `translateX(${rowX}px)`,
            }}>
              {/* Rank */}
              <div style={{
                fontFamily, fontSize: p.medal ? 36 : 28, fontWeight: 800,
                color: isTop3 ? "#E8B400" : "rgba(255,255,255,0.4)",
                width: 52, textAlign: "center",
              }}>
                {p.medal || `#${p.rank}`}
              </div>

              {/* Avatar circle */}
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: isTop3
                  ? "linear-gradient(135deg, #E8B400, #E8B40066)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily, fontSize: 22, fontWeight: 700,
                color: isTop3 ? "#0D0F14" : "#FFFFFF",
              }}>
                {p.name.split(" ").map(n => n[0]).join("")}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: bodyFont, fontSize: 26, fontWeight: 700, color: "#FFFFFF" }}>
                  {p.name}
                </div>
                <div style={{ fontFamily: bodyFont, fontSize: 20, fontWeight: 500, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                  {p.pos} · {p.loc}
                </div>
              </div>

              {/* CPI */}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily, fontSize: 34, fontWeight: 800, color: isTop3 ? "#E8B400" : "#FFFFFF" }}>
                  {cpiVal}
                </div>
                <div style={{ fontFamily: bodyFont, fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.3)" }}>
                  CPI
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
