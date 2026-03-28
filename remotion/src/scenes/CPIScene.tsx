import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

const categories = [
  { label: "TEC", value: "7.5", color: "#1DB870" },
  { label: "TAC", value: "6.8", color: "#2B7FE8" },
  { label: "PHY", value: "7.8", color: "#E8B400" },
  { label: "MEN", value: "7.2", color: "#8B3FCC" },
];

export const CPIScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ringRadius = 160;
  const circumference = 2 * Math.PI * ringRadius;
  const targetScore = 73;

  const ringProgress = interpolate(frame, [5, 70], [0, targetScore / 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scoreNum = Math.round(ringProgress * 100);

  const scoreOpacity = interpolate(frame, [15, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      {/* CPI Ring */}
      <div style={{ position: "relative", width: 360, height: 360 }}>
        <svg width={360} height={360} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={180} cy={180} r={ringRadius} fill="none" stroke="#1E2430" strokeWidth={10} />
          <circle
            cx={180} cy={180} r={ringRadius}
            fill="none"
            stroke="#E8B400"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - ringProgress)}
          />
        </svg>
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          opacity: scoreOpacity,
        }}>
          <div style={{ fontFamily: display, fontSize: 80, fontWeight: 800, color: "#E8B400", letterSpacing: "-0.03em" }}>
            {scoreNum}
          </div>
          <div style={{ fontFamily: body, fontSize: 14, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.2em" }}>
            CPI Score
          </div>
        </div>
      </div>

      {/* Category labels */}
      <div style={{
        display: "flex",
        gap: 16,
        marginTop: 50,
        position: "absolute",
        top: "62%",
      }}>
        {categories.map((cat, i) => {
          const s = spring({ frame: frame - 40 - i * 8, fps, config: { damping: 14, stiffness: 200 } });
          const sc = interpolate(s, [0, 1], [0.5, 1]);
          const o = interpolate(s, [0, 1], [0, 1]);
          return (
            <div key={i} style={{
              backgroundColor: "#141821",
              borderRadius: 12,
              padding: "18px 22px",
              textAlign: "center",
              opacity: o,
              transform: `scale(${sc})`,
              border: "1px solid #1E2430",
              minWidth: 90,
            }}>
              <div style={{ fontFamily: display, fontSize: 28, fontWeight: 800, color: cat.color }}>{cat.value}</div>
              <div style={{ fontFamily: body, fontSize: 12, color: "#6B7280", marginTop: 4 }}>{cat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tag line */}
      <div style={{
        position: "absolute",
        bottom: 200,
        width: "100%",
        textAlign: "center",
        opacity: interpolate(
          spring({ frame: frame - 70, fps, config: { damping: 20 } }),
          [0, 1], [0, 1]
        ),
      }}>
        <div style={{ fontFamily: display, fontSize: 30, fontWeight: 700, color: "#F5F5F5" }}>
          One score. Total clarity.
        </div>
      </div>
    </AbsoluteFill>
  );
};
