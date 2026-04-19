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
  const lineW = interpolate(frame, [20, 45], [0, 100], { extrapolateRight: "clamp" });
  const urlS = spring({ frame: frame - 60, fps, config: { damping: 18 } });
  const breathe = 1 + Math.sin(frame / 12) * 0.02;

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #0D1117 0%, #161B22 100%)",
      fontFamily: body, alignItems: "center", justifyContent: "center", padding: 80,
    }}>
      {/* Gold radial */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 55%, rgba(232,180,0,0.18), transparent 60%)",
      }} />

      <div style={{
        fontFamily: body, fontWeight: 600, fontSize: 34, color: "#E8B400",
        letterSpacing: 6, textTransform: "uppercase", marginBottom: 30,
        opacity: eyebrow,
      }}>
        Your AI co-coach
      </div>

      <div style={{
        fontFamily: display, fontWeight: 800, fontSize: 200, color: "#fff",
        lineHeight: 0.92, letterSpacing: -5, textAlign: "center",
        transform: `scale(${interpolate(titleS, [0, 1], [0.7, 1]) * breathe})`,
        opacity: titleS,
        textShadow: "0 0 80px rgba(232,180,0,0.4)",
      }}>
        Coach<br />
        <span style={{
          background: "linear-gradient(135deg, #FFD340, #E8B400)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>smarter.</span>
      </div>

      <div style={{
        width: `${lineW}%`, maxWidth: 600, height: 4,
        background: "linear-gradient(90deg, transparent, #E8B400, transparent)",
        marginTop: 40, borderRadius: 2,
      }} />

      <div style={{
        marginTop: 50, fontFamily: body, fontWeight: 500, fontSize: 32,
        color: "rgba(255,255,255,0.7)", textAlign: "center", maxWidth: 800, lineHeight: 1.3,
        opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        Built into Camino. No setup.<br />Just ask.
      </div>

      <div style={{
        marginTop: 70, padding: "26px 56px",
        background: "linear-gradient(135deg, #E8B400, #FFD340)",
        borderRadius: 100, fontFamily: display, fontWeight: 800, fontSize: 40,
        color: "#0D1117", letterSpacing: 1,
        opacity: urlS, transform: `scale(${interpolate(urlS, [0, 1], [0.8, 1]) * breathe})`,
        boxShadow: "0 20px 60px rgba(232,180,0,0.4)",
      }}>
        camino-player-path.lovable.app
      </div>
    </AbsoluteFill>
  );
};
