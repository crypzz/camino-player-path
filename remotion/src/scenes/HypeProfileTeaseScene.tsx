import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

export const HypeProfileTeaseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card slides up
  const cardS = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 160 } });
  const cardY = interpolate(cardS, [0, 1], [400, 0]);
  const cardO = interpolate(frame, [5, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Floating motion
  const floatY = Math.sin(frame * 0.06) * 8;
  const floatR = Math.sin(frame * 0.04) * 1.5;

  // Stats appear
  const statsO = interpolate(frame, [40, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Label
  const labelO = interpolate(frame, [60, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelS = spring({ frame: frame - 60, fps, config: { damping: 15 } });

  const fadeOut = interpolate(frame, [110, 125], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const stats = [
    { label: "Technical", value: 82, color: "#E8B400" },
    { label: "Physical", value: 78, color: "#1DB870" },
    { label: "Tactical", value: 85, color: "#2B7FE8" },
    { label: "Mental", value: 90, color: "#E8B400" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut }}>
        {/* Profile card */}
        <div style={{
          opacity: cardO,
          transform: `translateY(${cardY + floatY}px) rotate(${floatR}deg)`,
          width: 700, padding: "50px 40px",
          background: "linear-gradient(145deg, rgba(30,32,40,0.95), rgba(20,22,28,0.98))",
          borderRadius: 28, border: "1px solid rgba(232,180,0,0.2)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(232,180,0,0.08)",
        }}>
          {/* Avatar + Name */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 30 }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg, #E8B400, #D4A300)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily, fontSize: 36, fontWeight: 800, color: "#0D0F14",
            }}>M</div>
            <div>
              <div style={{ fontFamily, fontSize: 36, fontWeight: 800, color: "#FFFFFF" }}>
                Marco Silva
              </div>
              <div style={{ fontFamily: bodyFont, fontSize: 20, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>
                Midfielder · FC Academy · Level 8
              </div>
            </div>
          </div>

          {/* CPI */}
          <div style={{
            textAlign: "center", padding: "20px 0", marginBottom: 20,
            background: "rgba(232,180,0,0.06)", borderRadius: 16,
          }}>
            <div style={{ fontFamily, fontSize: 64, fontWeight: 800, color: "#E8B400" }}>
              {Math.round(interpolate(frame, [20, 60], [0, 84], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}
            </div>
            <div style={{ fontFamily: bodyFont, fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em" }}>
              CPI SCORE
            </div>
          </div>

          {/* Stats bars */}
          <div style={{ opacity: statsO }}>
            {stats.map((s, i) => {
              const barW = interpolate(frame, [45 + i * 5, 70 + i * 5], [0, s.value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: bodyFont, fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>{s.label}</span>
                    <span style={{ fontFamily, fontSize: 16, fontWeight: 700, color: s.color }}>{Math.round(barW)}</span>
                  </div>
                  <div style={{ width: "100%", height: 8, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                    <div style={{ width: `${barW}%`, height: "100%", backgroundColor: s.color, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Built on Camino */}
          <div style={{
            textAlign: "center", marginTop: 24,
            fontFamily: bodyFont, fontSize: 14, fontWeight: 500,
            color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em",
          }}>
            BUILT ON CAMINO
          </div>
        </div>

        {/* Label */}
        <div style={{
          textAlign: "center", marginTop: 50,
          fontFamily, fontSize: 48, fontWeight: 800, color: "#FFFFFF",
          opacity: labelO,
          transform: `scale(${interpolate(labelS, [0, 1], [0.8, 1])})`,
        }}>
          Your profile.<br />
          <span style={{ color: "#E8B400" }}>Your proof.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
