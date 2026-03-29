import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

export const ShareBadgeScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Share card entrance
  const cardSpring = spring({ frame: frame - 5, fps, config: { damping: 10, stiffness: 140 } });
  const cardScale = interpolate(cardSpring, [0, 1], [0.3, 1]);
  const cardRotate = interpolate(cardSpring, [0, 1], [-8, 0]);
  const cardOpacity = interpolate(frame, [5, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Floating particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    x: (i * 137.5) % 100,
    delay: i * 3,
    speed: 0.8 + (i % 3) * 0.4,
    size: 4 + (i % 4) * 3,
  }));

  // Badge glow pulse
  const glowPulse = Math.sin(frame * 0.08) * 0.3 + 0.7;

  // CPI counter
  const cpiSpring = spring({ frame: frame - 20, fps, config: { damping: 18 } });
  const cpiVal = Math.round(interpolate(cpiSpring, [0, 1], [0, 76]));

  // "Share your rank" text
  const textOpacity = interpolate(frame, [60, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fade out
  const fadeOut = interpolate(frame, [105, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      {/* Gold particles */}
      {particles.map((p, i) => {
        const py = interpolate(frame - p.delay, [0, 120], [1920, -100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const px = (p.x / 100) * 1080;
        const pOpacity = interpolate(frame - p.delay, [0, 20, 100, 120], [0, 0.6, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute", left: px, top: py,
            width: p.size, height: p.size, borderRadius: "50%",
            backgroundColor: "#E8B400", opacity: pOpacity * fadeOut,
          }} />
        );
      })}

      <div style={{ opacity: fadeOut }}>
        {/* Share Card */}
        <div style={{
          opacity: cardOpacity,
          transform: `scale(${cardScale}) rotate(${cardRotate}deg)`,
          width: 800, padding: "60px 50px",
          borderRadius: 32,
          background: "linear-gradient(160deg, rgba(232,180,0,0.15) 0%, rgba(13,15,20,0.98) 50%, rgba(232,180,0,0.05) 100%)",
          border: "2px solid rgba(232,180,0,0.25)",
          textAlign: "center",
          boxShadow: `0 0 ${60 * glowPulse}px rgba(232,180,0,${0.15 * glowPulse})`,
        }}>
          {/* Rank badge */}
          <div style={{
            fontFamily, fontSize: 30, fontWeight: 700, color: "#E8B400",
            marginBottom: 20, letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
            🏆 #1 Ranked
          </div>

          {/* Player name */}
          <div style={{ fontFamily, fontSize: 56, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Sofia Chen
          </div>

          {/* Details */}
          <div style={{
            fontFamily: bodyFont, fontSize: 26, fontWeight: 500, color: "rgba(255,255,255,0.45)",
            marginTop: 12,
          }}>
            Midfielder · U16 · Calgary
          </div>

          {/* CPI Score */}
          <div style={{ marginTop: 40 }}>
            <div style={{ fontFamily, fontSize: 80, fontWeight: 800, color: "#E8B400", letterSpacing: "-0.03em" }}>
              {cpiVal}
            </div>
            <div style={{ fontFamily: bodyFont, fontSize: 22, fontWeight: 600, color: "rgba(255,255,255,0.35)", marginTop: -4 }}>
              CPI SCORE
            </div>
          </div>

          {/* Camino branding */}
          <div style={{
            fontFamily, fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.2)",
            marginTop: 35, letterSpacing: "0.15em", textTransform: "uppercase",
          }}>
            CAMINO
          </div>
        </div>

        {/* Share text */}
        <div style={{
          fontFamily, fontSize: 40, fontWeight: 800, color: "#FFFFFF",
          textAlign: "center", marginTop: 50, opacity: textOpacity,
          letterSpacing: "-0.02em",
        }}>
          Share your <span style={{ color: "#E8B400" }}>rank</span> everywhere.
        </div>
      </div>
    </AbsoluteFill>
  );
};
