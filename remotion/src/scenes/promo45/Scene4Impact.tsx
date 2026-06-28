import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { Phone, Overlay, BG, CARD, CARD_2, YELLOW, YELLOW_DEEP, WHITE, MUTED, LINE, body, display, glow } from "./_shared";

const PW = 320;

// LEFT — Scout
const ScoutPhone: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Phone width={PW}>
      <div style={{ position: "absolute", top: 60, left: 18, right: 18 }}>
        <div style={{ fontFamily: body, color: MUTED, fontSize: 14, fontWeight: 800, letterSpacing: 1, marginBottom: 14 }}>SCOUT</div>
        <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 18, padding: 16, textAlign: "center" }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", margin: "0 auto 10px", background: `linear-gradient(135deg, ${YELLOW}, ${YELLOW_DEEP})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontWeight: 800, color: "#111", fontSize: 30 }}>D</div>
          <div style={{ fontFamily: display, color: WHITE, fontWeight: 800, fontSize: 22 }}>Diego R.</div>
          <div style={{ fontFamily: body, color: YELLOW, fontSize: 15, marginTop: 2 }}>★★★★★</div>
          <div style={{ fontFamily: body, color: MUTED, fontSize: 13, marginTop: 10, lineHeight: 1.5 }}>28 Touches · 8.4km<br />67% Possession</div>
        </div>
        <div style={{ marginTop: 14, background: YELLOW, color: "#111", fontFamily: body, fontWeight: 800, fontSize: 16, textAlign: "center", padding: "14px 0", borderRadius: 14, boxShadow: glow(YELLOW, interpolate(Math.sin(frame / 8), [-1, 1], [4, 14])) }}>
          + Add to Watchlist
        </div>
        <div style={{ marginTop: 12, fontFamily: body, color: MUTED, fontSize: 13, textAlign: "center" }}>2 players saved</div>
      </div>
    </Phone>
  );
};

// CENTER — Coach (line graph)
const CoachPhone: React.FC = () => {
  const frame = useCurrentFrame();
  const W = PW - 36;
  const H = 200;
  const pts = [40, 52, 48, 70, 87];
  const max = 100;
  const coords = pts.map((p, i) => ({ x: (i / (pts.length - 1)) * (W - 20) + 10, y: H - (p / max) * (H - 30) - 10 }));
  const draw = interpolate(frame, [10, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const totalLen = 600;
  return (
    <Phone width={PW}>
      <div style={{ position: "absolute", top: 60, left: 18, right: 18 }}>
        <div style={{ fontFamily: body, color: MUTED, fontSize: 14, fontWeight: 800, letterSpacing: 1, marginBottom: 14 }}>COACH</div>
        <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 18, padding: 14 }}>
          <div style={{ fontFamily: display, color: WHITE, fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Performance ↗</div>
          <svg width={W} height={H}>
            {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={0} y1={H * g} x2={W} y2={H * g} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />)}
            <path d={path} fill="none" stroke={YELLOW} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={totalLen} strokeDashoffset={totalLen * (1 - draw)} style={{ filter: `drop-shadow(0 0 6px ${YELLOW})` }} />
            {coords.map((c, i) => {
              const show = draw > i / (coords.length - 1);
              const last = i === coords.length - 1;
              return show ? <circle key={i} cx={c.x} cy={c.y} r={last ? 7 : 4} fill={last ? YELLOW : WHITE} style={{ filter: last ? `drop-shadow(0 0 8px ${YELLOW})` : "none" }} /> : null;
            })}
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: body, color: MUTED, fontSize: 11, marginTop: 4 }}>
            {["G1", "G2", "G3", "G4", "G5"].map((g) => <span key={g}>{g}</span>)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {[["28", "Touch"], ["8.4", "km"], ["67%", "Poss"]].map(([v, l]) => (
            <div key={l} style={{ flex: 1, background: CARD_2, borderRadius: 12, padding: "10px 0", textAlign: "center" }}>
              <div style={{ fontFamily: display, color: YELLOW, fontWeight: 800, fontSize: 18 }}>{v}</div>
              <div style={{ fontFamily: body, color: MUTED, fontSize: 11 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
};

// RIGHT — Parent
const ParentPhone: React.FC = () => {
  return (
    <Phone width={PW}>
      <div style={{ position: "absolute", top: 60, left: 18, right: 18 }}>
        <div style={{ fontFamily: body, color: MUTED, fontSize: 14, fontWeight: 800, letterSpacing: 1, marginBottom: 14 }}>PARENT</div>
        <div style={{ background: CARD, border: `1px solid ${YELLOW}44`, borderRadius: 16, padding: 14, display: "flex", gap: 10 }}>
          <div style={{ fontSize: 22 }}>🔔</div>
          <div style={{ fontFamily: body, color: WHITE, fontSize: 14, lineHeight: 1.4 }}>28 touches & 8.4km today!</div>
        </div>
        <div style={{ marginTop: 14, background: CARD, border: `1px solid ${LINE}`, borderRadius: 16, padding: 14 }}>
          <div style={{ fontFamily: body, color: MUTED, fontSize: 13, marginBottom: 8 }}>Game 5 performance</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
            <span style={{ fontFamily: display, color: WHITE, fontWeight: 800, fontSize: 26 }}>87</span>
            <span style={{ fontFamily: body, color: MUTED, fontSize: 14 }}>/100</span>
          </div>
          <div style={{ height: 12, borderRadius: 999, background: "#000", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "87%", background: "linear-gradient(90deg, #22c55e, #4ade80)" }} />
          </div>
        </div>
        <div style={{ marginTop: 14, background: CARD_2, borderRadius: 16, padding: 14 }}>
          <div style={{ fontFamily: body, color: YELLOW, fontSize: 12, fontWeight: 800, marginBottom: 6 }}>Coach note</div>
          <div style={{ fontFamily: body, color: WHITE, fontSize: 14, lineHeight: 1.4, fontStyle: "italic" }}>"Great positioning and first touch today!"</div>
        </div>
      </div>
    </Phone>
  );
};

// SCENE 4 (22-32s) — THE IMPACT, 3 dashboards.
export const Scene4Impact: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phones = [
    { C: ScoutPhone, rot: -6, x: -PW - 30 },
    { C: CoachPhone, rot: 0, x: 0 },
    { C: ParentPhone, rot: 6, x: PW + 30 },
  ];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", height: 1200 }}>
        {phones.map((ph, i) => {
          const p = spring({ frame: frame - i * 10, fps, config: { damping: 18 } });
          const Comp = ph.C;
          return (
            <div key={i} style={{ position: "absolute", opacity: p, transform: `translateX(${ph.x}px) translateY(${interpolate(p, [0, 1], [60, 0])}px) rotate(${ph.rot}deg) scale(${interpolate(p, [0, 1], [0.85, 1])})`, zIndex: i === 1 ? 10 : 1 }}>
              <Comp />
            </div>
          );
        })}
      </div>

      <Sequence from={70}>
        <Overlay delay={0} size={46} bottom={90}>
          Coaches coach better.
          <span style={{ display: "block", color: YELLOW, textShadow: glow(YELLOW, 18) }}>Scouts find talent faster.</span>
          <span style={{ display: "block", color: WHITE }}>Parents understand.</span>
        </Overlay>
      </Sequence>
    </AbsoluteFill>
  );
};
