import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { display, body, NAVY, GOLD, IVORY } from "./_tokens";

export const SMHookScene = () => {
  const frame = useCurrentFrame();
  const dur = 60;

  // Three words slammed in at frames 0, 12, 24 — already-readable, no scale glitch
  const word = (start: number) => ({
    opacity: interpolate(frame, [start, start + 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    transform: `translateY(${interpolate(frame, [start, start + 8], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
  });

  const sub = interpolate(frame, [36, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Slow Ken Burns
  const scale = interpolate(frame, [0, dur], [1.04, 1.10]);
  const fadeOut = interpolate(frame, [dur - 6, dur], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, overflow: "hidden", opacity: fadeOut }}>
      <Img src={staticFile("aio/hook-player.jpg")} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "50% 30%",
        transform: `scale(${scale})`,
        filter: "saturate(0.85) contrast(1.05)",
      }} />
      <AbsoluteFill style={{
        background: "linear-gradient(180deg, rgba(10,12,18,0.55) 0%, rgba(10,12,18,0.85) 70%, rgba(10,12,18,0.95) 100%)",
      }} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 168, lineHeight: 0.95, letterSpacing: "-0.04em", color: IVORY, ...word(0) }}>EVERY</div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 168, lineHeight: 0.95, letterSpacing: "-0.04em", color: IVORY, ...word(12) }}>GAME.</div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 168, lineHeight: 0.95, letterSpacing: "-0.04em", color: GOLD, ...word(24) }}>RANKED.</div>
          <div style={{
            marginTop: 36, fontFamily: body, fontWeight: 600, fontSize: 32,
            color: "rgba(245,245,245,0.75)", letterSpacing: 4, textTransform: "uppercase",
            opacity: sub,
          }}>The player passport for serious soccer.</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
