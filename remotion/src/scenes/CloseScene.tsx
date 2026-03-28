import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const CloseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, config: { damping: 25, stiffness: 100 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.85, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  const tagSpring = spring({ frame: frame - 20, fps, config: { damping: 20 } });
  const tagOpacity = interpolate(tagSpring, [0, 1], [0, 1]);
  const tagY = interpolate(tagSpring, [0, 1], [30, 0]);

  // Gold ring pulse
  const ringRadius = 120;
  const circumference = 2 * Math.PI * ringRadius;
  const ringProgress = spring({ frame: frame - 5, fps, config: { damping: 30, stiffness: 80 } });
  const pulse = frame > 40 ? 1 + Math.sin((frame - 40) * 0.15) * 0.03 : 1;

  // Particles
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const dist = 200 + Math.sin(frame * 0.05 + i) * 20;
    const x = 540 + Math.cos(angle) * dist;
    const y = 900 + Math.sin(angle) * dist;
    const o = interpolate(frame, [10, 30], [0, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { x, y, o };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      {/* Orbiting particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          left: p.x,
          top: p.y,
          width: 4,
          height: 4,
          borderRadius: "50%",
          backgroundColor: "#E8B400",
          opacity: p.o,
        }} />
      ))}

      {/* Gold ring */}
      <svg width={280} height={280} style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${pulse})`,
      }}>
        <circle
          cx={140} cy={140} r={ringRadius}
          fill="none"
          stroke="#E8B400"
          strokeWidth={2}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - interpolate(ringProgress, [0, 1], [0, 1]))}
          opacity={0.5}
        />
      </svg>

      {/* Logo */}
      <div style={{
        opacity: logoOpacity,
        transform: `scale(${logoScale})`,
        textAlign: "center",
        marginTop: -60,
      }}>
        <div style={{
          fontFamily,
          fontSize: 110,
          fontWeight: 800,
          color: "#E8B400",
          letterSpacing: "-0.04em",
        }}>
          Camino
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        position: "absolute",
        top: "58%",
        width: "100%",
        textAlign: "center",
        opacity: tagOpacity,
        transform: `translateY(${tagY}px)`,
        padding: "0 80px",
      }}>
        <div style={{
          fontFamily,
          fontSize: 24,
          fontWeight: 700,
          color: "#6B7280",
          lineHeight: 1.5,
        }}>
          The digital passport for<br />elite player development
        </div>
      </div>
    </AbsoluteFill>
  );
};
