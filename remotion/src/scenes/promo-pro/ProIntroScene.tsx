import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

const navItems = ["Dashboard", "Players", "Video", "Schedule"];
const stats = [
  { label: "Active Players", value: "24", color: "#1DB870" },
  { label: "Videos Uploaded", value: "156", color: "#3B82F6" },
  { label: "Avg CPI Score", value: "73", color: "#E8B400" },
];

const players = [
  { name: "Marcus Rivera", pos: "CM", cpi: 78 },
  { name: "Sofia Petrov", pos: "ST", cpi: 81 },
  { name: "Kai Tanaka", pos: "LW", cpi: 72 },
];

export const ProIntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [420, 450], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Main card entrance
  const cardS = spring({ frame: frame - 10, fps, config: { damping: 30, stiffness: 100 } });
  const cardY = interpolate(cardS, [0, 1], [60, 0]);
  const cardO = interpolate(cardS, [0, 1], [0, 1]);

  // Label
  const labelO = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "Camino" text reveal
  const titleS = spring({ frame: frame - 5, fps, config: { damping: 25, stiffness: 140 } });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(155deg, #0D1117 0%, #111827 40%, #0D1117 100%)",
      justifyContent: "center", alignItems: "center",
    }}>
      <div style={{ opacity: fadeOut, width: "100%", padding: "0 80px" }}>
        {/* Title area */}
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{
            fontFamily: body, fontSize: 14, fontWeight: 500,
            color: "#6B7280", letterSpacing: "0.2em", textTransform: "uppercase",
            marginBottom: 16, opacity: labelO,
          }}>
            Introducing
          </div>
          <div style={{
            fontFamily: display, fontSize: 64, fontWeight: 800,
            color: "#E8B400", letterSpacing: "-0.03em",
            opacity: interpolate(titleS, [0, 1], [0, 1]),
            transform: `scale(${interpolate(titleS, [0, 1], [0.9, 1])})`,
          }}>
            Camino
          </div>
          <div style={{
            fontFamily: body, fontSize: 20, fontWeight: 400,
            color: "#9CA3AF", marginTop: 12,
            opacity: interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            A centralized platform for player development
          </div>
        </div>

        {/* Mock dashboard card */}
        <div style={{
          backgroundColor: "#141B2D",
          border: "1px solid #1E293B",
          borderRadius: 16,
          overflow: "hidden",
          opacity: cardO,
          transform: `translateY(${cardY}px)`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}>
          {/* Top nav bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 28px",
            borderBottom: "1px solid #1E293B",
          }}>
            <div style={{ fontFamily: display, fontSize: 18, fontWeight: 700, color: "#E8B400" }}>Camino</div>
            <div style={{ display: "flex", gap: 24 }}>
              {navItems.map((item, i) => (
                <div key={i} style={{
                  fontFamily: body, fontSize: 13, fontWeight: 500,
                  color: i === 0 ? "#F5F5F5" : "#6B7280",
                }}>{item}</div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: "28px" }}>
            {/* Stats row */}
            <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
              {stats.map((stat, i) => {
                const s = spring({ frame: frame - 50 - i * 12, fps, config: { damping: 20, stiffness: 180 } });
                return (
                  <div key={i} style={{
                    flex: 1, backgroundColor: "#0D1117", borderRadius: 10,
                    padding: "18px 20px", border: "1px solid #1E293B",
                    opacity: interpolate(s, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`,
                  }}>
                    <div style={{ fontFamily: display, fontSize: 28, fontWeight: 800, color: stat.color }}>
                      {Math.round(interpolate(frame, [60 + i * 12, 90 + i * 12], [0, parseInt(stat.value)], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}
                    </div>
                    <div style={{ fontFamily: body, fontSize: 12, color: "#6B7280", marginTop: 4 }}>{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Player list */}
            <div style={{ fontFamily: display, fontSize: 16, fontWeight: 700, color: "#F5F5F5", marginBottom: 14 }}>Squad Overview</div>
            {players.map((p, i) => {
              const s = spring({ frame: frame - 80 - i * 10, fps, config: { damping: 22 } });
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  backgroundColor: "#0D1117", borderRadius: 8,
                  padding: "12px 16px", marginBottom: 8,
                  border: "1px solid #1E293B",
                  opacity: interpolate(s, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(s, [0, 1], [40, 0])}px)`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      backgroundColor: "#1E293B",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: display, fontSize: 11, fontWeight: 700, color: "#E8B400",
                    }}>
                      {p.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div style={{ fontFamily: body, fontSize: 14, fontWeight: 600, color: "#F5F5F5" }}>{p.name}</div>
                      <div style={{ fontFamily: body, fontSize: 11, color: "#6B7280" }}>{p.pos}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: display, fontSize: 20, fontWeight: 800, color: p.cpi > 75 ? "#1DB870" : "#E8B400" }}>{p.cpi}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scan line */}
      <div style={{
        position: "absolute",
        top: interpolate(frame, [60, 300], [100, 900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        left: 60, right: 60, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(232,180,0,0.15), transparent)",
        opacity: fadeOut,
      }} />
    </AbsoluteFill>
  );
};
