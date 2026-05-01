import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhotoBG, display, body, GOLD, IVORY, GoldChip } from "./_shared";

const DUR = 120;
const TARGET = 87;

export const AIOCPIScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerS = spring({ frame: frame - 4, fps, config: { damping: 20 } });
  const headerO = interpolate(headerS, [0, 1], [0, 1]);
  const headerY = interpolate(headerS, [0, 1], [20, 0]);

  const dialS = spring({ frame: frame - 14, fps, config: { damping: 16 } });
  const dialScale = interpolate(dialS, [0, 1], [0.7, 1]);
  const dialO = interpolate(dialS, [0, 1], [0, 1]);

  const value = Math.round(interpolate(frame, [22, 78], [0, TARGET], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const ringProgress = interpolate(frame, [22, 78], [0, TARGET / 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const labelS = spring({ frame: frame - 80, fps, config: { damping: 20 } });
  const labelO = interpolate(labelS, [0, 1], [0, 1]);
  const labelY = interpolate(labelS, [0, 1], [20, 0]);

  const fadeOut = interpolate(frame, [DUR - 12, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ring SVG math
  const RADIUS = 180;
  const CIRC = 2 * Math.PI * RADIUS;
  const dashOffset = CIRC * (1 - ringProgress);

  return (
    <AbsoluteFill>
      <PhotoBG src="aio/cpi-portrait.jpg" duration={DUR} zoomFrom={1.06} zoomTo={1.18} overlayStrength={0.7} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px", opacity: fadeOut }}>
        <div style={{ opacity: headerO, transform: `translateY(${headerY}px)`, marginBottom: 40 }}>
          <GoldChip>CAMINO PERFORMANCE INDEX</GoldChip>
        </div>

        <div style={{
          opacity: dialO, transform: `scale(${dialScale})`,
          width: 440, height: 440, position: "relative",
          display: "flex", justifyContent: "center", alignItems: "center",
        }}>
          <svg width={440} height={440} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
            <circle cx={220} cy={220} r={RADIUS} stroke="rgba(245,245,245,0.12)" strokeWidth={18} fill="none" />
            <circle
              cx={220} cy={220} r={RADIUS}
              stroke={GOLD} strokeWidth={18} fill="none"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
              style={{ filter: "drop-shadow(0 0 16px rgba(232,180,0,0.55))" }}
            />
          </svg>
          <div style={{ textAlign: "center", zIndex: 2 }}>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 180, color: IVORY, lineHeight: 1, letterSpacing: "-0.05em" }}>
              {value}
            </div>
            <div style={{ fontFamily: body, fontWeight: 700, fontSize: 22, color: GOLD, letterSpacing: 4, textTransform: "uppercase", marginTop: 6 }}>
              CPI
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 50, opacity: labelO, transform: `translateY(${labelY}px)`,
          fontFamily: display, fontWeight: 800, fontSize: 56, color: IVORY, textAlign: "center", letterSpacing: "-0.03em",
        }}>
          One score. <span style={{ color: GOLD }}>23 metrics.</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
