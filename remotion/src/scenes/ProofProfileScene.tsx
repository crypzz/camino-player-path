import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const stats = [
  { label: "Technical", value: 82, color: "#E8B400" },
  { label: "Tactical", value: 76, color: "#1DB870" },
  { label: "Physical", value: 88, color: "#3B82F6" },
  { label: "Mental", value: 71, color: "#A855F7" },
];

export const ProofProfileScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card rises from bottom
  const cardS = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const cardY = interpolate(cardS, [0, 1], [400, 0]);
  const cardO = interpolate(cardS, [0, 1], [0, 1]);

  // CPI counter
  const cpiVal = Math.round(interpolate(frame, [20, 60], [0, 84], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // Float
  const floatY = Math.sin(frame * 0.04) * 6;

  const fadeOut = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0E1A", justifyContent: "center", alignItems: "center" }}>
      <div style={{
        opacity: cardO * fadeOut,
        transform: `translateY(${cardY + floatY}px)`,
        width: 820,
        backgroundColor: "#111827",
        borderRadius: 20,
        border: "1px solid rgba(232,180,0,0.2)",
        padding: "40px 44px",
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #E8B400, #F59E0B)",
          }} />
          <div>
            <div style={{ fontFamily, fontSize: 42, color: "#FFFFFF", letterSpacing: "0.03em" }}>
              CARLOS RIVERA
            </div>
            <div style={{ fontFamily: bodyFont, fontSize: 20, color: "rgba(255,255,255,0.5)" }}>
              CM · U-16 · Academy Elite
            </div>
          </div>
        </div>

        {/* CPI Score */}
        <div style={{
          marginTop: 30, textAlign: "center",
          padding: "20px 0",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ fontFamily: bodyFont, fontSize: 16, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em" }}>
            CPI SCORE
          </div>
          <div style={{ fontFamily, fontSize: 90, color: "#E8B400", lineHeight: 1 }}>
            {cpiVal}
          </div>
        </div>

        {/* Stat bars */}
        <div style={{ marginTop: 24 }}>
          {stats.map((stat, i) => {
            const barW = interpolate(frame, [30 + i * 8, 55 + i * 8], [0, stat.value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontFamily: bodyFont, fontSize: 16, color: "rgba(255,255,255,0.6)",
                  marginBottom: 6,
                }}>
                  <span>{stat.label}</span>
                  <span>{Math.round(barW)}</span>
                </div>
                <div style={{ height: 6, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
                  <div style={{
                    height: "100%", width: `${barW}%`,
                    backgroundColor: stat.color, borderRadius: 3,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
