import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const WHITE = "#F4F4F2";

export const FCCTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sweep = interpolate(frame, [0, 70], [-100, 100]);

  const wordmarkS = spring({ frame, fps, config: { damping: 20 } });
  const wordmarkOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const wordmarkY = interpolate(wordmarkS, [0, 1], [30, 0]);

  const comingS = spring({ frame: frame - 18, fps, config: { damping: 20 } });
  const comingOp = interpolate(frame, [18, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const comingY = interpolate(comingS, [0, 1], [30, 0]);

  const domainS = spring({ frame: frame - 40, fps, config: { damping: 20 } });
  const domainOp = interpolate(frame, [40, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const domainY = interpolate(domainS, [0, 1], [30, 0]);

  const handleOp = interpolate(frame, [70, 88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center" }}>
      {/* Gold gradient sweep */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(110deg, transparent 0%, ${GOLD}33 50%, transparent 100%)`,
        transform: `translateX(${sweep}%)`,
      }} />
      {/* Soft vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 50% 50%, ${GOLD}1A 0%, ${BG} 70%)`,
      }} />

      <div style={{ position: "relative", textAlign: "center", padding: "0 60px" }}>
        <div style={{
          fontFamily: bodyFont, fontSize: 22, color: GOLD, letterSpacing: "0.4em",
          opacity: wordmarkOp, transform: `translateY(${wordmarkY}px)`, marginBottom: 24,
        }}>
          THE NEXT CHAPTER
        </div>

        <div style={{
          fontFamily, fontWeight: 800, fontSize: 140, color: WHITE,
          letterSpacing: "-0.04em", lineHeight: 0.95,
          opacity: wordmarkOp, transform: `translateY(${wordmarkY}px)`,
        }}>
          FOLLOW<span style={{ color: GOLD }}>CAM</span>
        </div>

        <div style={{
          marginTop: 30,
          fontFamily, fontWeight: 800, fontSize: 56, color: WHITE,
          letterSpacing: "-0.02em",
          opacity: comingOp, transform: `translateY(${comingY}px)`,
        }}>
          Coming <span style={{ color: GOLD }}>2026</span>
        </div>

        <div style={{
          marginTop: 60,
          opacity: domainOp, transform: `translateY(${domainY}px)`,
          display: "inline-block",
          padding: "20px 38px", borderRadius: 14,
          border: `2px solid ${GOLD}`, backgroundColor: "#11192766",
        }}>
          <div style={{ fontFamily: bodyFont, fontSize: 18, color: GOLD, letterSpacing: "0.32em", fontWeight: 700, marginBottom: 8 }}>
            JOIN EARLY ACCESS
          </div>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 44, color: WHITE, letterSpacing: "-0.02em" }}>
            caminodevelopment.com
          </div>
        </div>

        <div style={{
          marginTop: 50, fontFamily: bodyFont, fontSize: 26, color: "#9AA3B2", fontWeight: 600,
          opacity: handleOp, letterSpacing: "0.08em",
        }}>
          @CaminoDev · #CaminoFollowCam
        </div>
      </div>
    </AbsoluteFill>
  );
};
