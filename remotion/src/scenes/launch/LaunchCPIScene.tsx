import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const TARGET = 76;

export const LaunchCPIScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dial fills
  const fillProgress = interpolate(frame, [10, 70], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const value = Math.round(fillProgress * TARGET);

  // SVG arc params
  const radius = 220;
  const cx = 270;
  const cy = 270;
  const circumference = 2 * Math.PI * radius;
  // 270deg arc starting at -135deg
  const arcLength = circumference * 0.75;
  const dashOffset = arcLength * (1 - fillProgress);

  // Caption
  const captionS = spring({ frame: frame - 40, fps, config: { damping: 22 } });
  const captionOp = interpolate(captionS, [0, 1], [0, 1]);
  const captionX = interpolate(captionS, [0, 1], [30, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        {/* Dial */}
        <div style={{ position: "relative", width: 540, height: 540 }}>
          <svg width="540" height="540" style={{ transform: "rotate(135deg)" }}>
            <circle
              cx={cx} cy={cy} r={radius}
              fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={28}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeLinecap="round"
            />
            <circle
              cx={cx} cy={cy} r={radius}
              fill="none" stroke={GOLD} strokeWidth={28}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 20px ${GOLD}66)` }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              fontFamily, fontWeight: 800, fontSize: 200, color: "#FFFFFF",
              lineHeight: 1, letterSpacing: "-0.04em",
            }}>
              {value}
            </div>
            <div style={{
              fontFamily: bodyFont, fontWeight: 600, fontSize: 28,
              color: GOLD, letterSpacing: "0.18em", marginTop: 8,
            }}>
              CPI
            </div>
          </div>
        </div>

        {/* Caption */}
        <div style={{
          opacity: captionOp, transform: `translateX(${captionX}px)`,
          textAlign: "center", marginTop: 20,
        }}>
          <div style={{
            fontFamily, fontWeight: 800, fontSize: 56, color: "#FFFFFF",
            letterSpacing: "-0.03em", lineHeight: 1.1,
          }}>
            One score. <span style={{ color: GOLD }}>23 attributes.</span>
          </div>
          <div style={{
            fontFamily: bodyFont, fontWeight: 500, fontSize: 30,
            color: "rgba(255,255,255,0.55)", marginTop: 14,
          }}>
            Verified by coaches.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
