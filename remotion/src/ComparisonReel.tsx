import {
  AbsoluteFill,
  Series,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

/* ============================================================
   ComparisonReel — "what most academies give you vs Camino"
   1080x1920 · 30fps · ~33s (990 frames)
   Fully realized motion graphics — no placeholders.
   ============================================================ */

const { fontFamily: serif } = loadPlayfair("italic", { weights: ["500", "600", "700", "900"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });

const BG = "#0A0A0A";
const YELLOW = "#FCD34D";
const AMBER = "#F59E0B";
const WHITE = "#F5F5F5";
const MUTED = "rgba(245,245,245,0.55)";
const DULL = "rgba(245,245,245,0.34)";
const glow = (c: string, s = 26) => `0 0 ${s}px ${c}, 0 0 ${s * 2}px ${c}44`;

/* ---------- shared helpers ---------- */
const useFade = (dur: number, inLen = 12, outLen = 12) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, inLen, dur - outLen, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const useRise = (delay = 0, distance = 40, damping = 22) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping, stiffness: 110, mass: 0.9 } });
  return { opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateY(${interpolate(s, [0, 1], [distance, 0])}px)` };
};

const useScaleIn = (delay = 0, from = 0.86, damping = 18) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping, stiffness: 120, mass: 0.9 } });
  return { opacity: interpolate(s, [0, 1], [0, 1]), transform: `scale(${interpolate(s, [0, 1], [from, 1])})` };
};

/* ---------- HOOK (0-3s, 90f) ---------- */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = useRise(2, 44, 24);
  const arrowY = Math.sin(frame / 6) * 10;
  const arrowO = interpolate(frame, [30, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = spring({ frame: frame - 2, fps, config: { damping: 24, stiffness: 110 } });
  const scale = interpolate(s, [0, 1], [0.93, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", opacity: useFade(90, 10, 8) }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.04), transparent 60%)" }} />
      <div
        style={{
          ...rise,
          transform: `${rise.transform} scale(${scale})`,
          textAlign: "center",
          padding: "0 90px",
          fontFamily: serif,
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 96,
          lineHeight: 1.08,
          color: WHITE,
          letterSpacing: -1,
          textShadow: "0 12px 50px rgba(0,0,0,0.9)",
        }}
      >
        What most Canadian academies actually{" "}
        <span style={{ color: YELLOW, textShadow: glow(YELLOW, 22) }}>give your kid</span>
      </div>
      <div style={{ position: "absolute", bottom: 200, opacity: arrowO, transform: `translateY(${arrowY}px)` }}>
        <svg width="66" height="66" viewBox="0 0 24 24" fill="none" stroke={YELLOW} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4v14M6 12l6 6 6-6" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- BEFORE mock card shell ---------- */
const MockCard: React.FC<{ children: React.ReactNode; delay?: number; rotate?: number }> = ({ children, delay = 0, rotate = 0 }) => {
  const { opacity, transform } = useScaleIn(delay, 0.86, 18);
  return (
    <div
      style={{
        opacity,
        transform: `${transform} rotate(${rotate}deg)`,
        width: 720,
        borderRadius: 24,
        background: "linear-gradient(150deg, #1a1a1a, #101010)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 40px 90px -34px rgba(0,0,0,0.9)",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

const BeforeLabel: React.FC<{ text: React.ReactNode; delay?: number }> = ({ text, delay = 0 }) => {
  const { opacity, transform } = useRise(delay, 30, 22);
  return (
    <div
      style={{
        opacity,
        transform,
        position: "absolute",
        bottom: 220,
        left: 0,
        right: 0,
        textAlign: "center",
        padding: "0 80px",
        fontFamily: sans,
        fontWeight: 700,
        fontSize: 46,
        color: WHITE,
        lineHeight: 1.15,
        textShadow: "0 8px 30px rgba(0,0,0,0.9)",
      }}
    >
      {text}
    </div>
  );
};

const BeforeChrome: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
    <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#3a3a3a" }} />
    <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#333" }} />
    <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#2c2c2c" }} />
    <span style={{ marginLeft: 14, fontFamily: sans, fontSize: 22, fontWeight: 600, color: DULL, letterSpacing: 0.5 }}>{title}</span>
  </div>
);

const BeforeShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", filter: "saturate(0.5)", opacity: useFade(90) }}>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.4))" }} />
    {children}
  </AbsoluteFill>
);

/* BEFORE 1 — attendance sheet */
const BeforeCrumpled: React.FC = () => (
  <BeforeShell>
    <MockCard delay={2} rotate={-1.4}>
      <BeforeChrome title="attendance.xlsx" />
      <div style={{ padding: "36px 40px 44px" }}>
        <div style={{ fontFamily: sans, fontSize: 20, fontWeight: 600, color: DULL, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Fall Season · Attendance</div>
        {["Practice 1", "Practice 2", "Practice 3", "Practice 4", "Practice 5"].map((p, i) => {
          const v = ["Present", "Present", "Absent", "Present", "—"][i];
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderBottom: "1px dashed rgba(255,255,255,0.1)" }}>
              <span style={{ fontFamily: sans, fontSize: 30, color: DULL }}>{p}</span>
              <span style={{ fontFamily: sans, fontSize: 26, color: v === "Absent" ? "rgba(200,120,120,0.5)" : DULL, fontWeight: 500 }}>{v}</span>
            </div>
          );
        })}
        <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ flex: 1, height: 10, borderRadius: 5, background: "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 8px, transparent 8px 16px)" }} />
          ))}
        </div>
      </div>
    </MockCard>
    <BeforeLabel delay={20} text={<>A <span style={{ color: DULL }}>crumpled attendance sheet.</span></>} />
  </BeforeShell>
);

/* BEFORE 2 — group text */
const BeforeGroupText: React.FC = () => (
  <BeforeShell>
    <MockCard delay={2} rotate={0.8}>
      <BeforeChrome title="Team Group Chat" />
      <div style={{ padding: "40px 40px 48px", minHeight: 340, display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
        <div style={{ alignSelf: "flex-start", background: "#242424", borderRadius: "22px 22px 22px 4px", padding: "22px 30px", maxWidth: 520 }}>
          <span style={{ fontFamily: sans, fontSize: 34, color: DULL }}>good game today 👍</span>
        </div>
        <div style={{ alignSelf: "flex-start", background: "#1e1e1e", borderRadius: "22px 22px 22px 4px", padding: "18px 28px", maxWidth: 460 }}>
          <span style={{ fontFamily: sans, fontSize: 28, color: DULL }}>see everyone next week</span>
        </div>
        <div style={{ alignSelf: "flex-end", background: "#2b2b2b", borderRadius: "22px 22px 4px 22px", padding: "16px 26px" }}>
          <span style={{ fontFamily: sans, fontSize: 26, color: DULL }}>👍</span>
        </div>
      </div>
    </MockCard>
    <BeforeLabel delay={20} text={<>A text that just says <span style={{ color: DULL }}>“good game.”</span></>} />
  </BeforeShell>
);

/* BEFORE 3 — empty progress folder */
const BeforeEmptyProgress: React.FC = () => (
  <BeforeShell>
    <MockCard delay={2} rotate={-0.8}>
      <BeforeChrome title="Player Development" />
      <div style={{ padding: 56, minHeight: 380, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
        <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke={DULL} strokeWidth="1.4">
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
        <div style={{ fontFamily: sans, fontSize: 36, fontWeight: 600, color: DULL }}>Progress</div>
        <div style={{ fontFamily: sans, fontSize: 26, color: "rgba(245,245,245,0.24)" }}>This folder is empty</div>
        <div style={{ display: "flex", gap: 14, marginTop: 8, opacity: 0.5 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 90, height: 60, borderRadius: 8, border: "1.5px dashed rgba(255,255,255,0.12)" }} />
          ))}
        </div>
      </div>
    </MockCard>
    <BeforeLabel delay={20} text={<>An empty <span style={{ color: DULL }}>progress folder.</span></>} />
  </BeforeShell>
);

/* BEFORE closer */
const BeforeCloser: React.FC = () => {
  const l1 = useRise(4, 34, 24);
  const l2 = useRise(22, 34, 24);
  const l3 = useRise(44, 34, 24);
  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", padding: "0 90px", opacity: useFade(90, 10, 8) }}>
      <div style={{ textAlign: "center", fontFamily: sans, fontWeight: 700, fontSize: 62, color: WHITE, lineHeight: 1.3 }}>
        <div style={l1}>A participation medal.</div>
        <div style={{ ...l2, marginTop: 14 }}>A team photo.</div>
        <div style={{ ...l3, marginTop: 24, fontFamily: serif, fontStyle: "italic", color: MUTED, fontSize: 56 }}>
          And… <span style={{ color: YELLOW, textShadow: glow(YELLOW, 18) }}>that&apos;s it.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- THE TURN (12-15s) ---------- */
const Turn: React.FC = () => {
  const { opacity, transform } = useScaleIn(2, 0.7, 13);
  const line = interpolate(useCurrentFrame(), [22, 46], [0, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center", padding: "0 80px", opacity: useFade(90, 8, 8) }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(252,211,77,0.08), transparent 60%)" }} />
      <div
        style={{
          opacity,
          transform,
          textAlign: "center",
          fontFamily: serif,
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 92,
          lineHeight: 1.1,
          color: YELLOW,
          textShadow: glow(YELLOW, 26),
        }}
      >
        Here&apos;s what they should be getting.
      </div>
      <div style={{ height: 3, width: line, marginTop: 30, background: `linear-gradient(90deg, transparent, ${YELLOW}, transparent)` }} />
    </AbsoluteFill>
  );
};

/* ---------- AFTER feature shell ---------- */
const FeatureShell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => {
  const card = useScaleIn(2, 0.9, 16);
  const lbl = useRise(16, 30, 22);
  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", opacity: useFade(90, 10, 8) }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(252,211,77,0.08), transparent 62%)" }} />
      <div
        style={{
          ...card,
          width: 760,
          height: 760,
          borderRadius: 34,
          background: "linear-gradient(150deg, rgba(252,211,77,0.08), rgba(16,16,16,0.97))",
          border: "1px solid rgba(252,211,77,0.28)",
          boxShadow: "0 50px 110px -35px rgba(0,0,0,0.95)",
          overflow: "hidden",
          padding: 40,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
      <div style={{ ...lbl, marginTop: 44, textAlign: "center" }}>
        <div style={{ fontFamily: sans, fontSize: 24, fontWeight: 700, letterSpacing: 4, color: YELLOW, textTransform: "uppercase" }}>Camino</div>
        <div style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 700, fontSize: 68, color: WHITE, marginTop: 8, textShadow: glow(YELLOW, 8) }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

/* AFTER 1 — live tracking pitch with moving dots + trails */
const AfterTracking: React.FC = () => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [6, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // pitch drawing area in %
  const players = [
    { color: YELLOW, path: (t: number) => ({ x: 30 + 14 * Math.sin(t * 0.9), y: 40 + 18 * Math.cos(t * 0.7) }) },
    { color: "#7dd3fc", path: (t: number) => ({ x: 62 + 12 * Math.cos(t * 0.8 + 1), y: 55 + 15 * Math.sin(t * 0.6 + 2) }) },
    { color: "#f472b6", path: (t: number) => ({ x: 48 + 16 * Math.sin(t * 0.6 + 3), y: 68 + 12 * Math.cos(t * 0.9 + 1) }) },
  ];
  const t = frame / 14;
  const TRAIL = 14;

  return (
    <FeatureShell label="Real tracking">
      <div style={{ fontFamily: sans, fontSize: 22, color: MUTED, marginBottom: 20, letterSpacing: 1 }}>LIVE POSITION TRACKING</div>
      <div style={{ flex: 1, borderRadius: 18, border: "1.5px solid rgba(255,255,255,0.14)", background: "linear-gradient(160deg,#0e1a0e,#0a140a)", position: "relative", overflow: "hidden", opacity: appear }}>
        {/* pitch markings */}
        <div style={{ position: "absolute", inset: 24, border: "2px solid rgba(255,255,255,0.14)", borderRadius: 6 }} />
        <div style={{ position: "absolute", top: "50%", left: 24, right: 24, height: 2, background: "rgba(255,255,255,0.12)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 120, height: 120, border: "2px solid rgba(255,255,255,0.12)", borderRadius: "50%", transform: "translate(-50%,-50%)" }} />
        {/* penalty boxes */}
        <div style={{ position: "absolute", top: 24, left: "50%", width: 220, height: 90, border: "2px solid rgba(255,255,255,0.1)", borderTop: "none", transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", bottom: 24, left: "50%", width: 220, height: 90, border: "2px solid rgba(255,255,255,0.1)", borderBottom: "none", transform: "translateX(-50%)" }} />

        {/* players with trails */}
        {players.map((p, pi) => {
          const now = p.path(t);
          return (
            <div key={pi}>
              {Array.from({ length: TRAIL }).map((_, i) => {
                const past = p.path(t - i * 0.16);
                const a = (1 - i / TRAIL) * 0.5 * appear;
                const size = 10 + (1 - i / TRAIL) * 6;
                return (
                  <div key={i} style={{ position: "absolute", left: `${past.x}%`, top: `${past.y}%`, width: size, height: size, borderRadius: "50%", background: p.color, opacity: a, transform: "translate(-50%,-50%)", filter: "blur(1px)" }} />
                );
              })}
              <div style={{ position: "absolute", left: `${now.x}%`, top: `${now.y}%`, width: 26, height: 26, borderRadius: "50%", background: p.color, opacity: appear, transform: "translate(-50%,-50%)", boxShadow: `0 0 16px ${p.color}, 0 0 4px #000`, border: "2px solid rgba(0,0,0,0.4)" }} />
            </div>
          );
        })}

        {/* live badge */}
        <div style={{ position: "absolute", top: 18, left: 18, display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.5)", borderRadius: 20, padding: "6px 14px", opacity: appear }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5555", opacity: 0.5 + 0.5 * Math.sin(frame / 5) }} />
          <span style={{ fontFamily: sans, fontSize: 18, fontWeight: 700, color: WHITE, letterSpacing: 1 }}>LIVE</span>
        </div>
      </div>
    </FeatureShell>
  );
};

/* AFTER 2 — self-drawing line chart with ticking stat + week axis */
const AfterLineChart: React.FC = () => {
  const frame = useCurrentFrame();
  const pts = [42, 46, 44, 53, 58, 56, 67, 78, 84];
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9"];
  const prog = interpolate(frame, [8, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const W = 640, H = 440;
  const norm = (p: number) => (p - 30) / 60; // to 0..1
  const shownF = prog * (pts.length - 1);
  const shown = Math.max(1, Math.floor(shownF)) + 1;

  const xAt = (i: number) => (i / (pts.length - 1)) * W;
  const yAt = (p: number) => H - norm(p) * H;

  const path = pts.slice(0, shown).map((p, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(p)}`).join(" ");
  // interpolated current value (ticking number)
  const iLo = Math.min(pts.length - 1, Math.floor(shownF));
  const iHi = Math.min(pts.length - 1, iLo + 1);
  const frac = shownF - iLo;
  const currentVal = Math.round(pts[iLo] + (pts[iHi] - pts[iLo]) * frac);
  const lastI = shown - 1;

  return (
    <FeatureShell label="Actual development">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
        <div style={{ fontFamily: sans, fontSize: 22, color: MUTED, letterSpacing: 1 }}>CPI · WEEK OVER WEEK</div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontFamily: sans, fontSize: 72, fontWeight: 800, color: YELLOW, textShadow: glow(YELLOW, 10), lineHeight: 1 }}>{currentVal}</span>
          <span style={{ fontFamily: sans, fontSize: 26, color: MUTED, marginLeft: 6 }}>CPI</span>
        </div>
      </div>
      <div style={{ flex: 1, position: "relative" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: "visible" }}>
          {[0.25, 0.5, 0.75, 1].map((g) => (
            <line key={g} x1={0} x2={W} y1={H - g * H} y2={H - g * H} stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
          ))}
          {shown >= 2 && (
            <path d={`${path} L ${xAt(lastI)} ${H} L 0 ${H} Z`} fill="rgba(252,211,77,0.14)" />
          )}
          <path d={path} fill="none" stroke={YELLOW} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 12px rgba(252,211,77,0.6))" }} />
          {pts.slice(0, shown).map((p, i) => (
            <circle key={i} cx={xAt(i)} cy={yAt(p)} r={i === lastI ? 10 : 6} fill={YELLOW} />
          ))}
        </svg>
        {/* moving head glow */}
        <div style={{ position: "absolute", left: `${(xAt(lastI) / W) * 100}%`, top: `${(yAt(pts[lastI]) / H) * 100}%`, width: 22, height: 22, borderRadius: "50%", background: YELLOW, transform: "translate(-50%,-50%)", boxShadow: glow(YELLOW, 14), opacity: 0.5 + 0.5 * Math.sin(frame / 4) }} />
      </div>
      {/* week axis */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
        {weeks.map((w, i) => (
          <span key={w} style={{ fontFamily: sans, fontSize: 20, fontWeight: 600, color: i < shown ? WHITE : DULL }}>{w}</span>
        ))}
      </div>
    </FeatureShell>
  );
};

/* AFTER 3 — scouting profile card */
const AfterScoutProfile: React.FC = () => {
  const frame = useCurrentFrame();
  const attrs = [
    ["Pace", 86],
    ["Passing", 74],
    ["Vision", 90],
    ["Finishing", 68],
    ["Defending", 61],
  ] as const;
  const badge = useScaleIn(30, 0.6, 12);
  return (
    <FeatureShell label="Seen by scouts">
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 22, position: "relative" }}>
        <div style={{ width: 118, height: 118, borderRadius: "50%", background: "linear-gradient(135deg, #333, #1a1a1a)", border: `2px solid ${YELLOW}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontStyle: "italic", fontSize: 52, color: YELLOW }}>
          10
        </div>
        <div>
          <div style={{ fontFamily: sans, fontSize: 42, fontWeight: 800, color: WHITE }}>A. Rossi</div>
          <div style={{ fontFamily: sans, fontSize: 24, color: MUTED, marginTop: 4 }}>Winger · U15 · CPI 84</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 10, background: "rgba(252,211,77,0.14)", border: "1px solid rgba(252,211,77,0.4)", borderRadius: 20, padding: "5px 14px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={YELLOW} strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" /></svg>
            <span style={{ fontFamily: sans, fontSize: 18, fontWeight: 700, color: YELLOW, letterSpacing: 0.5 }}>Verified profile</span>
          </div>
        </div>
        {/* viewed-by badge */}
        <div style={{ ...badge, position: "absolute", top: -6, right: -6, display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "8px 14px" }}>
          <div style={{ display: "flex" }}>
            {["#F59E0B", "#7dd3fc", "#f472b6"].map((c, i) => (
              <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: "2px solid #101010", marginLeft: i ? -8 : 0 }} />
            ))}
          </div>
          <span style={{ fontFamily: sans, fontSize: 17, fontWeight: 700, color: WHITE }}>+12 scouts</span>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
        {attrs.map(([name, v], i) => {
          const p = interpolate(frame, [10 + i * 5, 42 + i * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const shownVal = Math.round((v as number) * p);
          return (
            <div key={name}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: sans, fontSize: 26, color: WHITE, marginBottom: 8 }}>
                <span>{name}</span>
                <span style={{ color: YELLOW, fontWeight: 700 }}>{shownVal}</span>
              </div>
              <div style={{ height: 14, borderRadius: 7, background: "rgba(255,255,255,0.08)" }}>
                <div style={{ height: "100%", width: `${(v as number) * p}%`, borderRadius: 7, background: `linear-gradient(90deg, ${AMBER}, ${YELLOW})`, boxShadow: glow(YELLOW, 6) }} />
              </div>
            </div>
          );
        })}
      </div>
    </FeatureShell>
  );
};

/* AFTER 4 — transfer marketplace */
const AfterMarketplace: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [
    { name: "Elite Academy FC", tier: "Pro Pathway", status: "Interested", price: "Trial offer", g1: "#F59E0B", g2: "#FCD34D", shape: 0 },
    { name: "Northside United", tier: "U17 Elite", status: "Scouting", price: "Watching", g1: "#7dd3fc", g2: "#38bdf8", shape: 1 },
    { name: "Metro Talent ID", tier: "Regional", status: "Invited", price: "Combine", g1: "#f472b6", g2: "#ec4899", shape: 2 },
  ];
  return (
    <FeatureShell label="A path forward">
      <div style={{ fontFamily: sans, fontSize: 22, color: MUTED, marginBottom: 20, letterSpacing: 1 }}>TRANSFER MARKETPLACE</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, justifyContent: "center" }}>
        {rows.map((r, i) => {
          const s = interpolate(frame, [8 + i * 9, 30 + i * 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const opacity = s;
          const transform = `translateX(${interpolate(s, [0, 1], [50, 0])}px)`;
          return (
            <div key={r.name} style={{ opacity, transform, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 26px", borderRadius: 18, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(252,211,77,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                {/* geometric placeholder club badge */}
                <div style={{ width: 56, height: 60, borderRadius: "8px 8px 12px 12px", background: `linear-gradient(140deg, ${r.g1}, ${r.g2})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px -6px rgba(0,0,0,0.6)" }}>
                  {r.shape === 0 && <div style={{ width: 20, height: 20, background: "rgba(0,0,0,0.35)", transform: "rotate(45deg)" }} />}
                  {r.shape === 1 && <div style={{ width: 24, height: 24, borderRadius: "50%", border: "4px solid rgba(0,0,0,0.35)" }} />}
                  {r.shape === 2 && <div style={{ width: 0, height: 0, borderLeft: "13px solid transparent", borderRight: "13px solid transparent", borderBottom: "22px solid rgba(0,0,0,0.35)" }} />}
                </div>
                <div>
                  <div style={{ fontFamily: sans, fontSize: 30, fontWeight: 700, color: WHITE }}>{r.name}</div>
                  <div style={{ fontFamily: sans, fontSize: 20, color: MUTED, marginTop: 2 }}>{r.tier}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <span style={{ fontFamily: sans, fontSize: 20, fontWeight: 700, color: YELLOW, border: `1px solid ${YELLOW}`, borderRadius: 20, padding: "5px 16px" }}>{r.status}</span>
                <span style={{ fontFamily: sans, fontSize: 18, color: MUTED }}>{r.price}</span>
              </div>
            </div>
          );
        })}
      </div>
    </FeatureShell>
  );
};

/* ---------- CTA (28-33s) ---------- */
const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const line1 = useRise(4, 40, 22);
  const logo = useScaleIn(40, 0.72, 13);
  const tag = useRise(56, 26, 24);
  const line = interpolate(frame, [44, 66], [0, 460], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", padding: "0 90px", opacity: useFade(160, 10, 12) }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, rgba(252,211,77,0.1), transparent 62%)" }} />
      <div
        style={{
          ...line1,
          textAlign: "center",
          fontFamily: sans,
          fontWeight: 800,
          fontSize: 66,
          lineHeight: 1.2,
          color: WHITE,
          letterSpacing: -1,
        }}
      >
        Tag a soccer parent who&apos;s tired of the{" "}
        <span style={{ color: YELLOW, textShadow: glow(YELLOW, 20) }}>participation medal.</span>
      </div>

      <div style={{ ...logo, marginTop: 90, textAlign: "center" }}>
        <div style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 900, fontSize: 118, color: WHITE, letterSpacing: -2, textShadow: glow(YELLOW, 10) }}>
          Camino
        </div>
      </div>
      <div style={{ height: 3, width: line, marginTop: 14, background: `linear-gradient(90deg, transparent, ${YELLOW}, transparent)` }} />
      <div style={{ ...tag, marginTop: 22, fontFamily: sans, fontWeight: 600, fontSize: 38, letterSpacing: 2, color: YELLOW }}>
        Develop like it matters.
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Composition: 990 frames @ 30fps = 33s ---------- */
export const ComparisonReel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <Series>
      {/* HOOK — 3s */}
      <Series.Sequence durationInFrames={90}><Hook /></Series.Sequence>

      {/* BEFORE — ~9s */}
      <Series.Sequence durationInFrames={70}><BeforeCrumpled /></Series.Sequence>
      <Series.Sequence durationInFrames={70}><BeforeGroupText /></Series.Sequence>
      <Series.Sequence durationInFrames={70}><BeforeEmptyProgress /></Series.Sequence>
      <Series.Sequence durationInFrames={60}><BeforeCloser /></Series.Sequence>

      {/* THE TURN — 3s */}
      <Series.Sequence durationInFrames={90}><Turn /></Series.Sequence>

      {/* AFTER — ~13s */}
      <Series.Sequence durationInFrames={95}><AfterTracking /></Series.Sequence>
      <Series.Sequence durationInFrames={95}><AfterLineChart /></Series.Sequence>
      <Series.Sequence durationInFrames={95}><AfterScoutProfile /></Series.Sequence>
      <Series.Sequence durationInFrames={95}><AfterMarketplace /></Series.Sequence>

      {/* CTA — ~5s */}
      <Series.Sequence durationInFrames={160}><CTA /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
