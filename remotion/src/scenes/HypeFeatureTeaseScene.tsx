import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

const features = [
  { icon: "📊", label: "CPI SCORE", color: "#E8B400" },
  { icon: "🏆", label: "LIVE RANKINGS", color: "#1DB870" },
  { icon: "👤", label: "PUBLIC PROFILES", color: "#2B7FE8" },
  { icon: "📈", label: "LEVEL SYSTEM", color: "#E8B400" },
  { icon: "🃏", label: "STAT CARDS", color: "#1DB870" },
];

export const HypeFeatureTeaseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [130, 145], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      {/* Background grid pulse */}
      {Array.from({ length: 8 }).map((_, i) => {
        const lineOpacity = interpolate(frame, [i * 8, i * 8 + 15], [0, 0.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{
            position: "absolute",
            top: 200 + i * 200, left: 0, right: 0, height: 1,
            backgroundColor: "#E8B400", opacity: lineOpacity * fadeOut,
          }} />
        );
      })}

      <div style={{ opacity: fadeOut, textAlign: "center", width: "100%" }}>
        {/* Header */}
        <div style={{
          fontFamily, fontSize: 52, fontWeight: 800,
          color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em",
          marginBottom: 60,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          INTRODUCING
        </div>

        {/* Feature pills - rapid fire stagger */}
        {features.map((f, i) => {
          const delay = 15 + i * 12;
          const s = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 250 } });
          const scale = interpolate(s, [0, 1], [3, 1]);
          const o = interpolate(frame, [delay, delay + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const shake = frame > delay + 6 && frame < delay + 14
            ? Math.sin(frame * 10) * interpolate(frame, [delay + 6, delay + 14], [6, 0], { extrapolateRight: "clamp" })
            : 0;

          return (
            <div key={i} style={{
              fontFamily, fontSize: 56, fontWeight: 800,
              color: f.color, lineHeight: 1.8,
              opacity: o, transform: `scale(${scale}) translateX(${shake}px)`,
              letterSpacing: "-0.02em",
            }}>
              {f.icon}  {f.label}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
