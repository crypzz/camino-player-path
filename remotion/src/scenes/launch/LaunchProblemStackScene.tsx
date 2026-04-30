import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";

const lines = [
  { text: "Lost highlight reels.", delay: 0 },
  { text: "Forgotten stats.", delay: 22 },
  { text: "Coaches guessing.", delay: 44 },
];

export const LaunchProblemStackScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", padding: "0 80px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        {lines.map((l, i) => {
          const s = spring({ frame: frame - l.delay, fps, config: { damping: 20, stiffness: 200 } });
          const op = interpolate(s, [0, 1], [0, 1]);
          const x = interpolate(s, [0, 1], [-40, 0]);
          // Strikethrough draws ~10 frames after line appears
          const strikeStart = l.delay + 10;
          const strikeWidth = interpolate(frame, [strikeStart, strikeStart + 14], [0, 100], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          return (
            <div key={i} style={{
              fontFamily, fontWeight: 800, fontSize: 86, color: "#FFFFFF",
              letterSpacing: "-0.03em", opacity: op, transform: `translateX(${x}px)`,
              position: "relative", display: "inline-block", width: "fit-content",
            }}>
              {l.text}
              <div style={{
                position: "absolute", left: 0, top: "50%",
                width: `${strikeWidth}%`, height: 6, backgroundColor: GOLD,
                transform: "translateY(-50%)", borderRadius: 3,
              }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
