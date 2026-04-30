import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const WHITE = "#FFFFFF";

const words = [
  { text: "What", color: WHITE, delay: 0 },
  { text: "if", color: WHITE, delay: 6 },
  { text: "every", color: WHITE, delay: 12 },
  { text: "player", color: WHITE, delay: 18 },
  { text: "had", color: WHITE, delay: 26 },
  { text: "proof?", color: GOLD, delay: 38 },
];

export const LaunchHookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Gold flash on the word "proof"
  const flashOp = interpolate(frame, [38, 42, 50], [0, 0.18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: GOLD, opacity: flashOp }} />
      <div style={{
        fontFamily, fontWeight: 800, fontSize: 110, lineHeight: 1.05,
        letterSpacing: "-0.035em", textAlign: "left", width: "100%",
      }}>
        {words.map((w, i) => {
          const s = spring({ frame: frame - w.delay, fps, config: { damping: 18, stiffness: 180 } });
          const op = interpolate(s, [0, 1], [0, 1]);
          const y = interpolate(s, [0, 1], [40, 0]);
          return (
            <span key={i} style={{
              display: "inline-block", marginRight: 22, color: w.color,
              opacity: op, transform: `translateY(${y}px)`,
            }}>
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
