import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";
import { display, body, GOLD, IVORY, NAVY, NAVY_2 } from "./_shared";

const DUR = 330;
const BEAT = 110;

// ───────── Beat 1: Live Standings ─────────
const StandingsBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headS = spring({ frame: frame - 2, fps, config: { damping: 20 } });
  const headO = interpolate(headS, [0, 1], [0, 1]);
  const headY = interpolate(headS, [0, 1], [20, 0]);

  const rows = [
    { rank: 1, name: "Foothills SC", pts: 28 },
    { rank: 2, name: "Calgary Villains", pts: 27 },
    { rank: 3, name: "Cavalry Academy", pts: 26 },
    { rank: 4, name: "Blizzard", pts: 25 },
  ];

  // live dot pulse
  const pulse = 0.5 + 0.5 * Math.sin(frame / 5);

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, padding: "140px 60px 0" }}>
      <div style={{ opacity: headO, transform: `translateY(${headY}px)`, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 12, height: 12, borderRadius: 999,
            backgroundColor: "#22c55e",
            boxShadow: `0 0 ${10 + pulse * 14}px rgba(34,197,94,${0.5 + pulse * 0.5})`,
          }} />
          <div style={{ fontFamily: body, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: GOLD, textTransform: "uppercase" }}>Live Standings</div>
        </div>
        <div style={{ marginTop: 18, fontFamily: display, fontWeight: 800, fontSize: 80, lineHeight: 0.95, color: IVORY, letterSpacing: "-0.03em" }}>
          Track every<br /><span style={{ color: GOLD }}>league. Live.</span>
        </div>
      </div>

      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((r, i) => {
          const s = spring({ frame: frame - 18 - i * 6, fps, config: { damping: 22 } });
          const o = interpolate(s, [0, 1], [0, 1]);
          const x = interpolate(s, [0, 1], [80, 0]);
          return (
            <div key={r.rank} style={{
              opacity: o, transform: `translateX(${x}px)`,
              display: "grid", gridTemplateColumns: "60px 1fr 100px",
              alignItems: "center", gap: 16,
              padding: "20px 24px",
              background: r.rank === 1 ? "rgba(232,180,0,0.10)" : NAVY_2,
              border: `1px solid ${r.rank === 1 ? "rgba(232,180,0,0.4)" : "rgba(245,245,245,0.06)"}`,
              borderRadius: 14,
            }}>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: r.rank === 1 ? GOLD : "rgba(245,245,245,0.55)" }}>{String(r.rank).padStart(2, "0")}</div>
              <div style={{ fontFamily: body, fontWeight: 600, fontSize: 26, color: IVORY }}>{r.name}</div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 30, color: IVORY, textAlign: "right" }}>{r.pts}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ───────── Beat 2: CPI Radar ─────────
const CPIBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headS = spring({ frame: frame - 2, fps, config: { damping: 20 } });
  const headO = interpolate(headS, [0, 1], [0, 1]);
  const headY = interpolate(headS, [0, 1], [20, 0]);

  const cpiTarget = 84;
  const cpiAnim = spring({ frame: frame - 14, fps, config: { damping: 30, stiffness: 80 } });
  const cpi = Math.round(interpolate(cpiAnim, [0, 1], [62, cpiTarget]));

  // radar polygon — 6 axes, animate from low to high
  const axes = 6;
  const cx = 540, cy = 1100, R = 280;
  const baseVals = [0.55, 0.62, 0.48, 0.7, 0.6, 0.52];
  const targetVals = [0.9, 0.85, 0.75, 0.92, 0.8, 0.78];
  const morph = interpolate(cpiAnim, [0, 1], [0, 1]);

  const pts = baseVals.map((b, i) => {
    const v = b + (targetVals[i] - b) * morph;
    const angle = (Math.PI * 2 * i) / axes - Math.PI / 2;
    return [cx + Math.cos(angle) * R * v, cy + Math.sin(angle) * R * v];
  });
  const poly = pts.map(p => p.join(",")).join(" ");

  // grid rings
  const rings = [0.33, 0.66, 1].map(scale => {
    const ringPts = Array.from({ length: axes }, (_, i) => {
      const angle = (Math.PI * 2 * i) / axes - Math.PI / 2;
      return [cx + Math.cos(angle) * R * scale, cy + Math.sin(angle) * R * scale];
    });
    return ringPts.map(p => p.join(",")).join(" ");
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, padding: "140px 60px 0" }}>
      <div style={{ opacity: headO, transform: `translateY(${headY}px)` }}>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: GOLD, textTransform: "uppercase" }}>Camino Performance Index</div>
        <div style={{ marginTop: 18, fontFamily: display, fontWeight: 800, fontSize: 80, lineHeight: 0.95, color: IVORY, letterSpacing: "-0.03em" }}>
          Score every<br />player <span style={{ color: GOLD }}>fairly.</span>
        </div>
      </div>

      <svg viewBox="0 0 1080 1500" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {rings.map((p, i) => (
          <polygon key={i} points={p} fill="none" stroke="rgba(245,245,245,0.10)" strokeWidth={1.5} />
        ))}
        {Array.from({ length: axes }, (_, i) => {
          const angle = (Math.PI * 2 * i) / axes - Math.PI / 2;
          return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(angle) * R} y2={cy + Math.sin(angle) * R} stroke="rgba(245,245,245,0.08)" strokeWidth={1} />;
        })}
        <polygon points={poly} fill="rgba(232,180,0,0.18)" stroke={GOLD} strokeWidth={3} />
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={6} fill={GOLD} />)}
        {/* center CPI number */}
        <text x={cx} y={cy + 14} textAnchor="middle" fontFamily="Plus Jakarta Sans" fontWeight={800} fontSize={88} fill={IVORY}>{cpi}</text>
        <text x={cx} y={cy + 56} textAnchor="middle" fontFamily="Inter" fontSize={22} fill="rgba(245,245,245,0.6)" letterSpacing="4">CPI</text>
      </svg>
    </AbsoluteFill>
  );
};

// ───────── Beat 3: Verified Video ─────────
const VideoBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headS = spring({ frame: frame - 2, fps, config: { damping: 20 } });
  const headO = interpolate(headS, [0, 1], [0, 1]);
  const headY = interpolate(headS, [0, 1], [20, 0]);

  // bounding box drifts
  const bx = 250 + Math.sin(frame / 12) * 30;
  const by = 950 + Math.cos(frame / 14) * 20;

  const badgeS = spring({ frame: frame - 28, fps, config: { damping: 12, stiffness: 140 } });
  const badgeS2 = interpolate(badgeS, [0, 1], [0.6, 1]);
  const badgeO = interpolate(badgeS, [0, 1], [0, 1]);

  const stats = [
    { label: "PASSES", value: "47" },
    { label: "ACCURACY", value: "91%" },
    { label: "DUELS WON", value: "8/10" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, padding: "140px 60px 0" }}>
      <div style={{ opacity: headO, transform: `translateY(${headY}px)` }}>
        <div style={{ fontFamily: body, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: GOLD, textTransform: "uppercase" }}>Video Intelligence</div>
        <div style={{ marginTop: 18, fontFamily: display, fontWeight: 800, fontSize: 80, lineHeight: 0.95, color: IVORY, letterSpacing: "-0.03em" }}>
          Prove every<br /><span style={{ color: GOLD }}>moment.</span>
        </div>
      </div>

      {/* video frame */}
      <div style={{
        position: "absolute", left: 60, right: 60, top: 720, height: 700,
        background: "linear-gradient(180deg,#1a3a1f,#0f2415)",
        borderRadius: 20, overflow: "hidden",
        border: "1px solid rgba(245,245,245,0.08)",
      }}>
        {/* faux pitch lines */}
        <svg width="100%" height="100%" viewBox="0 0 960 700" preserveAspectRatio="none">
          <rect x="20" y="20" width="920" height="660" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
          <line x1="480" y1="20" x2="480" y2="680" stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
          <circle cx="480" cy="350" r="80" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
        </svg>
        {/* bounding box */}
        <div style={{
          position: "absolute", left: bx, top: by - 720, width: 140, height: 200,
          border: `3px solid ${GOLD}`, borderRadius: 6,
          boxShadow: `0 0 20px rgba(232,180,0,0.5)`,
        }}>
          <div style={{
            position: "absolute", top: -32, left: 0,
            background: GOLD, color: NAVY,
            fontFamily: body, fontWeight: 800, fontSize: 14,
            padding: "4px 10px", letterSpacing: 1,
          }}>#10 LOPEZ</div>
        </div>
        {/* verified badge */}
        <div style={{
          position: "absolute", top: 24, right: 24,
          background: "rgba(34,197,94,0.18)", color: "#4ade80",
          border: "1px solid rgba(34,197,94,0.5)",
          padding: "10px 18px", borderRadius: 999,
          fontFamily: body, fontWeight: 800, fontSize: 18, letterSpacing: 2,
          opacity: badgeO, transform: `scale(${badgeS2})`,
        }}>✓ VERIFIED</div>
      </div>

      {/* stat strip */}
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 90, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {stats.map((s, i) => {
          const sp = spring({ frame: frame - 40 - i * 6, fps, config: { damping: 20 } });
          const o = interpolate(sp, [0, 1], [0, 1]);
          const y = interpolate(sp, [0, 1], [20, 0]);
          return (
            <div key={i} style={{
              opacity: o, transform: `translateY(${y}px)`,
              padding: "18px 20px", background: NAVY_2,
              border: "1px solid rgba(232,180,0,0.18)", borderRadius: 12,
            }}>
              <div style={{ fontFamily: body, fontSize: 14, color: "rgba(245,245,245,0.5)", letterSpacing: 2 }}>{s.label}</div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: GOLD, marginTop: 4 }}>{s.value}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const ESCProofScene = () => {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [DUR - 12, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Sequence from={0} durationInFrames={BEAT}><StandingsBeat /></Sequence>
      <Sequence from={BEAT} durationInFrames={BEAT}><CPIBeat /></Sequence>
      <Sequence from={BEAT * 2} durationInFrames={BEAT}><VideoBeat /></Sequence>
    </AbsoluteFill>
  );
};
