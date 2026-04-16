import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["400", "500"], subsets: ["latin"] });

export const ProCloseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoS = spring({ frame: frame - 10, fps, config: { damping: 25, stiffness: 120 } });
  const tagS = spring({ frame: frame - 30, fps, config: { damping: 28 } });
  const urlO = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtle float
  const floatY = Math.sin(frame * 0.04) * 3;

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(160deg, #0D1117 0%, #111827 50%, #0D1117 100%)",
      justifyContent: "center", alignItems: "center",
    }}>
      {/* Subtle gold accent */}
      <div style={{
        position: "absolute",
        width: 500, height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,180,0,0.04) 0%, transparent 70%)",
        transform: `translateY(${floatY}px)`,
      }} />

      <div style={{ textAlign: "center", transform: `translateY(${floatY}px)` }}>
        <div style={{
          fontFamily: display, fontSize: 72, fontWeight: 800,
          color: "#E8B400", letterSpacing: "-0.03em",
          opacity: interpolate(logoS, [0, 1], [0, 1]),
          transform: `scale(${interpolate(logoS, [0, 1], [0.85, 1])})`,
        }}>
          Camino
        </div>

        <div style={{
          fontFamily: body, fontSize: 22, fontWeight: 400,
          color: "#9CA3AF", marginTop: 16,
          opacity: interpolate(tagS, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(tagS, [0, 1], [15, 0])}px)`,
        }}>
          Your progress, proven.
        </div>

        <div style={{
          fontFamily: body, fontSize: 16, fontWeight: 500,
          color: "#6B7280", marginTop: 30,
          opacity: urlO,
          letterSpacing: "0.05em",
        }}>
          camino-player-path.lovable.app
        </div>
      </div>

      {/* Bottom gold line */}
      <div style={{
        position: "absolute", bottom: 60,
        left: "50%", transform: "translateX(-50%)",
        width: interpolate(frame, [40, 80], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        height: 2, backgroundColor: "#E8B400", opacity: 0.3,
      }} />
    </AbsoluteFill>
  );
};
