import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["300"], subsets: ["latin"] });

export const GoProCloseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo slam
  const s = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 200 } });
  const logoScale = interpolate(s, [0, 1], [4, 1]);
  const logoO = interpolate(frame, [5, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "Coming Soon" fade
  const soonO = interpolate(frame, [25, 40], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Breathing glow
  const glowO = frame > 10 ? 0.12 + Math.sin(frame * 0.06) * 0.08 : 0;

  // Breathe scale
  const breathe = 1 + Math.sin(frame * 0.04) * 0.008;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0E1A", justifyContent: "center", alignItems: "center" }}>
      {/* Gold glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at center, rgba(232,180,0,0.2) 0%, transparent 50%)",
        opacity: glowO,
      }} />

      <div style={{ textAlign: "center", transform: `scale(${breathe})` }}>
        <div style={{
          fontFamily, fontSize: 140, color: "#E8B400",
          letterSpacing: "0.1em", lineHeight: 1,
          opacity: logoO,
          transform: `scale(${logoScale})`,
        }}>
          CAMINO
        </div>
        <div style={{
          fontFamily: bodyFont, fontSize: 22, color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.3em", marginTop: 30,
          opacity: soonO,
        }}>
          COMING SOON
        </div>
      </div>
    </AbsoluteFill>
  );
};
