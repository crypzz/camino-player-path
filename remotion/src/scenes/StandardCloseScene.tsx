import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: serif } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["300"], subsets: ["latin"] });

export const StandardCloseScene = () => {
  const frame = useCurrentFrame();
  const grainY = (frame * 0.8) % 1920;

  // Main text fades in
  const textO = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [0, 25], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Slow breathe on the whole scene
  const breathe = 1 + Math.sin(frame * 0.03) * 0.008;

  // Bottom line extends
  const lineW = interpolate(frame, [20, 50], [0, 400], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // "COMING SOON" fades in last
  const soonO = interpolate(frame, [40, 55], [0, 0.7], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#1A1714" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(242,232,213,0.3) 2px, rgba(242,232,213,0.3) 3px)`,
        transform: `translateY(${grainY}px)`,
      }} />

      {/* Main tagline */}
      <div style={{
        position: "absolute",
        left: "50%", top: "45%",
        transform: `translate(-50%, -50%) scale(${breathe}) translateY(${textY}px)`,
        opacity: textO, textAlign: "center",
        width: "85%",
      }}>
        <div style={{
          fontFamily: serif, fontSize: 64, fontWeight: 700,
          color: "#F2E8D5", lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}>
          The standard<br />is coming.
        </div>
      </div>

      {/* Horizontal line */}
      <div style={{
        position: "absolute",
        left: "50%", top: "58%",
        transform: "translateX(-50%)",
        height: 1,
        width: lineW,
        backgroundColor: "#D4622B",
        opacity: 0.5,
      }} />

      {/* COMING SOON */}
      <div style={{
        position: "absolute",
        left: "50%", bottom: 280,
        transform: "translateX(-50%)",
        fontFamily: sans, fontSize: 18, fontWeight: 300,
        color: "#7A8B6F", letterSpacing: "0.3em",
        opacity: soonO, textAlign: "center",
      }}>
        COMING SOON
      </div>
    </AbsoluteFill>
  );
};
