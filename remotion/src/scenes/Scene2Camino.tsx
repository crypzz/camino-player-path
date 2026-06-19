import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { COLORS, FONT, glow } from "../theme";
import { AnimatedPitch } from "../components/AnimatedPitch";

const StatPill: React.FC<{ label: string; value: string; delay: number }> = ({ label, value, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14 } });
  // count-up illusion for numeric
  return (
    <div
      style={{
        transform: `scale(${s}) translateY(${interpolate(s, [0, 1], [20, 0])}px)`,
        opacity: s,
        padding: "16px 22px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${COLORS.yellow}33`,
        fontFamily: FONT,
        minWidth: 150,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.yellow }}>{value}</div>
      <div style={{ fontSize: 16, letterSpacing: 1.5, color: COLORS.muted, fontWeight: 600 }}>{label}</div>
    </div>
  );
};

export const Scene2Camino: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame: frame - 8, fps, config: { damping: 16 } });
  const titleGlow = interpolate(Math.sin(frame / 12), [-1, 1], [20, 60]);

  // count up touches
  const touches = Math.round(interpolate(frame, [70, 120], [0, 47], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const distance = (interpolate(frame, [70, 120], [0, 8.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })).toFixed(1);
  const poss = Math.round(interpolate(frame, [70, 120], [0, 63], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  const taglineS = spring({ frame: frame - 150, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40 }}>
      <Sequence from={0}>
        <div style={{ position: "absolute", top: 220, width: "100%", textAlign: "center" }}>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 110,
              color: COLORS.white,
              opacity: titleS,
              transform: `scale(${interpolate(titleS, [0, 1], [0.8, 1])})`,
              letterSpacing: -2,
            }}
          >
            Meet{" "}
            <span style={{ color: COLORS.yellow, textShadow: glow(COLORS.yellow, titleGlow) }}>Camino</span>
          </div>
        </div>
      </Sequence>

      <div style={{ marginTop: 80 }}>
        <AnimatedPitch start={30} />
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <StatPill label="TOUCHES" value={`${touches}`} delay={70} />
        <StatPill label="DISTANCE" value={`${distance}km`} delay={82} />
        <StatPill label="POSSESSION" value={`${poss}%`} delay={94} />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 220,
          fontFamily: FONT,
          fontSize: 44,
          fontWeight: 700,
          color: COLORS.white,
          opacity: taglineS,
          transform: `translateY(${interpolate(taglineS, [0, 1], [30, 0])}px)`,
          textAlign: "center",
        }}
      >
        Your AI-Powered
        <br />
        <span style={{ color: COLORS.yellow }}>Player Passport</span>
      </div>
    </AbsoluteFill>
  );
};
