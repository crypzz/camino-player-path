import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const WHITE = "#FFFFFF";

const words = [
  { text: "The", color: WHITE, delay: 0 },
  { text: "digital", color: WHITE, delay: 6 },
  { text: "passport", color: GOLD, delay: 12 },
  { text: "for", color: WHITE, delay: 22 },
  { text: "soccer.", color: WHITE, delay: 28 },
];

export const BagsPitchScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CPI Dial reveal
  const dialS = spring({ frame: frame - 36, fps, config: { damping: 18, stiffness: 140 } });
  const dialOp = interpolate(dialS, [0, 1], [0, 1]);
  const dialScale = interpolate(dialS, [0, 1], [0.85, 1]);

  // Ring fill 0 -> 84
  const target = 84;
  const fillProgress = interpolate(frame, [40, 90], [0, target], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const num = Math.round(fillProgress);

  // SVG ring
  const r = 130;
  const C = 2 * Math.PI * r;
  const dash = (fillProgress / 100) * C;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
      <div style={{
        fontFamily, fontWeight: 800, fontSize: 88, lineHeight: 1.05,
        letterSpacing: "-0.035em", textAlign: "center", width: "100%", marginBottom: 60,
      }}>
        {words.map((w, i) => {
          const s = spring({ frame: frame - w.delay, fps, config: { damping: 18, stiffness: 180 } });
          const op = interpolate(s, [0, 1], [0, 1]);
          const y = interpolate(s, [0, 1], [40, 0]);
          return (
            <span key={i} style={{
              display: "inline-block", marginRight: 18, color: w.color,
              opacity: op, transform: `translateY(${y}px)`,
            }}>
              {w.text}
            </span>
          );
        })}
      </div>

      {/* CPI Dial */}
      <div style={{
        opacity: dialOp, transform: `scale(${dialScale})`,
        position: "relative", width: 320, height: 320,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="320" height="320" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
          <circle cx="160" cy="160" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="18" fill="none" />
          <circle
            cx="160" cy="160" r={r}
            stroke={GOLD} strokeWidth="18" fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${C}`}
            style={{ filter: `drop-shadow(0 0 12px ${GOLD}aa)` }}
          />
        </svg>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily, fontWeight: 800, fontSize: 96, color: WHITE,
            letterSpacing: "-0.04em", lineHeight: 1,
          }}>
            {num}
          </div>
          <div style={{
            fontFamily: bodyFont, fontWeight: 700, fontSize: 22, color: GOLD,
            letterSpacing: "0.28em", marginTop: 6,
          }}>
            CPI SCORE
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 40,
        fontFamily: bodyFont, fontWeight: 600, fontSize: 26, color: "rgba(255,255,255,0.6)",
        letterSpacing: "0.18em", textAlign: "center",
      }}>
        23 ATTRIBUTES · ONE SCORE
      </div>
    </AbsoluteFill>
  );
};
