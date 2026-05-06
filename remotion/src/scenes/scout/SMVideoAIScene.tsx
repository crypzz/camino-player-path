import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { display, body, NAVY, GOLD, IVORY, MUTED, Card, Chip, GREEN } from "./_tokens";

const EVENTS = [
  { t: 12, x: 28, y: 62, label: "Pass +", color: GREEN },
  { t: 28, x: 52, y: 40, label: "Dribble", color: GOLD },
  { t: 44, x: 72, y: 28, label: "Shot ✓", color: "#3B82F6" },
  { t: 60, x: 84, y: 50, label: "Goal", color: GOLD },
];

const Pitch = ({ frame }: { frame: number }) => (
  <svg viewBox="0 0 100 64" style={{ width: "100%", height: "auto", display: "block", borderRadius: 18 }}>
    <defs>
      <linearGradient id="pitchg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0F1B12" />
        <stop offset="100%" stopColor="#0A140D" />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={100} height={64} fill="url(#pitchg)" />
    {/* stripes */}
    {Array.from({ length: 8 }).map((_, i) => (
      <rect key={i} x={i * 12.5} y={0} width={12.5} height={64} fill={i % 2 ? "rgba(255,255,255,0.015)" : "transparent"} />
    ))}
    <rect x={1} y={1} width={98} height={62} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={0.3} />
    <line x1={50} y1={1} x2={50} y2={63} stroke="rgba(255,255,255,0.25)" strokeWidth={0.3} />
    <circle cx={50} cy={32} r={7} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={0.3} />
    <rect x={1} y={20} width={12} height={24} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={0.3} />
    <rect x={87} y={20} width={12} height={24} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={0.3} />

    {/* path connecting events */}
    <path
      d={`M ${EVENTS[0].x} ${EVENTS[0].y} ${EVENTS.slice(1).map(e => `L ${e.x} ${e.y}`).join(" ")}`}
      fill="none" stroke={GOLD} strokeWidth={0.4} strokeDasharray="1.5 1"
      strokeDashoffset={interpolate(frame, [10, 80], [200, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      opacity={0.7}
    />

    {EVENTS.map((e, i) => {
      const enter = interpolate(frame, [e.t, e.t + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const pulse = interpolate(frame, [e.t, e.t + 20], [0.5, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const pulseO = interpolate(frame, [e.t, e.t + 20], [0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return (
        <g key={i} opacity={enter}>
          <circle cx={e.x} cy={e.y} r={pulse} fill="none" stroke={e.color} strokeWidth={0.2} opacity={pulseO} />
          <circle cx={e.x} cy={e.y} r={1.6} fill={e.color} stroke="#fff" strokeWidth={0.25} />
        </g>
      );
    })}
  </svg>
);

export const SMVideoAIScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = 180;

  const cardEnter = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const cardY = interpolate(cardEnter, [0, 1], [60, 0]);
  const fadeOut = interpolate(frame, [dur - 12, dur], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, justifyContent: "center", alignItems: "center", padding: 60, opacity: fadeOut }}>
      <div style={{ position: "absolute", top: 110, opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>
        <Chip>Video AI · Match Tagging</Chip>
      </div>

      <Card style={{ width: 940, padding: 36, transform: `translateY(${cardY}px)`, opacity: cardEnter }}>
        <Pitch frame={frame} />

        <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: 12 }}>
          {EVENTS.map((e, i) => {
            const t = e.t + 6;
            const en = spring({ frame: frame - t, fps, config: { damping: 14, stiffness: 160 } });
            return (
              <div key={i} style={{
                opacity: en, transform: `translateY(${interpolate(en, [0, 1], [12, 0])}px)`,
                padding: "10px 18px", borderRadius: 999,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${e.color}`,
                color: e.color, fontFamily: body, fontWeight: 700, fontSize: 22,
              }}>{e.label}</div>
            );
          })}
        </div>

        <div style={{
          marginTop: 22, padding: "18px 22px",
          background: "rgba(232,180,0,0.08)", border: "1px solid rgba(232,180,0,0.25)", borderRadius: 16,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          opacity: interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <div style={{ fontFamily: body, fontSize: 22, color: IVORY, fontWeight: 600 }}>Auto-tagged in <span style={{ color: GOLD, fontWeight: 800 }}>2.4s</span></div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: GOLD }}>+6 CPI</div>
        </div>
      </Card>

      <div style={{ position: "absolute", bottom: 90, fontFamily: body, fontSize: 28, color: MUTED, letterSpacing: 3, textTransform: "uppercase", opacity: interpolate(frame, [120, 140], [0, 1], { extrapolateRight: "clamp" }) }}>
        Upload film. Get insight.
      </div>
    </AbsoluteFill>
  );
};
