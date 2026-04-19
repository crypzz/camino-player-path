import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

export const AICoachHookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cursor blink
  const cursorOn = Math.floor(frame / 12) % 2 === 0;

  // "You coach 20 players." — types in
  const q1Full = "You coach 20 players.";
  const q1Chars = Math.min(q1Full.length, Math.max(0, Math.floor((frame - 4) * 0.9)));
  const q1Text = q1Full.slice(0, q1Chars);
  const q1Done = frame > 30;

  // "You remember 4." — punch in
  const q2S = spring({ frame: frame - 42, fps, config: { damping: 12, stiffness: 180 } });
  const q2Op = interpolate(frame, [42, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const q2Scale = interpolate(q2S, [0, 1], [1.4, 1]);
  const numberPulse = frame > 50 && frame < 70
    ? 1 + Math.sin((frame - 50) * 0.6) * 0.04
    : 1;

  // Red underline on "4"
  const underlineW = interpolate(frame, [55, 75], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Bottom kicker
  const kickerS = spring({ frame: frame - 78, fps, config: { damping: 18 } });
  const kickerOp = interpolate(frame, [78, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const fadeOut = interpolate(frame, [100, 110], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #07090F 0%, #0D1117 60%, #161B22 100%)", fontFamily: body }}>
      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)",
      }} />

      {/* Subtle grain via gradient noise */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 20% 80%, rgba(232,180,0,0.08), transparent 40%), radial-gradient(circle at 80% 20%, rgba(232,180,0,0.05), transparent 40%)",
      }} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80, opacity: fadeOut }}>
        {/* Q1 — typed */}
        <div style={{
          fontFamily: display, fontWeight: 700, fontSize: 96, color: "rgba(255,255,255,0.55)",
          lineHeight: 1.1, letterSpacing: -2, textAlign: "center",
          minHeight: 120,
        }}>
          {q1Text}
          {!q1Done && (
            <span style={{
              display: "inline-block", width: 6, height: 86, background: "#E8B400",
              marginLeft: 12, verticalAlign: "middle", opacity: cursorOn ? 1 : 0,
            }} />
          )}
        </div>

        {/* Spacer */}
        <div style={{ height: 40 }} />

        {/* Q2 — slam */}
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 140, color: "#fff",
          lineHeight: 1, letterSpacing: -4, textAlign: "center",
          opacity: q2Op,
          transform: `scale(${q2Scale * numberPulse})`,
          textShadow: "0 0 60px rgba(232,180,0,0.3)",
        }}>
          You remember{" "}
          <span style={{ position: "relative", display: "inline-block" }}>
            <span style={{
              background: "linear-gradient(135deg, #FFD340, #E8B400)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontSize: 200,
            }}>4</span>
            {/* Gold underline */}
            <div style={{
              position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)",
              width: `${underlineW}%`, height: 8, background: "linear-gradient(90deg, transparent, #E8B400, transparent)",
              borderRadius: 4,
            }} />
          </span>
          .
        </div>

        {/* Kicker */}
        <div style={{
          marginTop: 80,
          opacity: kickerOp,
          transform: `translateY(${interpolate(kickerS, [0, 1], [20, 0])}px)`,
          fontFamily: body, fontWeight: 600, fontSize: 30,
          color: "#E8B400", letterSpacing: 5, textTransform: "uppercase",
          textAlign: "center",
        }}>
          There's a fix for that.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
