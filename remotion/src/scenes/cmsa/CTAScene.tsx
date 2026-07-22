import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { display, body, NAVY, GOLD, IVORY, MUTED } from "./_shared";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l1 = spring({ frame, fps, config: { damping: 18, stiffness: 140 } });
  const l2 = spring({ frame: frame - 18, fps, config: { damping: 16, stiffness: 130 } });
  const wm = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" });
  const handle = interpolate(frame, [70, 90], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      backgroundColor: NAVY, alignItems: "center", justifyContent: "center", padding: 80,
    }}>
      {/* radial vignette */}
      <AbsoluteFill style={{
        background: "radial-gradient(circle at center, rgba(232,180,0,0.08) 0%, transparent 60%)",
      }} />

      <div style={{
        fontFamily: display, fontWeight: 800, color: IVORY,
        fontSize: 130, lineHeight: 1, textAlign: "center",
        opacity: l1, transform: `translateY(${(1 - l1) * 30}px)`,
      }}>
        Log your match.
      </div>
      <div style={{
        marginTop: 20, fontFamily: display, fontWeight: 800, color: GOLD,
        fontSize: 130, lineHeight: 1, textAlign: "center", fontStyle: "italic",
        opacity: l2, transform: `translateY(${(1 - l2) * 30}px)`,
      }}>
        Get on the<br/>leaderboard.
      </div>

      <div style={{
        marginTop: 80, fontFamily: display, fontWeight: 800, color: IVORY,
        fontSize: 56, letterSpacing: 8,
        opacity: wm,
      }}>
        CAMINO
      </div>
      <div style={{
        marginTop: 20, fontFamily: body, color: MUTED, fontSize: 26, letterSpacing: 2,
        opacity: handle,
      }}>
        caminodevelopment.com · @caminodevelopment
      </div>
    </AbsoluteFill>
  );
};
