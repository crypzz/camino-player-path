import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

export const PublicProfileScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card slide up
  const cardSpring = spring({ frame: frame - 5, fps, config: { damping: 16, stiffness: 120 } });
  const cardY = interpolate(cardSpring, [0, 1], [300, 0]);
  const cardOpacity = interpolate(frame, [5, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // CPI counter
  const cpiSpring = spring({ frame: frame - 25, fps, config: { damping: 20 } });
  const cpiVal = Math.round(interpolate(cpiSpring, [0, 1], [0, 76]));

  // Badge appear
  const badgeSpring = spring({ frame: frame - 35, fps, config: { damping: 14, stiffness: 160 } });
  const badgeScale = interpolate(badgeSpring, [0, 1], [0, 1]);

  // Label
  const labelSpring = spring({ frame: frame - 70, fps, config: { damping: 20 } });
  const labelOpacity = interpolate(labelSpring, [0, 1], [0, 1]);

  // Fade out
  const fadeOut = interpolate(frame, [115, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtle float
  const floatY = Math.sin(frame * 0.06) * 4;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut, transform: `translateY(${floatY}px)` }}>
        {/* Profile card */}
        <div style={{
          width: 780, padding: "60px 50px",
          background: "linear-gradient(145deg, rgba(232,180,0,0.08), rgba(255,255,255,0.02))",
          border: "1px solid rgba(232,180,0,0.15)",
          borderRadius: 32,
          opacity: cardOpacity, transform: `translateY(${cardY}px)`,
          textAlign: "center",
        }}>
          {/* Avatar */}
          <div style={{
            width: 110, height: 110, borderRadius: "50%", margin: "0 auto 24px",
            background: "linear-gradient(135deg, #E8B400, #E8B40066)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily, fontSize: 42, fontWeight: 800, color: "#0D0F14",
          }}>
            SC
          </div>

          {/* Name */}
          <div style={{ fontFamily, fontSize: 44, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            Sofia Chen
          </div>
          <div style={{ fontFamily: bodyFont, fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.45)", marginTop: 6 }}>
            Midfielder · Calgary U16
          </div>

          {/* Level badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            margin: "24px auto", padding: "10px 24px",
            borderRadius: 100, background: "rgba(232,180,0,0.12)",
            border: "1px solid rgba(232,180,0,0.25)",
            transform: `scale(${badgeScale})`,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#E8B400" }} />
            <span style={{ fontFamily, fontSize: 20, fontWeight: 700, color: "#E8B400" }}>
              GOLD · Level 7
            </span>
          </div>

          {/* CPI Score */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily, fontSize: 72, fontWeight: 800, color: "#E8B400" }}>
              {cpiVal}
            </div>
            <div style={{ fontFamily: bodyFont, fontSize: 20, fontWeight: 500, color: "rgba(255,255,255,0.35)" }}>
              CPI Score
            </div>
          </div>

          {/* Branding */}
          <div style={{
            marginTop: 32, paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            fontFamily: bodyFont, fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.2)",
          }}>
            Built on Camino
          </div>
        </div>

        {/* Label */}
        <div style={{
          textAlign: "center", marginTop: 50,
          opacity: labelOpacity,
          fontFamily, fontSize: 38, fontWeight: 800, color: "rgba(255,255,255,0.7)",
          letterSpacing: "-0.02em",
        }}>
          Your profile. <span style={{ color: "#E8B400" }}>Always public.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
