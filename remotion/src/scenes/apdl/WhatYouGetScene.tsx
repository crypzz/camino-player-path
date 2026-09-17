import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Shell, Caption, display, body, DULL, MUTED, WHITE, PANEL, LINE, fadeInOut } from "./_shared";

const DUR = 200;

const DullCard: React.FC<{ delay: number; out: number; rotate: number; children: React.ReactNode }> = ({
  delay,
  out,
  rotate,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 110 } });
  const drift = interpolate(frame, [delay, DUR], [0, -26], { extrapolateLeft: "clamp" });
  const leave = interpolate(frame, [out, out + 22], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width: 720,
        backgroundColor: PANEL,
        border: `1px solid ${LINE}`,
        borderRadius: 22,
        padding: "28px 32px",
        opacity: s * 0.92 * leave,
        transform: `translateY(${(1 - s) * 40 + drift}px) rotate(${rotate}deg) scale(${0.96 + leave * 0.04})`,
        filter: "grayscale(1)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
      }}
    >
      {children}
    </div>
  );
};

export const WhatYouGetScene: React.FC = () => {
  const frame = useCurrentFrame();

  const title = interpolate(frame, [4, 22], [0, 1], { extrapolateRight: "clamp" });
  const titleOut = interpolate(frame, [176, 196], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Shell dull>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 260 }}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 74,
            color: WHITE,
            textAlign: "center",
            lineHeight: 1.05,
            opacity: title * titleOut,
            transform: `translateY(${(1 - title) * 20}px)`,
            padding: "0 70px",
          }}
        >
          So what do parents
          <br />
          actually get back?
        </div>

        <div style={{ marginTop: 70, display: "flex", flexDirection: "column", gap: 26 }}>
          <DullCard delay={26} out={168} rotate={-1.2}>
            <div style={{ fontFamily: body, fontSize: 24, color: DULL, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              Group chat · 48 unread
            </div>
            <div style={{ marginTop: 14, fontFamily: body, fontSize: 32, color: MUTED }}>
              “Practice moved to 7pm. Field 4.”
            </div>
          </DullCard>

          <DullCard delay={44} out={174} rotate={0.8}>
            <div style={{ fontFamily: body, fontSize: 24, color: DULL, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              Season schedule.pdf
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 44, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.06)" }} />
              ))}
            </div>
          </DullCard>

          <DullCard delay={62} out={180} rotate={-0.6}>
            <div style={{ fontFamily: body, fontSize: 24, color: DULL, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              Development report
            </div>
            <div style={{ marginTop: 16, height: 70, borderRadius: 10, border: "1px dashed rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", color: DULL, fontFamily: body, fontSize: 28 }}>
              — empty —
            </div>
          </DullCard>
        </div>
      </AbsoluteFill>

      <Caption opacity={fadeInOut(frame - 100, DUR - 100, 14)}>
        A schedule. A group chat. And a guess.
      </Caption>
    </Shell>
  );
};
