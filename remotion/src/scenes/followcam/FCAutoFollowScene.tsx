import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["600"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const WHITE = "#F4F4F2";
const PITCH = "#0F2A1A";
const LINE = "#F4F4F255";

export const FCAutoFollowScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ball path across pitch (normalized 0-100 within pitch)
  const t = interpolate(frame, [10, 95], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ballX = interpolate(t, [0, 0.3, 0.6, 1], [15, 45, 70, 88]);
  const ballY = interpolate(t, [0, 0.3, 0.6, 1], [70, 40, 60, 30]);

  // Camera position (fixed sideline) — angle to ball
  const camX = 50, camY = 102;
  const dx = ballX - camX, dy = ballY - camY;
  const angle = Math.atan2(dx, -dy) * (180 / Math.PI);

  const titleOp = interpolate(frame, [55, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(spring({ frame: frame - 55, fps, config: { damping: 20 } }), [0, 1], [20, 0]);

  const pitchScale = interpolate(spring({ frame, fps, config: { damping: 22 } }), [0, 1], [0.92, 1]);

  // Pitch dims in svg units
  const PW = 700, PH = 500;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", top: 140, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: bodyFont, fontSize: 22, color: GOLD, letterSpacing: "0.36em" }}>
          FOLLOWCAM · AI TRACKING
        </div>
      </div>

      <div style={{ transform: `scale(${pitchScale})` }}>
        <svg width={PW} height={PH + 120} viewBox={`0 0 100 ${(PH + 120) / PW * 100}`} style={{ overflow: "visible" }}>
          <defs>
            <radialGradient id="coneGrad" cx="0.5" cy="0" r="1">
              <stop offset="0%" stopColor={GOLD} stopOpacity={0.55} />
              <stop offset="70%" stopColor={GOLD} stopOpacity={0.1} />
              <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
            </radialGradient>
          </defs>

          {/* Pitch */}
          <rect x={2} y={2} width={96} height={(PH - 4) / PW * 100} fill={PITCH} stroke={LINE} strokeWidth={0.4} rx={1} />
          {/* halfway */}
          <line x1={50} y1={2} x2={50} y2={(PH - 2) / PW * 100} stroke={LINE} strokeWidth={0.3} />
          <circle cx={50} cy={(PH / 2) / PW * 100} r={6} fill="none" stroke={LINE} strokeWidth={0.3} />
          {/* boxes */}
          <rect x={2} y={(PH / 2 - 80) / PW * 100} width={10} height={160 / PW * 100} fill="none" stroke={LINE} strokeWidth={0.3} />
          <rect x={88} y={(PH / 2 - 80) / PW * 100} width={10} height={160 / PW * 100} fill="none" stroke={LINE} strokeWidth={0.3} />

          {/* Tracking cone (camera FOV) */}
          <g transform={`translate(${camX} ${camY}) rotate(${angle})`}>
            <polygon points="0,0 -22,-110 22,-110" fill="url(#coneGrad)" />
            <polygon points="0,0 -22,-110 22,-110" fill="none" stroke={GOLD} strokeWidth={0.4} strokeDasharray="1.2 0.8" opacity={0.8} />
          </g>

          {/* Ghost trail */}
          {[0, 0.15, 0.3, 0.45].map((off, i) => {
            const tt = Math.max(0, t - off);
            const tx = interpolate(tt, [0, 0.3, 0.6, 1], [15, 45, 70, 88]);
            const ty = interpolate(tt, [0, 0.3, 0.6, 1], [70, 40, 60, 30]);
            return <circle key={i} cx={tx} cy={ty} r={1.2} fill={WHITE} opacity={0.15 - i * 0.03} />;
          })}

          {/* Ball */}
          <circle cx={ballX} cy={ballY} r={1.8} fill={WHITE} stroke={GOLD} strokeWidth={0.4} />
          <circle cx={ballX} cy={ballY} r={4} fill={GOLD} opacity={0.25} />

          {/* Camera tripod */}
          <g transform={`translate(${camX} ${camY})`}>
            <circle r={3} fill={STEEL_DARK} stroke={GOLD} strokeWidth={0.5} />
            <circle r={1.4} fill={GOLD}>
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
            </circle>
          </g>
          <text x={camX} y={camY + 8} fontSize={2.4} fill={GOLD} fontFamily={bodyFont} fontWeight={600} textAnchor="middle">FOLLOWCAM</text>
        </svg>
      </div>

      <div style={{
        position: "absolute", bottom: 220, left: 0, right: 0, textAlign: "center",
        opacity: titleOp, transform: `translateY(${titleY}px)`,
      }}>
        <div style={{
          fontFamily, fontWeight: 800, fontSize: 78, color: WHITE,
          letterSpacing: "-0.03em", lineHeight: 1, padding: "0 60px",
        }}>
          AI auto-tracks <span style={{ color: GOLD }}>every play.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const STEEL_DARK = "#1C2230";
