import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

const apps = ["Veo", "TeamSnap", "Hudl", "Spreadsheets"];

export const ReelHookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame: frame - 4, fps, config: { damping: 18, stiffness: 180 } });
  const numberS = spring({ frame: frame - 18, fps, config: { damping: 10, stiffness: 200 } });
  const subS = spring({ frame: frame - 50, fps, config: { damping: 22 } });
  const fadeOut = interpolate(frame, [78, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Number ticks 1 → 2 → 3 → 4
  const tickFrames = [18, 28, 36, 44];
  let count = 0;
  for (const f of tickFrames) if (frame >= f) count++;

  const shake = interpolate(frame % 6, [0, 3, 6], [-2, 2, -2]) * (frame > 18 && frame < 50 ? 1 : 0);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #0D1117 0%, #161B22 100%)", fontFamily: body }}>
      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(232,180,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(232,180,0,0.06) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        opacity: 0.5,
      }} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80, opacity: fadeOut }}>
        <div style={{
          fontFamily: body, fontWeight: 600, fontSize: 38, color: "#E8B400", letterSpacing: 4,
          textTransform: "uppercase", marginBottom: 30,
          opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(titleS, [0, 1], [20, 0])}px)`,
        }}>
          Your club pays for
        </div>

        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 380, color: "#fff",
          lineHeight: 1, transform: `scale(${interpolate(numberS, [0, 1], [0.3, 1])}) translateX(${shake}px)`,
          opacity: numberS,
          textShadow: "0 0 80px rgba(232,180,0,0.4)",
        }}>
          {count}
        </div>

        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 90, color: "#fff",
          marginTop: 10, transform: `translateY(${interpolate(titleS, [0, 1], [40, 0])}px)`,
          opacity: titleS,
        }}>
          APPS?
        </div>

        {/* App names ticker */}
        <div style={{ marginTop: 60, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", maxWidth: 900 }}>
          {apps.slice(0, count).map((a, i) => (
            <div key={a} style={{
              fontFamily: body, fontWeight: 600, fontSize: 30, color: "#fff",
              padding: "12px 24px", border: "2px solid rgba(255,255,255,0.2)",
              borderRadius: 12, background: "rgba(255,255,255,0.04)",
              opacity: interpolate(frame, [tickFrames[i], tickFrames[i] + 8], [0, 1], { extrapolateRight: "clamp" }),
              transform: `scale(${interpolate(frame, [tickFrames[i], tickFrames[i] + 10], [0.7, 1], { extrapolateRight: "clamp" })})`,
            }}>
              {a}
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 80, fontFamily: display, fontWeight: 800, fontSize: 56, color: "#E8B400",
          textAlign: "center", lineHeight: 1.1,
          opacity: subS, transform: `translateY(${interpolate(subS, [0, 1], [30, 0])}px)`,
        }}>
          You only need ONE.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
