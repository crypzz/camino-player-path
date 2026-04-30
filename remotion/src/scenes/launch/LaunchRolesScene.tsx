import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";

const tiles = [
  { role: "Coaches", verb: "Track", icon: "▦", delay: 0 },
  { role: "Players", verb: "Grow", icon: "▲", delay: 5 },
  { role: "Parents", verb: "Watch", icon: "◉", delay: 10 },
  { role: "Directors", verb: "Lead", icon: "◆", delay: 15 },
];

export const LaunchRolesScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame, fps, config: { damping: 22 } });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: "180px 70px", justifyContent: "center" }}>
      <div style={{
        fontFamily, fontWeight: 800, fontSize: 64, color: "#FFFFFF",
        letterSpacing: "-0.03em", textAlign: "center", marginBottom: 56,
        opacity: interpolate(titleS, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(titleS, [0, 1], [20, 0])}px)`,
      }}>
        Built for <span style={{ color: GOLD }}>everyone</span>.
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
      }}>
        {tiles.map((t, i) => {
          const s = spring({ frame: frame - 10 - t.delay, fps, config: { damping: 16, stiffness: 180 } });
          const op = interpolate(s, [0, 1], [0, 1]);
          const scale = interpolate(s, [0, 1], [0.85, 1]);
          return (
            <div key={i} style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(232,180,0,0.18)",
              borderRadius: 24, padding: "36px 28px",
              opacity: op, transform: `scale(${scale})`,
              minHeight: 240, display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div style={{
                fontFamily, fontSize: 56, color: GOLD, lineHeight: 1,
              }}>
                {t.icon}
              </div>
              <div>
                <div style={{
                  fontFamily, fontWeight: 800, fontSize: 44, color: "#FFFFFF",
                  letterSpacing: "-0.02em", lineHeight: 1,
                }}>
                  {t.verb}
                </div>
                <div style={{
                  fontFamily: bodyFont, fontWeight: 500, fontSize: 22,
                  color: "rgba(255,255,255,0.5)", marginTop: 8,
                }}>
                  {t.role}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
