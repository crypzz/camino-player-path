import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["400"], subsets: ["latin"] });

export const RealityCheckScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "But here's" appears softly
  const line1O = interpolate(frame, [0, 12], [0, 0.6], { extrapolateRight: "clamp" });

  // "THE TRUTH" slams
  const s = spring({ frame: frame - 15, fps, config: { damping: 10, stiffness: 200 } });
  const truthScale = interpolate(s, [0, 1], [3, 1]);
  const truthO = interpolate(frame, [15, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Red pulse dots
  const dot1O = interpolate(frame, [30, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dot2O = interpolate(frame, [36, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dot3O = interpolate(frame, [42, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const fadeOut = interpolate(frame, [85, 100], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0E1A", justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut, textAlign: "center", padding: "0 80px" }}>
        <div style={{
          fontFamily: bodyFont, fontSize: 36, color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.05em", opacity: line1O,
        }}>
          But here's
        </div>
        <div style={{
          fontFamily, fontSize: 130, color: "#FF3B3B",
          letterSpacing: "0.06em", lineHeight: 1, marginTop: 10,
          opacity: truthO,
          transform: `scale(${truthScale})`,
        }}>
          THE TRUTH
        </div>
        {/* Red dots */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 40 }}>
          {[dot1O, dot2O, dot3O].map((o, i) => (
            <div key={i} style={{
              width: 12, height: 12, borderRadius: "50%",
              backgroundColor: "#FF3B3B", opacity: o,
            }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
