import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const WHITE = "#FFFFFF";

export const BagsLiveScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stampS = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });
  const stampScale = interpolate(stampS, [0, 1], [2.2, 1]);
  const stampRot = interpolate(stampS, [0, 1], [-18, -6]);
  const stampOp = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  const flash = interpolate(frame, [6, 10, 22], [0, 0.22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = frame >= 8 && frame <= 22 ? Math.sin((frame - 8) * 2.4) * (1 - (frame - 8) / 14) * 8 : 0;
  const pulse = 0.85 + Math.sin(frame * 0.18) * 0.15;

  const urlS = spring({ frame: frame - 36, fps, config: { damping: 18, stiffness: 150 } });
  const urlOp = interpolate(urlS, [0, 1], [0, 1]);
  const urlScale = interpolate(urlS, [0, 1], [1.1, 1]);

  const underline = interpolate(frame, [55, 85], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      backgroundColor: BG, justifyContent: "center", alignItems: "center",
      padding: "0 40px", transform: `translateX(${shake}px)`, gap: 70,
    }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: GOLD, opacity: flash }} />

      <div style={{
        opacity: stampOp,
        transform: `scale(${stampScale}) rotate(${stampRot}deg)`,
        border: `8px solid ${GOLD}`, borderRadius: 18,
        padding: "24px 50px", display: "flex", alignItems: "center", gap: 22,
        boxShadow: `0 0 60px ${GOLD}55, inset 0 0 20px ${GOLD}22`,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%", backgroundColor: GOLD,
          transform: `scale(${pulse})`, boxShadow: `0 0 20px ${GOLD}`,
        }} />
        <div style={{
          fontFamily, fontWeight: 800, fontSize: 96, color: GOLD,
          letterSpacing: "0.02em", lineHeight: 1,
        }}>LIVE NOW</div>
      </div>

      <div style={{
        opacity: urlOp, transform: `scale(${urlScale})`,
        textAlign: "center", width: "100%", padding: "0 20px",
      }}>
        <div style={{
          fontFamily, fontWeight: 800, fontSize: 64, color: WHITE,
          letterSpacing: "-0.035em", lineHeight: 1, whiteSpace: "nowrap",
        }}>
          caminodevelopment<span style={{ color: GOLD }}>.com</span>
        </div>
        <div style={{ height: 5, marginTop: 18, position: "relative", width: "82%", marginLeft: "auto", marginRight: "auto" }}>
          <div style={{
            height: "100%", width: `${underline}%`, backgroundColor: GOLD,
            borderRadius: 3, boxShadow: `0 0 16px ${GOLD}88`,
          }} />
        </div>
        <div style={{
          marginTop: 26, fontFamily: bodyFont, fontWeight: 600, fontSize: 28,
          color: "rgba(255,255,255,0.7)", letterSpacing: "-0.005em",
        }}>
          Try it. Today.
        </div>
      </div>
    </AbsoluteFill>
  );
};
