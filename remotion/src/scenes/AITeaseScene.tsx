import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: bebas } = loadFont();
const { fontFamily: inter } = loadInter();

const BG = "#060810";
const GOLD = "#E8B400";
const SCAN_COLOR = "#2B7FE8";

export const AITeaseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scan line sweeps vertically
  const scanY = interpolate(frame, [0, 80], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Glitch shake
  const shake = frame > 60 && frame < 75 ? Math.sin(frame * 8) * 4 : 0;

  // AI text
  const aiSpring = spring({ frame: frame - 70, fps, config: { damping: 12, stiffness: 140 } });
  const aiScale = interpolate(aiSpring, [0, 1], [0.6, 1]);
  const aiOp = interpolate(frame, [70, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Coming soon
  const csOp = interpolate(frame, [90, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const csPulse = 0.85 + Math.sin(frame * 0.08) * 0.15;

  // Faint grid
  const gridOp = interpolate(frame, [0, 20], [0, 0.08], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, transform: `translateX(${shake}px)` }}>
      {/* Grid pattern */}
      <svg style={{ position: "absolute", inset: 0, opacity: gridOp }} width="1080" height="1920">
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 96} x2="1080" y2={i * 96} stroke={SCAN_COLOR} strokeWidth="0.5" />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 90} y1="0" x2={i * 90} y2="1920" stroke={SCAN_COLOR} strokeWidth="0.5" />
        ))}
      </svg>

      {/* Scan line */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: 3,
        top: `${scanY}%`,
        background: `linear-gradient(90deg, transparent, ${SCAN_COLOR}, transparent)`,
        boxShadow: `0 0 40px 10px ${SCAN_COLOR}44`,
      }} />

      {/* AI text */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 20,
      }}>
        <div style={{
          fontFamily: bebas, fontSize: 100, color: GOLD, letterSpacing: 8,
          transform: `scale(${aiScale})`, opacity: aiOp,
          textShadow: `0 0 40px ${GOLD}66`,
          lineHeight: 1,
        }}>
          AI MATCH
        </div>
        <div style={{
          fontFamily: bebas, fontSize: 100, color: GOLD, letterSpacing: 8,
          transform: `scale(${aiScale})`, opacity: aiOp,
          textShadow: `0 0 40px ${GOLD}66`,
          lineHeight: 1,
        }}>
          ANALYZER
        </div>
        <div style={{
          fontFamily: inter, fontSize: 32, color: SCAN_COLOR, fontWeight: 600,
          opacity: csOp, transform: `scale(${csPulse})`,
          letterSpacing: 6, marginTop: 20,
        }}>
          COMING SOON
        </div>
      </div>
    </AbsoluteFill>
  );
};
