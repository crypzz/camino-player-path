import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

const phrases = ["The training.", "The early mornings.", "The setbacks."];

export const GrindScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [80, 103], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", padding: "0 80px", opacity: fadeOut }}>
        {phrases.map((phrase, i) => {
          const delay = i * 22;
          const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 200 } });
          const y = interpolate(s, [0, 1], [60, 0]);
          const o = interpolate(s, [0, 1], [0, 1]);

          // Gold underline grows in
          const lineWidth = interpolate(frame, [delay + 10, delay + 30], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              opacity: o,
              transform: `translateY(${y}px)`,
              marginBottom: 30,
              position: "relative",
              display: "inline-block",
              width: "100%",
            }}>
              <div style={{
                fontFamily, fontSize: 72, fontWeight: 800,
                color: "#F5F5F5", lineHeight: 1.2,
              }}>
                {phrase}
              </div>
              <div style={{
                width: `${lineWidth}%`, height: 3,
                backgroundColor: "#E8B400", borderRadius: 2,
                margin: "8px auto 0", opacity: 0.6,
              }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
