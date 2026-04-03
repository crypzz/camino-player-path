import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: serif } = loadFont("normal", { weights: ["700", "900"], subsets: ["latin"] });
const { fontFamily: sans } = loadInter("normal", { weights: ["300", "400", "600"], subsets: ["latin"] });

export const ProfileRiseScene = () => {
  const frame = useCurrentFrame();
  const grainY = (frame * 1.5) % 1920;

  // "1" background
  const numO = interpolate(frame, [0, 15], [0, 0.1], { extrapolateRight: "clamp" });

  // Profile card rises from bottom
  const cardY = interpolate(frame, [15, 55], [600, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const cardO = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Header text
  const headerO = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Subtle float
  const floatY = Math.sin(frame * 0.04) * 4;

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

      {/* Background "1" */}
      <div style={{
        position: "absolute", left: 60, top: "8%",
        fontFamily: serif, fontSize: 300, fontWeight: 900,
        color: "#D4622B", opacity: numO, lineHeight: 1,
      }}>
        1
      </div>

      {/* Header */}
      <div style={{
        position: "absolute", left: 80, top: "18%",
        fontFamily: sans, fontSize: 26, fontWeight: 300,
        color: "#7A8B6F", letterSpacing: "0.15em",
        opacity: headerO,
      }}>
        PLATFORM. YOUR PATH.
      </div>

      {/* Profile card */}
      <div style={{
        position: "absolute",
        left: 80, right: 80,
        top: "32%",
        opacity: cardO,
        transform: `translateY(${cardY + floatY}px)`,
      }}>
        <div style={{
          backgroundColor: "#2A2520",
          borderRadius: 8,
          padding: "40px 36px",
          borderTop: "3px solid #D4622B",
        }}>
          {/* Avatar placeholder + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 30 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              backgroundColor: "#3A3530",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: sans, fontSize: 24, fontWeight: 600, color: "#D4622B",
            }}>
              MA
            </div>
            <div>
              <div style={{ fontFamily: serif, fontSize: 32, fontWeight: 700, color: "#F2E8D5" }}>
                Marco Alvarez
              </div>
              <div style={{ fontFamily: sans, fontSize: 18, fontWeight: 300, color: "#7A8B6F" }}>
                Midfielder · U-17
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {[
              { label: "CPI", val: "78.4" },
              { label: "Level", val: "Gold 6" },
              { label: "Rank", val: "#12" },
            ].map((s, i) => {
              const statO = interpolate(frame, [45 + i * 10, 55 + i * 10], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              });
              return (
                <div key={i} style={{ textAlign: "center", opacity: statO }}>
                  <div style={{
                    fontFamily: sans, fontSize: 14, fontWeight: 300,
                    color: "#7A8B6F", letterSpacing: "0.15em", marginBottom: 6,
                  }}>
                    {s.label}
                  </div>
                  <div style={{
                    fontFamily: serif, fontSize: 36, fontWeight: 700, color: "#F2E8D5",
                  }}>
                    {s.val}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Horizontal rule */}
          <div style={{
            height: 1, backgroundColor: "#D4622B", opacity: 0.3,
            marginTop: 24, marginBottom: 20,
            width: `${interpolate(frame, [55, 80], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`,
          }} />

          {/* Categories */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {[
              { label: "Technical", val: "82" },
              { label: "Tactical", val: "74" },
              { label: "Physical", val: "76" },
              { label: "Mental", val: "80" },
            ].map((c, i) => {
              const cO = interpolate(frame, [65 + i * 8, 75 + i * 8], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              });
              return (
                <div key={i} style={{ textAlign: "center", opacity: cO }}>
                  <div style={{
                    fontFamily: sans, fontSize: 12, fontWeight: 300,
                    color: "#7A8B6F", letterSpacing: "0.1em", marginBottom: 4,
                  }}>
                    {c.label}
                  </div>
                  <div style={{
                    fontFamily: sans, fontSize: 22, fontWeight: 600, color: "#F2E8D5",
                  }}>
                    {c.val}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
