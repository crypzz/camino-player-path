import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { display, body, NAVY, NAVY_2, GOLD, IVORY, MUTED } from "./_shared";

const ROWS = [
  { name: "L. Martinez", goals: 2, assists: 1 },
  { name: "J. Okonkwo", goals: 1, assists: 2 },
  { name: "A. Singh", goals: 1, assists: 0 },
];

const Tick: React.FC<{ value: number; delay: number }> = ({ value, delay }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <>{Math.round(value * t)}</>;
};

export const LogMatchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const header = spring({ frame, fps, config: { damping: 20, stiffness: 140 } });
  const dialog = spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 130 } });
  const btnPulse = 1 + Math.sin((frame - 110) * 0.3) * 0.03 * (frame > 110 ? 1 : 0);
  const btnGlow = interpolate(frame, [110, 140], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, padding: "80px 60px" }}>
      <div style={{ opacity: header, transform: `translateY(${(1 - header) * 20}px)` }}>
        <div style={{ fontFamily: body, color: GOLD, fontWeight: 700, letterSpacing: 4, fontSize: 26, textTransform: "uppercase" }}>
          Coaches
        </div>
        <div style={{ fontFamily: display, color: IVORY, fontWeight: 800, fontSize: 78, marginTop: 8 }}>
          30 seconds to <span style={{ color: GOLD, fontStyle: "italic" }}>update.</span>
        </div>
      </div>

      {/* Dialog mock */}
      <div style={{
        marginTop: 50, backgroundColor: NAVY_2, borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.08)",
        padding: 32, opacity: dialog, transform: `translateY(${(1 - dialog) * 30}px) scale(${0.96 + dialog * 0.04})`,
        boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
        fontFamily: body,
      }}>
        <div style={{ color: IVORY, fontFamily: display, fontWeight: 700, fontSize: 34, marginBottom: 22 }}>
          Log Match Stats
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ color: MUTED, fontSize: 18, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Match date</div>
            <div style={{ backgroundColor: NAVY, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "14px 16px", color: IVORY, fontSize: 26 }}>
              2026-07-19
            </div>
          </div>
          <div>
            <div style={{ color: MUTED, fontSize: 18, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Opponent</div>
            <div style={{ backgroundColor: NAVY, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "14px 16px", color: IVORY, fontSize: 26 }}>
              Cavalry FC
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px", gap: 10, padding: "0 4px 8px", color: MUTED, fontSize: 16, textTransform: "uppercase", letterSpacing: 2 }}>
          <span>Player</span><span style={{ textAlign: "center" }}>Goals</span><span style={{ textAlign: "center" }}>Assists</span>
        </div>

        {ROWS.map((r, i) => {
          const s = spring({ frame: frame - 30 - i * 10, fps, config: { damping: 18, stiffness: 150 } });
          return (
            <div key={r.name} style={{
              display: "grid", gridTemplateColumns: "1fr 90px 90px", gap: 10,
              alignItems: "center", padding: "10px 4px",
              opacity: s, transform: `translateX(${(1 - s) * -20}px)`,
            }}>
              <div style={{ backgroundColor: NAVY, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "12px 14px", color: IVORY, fontSize: 24 }}>
                {r.name}
              </div>
              <div style={{ backgroundColor: NAVY, border: "1px solid rgba(232,180,0,0.3)", borderRadius: 8, padding: "12px 0", color: GOLD, fontWeight: 800, fontSize: 26, textAlign: "center" }}>
                <Tick value={r.goals} delay={60 + i * 10} />
              </div>
              <div style={{ backgroundColor: NAVY, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "12px 0", color: IVORY, fontWeight: 700, fontSize: 26, textAlign: "center" }}>
                <Tick value={r.assists} delay={66 + i * 10} />
              </div>
            </div>
          );
        })}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 26 }}>
          <div style={{
            backgroundColor: GOLD, color: NAVY, fontFamily: display, fontWeight: 800,
            fontSize: 28, padding: "18px 40px", borderRadius: 12,
            transform: `scale(${btnPulse})`,
            boxShadow: `0 0 ${40 * btnGlow}px rgba(232,180,0,${0.6 * btnGlow})`,
          }}>
            Log stats
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
