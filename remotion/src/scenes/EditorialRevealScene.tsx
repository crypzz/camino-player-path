import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: serif } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["300"], subsets: ["latin"] });

export const EditorialRevealScene = () => {
  const frame = useCurrentFrame();
  const grainY = (frame * 1.2) % 1920;

  // Horizontal line wipe across screen
  const lineW = interpolate(frame, [0, 35], [0, 1080], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Logo appears after line passes center
  const logoO = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const logoScale = interpolate(frame, [25, 45], [0.9, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Tagline under logo
  const tagO = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const tagY = interpolate(frame, [50, 65], [20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // "0" background
  const numO = interpolate(frame, [10, 30], [0, 0.06], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#1A1714" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(242,232,213,0.3) 2px, rgba(242,232,213,0.3) 3px)`,
        transform: `translateY(${grainY}px)`,
      }} />

      {/* Background "0" */}
      <div style={{
        position: "absolute", left: "50%", top: "25%",
        transform: "translateX(-50%)",
        fontFamily: serif, fontSize: 500, fontWeight: 900,
        color: "#D4622B", opacity: numO, lineHeight: 1,
      }}>
        0
      </div>

      {/* Horizontal wipe line */}
      <div style={{
        position: "absolute",
        left: 0, top: "50%",
        height: 2,
        width: lineW,
        backgroundColor: "#D4622B",
      }} />

      {/* CAMINO logo */}
      <div style={{
        position: "absolute",
        left: "50%", top: "50%",
        transform: `translate(-50%, -60%) scale(${logoScale})`,
        opacity: logoO,
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: serif, fontSize: 120, fontWeight: 900,
          color: "#F2E8D5", letterSpacing: "-0.02em",
        }}>
          Camino
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        position: "absolute",
        left: "50%", top: "60%",
        transform: `translateX(-50%) translateY(${tagY}px)`,
        opacity: tagO, textAlign: "center",
      }}>
        <div style={{
          fontFamily: sans, fontSize: 24, fontWeight: 300,
          color: "#7A8B6F", letterSpacing: "0.1em",
        }}>
          The digital passport for elite development
        </div>
      </div>
    </AbsoluteFill>
  );
};
