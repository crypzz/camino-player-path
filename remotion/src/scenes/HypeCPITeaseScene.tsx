import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

export const HypeCPITeaseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CPI number counting up
  const countEnd = Math.min(frame * 1.2, 92);
  const displayNum = Math.round(interpolate(frame, [10, 80], [0, 92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // Scale in
  const s = spring({ frame: frame - 5, fps, config: { damping: 12, stiffness: 150 } });
  const scale = interpolate(s, [0, 1], [0.3, 1]);

  // Ring progress
  const circumference = 2 * Math.PI * 180;
  const progress = interpolate(frame, [10, 80], [circumference, circumference * 0.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Glow pulse after counter reaches target
  const glowOpacity = frame > 80
    ? 0.3 + Math.sin((frame - 80) * 0.15) * 0.2
    : interpolate(frame, [10, 80], [0, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Label
  const labelO = interpolate(frame, [85, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelS = spring({ frame: frame - 85, fps, config: { damping: 15 } });
  const labelY = interpolate(labelS, [0, 1], [30, 0]);

  const fadeOut = interpolate(frame, [115, 130], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      {/* Radial glow */}
      <div style={{
        position: "absolute",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,180,0,0.15) 0%, transparent 70%)",
        opacity: glowOpacity * fadeOut,
        transform: `scale(${1 + Math.sin(frame * 0.08) * 0.05})`,
      }} />

      <div style={{ opacity: fadeOut, transform: `scale(${scale})`, textAlign: "center" }}>
        {/* Progress ring */}
        <svg width={400} height={400} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-90deg)" }}>
          <circle cx={200} cy={200} r={180} fill="none" stroke="rgba(232,180,0,0.1)" strokeWidth={6} />
          <circle cx={200} cy={200} r={180} fill="none" stroke="#E8B400" strokeWidth={6}
            strokeDasharray={circumference} strokeDashoffset={progress}
            strokeLinecap="round"
          />
        </svg>

        {/* Score */}
        <div style={{
          fontFamily, fontSize: 160, fontWeight: 800,
          color: "#E8B400", lineHeight: 1,
        }}>
          {displayNum}
        </div>
        <div style={{
          fontFamily, fontSize: 36, fontWeight: 700,
          color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", marginTop: 10,
        }}>
          CPI SCORE
        </div>

        {/* Label */}
        <div style={{
          fontFamily, fontSize: 48, fontWeight: 800,
          color: "#FFFFFF", marginTop: 80,
          opacity: labelO, transform: `translateY(${labelY}px)`,
        }}>
          One number.<br />All your game.
        </div>
      </div>
    </AbsoluteFill>
  );
};
