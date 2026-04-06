import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["400"], subsets: ["latin"] });

export const PivotScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "What if" appears softly
  const whatIfO = interpolate(frame, [0, 15], [0, 0.7], { extrapolateRight: "clamp" });

  // "SOMEONE WAS WATCHING?" gold reveal
  const s = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 160 } });
  const watchScale = interpolate(s, [0, 1], [1.8, 1]);
  const watchO = interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Gold glow pulse
  const glowO = frame > 30 ? 0.15 + Math.sin((frame - 30) * 0.08) * 0.1 : 0;

  const fadeOut = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0E1A", justifyContent: "center", alignItems: "center" }}>
      {/* Gold radial glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at center, rgba(232,180,0,0.15) 0%, transparent 60%)",
        opacity: glowO * fadeOut,
      }} />

      <div style={{ opacity: fadeOut, textAlign: "center", padding: "0 60px" }}>
        <div style={{
          fontFamily: bodyFont, fontSize: 34, color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.04em", opacity: whatIfO,
        }}>
          What if
        </div>
        <div style={{
          fontFamily, fontSize: 90, color: "#E8B400",
          letterSpacing: "0.04em", lineHeight: 1.1, marginTop: 15,
          opacity: watchO,
          transform: `scale(${watchScale})`,
        }}>
          SOMEONE WAS<br/>WATCHING?
        </div>
      </div>
    </AbsoluteFill>
  );
};
