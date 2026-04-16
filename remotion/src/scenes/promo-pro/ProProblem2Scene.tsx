import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

const items = [
  { icon: "📁", text: "Messy folders" },
  { icon: "🎬", text: "Inconsistent clips" },
  { icon: "📊", text: "No tracking" },
  { icon: "❌", text: "No structure" },
];

export const ProProblem2Scene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [210, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(160deg, #0A0E17 0%, #111827 100%)",
      justifyContent: "center", alignItems: "center",
    }}>
      <div style={{ opacity: fadeOut, display: "flex", gap: 60, alignItems: "center", padding: "0 100px" }}>
        {/* Left: text */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: body, fontSize: 14, fontWeight: 500,
            color: "#6B7280", letterSpacing: "0.15em", textTransform: "uppercase",
            marginBottom: 24,
            opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            For Coaches & Clubs
          </div>

          <div style={{
            fontFamily: display, fontSize: 44, fontWeight: 800,
            color: "#F5F5F5", lineHeight: 1.3, letterSpacing: "-0.02em",
            opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [10, 30], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          }}>
            Coaches lack simple tools to organize footage and track development.
          </div>
        </div>

        {/* Right: icon grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {items.map((item, i) => {
            const delay = 30 + i * 20;
            const s = spring({ frame: frame - delay, fps, config: { damping: 25, stiffness: 150 } });
            const sc = interpolate(s, [0, 1], [0.8, 1]);
            const o = interpolate(s, [0, 1], [0, 1]);

            return (
              <div key={i} style={{
                width: 180, height: 120,
                backgroundColor: "#141B2D",
                border: "1px solid #1E293B",
                borderRadius: 12,
                display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center", gap: 10,
                opacity: o, transform: `scale(${sc})`,
              }}>
                <div style={{ fontSize: 32 }}>{item.icon}</div>
                <div style={{ fontFamily: body, fontSize: 14, fontWeight: 500, color: "#9CA3AF" }}>{item.text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
