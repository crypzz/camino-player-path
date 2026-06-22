import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT, glow } from "../../theme";

// SCENE 5 — THE CLOSE (22-30s). Direct CTA + FOMO.
export const CloseReel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoP = spring({ frame, fps, config: { damping: 12 }, durationInFrames: 30 });
  const titleP = spring({ frame: frame - 14, fps, config: { damping: 18 } });
  const spotsP = spring({ frame: frame - 34, fps, config: { damping: 16 } });
  const btnP = spring({ frame: frame - 50, fps, config: { damping: 12 } });

  const pulse = interpolate(Math.sin(frame / 7), [-1, 1], [1, 1.06]);
  const btnGlow = interpolate(Math.sin(frame / 7), [-1, 1], [20, 50]);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.bg }}>
      <div style={{ transform: `scale(${0.7 + logoP * 0.3})`, opacity: logoP, marginBottom: 36 }}>
        <Img src={staticFile("images/logo.png")} style={{ width: 150, filter: `drop-shadow(0 0 50px ${COLORS.yellow})` }} />
      </div>

      <div
        style={{
          opacity: titleP,
          transform: `translateY(${interpolate(titleP, [0, 1], [30, 0])}px)`,
          textAlign: "center",
          fontSize: 62,
          fontWeight: 900,
          color: COLORS.white,
          letterSpacing: -1,
          lineHeight: 1.1,
          padding: "0 40px",
        }}
      >
        Get Verified.
        <br />
        Get Seen.
        <span style={{ display: "block", color: COLORS.yellow, textShadow: `0 0 36px ${COLORS.yellow}` }}>Get Recruited.</span>
      </div>

      {/* spots counter */}
      <div
        style={{
          opacity: spotsP,
          transform: `scale(${spotsP})`,
          marginTop: 40,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 22px",
          borderRadius: 999,
          background: "rgba(255,90,90,0.12)",
          border: "1px solid rgba(255,90,90,0.5)",
          color: "#ff7a7a",
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: 0.5,
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5a5a", boxShadow: "0 0 14px #ff5a5a" }} />
        Only 50 spots available
      </div>

      {/* CTA button */}
      <div
        style={{
          opacity: btnP,
          transform: `scale(${btnP * pulse})`,
          marginTop: 36,
          padding: "26px 56px",
          borderRadius: 999,
          background: `linear-gradient(135deg, ${COLORS.yellow}, ${COLORS.yellowDeep})`,
          color: "#000",
          fontSize: 42,
          fontWeight: 900,
          letterSpacing: 1,
          boxShadow: glow(COLORS.yellow, btnGlow),
        }}
      >
        CLAIM YOUR SPOT
      </div>

      <div style={{ opacity: btnP, marginTop: 26, textAlign: "center", color: COLORS.muted, fontSize: 26, fontWeight: 600, maxWidth: 700, padding: "0 40px" }}>
        Link in bio — first 50 players get{" "}
        <span style={{ color: COLORS.yellow, fontWeight: 800 }}>lifetime founder pricing</span>
      </div>

      <div style={{ position: "absolute", bottom: 60, opacity: btnP * 0.8, color: COLORS.muted, fontSize: 24, fontWeight: 700, letterSpacing: 1 }}>
        caminodevelopment.com
      </div>
    </AbsoluteFill>
  );
};
