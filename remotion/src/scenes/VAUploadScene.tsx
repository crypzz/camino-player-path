import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: bebas } = loadFont();
const { fontFamily: inter } = loadInter();

const BG = "#0A0E1A";
const GOLD = "#E8B400";
const BLUE = "#2B7FE8";
const CARD_BG = "#111827";

export const VAUploadScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({ frame, fps, config: { damping: 16, stiffness: 140 } });
  const cardOp = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  // Progress bar
  const progressStart = 25;
  const progress = interpolate(frame, [progressStart, progressStart + 50], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // File card
  const fileCardSpring = spring({ frame: frame - 60, fps, config: { damping: 14, stiffness: 160 } });
  const fileCardY = interpolate(fileCardSpring, [0, 1], [40, 0]);
  const fileCardOp = interpolate(frame, [60, 68], [0, 1], { extrapolateRight: "clamp" });

  // Title
  const titleOp = interpolate(frame, [80, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(
    spring({ frame: frame - 80, fps, config: { damping: 18 } }),
    [0, 1], [30, 0]
  );

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60 }}>
        {/* Upload zone mock */}
        <div style={{
          width: 700, borderRadius: 24, border: `2px dashed ${BLUE}55`,
          backgroundColor: `${CARD_BG}`, padding: 60,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
          transform: `scale(${interpolate(cardScale, [0, 1], [0.85, 1])})`,
          opacity: cardOp,
        }}>
          {/* Upload icon */}
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          <div style={{ fontFamily: inter, fontSize: 22, color: "#9CA3AF" }}>
            Drag & drop a video file
          </div>

          {/* Progress bar */}
          <div style={{ width: "100%", height: 12, backgroundColor: "#1F2937", borderRadius: 6, overflow: "hidden", marginTop: 10 }}>
            <div style={{
              width: `${progress}%`, height: "100%",
              backgroundColor: progress >= 100 ? "#1DB870" : BLUE,
              borderRadius: 6, transition: "none",
            }} />
          </div>
          {progress > 0 && (
            <div style={{ fontFamily: inter, fontSize: 18, color: progress >= 100 ? "#1DB870" : BLUE }}>
              {Math.round(progress)}%
            </div>
          )}
        </div>

        {/* File card */}
        <div style={{
          width: 700, borderRadius: 16, backgroundColor: CARD_BG, padding: 28,
          marginTop: 24, display: "flex", alignItems: "center", gap: 20,
          opacity: fileCardOp, transform: `translateY(${fileCardY}px)`,
          border: `1px solid #1F2937`,
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill={GOLD} stroke="none">
            <rect x="2" y="4" width="20" height="16" rx="3" opacity="0.2" />
            <polygon points="10,9 16,12 10,15" fill={GOLD} />
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: inter, fontSize: 20, color: "white", fontWeight: 600 }}>U14 Liga — Jornada 12</div>
            <div style={{ fontFamily: inter, fontSize: 16, color: "#6B7280", marginTop: 4 }}>FC Camino vs CD Rival • 24 Mar 2026 • 48.2 MB</div>
          </div>
        </div>

        {/* Title */}
        <div style={{
          fontFamily: bebas, fontSize: 64, color: GOLD, letterSpacing: 4,
          marginTop: 50, opacity: titleOp, transform: `translateY(${titleY}px)`,
        }}>
          UPLOAD. ORGANIZE. ANALYZE.
        </div>
      </div>
    </AbsoluteFill>
  );
};
