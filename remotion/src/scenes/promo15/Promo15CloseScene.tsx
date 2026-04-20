import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadFont("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

export const Promo15CloseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoS = spring({ frame, fps, config: { damping: 14, stiffness: 130 } });
  const logoScale = interpolate(logoS, [0, 1], [0.7, 1]);
  const logoO = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  // Tagline
  const tagS = spring({ frame: frame - 18, fps, config: { damping: 18 } });
  const tagO = interpolate(tagS, [0, 1], [0, 1]);
  const tagY = interpolate(tagS, [0, 1], [20, 0]);

  // Breathing
  const breathe = 1 + Math.sin(frame * 0.06) * 0.01;

  // Gold pulse ring
  const ringR = 220;
  const C = 2 * Math.PI * ringR;
  const ringP = spring({ frame: frame - 4, fps, config: { damping: 30, stiffness: 70 } });
  const pulseScale = frame > 30 ? 1 + Math.sin((frame - 30) * 0.18) * 0.04 : 1;

  // Orbiting particles
  const particles = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2 + frame * 0.012;
    const dist = 280 + Math.sin(frame * 0.04 + i) * 18;
    const x = 540 + Math.cos(angle) * dist;
    const y = 960 + Math.sin(angle) * dist;
    const o = 0.2 + Math.sin(frame * 0.06 + i) * 0.1;
    return { x, y, o };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12", justifyContent: "center", alignItems: "center" }}>
      {/* Radial gold glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 48%, rgba(232,180,0,0.15) 0%, transparent 50%)",
      }} />

      {/* Orbiting particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.x, top: p.y,
          width: 4, height: 4, borderRadius: "50%",
          backgroundColor: "#E8B400", opacity: p.o,
        }} />
      ))}

      {/* Pulsing gold ring */}
      <svg width={520} height={520} style={{
        position: "absolute", top: "50%", left: "50%",
        transform: `translate(-50%, -54%) scale(${pulseScale})`,
      }}>
        <circle
          cx={260} cy={260} r={ringR}
          fill="none" stroke="#E8B400" strokeWidth={2}
          strokeDasharray={C}
          strokeDashoffset={C * (1 - ringP)}
          opacity={0.4}
        />
      </svg>

      {/* CAMINO wordmark */}
      <div style={{
        opacity: logoO,
        transform: `scale(${logoScale * breathe})`,
        textAlign: "center",
        marginTop: -40,
      }}>
        <div style={{
          fontFamily: display, fontSize: 160, fontWeight: 800,
          color: "#E8B400", letterSpacing: "-0.05em",
          textShadow: "0 0 60px rgba(232,180,0,0.4)",
        }}>
          CAMINO
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        position: "absolute", top: "60%",
        width: "100%", textAlign: "center",
        opacity: tagO, transform: `translateY(${tagY}px)`,
      }}>
        <div style={{
          fontFamily: body, fontSize: 30, fontWeight: 500,
          color: "#8B92A3", letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}>
          The player development platform
        </div>
      </div>
    </AbsoluteFill>
  );
};
