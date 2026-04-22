import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

export const CloseLogoScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoS = spring({ frame, fps, config: { damping: 13, stiffness: 90 } });
  const logoScale = interpolate(logoS, [0, 1], [0.7, 1]);
  const logoO = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // Pulse ring
  const pulseT = (frame % 60) / 60;
  const pulseScale = 1 + pulseT * 0.6;
  const pulseO = (1 - pulseT) * 0.5;

  // Breathing
  const breathe = 1 + Math.sin(frame * 0.06) * 0.012;

  const tagS = spring({ frame: frame - 30, fps, config: { damping: 18 } });
  const tagO = interpolate(tagS, [0, 1], [0, 1]);
  const tagY = interpolate(tagS, [0, 1], [20, 0]);

  return (
    <AbsoluteFill style={{
      backgroundColor: "#0A0C12",
      justifyContent: "center", alignItems: "center",
    }}>
      {/* Gold ambient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 50%, rgba(232,180,0,0.15) 0%, transparent 55%)",
      }} />

      {/* Pulse ring */}
      <div style={{
        position: "absolute",
        width: 900, height: 900,
        borderRadius: "50%",
        border: "2px solid #E8B400",
        transform: `scale(${pulseScale})`,
        opacity: pulseO,
      }} />
      <div style={{
        position: "absolute",
        width: 900, height: 900,
        borderRadius: "50%",
        border: "1px solid rgba(232,180,0,0.3)",
      }} />

      <div style={{ textAlign: "center", position: "relative" }}>
        <div style={{
          fontFamily: display, fontSize: 260, fontWeight: 800,
          color: "#FFFFFF", letterSpacing: "-0.06em", lineHeight: 1,
          opacity: logoO, transform: `scale(${logoScale * breathe})`,
          textShadow: "0 0 80px rgba(232,180,0,0.3)",
        }}>
          CAMINO
        </div>
        <div style={{
          fontFamily: body, fontSize: 28, fontWeight: 600, color: "#E8B400",
          marginTop: 32, letterSpacing: "0.4em", textTransform: "uppercase",
          opacity: tagO, transform: `translateY(${tagY}px)`,
        }}>
          The player development platform
        </div>
      </div>
    </AbsoluteFill>
  );
};
