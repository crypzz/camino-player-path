import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/BebasNeue";

const { fontFamily: bebas } = loadFont();

const BG = "#0A0E1A";
const GOLD = "#E8B400";

export const VAHookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1Y = interpolate(
    spring({ frame, fps, config: { damping: 14, stiffness: 180 } }),
    [0, 1], [80, 0]
  );
  const line1Op = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  const line2Spring = spring({ frame: frame - 18, fps, config: { damping: 16, stiffness: 160 } });
  const line2Y = interpolate(line2Spring, [0, 1], [60, 0]);
  const line2Op = interpolate(frame, [18, 26], [0, 1], { extrapolateRight: "clamp" });

  const underlineW = interpolate(
    spring({ frame: frame - 30, fps, config: { damping: 20, stiffness: 120 } }),
    [0, 1], [0, 100]
  );

  // Subtle background pulse
  const bgPulse = interpolate(frame, [0, 90], [0, Math.PI * 2]);
  const bgBrightness = 1 + Math.sin(bgPulse) * 0.03;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, filter: `brightness(${bgBrightness})` }}>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 10,
      }}>
        <div style={{
          fontFamily: bebas, fontSize: 140, color: "white", letterSpacing: 6,
          transform: `translateY(${line1Y}px)`, opacity: line1Op,
          lineHeight: 1,
        }}>
          GAME FILM.
        </div>
        <div style={{
          fontFamily: bebas, fontSize: 80, color: GOLD, letterSpacing: 4,
          transform: `translateY(${line2Y}px)`, opacity: line2Op,
          lineHeight: 1,
        }}>
          FINALLY DONE RIGHT.
        </div>
        <div style={{
          width: `${underlineW}%`, maxWidth: 500, height: 4,
          backgroundColor: GOLD, borderRadius: 2, marginTop: 8,
        }} />
      </div>
    </AbsoluteFill>
  );
};
