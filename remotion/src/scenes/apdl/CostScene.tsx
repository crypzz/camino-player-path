import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Shell, Eyebrow, Caption, display, body, GOLD, WHITE, MUTED, glow, fadeInOut } from "./_shared";

const DUR = 120;

export const CostScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chip = spring({ frame: frame - 4, fps, config: { damping: 18, stiffness: 140 } });
  // counter ticks 0 -> 8000 then resolves into the range
  const ticked = interpolate(frame, [12, 62], [0, 8000], { extrapolateRight: "clamp" });
  const showRange = frame >= 64;
  const rangeS = spring({ frame: frame - 64, fps, config: { damping: 16, stiffness: 150 } });
  const pulse = 1 + Math.sin(Math.max(0, frame - 64) / 6) * 0.012;

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

  return (
    <Shell dull>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80 }}>
        <div style={{ opacity: chip, transform: `translateY(${(1 - chip) * 18}px)` }}>
          <Eyebrow>APDL · Alberta</Eyebrow>
        </div>

        <div
          style={{
            marginTop: 70,
            fontFamily: display,
            fontWeight: 800,
            fontSize: showRange ? 128 : 150,
            color: WHITE,
            letterSpacing: -4,
            textShadow: glow("rgba(252,211,77,0.25)", 28),
            transform: `scale(${showRange ? rangeS * pulse : 1})`,
            fontVariantNumeric: "tabular-nums",
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          {showRange ? (
            <span>
              $5,000<span style={{ color: MUTED }}>–</span>
              <span style={{ color: GOLD }}>$8,000</span>
            </span>
          ) : (
            fmt(ticked)
          )}
        </div>

        <div
          style={{
            marginTop: 26,
            fontFamily: body,
            fontWeight: 600,
            fontSize: 32,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: MUTED,
            opacity: interpolate(frame, [70, 88], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          Reported season cost · per family
        </div>
      </AbsoluteFill>

      <Caption opacity={fadeInOut(frame - 20, DUR - 20, 10)}>
        This is what a season in the APDL reportedly costs a family.
      </Caption>
    </Shell>
  );
};
