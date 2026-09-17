import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Shell, display, body, GOLD, WHITE, MUTED, glow } from "./_shared";

export const CloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line = spring({ frame: frame - 2, fps, config: { damping: 18, stiffness: 140 } });
  const mark = spring({ frame: frame - 34, fps, config: { damping: 15, stiffness: 140 } });
  const tag = interpolate(frame, [58, 76], [0, 1], { extrapolateRight: "clamp" });
  const url = interpolate(frame, [76, 94], [0, 1], { extrapolateRight: "clamp" });
  const shine = interpolate(Math.sin(frame / 9), [-1, 1], [22, 52]);

  return (
    <Shell>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80 }}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 78,
            color: WHITE,
            textAlign: "center",
            lineHeight: 1.08,
            opacity: line,
            transform: `translateY(${(1 - line) * 24}px)`,
          }}
        >
          Ask your club
          <br />
          for <span style={{ fontStyle: "italic", color: GOLD }}>receipts</span>.
        </div>

        <div
          style={{
            marginTop: 90,
            fontFamily: display,
            fontWeight: 800,
            fontSize: 108,
            letterSpacing: 14,
            color: WHITE,
            opacity: mark,
            transform: `scale(${0.88 + mark * 0.12})`,
            textShadow: glow("rgba(252,211,77,0.30)", shine),
          }}
        >
          CAMINO
        </div>

        <div
          style={{
            marginTop: 22,
            fontFamily: body,
            fontSize: 34,
            fontWeight: 600,
            color: MUTED,
            opacity: tag,
            textAlign: "center",
          }}
        >
          Your development. <span style={{ color: GOLD }}>Your pathway.</span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 190,
            fontFamily: body,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 2,
            color: "rgba(255,255,255,0.75)",
            opacity: url,
          }}
        >
          caminodevelopment.com
        </div>
      </AbsoluteFill>
    </Shell>
  );
};
