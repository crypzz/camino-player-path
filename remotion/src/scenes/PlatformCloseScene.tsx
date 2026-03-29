import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

export const PlatformCloseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo/brand entrance
  const logoSpring = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 160 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.5, 1]);
  const logoOpacity = interpolate(frame, [5, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Tagline
  const tagSpring = spring({ frame: frame - 30, fps, config: { damping: 16 } });
  const tagY = interpolate(tagSpring, [0, 1], [40, 0]);
  const tagOpacity = interpolate(frame, [30, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Features list
  const features = ["Fitness Tests", "Rankings", "Social Feed", "Share Cards"];

  // Gold line expanding
  const lineWidth = interpolate(frame, [20, 55], [0, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtle breathing
  const breathe = Math.sin(frame * 0.05) * 0.02 + 1;

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #0D0F14 0%, #131620 50%, #0D0F14 100%)",
      justifyContent: "center", alignItems: "center",
    }}>
      {/* Radial glow */}
      <div style={{
        position: "absolute", width: 800, height: 800, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,180,0,0.08) 0%, transparent 70%)",
        transform: `scale(${breathe})`,
      }} />

      <div style={{ textAlign: "center", transform: `scale(${breathe})` }}>
        {/* CAMINO */}
        <div style={{
          fontFamily, fontSize: 100, fontWeight: 800, color: "#E8B400",
          letterSpacing: "0.15em", opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}>
          CAMINO
        </div>

        {/* Gold line */}
        <div style={{
          width: lineWidth, height: 3, backgroundColor: "#E8B400",
          margin: "20px auto", borderRadius: 2, opacity: 0.6,
        }} />

        {/* Tagline */}
        <div style={{
          fontFamily, fontSize: 44, fontWeight: 800, color: "#FFFFFF",
          letterSpacing: "-0.02em", marginTop: 20,
          opacity: tagOpacity, transform: `translateY(${tagY}px)`,
          lineHeight: 1.2,
        }}>
          The Player<br />Development Platform
        </div>

        {/* Feature pills */}
        <div style={{
          display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap",
          marginTop: 45, padding: "0 40px",
        }}>
          {features.map((feat, i) => {
            const delay = 45 + i * 8;
            const pillSpring = spring({ frame: frame - delay, fps, config: { damping: 14 } });
            const pillScale = interpolate(pillSpring, [0, 1], [0, 1]);
            const pillOpacity = interpolate(frame, [delay, delay + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            return (
              <div key={i} style={{
                fontFamily: bodyFont, fontSize: 22, fontWeight: 600,
                color: "#E8B400", padding: "12px 24px",
                borderRadius: 50, border: "1px solid rgba(232,180,0,0.25)",
                background: "rgba(232,180,0,0.06)",
                opacity: pillOpacity, transform: `scale(${pillScale})`,
              }}>
                {feat}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
