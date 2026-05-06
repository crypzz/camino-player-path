import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { display, body, NAVY, GOLD, IVORY, MUTED, Card, Chip } from "./_tokens";

export const SMCpiScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = 180;

  const cardEnter = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const cardY = interpolate(cardEnter, [0, 1], [60, 0]);

  // Number climb 71 -> 84
  const cpi = Math.round(interpolate(frame, [20, 110], [71, 84], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const ringPct = interpolate(frame, [20, 110], [0.71, 0.84], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Ring math
  const R = 200;
  const C = 2 * Math.PI * R;

  const attrs = [
    { l: "Technical", v: 86, c: GOLD, delay: 30 },
    { l: "Tactical", v: 78, c: "#3B82F6", delay: 40 },
    { l: "Physical", v: 84, c: "#10B981", delay: 50 },
    { l: "Mental", v: 88, c: "#A855F7", delay: 60 },
  ];

  const fadeOut = interpolate(frame, [dur - 12, dur], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, justifyContent: "center", alignItems: "center", padding: 60, opacity: fadeOut }}>
      <div style={{ position: "absolute", top: 110, opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>
        <Chip>Coach Performance Index</Chip>
      </div>

      <Card style={{ width: 920, padding: 60, transform: `translateY(${cardY}px)`, opacity: cardEnter }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
          <svg width={460} height={460} viewBox="0 0 460 460">
            <circle cx={230} cy={230} r={R} stroke="rgba(255,255,255,0.06)" strokeWidth={28} fill="none" />
            <circle
              cx={230} cy={230} r={R}
              stroke={GOLD} strokeWidth={28} fill="none"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - ringPct)}
              transform="rotate(-90 230 230)"
              style={{ filter: "drop-shadow(0 0 18px rgba(232,180,0,0.45))" }}
            />
            <text x={230} y={232} textAnchor="middle" dominantBaseline="middle"
              style={{ fontFamily: display, fontWeight: 800, fontSize: 156, fill: IVORY, letterSpacing: "-0.04em" }}>
              {cpi}
            </text>
            <text x={230} y={310} textAnchor="middle"
              style={{ fontFamily: body, fontWeight: 600, fontSize: 26, fill: MUTED, letterSpacing: 4 }}>
              CPI / 100
            </text>
          </svg>

          <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {attrs.map((a) => {
              const e = interpolate(frame, [a.delay, a.delay + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={a.l} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 20px", opacity: e }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                    <div style={{ fontFamily: body, fontSize: 22, color: MUTED, fontWeight: 600 }}>{a.l}</div>
                    <div style={{ fontFamily: display, fontWeight: 800, fontSize: 32, color: a.c }}>{Math.round(a.v * e)}</div>
                  </div>
                  <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${a.v * e}%`, height: "100%", background: a.c, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <div style={{ position: "absolute", bottom: 90, fontFamily: body, fontSize: 28, color: MUTED, letterSpacing: 3, textTransform: "uppercase", opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" }) }}>
        23 attributes. One score.
      </div>
    </AbsoluteFill>
  );
};
