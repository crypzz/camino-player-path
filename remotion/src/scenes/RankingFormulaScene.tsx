import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const bars = [
  { label: "CPI", pct: 60, color: "#E8B400", delay: 15 },
  { label: "Consistency", pct: 20, color: "#1DB870", delay: 35 },
  { label: "Improvement", pct: 20, color: "#2B7FE8", delay: 55 },
];

export const RankingFormulaScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 160 } });
  const titleOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const titleScale = interpolate(titleSpring, [0, 1], [0.8, 1]);

  // Score counter
  const scoreSpring = spring({ frame: frame - 70, fps, config: { damping: 18 } });
  const scoreVal = Math.round(interpolate(scoreSpring, [0, 1], [0, 82]));

  // Label
  const labelSpring = spring({ frame: frame - 90, fps, config: { damping: 20 } });

  // Fade out
  const fadeOut = interpolate(frame, [115, 128], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut, width: 850, padding: "0 60px" }}>
        {/* Title */}
        <div style={{
          fontFamily, fontSize: 48, fontWeight: 800, color: "#FFFFFF",
          textAlign: "center", marginBottom: 60,
          opacity: titleOpacity, transform: `scale(${titleScale})`,
          letterSpacing: "-0.03em",
        }}>
          Ranking <span style={{ color: "#E8B400" }}>Formula</span>
        </div>

        {/* Bars */}
        {bars.map((bar, i) => {
          const barSpring = spring({ frame: frame - bar.delay, fps, config: { damping: 18, stiffness: 100 } });
          const barWidth = interpolate(barSpring, [0, 1], [0, bar.pct]);
          const rowOpacity = interpolate(frame, [bar.delay, bar.delay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

          return (
            <div key={i} style={{ marginBottom: 36, opacity: rowOpacity }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 12,
              }}>
                <span style={{ fontFamily: bodyFont, fontSize: 26, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                  {bar.label}
                </span>
                <span style={{ fontFamily, fontSize: 28, fontWeight: 800, color: bar.color }}>
                  {Math.round(barWidth)}%
                </span>
              </div>
              <div style={{
                width: "100%", height: 22, borderRadius: 100,
                background: "rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}>
                <div style={{
                  width: `${barWidth}%`, height: "100%", borderRadius: 100,
                  backgroundColor: bar.color,
                }} />
              </div>
            </div>
          );
        })}

        {/* Combined score */}
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <div style={{ fontFamily, fontSize: 80, fontWeight: 800, color: "#E8B400" }}>
            {scoreVal}
          </div>
          <div style={{ fontFamily: bodyFont, fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.35)" }}>
            Ranking Score
          </div>
        </div>

        {/* Label */}
        <div style={{
          textAlign: "center", marginTop: 40,
          opacity: interpolate(labelSpring, [0, 1], [0, 1]),
          fontFamily, fontSize: 38, fontWeight: 800, color: "rgba(255,255,255,0.7)",
          letterSpacing: "-0.02em",
        }}>
          Ranked by <span style={{ color: "#E8B400" }}>what matters.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
