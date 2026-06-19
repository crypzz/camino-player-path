import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { COLORS, FONT, glow } from "../theme";

const Line: React.FC<{ children: React.ReactNode; delay: number; color: string; size: number; sub?: boolean }> = ({
  children,
  delay,
  color,
  size,
  sub,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120 } });
  const y = interpolate(s, [0, 1], [60, 0]);
  const blur = interpolate(s, [0, 1], [12, 0]);
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${y}px)`,
        filter: `blur(${blur}px)`,
        color,
        fontFamily: FONT,
        fontWeight: sub ? 600 : 900,
        fontSize: size,
        lineHeight: 1.05,
        letterSpacing: -1,
        textAlign: "center",
        textShadow: sub ? "none" : glow("rgba(252,211,77,0.35)", 30),
        padding: "0 60px",
      }}
    >
      {children}
    </div>
  );
};

export const Scene1Problem: React.FC = () => {
  const frame = useCurrentFrame();

  // hidden / blurred stats representing unseen potential
  const statBlur = interpolate(frame, [120, 180], [2, 14], { extrapolateRight: "clamp" });
  const statOpacity = interpolate(frame, [110, 140, 200], [0, 0.5, 0.25], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <Sequence from={0}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28, alignItems: "center" }}>
          <Line delay={6} color={COLORS.yellow} size={92}>
            You work hard
            <br />
            every game
          </Line>
          <Line delay={70} color={COLORS.white} size={56} sub>
            But nobody sees
            <br />
            the real you
          </Line>
        </div>
      </Sequence>

      {/* hidden potential stats — blurred, muted */}
      <div
        style={{
          position: "absolute",
          bottom: 220,
          display: "flex",
          gap: 24,
          opacity: statOpacity,
          filter: `blur(${statBlur}px)`,
        }}
      >
        {[
          { v: "?", l: "TOUCHES" },
          { v: "?", l: "DISTANCE" },
          { v: "?", l: "RATING" },
        ].map((s) => (
          <div
            key={s.l}
            style={{
              width: 200,
              padding: "24px 0",
              borderRadius: 18,
              border: `1px solid ${COLORS.line}`,
              background: "rgba(255,255,255,0.03)",
              textAlign: "center",
              fontFamily: FONT,
            }}
          >
            <div style={{ fontSize: 56, fontWeight: 900, color: COLORS.muted }}>{s.v}</div>
            <div style={{ fontSize: 18, letterSpacing: 2, color: COLORS.muted }}>{s.l}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
