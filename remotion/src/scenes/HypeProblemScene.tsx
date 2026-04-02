import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadFont("normal", { weights: ["500"], subsets: ["latin"] });

const lines = [
  { text: "No proof of progress.", delay: 0 },
  { text: "No visibility.", delay: 20 },
  { text: "No identity.", delay: 40 },
];

export const HypeProblemScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [110, 125], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "Sound familiar?" appears after lines
  const familiarOpacity = interpolate(frame, [75, 85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const familiarS = spring({ frame: frame - 75, fps, config: { damping: 15, stiffness: 180 } });
  const familiarScale = interpolate(familiarS, [0, 1], [1.5, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut, textAlign: "center", padding: "0 60px" }}>
        {lines.map((line, i) => {
          const s = spring({ frame: frame - line.delay, fps, config: { damping: 12, stiffness: 200 } });
          const x = interpolate(s, [0, 1], [80, 0]);
          const o = interpolate(frame, [line.delay, line.delay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          // Red strike-through that appears after text
          const strikeW = interpolate(frame, [line.delay + 15, line.delay + 30], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div key={i} style={{
              fontFamily, fontSize: 72, fontWeight: 800,
              color: "#FF4444", lineHeight: 1.3, letterSpacing: "-0.03em",
              opacity: o, transform: `translateX(${x}px)`,
              position: "relative", display: "inline-block", width: "100%",
            }}>
              {line.text}
              <div style={{
                position: "absolute", top: "50%", left: "10%",
                width: `${strikeW}%`, height: 4,
                backgroundColor: "rgba(255,68,68,0.6)", borderRadius: 2,
                transform: "translateY(-50%) rotate(-2deg)",
              }} />
            </div>
          );
        })}

        <div style={{
          fontFamily, fontSize: 64, fontWeight: 800,
          color: "#E8B400", marginTop: 60,
          opacity: familiarOpacity * fadeOut,
          transform: `scale(${familiarScale})`,
        }}>
          Sound familiar?
        </div>
      </div>
    </AbsoluteFill>
  );
};
