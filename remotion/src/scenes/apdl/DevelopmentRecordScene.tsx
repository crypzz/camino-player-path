import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Shell, Caption, Eyebrow, display, body, GOLD, WHITE, MUTED, PANEL, LINE, glow, fadeInOut } from "./_shared";

const DUR = 190;

// CPI curve points (week -> score)
const POINTS = [58, 60, 59, 63, 66, 65, 69, 72, 74, 77, 79, 82];
const W = 700;
const H = 260;

const chartPath = (progress: number) => {
  const n = POINTS.length;
  const shown = Math.max(2, Math.ceil(progress * n));
  const min = 52;
  const max = 88;
  const pts = POINTS.slice(0, shown).map((v, i) => {
    const x = (i / (n - 1)) * W;
    const y = H - ((v - min) / (max - min)) * H;
    return [x, y] as const;
  });
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
};

export const DevelopmentRecordScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const head = interpolate(frame, [2, 20], [0, 1], { extrapolateRight: "clamp" });
  const progress = interpolate(frame, [24, 110], [0, 1], { extrapolateRight: "clamp" });
  const score = interpolate(progress, [0, 1], [58, 82]);
  const cardS = spring({ frame: frame - 18, fps, config: { damping: 18, stiffness: 130 } });
  const tiles = spring({ frame: frame - 100, fps, config: { damping: 18, stiffness: 130 } });

  const lastIdx = Math.max(1, Math.ceil(progress * POINTS.length)) - 1;
  const dotX = (lastIdx / (POINTS.length - 1)) * W;
  const dotY = H - ((POINTS[lastIdx] - 52) / (88 - 52)) * H;

  return (
    <Shell>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 200 }}>
        <div style={{ opacity: head }}>
          <Eyebrow>Development record</Eyebrow>
        </div>

        <div
          style={{
            marginTop: 26,
            fontFamily: display,
            fontWeight: 800,
            fontSize: 70,
            color: WHITE,
            textAlign: "center",
            lineHeight: 1.05,
            opacity: head,
          }}
        >
          Every session.
          <br />
          <span style={{ color: GOLD, textShadow: glow("rgba(252,211,77,0.35)", 24) }}>Tracked.</span>
        </div>

        <div
          style={{
            marginTop: 50,
            width: 820,
            backgroundColor: PANEL,
            border: `1px solid ${LINE}`,
            borderRadius: 26,
            padding: 34,
            opacity: cardS,
            transform: `translateY(${(1 - cardS) * 34}px)`,
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: body, fontSize: 26, color: MUTED, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              Camino Player Index
            </span>
            <span style={{ fontFamily: display, fontSize: 60, fontWeight: 800, color: GOLD, fontVariantNumeric: "tabular-nums" }}>
              {score.toFixed(1)}
            </span>
          </div>

          <svg width={W} height={H} style={{ marginTop: 22, display: "block", marginLeft: "auto", marginRight: "auto", overflow: "visible" }}>
            {[0, 0.25, 0.5, 0.75, 1].map((g) => (
              <line key={g} x1={0} x2={W} y1={g * H} y2={g * H} stroke="rgba(255,255,255,0.06)" strokeWidth={2} />
            ))}
            <path d={chartPath(progress)} fill="none" stroke={GOLD} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={dotX} cy={dotY} r={12} fill={GOLD} />
            <circle cx={dotX} cy={dotY} r={26} fill="rgba(252,211,77,0.18)" />
          </svg>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: body, fontSize: 23, color: MUTED }}>
            <span>Week 1</span>
            <span>Week 6</span>
            <span>Week 12</span>
          </div>
        </div>

        <div style={{ marginTop: 30, display: "flex", gap: 18, opacity: tiles, transform: `translateY(${(1 - tiles) * 26}px)` }}>
          {["12 evaluations", "38 clips tagged", "4 fitness tests"].map((t) => (
            <div
              key={t}
              style={{
                padding: "18px 24px",
                borderRadius: 18,
                backgroundColor: PANEL,
                border: `1px solid ${LINE}`,
                fontFamily: body,
                fontSize: 26,
                fontWeight: 700,
                color: "rgba(255,255,255,0.88)",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </AbsoluteFill>

      <Caption opacity={fadeInOut(frame - 20, DUR - 20, 14)}>
        Every evaluation, every clip — one record that follows the player.
      </Caption>
    </Shell>
  );
};
