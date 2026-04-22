import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const cols = [
  {
    status: "LIVE",
    title: "Web platform",
    items: ["CPI engine", "Video AI", "Multi-role dashboards", "Public player profiles"],
    color: "#1DB870",
    delay: 8,
  },
  {
    status: "Q3 '26",
    title: "Beta launch",
    items: ["10 partner academies", "Native mobile (iOS)", "Scout marketplace", "Stripe billing"],
    color: "#E8B400",
    delay: 28,
  },
  {
    status: "Q1 '27",
    title: "Scale",
    items: ["Native Android", "Multi-language", "AI coach assistant", "Federation partnerships"],
    color: "#8B92A3",
    delay: 48,
  },
];

export const RoadmapTeaseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headS = spring({ frame, fps, config: { damping: 14 } });
  const headO = interpolate(headS, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
      <div style={{
        position: "absolute", top: 100, left: 0, right: 0, textAlign: "center",
        opacity: headO,
      }}>
        <div style={{
          fontFamily: body, fontSize: 24, fontWeight: 600, color: "#8B92A3",
          letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16,
        }}>
          The Roadmap
        </div>
        <div style={{
          fontFamily: display, fontSize: 64, fontWeight: 800, color: "#FFFFFF",
          letterSpacing: "-0.03em",
        }}>
          Where Camino is going.
        </div>
      </div>

      <div style={{
        position: "absolute", top: 320, left: 100, right: 100,
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32,
      }}>
        {cols.map((c, i) => {
          const cs = spring({ frame: frame - c.delay, fps, config: { damping: 14, stiffness: 120 } });
          const y = interpolate(cs, [0, 1], [60, 0]);
          const o = interpolate(frame, [c.delay, c.delay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{
              padding: "36px 32px", borderRadius: 22,
              background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
              border: `1px solid ${c.color}40`,
              transform: `translateY(${y}px)`, opacity: o,
              boxShadow: `0 0 60px ${c.color}15`,
            }}>
              <div style={{
                display: "inline-block",
                fontFamily: body, fontSize: 14, fontWeight: 800,
                color: c.color, letterSpacing: "0.3em",
                background: `${c.color}15`,
                padding: "6px 14px", borderRadius: 100,
                marginBottom: 18,
              }}>
                {c.status}
              </div>
              <div style={{
                fontFamily: display, fontSize: 38, fontWeight: 800, color: "#FFFFFF",
                marginBottom: 24, letterSpacing: "-0.02em",
              }}>
                {c.title}
              </div>
              {c.items.map((item, j) => {
                const itemDelay = c.delay + 8 + j * 4;
                const is = spring({ frame: frame - itemDelay, fps, config: { damping: 16 } });
                const ix = interpolate(is, [0, 1], [-20, 0]);
                const io = interpolate(frame, [itemDelay, itemDelay + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <div key={j} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 0",
                    transform: `translateX(${ix}px)`, opacity: io,
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: c.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: display, fontWeight: 800, fontSize: 14, color: "#0A0C12",
                    }}>
                      ✓
                    </div>
                    <div style={{
                      fontFamily: body, fontSize: 20, color: "#FFFFFF", fontWeight: 600,
                    }}>
                      {item}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
