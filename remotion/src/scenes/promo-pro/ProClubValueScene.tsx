import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

const benefits = [
  { icon: "📈", title: "Track Development", desc: "Monitor player progress with structured data and evaluations." },
  { icon: "🎥", title: "Organize Footage", desc: "Central hub for all match and training videos." },
  { icon: "👤", title: "Player Profiles", desc: "Give athletes professional profiles to share with scouts." },
  { icon: "🏆", title: "Showcase Talent", desc: "Help players be seen beyond the local field." },
];

export const ProClubValueScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [270, 300], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(150deg, #0D1117 0%, #111827 100%)",
      justifyContent: "center", alignItems: "center",
    }}>
      <div style={{ opacity: fadeOut, display: "flex", gap: 80, alignItems: "center", padding: "0 100px" }}>
        {/* Left: heading */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: body, fontSize: 14, fontWeight: 500,
            color: "#6B7280", letterSpacing: "0.15em", textTransform: "uppercase",
            marginBottom: 20,
            opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            For Clubs & Academies
          </div>
          <div style={{
            fontFamily: display, fontSize: 46, fontWeight: 800,
            color: "#F5F5F5", lineHeight: 1.25, letterSpacing: "-0.02em",
            opacity: interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [10, 35], [25, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          }}>
            Support player development while giving athletes the tools to be seen.
          </div>
        </div>

        {/* Right: benefit cards */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {benefits.map((b, i) => {
            const delay = 25 + i * 22;
            const s = spring({ frame: frame - delay, fps, config: { damping: 25, stiffness: 140 } });
            const x = interpolate(s, [0, 1], [50, 0]);
            const o = interpolate(s, [0, 1], [0, 1]);

            return (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 16,
                backgroundColor: "#141B2D",
                border: "1px solid #1E293B",
                borderRadius: 12,
                padding: "18px 20px",
                opacity: o,
                transform: `translateX(${x}px)`,
              }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{b.icon}</div>
                <div>
                  <div style={{ fontFamily: display, fontSize: 16, fontWeight: 700, color: "#F5F5F5", marginBottom: 4 }}>{b.title}</div>
                  <div style={{ fontFamily: body, fontSize: 13, fontWeight: 400, color: "#9CA3AF", lineHeight: 1.5 }}>{b.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
