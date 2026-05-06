import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { display, body, NAVY, GOLD, IVORY } from "./_tokens";

export const SMCTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const e = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const ty = interpolate(e, [0, 1], [30, 0]);

  const sub = interpolate(frame, [18, 32], [0, 1], { extrapolateRight: "clamp" });
  const url = interpolate(frame, [32, 46], [0, 1], { extrapolateRight: "clamp" });

  // Subtle gold sweep
  const sweep = interpolate(frame, [0, 90], [-100, 200]);

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, justifyContent: "center", alignItems: "center", padding: 60, overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 50% 50%, rgba(232,180,0,0.12) 0%, transparent 60%)`,
      }} />
      <div style={{
        position: "absolute", top: 0, bottom: 0, width: 400,
        left: `${sweep}%`, transform: "skewX(-20deg)",
        background: "linear-gradient(90deg, transparent, rgba(232,180,0,0.06), transparent)",
      }} />

      <div style={{ textAlign: "center", opacity: e, transform: `translateY(${ty}px)` }}>
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 220, lineHeight: 0.9,
          color: GOLD, letterSpacing: "-0.05em",
        }}>Camino</div>
        <div style={{
          marginTop: 18, fontFamily: display, fontWeight: 700, fontSize: 56,
          color: IVORY, letterSpacing: "-0.02em",
        }}>The player passport.</div>
      </div>

      <div style={{
        position: "absolute", bottom: 220,
        fontFamily: body, fontWeight: 600, fontSize: 32,
        color: "rgba(245,245,245,0.7)", letterSpacing: 4, textTransform: "uppercase",
        opacity: sub,
      }}>Built for serious players.</div>

      <div style={{
        position: "absolute", bottom: 110,
        padding: "18px 36px", borderRadius: 999,
        border: `2px solid ${GOLD}`, background: "rgba(232,180,0,0.1)",
        fontFamily: body, fontWeight: 700, fontSize: 30, color: GOLD,
        letterSpacing: 2, opacity: url,
      }}>caminodevelopment.com</div>
    </AbsoluteFill>
  );
};
