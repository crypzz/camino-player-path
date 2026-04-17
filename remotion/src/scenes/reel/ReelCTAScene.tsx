import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

const benefits = [
  "✓ Video Analysis",
  "✓ Communication",
  "✓ Player Profiles",
  "✓ CPI Tracking",
];

export const ReelCTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
  const lineW = interpolate(frame, [10, 35], [0, 100], { extrapolateRight: "clamp" });
  const urlS = spring({ frame: frame - 60, fps, config: { damping: 18 } });
  const breathe = 1 + Math.sin(frame / 12) * 0.02;

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #0D1117 0%, #161B22 100%)",
      fontFamily: body, alignItems: "center", justifyContent: "center", padding: 80,
    }}>
      {/* Subtle gold glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 60%, rgba(232,180,0,0.12), transparent 60%)",
      }} />

      <div style={{
        fontFamily: body, fontWeight: 600, fontSize: 36, color: "#E8B400",
        letterSpacing: 6, textTransform: "uppercase", marginBottom: 30,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        Stop paying for 4
      </div>

      <div style={{
        fontFamily: display, fontWeight: 800, fontSize: 180, color: "#fff",
        lineHeight: 0.95, letterSpacing: -4, textAlign: "center",
        transform: `scale(${interpolate(titleS, [0, 1], [0.7, 1]) * breathe})`,
        opacity: titleS,
        textShadow: "0 0 80px rgba(232,180,0,0.4)",
      }}>
        One App.<br /><span style={{ color: "#E8B400" }}>Everything.</span>
      </div>

      <div style={{ width: `${lineW}%`, maxWidth: 600, height: 4, background: "#E8B400", marginTop: 40, borderRadius: 2 }} />

      <div style={{ marginTop: 50, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, maxWidth: 800 }}>
        {benefits.map((b, i) => {
          const s = spring({ frame: frame - (40 + i * 6), fps, config: { damping: 18 } });
          return (
            <div key={b} style={{
              padding: "18px 28px", background: "rgba(232,180,0,0.1)",
              border: "1px solid rgba(232,180,0,0.4)", borderRadius: 14,
              fontFamily: body, fontWeight: 600, fontSize: 30, color: "#fff",
              opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-30, 0])}px)`,
            }}>{b}</div>
          );
        })}
      </div>

      <div style={{
        marginTop: 70, padding: "24px 60px",
        background: "linear-gradient(135deg, #E8B400, #FFD340)",
        borderRadius: 100, fontFamily: display, fontWeight: 800, fontSize: 44,
        color: "#0D1117", letterSpacing: 1,
        opacity: urlS, transform: `scale(${interpolate(urlS, [0, 1], [0.8, 1]) * breathe})`,
        boxShadow: "0 20px 60px rgba(232,180,0,0.4)",
      }}>
        camino-player-path.lovable.app
      </div>
    </AbsoluteFill>
  );
};
