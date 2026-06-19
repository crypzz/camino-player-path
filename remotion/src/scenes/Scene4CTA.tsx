import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { COLORS, FONT, glow } from "../theme";

export const Scene4CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoS = spring({ frame: frame - 4, fps, config: { damping: 14 } });
  const titleS = spring({ frame: frame - 24, fps, config: { damping: 16 } });
  const subS = spring({ frame: frame - 44, fps, config: { damping: 18 } });
  const btnS = spring({ frame: frame - 60, fps, config: { damping: 12 } });

  // satisfying ding pulse on button
  const ding = spring({ frame: frame - 72, fps, config: { damping: 8, stiffness: 200 } });
  const btnScale = 1 + interpolate(ding, [0, 1], [0, 0.06]) * Math.max(0, 1 - (frame - 72) / 20);
  const glowStrength = interpolate(Math.sin(frame / 10), [-1, 1], [30, 70]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          top: 360,
          opacity: logoS,
          transform: `scale(${logoS})`,
          textAlign: "center",
        }}
      >
        <Img
          src={staticFile("images/logo.png")}
          style={{ width: 200, height: 200, objectFit: "contain", filter: `drop-shadow(0 0 40px ${COLORS.yellow}66)` }}
        />
      </div>

      <div
        style={{
          marginTop: 60,
          fontSize: 100,
          fontWeight: 900,
          color: COLORS.white,
          opacity: titleS,
          transform: `translateY(${interpolate(titleS, [0, 1], [40, 0])}px)`,
          textShadow: glow("rgba(252,211,77,0.3)", 30),
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        Join the
        <br />
        <span style={{ color: COLORS.yellow }}>Waitlist</span>
      </div>

      <div
        style={{
          marginTop: 36,
          fontSize: 36,
          fontWeight: 600,
          color: COLORS.muted,
          opacity: subS,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        First <span style={{ color: COLORS.white, fontWeight: 800 }}>50</span> get
        <br />
        lifetime founder pricing
      </div>

      {/* CTA button */}
      <div
        style={{
          position: "absolute",
          bottom: 320,
          opacity: btnS,
          transform: `scale(${btnScale})`,
        }}
      >
        <div
          style={{
            padding: "26px 70px",
            borderRadius: 999,
            background: COLORS.yellow,
            color: "#000",
            fontSize: 40,
            fontWeight: 900,
            letterSpacing: 0.5,
            boxShadow: glow(COLORS.yellow, glowStrength),
          }}
        >
          Link in bio →
        </div>
      </div>

      {/* watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: 60,
          fontSize: 26,
          fontWeight: 700,
          color: COLORS.muted,
          opacity: interpolate(frame, [70, 100], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        caminodevelopment.com
      </div>
    </AbsoluteFill>
  );
};
