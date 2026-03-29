import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const stats = [
  { label: "TEC", value: 78, color: "#E8B400" },
  { label: "TAC", value: 72, color: "#2B7FE8" },
  { label: "PHY", value: 81, color: "#1DB870" },
  { label: "MEN", value: 74, color: "#E8B400" },
];

export const StatCardScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance
  const cardSpring = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 140 } });
  const cardScale = interpolate(cardSpring, [0, 1], [0.6, 1]);
  const cardRotate = interpolate(cardSpring, [0, 1], [-8, 0]);
  const cardOpacity = interpolate(frame, [5, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Float
  const floatY = Math.sin(frame * 0.05) * 8;
  const floatR = Math.sin(frame * 0.03) * 1.5;

  // CPI
  const cpiSpring = spring({ frame: frame - 20, fps, config: { damping: 20 } });
  const cpiVal = Math.round(interpolate(cpiSpring, [0, 1], [0, 76]));

  // Social icons
  const socialDelay = 75;
  const socialOpacity = interpolate(frame, [socialDelay, socialDelay + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Label
  const labelSpring = spring({ frame: frame - 85, fps, config: { damping: 20 } });

  // Fade out
  const fadeOut = interpolate(frame, [120, 133], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut }}>
        {/* Stat card */}
        <div style={{
          width: 680, padding: "50px 44px",
          background: "linear-gradient(160deg, rgba(232,180,0,0.1), rgba(13,15,20,0.95))",
          border: "1px solid rgba(232,180,0,0.2)",
          borderRadius: 28,
          opacity: cardOpacity,
          transform: `scale(${cardScale}) rotate(${cardRotate + floatR}deg) translateY(${floatY}px)`,
          textAlign: "center",
        }}>
          {/* Header */}
          <div style={{ fontFamily, fontSize: 34, fontWeight: 800, color: "#FFFFFF" }}>Sofia Chen</div>
          <div style={{ fontFamily: bodyFont, fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
            MF · Calgary U16
          </div>

          {/* CPI */}
          <div style={{ margin: "30px 0" }}>
            <div style={{ fontFamily, fontSize: 68, fontWeight: 800, color: "#E8B400" }}>{cpiVal}</div>
            <div style={{ fontFamily: bodyFont, fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.3)" }}>CPI Score</div>
          </div>

          {/* Stats grid */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            {stats.map((s, i) => {
              const sSpring = spring({ frame: frame - 30 - i * 8, fps, config: { damping: 16 } });
              const sVal = Math.round(interpolate(sSpring, [0, 1], [0, s.value]));
              return (
                <div key={i} style={{
                  padding: "16px 22px", borderRadius: 16,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                  textAlign: "center",
                }}>
                  <div style={{ fontFamily, fontSize: 28, fontWeight: 800, color: s.color }}>{sVal}</div>
                  <div style={{ fontFamily: bodyFont, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Branding */}
          <div style={{
            marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)",
            fontFamily: bodyFont, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.15)",
          }}>
            Built on Camino
          </div>
        </div>

        {/* Social icons */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 30, marginTop: 40,
          opacity: socialOpacity,
        }}>
          {["IG", "X", "TikTok"].map((name, i) => {
            const iSpring = spring({ frame: frame - socialDelay - i * 8, fps, config: { damping: 14 } });
            return (
              <div key={i} style={{
                padding: "12px 24px", borderRadius: 100,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: bodyFont, fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.5)",
                transform: `scale(${interpolate(iSpring, [0, 1], [0, 1])})`,
              }}>
                {name}
              </div>
            );
          })}
        </div>

        {/* Label */}
        <div style={{
          textAlign: "center", marginTop: 40,
          opacity: interpolate(labelSpring, [0, 1], [0, 1]),
          fontFamily, fontSize: 38, fontWeight: 800, color: "rgba(255,255,255,0.7)",
          letterSpacing: "-0.02em",
        }}>
          Share your card. <span style={{ color: "#E8B400" }}>Build your brand.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
