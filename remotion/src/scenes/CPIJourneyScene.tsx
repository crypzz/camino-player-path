import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

const milestones = [
  { month: "Sep", score: 45, color: "#2B7FE8" },
  { month: "Dec", score: 62, color: "#2B9FD8" },
  { month: "Mar", score: 73, color: "#1DB870" },
  { month: "Jun", score: 81, color: "#1DB870" },
];

export const CPIJourneyScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ringRadius = 150;
  const circumference = 2 * Math.PI * ringRadius;

  // Score animates through milestones
  const scoreProgress = interpolate(frame, [5, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const currentScore = Math.round(interpolate(scoreProgress, [0, 0.25, 0.5, 0.75, 1], [45, 45, 62, 73, 81]));
  const ringFill = currentScore / 100;

  // Color interpolation via milestone index
  const milestoneIdx = Math.min(3, Math.floor(scoreProgress * 4));
  const ringColor = milestones[milestoneIdx].color;

  const scoreOpacity = interpolate(frame, [10, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "Watch yourself grow" label
  const labelSpring = spring({ frame: frame - 95, fps, config: { damping: 20 } });
  const labelOpacity = interpolate(labelSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      {/* CPI Ring */}
      <div style={{ position: "relative", width: 340, height: 340 }}>
        <svg width={340} height={340} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={170} cy={170} r={ringRadius} fill="none" stroke="#1E2430" strokeWidth={10} />
          <circle cx={170} cy={170} r={ringRadius} fill="none" stroke={ringColor} strokeWidth={10}
            strokeLinecap="round" strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - ringFill)} />
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", opacity: scoreOpacity,
        }}>
          <div style={{ fontFamily: display, fontSize: 76, fontWeight: 800, color: ringColor, letterSpacing: "-0.03em" }}>
            {currentScore}
          </div>
          <div style={{ fontFamily: body, fontSize: 14, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.2em" }}>
            CPI Score
          </div>
        </div>
      </div>

      {/* Month timeline */}
      <div style={{
        display: "flex", gap: 24, position: "absolute", top: "66%", justifyContent: "center",
      }}>
        {milestones.map((m, i) => {
          const active = scoreProgress >= i * 0.25;
          const s = spring({ frame: frame - 20 - i * 15, fps, config: { damping: 14, stiffness: 200 } });
          const o = interpolate(s, [0, 1], [0, 1]);
          const sc = interpolate(s, [0, 1], [0.5, 1]);
          return (
            <div key={i} style={{
              textAlign: "center", opacity: o, transform: `scale(${sc})`,
              backgroundColor: "#141821", borderRadius: 12, padding: "14px 20px",
              border: `1px solid ${active ? m.color : "#1E2430"}`, minWidth: 80,
            }}>
              <div style={{ fontFamily: display, fontSize: 24, fontWeight: 800, color: active ? m.color : "#4B5563" }}>
                {m.score}
              </div>
              <div style={{ fontFamily: body, fontSize: 11, color: "#6B7280", marginTop: 4 }}>
                {m.month}
              </div>
            </div>
          );
        })}
      </div>

      {/* Label */}
      <div style={{
        position: "absolute", bottom: 200, width: "100%", textAlign: "center", opacity: labelOpacity,
      }}>
        <div style={{ fontFamily: display, fontSize: 32, fontWeight: 700, color: "#F5F5F5" }}>
          Watch yourself grow.
        </div>
      </div>
    </AbsoluteFill>
  );
};
