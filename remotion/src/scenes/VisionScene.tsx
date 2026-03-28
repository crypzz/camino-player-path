import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

const lines = ["Your journey.", "Your data.", "Your future."];

export const VisionScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [95, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", padding: "0 80px", opacity: fadeOut }}>
        {lines.map((line, i) => {
          const delay = 5 + i * 25;
          const s = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 160 } });
          const y = interpolate(s, [0, 1], [50, 0]);
          const o = interpolate(s, [0, 1], [0, 1]);

          return (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{
                fontFamily, fontSize: 80, fontWeight: 800,
                color: "#E8B400", lineHeight: 1.15, letterSpacing: "-0.03em",
                opacity: o, transform: `translateY(${y}px)`,
              }}>
                {line}
              </div>
              {/* Gold accent line between phrases */}
              {i < lines.length - 1 && (
                <div style={{
                  width: interpolate(frame, [delay + 15, delay + 35], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  height: 2, backgroundColor: "#E8B400", opacity: 0.3,
                  margin: "16px auto",
                }} />
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
