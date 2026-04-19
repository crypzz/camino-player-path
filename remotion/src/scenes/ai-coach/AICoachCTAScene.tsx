import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

export const AICoachCTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrow = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const titleS = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 140 } });
  const lineW = interpolate(frame, [30, 60], [0, 100], { extrapolateRight: "clamp" });
  const subS = spring({ frame: frame - 55, fps, config: { damping: 18 } });
  const wordS = spring({ frame: frame - 90, fps, config: { damping: 10, stiffness: 160 } });
  const breathe = 1 + Math.sin(frame / 14) * 0.015;

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #07090F 0%, #0D1117 50%, #161B22 100%)",
      fontFamily: body, alignItems: "center", justifyContent: "center", padding: 80,
    }}>
      {/* Gold radial */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 50%, rgba(232,180,0,0.22), transparent 60%)",
      }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)",
      }} />

      <div style={{
        fontFamily: body, fontWeight: 600, fontSize: 30, color: "#E8B400",
        letterSpacing: 8, textTransform: "uppercase", marginBottom: 50,
        opacity: eyebrow,
      }}>
        Camino AI
      </div>

      <div style={{
        fontFamily: display, fontWeight: 800, fontSize: 170, color: "#fff",
        lineHeight: 0.92, letterSpacing: -5, textAlign: "center",
        transform: `scale(${interpolate(titleS, [0, 1], [0.75, 1]) * breathe})`,
        opacity: titleS,
        textShadow: "0 0 100px rgba(232,180,0,0.4)",
      }}>
        Coach
      </div>

      <div style={{
        width: `${lineW}%`, maxWidth: 280, height: 3,
        background: "linear-gradient(90deg, transparent, #E8B400, transparent)",
        marginTop: 30, marginBottom: 30,
      }} />

      <div style={{
        fontFamily: display, fontWeight: 800, fontSize: 220,
        lineHeight: 0.92, letterSpacing: -6, textAlign: "center",
        background: "linear-gradient(135deg, #FFD340 0%, #E8B400 50%, #B8860B 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        opacity: wordS,
        transform: `scale(${interpolate(wordS, [0, 1], [0.7, 1]) * breathe})`,
        filter: `drop-shadow(0 0 60px rgba(232,180,0,${0.5 * wordS}))`,
      }}>
        smarter.
      </div>

      <div style={{
        marginTop: 70, fontFamily: body, fontWeight: 500, fontSize: 32,
        color: "rgba(255,255,255,0.65)", textAlign: "center", maxWidth: 800, lineHeight: 1.35,
        letterSpacing: 1,
        opacity: subS,
        transform: `translateY(${interpolate(subS, [0, 1], [20, 0])}px)`,
      }}>
        Your AI co-coach.<br />
        <span style={{ color: "#E8B400", fontWeight: 600 }}>Built into Camino.</span>
      </div>
    </AbsoluteFill>
  );
};
