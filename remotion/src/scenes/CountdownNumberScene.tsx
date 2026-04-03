import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: serif } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["300", "400"], subsets: ["latin"] });

export const CountdownNumberScene: React.FC<{
  number: number;
  subtitle: string;
}> = ({ number, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Number slides in from left
  const numX = interpolate(frame, [0, 25], [-200, 80], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const numO = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Subtitle fades in after number
  const subO = interpolate(frame, [18, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subY = interpolate(frame, [18, 35], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Horizontal rule extends
  const lineW = interpolate(frame, [10, 40], [0, 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Film grain
  const grainY = (frame * 1.3) % 1920;

  return (
    <AbsoluteFill style={{ backgroundColor: "#1A1714" }}>
      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
      }} />

      {/* Film grain overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(242,232,213,0.3) 2px,
          rgba(242,232,213,0.3) 3px
        )`,
        transform: `translateY(${grainY}px)`,
      }} />

      {/* Large number — left anchored */}
      <div style={{
        position: "absolute",
        left: numX,
        top: "50%",
        transform: "translateY(-65%)",
        fontFamily: serif,
        fontSize: 380,
        fontWeight: 900,
        color: "#D4622B",
        opacity: numO,
        lineHeight: 1,
      }}>
        {number}
      </div>

      {/* Horizontal rule */}
      <div style={{
        position: "absolute",
        left: 80,
        top: "62%",
        height: 2,
        width: lineW,
        backgroundColor: "#F2E8D5",
        opacity: 0.4,
      }} />

      {/* Subtitle */}
      <div style={{
        position: "absolute",
        left: 80,
        top: "66%",
        fontFamily: sans,
        fontSize: 32,
        fontWeight: 300,
        color: "#F2E8D5",
        opacity: subO,
        transform: `translateY(${subY}px)`,
        letterSpacing: "0.05em",
      }}>
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};
