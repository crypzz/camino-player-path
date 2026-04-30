import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["600", "700"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const BLUE = "#2B7FE8";
const RED = "#EF4444";
const WHITE = "#F4F4F2";
const PITCH = "#0E2A1A";
const LINE = "rgba(244, 244, 242, 0.45)";

// 11 home (blue) + 11 away (red) — start positions and end positions (normalized 0..100)
type P = { x: number; y: number };
const HOME_START: P[] = [
  { x: 8, y: 50 }, // GK
  { x: 22, y: 18 }, { x: 22, y: 38 }, { x: 22, y: 62 }, { x: 22, y: 82 }, // back 4
  { x: 38, y: 30 }, { x: 38, y: 50 }, { x: 38, y: 70 }, // mid 3
  { x: 55, y: 25 }, { x: 55, y: 75 }, // wingers
  { x: 60, y: 50 }, // ST
];
const HOME_END: P[] = [
  { x: 12, y: 50 },
  { x: 30, y: 18 }, { x: 32, y: 40 }, { x: 32, y: 60 }, { x: 30, y: 82 },
  { x: 50, y: 32 }, { x: 52, y: 50 }, { x: 50, y: 68 },
  { x: 72, y: 22 }, { x: 72, y: 78 },
  { x: 82, y: 48 }, // ST advanced — gold highlight
];
const AWAY_START: P[] = [
  { x: 92, y: 50 },
  { x: 78, y: 20 }, { x: 78, y: 40 }, { x: 78, y: 60 }, { x: 78, y: 80 },
  { x: 62, y: 30 }, { x: 62, y: 50 }, { x: 62, y: 70 },
  { x: 45, y: 25 }, { x: 45, y: 75 },
  { x: 40, y: 50 },
];
const AWAY_END: P[] = [
  { x: 88, y: 50 },
  { x: 70, y: 22 }, { x: 70, y: 42 }, { x: 70, y: 58 }, { x: 70, y: 78 },
  { x: 56, y: 32 }, { x: 56, y: 52 }, { x: 56, y: 70 },
  { x: 38, y: 28 }, { x: 38, y: 72 },
  { x: 32, y: 50 },
];

export const FC3DReplayScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Camera orbit (rotate Z continuously, slight rotateX hold)
  const orbit = interpolate(frame, [0, 135], [-18, 18]);
  const inSpring = spring({ frame, fps, config: { damping: 22, stiffness: 60 } });
  const enterScale = interpolate(inSpring, [0, 1], [0.82, 1]);
  const enterOp = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });

  // Phase progress (players animate from start → end across most of the scene)
  const phase = interpolate(frame, [20, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ease = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const tt = ease(phase);

  // Ball moves from midfield to ST
  const ballX = interpolate(tt, [0, 1], [55, 80]);
  const ballY = interpolate(tt, [0, 1], [50, 48]);

  const titleOp = interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(spring({ frame: frame - 70, fps, config: { damping: 18 } }), [0, 1], [20, 0]);

  // Pitch sized in viewport coords
  const PW = 880, PH = 560;

  const playerDot = (start: P, end: P, color: string, n: number, highlight = false) => {
    const x = start.x + (end.x - start.x) * tt;
    const y = start.y + (end.y - start.y) * tt;
    return (
      <g key={`${color}-${n}`}>
        {/* Trail */}
        <line
          x1={`${start.x}%`} y1={`${start.y}%`}
          x2={`${x}%`} y2={`${y}%`}
          stroke={color} strokeWidth={highlight ? 2.4 : 1.2}
          opacity={highlight ? 0.85 : 0.35} strokeLinecap="round"
        />
        {/* Shadow */}
        <ellipse cx={`${x}%`} cy={`${y + 1.2}%`} rx={highlight ? 12 : 9} ry={3} fill="#000" opacity={0.35} />
        {/* Dot */}
        <circle cx={`${x}%`} cy={`${y}%`} r={highlight ? 11 : 8} fill={color} stroke={highlight ? GOLD : "#FFFFFFaa"} strokeWidth={highlight ? 3 : 1.4} />
        <text x={`${x}%`} y={`${y}%`} fontSize={9} fontFamily={bodyFont} fontWeight={700} fill={WHITE} textAnchor="middle" dominantBaseline="middle">{n}</text>
        {highlight && (
          <circle cx={`${x}%`} cy={`${y}%`} r={20} fill="none" stroke={GOLD} strokeWidth={2}>
            <animate attributeName="r" values="14;26;14" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0;0.9" dur="1.6s" repeatCount="indefinite" />
          </circle>
        )}
      </g>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: BG, alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 110, fontFamily: bodyFont, fontSize: 22, color: GOLD, letterSpacing: "0.36em" }}>
        POST-GAME · 3D REPLAY
      </div>

      <div style={{
        perspective: 1600, transformStyle: "preserve-3d",
        opacity: enterOp, transform: `scale(${enterScale})`,
      }}>
        <div style={{
          width: PW, height: PH, position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateX(58deg) rotateZ(${orbit}deg)`,
          boxShadow: "0 80px 120px rgba(0,0,0,0.6)",
        }}>
          {/* pitch surface */}
          <div style={{
            position: "absolute", inset: 0, backgroundColor: PITCH,
            backgroundImage: `repeating-linear-gradient(90deg, ${PITCH} 0 8.33%, #0B2515 8.33% 16.66%)`,
            borderRadius: 8, border: `2px solid ${LINE}`,
          }} />
          {/* Pitch markings via SVG overlay */}
          <svg viewBox={`0 0 ${PW} ${PH}`} width={PW} height={PH} style={{ position: "absolute", inset: 0 }}>
            {/* halfway line */}
            <line x1={PW / 2} y1={0} x2={PW / 2} y2={PH} stroke={LINE} strokeWidth={2} />
            <circle cx={PW / 2} cy={PH / 2} r={70} fill="none" stroke={LINE} strokeWidth={2} />
            {/* boxes */}
            <rect x={0} y={PH / 2 - 110} width={110} height={220} fill="none" stroke={LINE} strokeWidth={2} />
            <rect x={PW - 110} y={PH / 2 - 110} width={110} height={220} fill="none" stroke={LINE} strokeWidth={2} />
            <rect x={0} y={PH / 2 - 50} width={40} height={100} fill="none" stroke={LINE} strokeWidth={2} />
            <rect x={PW - 40} y={PH / 2 - 50} width={40} height={100} fill="none" stroke={LINE} strokeWidth={2} />

            {/* Players */}
            {HOME_START.map((s, i) => playerDot(s, HOME_END[i], BLUE, i + 1, i === 10))}
            {AWAY_START.map((s, i) => playerDot(s, AWAY_END[i], RED, i + 1))}

            {/* Ball */}
            <circle cx={`${ballX}%`} cy={`${ballY}%`} r={7} fill={WHITE} stroke={GOLD} strokeWidth={2} />
            <circle cx={`${ballX}%`} cy={`${ballY}%`} r={14} fill={GOLD} opacity={0.25} />
          </svg>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 130, left: 0, right: 0, textAlign: "center",
        opacity: titleOp, transform: `translateY(${titleY}px)`, padding: "0 60px",
      }}>
        <div style={{ fontFamily, fontWeight: 800, fontSize: 64, color: WHITE, letterSpacing: "-0.03em", lineHeight: 1.02 }}>
          Every player. <span style={{ color: GOLD }}>Every play.</span>
        </div>
        <div style={{ marginTop: 14, fontFamily: bodyFont, fontSize: 24, color: "#9AA3B2", fontWeight: 600 }}>
          3D pitch replay · powered by FollowCam
        </div>
      </div>
    </AbsoluteFill>
  );
};
