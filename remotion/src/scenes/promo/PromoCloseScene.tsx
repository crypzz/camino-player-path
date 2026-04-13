import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Oswald";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: body } = loadBody("normal", { weights: ["400"], subsets: ["latin"] });

export const PromoCloseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo spring
  const logoS = spring({ frame: frame - 10, fps, config: { damping: 10, stiffness: 160 } });
  const logoScale = interpolate(logoS, [0, 1], [0.3, 1]);
  const logoO = interpolate(frame, [10, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Tagline
  const tagDelay = 40;
  const tagS = spring({ frame: frame - tagDelay, fps, config: { damping: 18, stiffness: 120 } });
  const tagY = interpolate(tagS, [0, 1], [25, 0]);
  const tagO = interpolate(frame, [tagDelay, tagDelay + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Breathing
  const breathe = 1 + Math.sin(frame * 0.04) * 0.006;

  // Orbiting particles
  const orbitParticles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2 + frame * 0.015;
    const radius = 200 + Math.sin(frame * 0.03 + i) * 30;
    const x = 540 + Math.cos(angle) * radius;
    const y = 960 + Math.sin(angle) * radius;
    const size = 2 + (i % 3);
    const o = 0.15 + Math.sin(frame * 0.05 + i * 0.5) * 0.1;
    return { x, y, size, opacity: o };
  });

  // Gold glow pulse
  const glowO = 0.08 + Math.sin(frame * 0.06) * 0.04;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C10" }}>
      {/* Radial gold glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 48%, rgba(232,180,0,0.12) 0%, transparent 45%)",
        opacity: glowO / 0.08,
      }} />

      {/* Orbiting particles */}
      {orbitParticles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.x, top: p.y,
          width: p.size, height: p.size, borderRadius: "50%",
          backgroundColor: "#E8B400", opacity: p.opacity,
        }} />
      ))}

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        transform: `scale(${breathe})`,
      }}>
        {/* CAMINO */}
        <div style={{
          fontFamily: display, fontSize: 130, fontWeight: 700,
          color: "#E8B400", textTransform: "uppercase",
          letterSpacing: "0.12em", textAlign: "center",
          opacity: logoO, transform: `scale(${logoScale})`,
          textShadow: "0 0 80px rgba(232,180,0,0.35), 0 0 160px rgba(232,180,0,0.15)",
        }}>
          CAMINO
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: body, fontSize: 34, fontWeight: 400,
          color: "rgba(240,237,230,0.7)",
          letterSpacing: "0.08em", textAlign: "center",
          textTransform: "uppercase", marginTop: 20,
          opacity: tagO, transform: `translateY(${tagY}px)`,
        }}>
          Where players get seen.
        </div>

        {/* Thin gold line separator */}
        <div style={{
          width: interpolate(frame, [tagDelay + 10, tagDelay + 40], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          height: 1.5, backgroundColor: "#E8B400",
          opacity: 0.4, marginTop: 24, borderRadius: 1,
        }} />
      </div>
    </AbsoluteFill>
  );
};
