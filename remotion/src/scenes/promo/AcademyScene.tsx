import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Oswald";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: body } = loadBody("normal", { weights: ["500"], subsets: ["latin"] });

export const AcademyScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Don't just train players."
  const line1Delay = 10;
  const l1S = spring({ frame: frame - line1Delay, fps, config: { damping: 20, stiffness: 140 } });
  const l1Y = interpolate(l1S, [0, 1], [40, 0]);
  const l1O = interpolate(frame, [line1Delay, line1Delay + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "Build their future."
  const line2Delay = 50;
  const l2S = spring({ frame: frame - line2Delay, fps, config: { damping: 12, stiffness: 180 } });
  const l2Scale = interpolate(l2S, [0, 1], [1.6, 1]);
  const l2O = interpolate(frame, [line2Delay, line2Delay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Shake on "Build"
  const shake = frame > line2Delay + 8 && frame < line2Delay + 20
    ? Math.sin(frame * 10) * interpolate(frame, [line2Delay + 8, line2Delay + 20], [5, 0], { extrapolateRight: "clamp" })
    : 0;

  // Gold arc
  const arcProgress = interpolate(frame, [line2Delay + 15, line2Delay + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const circumference = 2 * Math.PI * 120;

  const fadeOut = interpolate(frame, [100, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C10" }}>
      {/* Subtle gold glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 50%, rgba(232,180,0,0.05) 0%, transparent 50%)",
      }} />

      {/* Arc */}
      <svg style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        opacity: 0.2 * fadeOut,
      }} width={280} height={280}>
        <circle
          cx={140} cy={140} r={120}
          fill="none" stroke="#E8B400" strokeWidth={2}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - arcProgress)}
          strokeLinecap="round"
          transform="rotate(-90 140 140)"
        />
      </svg>

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "0 70px", opacity: fadeOut,
        transform: `translateX(${shake}px)`,
      }}>
        <div style={{
          fontFamily: display, fontSize: 68, fontWeight: 700,
          color: "#D4D0C8", textTransform: "uppercase",
          textAlign: "center", lineHeight: 1.2,
          letterSpacing: "0.02em",
          opacity: l1O, transform: `translateY(${l1Y}px)`,
          marginBottom: 30,
        }}>
          Don't just train players.
        </div>

        <div style={{
          fontFamily: display, fontSize: 80, fontWeight: 700,
          color: "#E8B400", textTransform: "uppercase",
          textAlign: "center", lineHeight: 1.1,
          letterSpacing: "0.03em",
          opacity: l2O, transform: `scale(${l2Scale})`,
          textShadow: "0 0 40px rgba(232,180,0,0.25)",
        }}>
          Build their future.
        </div>
      </div>
    </AbsoluteFill>
  );
};
