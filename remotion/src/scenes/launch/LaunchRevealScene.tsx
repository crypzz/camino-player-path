import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";

export const LaunchRevealScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame, fps, config: { damping: 16, stiffness: 140 } });
  const scale = interpolate(s, [0, 1], [1.4, 1.0]);
  const op = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  // Underline draw
  const underline = interpolate(frame, [25, 55], [0, 100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Subtitle
  const subS = spring({ frame: frame - 45, fps, config: { damping: 22 } });
  const subOp = interpolate(subS, [0, 1], [0, 1]);
  const subY = interpolate(subS, [0, 1], [20, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", opacity: op, transform: `scale(${scale})` }}>
        <div style={{
          fontFamily, fontWeight: 800, fontSize: 180, color: "#FFFFFF",
          letterSpacing: "-0.04em", lineHeight: 1,
        }}>
          Camino
        </div>
        <div style={{
          height: 8, width: "100%", marginTop: 18, position: "relative",
        }}>
          <div style={{
            height: "100%", width: `${underline}%`, backgroundColor: GOLD, borderRadius: 4,
          }} />
        </div>
      </div>
      <div style={{
        position: "absolute", bottom: 380,
        fontFamily: bodyFont, fontWeight: 500, fontSize: 36, color: "rgba(255,255,255,0.65)",
        letterSpacing: "-0.01em", opacity: subOp, transform: `translateY(${subY}px)`,
        textAlign: "center",
      }}>
        The player development platform.
      </div>
    </AbsoluteFill>
  );
};
