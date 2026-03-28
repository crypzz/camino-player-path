import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

export const DreamScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 40, 90, 118], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 120], [1.05, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Gentle breathing
  const breath = 1 + Math.sin(frame * 0.04) * 0.008;

  // Gold particles drifting upward
  const particles = Array.from({ length: 25 }, (_, i) => {
    const x = 80 + (i * 43) % 920;
    const speed = 0.8 + (i % 5) * 0.4;
    const startY = 1920 - (frame * speed + i * 70) % 2100;
    const size = 2 + (i % 3);
    const o = interpolate(startY, [0, 300, 1500, 1920], [0, 0.4, 0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { x, y: startY, size, opacity: o * opacity };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.x, top: p.y,
          width: p.size, height: p.size, borderRadius: "50%",
          backgroundColor: "#E8B400", opacity: p.opacity * 0.6,
        }} />
      ))}

      <div style={{
        opacity,
        transform: `scale(${scale * breath})`,
        textAlign: "center",
        padding: "0 70px",
      }}>
        <div style={{
          fontFamily, fontSize: 88, fontWeight: 800,
          color: "#E8B400", lineHeight: 1.1, letterSpacing: "-0.03em",
        }}>
          Every pro started somewhere.
        </div>
      </div>
    </AbsoluteFill>
  );
};
