import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

const stats = [
  { label: "Sprint 40m", value: "5.2s", fill: 0.78, color: "#E8B400" },
  { label: "Beep Test", value: "Lv 12", fill: 0.85, color: "#1DB870" },
  { label: "Agility", value: "4.1s", fill: 0.72, color: "#2B7FE8" },
];

export const FitnessTestScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card slides up
  const cardSpring = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const cardY = interpolate(cardSpring, [0, 1], [400, 0]);
  const cardOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // Fade out
  const fadeOut = interpolate(frame, [75, 88], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Label
  const labelSpring = spring({ frame: frame - 55, fps, config: { damping: 20 } });
  const labelOpacity = interpolate(labelSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{
        opacity: cardOpacity * fadeOut,
        transform: `translateY(${cardY}px)`,
        width: 860,
        padding: "60px 50px",
        borderRadius: 32,
        background: "linear-gradient(165deg, rgba(232,180,0,0.08) 0%, rgba(13,15,20,0.95) 100%)",
        border: "1px solid rgba(232,180,0,0.15)",
      }}>
        {/* Title */}
        <div style={{
          fontFamily,
          fontSize: 42,
          fontWeight: 800,
          color: "#E8B400",
          marginBottom: 50,
          letterSpacing: "-0.02em",
        }}>
          ⚡ Fitness Test Results
        </div>

        {/* Stat bars */}
        {stats.map((stat, i) => {
          const delay = 12 + i * 12;
          const barSpring = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 100 } });
          const barWidth = interpolate(barSpring, [0, 1], [0, stat.fill * 100]);
          const itemOpacity = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div key={i} style={{ marginBottom: 36, opacity: itemOpacity }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontFamily: bodyFont, fontSize: 30, fontWeight: 600, color: "#FFFFFF" }}>
                  {stat.label}
                </span>
                <span style={{ fontFamily: bodyFont, fontSize: 30, fontWeight: 600, color: stat.color }}>
                  {stat.value}
                </span>
              </div>
              <div style={{
                width: "100%",
                height: 20,
                borderRadius: 10,
                backgroundColor: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}>
                <div style={{
                  width: `${barWidth}%`,
                  height: "100%",
                  borderRadius: 10,
                  backgroundColor: stat.color,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Label */}
      <div style={{
        position: "absolute",
        bottom: 280,
        fontFamily,
        fontSize: 44,
        fontWeight: 800,
        color: "#FFFFFF",
        opacity: labelOpacity * fadeOut,
        textAlign: "center",
        letterSpacing: "-0.02em",
      }}>
        Every test. <span style={{ color: "#E8B400" }}>Measured.</span>
      </div>
    </AbsoluteFill>
  );
};
