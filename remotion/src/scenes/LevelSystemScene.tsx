import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const tiers = [
  { name: "Bronze", color: "#CD7F32", bg: "rgba(205,127,50,0.1)", border: "rgba(205,127,50,0.3)" },
  { name: "Silver", color: "#C0C0C0", bg: "rgba(192,192,192,0.1)", border: "rgba(192,192,192,0.3)" },
  { name: "Gold", color: "#E8B400", bg: "rgba(232,180,0,0.12)", border: "rgba(232,180,0,0.3)" },
  { name: "Platinum", color: "#2B7FE8", bg: "rgba(43,127,232,0.1)", border: "rgba(43,127,232,0.3)" },
  { name: "Elite", color: "#1DB870", bg: "rgba(29,184,112,0.1)", border: "rgba(29,184,112,0.3)" },
];

export const LevelSystemScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 160 } });
  const titleOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Progress bar fill
  const barProgress = interpolate(frame, [60, 95], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Level counter
  const levelSpring = spring({ frame: frame - 90, fps, config: { damping: 10, stiffness: 200 } });

  // Particles on level-up
  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const dist = interpolate(frame, [90, 115], [0, 180 + (i % 3) * 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    const o = interpolate(frame, [90, 95, 115], [0, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { x, y, o };
  });

  // Label
  const labelSpring = spring({ frame: frame - 100, fps, config: { damping: 20 } });

  // Fade out
  const fadeOut = interpolate(frame, [115, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut, width: 900, padding: "0 50px" }}>
        {/* Tier badges */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 60, flexWrap: "wrap" }}>
          {tiers.map((tier, i) => {
            const delay = 8 + i * 12;
            const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 180 } });
            const scale = interpolate(s, [0, 1], [0, 1]);
            return (
              <div key={i} style={{
                padding: "14px 28px", borderRadius: 100,
                background: tier.bg, border: `2px solid ${tier.border}`,
                fontFamily, fontSize: 22, fontWeight: 700, color: tier.color,
                transform: `scale(${scale})`,
              }}>
                {tier.name}
              </div>
            );
          })}
        </div>

        {/* Level-up progress */}
        <div style={{ position: "relative", textAlign: "center" }}>
          {/* Level number */}
          <div style={{
            fontFamily, fontSize: 28, fontWeight: 700,
            color: "rgba(255,255,255,0.5)", marginBottom: 16,
          }}>
            Level <span style={{
              color: "#E8B400", fontSize: 36,
              transform: `scale(${interpolate(levelSpring, [0, 1], [1, 1.3])})`,
              display: "inline-block",
            }}>
              {frame >= 90 ? "7" : "6"}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{
            width: "100%", height: 18, borderRadius: 100,
            background: "rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}>
            <div style={{
              width: `${barProgress}%`, height: "100%", borderRadius: 100,
              background: "linear-gradient(90deg, #E8B400, #E8B400CC)",
              transition: "none",
            }} />
          </div>

          {/* Particles */}
          {particles.map((p, i) => (
            <div key={i} style={{
              position: "absolute",
              left: "50%", top: -20,
              transform: `translate(${p.x}px, ${p.y}px)`,
              width: 6, height: 6, borderRadius: "50%",
              backgroundColor: "#E8B400", opacity: p.o,
            }} />
          ))}
        </div>

        {/* Label */}
        <div style={{
          textAlign: "center", marginTop: 60,
          opacity: interpolate(labelSpring, [0, 1], [0, 1]),
          fontFamily, fontSize: 38, fontWeight: 800, color: "rgba(255,255,255,0.7)",
          letterSpacing: "-0.02em",
        }}>
          Every session. <span style={{ color: "#E8B400" }}>Every level.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
