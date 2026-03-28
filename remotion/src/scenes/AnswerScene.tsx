import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const AnswerScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 160 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.3, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  const textSpring = spring({ frame: frame - 30, fps, config: { damping: 20, stiffness: 180 } });
  const textY = interpolate(textSpring, [0, 1], [40, 0]);
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);

  // Gold arc
  const arcProgress = interpolate(frame, [15, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const circumference = 2 * Math.PI * 180;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <svg width={400} height={400} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <circle cx={200} cy={200} r={180} fill="none" stroke="#E8B400" strokeWidth={2}
          strokeLinecap="round" strokeDasharray={circumference}
          strokeDashoffset={(1 - arcProgress) * circumference} opacity={0.4} />
      </svg>

      <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})`, textAlign: "center" }}>
        <div style={{ fontFamily, fontSize: 100, fontWeight: 800, color: "#E8B400", letterSpacing: "-0.04em" }}>
          Camino
        </div>
      </div>

      <div style={{
        position: "absolute", top: "58%", width: "100%", textAlign: "center",
        opacity: textOpacity, transform: `translateY(${textY}px)`,
      }}>
        <div style={{ fontFamily, fontSize: 30, fontWeight: 700, color: "#F5F5F5", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Your digital development passport
        </div>
      </div>
    </AbsoluteFill>
  );
};
