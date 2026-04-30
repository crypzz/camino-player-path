import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const BLUE = "#5AB7F2";
const WHITE = "#FFFFFF";

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    width: "100%", maxWidth: 880, padding: 40, borderRadius: 28,
    background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
  }}>{children}</div>
);

const Beat: React.FC<{ label: string; title: string; children: React.ReactNode }> = ({ label, title, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18, stiffness: 180 } });
  const op = interpolate(s, [0, 1], [0, 1]);
  const y = interpolate(s, [0, 1], [30, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px", opacity: op, transform: `translateY(${y}px)` }}>
      <div style={{
        fontFamily: bodyFont, fontWeight: 700, fontSize: 22, color: GOLD,
        letterSpacing: "0.32em", marginBottom: 20,
      }}>{label}</div>
      <div style={{
        fontFamily, fontWeight: 800, fontSize: 64, color: WHITE,
        letterSpacing: "-0.03em", marginBottom: 40, textAlign: "center",
      }}>{title}</div>
      <Card>{children}</Card>
    </AbsoluteFill>
  );
};

// ----- Beat 1: Dashboard / Radar
const RadarMock = () => {
  const cx = 200, cy = 200, R = 150;
  const pts = [0.85, 0.7, 0.9, 0.78, 0.82, 0.72];
  const coords = pts.map((p, i) => {
    const a = (Math.PI * 2 * i) / pts.length - Math.PI / 2;
    return [cx + Math.cos(a) * R * p, cy + Math.sin(a) * R * p];
  });
  const path = coords.map((c, i) => (i === 0 ? "M" : "L") + c.join(",")).join(" ") + "Z";
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <svg width="400" height="400">
        {[0.25, 0.5, 0.75, 1].map((s) => (
          <circle key={s} cx={cx} cy={cy} r={R * s} fill="none" stroke="rgba(255,255,255,0.08)" />
        ))}
        <path d={path} fill={`${GOLD}33`} stroke={GOLD} strokeWidth="3" />
        {coords.map((c, i) => (
          <circle key={i} cx={c[0]} cy={c[1]} r="6" fill={GOLD} />
        ))}
      </svg>
    </div>
  );
};

// ----- Beat 2: AI Video Pitch Overlay
const PitchMock = () => (
  <div style={{
    width: "100%", aspectRatio: "16/10", borderRadius: 16,
    background: "linear-gradient(180deg, #1a4d2a, #0e2e18)",
    position: "relative", border: "2px solid rgba(255,255,255,0.1)",
  }}>
    {/* pitch lines */}
    <div style={{ position: "absolute", inset: 20, border: "2px solid rgba(255,255,255,0.4)", borderRadius: 6 }} />
    <div style={{ position: "absolute", top: "50%", left: 20, right: 20, height: 2, background: "rgba(255,255,255,0.4)" }} />
    <div style={{
      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
      width: 80, height: 80, border: "2px solid rgba(255,255,255,0.4)", borderRadius: "50%",
    }} />
    {/* event dots */}
    {[
      { x: 30, y: 35, color: GOLD, label: "PASS" },
      { x: 55, y: 60, color: BLUE, label: "DRIBBLE" },
      { x: 78, y: 28, color: "#ff5e7a", label: "GOAL" },
    ].map((e, i) => (
      <div key={i} style={{
        position: "absolute", left: `${e.x}%`, top: `${e.y}%`,
        transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: "50%", backgroundColor: e.color,
          boxShadow: `0 0 14px ${e.color}`,
        }} />
        <div style={{
          fontFamily: bodyFont, fontWeight: 700, fontSize: 14, color: WHITE,
          background: "rgba(0,0,0,0.6)", padding: "2px 8px", borderRadius: 6,
          letterSpacing: "0.1em",
        }}>{e.label}</div>
      </div>
    ))}
  </div>
);

// ----- Beat 3: Leaderboard
const LeaderboardMock = () => {
  const rows = [
    { rank: 1, name: "Mateo R.", cpi: 92, color: GOLD },
    { rank: 2, name: "Diego F.", cpi: 88, color: WHITE },
    { rank: 3, name: "Luca P.", cpi: 85, color: WHITE },
    { rank: 4, name: "Noah S.", cpi: 82, color: WHITE },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {rows.map((r) => (
        <div key={r.rank} style={{
          display: "flex", alignItems: "center", gap: 20, padding: "16px 20px",
          background: r.rank === 1 ? `${GOLD}14` : "rgba(255,255,255,0.04)",
          borderRadius: 14, border: r.rank === 1 ? `1px solid ${GOLD}66` : "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{
            fontFamily, fontWeight: 800, fontSize: 32, color: r.color, width: 44,
          }}>#{r.rank}</div>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "linear-gradient(135deg, #2a3142, #1a1f2e)",
          }} />
          <div style={{ flex: 1, fontFamily: bodyFont, fontWeight: 600, fontSize: 26, color: WHITE }}>{r.name}</div>
          <div style={{
            fontFamily, fontWeight: 800, fontSize: 32, color: r.color,
          }}>{r.cpi}</div>
        </div>
      ))}
    </div>
  );
};

// ----- Beat 4: Coach Feedback
const FeedbackMock = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      fontFamily: bodyFont, fontWeight: 700, fontSize: 22, color: GOLD,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: GOLD }} />
      COACH ALEX · VERIFIED
    </div>
    <div style={{
      fontFamily, fontWeight: 800, fontSize: 36, color: WHITE,
      letterSpacing: "-0.02em", lineHeight: 1.25,
    }}>
      "Elite first touch. Decision speed up <span style={{ color: GOLD }}>+18%</span> this month."
    </div>
    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
      {["VISION", "PASSING", "COMPOSURE"].map((t) => (
        <div key={t} style={{
          padding: "10px 18px", borderRadius: 999,
          border: `1px solid ${GOLD}88`, color: GOLD,
          fontFamily: bodyFont, fontWeight: 700, fontSize: 18, letterSpacing: "0.18em",
        }}>{t}</div>
      ))}
    </div>
  </div>
);

export const BagsProductMontageScene = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Sequence from={0} durationInFrames={30}>
        <Beat label="REAL DASHBOARD" title="Player intelligence."><RadarMock /></Beat>
      </Sequence>
      <Sequence from={30} durationInFrames={30}>
        <Beat label="AI VIDEO ANALYSIS" title="Every touch tagged."><PitchMock /></Beat>
      </Sequence>
      <Sequence from={60} durationInFrames={30}>
        <Beat label="GLOBAL LEADERBOARD" title="Ranked by data."><LeaderboardMock /></Beat>
      </Sequence>
      <Sequence from={90} durationInFrames={30}>
        <Beat label="COACH VERIFIED" title="Trusted feedback."><FeedbackMock /></Beat>
      </Sequence>
    </AbsoluteFill>
  );
};
