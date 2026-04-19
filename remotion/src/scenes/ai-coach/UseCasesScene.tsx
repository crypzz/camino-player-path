import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

const prompts = [
  { q: "Which players regressed this month?", icon: "📉", color: "#ef4444" },
  { q: "Top 3 players by CPI right now", icon: "🏆", color: "#E8B400" },
  { q: "Who needs a fitness focus?", icon: "⚡", color: "#3b82f6" },
  { q: "Draft a training plan for my weakest defender", icon: "📋", color: "#22c55e" },
];

export const UseCasesScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame: frame - 2, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #0D1117 0%, #0A0E14 100%)",
      fontFamily: body, padding: 80,
    }}>
      {/* Ambient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 0%, rgba(232,180,0,0.12), transparent 60%)",
      }} />

      {/* Header */}
      <div style={{
        marginTop: 80,
        opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(titleS, [0, 1], [30, 0])}px)`,
      }}>
        <div style={{
          fontFamily: body, fontWeight: 600, fontSize: 28, color: "#E8B400",
          letterSpacing: 5, textTransform: "uppercase", marginBottom: 18,
        }}>
          Ask anything
        </div>
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 96, color: "#fff",
          lineHeight: 0.95, letterSpacing: -3,
        }}>
          Your roster.<br />
          <span style={{
            background: "linear-gradient(135deg, #FFD340, #E8B400)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Decoded.</span>
        </div>
      </div>

      {/* Prompt cards stagger */}
      <div style={{
        marginTop: 80, display: "flex", flexDirection: "column", gap: 24,
      }}>
        {prompts.map((p, i) => {
          const s = spring({ frame: frame - (20 + i * 12), fps, config: { damping: 18, stiffness: 160 } });
          const lift = interpolate(s, [0, 1], [80, 0]);
          return (
            <div key={p.q} style={{
              padding: "28px 32px",
              background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
              border: "1px solid rgba(232,180,0,0.2)",
              borderRadius: 24,
              display: "flex", alignItems: "center", gap: 24,
              opacity: s,
              transform: `translateX(${lift}px)`,
              boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px ${p.color}15`,
            }}>
              <div style={{
                width: 76, height: 76, borderRadius: 20,
                background: `${p.color}20`, border: `2px solid ${p.color}50`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 40, flexShrink: 0,
              }}>{p.icon}</div>
              <div style={{
                fontFamily: body, fontWeight: 600, fontSize: 32, color: "#fff",
                lineHeight: 1.25, flex: 1,
              }}>
                {p.q}
              </div>
              <div style={{
                fontSize: 32, color: p.color, fontWeight: 700,
                opacity: interpolate(frame - (28 + i * 12), [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}>→</div>
            </div>
          );
        })}
      </div>

      {/* Footer tag */}
      <div style={{
        position: "absolute", bottom: 100, left: 80, right: 80,
        padding: "20px 28px", borderRadius: 16,
        background: "rgba(232,180,0,0.08)",
        border: "1px solid rgba(232,180,0,0.3)",
        fontFamily: body, fontWeight: 600, fontSize: 26, color: "#E8B400",
        textAlign: "center", letterSpacing: 1,
        opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        Reads CPI · Evaluations · Fitness · Attendance
      </div>
    </AbsoluteFill>
  );
};
