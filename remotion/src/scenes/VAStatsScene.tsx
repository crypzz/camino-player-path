import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: bebas } = loadFont();
const { fontFamily: inter } = loadInter();

const BG = "#0A0E1A";
const GOLD = "#E8B400";
const BLUE = "#2B7FE8";
const GREEN = "#1DB870";
const CARD_BG = "#111827";

const STATS = [
  { label: "Touches", value: 47, color: BLUE },
  { label: "Passes", value: 32, color: GREEN },
  { label: "Goals", value: 3, color: GOLD },
  { label: "Tackles", value: 12, color: "#A855F7" },
];

const BAR_DATA = [
  { label: "Carlos", value: 47, color: BLUE },
  { label: "Diego", value: 38, color: GREEN },
  { label: "Mateo", value: 29, color: GOLD },
  { label: "Luis", value: 22, color: "#A855F7" },
];

export const VAStatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [85, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(spring({ frame: frame - 85, fps, config: { damping: 16 } }), [0, 1], [30, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, gap: 36 }}>
        {/* Stat cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, width: 700 }}>
          {STATS.map((stat, i) => {
            const delay = 5 + i * 10;
            const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 160 } });
            const scale = interpolate(s, [0, 1], [0.6, 1]);
            const op = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateRight: "clamp" });
            const countUp = Math.round(interpolate(frame, [delay + 5, delay + 35], [0, stat.value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
            return (
              <div key={stat.label} style={{
                backgroundColor: CARD_BG, borderRadius: 16, padding: "28px 24px",
                border: `1px solid ${stat.color}33`,
                transform: `scale(${scale})`, opacity: op,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              }}>
                <div style={{ fontFamily: inter, fontSize: 18, color: "#9CA3AF", fontWeight: 500 }}>{stat.label}</div>
                <div style={{ fontFamily: bebas, fontSize: 72, color: stat.color, lineHeight: 1 }}>{countUp}</div>
              </div>
            );
          })}
        </div>

        {/* Bar chart */}
        <div style={{
          width: 700, backgroundColor: CARD_BG, borderRadius: 16, padding: 28,
          border: "1px solid #1F2937",
          opacity: interpolate(frame, [50, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ fontFamily: inter, fontSize: 16, color: "#6B7280", marginBottom: 16 }}>Events by Player</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {BAR_DATA.map((bar, i) => {
              const barDelay = 55 + i * 8;
              const barW = interpolate(
                spring({ frame: frame - barDelay, fps, config: { damping: 18, stiffness: 100 } }),
                [0, 1], [0, (bar.value / 50) * 100]
              );
              return (
                <div key={bar.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontFamily: inter, fontSize: 16, color: "#9CA3AF", width: 70, textAlign: "right" }}>{bar.label}</div>
                  <div style={{ flex: 1, height: 24, backgroundColor: "#1F2937", borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ width: `${barW}%`, height: "100%", backgroundColor: bar.color, borderRadius: 6 }} />
                  </div>
                  <div style={{ fontFamily: inter, fontSize: 16, color: "white", fontWeight: 600, width: 30 }}>{bar.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{
          fontFamily: bebas, fontSize: 56, color: GOLD, letterSpacing: 4,
          opacity: titleOp, transform: `translateY(${titleY}px)`,
        }}>
          STATS THAT WRITE THEMSELVES.
        </div>
      </div>
    </AbsoluteFill>
  );
};
