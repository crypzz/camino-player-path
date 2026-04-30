import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const BLUE = "#2B7FE8";
const WHITE = "#F4F4F2";
const RED = "#EF4444";
const CARD = "#111827";

export const FCLiveStreamScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const camIn = spring({ frame, fps, config: { damping: 18 } });
  const cloudIn = spring({ frame: frame - 18, fps, config: { damping: 18 } });
  const phoneIn = spring({ frame: frame - 36, fps, config: { damping: 16 } });

  // Animated upload arc dashOffset
  const dash1 = -interpolate(frame, [0, 105], [0, 200]);
  const dash2 = -interpolate(frame, [0, 105], [0, 200]) + 100;

  const titleOp = interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 120, fontFamily: bodyFont, fontSize: 22, color: GOLD, letterSpacing: "0.36em" }}>
        LIVE PIPELINE
      </div>

      <svg width={900} height={1400} viewBox="0 0 900 1400" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0} />
            <stop offset="50%" stopColor={GOLD} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Camera node */}
        <g transform={`translate(170 280) scale(${interpolate(camIn, [0, 1], [0.6, 1])})`} opacity={interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" })}>
          <circle r={90} fill={CARD} stroke={GOLD} strokeWidth={3} />
          <rect x={-46} y={-26} width={92} height={52} rx={8} fill="#1C2230" stroke={GOLD} strokeWidth={1.5} />
          <circle cx={0} cy={0} r={18} fill="#05090F" stroke={GOLD} strokeWidth={2} />
          <circle cx={0} cy={0} r={8} fill={GOLD} opacity={0.7} />
          <text y={130} fontSize={28} fontFamily={bodyFont} fontWeight={700} fill={WHITE} textAnchor="middle">FOLLOWCAM</text>
          <text y={160} fontSize={20} fontFamily={bodyFont} fontWeight={500} fill={GOLD} textAnchor="middle">● REC 1080p</text>
        </g>

        {/* Cloud node */}
        <g transform={`translate(720 360) scale(${interpolate(cloudIn, [0, 1], [0.6, 1])})`} opacity={interpolate(frame, [18, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <ellipse rx={130} ry={70} fill={CARD} stroke={BLUE} strokeWidth={3} />
          <text y={10} fontSize={32} fontFamily={bodyFont} fontWeight={700} fill={WHITE} textAnchor="middle">CAMINO CLOUD</text>
          <text y={104} fontSize={20} fontFamily={bodyFont} fontWeight={500} fill={BLUE} textAnchor="middle">AI · Stats · Storage</text>
        </g>

        {/* Arc 1: cam → cloud */}
        <path d="M 260 280 Q 450 140 620 360" fill="none" stroke="url(#arcGrad)" strokeWidth={4} strokeDasharray="14 10" strokeDashoffset={dash1} opacity={interpolate(frame, [10, 24], [0, 1], { extrapolateRight: "clamp" })} />

        {/* Arc 2: cloud → phone */}
        <path d="M 720 430 Q 600 760 460 950" fill="none" stroke="url(#arcGrad)" strokeWidth={4} strokeDasharray="14 10" strokeDashoffset={dash2} opacity={interpolate(frame, [28, 42], [0, 1], { extrapolateRight: "clamp" })} />

        {/* Phone node */}
        <g transform={`translate(450 1050) scale(${interpolate(phoneIn, [0, 1], [0.6, 1])})`} opacity={interpolate(frame, [36, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          {/* phone body */}
          <rect x={-160} y={-260} width={320} height={520} rx={36} fill={CARD} stroke="#2A3242" strokeWidth={3} />
          <rect x={-140} y={-238} width={280} height={476} rx={22} fill="#05090F" />
          {/* notch */}
          <rect x={-30} y={-252} width={60} height={14} rx={7} fill="#000" />

          {/* live label */}
          <g transform="translate(-118 -210)">
            <rect width={80} height={26} rx={4} fill={RED} />
            <circle cx={12} cy={13} r={4} fill={WHITE}>
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
            </circle>
            <text x={48} y={18} fontSize={14} fontFamily={bodyFont} fontWeight={700} fill={WHITE} textAnchor="middle">LIVE</text>
          </g>
          {/* score */}
          <text x={0} y={-180} fontSize={22} fontFamily={bodyFont} fontWeight={700} fill={WHITE} textAnchor="middle">CAMINO  2 — 1  RIVAL</text>

          {/* "video" pitch */}
          <rect x={-122} y={-150} width={244} height={150} rx={6} fill="#0F2A1A" />
          <line x1={0} y1={-150} x2={0} y2={0} stroke={WHITE} strokeWidth={0.6} opacity={0.4} />
          <circle cx={0} cy={-75} r={14} fill="none" stroke={WHITE} strokeWidth={0.6} opacity={0.4} />
          {/* dots = players */}
          {[[-90,-30],[-50,-110],[-20,-60],[20,-90],[60,-40],[90,-100],[-70,-70],[10,-20],[40,-130]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r={3} fill={i % 3 === 0 ? GOLD : BLUE} />
          ))}
          <circle cx={interpolate((frame % 90) / 90, [0,1], [-100, 100])} cy={-70} r={2.5} fill={WHITE} />

          {/* live ticker */}
          <rect x={-122} y={20} width={244} height={40} rx={6} fill="#1C2230" />
          <text x={-110} y={45} fontSize={14} fontFamily={bodyFont} fontWeight={600} fill={GOLD}>LIVE STATS</text>
          <text x={114} y={45} fontSize={14} fontFamily={bodyFont} fontWeight={600} fill={WHITE} textAnchor="end">68% poss · 14 shots</text>

          {/* mini cards */}
          {[
            { label: "xG", val: "1.4" },
            { label: "Sprints", val: "47" },
            { label: "Passes", val: "284" },
          ].map((s, i) => (
            <g key={s.label} transform={`translate(${-110 + i * 80} 80)`}>
              <rect width={70} height={60} rx={6} fill="#1C2230" />
              <text x={35} y={26} fontSize={12} fontFamily={bodyFont} fontWeight={500} fill="#9AA3B2" textAnchor="middle">{s.label}</text>
              <text x={35} y={48} fontSize={20} fontFamily={bodyFont} fontWeight={700} fill={GOLD} textAnchor="middle">{s.val}</text>
            </g>
          ))}
        </g>
      </svg>

      <div style={{
        position: "absolute", bottom: 140, left: 0, right: 0, textAlign: "center",
        opacity: titleOp, padding: "0 60px",
      }}>
        <div style={{ fontFamily, fontWeight: 800, fontSize: 64, color: WHITE, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
          Streaming live to <span style={{ color: GOLD }}>Camino.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
