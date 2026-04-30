import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";

export const LaunchDomainScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Gold flash on entry
  const flashOp = interpolate(frame, [0, 4, 14], [0.35, 0.18, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const labelS = spring({ frame: frame - 6, fps, config: { damping: 22 } });
  const labelOp = interpolate(labelS, [0, 1], [0, 1]);
  const labelY = interpolate(labelS, [0, 1], [20, 0]);

  const urlS = spring({ frame: frame - 16, fps, config: { damping: 18, stiffness: 150 } });
  const urlOp = interpolate(urlS, [0, 1], [0, 1]);
  const urlScale = interpolate(urlS, [0, 1], [1.08, 1]);

  // Underline draw
  const underline = interpolate(frame, [40, 80], [0, 100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Subline
  const sub = spring({ frame: frame - 60, fps, config: { damping: 22 } });
  const subOp = interpolate(sub, [0, 1], [0, 1]);

  // Logo
  const logoOp = interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Subtle breathing on the URL
  const breath = 1 + Math.sin(frame * 0.06) * 0.005;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: GOLD, opacity: flashOp }} />

      <div style={{
        fontFamily: bodyFont, fontWeight: 600, fontSize: 26, color: GOLD,
        letterSpacing: "0.32em", marginBottom: 40,
        opacity: labelOp, transform: `translateY(${labelY}px)`,
      }}>
        AVAILABLE NOW AT
      </div>

      <div style={{
        opacity: urlOp, transform: `scale(${urlScale * breath})`,
        textAlign: "center",
      }}>
        <div style={{
          fontFamily, fontWeight: 800, fontSize: 90, color: "#FFFFFF",
          letterSpacing: "-0.035em", lineHeight: 1,
        }}>
          caminodevelopment
          <span style={{ color: GOLD }}>.com</span>
        </div>
        <div style={{
          height: 6, marginTop: 22, position: "relative",
        }}>
          <div style={{
            height: "100%", width: `${underline}%`, backgroundColor: GOLD,
            borderRadius: 3, boxShadow: `0 0 16px ${GOLD}88`,
          }} />
        </div>
      </div>

      <div style={{
        marginTop: 50,
        fontFamily: bodyFont, fontWeight: 500, fontSize: 32,
        color: "rgba(255,255,255,0.7)", letterSpacing: "-0.01em",
        opacity: subOp, textAlign: "center",
      }}>
        Join the waitlist. Build your edge.
      </div>

      <div style={{
        position: "absolute", bottom: 140,
        fontFamily, fontWeight: 800, fontSize: 38, color: "#FFFFFF",
        letterSpacing: "-0.02em", opacity: logoOp,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 14, height: 14, borderRadius: "50%", backgroundColor: GOLD,
          boxShadow: `0 0 12px ${GOLD}`,
        }} />
        Camino
      </div>
    </AbsoluteFill>
  );
};
