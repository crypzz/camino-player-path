import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/BebasNeue";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });

export const GoProHookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "YOU WANT TO" fades in first
  const line1O = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const line1Y = interpolate(frame, [0, 8], [40, 0], { extrapolateRight: "clamp" });

  // "GO PRO?" slams in with spring
  const s = spring({ frame: frame - 12, fps, config: { damping: 8, stiffness: 220 } });
  const proScale = interpolate(s, [0, 1], [5, 1]);
  const proO = interpolate(frame, [12, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Screen shake after slam
  const shakeX = frame > 18 && frame < 30
    ? Math.sin(frame * 14) * interpolate(frame, [18, 30], [10, 0], { extrapolateRight: "clamp" })
    : 0;
  const shakeY = frame > 18 && frame < 30
    ? Math.cos(frame * 11) * interpolate(frame, [18, 30], [6, 0], { extrapolateRight: "clamp" })
    : 0;

  // Gold underline wipe
  const lineW = interpolate(frame, [25, 45], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fade out
  const fadeOut = interpolate(frame, [75, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0E1A", justifyContent: "center", alignItems: "center" }}>
      <div style={{
        opacity: fadeOut,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
        textAlign: "center",
        padding: "0 60px",
      }}>
        <div style={{
          fontFamily, fontSize: 72, color: "#FFFFFF",
          letterSpacing: "0.08em", lineHeight: 1,
          opacity: line1O,
          transform: `translateY(${line1Y}px)`,
        }}>
          YOU WANT TO
        </div>
        <div style={{
          fontFamily, fontSize: 160, color: "#E8B400",
          letterSpacing: "0.04em", lineHeight: 1, marginTop: 10,
          opacity: proO,
          transform: `scale(${proScale})`,
        }}>
          GO PRO?
        </div>
        {/* Gold underline */}
        <div style={{
          width: `${lineW}%`, height: 4,
          backgroundColor: "#E8B400",
          margin: "20px auto 0",
          borderRadius: 2,
        }} />
      </div>
    </AbsoluteFill>
  );
};
