import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["400", "500"], subsets: ["latin"] });

const lines = [
  "Talented players struggle to get noticed.",
  "Footage is scattered. Highlights are inconsistent.",
  "No clear way to present a full player profile.",
];

export const ProProblemScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [180, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtle gradient shift
  const gradAngle = interpolate(frame, [0, 210], [135, 145]);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(${gradAngle}deg, #0A0E17 0%, #111827 50%, #0F1520 100%)`,
      justifyContent: "center",
      alignItems: "center",
    }}>
      {/* Subtle grid pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }} />

      <div style={{ opacity: fadeOut, maxWidth: 1200, padding: "0 120px", textAlign: "center" }}>
        {/* Small label */}
        <div style={{
          fontFamily: body, fontSize: 16, fontWeight: 500,
          color: "#6B7280", letterSpacing: "0.15em", textTransform: "uppercase",
          marginBottom: 40,
          opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          The Problem
        </div>

        {lines.map((line, i) => {
          const delay = 15 + i * 40;
          const s = spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 120 } });
          const y = interpolate(s, [0, 1], [30, 0]);
          const o = interpolate(s, [0, 1], [0, 1]);

          return (
            <div key={i} style={{
              fontFamily: display, fontSize: i === 0 ? 52 : 40,
              fontWeight: i === 0 ? 800 : 700,
              color: i === 0 ? "#F5F5F5" : "#9CA3AF",
              lineHeight: 1.4, letterSpacing: "-0.02em",
              marginBottom: 24,
              opacity: o, transform: `translateY(${y}px)`,
            }}>
              {line}
            </div>
          );
        })}
      </div>

      {/* Subtle red accent line */}
      <div style={{
        position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)",
        width: interpolate(frame, [120, 170], [0, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        height: 2, backgroundColor: "#DC2626", opacity: 0.4 * fadeOut,
      }} />
    </AbsoluteFill>
  );
};
