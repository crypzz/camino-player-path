import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const BLUE = "#2B7FE8";
const RED = "#EF4444";
const WHITE = "#F4F4F2";
const PITCH = "#0E2A1A";
const LINE = "rgba(244,244,242,0.5)";
const CARD = "#111827";

export const FCCoachPOVScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Question types in
  const qChars = Math.min(34, Math.floor(interpolate(frame, [4, 50], [0, 34], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const QUESTION = "Where was the LB on the 2nd goal?";
  const visible = QUESTION.slice(0, qChars);

  // Answer pitch enters after question
  const ansSpring = spring({ frame: frame - 50, fps, config: { damping: 18 } });
  const ansOp = interpolate(frame, [50, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ansY = interpolate(ansSpring, [0, 1], [40, 0]);

  // Highlighted LB position
  const lbX = 24, lbY = 78;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, padding: "120px 60px 60px 60px" }}>
      <div style={{ fontFamily: bodyFont, fontSize: 22, color: GOLD, letterSpacing: "0.36em", textAlign: "center", marginBottom: 40 }}>
        FOR THE COACH
      </div>

      {/* Tactics-board style question card */}
      <div style={{
        backgroundColor: CARD, borderRadius: 18, padding: "36px 36px",
        border: `1px solid #1F2937`,
        boxShadow: `0 20px 60px ${BLUE}15`,
      }}>
        <div style={{ fontFamily: bodyFont, fontSize: 18, color: "#9AA3B2", letterSpacing: "0.22em", fontWeight: 600, marginBottom: 14 }}>
          COACH ASKS
        </div>
        <div style={{ fontFamily, fontWeight: 800, fontSize: 56, color: WHITE, letterSpacing: "-0.025em", lineHeight: 1.05, minHeight: 130 }}>
          "{visible}<span style={{ color: GOLD, opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0 }}>|</span>"
        </div>
      </div>

      {/* Answer block */}
      <div style={{ marginTop: 36, opacity: ansOp, transform: `translateY(${ansY}px)` }}>
        <div style={{ fontFamily: bodyFont, fontSize: 18, color: GOLD, letterSpacing: "0.22em", fontWeight: 700, marginBottom: 14, textAlign: "center" }}>
          FOLLOWCAM ANSWERS
        </div>
        <div style={{
          backgroundColor: CARD, borderRadius: 18, padding: 24, border: `1px solid #1F2937`,
        }}>
          {/* Top-down pitch */}
          <svg viewBox="0 0 100 60" width="100%" style={{ display: "block", borderRadius: 10 }}>
            <rect x={0} y={0} width={100} height={60} fill={PITCH} />
            <line x1={50} y1={0} x2={50} y2={60} stroke={LINE} strokeWidth={0.3} />
            <circle cx={50} cy={30} r={7} fill="none" stroke={LINE} strokeWidth={0.3} />
            <rect x={0} y={18} width={12} height={24} fill="none" stroke={LINE} strokeWidth={0.3} />
            <rect x={88} y={18} width={12} height={24} fill="none" stroke={LINE} strokeWidth={0.3} />

            {/* Other home players (blue) */}
            {[[10,30],[28,18],[28,42],[44,22],[44,38],[58,28],[58,40],[72,18],[72,42],[80,30]].map(([x,y],i)=>(
              <g key={i}>
                <circle cx={x} cy={y} r={1.8} fill={BLUE} stroke="#fff" strokeWidth={0.25} />
              </g>
            ))}
            {/* Away (red) */}
            {[[20,28],[34,32],[48,30],[62,22],[62,40],[76,30],[84,20],[84,40],[90,30]].map(([x,y],i)=>(
              <circle key={i} cx={x} cy={y} r={1.8} fill={RED} stroke="#fff" strokeWidth={0.25} />
            ))}

            {/* LB highlight (gold ring) */}
            <circle cx={lbX} cy={lbY > 60 ? 50 : lbY} r={4} fill="none" stroke={GOLD} strokeWidth={0.5}>
              <animate attributeName="r" values="3;6;3" dur="1.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite" />
            </circle>
            <circle cx={lbX} cy={50} r={2.2} fill={BLUE} stroke={GOLD} strokeWidth={0.6} />
            <text x={lbX} y={50} fontSize={1.6} fill={WHITE} fontFamily={bodyFont} fontWeight={700} textAnchor="middle" dominantBaseline="middle">3</text>

            {/* Trail of LB */}
            <path d={`M 28 30 Q 22 42 ${lbX} 50`} stroke={GOLD} strokeWidth={0.5} fill="none" strokeDasharray="1.2 0.8" />

            {/* Ball at goal */}
            <circle cx={92} cy={28} r={1.4} fill={WHITE} stroke={GOLD} strokeWidth={0.4} />

            {/* Caption pin */}
            <g transform={`translate(${lbX + 6} 50)`}>
              <rect x={0} y={-3} width={26} height={6} rx={1} fill={GOLD} />
              <text x={13} y={1} fontSize={2.6} fontFamily={bodyFont} fontWeight={700} fill={BG} textAnchor="middle">LB · #3</text>
            </g>
          </svg>

          <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: bodyFont, fontSize: 18, color: "#9AA3B2", fontWeight: 600 }}>
              Out of position · 18m from his line
            </div>
            <div style={{ fontFamily: bodyFont, fontSize: 16, color: GOLD, fontWeight: 700, letterSpacing: "0.16em" }}>
              74:21
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
