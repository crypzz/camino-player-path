import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { display, body, NAVY, NAVY_2, GOLD, IVORY, MUTED, FORM } from "./_shared";

const pillColor = (r: "W" | "L" | "T") =>
  r === "W" ? "#22c55e" : r === "L" ? "#ef4444" : "#94a3b8";

export const TeamFormScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const header = spring({ frame, fps, config: { damping: 20, stiffness: 140 } });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, padding: "80px 60px" }}>
      <div style={{ opacity: header, transform: `translateY(${(1 - header) * 20}px)` }}>
        <div style={{ fontFamily: body, color: GOLD, fontWeight: 700, letterSpacing: 4, fontSize: 26, textTransform: "uppercase" }}>
          Team Form · Last 5
        </div>
        <div style={{ fontFamily: display, color: IVORY, fontWeight: 800, fontSize: 86, marginTop: 8 }}>
          Momentum, <span style={{ color: GOLD, fontStyle: "italic" }}>tracked.</span>
        </div>
      </div>

      <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 18 }}>
        {FORM.map((f, i) => {
          const sp = spring({ frame: frame - 20 - i * 8, fps, config: { damping: 18, stiffness: 140 } });
          const streak = (() => {
            let n = 0;
            for (const r of f.results) { if (r === "W") n++; else break; }
            return n;
          })();
          return (
            <div key={f.team} style={{
              display: "grid", gridTemplateColumns: "1fr auto 100px",
              alignItems: "center", padding: "28px 28px",
              backgroundColor: NAVY_2, borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.06)",
              opacity: sp, transform: `translateY(${(1 - sp) * 20}px)`,
              fontFamily: body,
            }}>
              <div style={{ color: IVORY, fontWeight: 700, fontSize: 34 }}>{f.team}</div>
              <div style={{ display: "flex", gap: 10 }}>
                {f.results.map((r, j) => {
                  const rs = spring({ frame: frame - 30 - i * 8 - j * 5, fps, config: { damping: 14, stiffness: 180 } });
                  return (
                    <div key={j} style={{
                      width: 58, height: 58, borderRadius: 10,
                      backgroundColor: pillColor(r), color: "#0A0C12",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: display, fontWeight: 800, fontSize: 30,
                      transform: `scale(${rs})`,
                    }}>{r}</div>
                  );
                })}
              </div>
              <div style={{ textAlign: "right" }}>
                {streak >= 2 && (
                  <div style={{ color: GOLD, fontWeight: 800, fontSize: 24, fontFamily: body }}>
                    🔥 {streak}W
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
