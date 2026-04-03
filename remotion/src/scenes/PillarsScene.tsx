import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: serif } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["300", "400", "600"], subsets: ["latin"] });

const pillars = [
  { label: "CPI", value: "78.4", desc: "Camino Player Index" },
  { label: "LEVEL", value: "Gold 6", desc: "Development Tier" },
  { label: "RANK", value: "#12", desc: "Club Standing" },
];

export const PillarsScene = () => {
  const frame = useCurrentFrame();
  const grainY = (frame * 1.1) % 1920;

  const numO = interpolate(frame, [0, 15], [0, 0.12], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#1A1714" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, opacity: 0.05,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(242,232,213,0.3) 2px, rgba(242,232,213,0.3) 3px)`,
        transform: `translateY(${grainY}px)`,
      }} />

      {/* Background "3" */}
      <div style={{
        position: "absolute", right: 40, top: "8%",
        fontFamily: serif, fontSize: 280, fontWeight: 900,
        color: "#D4622B", opacity: numO, lineHeight: 1,
      }}>
        3
      </div>

      {/* Header */}
      <div style={{
        position: "absolute", left: 80, top: "15%",
        fontFamily: sans, fontSize: 26, fontWeight: 300,
        color: "#7A8B6F", letterSpacing: "0.15em",
        opacity: interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        PILLARS THAT DEFINE YOU
      </div>

      {/* Pillar cards */}
      {pillars.map((p, i) => {
        const start = 20 + i * 25;
        const cardO = interpolate(frame, [start, start + 20], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const cardX = interpolate(frame, [start, start + 20], [60, 0], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });

        return (
          <div key={i} style={{
            position: "absolute",
            left: 80, right: 80,
            top: `${32 + i * 20}%`,
            opacity: cardO,
            transform: `translateX(${cardX}px)`,
          }}>
            <div style={{
              backgroundColor: "#2A2520",
              borderLeft: "3px solid #D4622B",
              padding: "28px 36px",
              borderRadius: 4,
            }}>
              <div style={{
                fontFamily: sans, fontSize: 16, fontWeight: 300,
                color: "#7A8B6F", letterSpacing: "0.2em",
                marginBottom: 8,
              }}>
                {p.label}
              </div>
              <div style={{
                fontFamily: serif, fontSize: 52, fontWeight: 700,
                color: "#F2E8D5", lineHeight: 1.1,
              }}>
                {p.value}
              </div>
              <div style={{
                fontFamily: sans, fontSize: 18, fontWeight: 300,
                color: "#7A8B6F", marginTop: 6,
              }}>
                {p.desc}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
