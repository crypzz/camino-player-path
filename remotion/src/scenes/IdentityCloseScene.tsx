import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const features = ["Public Profiles", "Levels", "Rankings", "Stat Cards"];

export const IdentityCloseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo
  const logoSpring = spring({ frame, fps, config: { damping: 25, stiffness: 100 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.85, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);
  const breathe = 1 + Math.sin(frame * 0.08) * 0.015;

  // Tagline
  const tagSpring = spring({ frame: frame - 20, fps, config: { damping: 20 } });
  const tagOpacity = interpolate(tagSpring, [0, 1], [0, 1]);
  const tagY = interpolate(tagSpring, [0, 1], [30, 0]);

  // Ring
  const ringRadius = 120;
  const circumference = 2 * Math.PI * ringRadius;
  const ringProgress = spring({ frame: frame - 5, fps, config: { damping: 30, stiffness: 80 } });

  // Particles
  const particles = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2 + frame * 0.01;
    const dist = 200 + Math.sin(frame * 0.04 + i) * 25;
    const x = 540 + Math.cos(angle) * dist;
    const y = 900 + Math.sin(angle) * dist;
    const o = interpolate(frame, [10, 30], [0, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { x, y, o, size: 3 + (i % 3) };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      {/* Particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.x, top: p.y,
          width: p.size, height: p.size, borderRadius: "50%",
          backgroundColor: "#E8B400", opacity: p.o,
        }} />
      ))}

      {/* Ring */}
      <svg width={280} height={280} style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translate(-50%, -50%) scale(${breathe})`,
      }}>
        <circle cx={140} cy={140} r={ringRadius} fill="none" stroke="#E8B400" strokeWidth={2}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - interpolate(ringProgress, [0, 1], [0, 1]))}
          opacity={0.5}
        />
      </svg>

      {/* Logo */}
      <div style={{
        opacity: logoOpacity, transform: `scale(${logoScale * breathe})`,
        textAlign: "center", marginTop: -80,
      }}>
        <div style={{ fontFamily, fontSize: 110, fontWeight: 800, color: "#E8B400", letterSpacing: "-0.04em" }}>
          Camino
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        position: "absolute", top: "57%", width: "100%", textAlign: "center",
        opacity: tagOpacity, transform: `translateY(${tagY}px)`,
      }}>
        <div style={{ fontFamily, fontSize: 30, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>
          Your progress. <span style={{ color: "#E8B400" }}>Proven.</span>
        </div>
      </div>

      {/* Feature pills */}
      <div style={{
        position: "absolute", top: "66%", width: "100%",
        display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap",
        padding: "0 60px",
      }}>
        {features.map((f, i) => {
          const fSpring = spring({ frame: frame - 40 - i * 8, fps, config: { damping: 14, stiffness: 160 } });
          return (
            <div key={i} style={{
              padding: "10px 22px", borderRadius: 100,
              background: "rgba(232,180,0,0.08)", border: "1px solid rgba(232,180,0,0.15)",
              fontFamily: bodyFont, fontSize: 18, fontWeight: 600, color: "rgba(232,180,0,0.7)",
              transform: `scale(${interpolate(fSpring, [0, 1], [0, 1])})`,
            }}>
              {f}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
