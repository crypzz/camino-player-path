import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { display, body, NAVY, NAVY_2, GOLD, IVORY, MUTED, TEAMS } from "./_shared";

export const StandingsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const header = spring({ frame, fps, config: { damping: 20, stiffness: 140 } });
  const panY = interpolate(frame, [60, 180], [0, -60], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, padding: "80px 60px" }}>
      <div style={{ opacity: header, transform: `translateY(${(1 - header) * 20}px)` }}>
        <div style={{ fontFamily: body, color: GOLD, fontWeight: 700, letterSpacing: 4, fontSize: 26, textTransform: "uppercase" }}>
          Live Standings
        </div>
        <div style={{ fontFamily: display, color: IVORY, fontWeight: 800, fontSize: 86, marginTop: 8 }}>
          U15 · Tier 1
        </div>
      </div>

      <div style={{ marginTop: 50, transform: `translateY(${panY}px)` }}>
        {/* Header row */}
        <div style={{
          display: "grid", gridTemplateColumns: "70px 1fr 90px 90px 90px",
          padding: "14px 20px", color: MUTED, fontFamily: body, fontWeight: 700,
          fontSize: 22, letterSpacing: 2, textTransform: "uppercase",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>
          <span>#</span><span>Team</span>
          <span style={{ textAlign: "center" }}>GP</span>
          <span style={{ textAlign: "center", color: GOLD }}>PTS</span>
          <span style={{ textAlign: "center" }}>GD</span>
        </div>

        {TEAMS.map((t, i) => {
          const s = spring({ frame: frame - 20 - i * 6, fps, config: { damping: 18, stiffness: 140 } });
          const isTop3 = i < 3;
          return (
            <div key={t.rank} style={{
              display: "grid", gridTemplateColumns: "70px 1fr 90px 90px 90px",
              alignItems: "center", padding: "22px 20px", marginTop: 6,
              backgroundColor: isTop3 ? "rgba(232,180,0,0.08)" : NAVY_2,
              border: isTop3 ? `1px solid rgba(232,180,0,0.35)` : "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
              opacity: s, transform: `translateX(${(1 - s) * -30}px)`,
              fontFamily: body,
            }}>
              <span style={{ color: isTop3 ? GOLD : MUTED, fontWeight: 800, fontSize: 30 }}>
                {t.rank}
              </span>
              <span style={{ color: IVORY, fontWeight: 600, fontSize: 30 }}>{t.name}</span>
              <span style={{ textAlign: "center", color: MUTED, fontSize: 28 }}>{t.gp}</span>
              <span style={{ textAlign: "center", color: GOLD, fontWeight: 800, fontSize: 34 }}>{t.pts}</span>
              <span style={{ textAlign: "center", color: t.gd > 0 ? "#4ade80" : "#f87171", fontWeight: 700, fontSize: 28 }}>
                {t.gd > 0 ? `+${t.gd}` : t.gd}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
