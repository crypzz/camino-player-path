import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const ProFutureScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [120, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const titleS = spring({ frame: frame - 10, fps, config: { damping: 28, stiffness: 120 } });
  const subtitleO = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Pulsing dots for "building"
  const dotPulse = Math.sin(frame * 0.1) * 0.3 + 0.7;

  // Expanding ring
  const ringScale = interpolate(frame, [20, 120], [0.3, 1.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringO = interpolate(frame, [20, 40, 100, 120], [0, 0.15, 0.15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(160deg, #0D1117 0%, #0F172A 50%, #111827 100%)",
      justifyContent: "center", alignItems: "center",
    }}>
      {/* Expanding ring */}
      <div style={{
        position: "absolute",
        width: 400, height: 400,
        borderRadius: "50%",
        border: "1px solid #E8B400",
        opacity: ringO * fadeOut,
        transform: `scale(${ringScale})`,
      }} />

      <div style={{ opacity: fadeOut, textAlign: "center", padding: "0 120px", maxWidth: 1000 }}>
        <div style={{
          fontFamily: body, fontSize: 14, fontWeight: 500,
          color: "#6B7280", letterSpacing: "0.15em", textTransform: "uppercase",
          marginBottom: 24,
          opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          What's Next
        </div>

        <div style={{
          fontFamily: display, fontSize: 44, fontWeight: 800,
          color: "#F5F5F5", lineHeight: 1.3, letterSpacing: "-0.02em",
          opacity: interpolate(titleS, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(titleS, [0, 1], [20, 0])}px)`,
        }}>
          Automated video analysis and intelligent tagging.
        </div>

        <div style={{
          fontFamily: body, fontSize: 20, fontWeight: 400,
          color: "#9CA3AF", marginTop: 20, lineHeight: 1.6,
          opacity: subtitleO,
        }}>
          Making the process even more efficient over time.
        </div>

        {/* Three dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 40, opacity: subtitleO }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%",
              backgroundColor: "#E8B400",
              opacity: Math.sin((frame - i * 5) * 0.12) * 0.4 + 0.6,
            }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
