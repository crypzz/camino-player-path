import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });

const Stat = ({ text, gold = false, prefix }: { text: string; gold?: boolean; prefix?: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
  const scale = interpolate(s, [0, 1], [0.6, 1]);
  const opacity = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  const exitO = interpolate(frame, [50, 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(frame, [0, 2, 5], [1, 0.5, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 100px" }}>
      <div style={{
        transform: `scale(${scale})`, opacity: opacity * exitO, textAlign: "center",
      }}>
        {prefix && (
          <div style={{
            fontFamily, fontSize: 36, fontWeight: 700, color: "#8B92A3",
            letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 24,
          }}>
            {prefix}
          </div>
        )}
        <div style={{
          fontFamily, fontSize: 180, fontWeight: 800,
          color: gold ? "#E8B400" : "#FFFFFF",
          letterSpacing: "-0.04em", lineHeight: 0.95,
          textShadow: gold ? "0 0 60px rgba(232,180,0,0.4)" : "none",
        }}>
          {text}
        </div>
      </div>
      <div style={{
        position: "absolute", inset: 0, background: "#FFFFFF",
        opacity: flash * 0.3, pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

export const ColdOpenScene = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
      <Sequence from={0} durationInFrames={60}>
        <Stat text="100,000,000" prefix="Kids play soccer" />
      </Sequence>
      <Sequence from={60} durationInFrames={60}>
        <Stat text="1 in 10,000" prefix="Ever gets" gold />
      </Sequence>
    </AbsoluteFill>
  );
};
