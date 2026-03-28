import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["400", "500"], subsets: ["latin"] });

const panels = [
  {
    title: "Evaluations", label: "Every session scored", color: "#2B7FE8",
    items: [{ l: "Technical", v: "8.2" }, { l: "Tactical", v: "7.5" }, { l: "Physical", v: "8.8" }],
  },
  {
    title: "Progress", label: "Every trend tracked", color: "#1DB870",
    items: [{ l: "Sep", v: "62" }, { l: "Dec", v: "71" }, { l: "Mar", v: "79" }],
  },
  {
    title: "Goals", label: "Every goal mapped", color: "#E8B400",
    items: [{ l: "Ball control drills", v: "✓" }, { l: "Sprint speed +5%", v: "◔" }, { l: "Leadership role", v: "○" }],
  },
];

export const FeatureFlashScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelDuration = 35;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14", justifyContent: "center", alignItems: "center" }}>
      {panels.map((panel, i) => {
        const start = i * panelDuration;
        const localFrame = frame - start;
        const enterS = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 200 } });
        const enterY = interpolate(enterS, [0, 1], [300, 0]);
        const enterO = interpolate(enterS, [0, 1], [0, 1]);

        // Exit: fade out before next panel (except last)
        const exitO = i < panels.length - 1
          ? interpolate(frame, [start + panelDuration - 5, start + panelDuration + 5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : interpolate(frame, [105, 118], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <div key={i} style={{
            position: "absolute", width: 700, opacity: enterO * exitO,
            transform: `translateY(${enterY}px)`,
          }}>
            {/* Phone frame */}
            <div style={{
              backgroundColor: "#141821", borderRadius: 32, padding: "40px 36px",
              border: "2px solid #1E2430",
            }}>
              <div style={{
                fontFamily: display, fontSize: 28, fontWeight: 800, color: panel.color, marginBottom: 8,
              }}>{panel.title}</div>
              <div style={{
                fontFamily: body, fontSize: 14, color: "#6B7280", marginBottom: 28,
              }}>{panel.label}</div>

              {panel.items.map((item, j) => {
                const itemS = spring({ frame: localFrame - 8 - j * 6, fps, config: { damping: 16, stiffness: 200 } });
                const itemX = interpolate(itemS, [0, 1], [40, 0]);
                const itemO = interpolate(itemS, [0, 1], [0, 1]);
                return (
                  <div key={j} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "16px 20px", backgroundColor: "#0D0F14", borderRadius: 12,
                    marginBottom: 10, opacity: itemO, transform: `translateX(${itemX}px)`,
                    border: "1px solid #1E2430",
                  }}>
                    <span style={{ fontFamily: body, fontSize: 18, color: "#D1D5DB" }}>{item.l}</span>
                    <span style={{ fontFamily: display, fontSize: 22, fontWeight: 700, color: panel.color }}>{item.v}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
