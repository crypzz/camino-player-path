import { AbsoluteFill, Series, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { PhotoBG, Caption, Kicker, useRise, display, body, NAVY, GOLD, IVORY, MUTED, glow } from "./scenes/worldcup/_shared";

// ---------- Scene 1: The World Came ----------
const Scene1: React.FC = () => (
  <AbsoluteFill>
    <PhotoBG src="images/crowd.jpg" duration={120} zoomFrom={1.08} zoomTo={1.24} panY={-30} overlay={0.55} align="top" />
    <AbsoluteFill style={{ padding: "220px 90px" }}>
      <Kicker delay={6}>Summer 2026</Kicker>
    </AbsoluteFill>
    <Caption delay={20} size={92}>
      The world came to<br />North America.
    </Caption>
  </AbsoluteFill>
);

// ---------- Scene 2: A Generation Inspired ----------
const Scene2: React.FC = () => (
  <AbsoluteFill>
    <PhotoBG src="images/splash.jpg" duration={150} zoomFrom={1.05} zoomTo={1.2} panX={-24} overlay={0.55} grade="warm" />
    <Caption delay={14} size={82} highlight="A generation was lit.">
      Millions watched.
    </Caption>
  </AbsoluteFill>
);

// ---------- Scene 3: The Gap ----------
const Scene3: React.FC = () => (
  <AbsoluteFill>
    <PhotoBG src="images/coach.jpg" duration={180} zoomFrom={1.06} zoomTo={1.22} panY={20} overlay={0.62} />
    <Caption delay={12} size={78} highlight="without a path.">
      But inspiration fades
    </Caption>
  </AbsoluteFill>
);

// ---------- Stat overlay card ----------
const StatChip: React.FC<{ label: string; value: string; delay: number }> = ({ label, value, delay }) => {
  const { opacity, transform } = useRise(delay, 30);
  return (
    <div style={{ opacity, transform, padding: "22px 26px", borderRadius: 20, background: "rgba(10,12,18,0.66)", border: "1px solid rgba(232,180,0,0.28)", minWidth: 210 }}>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 54, color: GOLD }}>{value}</div>
      <div style={{ fontFamily: body, fontWeight: 600, fontSize: 22, color: MUTED, marginTop: 4, letterSpacing: 1 }}>{label}</div>
    </div>
  );
};

// ---------- Scene 4: Camino turns spark into system ----------
const Scene4: React.FC = () => {
  const { opacity, transform } = useRise(10, 40);
  return (
    <AbsoluteFill>
      <PhotoBG src="images/strike.jpg" duration={180} zoomFrom={1.07} zoomTo={1.22} panX={22} overlay={0.6} />
      <AbsoluteFill style={{ justifyContent: "flex-start", padding: "230px 90px 0" }}>
        <div style={{ opacity, transform, color: IVORY, fontFamily: display, fontWeight: 800, fontSize: 76, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 860 }}>
          Camino turns that spark<br />into a <span style={{ color: GOLD, textShadow: glow(GOLD, 20) }}>system.</span>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: "0 0 300px" }}>
        <div style={{ display: "flex", gap: 22 }}>
          <StatChip label="CPI Score" value="82" delay={40} />
          <StatChip label="Sessions" value="1.4k" delay={52} />
          <StatChip label="Scouts" value="+37%" delay={64} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Scene 5: Track. Develop. Get seen. ----------
const Word: React.FC<{ children: React.ReactNode; delay: number }> = ({ children, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 120 } });
  return (
    <div style={{ opacity: s, transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px)`, fontFamily: display, fontWeight: 800, fontSize: 104, color: IVORY, letterSpacing: -2, lineHeight: 1.02 }}>
      {children}
    </div>
  );
};
const Scene5: React.FC = () => (
  <AbsoluteFill>
    <PhotoBG src="images/action.jpg" duration={150} zoomFrom={1.06} zoomTo={1.2} panY={-20} overlay={0.68} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "flex-start", padding: "0 90px" }}>
      <Word delay={6}>Track.</Word>
      <Word delay={20}>Develop.</Word>
      <div style={{ marginTop: 6 }}><Word delay={34}><span style={{ color: GOLD, textShadow: glow(GOLD, 24) }}>Get seen.</span></Word></div>
    </AbsoluteFill>
  </AbsoluteFill>
);

// ---------- Scene 6: Logo close ----------
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoS = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 90 } });
  const line = interpolate(frame, [30, 55], [0, 620], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tag = interpolate(frame, [42, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const beach = interpolate(frame, [0, 30], [0.35, 0.16], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, justifyContent: "center", alignItems: "center" }}>
      <Img src={staticFile("images/beach.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: beach, filter: "saturate(0.6) brightness(0.7)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(10,12,18,0.4) 0%, rgba(10,12,18,0.94) 75%)" }} />
      <div style={{ zIndex: 2, textAlign: "center", transform: `scale(${interpolate(logoS, [0, 1], [0.7, 1])})`, opacity: logoS }}>
        <Img src={staticFile("images/logo.png")} style={{ width: 460, filter: `drop-shadow(0 0 40px rgba(232,180,0,0.4))` }} />
      </div>
      <div style={{ zIndex: 2, height: 2, width: line, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, marginTop: 10 }} />
      <div style={{ zIndex: 2, opacity: tag, marginTop: 26, fontFamily: body, fontWeight: 600, fontSize: 34, letterSpacing: 3, color: IVORY, textAlign: "center" }}>
        The next World Cup starts <span style={{ color: GOLD }}>here.</span>
      </div>
      <div style={{ zIndex: 2, opacity: tag, marginTop: 16, fontFamily: body, fontWeight: 600, fontSize: 26, letterSpacing: 2, color: MUTED }}>
        caminodevelopment.com
      </div>
    </AbsoluteFill>
  );
};

// 30s @ 30fps = 900 frames
export const WorldCupLegacyReel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NAVY }}>
    <Series>
      <Series.Sequence durationInFrames={120}><Scene1 /></Series.Sequence>
      <Series.Sequence durationInFrames={120}><Scene2 /></Series.Sequence>
      <Series.Sequence durationInFrames={150}><Scene3 /></Series.Sequence>
      <Series.Sequence durationInFrames={180}><Scene4 /></Series.Sequence>
      <Series.Sequence durationInFrames={150}><Scene5 /></Series.Sequence>
      <Series.Sequence durationInFrames={180}><Scene6 /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
