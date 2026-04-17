import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

const logos = [
  { name: "Veo", color: "#FF6B00", x: -280, y: -360 },
  { name: "TeamSnap", color: "#0066CC", x: 280, y: -360 },
  { name: "Hudl", color: "#FF6600", x: -280, y: 360 },
  { name: "Sheets", color: "#16A34A", x: 280, y: 360 },
];

export const MergeScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 0-50: logos sit at corners
  // 50-80: pull to center
  // 80-95: burst flash
  // 95-130: Camino logo reveal + text
  const pull = spring({ frame: frame - 50, fps, config: { damping: 14, stiffness: 90 } });
  const burst = interpolate(frame, [78, 92, 110], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const burstScale = interpolate(frame, [78, 95], [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const caminoS = spring({ frame: frame - 88, fps, config: { damping: 12, stiffness: 140 } });
  const tagS = spring({ frame: frame - 108, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at center, #1A1F2C 0%, #0D1117 70%)", fontFamily: body }}>
      {/* Floating logos */}
      {logos.map((l, i) => {
        const x = interpolate(pull, [0, 1], [l.x, 0]);
        const y = interpolate(pull, [0, 1], [l.y, 0]);
        const scale = interpolate(pull, [0, 0.7, 1], [1, 1.1, 0.1]);
        const opacity = interpolate(frame, [0, 10, 75, 88], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const float = Math.sin((frame + i * 12) / 14) * 12 * (1 - pull);
        return (
          <div key={l.name} style={{
            position: "absolute", top: "50%", left: "50%",
            transform: `translate(-50%, -50%) translate(${x}px, ${y + float}px) scale(${scale})`,
            opacity,
          }}>
            <div style={{
              padding: "28px 48px", background: l.color, borderRadius: 24,
              fontFamily: display, fontWeight: 800, fontSize: 56, color: "#fff",
              boxShadow: `0 20px 60px ${l.color}80`,
            }}>{l.name}</div>
          </div>
        );
      })}

      {/* Burst flash */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: 300, height: 300, borderRadius: "50%",
        background: "radial-gradient(circle, #E8B400 0%, transparent 60%)",
        transform: `translate(-50%, -50%) scale(${burstScale})`,
        opacity: burst,
        filter: "blur(20px)",
      }} />

      {/* Camino logo reveal */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 220, color: "#fff",
          letterSpacing: -4, lineHeight: 1,
          transform: `scale(${interpolate(caminoS, [0, 1], [0.4, 1])})`,
          opacity: caminoS,
          textShadow: "0 0 80px rgba(232,180,0,0.5)",
        }}>
          Camino
        </div>
        <div style={{
          marginTop: 30, fontFamily: body, fontWeight: 600, fontSize: 42, color: "#E8B400",
          letterSpacing: 6, textTransform: "uppercase",
          transform: `translateY(${interpolate(tagS, [0, 1], [30, 0])}px)`,
          opacity: tagS,
        }}>
          One App. All In.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
