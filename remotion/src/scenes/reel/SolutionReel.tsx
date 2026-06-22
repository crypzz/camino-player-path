import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { AnimatedPitch } from "../../components/AnimatedPitch";
import { COLORS, FONT, glow } from "../../theme";

const CountUp: React.FC<{ to: number; label: string; suffix?: string; delay: number }> = ({ to, label, suffix = "", delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 40 });
  const val = Math.round(p * to);
  return (
    <div
      style={{
        flex: 1,
        textAlign: "center",
        padding: "18px 10px",
        borderRadius: 18,
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${COLORS.line}`,
        opacity: interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}
    >
      <div style={{ fontSize: 52, fontWeight: 900, color: COLORS.yellow, textShadow: glow(COLORS.yellow, 18) }}>
        {val}
        {suffix}
      </div>
      <div style={{ fontSize: 20, color: COLORS.muted, fontWeight: 700, letterSpacing: 1, marginTop: 4 }}>{label}</div>
    </div>
  );
};

const RisingGraph: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pts = [0, 18, 12, 40, 35, 62, 80, 100];
  const W = 760;
  const H = 200;
  const path = pts
    .map((v, i) => `${(i / (pts.length - 1)) * W},${H - (v / 100) * H}`)
    .join(" ");
  const dash = 1400;
  return (
    <svg width={W} height={H} style={{ marginTop: 24 }}>
      <polyline
        points={path}
        fill="none"
        stroke={COLORS.yellow}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 12px ${COLORS.yellow})`, strokeDasharray: dash, strokeDashoffset: dash * (1 - p) }}
      />
    </svg>
  );
};

// SCENE 3 — THE SOLUTION (8-14s). Yellow flash, logo, AI tracking + data reveal.
export const SolutionReel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flash = interpolate(frame, [0, 8, 18], [1, 0.5, 0], { extrapolateRight: "clamp" });
  const logoP = spring({ frame, fps, config: { damping: 14 }, durationInFrames: 30 });

  return (
    <AbsoluteFill style={{ fontFamily: FONT, alignItems: "center", justifyContent: "flex-start", paddingTop: 150 }}>
      {/* logo */}
      <div style={{ transform: `scale(${0.7 + logoP * 0.3})`, opacity: logoP, marginBottom: 28 }}>
        <Img src={staticFile("images/logo.png")} style={{ width: 130, filter: `drop-shadow(0 0 40px ${COLORS.yellow})` }} />
      </div>

      <Sequence from={18}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 320 }}>
          <AnimatedPitch />
          <div style={{ display: "flex", gap: 16, width: 760, marginTop: 28 }}>
            <CountUp to={3482} label="TOUCHES" delay={20} />
            <CountUp to={11} label="KM RUN" delay={28} />
            <CountUp to={92} label="PASS %" suffix="%" delay={36} />
          </div>
          <RisingGraph delay={44} />
        </AbsoluteFill>
      </Sequence>

      {/* rotating taglines */}
      <Sequence from={20} durationInFrames={45}>
        <Tag>Every touch. Counted.</Tag>
      </Sequence>
      <Sequence from={65} durationInFrames={45}>
        <Tag>Every run. Tracked.</Tag>
      </Sequence>
      <Sequence from={110}>
        <Tag>Every moment. Visible.</Tag>
      </Sequence>

      {/* yellow flash transition-in */}
      <AbsoluteFill style={{ background: COLORS.yellow, opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8, 36, 45], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame, [0, 10], [20, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 170 }}>
      <div
        style={{
          opacity: o,
          transform: `translateY(${y}px)`,
          color: COLORS.white,
          fontSize: 66,
          fontWeight: 900,
          letterSpacing: -1,
          textShadow: "0 6px 24px rgba(0,0,0,0.9)",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
