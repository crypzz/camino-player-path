import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/BebasNeue";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });

const problems = [
  "NO ONE TRACKS YOUR PROGRESS",
  "COACHES FORGET YOUR BEST GAMES",
  "NO DATA. NO PROOF.",
  "YOU'RE INVISIBLE.",
];

export const ProblemStackScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [140, 160], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0E1A", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut, padding: "0 70px", width: "100%" }}>
        {problems.map((text, i) => {
          const delay = i * 30;
          const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 220 } });
          const x = interpolate(s, [0, 1], [-80, 0]);
          const o = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          // Strikethrough wipes after text lands
          const strikeW = interpolate(frame, [delay + 18, delay + 35], [0, 105], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          // Dim after strikethrough
          const dimO = interpolate(frame, [delay + 30, delay + 40], [1, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          const isLast = i === problems.length - 1;

          return (
            <div key={i} style={{
              fontFamily, fontSize: isLast ? 68 : 56,
              color: isLast ? "#FF3B3B" : "#FFFFFF",
              letterSpacing: "0.03em", lineHeight: 1.3,
              opacity: o * dimO,
              transform: `translateX(${x}px)`,
              position: "relative",
              marginBottom: 24,
            }}>
              {text}
              <div style={{
                position: "absolute", top: "50%", left: 0,
                width: `${strikeW}%`, height: 3,
                backgroundColor: "#FF3B3B",
                transform: "translateY(-50%)",
                borderRadius: 2,
              }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
