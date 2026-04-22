import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const stamps = [
  { num: "4", label: "User roles", sub: "Director · Coach · Player · Parent" },
  { num: "23", label: "Performance attributes", sub: "Tracked per player" },
  { num: "AI", label: "Video analysis", sub: "Powered by Gemini" },
  { num: "∞", label: "Cross-club rankings", sub: "Every player. Every age group." },
];

export const TractionStampScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headS = spring({ frame, fps, config: { damping: 14 } });
  const headO = interpolate(headS, [0, 1], [0, 1]);
  const headY = interpolate(headS, [0, 1], [-20, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 40%, rgba(232,180,0,0.08) 0%, transparent 60%)",
      }} />

      <div style={{
        position: "absolute", top: 110, left: 0, right: 0, textAlign: "center",
        opacity: headO, transform: `translateY(${headY}px)`,
      }}>
        <div style={{
          fontFamily: body, fontSize: 24, fontWeight: 600, color: "#8B92A3",
          letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16,
        }}>
          What's already shipped
        </div>
        <div style={{
          fontFamily: display, fontSize: 72, fontWeight: 800, color: "#FFFFFF",
          letterSpacing: "-0.03em",
        }}>
          Built. Live. <span style={{ color: "#E8B400" }}>Working.</span>
        </div>
      </div>

      <div style={{
        position: "absolute", top: 360, left: 100, right: 100,
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 28,
      }}>
        {stamps.map((s, i) => {
          const delay = 14 + i * 10;
          const ss = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 130 } });
          const scale = interpolate(ss, [0, 1], [0.6, 1]);
          const o = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{
              transform: `scale(${scale})`, opacity: o, textAlign: "center",
              padding: "32px 16px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(232,180,0,0.2)",
              borderRadius: 20,
            }}>
              <div style={{
                fontFamily: display, fontSize: 130, fontWeight: 800, color: "#E8B400",
                letterSpacing: "-0.05em", lineHeight: 1,
                textShadow: "0 0 40px rgba(232,180,0,0.4)",
              }}>
                {s.num}
              </div>
              <div style={{
                fontFamily: display, fontSize: 22, fontWeight: 800, color: "#FFFFFF",
                marginTop: 16, letterSpacing: "-0.01em",
              }}>
                {s.label}
              </div>
              <div style={{
                fontFamily: body, fontSize: 14, fontWeight: 500, color: "#8B92A3",
                marginTop: 8, lineHeight: 1.4,
              }}>
                {s.sub}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
