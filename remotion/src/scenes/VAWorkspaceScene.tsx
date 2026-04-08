import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: bebas } = loadFont();
const { fontFamily: inter } = loadInter();

const BG = "#0A0E1A";
const GOLD = "#E8B400";
const BLUE = "#2B7FE8";
const CARD_BG = "#111827";

export const VAWorkspaceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wsScale = interpolate(
    spring({ frame, fps, config: { damping: 20, stiffness: 80 } }),
    [0, 1], [1.15, 1]
  );
  const wsOp = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const titleOp = interpolate(frame, [55, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(spring({ frame: frame - 55, fps, config: { damping: 16 } }), [0, 1], [25, 0]);

  const TABS = ["Events", "Stats", "Notes"];

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: 40, gap: 30,
        transform: `scale(${wsScale})`, opacity: wsOp,
      }}>
        {/* Mock workspace */}
        <div style={{
          width: 900, height: 1100, borderRadius: 20, backgroundColor: CARD_BG,
          border: "1px solid #1F2937", overflow: "hidden", display: "flex", flexDirection: "column",
        }}>
          {/* Video area */}
          <div style={{
            height: 500, backgroundColor: "#0D1117", display: "flex",
            alignItems: "center", justifyContent: "center", position: "relative",
          }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <polygon points="8,5 19,12 8,19" fill={BLUE} opacity={0.6} />
            </svg>
            {/* Timeline bar at bottom */}
            <div style={{
              position: "absolute", bottom: 16, left: 24, right: 24, height: 8,
              backgroundColor: "#1F2937", borderRadius: 4,
            }}>
              <div style={{ width: "45%", height: "100%", backgroundColor: BLUE + "44", borderRadius: 4 }} />
              {[15, 30, 45, 60, 75].map((p, i) => (
                <div key={i} style={{
                  position: "absolute", top: "50%", transform: "translateY(-50%)",
                  left: `${p}%`, width: 6, height: 6, borderRadius: "50%",
                  backgroundColor: [BLUE, "#1DB870", GOLD, "#EF4444", BLUE][i],
                }} />
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #1F2937" }}>
            {TABS.map((tab, i) => {
              const active = i === 1;
              return (
                <div key={tab} style={{
                  flex: 1, padding: "16px 0", textAlign: "center",
                  fontFamily: inter, fontSize: 18, fontWeight: 600,
                  color: active ? BLUE : "#6B7280",
                  borderBottom: active ? `2px solid ${BLUE}` : "2px solid transparent",
                }}>
                  {tab}
                </div>
              );
            })}
          </div>

          {/* Mock content */}
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            {[0.8, 0.6, 0.4, 0.3].map((w, i) => (
              <div key={i} style={{
                height: 20, width: `${w * 100}%`, backgroundColor: "#1F2937", borderRadius: 4,
              }} />
            ))}
          </div>
        </div>

        <div style={{
          fontFamily: bebas, fontSize: 56, color: GOLD, letterSpacing: 4,
          opacity: titleOp, transform: `translateY(${titleY}px)`,
        }}>
          ONE WORKSPACE. EVERYTHING.
        </div>
      </div>
    </AbsoluteFill>
  );
};
