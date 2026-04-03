import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: serif } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["300", "400", "600"], subsets: ["latin"] });

const beforeItems = ["Scattered notes", "Subjective opinions", "No player history", "Lost potential"];
const afterItems = ["CPI Score: 78.4", "Level: Gold 6", "12 evaluations tracked", "Clear growth path"];

export const BeforeAfterScene = () => {
  const frame = useCurrentFrame();
  const grainY = (frame * 0.9) % 1920;

  // Divider wipe from top
  const dividerH = interpolate(frame, [10, 40], [0, 100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const numO = interpolate(frame, [0, 15], [0, 0.1], { extrapolateRight: "clamp" });

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

      {/* Background "2" */}
      <div style={{
        position: "absolute", left: "50%", top: "5%",
        transform: "translateX(-50%)",
        fontFamily: serif, fontSize: 250, fontWeight: 900,
        color: "#D4622B", opacity: numO, lineHeight: 1,
      }}>
        2
      </div>

      {/* BEFORE label */}
      <div style={{
        position: "absolute", left: 60, top: "18%",
        fontFamily: sans, fontSize: 20, fontWeight: 300,
        color: "#7A8B6F", letterSpacing: "0.2em",
        opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        BEFORE
      </div>

      {/* AFTER label */}
      <div style={{
        position: "absolute", right: 60, top: "18%",
        fontFamily: sans, fontSize: 20, fontWeight: 300,
        color: "#D4622B", letterSpacing: "0.2em",
        textAlign: "right",
        opacity: interpolate(frame, [8, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        AFTER
      </div>

      {/* Center divider */}
      <div style={{
        position: "absolute",
        left: "50%", top: "22%",
        width: 1,
        height: `${dividerH * 0.65}%`,
        backgroundColor: "#D4622B",
        opacity: 0.5,
      }} />

      {/* Before items — left column */}
      {beforeItems.map((item, i) => {
        const start = 20 + i * 15;
        const o = interpolate(frame, [start, start + 12], [0, 0.5], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const y = interpolate(frame, [start, start + 12], [15, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div key={`b${i}`} style={{
            position: "absolute", left: 60, width: "38%",
            top: `${28 + i * 14}%`,
            fontFamily: sans, fontSize: 28, fontWeight: 300,
            color: "#F2E8D5", opacity: o,
            transform: `translateY(${y}px)`,
          }}>
            {item}
          </div>
        );
      })}

      {/* After items — right column */}
      {afterItems.map((item, i) => {
        const start = 30 + i * 15;
        const o = interpolate(frame, [start, start + 12], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const y = interpolate(frame, [start, start + 12], [15, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div key={`a${i}`} style={{
            position: "absolute", right: 60, width: "38%",
            top: `${28 + i * 14}%`,
            fontFamily: sans, fontSize: 28, fontWeight: 400,
            color: "#F2E8D5", opacity: o,
            transform: `translateY(${y}px)`,
            textAlign: "right",
          }}>
            {item}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
