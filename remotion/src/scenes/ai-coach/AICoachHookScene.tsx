import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

export const AICoachHookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineS = spring({ frame: frame - 4, fps, config: { damping: 18, stiffness: 160 } });
  const wordS = spring({ frame: frame - 22, fps, config: { damping: 12, stiffness: 200 } });
  const subS = spring({ frame: frame - 50, fps, config: { damping: 22 } });
  const sweep = interpolate(frame, [0, 60], [-100, 100], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [78, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Pulsing dots
  const dot = (i: number) => {
    const t = (frame - i * 4) % 30;
    return interpolate(t, [0, 6, 12], [0.3, 1, 0.3], { extrapolateRight: "clamp" });
  };

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0A0E14 0%, #0D1117 50%, #161B22 100%)", fontFamily: body }}>
      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(232,180,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(232,180,0,0.05) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      {/* Gold sweep glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at ${50 + sweep * 0.3}% 40%, rgba(232,180,0,0.18), transparent 50%)`,
      }} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80, opacity: fadeOut }}>
        {/* Eyebrow with dots */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14, marginBottom: 50,
          opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: 5, background: "#E8B400", opacity: dot(i),
            }} />
          ))}
          <div style={{
            fontFamily: body, fontWeight: 600, fontSize: 32, color: "#E8B400",
            letterSpacing: 6, textTransform: "uppercase",
          }}>
            Coaching, evolved
          </div>
        </div>

        {/* Main headline - line 1 */}
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 130, color: "#fff",
          lineHeight: 0.95, letterSpacing: -3, textAlign: "center",
          transform: `translateY(${interpolate(lineS, [0, 1], [60, 0])}px)`,
          opacity: lineS,
        }}>
          What if your
        </div>

        {/* Highlighted word */}
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 180, lineHeight: 1,
          letterSpacing: -5, textAlign: "center", marginTop: 8,
          background: "linear-gradient(135deg, #FFD340 0%, #E8B400 60%, #B8860B 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          transform: `scale(${interpolate(wordS, [0, 1], [0.6, 1])})`,
          opacity: wordS,
          textShadow: "0 0 80px rgba(232,180,0,0.5)",
          filter: `drop-shadow(0 0 40px rgba(232,180,0,${0.3 * wordS}))`,
        }}>
          assistant
        </div>

        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 130, color: "#fff",
          lineHeight: 0.95, letterSpacing: -3, textAlign: "center", marginTop: 8,
          transform: `translateY(${interpolate(lineS, [0, 1], [60, 0])}px)`,
          opacity: lineS,
        }}>
          knew every player?
        </div>

        {/* Subtle sub */}
        <div style={{
          marginTop: 70, fontFamily: body, fontWeight: 500, fontSize: 30,
          color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase",
          opacity: subS, transform: `translateY(${interpolate(subS, [0, 1], [20, 0])}px)`,
        }}>
          Meet Camino AI
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
