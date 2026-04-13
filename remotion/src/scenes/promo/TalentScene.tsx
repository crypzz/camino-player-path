import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Oswald";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: body } = loadBody("normal", { weights: ["300"], subsets: ["latin"] });

export const TalentScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow cinematic fade in
  const bgBrightness = interpolate(frame, [0, 40], [0.3, 1], { extrapolateRight: "clamp" });

  // "Talent isn't the problem."
  const line1Delay = 15;
  const line1S = spring({ frame: frame - line1Delay, fps, config: { damping: 30, stiffness: 80 } });
  const line1Y = interpolate(line1S, [0, 1], [40, 0]);
  const line1O = interpolate(frame, [line1Delay, line1Delay + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Underline wipe
  const underlineW = interpolate(frame, [line1Delay + 25, line1Delay + 55], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Atmospheric particles (dust motes)
  const particles = Array.from({ length: 30 }, (_, i) => {
    const baseX = (i * 37 + 50) % 1080;
    const speed = 0.3 + (i % 7) * 0.15;
    const drift = Math.sin(frame * 0.02 + i * 0.8) * 20;
    const y = 1920 - ((frame * speed + i * 60) % 2200);
    const size = 1.5 + (i % 4);
    const o = interpolate(y, [0, 200, 1600, 1920], [0, 0.25, 0.25, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { x: baseX + drift, y, size, opacity: o * bgBrightness };
  });

  // Fade out
  const fadeOut = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Breathing
  const breathe = 1 + Math.sin(frame * 0.03) * 0.003;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C10" }}>
      {/* Subtle radial gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 70%, rgba(232,180,0,0.06) 0%, transparent 60%)",
        opacity: bgBrightness,
      }} />

      {/* Dust particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.x, top: p.y,
          width: p.size, height: p.size, borderRadius: "50%",
          backgroundColor: "#E8B400", opacity: p.opacity * 0.5 * fadeOut,
        }} />
      ))}

      {/* Main text */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "0 80px", opacity: fadeOut,
        transform: `scale(${breathe})`,
      }}>
        <div style={{
          fontFamily: display, fontSize: 82, fontWeight: 700,
          color: "#F0EDE6", lineHeight: 1.15,
          letterSpacing: "0.02em", textAlign: "center",
          textTransform: "uppercase",
          opacity: line1O,
          transform: `translateY(${line1Y}px)`,
          position: "relative",
        }}>
          Talent isn't
          <br />
          the problem.
          <div style={{
            position: "absolute", bottom: -12, left: "15%",
            width: `${underlineW}%`, maxWidth: "70%", height: 3,
            backgroundColor: "#E8B400", borderRadius: 2,
            opacity: 0.7,
          }} />
        </div>
      </div>

      {/* Film grain overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        opacity: 0.4, mixBlendMode: "overlay",
      }} />
    </AbsoluteFill>
  );
};
