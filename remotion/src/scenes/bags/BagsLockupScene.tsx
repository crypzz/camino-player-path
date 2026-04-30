import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const WHITE = "#FFFFFF";

export const BagsLockupScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camino slides in from left
  const lS = spring({ frame, fps, config: { damping: 16, stiffness: 160 } });
  const lX = interpolate(lS, [0, 1], [-700, 0]);
  const lOp = interpolate(lS, [0, 1], [0, 1]);

  // Bags slides in from right
  const rS = spring({ frame: frame - 6, fps, config: { damping: 16, stiffness: 160 } });
  const rX = interpolate(rS, [0, 1], [700, 0]);
  const rOp = interpolate(rS, [0, 1], [0, 1]);

  // X collide flash
  const flash = interpolate(frame, [22, 26, 36], [0, 0.18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtitle pop
  const subS = spring({ frame: frame - 38, fps, config: { damping: 20 } });
  const subOp = interpolate(subS, [0, 1], [0, 1]);
  const subY = interpolate(subS, [0, 1], [24, 0]);

  // Tagline
  const tagS = spring({ frame: frame - 60, fps, config: { damping: 22 } });
  const tagOp = interpolate(tagS, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: GOLD, opacity: flash }} />

      <div style={{
        fontFamily: bodyFont, fontWeight: 600, fontSize: 26, color: "rgba(255,255,255,0.55)",
        letterSpacing: "0.32em", marginBottom: 60, opacity: subOp, transform: `translateY(${subY}px)`,
      }}>
        ENTERING
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        {/* Camino mark */}
        <div style={{
          opacity: lOp, transform: `translateX(${lX}px)`,
          display: "flex", alignItems: "center", gap: 14,
          fontFamily, fontWeight: 800, fontSize: 88, color: WHITE,
          letterSpacing: "-0.03em",
        }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: GOLD, boxShadow: `0 0 18px ${GOLD}` }} />
          Camino
        </div>

        {/* X */}
        <div style={{
          fontFamily, fontWeight: 800, fontSize: 64, color: GOLD,
          opacity: interpolate(frame, [22, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `scale(${interpolate(frame, [22, 30], [2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
        }}>
          ×
        </div>

        {/* Bags mark */}
        <div style={{
          opacity: rOp, transform: `translateX(${rX}px)`,
          fontFamily, fontWeight: 800, fontSize: 88, color: WHITE,
          letterSpacing: "-0.03em",
          padding: "8px 28px", borderRadius: 18,
          border: `4px solid ${GOLD}`,
        }}>
          Bags
        </div>
      </div>

      <div style={{
        marginTop: 70, textAlign: "center", opacity: tagOp, padding: "0 40px",
        fontFamily, fontWeight: 800, fontSize: 52, color: WHITE,
        letterSpacing: "-0.02em", lineHeight: 1.15,
      }}>
        We came to <span style={{ color: GOLD }}>ship</span>.
      </div>
    </AbsoluteFill>
  );
};
