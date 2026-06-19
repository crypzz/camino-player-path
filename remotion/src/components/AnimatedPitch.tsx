import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS } from "../theme";

// AI-tracked soccer pitch with moving player dots — used in scene 2.
export const AnimatedPitch: React.FC<{ start?: number }> = ({ start = 0 }) => {
  const frame = useCurrentFrame() - start;
  const { fps } = useVideoConfig();

  const reveal = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 25 });
  const W = 760;
  const H = 460;

  // player dots with deterministic motion
  const players = [
    { id: 7, bx: 0.25, by: 0.35, ax: 0.4, ay: 0.4, hl: true },
    { id: 10, bx: 0.55, by: 0.5, ax: 0.62, ay: 0.45 },
    { id: 4, bx: 0.2, by: 0.7, ax: 0.3, ay: 0.62 },
    { id: 9, bx: 0.7, by: 0.3, ax: 0.78, ay: 0.5 },
    { id: 6, bx: 0.45, by: 0.75, ax: 0.5, ay: 0.65 },
    { id: 2, bx: 0.8, by: 0.7, ax: 0.7, ay: 0.72 },
  ];

  const t = interpolate(Math.sin(frame / 25), [-1, 1], [0, 1]);

  return (
    <div
      style={{
        width: W,
        height: H,
        transform: `scale(${0.9 + reveal * 0.1})`,
        opacity: reveal,
        borderRadius: 24,
        border: `1px solid ${COLORS.line}`,
        background: "linear-gradient(160deg, rgba(20,40,25,0.5), rgba(10,10,10,0.6))",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 30px 80px -20px rgba(0,0,0,0.8)",
      }}
    >
      {/* pitch markings */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <rect x={16} y={16} width={W - 32} height={H - 32} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={2} rx={8} />
        <line x1={W / 2} y1={16} x2={W / 2} y2={H - 16} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
        <circle cx={W / 2} cy={H / 2} r={60} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
        <rect x={16} y={H / 2 - 80} width={70} height={160} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
        <rect x={W - 86} y={H / 2 - 80} width={70} height={160} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
      </svg>

      {/* player dots */}
      {players.map((p, i) => {
        const px = interpolate(t, [0, 1], [p.bx, p.ax]) * W;
        const py = interpolate(t, [0, 1], [p.by, p.ay]) * H;
        const appear = spring({ frame: frame - 8 - i * 4, fps, config: { damping: 14 } });
        const size = p.hl ? 30 : 24;
        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              borderRadius: "50%",
              transform: `scale(${appear})`,
              background: p.hl ? COLORS.yellow : "rgba(255,255,255,0.85)",
              color: p.hl ? "#000" : "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 800,
              boxShadow: p.hl ? `0 0 24px ${COLORS.yellow}` : "0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            {p.id}
          </div>
        );
      })}

      {/* tracking badge */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          borderRadius: 999,
          background: "rgba(0,0,0,0.6)",
          border: `1px solid ${COLORS.yellow}55`,
          color: COLORS.yellow,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: COLORS.yellow,
            opacity: interpolate(Math.sin(frame / 6), [-1, 1], [0.3, 1]),
          }}
        />
        AI TRACKING
      </div>
    </div>
  );
};
