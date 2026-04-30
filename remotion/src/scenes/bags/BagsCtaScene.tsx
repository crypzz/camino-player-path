import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const WHITE = "#FFFFFF";

export const BagsCtaScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated gold gradient sweep
  const sweep = interpolate(frame, [0, 75], [-30, 130]);

  const lineS = spring({ frame, fps, config: { damping: 20 } });
  const lineOp = interpolate(lineS, [0, 1], [0, 1]);
  const lineY = interpolate(lineS, [0, 1], [30, 0]);

  const handlesS = spring({ frame: frame - 14, fps, config: { damping: 20 } });
  const handlesOp = interpolate(handlesS, [0, 1], [0, 1]);

  const tagS = spring({ frame: frame - 30, fps, config: { damping: 14, stiffness: 180 } });
  const tagOp = interpolate(tagS, [0, 1], [0, 1]);
  const tagScale = interpolate(tagS, [0, 1], [1.4, 1]);

  return (
    <AbsoluteFill style={{
      backgroundColor: BG, justifyContent: "center", alignItems: "center", padding: "0 60px", gap: 36,
    }}>
      {/* sweeping gold sheen */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(115deg, transparent ${sweep - 25}%, ${GOLD}22 ${sweep}%, transparent ${sweep + 25}%)`,
      }} />

      <div style={{
        opacity: lineOp, transform: `translateY(${lineY}px)`,
        fontFamily, fontWeight: 800, fontSize: 68, color: WHITE,
        letterSpacing: "-0.03em", textAlign: "center", lineHeight: 1.1,
      }}>
        Built good tech.<br />
        <span style={{ color: GOLD }}>Built for traction.</span>
      </div>

      <div style={{
        opacity: handlesOp,
        display: "flex", alignItems: "center", gap: 22,
        padding: "18px 36px", borderRadius: 999,
        border: `2px solid ${GOLD}88`, background: `${GOLD}10`,
      }}>
        <div style={{
          fontFamily, fontWeight: 800, fontSize: 30, color: WHITE, letterSpacing: "-0.02em",
        }}>@CaminoDev</div>
        <div style={{ color: GOLD, fontFamily, fontWeight: 800, fontSize: 28 }}>×</div>
        <div style={{
          fontFamily, fontWeight: 800, fontSize: 30, color: WHITE, letterSpacing: "-0.02em",
        }}>@bagsapp</div>
      </div>

      <div style={{
        opacity: tagOp, transform: `scale(${tagScale})`,
        fontFamily, fontWeight: 800, fontSize: 48, color: GOLD,
        letterSpacing: "-0.02em", textAlign: "center",
      }}>
        #BagsHackathon
      </div>

      <div style={{
        position: "absolute", bottom: 90,
        fontFamily: bodyFont, fontWeight: 600, fontSize: 24,
        color: "rgba(255,255,255,0.55)", letterSpacing: "0.28em",
      }}>
        CAMINODEVELOPMENT.COM
      </div>
    </AbsoluteFill>
  );
};
