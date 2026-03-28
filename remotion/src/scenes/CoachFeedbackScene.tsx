import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

const feedbackItems = [
  { text: "Great improvement on ball control", icon: "✓", color: "#1DB870" },
  { text: "Focus on weak foot next session", icon: "→", color: "#2B7FE8" },
  { text: "Ready for match selection", icon: "★", color: "#E8B400" },
];

export const CoachFeedbackScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade out
  const fadeOut = interpolate(frame, [75, 88], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Label
  const labelSpring = spring({ frame: frame - 55, fps, config: { damping: 20 } });
  const labelOpacity = interpolate(labelSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut, width: 860, padding: "0 50px" }}>
        {/* Coach avatar + title */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 45, gap: 20 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: "#E8B400",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 30,
          }}>
            👨‍🏫
          </div>
          <div>
            <div style={{ fontFamily, fontSize: 34, fontWeight: 800, color: "#FFFFFF" }}>
              Coach Feedback
            </div>
            <div style={{ fontFamily: bodyFont, fontSize: 22, fontWeight: 400, color: "rgba(255,255,255,0.4)" }}>
              Just now
            </div>
          </div>
        </div>

        {/* Feedback bubbles */}
        {feedbackItems.map((item, i) => {
          const delay = 8 + i * 15;
          const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 120 } });
          const y = interpolate(s, [0, 1], [60, 0]);
          const opacity = interpolate(s, [0, 1], [0, 1]);

          return (
            <div key={i} style={{
              opacity,
              transform: `translateY(${y}px)`,
              marginBottom: 20,
              padding: "28px 32px",
              borderRadius: 24,
              backgroundColor: "rgba(255,255,255,0.05)",
              border: `1px solid ${item.color}22`,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: `${item.color}20`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: bodyFont,
                fontSize: 22,
                fontWeight: 600,
                color: item.color,
                flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <span style={{
                fontFamily: bodyFont,
                fontSize: 28,
                fontWeight: 500,
                color: "#FFFFFF",
                lineHeight: 1.3,
              }}>
                {item.text}
              </span>
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
        Your coach. <span style={{ color: "#E8B400" }}>Always watching.</span>
      </div>
    </AbsoluteFill>
  );
};
