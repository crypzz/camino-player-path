import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Shell, Caption, Eyebrow, display, body, GOLD, WHITE, MUTED, PANEL, LINE, glow, fadeInOut } from "./_shared";

const DUR = 215;

const Panel: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 130 } });
  return (
    <div
      style={{
        width: 780,
        backgroundColor: PANEL,
        border: `1px solid ${LINE}`,
        borderRadius: 24,
        padding: "26px 30px",
        opacity: s,
        transform: `translateY(${(1 - s) * 36}px)`,
        boxShadow: "0 26px 70px rgba(0,0,0,0.6)",
      }}
    >
      {children}
    </div>
  );
};

export const ParentViewScene: React.FC = () => {
  const frame = useCurrentFrame();

  const head = interpolate(frame, [2, 20], [0, 1], { extrapolateRight: "clamp" });
  const attendance = interpolate(frame, [40, 90], [0, 94], { extrapolateRight: "clamp" });

  return (
    <Shell>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 200 }}>
        <div style={{ opacity: head }}>
          <Eyebrow>Parent view</Eyebrow>
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
            padding: "0 70px",
          }}
        >
          See exactly what
          <br />
          you&apos;re <span style={{ color: GOLD, textShadow: glow("rgba(252,211,77,0.35)", 24) }}>paying for</span>.
        </div>

        <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 22 }}>
          <Panel delay={30}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: body, fontSize: 26, color: MUTED, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
                Attendance · this season
              </span>
              <span style={{ fontFamily: display, fontSize: 44, fontWeight: 800, color: GOLD, fontVariantNumeric: "tabular-nums" }}>
                {Math.round(attendance)}%
              </span>
            </div>
            <div style={{ marginTop: 18, height: 16, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
              <div
                style={{
                  width: `${attendance}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${GOLD}, #F59E0B)`,
                  boxShadow: glow("rgba(252,211,77,0.35)", 14),
                }}
              />
            </div>
            <div style={{ marginTop: 14, fontFamily: body, fontSize: 26, color: MUTED }}>
              32 of 34 sessions · 12 matches
            </div>
          </Panel>

          <Panel delay={56}>
            <div style={{ fontFamily: body, fontSize: 26, color: MUTED, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              Weekly report · Sept 14
            </div>
            <div style={{ marginTop: 16, fontFamily: body, fontSize: 31, color: "rgba(255,255,255,0.9)", lineHeight: 1.4 }}>
              “Sharper first touch under pressure. Needs work defending the back post.”
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              {["Attitude 9", "Effort 8", "Focus 7"].map((t) => (
                <span
                  key={t}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    border: `1px solid ${GOLD}55`,
                    backgroundColor: "rgba(252,211,77,0.10)",
                    color: GOLD,
                    fontFamily: body,
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </Panel>

          <Panel delay={82}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 54, height: 54, borderRadius: "50%", backgroundColor: "rgba(252,211,77,0.15)", border: `1px solid ${GOLD}55` }} />
              <div>
                <div style={{ fontFamily: body, fontSize: 28, fontWeight: 700, color: WHITE }}>Coach Marchetti</div>
                <div style={{ fontFamily: body, fontSize: 25, color: MUTED }}>Left feedback on 3 clips</div>
              </div>
            </div>
          </Panel>
        </div>
      </AbsoluteFill>

      <Caption opacity={fadeInOut(frame - 20, DUR - 20, 14)}>
        Camino shows parents where the money actually goes.
      </Caption>
    </Shell>
  );
};
