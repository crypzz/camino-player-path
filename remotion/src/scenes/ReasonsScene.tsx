import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: serif } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["300", "400"], subsets: ["latin"] });

const reasons = [
  "No unified player data",
  "Inconsistent evaluations",
  "Zero development tracking",
  "Players lost in the system",
];

export const ReasonsScene = () => {
  const frame = useCurrentFrame();
  const grainY = (frame * 1.7) % 1920;

  // Number "4" anchored left
  const numO = interpolate(frame, [0, 15], [0, 0.15], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#1A1714" }}>
      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
      }} />

      {/* Film grain */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.05,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(242,232,213,0.3) 2px, rgba(242,232,213,0.3) 3px)`,
        transform: `translateY(${grainY}px)`,
      }} />

      {/* Background number */}
      <div style={{
        position: "absolute", left: 40, top: "15%",
        fontFamily: serif, fontSize: 300, fontWeight: 700,
        color: "#D4622B", opacity: numO, lineHeight: 1,
      }}>
        4
      </div>

      {/* Header */}
      <div style={{
        position: "absolute", left: 80, top: "22%",
        fontFamily: sans, fontSize: 26, fontWeight: 300,
        color: "#7A8B6F", letterSpacing: "0.15em",
        opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        REASONS COACHES LOSE TRACK
      </div>

      {/* Reasons list */}
      {reasons.map((reason, i) => {
        const appearAt = 15 + i * 18;
        const strikeAt = appearAt + 30;

        const itemO = interpolate(frame, [appearAt, appearAt + 12], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const itemY = interpolate(frame, [appearAt, appearAt + 12], [20, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });

        const strikeW = interpolate(frame, [strikeAt, strikeAt + 15], [0, 100], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });

        const dimO = interpolate(frame, [strikeAt, strikeAt + 15], [1, 0.35], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });

        return (
          <div key={i} style={{
            position: "absolute",
            left: 80,
            top: `${38 + i * 12}%`,
            opacity: itemO * dimO,
            transform: `translateY(${itemY}px)`,
          }}>
            <div style={{
              fontFamily: sans, fontSize: 42, fontWeight: 400,
              color: "#F2E8D5", position: "relative",
            }}>
              {reason}
              {/* Strikethrough line */}
              <div style={{
                position: "absolute",
                left: 0, top: "50%",
                height: 2,
                width: `${strikeW}%`,
                backgroundColor: "#D4622B",
              }} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
