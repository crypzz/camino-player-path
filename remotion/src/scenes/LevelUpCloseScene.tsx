import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const LevelUpCloseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo
  const logoSpring = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.5, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  // Tagline
  const tagSpring = spring({ frame: frame - 25, fps, config: { damping: 20 } });
  const tagOpacity = interpolate(tagSpring, [0, 1], [0, 1]);
  const tagY = interpolate(tagSpring, [0, 1], [30, 0]);

  // Ring
  const ringProgress = interpolate(frame, [10, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = frame > 50 ? 1 + Math.sin((frame - 50) * 0.15) * 0.03 : 1;

  // Particles converging
  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const startDist = 500;
    const endDist = 120;
    const dist = interpolate(frame, [0, 60], [startDist, endDist], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const wobble = Math.sin(frame * 0.08 + i * 1.5) * 8;
    return {
      x: 540 + Math.cos(angle + frame * 0.005) * (dist + wobble),
      y: 960 + Math.sin(angle + frame * 0.005) * (dist + wobble),
      opacity: interpolate(frame, [0, 30, 65, 80], [0, 0.6, 0.6, 0], { extrapolateRight: "clamp" }),
      size: 4 + Math.sin(i * 2) * 2,
    };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      {/* Particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          left: p.x,
          top: p.y,
          width: p.size,
          height: p.size,
          borderRadius: "50%",
          backgroundColor: "#E8B400",
          opacity: p.opacity,
        }} />
      ))}

      {/* Ring */}
      <svg width={280} height={280} style={{ position: "absolute", transform: `scale(${pulse})` }}>
        <circle
          cx={140}
          cy={140}
          r={120}
          fill="none"
          stroke="#E8B400"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={754}
          strokeDashoffset={754 * (1 - ringProgress)}
          opacity={0.6}
        />
      </svg>

      {/* Logo */}
      <div style={{
        opacity: logoOpacity,
        transform: `scale(${logoScale})`,
        textAlign: "center",
      }}>
        <div style={{
          fontFamily,
          fontSize: 80,
          fontWeight: 800,
          color: "#E8B400",
          letterSpacing: "-0.03em",
        }}>
          Camino
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        position: "absolute",
        bottom: 700,
        opacity: tagOpacity,
        transform: `translateY(${tagY}px)`,
        textAlign: "center",
      }}>
        <div style={{
          fontFamily,
          fontSize: 42,
          fontWeight: 700,
          color: "rgba(255,255,255,0.8)",
          letterSpacing: "-0.02em",
        }}>
          Your progress. <span style={{ color: "#E8B400" }}>Proven.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
