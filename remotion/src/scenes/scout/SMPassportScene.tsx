import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { display, body, NAVY, GOLD, IVORY, MUTED, Card, Chip, GREEN } from "./_tokens";

export const SMPassportScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = 180;

  const cardEnter = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  const cardY = interpolate(cardEnter, [0, 1], [60, 0]);
  const fadeOut = interpolate(frame, [dur - 12, dur], [1, 0], { extrapolateLeft: "clamp" });

  const stat = (delay: number) => {
    const e = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 140 } });
    return { opacity: e, transform: `translateY(${interpolate(e, [0, 1], [16, 0])}px)` };
  };

  const stats = [
    { l: "CPI", v: 84, c: GOLD },
    { l: "Pace", v: 86, c: GREEN },
    { l: "Vision", v: 82, c: "#3B82F6" },
    { l: "Mental", v: 88, c: "#A855F7" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, justifyContent: "center", alignItems: "center", padding: 60, opacity: fadeOut }}>
      <div style={{ position: "absolute", top: 110, opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>
        <Chip>Player Passport</Chip>
      </div>

      <Card style={{ width: 940, padding: 48, transform: `translateY(${cardY}px)`, opacity: cardEnter }}>
        {/* Header */}
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <div style={{
            width: 150, height: 150, borderRadius: 28,
            background: `linear-gradient(135deg, ${GOLD}, #A87E00)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: display, fontWeight: 800, fontSize: 64, color: NAVY,
          }}>MR</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 52, color: IVORY, lineHeight: 1 }}>Marco Rivera</div>
            <div style={{ fontFamily: body, fontSize: 26, color: MUTED, marginTop: 8 }}>CM · U16 · Camino FC</div>
            <div style={{
              marginTop: 14, display: "inline-block",
              padding: "8px 18px", background: GOLD, color: NAVY,
              fontFamily: display, fontWeight: 800, fontSize: 22, borderRadius: 10,
              letterSpacing: 1.5,
            }}>LEVEL 7 · RISING STAR</div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ marginTop: 36, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
          {stats.map((s, i) => (
            <div key={s.l} style={{
              padding: 20, background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16,
              ...stat(15 + i * 6),
            }}>
              <div style={{ fontFamily: body, fontSize: 18, color: MUTED, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>{s.l}</div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 56, color: s.c, lineHeight: 1.05 }}>{s.v}</div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, marginTop: 6 }}>
                <div style={{ width: `${s.v}%`, height: "100%", background: s.c, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Highlight reel */}
        <div style={{ marginTop: 28, ...stat(50) }}>
          <div style={{ fontFamily: body, fontSize: 22, color: GOLD, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Highlight Reel · Verified</div>
          <div style={{ display: "flex", gap: 12 }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{
                flex: 1, aspectRatio: "9/16",
                background: `linear-gradient(135deg, #1F2937, #0D1117)`,
                borderRadius: 12, position: "relative",
                border: "1px solid rgba(232,180,0,0.15)",
              }}>
                <div style={{ position: "absolute", bottom: 8, left: 10, fontFamily: body, fontSize: 16, color: GOLD, fontWeight: 700 }}>0:{(10 + i * 4).toString().padStart(2, "0")}</div>
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(232,180,0,0.9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: NAVY, fontSize: 16,
                }}>▶</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          marginTop: 22, padding: "16px 22px",
          background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: 14, fontFamily: body, fontSize: 22, color: GREEN, fontWeight: 600,
          ...stat(70),
        }}>
          ↑ +8 CPI in the last 30 days · Verified by Coach
        </div>
      </Card>
    </AbsoluteFill>
  );
};
