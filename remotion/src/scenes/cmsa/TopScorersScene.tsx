import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { display, body, NAVY, NAVY_2, GOLD, IVORY, MUTED, SCORERS } from "./_shared";

const MEDALS = ["#E8B400", "#C0C0C0", "#CD7F32"];

const TickNumber: React.FC<{ value: number; delay: number }> = ({ value, delay }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <>{Math.round(value * t)}</>;
};

export const TopScorersScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const header = spring({ frame, fps, config: { damping: 20, stiffness: 140 } });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, padding: "80px 60px" }}>
      <div style={{ opacity: header, transform: `translateY(${(1 - header) * 20}px)` }}>
        <div style={{ fontFamily: body, color: GOLD, fontWeight: 700, letterSpacing: 4, fontSize: 26, textTransform: "uppercase" }}>
          Top Scorers
        </div>
        <div style={{ fontFamily: display, color: IVORY, fontWeight: 800, fontSize: 86, marginTop: 8 }}>
          Real players.<br/>
          <span style={{ color: GOLD, fontStyle: "italic" }}>Real numbers.</span>
        </div>
      </div>

      <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 14 }}>
        {SCORERS.map((s, i) => {
          const sp = spring({ frame: frame - 20 - i * 8, fps, config: { damping: 18, stiffness: 140 } });
          const medal = MEDALS[i];
          return (
            <div key={s.rank} style={{
              display: "grid", gridTemplateColumns: "80px 1fr 130px 130px",
              alignItems: "center", padding: "24px 24px",
              backgroundColor: NAVY_2,
              borderLeft: `4px solid ${medal || "rgba(255,255,255,0.15)"}`,
              borderRadius: 10,
              opacity: sp, transform: `translateY(${(1 - sp) * 20}px)`,
              fontFamily: body,
            }}>
              <span style={{ color: medal || MUTED, fontWeight: 800, fontSize: 36 }}>#{s.rank}</span>
              <div>
                <div style={{ color: IVORY, fontWeight: 700, fontSize: 32 }}>{s.name}</div>
                <div style={{ color: MUTED, fontSize: 22, marginTop: 4 }}>{s.team}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: GOLD, fontWeight: 800, fontSize: 44, fontFamily: display }}>
                  <TickNumber value={s.goals} delay={30 + i * 8} />
                </div>
                <div style={{ color: MUTED, fontSize: 18, letterSpacing: 2, textTransform: "uppercase" }}>Goals</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: IVORY, fontWeight: 700, fontSize: 36, fontFamily: display }}>
                  <TickNumber value={s.assists} delay={36 + i * 8} />
                </div>
                <div style={{ color: MUTED, fontSize: 18, letterSpacing: 2, textTransform: "uppercase" }}>Assists</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
