import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["600", "700"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const WHITE = "#FFFFFF";

const stamps = [
  { label: "REAL", word: "Product", delay: 0 },
  { label: "REAL", word: "Users", delay: 22 },
  { label: "REAL", word: "Growth", delay: 44 },
];

export const BagsCriteriaScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", padding: "0 60px", gap: 30 }}>
      {stamps.map((st, i) => {
        const s = spring({ frame: frame - st.delay, fps, config: { damping: 11, stiffness: 200 } });
        const scale = interpolate(s, [0, 1], [2, 1]);
        const rot = interpolate(s, [0, 1], [-8, -2]);
        const op = interpolate(s, [0, 1], [0, 1]);
        return (
          <div key={i} style={{
            opacity: op, transform: `scale(${scale}) rotate(${rot}deg)`,
            border: `6px solid ${GOLD}`, borderRadius: 14,
            padding: "20px 50px", display: "flex", alignItems: "baseline", gap: 18,
            boxShadow: `0 0 50px ${GOLD}33, inset 0 0 14px ${GOLD}22`,
          }}>
            <div style={{
              fontFamily: bodyFont, fontWeight: 700, fontSize: 28, color: GOLD,
              letterSpacing: "0.22em",
            }}>{st.label}</div>
            <div style={{
              fontFamily, fontWeight: 800, fontSize: 88, color: WHITE,
              letterSpacing: "-0.03em", lineHeight: 1,
            }}>{st.word}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
