import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: bebas } = loadFont();
const { fontFamily: inter } = loadInter();

const BG = "#0A0E1A";
const GOLD = "#E8B400";

export const VACloseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({ frame, fps, config: { damping: 10, stiffness: 160 } });
  const logoScale = interpolate(logoSpring, [0, 1], [0.4, 1]);
  const logoOp = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  const tagOp = interpolate(frame, [25, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagY = interpolate(spring({ frame: frame - 25, fps, config: { damping: 16 } }), [0, 1], [20, 0]);

  const breathe = 1 + Math.sin(frame * 0.06) * 0.02;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Gold glow behind logo */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, ${GOLD}15 0%, transparent 70%)`,
      }} />

      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 24,
        transform: `scale(${breathe})`,
      }}>
        <div style={{
          fontFamily: bebas, fontSize: 140, color: "white", letterSpacing: 12,
          transform: `scale(${logoScale})`, opacity: logoOp,
          textShadow: `0 0 60px ${GOLD}44`,
          lineHeight: 1,
        }}>
          CAMINO
        </div>
        <div style={{
          fontFamily: inter, fontSize: 24, color: "#9CA3AF", fontWeight: 400,
          opacity: tagOp, transform: `translateY(${tagY}px)`,
          letterSpacing: 2, textAlign: "center", maxWidth: 600,
        }}>
          Your complete player development platform.
        </div>
      </div>
    </AbsoluteFill>
  );
};
