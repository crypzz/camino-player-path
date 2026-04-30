import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const BLUE = "#2B7FE8";
const CARD_BG = "rgba(255,255,255,0.04)";
const CARD_BORDER = "rgba(255,255,255,0.08)";

const RadarCard = ({ progress }: { progress: number }) => {
  const cx = 140, cy = 140, r = 105;
  const axes = 6;
  const values = [0.85, 0.72, 0.78, 0.65, 0.82, 0.7];
  const points = values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / axes - Math.PI / 2;
    const rr = r * v * progress;
    return `${cx + Math.cos(angle) * rr},${cy + Math.sin(angle) * rr}`;
  }).join(" ");
  // Background polygon
  const bgPoints = Array.from({ length: axes }, (_, i) => {
    const angle = (Math.PI * 2 * i) / axes - Math.PI / 2;
    return `${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
  }).join(" ");

  return (
    <svg width="280" height="280">
      <polygon points={bgPoints} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
      <polygon points={bgPoints.split(" ").map(p => {
        const [x, y] = p.split(",").map(Number);
        return `${cx + (x - cx) * 0.66},${cy + (y - cy) * 0.66}`;
      }).join(" ")} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      <polygon points={bgPoints.split(" ").map(p => {
        const [x, y] = p.split(",").map(Number);
        return `${cx + (x - cx) * 0.33},${cy + (y - cy) * 0.33}`;
      }).join(" ")} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      <polygon points={points} fill={GOLD} fillOpacity={0.22} stroke={GOLD} strokeWidth={2.5}
        style={{ filter: `drop-shadow(0 0 12px ${GOLD}55)` }} />
    </svg>
  );
};

export const LaunchDashboardScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card1 = spring({ frame, fps, config: { damping: 18, stiffness: 170 } });
  const card2 = spring({ frame: frame - 14, fps, config: { damping: 18, stiffness: 170 } });
  const card3 = spring({ frame: frame - 28, fps, config: { damping: 18, stiffness: 170 } });

  const radarProgress = interpolate(frame, [10, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Rank +3 counter
  const rankAnim = interpolate(frame, [50, 90], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rankVal = Math.round(rankAnim);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: "120px 70px", justifyContent: "center" }}>
      <div style={{
        fontFamily: bodyFont, fontWeight: 600, fontSize: 22, color: GOLD,
        letterSpacing: "0.2em", marginBottom: 36, textAlign: "center",
      }}>
        INSIDE THE PLATFORM
      </div>

      {/* Card 1: Radar */}
      <div style={{
        backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 24,
        padding: 28, marginBottom: 24, display: "flex", alignItems: "center", gap: 24,
        opacity: interpolate(card1, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(card1, [0, 1], [40, 0])}px)`,
      }}>
        <RadarCard progress={radarProgress} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 36, color: "#FFFFFF" }}>Player Radar</div>
          <div style={{ fontFamily: bodyFont, fontWeight: 500, fontSize: 22, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>
            Technical · Tactical · Physical
          </div>
        </div>
      </div>

      {/* Card 2: Tagged video frame */}
      <div style={{
        backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 24,
        padding: 24, marginBottom: 24,
        opacity: interpolate(card2, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(card2, [0, 1], [40, 0])}px)`,
      }}>
        <div style={{
          position: "relative", width: "100%", aspectRatio: "16/9",
          background: "linear-gradient(135deg, #1a3a1a, #2d5a2d)", borderRadius: 16, overflow: "hidden",
        }}>
          {/* Pitch lines */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.25 }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: "#fff" }} />
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 80, height: 80, marginLeft: -40, marginTop: -40, border: "2px solid #fff", borderRadius: "50%" }} />
          </div>
          {/* Bounding box */}
          <div style={{
            position: "absolute", left: "38%", top: "30%", width: 110, height: 160,
            border: `3px solid ${BLUE}`, borderRadius: 4,
            boxShadow: `0 0 20px ${BLUE}66`,
          }}>
            <div style={{
              position: "absolute", top: -28, left: 0,
              backgroundColor: BLUE, color: "#fff", padding: "3px 10px",
              fontFamily: bodyFont, fontWeight: 700, fontSize: 14, borderRadius: 4,
            }}>
              #10 · 92%
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16, fontFamily, fontWeight: 800, fontSize: 30, color: "#FFFFFF" }}>
          AI Video Analysis
        </div>
      </div>

      {/* Card 3: Leaderboard row */}
      <div style={{
        backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 24,
        padding: 24, display: "flex", alignItems: "center", gap: 20,
        opacity: interpolate(card3, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(card3, [0, 1], [40, 0])}px)`,
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: 14, backgroundColor: GOLD,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily, fontWeight: 800, fontSize: 28, color: BG,
        }}>4</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily, fontWeight: 800, fontSize: 30, color: "#FFFFFF" }}>Sofia Chen</div>
          <div style={{ fontFamily: bodyFont, fontWeight: 500, fontSize: 18, color: "rgba(255,255,255,0.5)" }}>
            CPI 81 · Calgary U16
          </div>
        </div>
        <div style={{
          fontFamily, fontWeight: 800, fontSize: 32, color: GOLD,
        }}>
          ↑{rankVal}
        </div>
      </div>
    </AbsoluteFill>
  );
};
