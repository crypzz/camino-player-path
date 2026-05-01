import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhotoBG, display, body, GOLD, IVORY } from "./_shared";

const DUR = 120;
const items = [
  "Lost notebooks",
  "Group chat chaos",
  "Faded memories",
  "No real proof",
];

export const AIOProblemScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame: frame - 4, fps, config: { damping: 20 } });
  const titleO = interpolate(titleS, [0, 1], [0, 1]);
  const titleY = interpolate(titleS, [0, 1], [30, 0]);

  const fadeOut = interpolate(frame, [DUR - 12, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <PhotoBG src="aio/problem-notes.jpg" duration={DUR} zoomFrom={1.1} zoomTo={1.22} panY={15} overlayStrength={0.7} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px", opacity: fadeOut }}>
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 78, lineHeight: 1,
          color: IVORY, textAlign: "center", letterSpacing: "-0.03em",
          opacity: titleO, transform: `translateY(${titleY}px)`,
          marginBottom: 60, textShadow: "0 4px 30px rgba(0,0,0,0.7)",
        }}>
          The old way<br />is <span style={{ color: GOLD }}>broken.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%" }}>
          {items.map((label, i) => {
            const itemS = spring({ frame: frame - 22 - i * 10, fps, config: { damping: 18 } });
            const o = interpolate(itemS, [0, 1], [0, 1]);
            const x = interpolate(itemS, [0, 1], [-60, 0]);
            // strikethrough draw
            const strikeProgress = interpolate(frame, [40 + i * 10, 56 + i * 10], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{
                opacity: o, transform: `translateX(${x}px)`,
                display: "flex", alignItems: "center", gap: 20,
                padding: "20px 28px",
                background: "rgba(20,24,33,0.78)",
                border: "1px solid rgba(245,245,245,0.08)",
                borderRadius: 16,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: 999,
                  backgroundColor: "#DC2626",
                  boxShadow: "0 0 18px rgba(220,38,38,0.6)",
                }} />
                <div style={{
                  fontFamily: body, fontSize: 32, fontWeight: 600,
                  color: "rgba(245,245,245,0.85)", flex: 1, position: "relative",
                }}>
                  {label}
                  <div style={{
                    position: "absolute", left: 0, top: "50%",
                    height: 2, backgroundColor: "#DC2626",
                    width: `${strikeProgress}%`,
                    boxShadow: "0 0 10px rgba(220,38,38,0.6)",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
