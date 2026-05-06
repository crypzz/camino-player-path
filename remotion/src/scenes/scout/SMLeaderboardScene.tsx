import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { display, body, NAVY, GOLD, IVORY, MUTED, Card, Chip, GREEN } from "./_tokens";

const ROWS = [
  { rank: 1, name: "M. Rivera", team: "Camino FC U16", g: 14, a: 7 },
  { rank: 2, name: "J. Chen", team: "Northside U16", g: 12, a: 5 },
  { rank: 3, name: "A. Diallo", team: "Foothills U16", g: 11, a: 9 },
  { rank: 4, name: "K. Park", team: "Camino FC U16", g: 9, a: 6 },
  { rank: 5, name: "T. Silva", team: "Westside U16", g: 8, a: 4 },
];

const rankColor = (r: number) => r === 1 ? GOLD : r === 2 ? "#C0C0C0" : r === 3 ? "#CD7F32" : "rgba(255,255,255,0.4)";

export const SMLeaderboardScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = 180;

  const cardEnter = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const cardY = interpolate(cardEnter, [0, 1], [60, 0]);
  const fadeOut = interpolate(frame, [dur - 12, dur], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, justifyContent: "center", alignItems: "center", padding: 60, opacity: fadeOut }}>
      <div style={{ position: "absolute", top: 110, opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>
        <Chip>Top Scorers · CMSA U16</Chip>
      </div>

      <Card style={{ width: 940, padding: 0, overflow: "hidden", transform: `translateY(${cardY}px)`, opacity: cardEnter }}>
        <div style={{
          display: "grid", gridTemplateColumns: "100px 1fr 90px 90px",
          padding: "22px 32px", background: "rgba(232,180,0,0.08)",
          borderBottom: "1px solid rgba(232,180,0,0.2)",
          fontFamily: body, fontWeight: 700, fontSize: 22, color: GOLD,
          letterSpacing: 2, textTransform: "uppercase",
        }}>
          <div>#</div><div>Player</div><div style={{ textAlign: "right" }}>G</div><div style={{ textAlign: "right" }}>A</div>
        </div>

        {ROWS.map((r, i) => {
          const start = 18 + i * 12;
          const e = spring({ frame: frame - start, fps, config: { damping: 16, stiffness: 130 } });
          const tx = interpolate(e, [0, 1], [60, 0]);
          const isTop = r.rank === 1;
          const gShown = Math.round(interpolate(frame, [start + 6, start + 36], [0, r.g], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
          return (
            <div key={r.rank} style={{
              display: "grid", gridTemplateColumns: "100px 1fr 90px 90px",
              padding: "26px 32px", alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              background: isTop ? "rgba(232,180,0,0.06)" : "transparent",
              opacity: e, transform: `translateX(${tx}px)`,
            }}>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: rankColor(r.rank) }}>
                {r.rank}
              </div>
              <div>
                <div style={{ fontFamily: display, fontWeight: 700, fontSize: 32, color: IVORY }}>{r.name}</div>
                <div style={{ fontFamily: body, fontSize: 20, color: MUTED, marginTop: 2 }}>{r.team}</div>
              </div>
              <div style={{ textAlign: "right", fontFamily: display, fontWeight: 800, fontSize: 40, color: isTop ? GOLD : IVORY }}>{gShown}</div>
              <div style={{ textAlign: "right", fontFamily: display, fontWeight: 700, fontSize: 36, color: GREEN }}>{r.a}</div>
            </div>
          );
        })}
      </Card>

      <div style={{ position: "absolute", bottom: 90, fontFamily: body, fontSize: 28, color: MUTED, letterSpacing: 3, textTransform: "uppercase", opacity: interpolate(frame, [110, 130], [0, 1], { extrapolateRight: "clamp" }) }}>
        Live leaderboards. Real proof.
      </div>
    </AbsoluteFill>
  );
};
