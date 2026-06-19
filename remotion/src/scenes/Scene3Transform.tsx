import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { COLORS, FONT, glow } from "../theme";

const Card: React.FC<{ delay: number; title: string; tag: string; children: React.ReactNode }> = ({
  delay,
  title,
  tag,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 110 } });
  return (
    <div
      style={{
        opacity: s,
        transform: `translateX(${interpolate(s, [0, 1], [80, 0])}px)`,
        width: 820,
        borderRadius: 22,
        border: `1px solid ${COLORS.line}`,
        background: "linear-gradient(160deg, rgba(25,25,25,0.9), rgba(12,12,12,0.9))",
        padding: 28,
        fontFamily: FONT,
        boxShadow: "0 24px 60px -20px rgba(0,0,0,0.8)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.white }}>{title}</div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 1,
            color: COLORS.yellow,
            padding: "6px 14px",
            borderRadius: 999,
            background: `${COLORS.yellow}1a`,
          }}
        >
          {tag}
        </div>
      </div>
      {children}
    </div>
  );
};

const Bar: React.FC<{ label: string; pct: number; delay: number }> = ({ label, pct, delay }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame - delay, [0, 30], [0, pct], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: COLORS.muted, marginBottom: 6 }}>
        <span>{label}</span>
        <span style={{ color: COLORS.white, fontWeight: 700 }}>{Math.round(w)}</span>
      </div>
      <div style={{ height: 10, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{ width: `${w}%`, height: "100%", background: COLORS.yellow, borderRadius: 999 }} />
      </div>
    </div>
  );
};

export const Scene3Transform: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headS = spring({ frame: frame - 4, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          top: 150,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 42,
          fontWeight: 800,
          color: COLORS.white,
          opacity: headS,
          transform: `translateY(${interpolate(headS, [0, 1], [-30, 0])}px)`,
          padding: "0 60px",
          lineHeight: 1.2,
        }}
      >
        Coaches <span style={{ color: COLORS.yellow }}>see it.</span> Scouts{" "}
        <span style={{ color: COLORS.yellow }}>find you.</span>
        <br />
        Parents <span style={{ color: COLORS.yellow }}>understand it.</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 120 }}>
        {/* Player profile card */}
        <Card delay={20} title="Player Passport" tag="PLAYER">
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Img
              src={staticFile("images/logo.png")}
              style={{ width: 80, height: 80, borderRadius: 16, objectFit: "contain", background: "#000", border: `1px solid ${COLORS.line}` }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.white }}>Diego Ramirez</div>
              <div style={{ fontSize: 18, color: COLORS.muted }}>U-18 · Centre Back</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 52, fontWeight: 900, color: COLORS.yellow, textShadow: glow(COLORS.yellow, 24) }}>91</div>
              <div style={{ fontSize: 15, color: COLORS.muted, letterSpacing: 1 }}>CPI</div>
            </div>
          </div>
        </Card>

        {/* Coach dashboard */}
        <Card delay={45} title="Coach Dashboard" tag="COACH">
          <Bar label="Passing Drills" pct={86} delay={60} />
          <Bar label="Defensive Shape" pct={72} delay={68} />
          <Bar label="Fitness" pct={64} delay={76} />
        </Card>

        {/* Parent view */}
        <Card delay={70} title="Parent Updates" tag="PARENT">
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { v: "+3", l: "CPI THIS WEEK" },
              { v: "4", l: "SESSIONS" },
              { v: "A", l: "EFFORT" },
            ].map((s) => (
              <div key={s.l} style={{ flex: 1, textAlign: "center", padding: "14px 0", borderRadius: 14, background: "rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 34, fontWeight: 900, color: COLORS.yellow }}>{s.v}</div>
                <div style={{ fontSize: 13, color: COLORS.muted, letterSpacing: 1 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};
