import { AbsoluteFill, Series, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInstrument } from "@remotion/google-fonts/InstrumentSerif";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: serif } = loadInstrument("normal", { weights: ["400"], subsets: ["latin"] });

const NAVY = "#06070B";
const GOLD = "#E8B400";
const IVORY = "#F5F1E6";
const MUTED = "rgba(245,241,230,0.55)";

// Persistent cinematic background: deep gradient, drifting glow, subtle pitch lines, particles
const Backdrop: React.FC<{ accent?: string }> = ({ accent = GOLD }) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
  const glowX = 50 + Math.sin(drift * Math.PI * 2) * 8;
  const glowY = 45 + Math.cos(drift * Math.PI * 1.4) * 6;

  // Soft soccer-pitch arc lines (subtle, abstract)
  const arc = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: "clamp" });

  // Particles
  const particles = Array.from({ length: 26 }, (_, i) => {
    const seedX = (i * 97) % 100;
    const speed = 0.15 + ((i * 13) % 7) * 0.04;
    const yProgress = ((frame * speed + i * 70) % (height + 200)) - 100;
    const size = 1 + (i % 4);
    const o = interpolate(yProgress, [-100, 100, height - 200, height], [0, 0.6, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { x: (seedX / 100) * width, y: yProgress, size, o };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, overflow: "hidden" }}>
      {/* deep radial chrome gradient */}
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at ${glowX}% ${glowY}%, rgba(232,180,0,0.18) 0%, rgba(232,180,0,0.05) 30%, rgba(6,7,11,0) 60%), radial-gradient(ellipse at 50% 120%, rgba(60,70,90,0.35) 0%, rgba(6,7,11,0) 55%), linear-gradient(180deg, #06070B 0%, #0A0C12 50%, #06070B 100%)`,
      }} />

      {/* subtle abstract pitch arc */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0" />
            <stop offset="50%" stopColor={accent} stopOpacity="0.9" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx={width / 2} cy={height / 2} r={width * 0.55}
          fill="none" stroke="url(#lineGrad)" strokeWidth={1.2}
          strokeDasharray={Math.PI * 2 * width * 0.55}
          strokeDashoffset={(1 - arc) * Math.PI * 2 * width * 0.55} />
        <circle cx={width / 2} cy={height / 2} r={width * 0.78}
          fill="none" stroke="url(#lineGrad)" strokeWidth={0.8}
          strokeDasharray={Math.PI * 2 * width * 0.78}
          strokeDashoffset={(1 - arc) * Math.PI * 2 * width * 0.78} opacity={0.5} />
        <line x1={0} y1={height / 2} x2={width} y2={height / 2}
          stroke={accent} strokeOpacity={0.08} strokeWidth={1} />
      </svg>

      {/* particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.x, top: p.y,
          width: p.size, height: p.size, borderRadius: "50%",
          backgroundColor: accent, opacity: p.o * 0.7,
          filter: "blur(0.5px)",
        }} />
      ))}

      {/* chrome edge vignette */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.7) 100%)",
        pointerEvents: "none",
      }} />

      {/* film grain */}
      <AbsoluteFill style={{
        opacity: 0.06, mixBlendMode: "overlay",
        background: "repeating-radial-gradient(circle, rgba(255,255,255,0.04) 0px, transparent 1px, transparent 2px)",
      }} />
    </AbsoluteFill>
  );
};

// SCENE 1: "Most athletes never see what's next."
const OpeningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = ["Most athletes", "never see", "what's next."];

  const fadeOut = interpolate(frame, [70, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-start", padding: "0 80px", opacity: fadeOut }}>
      <div style={{ width: "100%" }}>
        {lines.map((line, i) => {
          const delay = 6 + i * 14;
          const s = spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 140, mass: 0.9 } });
          const y = interpolate(s, [0, 1], [60, 0]);
          const o = interpolate(s, [0, 1], [0, 1]);
          const blur = interpolate(s, [0, 1], [10, 0]);
          const isLast = i === lines.length - 1;
          return (
            <div key={i} style={{
              fontFamily: display, fontWeight: 800,
              fontSize: 110, lineHeight: 1.02, letterSpacing: "-0.045em",
              color: isLast ? GOLD : IVORY,
              fontStyle: isLast ? "normal" : "normal",
              transform: `translateY(${y}px)`,
              opacity: o, filter: `blur(${blur}px)`,
              marginBottom: 6,
            }}>
              {isLast ? <em style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em" }}>{line}</em> : line}
            </div>
          );
        })}
        {/* gold accent line */}
        <div style={{
          height: 2, backgroundColor: GOLD, marginTop: 32,
          width: interpolate(frame, [50, 80], [0, 320], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          opacity: 0.7,
        }} />
      </div>
    </AbsoluteFill>
  );
};

// SCENE 2: CAMINO + tagline
const BrandScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Letter-by-letter reveal
  const letters = "CAMINO".split("");
  const fadeOut = interpolate(frame, [75, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Sweep highlight across letters
  const sweep = interpolate(frame, [20, 60], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const taglineSpring = spring({ frame: frame - 50, fps, config: { damping: 24, stiffness: 160 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fadeOut }}>
      {/* chrome arc */}
      <svg width={width} height={width} style={{ position: "absolute", top: "50%", transform: "translateY(-50%)" }}>
        <defs>
          <linearGradient id="ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.7" />
            <stop offset="50%" stopColor={IVORY} stopOpacity="0.25" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <circle cx={width / 2} cy={width / 2} r={width * 0.42}
          fill="none" stroke="url(#ring)" strokeWidth={1.5}
          strokeDasharray={Math.PI * 2 * width * 0.42}
          strokeDashoffset={interpolate(frame, [0, 60], [Math.PI * 2 * width * 0.42, 0], { extrapolateRight: "clamp" })}
          transform={`rotate(-90 ${width / 2} ${width / 2})`} />
      </svg>

      <div style={{ position: "relative", display: "flex", overflow: "hidden", padding: "20px 0" }}>
        {letters.map((ch, i) => {
          const delay = 5 + i * 5;
          const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 180 } });
          const y = interpolate(s, [0, 1], [80, 0]);
          const o = interpolate(s, [0, 1], [0, 1]);
          const scale = interpolate(s, [0, 1], [1.15, 1]);
          // chrome sweep highlight per letter
          const letterPos = (i / letters.length) * 100;
          const sweepIntensity = Math.max(0, 1 - Math.abs(sweep - letterPos) / 18);
          return (
            <span key={i} style={{
              fontFamily: display, fontWeight: 800,
              fontSize: 168, letterSpacing: "-0.06em",
              color: IVORY,
              transform: `translateY(${y}px) scale(${scale})`,
              opacity: o,
              display: "inline-block",
              textShadow: sweepIntensity > 0 ? `0 0 ${20 * sweepIntensity}px rgba(232,180,0,${0.8 * sweepIntensity})` : "none",
              background: sweepIntensity > 0 ? `linear-gradient(180deg, ${IVORY}, ${GOLD})` : "none",
              WebkitBackgroundClip: sweepIntensity > 0 ? "text" : "initial",
              WebkitTextFillColor: sweepIntensity > 0 ? "transparent" : IVORY,
            }}>{ch}</span>
          );
        })}
      </div>

      {/* gold underline */}
      <div style={{
        height: 2, backgroundColor: GOLD, marginTop: 18,
        width: interpolate(frame, [35, 65], [0, 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        boxShadow: `0 0 12px ${GOLD}`,
      }} />

      <div style={{
        marginTop: 36,
        fontFamily: serif, fontStyle: "italic", fontWeight: 400,
        fontSize: 42, letterSpacing: "-0.01em",
        color: MUTED,
        textAlign: "center",
        opacity: interpolate(taglineSpring, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(taglineSpring, [0, 1], [20, 0])}px)`,
      }}>
        Building pathways <span style={{ color: GOLD }}>beyond the game.</span>
      </div>
    </AbsoluteFill>
  );
};

// SCENE 3: CTA + logo glow
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kickerS = spring({ frame: frame - 5, fps, config: { damping: 22, stiffness: 160 } });
  const ctaS = spring({ frame: frame - 15, fps, config: { damping: 20, stiffness: 140 } });
  const subS = spring({ frame: frame - 40, fps, config: { damping: 22, stiffness: 160 } });
  const logoS = spring({ frame: frame - 55, fps, config: { damping: 14, stiffness: 130 } });

  // Pulsing glow on logo
  const pulse = 0.7 + Math.sin(frame * 0.12) * 0.3;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
      {/* kicker chip */}
      <div style={{
        opacity: interpolate(kickerS, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(kickerS, [0, 1], [20, 0])}px)`,
        padding: "10px 22px", borderRadius: 999,
        border: `1px solid ${GOLD}`, backgroundColor: "rgba(232,180,0,0.10)",
        marginBottom: 36,
      }}>
        <span style={{
          fontFamily: display, fontWeight: 700, fontSize: 22,
          color: GOLD, letterSpacing: 4, textTransform: "uppercase",
        }}>Teaser · 2026</span>
      </div>

      {/* CTA headline */}
      <div style={{
        fontFamily: display, fontWeight: 800,
        fontSize: 104, lineHeight: 1.0, letterSpacing: "-0.05em",
        color: IVORY, textAlign: "center",
        opacity: interpolate(ctaS, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(ctaS, [0, 1], [40, 0])}px)`,
        filter: `blur(${interpolate(ctaS, [0, 1], [8, 0])}px)`,
      }}>
        FULL SITE<br />
        <span style={{
          background: `linear-gradient(180deg, ${IVORY} 0%, ${GOLD} 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>DROPPING SOON</span>
      </div>

      {/* divider */}
      <div style={{
        height: 1, backgroundColor: "rgba(232,180,0,0.4)", marginTop: 40,
        width: interpolate(frame, [30, 60], [0, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }} />

      {/* sub */}
      <div style={{
        marginTop: 28,
        fontFamily: serif, fontStyle: "italic", fontWeight: 400,
        fontSize: 36, color: MUTED, textAlign: "center",
        opacity: interpolate(subS, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(subS, [0, 1], [16, 0])}px)`,
      }}>
        Early access opening shortly.
      </div>

      {/* Camino logo mark — minimalist C with gold arc */}
      <div style={{
        marginTop: 70,
        opacity: interpolate(logoS, [0, 1], [0, 1]),
        transform: `scale(${interpolate(logoS, [0, 1], [0.6, 1])})`,
        position: "relative",
      }}>
        <div style={{
          width: 140, height: 140,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(232,180,0,${0.35 * pulse}) 0%, rgba(232,180,0,0) 70%)`,
          position: "absolute", top: -10, left: -10,
          filter: "blur(20px)",
        }} />
        <svg width={120} height={120} viewBox="0 0 120 120" style={{ position: "relative" }}>
          <defs>
            <linearGradient id="logoG" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor={GOLD} />
              <stop offset="100%" stopColor="#FFD24A" />
            </linearGradient>
          </defs>
          <circle cx={60} cy={60} r={52} fill="none" stroke="rgba(245,241,230,0.15)" strokeWidth={2} />
          <path d="M 90 30 A 42 42 0 1 0 90 90" fill="none" stroke="url(#logoG)" strokeWidth={5} strokeLinecap="round" />
          <text x={60} y={76} textAnchor="middle" fontFamily={display} fontWeight={800} fontSize={48} fill={IVORY} letterSpacing="-0.04em">C</text>
        </svg>
      </div>
      <div style={{
        marginTop: 14,
        fontFamily: display, fontWeight: 700, fontSize: 24,
        color: IVORY, letterSpacing: 8, textTransform: "uppercase",
        opacity: interpolate(logoS, [0, 1], [0, 1]),
      }}>CAMINO</div>
    </AbsoluteFill>
  );
};

export const CaminoTeaser10: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <Backdrop />
      <Series>
        <Series.Sequence durationInFrames={90}>
          <OpeningScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <BrandScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={120}>
          <CTAScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
