import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/BebasNeue";

const { fontFamily: bebas } = loadFont();

const BG = "#0A0E1A";
const GOLD = "#E8B400";
const BLUE = "#2B7FE8";
const GREEN = "#1DB870";
const RED = "#EF4444";

const EVENTS = [
  { x: 25, y: 35, color: BLUE },
  { x: 60, y: 20, color: GREEN },
  { x: 72, y: 55, color: GOLD },
  { x: 40, y: 70, color: RED },
  { x: 55, y: 40, color: BLUE },
  { x: 80, y: 30, color: GREEN },
  { x: 30, y: 60, color: GOLD },
  { x: 65, y: 75, color: BLUE },
  { x: 45, y: 25, color: GREEN },
  { x: 20, y: 50, color: RED },
  { x: 75, y: 65, color: GOLD },
  { x: 50, y: 45, color: BLUE },
];

export const VAPitchMapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pitchSpring = spring({ frame, fps, config: { damping: 18, stiffness: 100 } });
  const pitchScale = interpolate(pitchSpring, [0, 1], [0.8, 1]);
  const pitchOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  const titleOp = interpolate(frame, [90, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(spring({ frame: frame - 90, fps, config: { damping: 16 } }), [0, 1], [30, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
        <svg
          viewBox="0 0 340 500"
          style={{ width: 700, opacity: pitchOp, transform: `scale(${pitchScale})` }}
        >
          <defs>
            <filter id="va-glow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Pitch bg */}
          <rect x="0" y="0" width="340" height="500" rx="8" fill="#0F2A1A" />
          <rect x="10" y="10" width="320" height="480" rx="4" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          <line x1="10" y1="250" x2="330" y2="250" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <circle cx="170" cy="250" r="50" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <circle cx="170" cy="250" r="3" fill="rgba(255,255,255,0.4)" />
          {/* Penalty areas */}
          <rect x="70" y="10" width="200" height="100" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <rect x="110" y="10" width="120" height="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <rect x="70" y="390" width="200" height="100" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <rect x="110" y="450" width="120" height="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          {/* Event dots */}
          {EVENTS.map((ev, i) => {
            const delay = 10 + i * 6;
            const s = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 180 } });
            const scale = interpolate(s, [0, 1], [0, 1]);
            const pulse = Math.sin((frame - delay) * 0.15) * 0.15 + 1;
            const cx = 10 + (ev.x / 100) * 320;
            const cy = 10 + (ev.y / 100) * 480;
            return (
              <g key={i} transform={`translate(${cx}, ${cy}) scale(${scale})`}>
                <circle r={12 * pulse} fill={ev.color} opacity={0.2} filter="url(#va-glow)" />
                <circle r="5" fill={ev.color} opacity={0.9} />
              </g>
            );
          })}
        </svg>

        <div style={{
          fontFamily: bebas, fontSize: 64, color: GOLD, letterSpacing: 4,
          opacity: titleOp, transform: `translateY(${titleY}px)`,
        }}>
          SEE WHERE IT HAPPENS.
        </div>
      </div>
    </AbsoluteFill>
  );
};
