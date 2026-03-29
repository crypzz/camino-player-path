import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const tests = [
  { label: "10m Sprint", value: "1.82s", prev: "1.95s", fill: 0.88, color: "#E8B400", improved: true },
  { label: "Beep Test", value: "Lv 11.4", prev: "Lv 9.8", fill: 0.82, color: "#1DB870", improved: true },
  { label: "Vertical Jump", value: "48cm", prev: "42cm", fill: 0.75, color: "#2B7FE8", improved: true },
  { label: "Agility", value: "9.1s", prev: "10.3s", fill: 0.71, color: "#E85D2B", improved: true },
];

export const FitnessShowcaseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 160 } });
  const titleY = interpolate(titleSpring, [0, 1], [-80, 0]);
  const titleOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  // Card
  const cardSpring = spring({ frame: frame - 8, fps, config: { damping: 16, stiffness: 120 } });
  const cardScale = interpolate(cardSpring, [0, 1], [0.85, 1]);
  const cardOpacity = interpolate(frame, [8, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fade out
  const fadeOut = interpolate(frame, [110, 125], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut, width: 920, padding: "0 40px" }}>
        {/* Title */}
        <div style={{
          fontFamily, fontSize: 52, fontWeight: 800, color: "#E8B400",
          letterSpacing: "-0.03em", marginBottom: 16,
          opacity: titleOpacity, transform: `translateY(${titleY}px)`,
        }}>
          ⚡ Fitness Tests
        </div>
        <div style={{
          fontFamily: bodyFont, fontSize: 28, fontWeight: 500, color: "rgba(255,255,255,0.5)",
          marginBottom: 50, opacity: titleOpacity,
        }}>
          Real data. Real improvement. Auto-updates your CPI.
        </div>

        {/* Test Card */}
        <div style={{
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
          background: "linear-gradient(165deg, rgba(232,180,0,0.06) 0%, rgba(13,15,20,0.98) 100%)",
          border: "1px solid rgba(232,180,0,0.12)",
          borderRadius: 28, padding: "50px 45px",
        }}>
          {tests.map((test, i) => {
            const delay = 18 + i * 14;
            const barSpring = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 90 } });
            const barWidth = interpolate(barSpring, [0, 1], [0, test.fill * 100]);
            const itemOpacity = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const itemX = interpolate(barSpring, [0, 1], [40, 0]);

            const prevOpacity = interpolate(frame, [delay + 20, delay + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

            return (
              <div key={i} style={{ marginBottom: i < tests.length - 1 ? 36 : 0, opacity: itemOpacity, transform: `translateX(${itemX}px)` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <span style={{ fontFamily: bodyFont, fontSize: 28, fontWeight: 600, color: "#FFFFFF" }}>
                    {test.label}
                  </span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span style={{ fontFamily: bodyFont, fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.3)", textDecoration: "line-through", opacity: prevOpacity }}>
                      {test.prev}
                    </span>
                    <span style={{ fontFamily: bodyFont, fontSize: 32, fontWeight: 700, color: test.color }}>
                      {test.value}
                    </span>
                  </div>
                </div>
                <div style={{ width: "100%", height: 16, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{
                    width: `${barWidth}%`, height: "100%", borderRadius: 8,
                    background: `linear-gradient(90deg, ${test.color}, ${test.color}dd)`,
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom tag */}
        <div style={{
          fontFamily, fontSize: 36, fontWeight: 800, color: "#FFFFFF",
          textAlign: "center", marginTop: 50,
          opacity: interpolate(frame, [80, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * fadeOut,
          letterSpacing: "-0.02em",
        }}>
          Tracked. <span style={{ color: "#1DB870" }}>Improved.</span> Proven.
        </div>
      </div>
    </AbsoluteFill>
  );
};
