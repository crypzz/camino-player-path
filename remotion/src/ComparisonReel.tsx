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
   ============================================================ */

const { fontFamily: serif } = loadPlayfair("italic", { weights: ["500", "600", "700", "900"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });

const BG = "#0A0A0A";
const YELLOW = "#FCD34D";
const WHITE = "#F5F5F5";
const MUTED = "rgba(245,245,245,0.55)";
const glow = (c: string, s = 26) => `0 0 ${s}px ${c}, 0 0 ${s * 2}px ${c}44`;

/* ---------- shared helpers ---------- */
const useFade = (dur: number, inLen = 12, outLen = 12) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, inLen, dur - outLen, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const useRise = (delay = 0, distance = 40, damping = 20) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping, stiffness: 110 } });
  return { opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateY(${interpolate(s, [0, 1], [distance, 0])}px)` };
};

const useScaleIn = (delay = 0, from = 0.7, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping, stiffness: 130 } });
  return { opacity: interpolate(s, [0, 1], [0, 1]), transform: `scale(${interpolate(s, [0, 1], [from, 1])})` };
};

/* ---------- HOOK (0-3s, 90f) ---------- */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = useRise(2, 44, 22);
  const arrowY = Math.sin(frame / 6) * 10;
  const arrowO = interpolate(frame, [30, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = spring({ frame: frame - 2, fps, config: { damping: 22, stiffness: 110 } });
  const scale = interpolate(s, [0, 1], [0.92, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", opacity: useFade(90, 10, 8) }}>
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
      {/* down arrow */}
      <div style={{ position: "absolute", bottom: 200, opacity: arrowO, transform: `translateY(${arrowY}px)` }}>
        <svg width="66" height="66" viewBox="0 0 24 24" fill="none" stroke={YELLOW} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4v14M6 12l6 6 6-6" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- BEFORE mock cards ---------- */
const MockCard: React.FC<{ children: React.ReactNode; delay?: number; rotate?: number }> = ({ children, delay = 0, rotate = 0 }) => {
  const { opacity, transform } = useScaleIn(delay, 0.8, 16);
  return (
    <div
      style={{
        opacity,
        transform: `${transform} rotate(${rotate}deg)`,
        width: 720,
        borderRadius: 22,
        background: "linear-gradient(150deg, #1a1a1a, #121212)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 40px 90px -30px rgba(0,0,0,0.9)",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

const BeforeLabel: React.FC<{ text: React.ReactNode; delay?: number }> = ({ text, delay = 0 }) => {
  const { opacity, transform } = useRise(delay, 30, 20);
  return (
    <div
      style={{
        opacity,
        transform,
        position: "absolute",
        bottom: 230,
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

// TODO: replace this crumpled-attendance mock with a real photo/screen-recording
const BeforeCrumpled: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", filter: "saturate(0.55)", opacity: useFade(90) }}>
    <MockCard delay={2} rotate={-2}>
      <div style={{ padding: 40 }}>
        <div style={{ fontFamily: sans, fontSize: 22, fontWeight: 600, color: MUTED, letterSpacing: 1, textTransform: "uppercase" }}>Attendance</div>
        {["Present", "Present", "Absent", "Present", "—"].map((v, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px dashed rgba(255,255,255,0.12)", transform: `rotate(${i % 2 ? 0.6 : -0.4}deg)` }}>
            <span style={{ fontFamily: sans, fontSize: 30, color: WHITE }}>Practice {i + 1}</span>
            <span style={{ fontFamily: sans, fontSize: 30, color: MUTED }}>{v}</span>
          </div>
        ))}
        <div style={{ marginTop: 20, height: 12, background: "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 8px, transparent 8px 16px)", borderRadius: 6 }} />
      </div>
    </MockCard>
    <BeforeLabel delay={20} text={<>A <span style={{ color: MUTED }}>crumpled attendance sheet.</span></>} />
  </AbsoluteFill>
);

// TODO: replace this group-text mock with a real screen-recording
const BeforeGroupText: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", filter: "saturate(0.55)", opacity: useFade(90) }}>
    <MockCard delay={2}>
      <div style={{ padding: 44, minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
        <div style={{ fontFamily: sans, fontSize: 22, color: MUTED }}>Team Group Chat</div>
        <div style={{ alignSelf: "flex-start", background: "#2a2a2a", borderRadius: "22px 22px 22px 4px", padding: "22px 30px", maxWidth: 520 }}>
          <span style={{ fontFamily: sans, fontSize: 34, color: WHITE }}>good game today 👍</span>
        </div>
        <div style={{ alignSelf: "flex-start", background: "#222", borderRadius: "22px 22px 22px 4px", padding: "16px 26px", opacity: 0.5 }}>
          <span style={{ fontFamily: sans, fontSize: 26, color: MUTED }}>see everyone next week</span>
        </div>
      </div>
    </MockCard>
    <BeforeLabel delay={20} text={<>A text that just says <span style={{ color: MUTED }}>“good game.”</span></>} />
  </AbsoluteFill>
);

// TODO: replace this empty-progress mock with a real screen-recording
const BeforeEmptyProgress: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", filter: "saturate(0.55)", opacity: useFade(90) }}>
    <MockCard delay={2}>
      <div style={{ padding: 50, minHeight: 340, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="1.6">
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
        <div style={{ fontFamily: sans, fontSize: 34, fontWeight: 600, color: WHITE }}>Progress</div>
        <div style={{ fontFamily: sans, fontSize: 26, color: MUTED }}>This folder is empty</div>
      </div>
    </MockCard>
    <BeforeLabel delay={20} text={<>An empty <span style={{ color: MUTED }}>progress folder.</span></>} />
  </AbsoluteFill>
);

/* ---------- BEFORE closer: "that's it" ---------- */
const BeforeCloser: React.FC = () => {
  const l1 = useRise(4, 34, 22);
  const l2 = useRise(22, 34, 22);
  const l3 = useRise(44, 34, 22);
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
  const { opacity, transform } = useScaleIn(2, 0.6, 11);
  const line = interpolate(useCurrentFrame(), [22, 46], [0, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center", padding: "0 80px", opacity: useFade(90, 8, 8) }}>
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

/* ---------- AFTER feature cards ---------- */
const FeatureShell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => {
  const card = useScaleIn(2, 0.86, 15);
  const lbl = useRise(16, 30, 20);
  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", opacity: useFade(90, 10, 8) }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, rgba(252,211,77,0.08), transparent 62%)" }} />
      <div
        style={{
          ...card,
          width: 760,
          height: 760,
          borderRadius: 34,
          background: "linear-gradient(150deg, rgba(252,211,77,0.08), rgba(18,18,18,0.96))",
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

// TODO: replace with real position-heatmap dashboard screen-recording
const AfterHeatmap: React.FC = () => {
  const frame = useCurrentFrame();
  const cells = 8 * 12;
  return (
    <FeatureShell label="Real tracking">
      <div style={{ fontFamily: sans, fontSize: 22, color: MUTED, marginBottom: 20 }}>POSITION HEATMAP</div>
      <div style={{ flex: 1, borderRadius: 18, border: "1.5px solid rgba(255,255,255,0.12)", background: "#0d1a0d", position: "relative", overflow: "hidden", display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridTemplateRows: "repeat(12, 1fr)" }}>
        {Array.from({ length: cells }).map((_, i) => {
          const cx = (i % 8) - 3.5;
          const cy = Math.floor(i / 8) - 7;
          const dist = Math.sqrt(cx * cx + cy * cy);
          const base = Math.max(0, 1 - dist / 6);
          const pulse = 0.5 + 0.5 * Math.sin(frame / 8 + i * 0.3);
          const a = base * (0.35 + 0.65 * pulse) * interpolate(frame, [6, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <div key={i} style={{ background: `rgba(252,211,77,${a})` }} />;
        })}
        {/* pitch center line */}
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.15)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 100, height: 100, border: "2px solid rgba(255,255,255,0.15)", borderRadius: "50%", transform: "translate(-50%,-50%)" }} />
      </div>
    </FeatureShell>
  );
};

// TODO: replace with real development line-chart dashboard screen-recording
const AfterLineChart: React.FC = () => {
  const frame = useCurrentFrame();
  const pts = [0.2, 0.32, 0.28, 0.45, 0.55, 0.5, 0.68, 0.82];
  const prog = interpolate(frame, [6, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const W = 640, H = 480;
  const shown = Math.max(2, Math.floor(prog * pts.length));
  const path = pts
    .slice(0, shown)
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * W} ${H - p * H}`)
    .join(" ");
  return (
    <FeatureShell label="Actual development">
      <div style={{ fontFamily: sans, fontSize: 22, color: MUTED, marginBottom: 20 }}>CPI · WEEK OVER WEEK</div>
      <div style={{ flex: 1, position: "relative" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1={0} x2={W} y1={H - g * H} y2={H - g * H} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
          ))}
          <path d={`${path} L ${((shown - 1) / (pts.length - 1)) * W} ${H} L 0 ${H} Z`} fill="rgba(252,211,77,0.14)" />
          <path d={path} fill="none" stroke={YELLOW} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 12px rgba(252,211,77,0.6))" }} />
          {pts.slice(0, shown).map((p, i) => (
            <circle key={i} cx={(i / (pts.length - 1)) * W} cy={H - p * H} r={7} fill={YELLOW} />
          ))}
        </svg>
      </div>
    </FeatureShell>
  );
};

// TODO: replace with real scouting-profile dashboard screen-recording
const AfterScoutProfile: React.FC = () => {
  const frame = useCurrentFrame();
  const attrs = [
    ["Pace", 0.86],
    ["Passing", 0.74],
    ["Vision", 0.9],
    ["Finishing", 0.68],
    ["Defending", 0.6],
  ] as const;
  return (
    <FeatureShell label="Seen by scouts">
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
        <div style={{ width: 110, height: 110, borderRadius: "50%", background: "linear-gradient(135deg, #333, #1a1a1a)", border: `2px solid ${YELLOW}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontStyle: "italic", fontSize: 48, color: YELLOW }}>
          10
        </div>
        <div>
          <div style={{ fontFamily: sans, fontSize: 40, fontWeight: 800, color: WHITE }}>A. Rossi</div>
          <div style={{ fontFamily: sans, fontSize: 24, color: MUTED }}>Winger · U15 · Verified</div>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 22 }}>
        {attrs.map(([name, v], i) => {
          const w = v * interpolate(frame, [10 + i * 5, 40 + i * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={name}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: sans, fontSize: 26, color: WHITE, marginBottom: 8 }}>
                <span>{name}</span>
                <span style={{ color: YELLOW }}>{Math.round(v * 99)}</span>
              </div>
              <div style={{ height: 12, borderRadius: 6, background: "rgba(255,255,255,0.08)" }}>
                <div style={{ height: "100%", width: `${w * 100}%`, borderRadius: 6, background: `linear-gradient(90deg, ${YELLOW}, #F59E0B)` }} />
              </div>
            </div>
          );
        })}
      </div>
    </FeatureShell>
  );
};

// TODO: replace with real transfer-marketplace dashboard screen-recording
const AfterMarketplace: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = ["Elite Academy FC", "Northside United", "Metro Talent ID"];
  return (
    <FeatureShell label="A path forward">
      <div style={{ fontFamily: sans, fontSize: 22, color: MUTED, marginBottom: 20 }}>TRANSFER MARKETPLACE</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18, justifyContent: "center" }}>
        {rows.map((r, i) => {
          const { opacity, transform } = (() => {
            const s = interpolate(frame, [10 + i * 8, 30 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return { opacity: s, transform: `translateX(${interpolate(s, [0, 1], [40, 0])}px)` };
          })();
          return (
            <div key={r} style={{ opacity, transform, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 26px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(252,211,77,0.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg,#F59E0B,#FCD34D)" }} />
                <span style={{ fontFamily: sans, fontSize: 30, fontWeight: 600, color: WHITE }}>{r}</span>
              </div>
              <span style={{ fontFamily: sans, fontSize: 22, fontWeight: 700, color: YELLOW, border: `1px solid ${YELLOW}`, borderRadius: 20, padding: "6px 18px" }}>Interested</span>
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
  const line1 = useRise(4, 40, 20);
  const logo = useScaleIn(40, 0.7, 12);
  const tag = useRise(56, 26, 22);
  const line = interpolate(frame, [44, 66], [0, 460], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", padding: "0 90px", opacity: useFade(150, 10, 10) }}>
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
      <Series.Sequence durationInFrames={95}><AfterHeatmap /></Series.Sequence>
      <Series.Sequence durationInFrames={95}><AfterLineChart /></Series.Sequence>
      <Series.Sequence durationInFrames={95}><AfterScoutProfile /></Series.Sequence>
      <Series.Sequence durationInFrames={95}><AfterMarketplace /></Series.Sequence>

      {/* CTA — ~5s */}
      <Series.Sequence durationInFrames={160}><CTA /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
