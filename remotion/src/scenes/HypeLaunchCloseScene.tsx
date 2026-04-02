import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const HypeLaunchCloseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo slam
  const logoS = spring({ frame: frame - 10, fps, config: { damping: 8, stiffness: 200 } });
  const logoScale = interpolate(logoS, [0, 1], [5, 1]);
  const logoO = interpolate(frame, [10, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logoShake = frame > 18 && frame < 30
    ? Math.sin(frame * 12) * interpolate(frame, [18, 30], [10, 0], { extrapolateRight: "clamp" })
    : 0;

  // Breathing
  const breathe = 1 + Math.sin(frame * 0.05) * 0.02;

  // Tagline
  const tagO = interpolate(frame, [40, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagS = spring({ frame: frame - 40, fps, config: { damping: 15 } });
  const tagY = interpolate(tagS, [0, 1], [40, 0]);

  // "COMING SOON" flash
  const soonO = interpolate(frame, [65, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const soonPulse = frame > 75 ? 0.7 + Math.sin((frame - 75) * 0.12) * 0.3 : interpolate(frame, [65, 75], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Converging particles
  const particles = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i / 24) * Math.PI * 2;
    const maxDist = 500;
    const dist = interpolate(frame, [0, 90], [maxDist, 40 + Math.sin(i * 2) * 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const x = Math.cos(angle + frame * 0.01) * dist;
    const y = Math.sin(angle + frame * 0.01) * dist;
    const o = interpolate(frame, [5 + i * 2, 15 + i * 2], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const size = 3 + Math.sin(i * 3 + frame * 0.1) * 1.5;
    return { x, y, o, size };
  });

  // Ring
  const circumference = 2 * Math.PI * 200;
  const ringProgress = interpolate(frame, [10, 80], [circumference, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringO = interpolate(frame, [10, 30], [0, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      {/* Radial glow */}
      <div style={{
        position: "absolute",
        width: 800, height: 800, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,180,0,0.12) 0%, transparent 60%)",
        transform: `scale(${breathe})`,
      }} />

      {/* Particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          width: p.size, height: p.size, borderRadius: "50%",
          backgroundColor: i % 3 === 0 ? "#E8B400" : i % 3 === 1 ? "#1DB870" : "#2B7FE8",
          opacity: p.o,
          transform: `translate(${p.x}px, ${p.y}px)`,
        }} />
      ))}

      {/* Ring */}
      <svg width={420} height={420} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <circle cx={210} cy={210} r={200} fill="none" stroke="#E8B400" strokeWidth={2}
          strokeDasharray={circumference} strokeDashoffset={ringProgress}
          strokeLinecap="round" opacity={ringO}
        />
      </svg>

      {/* CAMINO */}
      <div style={{
        fontFamily, fontSize: 130, fontWeight: 800,
        color: "#E8B400", letterSpacing: "-0.04em",
        opacity: logoO,
        transform: `scale(${logoScale * breathe}) translateX(${logoShake}px)`,
      }}>
        CAMINO
      </div>

      {/* Tagline */}
      <div style={{
        position: "absolute", top: "58%",
        fontFamily, fontSize: 40, fontWeight: 700,
        color: "#FFFFFF", textAlign: "center",
        opacity: tagO, transform: `translateY(${tagY}px)`,
      }}>
        The path to elite football.
      </div>

      {/* COMING SOON */}
      <div style={{
        position: "absolute", bottom: 300,
        fontFamily, fontSize: 32, fontWeight: 800,
        color: "#E8B400", letterSpacing: "0.3em",
        opacity: soonPulse,
      }}>
        COMING SOON
      </div>
    </AbsoluteFill>
  );
};
