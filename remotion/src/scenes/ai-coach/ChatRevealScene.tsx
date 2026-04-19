import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

export const ChatRevealScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone frame slides up
  const phoneS = spring({ frame, fps, config: { damping: 20, stiffness: 100 } });
  const phoneY = interpolate(phoneS, [0, 1], [200, 0]);
  const phoneOpacity = phoneS;

  // Chat bubble entries
  const userBubble = spring({ frame: frame - 25, fps, config: { damping: 18, stiffness: 180 } });
  const typingDot = spring({ frame: frame - 45, fps, config: { damping: 22 } });
  const aiBubble = spring({ frame: frame - 70, fps, config: { damping: 18, stiffness: 160 } });

  // Typing dot animation
  const dotPulse = (i: number) => {
    const t = (frame - 45 - i * 5) % 24;
    return interpolate(t, [0, 8, 16], [0.3, 1, 0.3], { extrapolateRight: "clamp" });
  };

  const aiText = "Sofia Chen — CPI 73.1.\nUp 8% this month. Sharp\ntactical growth, but her\nsprint times need focus.";
  const charsToShow = Math.max(0, Math.floor((frame - 75) * 1.5));

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #0D1117 0%, #161B22 100%)",
      fontFamily: body,
    }}>
      {/* Ambient gold */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 30%, rgba(232,180,0,0.1), transparent 60%)",
      }} />

      {/* Phone Mockup */}
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        opacity: phoneOpacity, transform: `translateY(${phoneY}px)`,
      }}>
        <div style={{
          width: 720, height: 1480, borderRadius: 80,
          background: "#0A0E14",
          border: "8px solid #1F2937",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 80px rgba(232,180,0,0.15)",
          padding: 24, position: "relative", overflow: "hidden",
        }}>
          {/* Notch */}
          <div style={{
            position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)",
            width: 200, height: 32, background: "#000", borderRadius: 20, zIndex: 10,
          }} />

          {/* App Header */}
          <div style={{
            marginTop: 60, padding: "20px 24px",
            background: "linear-gradient(180deg, rgba(232,180,0,0.12), transparent)",
            borderRadius: 24, display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg, #E8B400, #B8860B)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 800, color: "#0D1117",
            }}>✦</div>
            <div>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: "#fff" }}>
                Coach Assistant
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: "#22c55e" }} />
                <div style={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}>Knows your roster</div>
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div style={{ marginTop: 40, padding: "0 16px", display: "flex", flexDirection: "column", gap: 28 }}>
            {/* User message */}
            <div style={{
              alignSelf: "flex-end", maxWidth: "75%",
              background: "linear-gradient(135deg, #E8B400, #B8860B)",
              color: "#0D1117", padding: "20px 26px",
              borderRadius: "24px 24px 6px 24px",
              fontFamily: body, fontWeight: 500, fontSize: 26, lineHeight: 1.35,
              opacity: userBubble,
              transform: `translateY(${interpolate(userBubble, [0, 1], [20, 0])}px) scale(${interpolate(userBubble, [0, 1], [0.9, 1])})`,
              boxShadow: "0 8px 24px rgba(232,180,0,0.25)",
            }}>
              Who's my top performer this month?
            </div>

            {/* Typing indicator */}
            {frame >= 45 && frame < 75 && (
              <div style={{
                alignSelf: "flex-start",
                background: "rgba(255,255,255,0.06)",
                padding: "20px 26px", borderRadius: "24px 24px 24px 6px",
                display: "flex", gap: 8,
                opacity: typingDot,
              }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{
                    width: 12, height: 12, borderRadius: 6, background: "#E8B400",
                    opacity: dotPulse(i),
                  }} />
                ))}
              </div>
            )}

            {/* AI message with typewriter */}
            {frame >= 70 && (
              <div style={{
                alignSelf: "flex-start", maxWidth: "85%",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(232,180,0,0.2)",
                color: "#fff", padding: "20px 26px",
                borderRadius: "24px 24px 24px 6px",
                fontFamily: body, fontWeight: 500, fontSize: 24, lineHeight: 1.45,
                opacity: aiBubble,
                transform: `translateY(${interpolate(aiBubble, [0, 1], [20, 0])}px)`,
                whiteSpace: "pre-line",
              }}>
                {aiText.slice(0, charsToShow)}
                {charsToShow < aiText.length && (
                  <span style={{ opacity: (frame % 20) < 10 ? 1 : 0, color: "#E8B400" }}>▎</span>
                )}
              </div>
            )}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
