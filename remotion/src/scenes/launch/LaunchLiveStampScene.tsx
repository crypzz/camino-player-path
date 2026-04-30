import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";

export const LaunchLiveStampScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stamp drop
  const stampS = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 180 } });
  const scale = interpolate(stampS, [0, 1], [2.2, 1]);
  const rotate = interpolate(stampS, [0, 1], [-20, -6]);
  const op = interpolate(frame, [5, 15], [0, 1], { extrapolateRight: "clamp" });

  // Impact shake
  const shakeAmt = frame >= 25 && frame <= 38 ? Math.sin((frame - 25) * 2.2) * (1 - (frame - 25) / 13) * 8 : 0;

  // Pulsing dot
  const pulse = 0.85 + Math.sin(frame * 0.18) * 0.15;

  // Subtitle
  const subS = spring({ frame: frame - 38, fps, config: { damping: 22 } });
  const subOp = interpolate(subS, [0, 1], [0, 1]);
  const subY = interpolate(subS, [0, 1], [20, 0]);

  return (
    <AbsoluteFill style={{
      backgroundColor: BG, justifyContent: "center", alignItems: "center",
      transform: `translateX(${shakeAmt}px)`,
    }}>
      {/* Stamp */}
      <div style={{
        opacity: op,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        border: `8px solid ${GOLD}`,
        borderRadius: 18,
        padding: "30px 60px",
        display: "flex", alignItems: "center", gap: 24,
        boxShadow: `0 0 60px ${GOLD}44, inset 0 0 20px ${GOLD}22`,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", backgroundColor: GOLD,
          transform: `scale(${pulse})`,
          boxShadow: `0 0 20px ${GOLD}`,
        }} />
        <div style={{
          fontFamily, fontWeight: 800, fontSize: 110, color: GOLD,
          letterSpacing: "0.02em", lineHeight: 1,
        }}>
          NOW LIVE
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 380,
        opacity: subOp, transform: `translateY(${subY}px)`,
        textAlign: "center", padding: "0 80px",
      }}>
        <div style={{
          fontFamily: bodyFont, fontWeight: 600, fontSize: 36,
          color: "rgba(255,255,255,0.85)", letterSpacing: "-0.01em",
        }}>
          Open to clubs across North America.
        </div>
      </div>
    </AbsoluteFill>
  );
};
