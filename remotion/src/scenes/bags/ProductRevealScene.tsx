import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

export const ProductRevealScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoS = spring({ frame, fps, config: { damping: 11, stiffness: 100 } });
  const logoScale = interpolate(logoS, [0, 1], [0.5, 1]);
  const logoO = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  const lineW = interpolate(frame, [25, 55], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const tagS = spring({ frame: frame - 50, fps, config: { damping: 18 } });
  const tagY = interpolate(tagS, [0, 1], [30, 0]);
  const tagO = interpolate(tagS, [0, 1], [0, 1]);

  const subS = spring({ frame: frame - 80, fps, config: { damping: 18 } });
  const subY = interpolate(subS, [0, 1], [20, 0]);
  const subO = interpolate(subS, [0, 1], [0, 1]);

  // Subtle breathing on logo
  const breathe = 1 + Math.sin(frame * 0.04) * 0.008;

  return (
    <AbsoluteFill style={{
      backgroundColor: "#0A0C12",
      justifyContent: "center", alignItems: "center",
    }}>
      {/* Gold ambient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 50%, rgba(232,180,0,0.1) 0%, transparent 55%)",
      }} />

      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: display, fontSize: 220, fontWeight: 800,
          color: "#FFFFFF", letterSpacing: "-0.06em", lineHeight: 1,
          opacity: logoO, transform: `scale(${logoScale * breathe})`,
        }}>
          CAMINO
        </div>
        {/* Gold underline */}
        <div style={{
          width: 600, height: 5, margin: "20px auto 0",
          background: "linear-gradient(90deg, transparent, #E8B400, transparent)",
          transform: `scaleX(${lineW / 100})`, transformOrigin: "center",
          boxShadow: "0 0 20px rgba(232,180,0,0.6)",
        }} />
        <div style={{
          fontFamily: display, fontSize: 48, fontWeight: 700, color: "#E8B400",
          marginTop: 36, letterSpacing: "-0.01em",
          opacity: tagO, transform: `translateY(${tagY}px)`,
        }}>
          The player development platform.
        </div>
        <div style={{
          fontFamily: body, fontSize: 28, fontWeight: 500, color: "#8B92A3",
          marginTop: 24, letterSpacing: "0.05em",
          opacity: subO, transform: `translateY(${subY}px)`,
        }}>
          One passport. Every player. Tracked from U8 to pro.
        </div>
      </div>
    </AbsoluteFill>
  );
};
