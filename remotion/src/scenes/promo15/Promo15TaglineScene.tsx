import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });

const Word = ({ text, gold = false }: { text: string; gold?: boolean }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 10, stiffness: 220 } });
  const scale = interpolate(s, [0, 1], [2.4, 1]);
  const o = interpolate(frame, [0, 3], [0, 1], { extrapolateRight: "clamp" });
  const flash = interpolate(frame, [0, 2, 4], [0, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtle breathing after settle
  const breathe = frame > 10 ? 1 + Math.sin((frame - 10) * 0.15) * 0.008 : 1;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{
        opacity: o,
        transform: `scale(${scale * breathe})`,
        textAlign: "center",
      }}>
        <div style={{
          fontFamily, fontSize: 200, fontWeight: 800,
          color: gold ? "#E8B400" : "#FFFFFF",
          letterSpacing: "-0.05em",
          textShadow: gold ? "0 0 60px rgba(232,180,0,0.5)" : "none",
        }}>
          {text}
        </div>
        {gold && (
          <div style={{
            width: interpolate(frame, [4, 20], [0, 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            height: 8, backgroundColor: "#E8B400",
            margin: "16px auto 0", borderRadius: 4,
            boxShadow: "0 0 24px rgba(232,180,0,0.7)",
          }} />
        )}
      </div>
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: "#FFFFFF",
        opacity: flash, pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

export const Promo15TaglineScene = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
      {/* gold ambient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 50%, rgba(232,180,0,0.08) 0%, transparent 60%)",
      }} />
      <Sequence from={0} durationInFrames={30}><Word text="TRACKED." /></Sequence>
      <Sequence from={30} durationInFrames={30}><Word text="RANKED." /></Sequence>
      <Sequence from={60} durationInFrames={30}><Word text="SEEN." gold /></Sequence>
    </AbsoluteFill>
  );
};
