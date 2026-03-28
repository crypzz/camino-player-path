import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const RevealScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 160 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.3, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  const textSpring = spring({ frame: frame - 30, fps, config: { damping: 20, stiffness: 180 } });
  const textY = interpolate(textSpring, [0, 1], [40, 0]);
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);

  // Gold arc sweep
  const arcProgress = interpolate(frame, [15, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Particles
  const particles = Array.from({ length: 20 }, (_, i) => {
    const x = 200 + (i * 37) % 680;
    const speed = 1.5 + (i % 5) * 0.5;
    const startY = 1920 - (frame * speed + i * 80) % 1920;
    const size = 2 + (i % 4);
    const opacity = interpolate(startY, [0, 200, 1600, 1920], [0, 0.6, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { x, y: startY, size, opacity };
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
          opacity: p.opacity * 0.5,
        }} />
      ))}

      {/* Gold arc */}
      <svg width={400} height={400} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <circle
          cx={200} cy={200} r={180}
          fill="none"
          stroke="#E8B400"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 180}
          strokeDashoffset={(1 - arcProgress) * 2 * Math.PI * 180}
          opacity={0.4}
        />
      </svg>

      {/* Logo text */}
      <div style={{
        opacity: logoOpacity,
        transform: `scale(${logoScale})`,
        textAlign: "center",
      }}>
        <div style={{
          fontFamily,
          fontSize: 96,
          fontWeight: 800,
          color: "#E8B400",
          letterSpacing: "-0.04em",
        }}>
          Camino
        </div>
      </div>

      {/* Subtitle */}
      <div style={{
        position: "absolute",
        top: "58%",
        width: "100%",
        textAlign: "center",
        opacity: textOpacity,
        transform: `translateY(${textY}px)`,
      }}>
        <div style={{
          fontFamily,
          fontSize: 32,
          fontWeight: 700,
          color: "#F5F5F5",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>
          Introducing Camino
        </div>
      </div>
    </AbsoluteFill>
  );
};
