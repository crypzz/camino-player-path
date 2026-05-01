import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhotoBG, display, body, GOLD, IVORY, GoldChip } from "./_shared";

const DUR = 120;

const cards = [
  { name: "M. Rivera", cpi: 89, delta: "+4", color: "#10B981" },
  { name: "J. Chen", cpi: 84, delta: "+2", color: "#10B981" },
  { name: "A. Diallo", cpi: 81, delta: "+6", color: "#10B981" },
];

export const AIODashboardScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerS = spring({ frame: frame - 4, fps, config: { damping: 20 } });
  const headerO = interpolate(headerS, [0, 1], [0, 1]);
  const headerY = interpolate(headerS, [0, 1], [20, 0]);

  const fadeOut = interpolate(frame, [DUR - 12, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <PhotoBG src="aio/dashboard-academy.jpg" duration={DUR} zoomFrom={1.05} zoomTo={1.18} panY={-15} overlayStrength={0.75} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px", opacity: fadeOut }}>
        <div style={{ opacity: headerO, transform: `translateY(${headerY}px)`, marginBottom: 30 }}>
          <GoldChip>SQUAD DASHBOARD</GoldChip>
        </div>
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 64, color: IVORY,
          textAlign: "center", letterSpacing: "-0.03em", lineHeight: 1,
          opacity: headerO, transform: `translateY(${headerY}px)`, marginBottom: 50,
        }}>
          Every player.<br /><span style={{ color: GOLD }}>One view.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%" }}>
          {cards.map((c, i) => {
            const s = spring({ frame: frame - 26 - i * 12, fps, config: { damping: 16 } });
            const o = interpolate(s, [0, 1], [0, 1]);
            const x = interpolate(s, [0, 1], [80, 0]);
            const float = Math.sin((frame - i * 10) * 0.04) * 4;
            return (
              <div key={c.name} style={{
                opacity: o, transform: `translate(${x}px, ${float}px)`,
                background: "rgba(20,24,33,0.92)",
                border: `1px solid rgba(232,180,0,0.25)`,
                borderRadius: 18,
                padding: "22px 28px",
                display: "flex", alignItems: "center", gap: 20,
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 999,
                  background: `linear-gradient(135deg, ${GOLD}, #B8860B)`,
                  display: "flex", justifyContent: "center", alignItems: "center",
                  fontFamily: display, fontWeight: 800, fontSize: 24, color: "#0A0C12",
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: IVORY }}>{c.name}</div>
                  <div style={{ fontFamily: body, fontSize: 16, color: "rgba(245,245,245,0.6)", letterSpacing: 1, textTransform: "uppercase", marginTop: 2 }}>Center Mid · U17</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: display, fontWeight: 800, fontSize: 56, color: GOLD, lineHeight: 1 }}>{c.cpi}</div>
                  <div style={{ fontFamily: body, fontWeight: 700, fontSize: 18, color: c.color, marginTop: 2 }}>{c.delta} this wk</div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
