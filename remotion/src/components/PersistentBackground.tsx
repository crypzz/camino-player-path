import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "../theme";

// Persistent dark background with soccer-field texture + drifting glow.
export const PersistentBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const drift = Math.sin(frame / 60) * 40;
  const drift2 = Math.cos(frame / 80) * 60;
  const pulse = interpolate(Math.sin(frame / 40), [-1, 1], [0.18, 0.32]);

  // Pitch lines
  const lineColor = "rgba(255,255,255,0.04)";
  const lines = [];
  for (let i = 1; i < 10; i++) {
    lines.push(
      <div
        key={`h${i}`}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${(i / 10) * 100}%`,
          height: 1,
          background: lineColor,
        }}
      />
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* subtle pitch grid */}
      <AbsoluteFill style={{ opacity: 0.6 }}>{lines}</AbsoluteFill>
      {/* center circle */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 520,
          height: 520,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.04)",
          transform: "translate(-50%,-50%)",
        }}
      />
      {/* drifting yellow glow */}
      <div
        style={{
          position: "absolute",
          left: width * 0.5 + drift,
          top: height * 0.3 + drift2,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(252,211,77,${pulse}), transparent 60%)`,
          transform: "translate(-50%,-50%)",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width * 0.3 - drift,
          top: height * 0.75 + drift,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(245,158,11,0.12), transparent 60%)`,
          transform: "translate(-50%,-50%)",
          filter: "blur(40px)",
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
