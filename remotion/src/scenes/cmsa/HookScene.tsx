import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { display, body, NAVY, GOLD, IVORY, MUTED, GoldChip } from "./_shared";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chip = spring({ frame, fps, config: { damping: 18, stiffness: 140 } });
  const h1 = spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 140 } });
  const h2 = spring({ frame: frame - 24, fps, config: { damping: 18, stiffness: 140 } });
  const sub = interpolate(frame, [45, 60], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, alignItems: "center", justifyContent: "center", padding: 80 }}>
      <div style={{ opacity: chip, transform: `translateY(${(1 - chip) * 20}px)` }}>
        <GoldChip>CMSA · Calgary</GoldChip>
      </div>
      <div style={{
        marginTop: 40, fontFamily: display, fontWeight: 800, color: IVORY,
        fontSize: 140, lineHeight: 0.95, textAlign: "center",
        opacity: h1, transform: `translateY(${(1 - h1) * 30}px)`,
      }}>
        Every<br/>CMSA game.
      </div>
      <div style={{
        marginTop: 12, fontFamily: display, fontWeight: 800, color: GOLD,
        fontSize: 140, lineHeight: 0.95, textAlign: "center", fontStyle: "italic",
        opacity: h2, transform: `translateY(${(1 - h2) * 30}px)`,
      }}>
        One place.
      </div>
      <div style={{
        marginTop: 44, fontFamily: body, color: MUTED, fontSize: 32, letterSpacing: 1,
        opacity: sub,
      }}>
        Standings · Scorers · Form
      </div>
    </AbsoluteFill>
  );
};
