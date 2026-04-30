import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["600", "700"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const WHITE = "#F4F4F2";
const STEEL = "#1C2230";

export const FCHardwareRevealScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const reveal = spring({ frame, fps, config: { damping: 22, stiffness: 60 } });
  const rot = interpolate(reveal, [0, 1], [-35, 0]);
  const opacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(reveal, [0, 1], [0.7, 1]);

  const labelOp = interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelY = interpolate(spring({ frame: frame - 40, fps, config: { damping: 18 } }), [0, 1], [30, 0]);

  const subOp = interpolate(frame, [70, 88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // pulse on lens
  const lensPulse = 0.6 + Math.sin(frame * 0.2) * 0.4;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* radial spotlight */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 50% 55%, ${GOLD}22 0%, ${BG} 60%)`,
      }} />

      <div style={{
        position: "absolute", inset: 0, display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 60,
      }}>
        {/* Camera silhouette */}
        <div style={{
          opacity, transform: `scale(${scale}) rotateY(${rot}deg)`,
          transformStyle: "preserve-3d", perspective: 800,
        }}>
          <svg width="540" height="640" viewBox="0 0 540 640">
            <defs>
              <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2A3242" />
                <stop offset="100%" stopColor={STEEL} />
              </linearGradient>
              <radialGradient id="lensGlow" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor={GOLD} stopOpacity={lensPulse} />
                <stop offset="60%" stopColor={GOLD} stopOpacity={lensPulse * 0.4} />
                <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
              </radialGradient>
            </defs>

            {/* Tripod legs */}
            <polygon points="270,360 180,620 200,620 270,380" fill={STEEL} />
            <polygon points="270,360 360,620 340,620 270,380" fill="#161B26" />
            <polygon points="270,360 264,620 276,620" fill={STEEL} />

            {/* Tripod head */}
            <rect x="240" y="330" width="60" height="40" rx="6" fill="#2A3242" />

            {/* Camera body */}
            <rect x="150" y="190" width="320" height="160" rx="22" fill="url(#bodyGrad)" stroke={GOLD} strokeWidth="2" />
            {/* Top handle */}
            <rect x="240" y="160" width="80" height="34" rx="6" fill="#161B26" />
            {/* Mount cap */}
            <rect x="270" y="350" width="20" height="18" fill="#2A3242" />

            {/* Lens barrel */}
            <circle cx="310" cy="270" r="78" fill="#0F141E" stroke={GOLD} strokeWidth="3" />
            <circle cx="310" cy="270" r="56" fill="#05090F" />
            <circle cx="310" cy="270" r="56" fill="url(#lensGlow)" />
            <circle cx="310" cy="270" r="22" fill="#000" />
            <circle cx="298" cy="258" r="6" fill={WHITE} opacity={0.4} />

            {/* Brand chip */}
            <rect x="170" y="210" width="60" height="14" rx="3" fill={GOLD} />
            <text x="200" y="221" fontFamily={bodyFont} fontSize="10" fontWeight="700" fill={BG} textAnchor="middle">CAMINO</text>

            {/* Indicator LEDs */}
            <circle cx="430" cy="220" r="4" fill="#1DB870">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="430" cy="234" r="4" fill={GOLD} opacity={0.6} />
          </svg>
        </div>

        <div style={{ textAlign: "center", opacity: labelOp, transform: `translateY(${labelY}px)` }}>
          <div style={{
            fontFamily: bodyFont, fontSize: 22, color: GOLD, letterSpacing: "0.4em", marginBottom: 18,
          }}>
            COMING SOON
          </div>
          <div style={{
            fontFamily, fontWeight: 800, fontSize: 96, color: WHITE,
            letterSpacing: "-0.035em", lineHeight: 0.95,
          }}>
            CAMINO<br /><span style={{ color: GOLD }}>FOLLOWCAM</span>
          </div>
          <div style={{
            marginTop: 22, fontFamily: bodyFont, fontSize: 30, color: "#9AA3B2",
            opacity: subOp, fontWeight: 600,
          }}>
            The autonomous sideline.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
