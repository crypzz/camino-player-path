import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

const stats = [
  { label: "Total Players", value: "12", color: "#E8B400" },
  { label: "Avg CPI", value: "73", color: "#1DB870" },
  { label: "Goals Done", value: "24", color: "#2B7FE8" },
  { label: "Attendance", value: "91%", color: "#8B3FCC" },
];

const players = [
  { name: "Marcus Rivera", pos: "CM", cpi: 78, color: "#1DB870" },
  { name: "Kai Tanaka", pos: "LW", cpi: 72, color: "#E8B400" },
  { name: "Liam O'Brien", pos: "CB", cpi: 69, color: "#E8B400" },
  { name: "Sofia Petrov", pos: "ST", cpi: 81, color: "#1DB870" },
];

export const DashboardScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideUp = spring({ frame, fps, config: { damping: 20, stiffness: 120 } });
  const dashY = interpolate(slideUp, [0, 1], [400, 0]);
  const dashOpacity = interpolate(slideUp, [0, 1], [0, 1]);

  // Gold scan line
  const scanY = interpolate(frame, [30, 120], [-50, 1200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scanOpacity = interpolate(frame, [30, 40, 110, 120], [0, 0.3, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Label
  const labelSpring = spring({ frame: frame - 60, fps, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14" }}>
      {/* Mock dashboard */}
      <div style={{
        position: "absolute",
        top: 200,
        left: 50,
        right: 50,
        opacity: dashOpacity,
        transform: `translateY(${dashY}px)`,
      }}>
        {/* Header */}
        <div style={{ fontFamily: display, fontSize: 36, fontWeight: 800, color: "#F5F5F5", marginBottom: 8 }}>
          Welcome back, Coach
        </div>
        <div style={{ fontFamily: body, fontSize: 18, color: "#6B7280", marginBottom: 40 }}>
          Here's how your academy is performing
        </div>

        {/* Stat cards */}
        <div style={{ display: "flex", gap: 16, marginBottom: 40 }}>
          {stats.map((stat, i) => {
            const s = spring({ frame: frame - 20 - i * 8, fps, config: { damping: 15, stiffness: 200 } });
            const sc = interpolate(s, [0, 1], [0.8, 1]);
            const o = interpolate(s, [0, 1], [0, 1]);
            return (
              <div key={i} style={{
                flex: 1,
                backgroundColor: "#141821",
                borderRadius: 12,
                padding: "20px 16px",
                opacity: o,
                transform: `scale(${sc})`,
                border: "1px solid #1E2430",
              }}>
                <div style={{ fontFamily: display, fontSize: 32, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontFamily: body, fontSize: 12, color: "#6B7280", marginTop: 4 }}>{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Player list */}
        <div style={{ fontFamily: display, fontSize: 20, fontWeight: 700, color: "#F5F5F5", marginBottom: 16 }}>
          Squad Overview
        </div>
        {players.map((p, i) => {
          const s = spring({ frame: frame - 40 - i * 6, fps, config: { damping: 18 } });
          const x = interpolate(s, [0, 1], [80, 0]);
          const o = interpolate(s, [0, 1], [0, 1]);
          return (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#141821",
              borderRadius: 10,
              padding: "16px 20px",
              marginBottom: 10,
              border: "1px solid #1E2430",
              opacity: o,
              transform: `translateX(${x}px)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  backgroundColor: "#1E2430",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: display, fontSize: 14, fontWeight: 700, color: "#E8B400",
                }}>
                  {p.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontFamily: body, fontSize: 16, fontWeight: 600, color: "#F5F5F5" }}>{p.name}</div>
                  <div style={{ fontFamily: body, fontSize: 12, color: "#6B7280" }}>{p.pos}</div>
                </div>
              </div>
              <div style={{ fontFamily: display, fontSize: 22, fontWeight: 800, color: p.color }}>{p.cpi}</div>
            </div>
          );
        })}
      </div>

      {/* Gold scan line */}
      <div style={{
        position: "absolute",
        top: scanY,
        left: 40,
        right: 40,
        height: 2,
        background: "linear-gradient(90deg, transparent, #E8B400, transparent)",
        opacity: scanOpacity,
      }} />

      {/* Label */}
      <div style={{
        position: "absolute",
        bottom: 160,
        width: "100%",
        textAlign: "center",
        opacity: interpolate(labelSpring, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(labelSpring, [0, 1], [20, 0])}px)`,
      }}>
        <div style={{
          fontFamily: body,
          fontSize: 20,
          fontWeight: 500,
          color: "#6B7280",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}>
          Complete player intelligence
        </div>
      </div>
    </AbsoluteFill>
  );
};
