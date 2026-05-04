import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { display, body, GOLD, IVORY, NAVY, NAVY_2, GoldChip } from "./_shared";

const DUR = 120;

const teams = [
  { rank: 1, name: "Foothills SC U15", pts: 28, gd: 18 },
  { rank: 2, name: "Calgary Villains", pts: 27, gd: 14 },
  { rank: 3, name: "Cavalry FC Academy", pts: 26, gd: 11 },
  { rank: 4, name: "Calgary Blizzard", pts: 25, gd: 9 },
  { rank: 5, name: "SW United", pts: 19, gd: -2 },
];

export const ESCHookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame: frame - 4, fps, config: { damping: 20 } });
  const titleO = interpolate(titleS, [0, 1], [0, 1]);
  const titleY = interpolate(titleS, [0, 1], [30, 0]);

  const chipS = spring({ frame: frame - 1, fps, config: { damping: 18 } });
  const chipO = interpolate(chipS, [0, 1], [0, 1]);

  // pulsing cut line between rank 4 and 5
  const pulse = 0.5 + 0.5 * Math.sin((frame - 50) / 6);
  const cutOpacity = interpolate(frame, [55, 70], [0, 1], { extrapolateRight: "clamp" });

  const fadeOut = interpolate(frame, [DUR - 12, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, opacity: fadeOut }}>
      {/* radial spotlight */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 35%, rgba(232,180,0,0.10) 0%, rgba(10,12,18,0) 55%)` }} />

      <AbsoluteFill style={{ padding: "140px 60px 80px", flexDirection: "column", alignItems: "center" }}>
        <div style={{ opacity: chipO, marginBottom: 24 }}>
          <GoldChip>LIVE STANDINGS</GoldChip>
        </div>
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 96, lineHeight: 0.95,
          color: IVORY, textAlign: "center", letterSpacing: "-0.04em",
          opacity: titleO, transform: `translateY(${titleY}px)`,
        }}>
          Every spot<br /><span style={{ color: GOLD }}>counts.</span>
        </div>

        {/* faux standings table */}
        <div style={{ marginTop: 60, width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          {teams.map((t, i) => {
            const rowS = spring({ frame: frame - 24 - i * 6, fps, config: { damping: 22 } });
            const o = interpolate(rowS, [0, 1], [0, 1]);
            const x = interpolate(rowS, [0, 1], [60, 0]);
            const isTop = t.rank <= 4;
            return (
              <div key={t.rank} style={{
                opacity: o, transform: `translateX(${x}px)`,
                display: "grid", gridTemplateColumns: "70px 1fr 100px 100px",
                alignItems: "center", gap: 16,
                padding: "22px 26px",
                background: isTop ? "rgba(232,180,0,0.06)" : NAVY_2,
                border: `1px solid ${isTop ? "rgba(232,180,0,0.3)" : "rgba(245,245,245,0.06)"}`,
                borderRadius: 14,
              }}>
                <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: isTop ? GOLD : "rgba(245,245,245,0.5)" }}>
                  {String(t.rank).padStart(2, "0")}
                </div>
                <div style={{ fontFamily: body, fontWeight: 600, fontSize: 26, color: IVORY }}>{t.name}</div>
                <div style={{ fontFamily: body, fontSize: 22, color: "rgba(245,245,245,0.6)", textAlign: "right" }}>
                  GD <span style={{ color: t.gd > 0 ? "#4ade80" : "#f87171", fontWeight: 700 }}>{t.gd > 0 ? "+" : ""}{t.gd}</span>
                </div>
                <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: IVORY, textAlign: "right" }}>{t.pts}</div>
              </div>
            );
          })}
        </div>

        {/* the cut line */}
        <div style={{
          position: "relative", width: "100%", height: 0, marginTop: -56,
          opacity: cutOpacity,
        }}>
          <div style={{
            position: "absolute", left: -10, right: -10, top: -8,
            height: 3, background: GOLD,
            boxShadow: `0 0 ${12 + pulse * 18}px rgba(232,180,0,${0.4 + pulse * 0.5})`,
            borderRadius: 2,
          }} />
          <div style={{
            position: "absolute", right: 0, top: -50,
            fontFamily: body, fontWeight: 700, fontSize: 18, letterSpacing: 3,
            color: GOLD, textTransform: "uppercase",
          }}>
            playoff cut
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
