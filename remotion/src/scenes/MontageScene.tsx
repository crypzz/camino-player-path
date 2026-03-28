import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

const screens = [
  {
    title: "Evaluations",
    subtitle: "Rate every metric. See the impact instantly.",
    items: [
      { label: "Ball Control", value: "8.2", color: "#1DB870" },
      { label: "Positioning", value: "7.1", color: "#2B7FE8" },
      { label: "Sprint Speed", value: "8.8", color: "#E8B400" },
    ],
  },
  {
    title: "Progress",
    subtitle: "Track growth over time with CPI trends.",
    items: [
      { label: "Jan", value: "64", color: "#6B7280" },
      { label: "Mar", value: "69", color: "#E8B400" },
      { label: "Jun", value: "73", color: "#1DB870" },
    ],
  },
  {
    title: "Attendance",
    subtitle: "Session tracking across all activities.",
    items: [
      { label: "Training", value: "94%", color: "#2B7FE8" },
      { label: "Match", value: "100%", color: "#1DB870" },
      { label: "Fitness", value: "87%", color: "#E8B400" },
    ],
  },
];

export const MontageScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14" }}>
      {screens.map((screen, idx) => {
        const startFrame = idx * 35;
        const localFrame = frame - startFrame;

        const enterSpring = spring({ frame: localFrame, fps, config: { damping: 18, stiffness: 140 } });
        const y = interpolate(enterSpring, [0, 1], [300, 0]);
        const opacity = interpolate(enterSpring, [0, 1], [0, 1]);

        // Fade out previous
        const exitOpacity = idx < 2
          ? interpolate(frame, [startFrame + 30, startFrame + 38], [1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : 1;

        const finalOpacity = opacity * exitOpacity;

        return (
          <div key={idx} style={{
            position: "absolute",
            top: 250 + idx * 20,
            left: 60,
            right: 60,
            opacity: finalOpacity,
            transform: `translateY(${y}px)`,
          }}>
            {/* Phone mockup frame */}
            <div style={{
              backgroundColor: "#141821",
              borderRadius: 24,
              border: "2px solid #1E2430",
              padding: "40px 30px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}>
              <div style={{ fontFamily: display, fontSize: 32, fontWeight: 800, color: "#F5F5F5", marginBottom: 8 }}>
                {screen.title}
              </div>
              <div style={{ fontFamily: body, fontSize: 16, color: "#6B7280", marginBottom: 30 }}>
                {screen.subtitle}
              </div>

              {screen.items.map((item, j) => {
                const itemSpring = spring({ frame: localFrame - 10 - j * 6, fps, config: { damping: 16 } });
                const itemX = interpolate(itemSpring, [0, 1], [50, 0]);
                const itemO = interpolate(itemSpring, [0, 1], [0, 1]);
                return (
                  <div key={j} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#0D0F14",
                    borderRadius: 10,
                    padding: "16px 20px",
                    marginBottom: 10,
                    opacity: itemO,
                    transform: `translateX(${itemX}px)`,
                  }}>
                    <div style={{ fontFamily: body, fontSize: 16, fontWeight: 500, color: "#F5F5F5" }}>{item.label}</div>
                    <div style={{ fontFamily: display, fontSize: 24, fontWeight: 800, color: item.color }}>{item.value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
