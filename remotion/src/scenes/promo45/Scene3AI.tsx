import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence, random } from "remotion";
import { BG, CARD, YELLOW, YELLOW_DEEP, WHITE, MUTED, LINE, body, display, glow, CountUp } from "./_shared";

// ---- soccer field with moving ball ----
const Field: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = 760;
  const H = 520;
  const reveal = spring({ frame, fps, config: { damping: 22 } });

  const dots = [
    { x: 0.2, y: 0.3, c: YELLOW },
    { x: 0.4, y: 0.6, c: "#60a5fa" },
    { x: 0.65, y: 0.4, c: "#60a5fa" },
    { x: 0.55, y: 0.75, c: YELLOW },
    { x: 0.8, y: 0.55, c: "#f87171" },
    { x: 0.3, y: 0.5, c: "#f87171" },
  ];

  // ball curved path
  const t = interpolate(frame, [10, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bx = interpolate(t, [0, 0.5, 1], [0.18, 0.5, 0.82]) * W;
  const by = (interpolate(t, [0, 0.5, 1], [0.32, 0.18, 0.55]) - 0.06 * Math.sin(t * Math.PI)) * H;

  return (
    <div style={{ width: W, height: H, transform: `scale(${0.9 + reveal * 0.1})`, opacity: reveal, position: "relative", borderRadius: 24, overflow: "hidden", border: `1px solid ${YELLOW}33`, background: "linear-gradient(160deg, rgba(20,40,25,0.5), rgba(10,10,10,0.7))", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.8)" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <rect x={16} y={16} width={W - 32} height={H - 32} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={2} rx={8} />
        <line x1={W / 2} y1={16} x2={W / 2} y2={H - 16} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
        <circle cx={W / 2} cy={H / 2} r={70} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
        <rect x={16} y={H / 2 - 90} width={80} height={180} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
        <rect x={W - 96} y={H / 2 - 90} width={80} height={180} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
        {/* ball trail */}
        <path d={`M ${0.18 * W} ${0.32 * H} Q ${0.5 * W} ${0.05 * H} ${0.82 * W} ${0.55 * H}`} fill="none" stroke={YELLOW} strokeWidth={3} strokeDasharray="6 8" opacity={0.5} />
      </svg>
      {dots.map((d, i) => {
        const dp = spring({ frame: frame - 6 - i * 4, fps, config: { damping: 14 } });
        return <div key={i} style={{ position: "absolute", left: d.x * W, top: d.y * H, width: 26, height: 26, marginLeft: -13, marginTop: -13, borderRadius: "50%", background: d.c, transform: `scale(${dp})`, boxShadow: `0 0 16px ${d.c}` }} />;
      })}
      {/* ball */}
      <div style={{ position: "absolute", left: bx, top: by, width: 22, height: 22, marginLeft: -11, marginTop: -11, borderRadius: "50%", background: WHITE, boxShadow: "0 0 18px rgba(255,255,255,0.9)" }} />
    </div>
  );
};

// ---- AI particles ----
const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const N = 60;
  return (
    <AbsoluteFill>
      {new Array(N).fill(0).map((_, i) => {
        const seed = i + 1;
        const sx = random(`x${seed}`) * 1080;
        const speed = 2 + random(`s${seed}`) * 4;
        const y = (1920 - ((frame * speed + random(`o${seed}`) * 1920) % 1920));
        const size = 3 + random(`z${seed}`) * 6;
        const op = interpolate(y, [0, 400, 1500, 1920], [0, 0.9, 0.9, 0]);
        return <div key={i} style={{ position: "absolute", left: sx, top: y, width: size, height: size, borderRadius: "50%", background: YELLOW, opacity: op, boxShadow: glow(YELLOW, 6) }} />;
      })}
    </AbsoluteFill>
  );
};

// ---- heatmap ----
const Heatmap: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 20 } });
  const cols = 12;
  const rows = 8;
  return (
    <div style={{ opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.92, 1])})`, width: 620, height: 280, borderRadius: 18, overflow: "hidden", border: `1px solid ${LINE}`, position: "relative", background: "#0d1a0f" }}>
      <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gridTemplateRows: `repeat(${rows},1fr)` }}>
        {new Array(cols * rows).fill(0).map((_, i) => {
          const cx = (i % cols) / cols;
          const cy = Math.floor(i / cols) / rows;
          // hotspot around center-right
          const d = Math.hypot(cx - 0.62, cy - 0.5);
          const intensity = Math.max(0, 1 - d * 2.2) * (0.6 + random(`h${i}`) * 0.4);
          const color = intensity > 0.6 ? YELLOW : intensity > 0.35 ? YELLOW_DEEP : intensity > 0.15 ? "rgba(245,158,11,0.4)" : "transparent";
          return <div key={i} style={{ background: color, opacity: interpolate(p, [0, 1], [0, intensity]) }} />;
        })}
      </div>
      <svg width={620} height={280} style={{ position: "absolute", inset: 0 }}>
        <rect x={8} y={8} width={604} height={264} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} rx={6} />
        <line x1={310} y1={8} x2={310} y2={272} stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
        <circle cx={310} cy={140} r={44} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
      </svg>
    </div>
  );
};

// SCENE 3 (12-22s) — MATCH & AI MAGIC. Hero moment.
export const Scene3AI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // upload progress 70-115
  const prog = interpolate(frame, [72, 112], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const uploadDone = frame > 112;
  // AI analyzing 120-195
  const aiActive = frame >= 118 && frame < 205;
  const aiPct = interpolate(frame, [122, 198], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // glow during AI
  const aiGlow = aiActive ? interpolate(Math.sin(frame / 6), [-1, 1], [0.2, 0.5]) : 0;

  const stats = [
    { label: "TOUCHES", to: 28, dec: 0, suffix: "" },
    { label: "DISTANCE", to: 8.4, dec: 1, suffix: " km" },
    { label: "POSSESSION", to: 67, dec: 0, suffix: "%" },
  ];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      {/* AI ambient glow */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${YELLOW}22, transparent 60%)`, opacity: aiGlow }} />

      {/* FIELD 0-70 */}
      <Sequence from={0} durationInFrames={72}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Field />
          <div style={{ position: "absolute", bottom: 200, fontFamily: display, color: WHITE, fontWeight: 800, fontSize: 56, textAlign: "center" }}>
            Coach uploads<br />the <span style={{ color: YELLOW }}>match video</span>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* UPLOAD 70-118 */}
      <Sequence from={70} durationInFrames={48}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: 640, background: CARD, border: `1px solid ${LINE}`, borderRadius: 28, padding: 50, boxShadow: "0 30px 80px -20px rgba(0,0,0,0.8)" }}>
            <div style={{ fontSize: 64, textAlign: "center", marginBottom: 20 }}>{uploadDone ? "✅" : "⬆️"}</div>
            <div style={{ fontFamily: display, color: WHITE, fontWeight: 800, fontSize: 34, textAlign: "center", marginBottom: 26 }}>
              {uploadDone ? "Upload complete" : "Uploading match.mp4"}
            </div>
            <div style={{ height: 22, borderRadius: 999, background: "#000", overflow: "hidden", border: `1px solid ${LINE}` }}>
              <div style={{ height: "100%", width: `${prog}%`, background: `linear-gradient(90deg, ${YELLOW}, ${YELLOW_DEEP})`, boxShadow: glow(YELLOW, 8) }} />
            </div>
            <div style={{ fontFamily: body, color: YELLOW, fontWeight: 800, fontSize: 30, textAlign: "right", marginTop: 14 }}>{Math.round(prog)}%</div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* AI ANALYZING 118-205 */}
      <Sequence from={118} durationInFrames={87}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Particles />
          <div style={{ position: "relative", width: 280, height: 280, marginBottom: 40 }}>
            <svg width={280} height={280} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={140} cy={140} r={120} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={14} />
              <circle cx={140} cy={140} r={120} fill="none" stroke={YELLOW} strokeWidth={14} strokeLinecap="round" strokeDasharray={2 * Math.PI * 120} strokeDashoffset={2 * Math.PI * 120 * (1 - aiPct / 100)} style={{ filter: `drop-shadow(0 0 12px ${YELLOW})` }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <div style={{ fontFamily: display, color: WHITE, fontWeight: 800, fontSize: 64 }}>{Math.round(aiPct)}%</div>
              <div style={{ fontFamily: body, color: YELLOW, fontWeight: 700, fontSize: 22, letterSpacing: 2 }}>ANALYZING</div>
            </div>
          </div>
          <div style={{ fontFamily: display, color: WHITE, fontWeight: 800, fontSize: 52, textAlign: "center" }}>
            AI does the <span style={{ color: YELLOW, textShadow: glow(YELLOW, 20) }}>heavy lifting</span>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* STAT EXPLOSION 205-300 */}
      <Sequence from={205}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 28 }}>
          <div style={{ display: "flex", gap: 22 }}>
            {stats.map((s, i) => {
              const sp = spring({ frame: frame - 205 - 6 - i * 8, fps, config: { damping: 11 } });
              return (
                <div
                  key={s.label}
                  style={{
                    opacity: sp,
                    transform: `scale(${interpolate(sp, [0, 1], [0.4, 1])})`,
                    width: 300,
                    background: CARD,
                    border: `1px solid ${YELLOW}44`,
                    borderRadius: 24,
                    padding: "34px 20px",
                    textAlign: "center",
                    boxShadow: glow(YELLOW, 12),
                  }}
                >
                  <div style={{ fontFamily: body, color: MUTED, fontWeight: 800, fontSize: 22, letterSpacing: 2, marginBottom: 12 }}>{s.label}</div>
                  <div style={{ fontFamily: display, color: YELLOW, fontWeight: 800, fontSize: 72, textShadow: glow(YELLOW, 16) }}>
                    <CountUp to={s.to} delay={205 + 8 + i * 8 - 205} dur={24} decimals={s.dec} suffix={s.suffix} />
                  </div>
                </div>
              );
            })}
          </div>
          <Heatmap delay={30} />
          <div style={{ fontFamily: display, color: WHITE, fontWeight: 800, fontSize: 50, textAlign: "center", marginTop: 8 }}>
            Every touch. <span style={{ color: YELLOW, textShadow: glow(YELLOW, 18) }}>Instantly tracked.</span>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
