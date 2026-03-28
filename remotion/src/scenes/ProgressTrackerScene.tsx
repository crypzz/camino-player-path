import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

const dataPoints = [
  { month: "Sep", score: 58 },
  { month: "Oct", score: 61 },
  { month: "Nov", score: 64 },
  { month: "Jan", score: 67 },
  { month: "Mar", score: 71 },
  { month: "Jun", score: 74 },
];

export const ProgressTrackerScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chartW = 750;
  const chartH = 300;
  const padX = 60;
  const padY = 40;

  const minScore = 50;
  const maxScore = 80;

  const toX = (i: number) => padX + (i / (dataPoints.length - 1)) * (chartW - padX * 2);
  const toY = (score: number) => padY + (1 - (score - minScore) / (maxScore - minScore)) * (chartH - padY * 2);

  // Draw progress
  const drawProgress = interpolate(frame, [5, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Build path
  const pathPoints = dataPoints.map((d, i) => `${toX(i)},${toY(d.score)}`);
  const pathD = `M ${pathPoints.join(" L ")}`;

  // Approximate total path length
  let totalLen = 0;
  for (let i = 1; i < dataPoints.length; i++) {
    const dx = toX(i) - toX(i - 1);
    const dy = toY(dataPoints[i].score) - toY(dataPoints[i - 1].score);
    totalLen += Math.sqrt(dx * dx + dy * dy);
  }

  const dashOffset = totalLen * (1 - drawProgress);

  // Score counter
  const currentScore = Math.round(interpolate(frame, [5, 55], [58, 74], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  // Score display
  const scoreSpring = spring({ frame: frame - 10, fps, config: { damping: 20 } });
  const scoreOpacity = interpolate(scoreSpring, [0, 1], [0, 1]);

  // Label
  const labelSpring = spring({ frame: frame - 55, fps, config: { damping: 20 } });
  const labelOpacity = interpolate(labelSpring, [0, 1], [0, 1]);

  // Fade out
  const fadeOut = interpolate(frame, [75, 88], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Chart opacity
  const chartOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut }}>
        {/* Score */}
        <div style={{
          textAlign: "center",
          marginBottom: 40,
          opacity: scoreOpacity,
        }}>
          <div style={{ fontFamily, fontSize: 90, fontWeight: 800, color: "#1DB870", letterSpacing: "-0.03em" }}>
            {currentScore}
          </div>
          <div style={{ fontFamily: bodyFont, fontSize: 28, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginTop: -5 }}>
            CPI Score
          </div>
        </div>

        {/* Chart */}
        <div style={{ opacity: chartOpacity }}>
          <svg width={chartW} height={chartH} viewBox={`0 0 ${chartW} ${chartH}`}>
            {/* Grid lines */}
            {[55, 60, 65, 70, 75].map((v) => (
              <line
                key={v}
                x1={padX}
                x2={chartW - padX}
                y1={toY(v)}
                y2={toY(v)}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
            ))}

            {/* Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#1DB870"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={totalLen}
              strokeDashoffset={dashOffset}
            />

            {/* Dots */}
            {dataPoints.map((d, i) => {
              const dotProgress = interpolate(frame, [5 + i * 8, 10 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <circle
                  key={i}
                  cx={toX(i)}
                  cy={toY(d.score)}
                  r={6 * dotProgress}
                  fill="#1DB870"
                  opacity={dotProgress}
                />
              );
            })}
          </svg>

          {/* Month labels */}
          <div style={{ display: "flex", justifyContent: "space-between", width: chartW - padX * 2, marginLeft: padX, marginTop: 8 }}>
            {dataPoints.map((d, i) => (
              <span key={i} style={{ fontFamily: bodyFont, fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>
                {d.month}
              </span>
            ))}
          </div>
        </div>

        {/* Label */}
        <div style={{
          textAlign: "center",
          marginTop: 50,
          fontFamily,
          fontSize: 44,
          fontWeight: 800,
          color: "#FFFFFF",
          opacity: labelOpacity,
          letterSpacing: "-0.02em",
        }}>
          Every gain. <span style={{ color: "#1DB870" }}>Tracked.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
