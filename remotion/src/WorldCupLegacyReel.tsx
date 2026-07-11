import { AbsoluteFill, Series, Sequence, staticFile, OffthreadVideo, useCurrentFrame, useVideoConfig, interpolate, spring, Img } from "remotion";
import { PhotoBG, Caption, CountUp, FilmGrain, useFade, useRise, display, body, BG, YELLOW, WHITE, MUTED, glow } from "./scenes/worldcup/_shared";

/* ============================================================
   SWAP ZONE — change photos / drop in screen recordings here
   ------------------------------------------------------------
   Photos live in remotion/public/images/. Replace the file or
   point to a new filename to swap any shot.
   ============================================================ */
const IMAGES = {
  crowd: "images/crowd.jpg",        // Unsplash: soccer fans celebration crowd
  kidSunset: "images/silhouette.jpg", // Unsplash: child soccer sunset
  grassroots: "images/coach.jpg",   // Unsplash: youth soccer training grassroots
  grassroots2: "images/match.jpg",  // Unsplash: youth soccer training grassroots
  logoBed: "images/beach.jpg",
  logo: "images/logo.png",
};

// Scene 5 screen-recording slots. Set `src` to a file in
// remotion/public/video/ (e.g. "video/dashboard.mp4") to replace
// the labeled placeholder with real footage later.
const VIDEO_SLOTS: { label: string; src?: string }[] = [
  { label: "DASHBOARD", src: undefined },
  { label: "PLAYER PROFILES", src: undefined },
  { label: "AUTO-RANKING", src: undefined },
];

/* ---------- Scene 1: best World Cup ever → and now it's over ---------- */
const Scene1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <Sequence durationInFrames={62}>
      <AbsoluteFill style={{ opacity: useFade(62) }}>
        <PhotoBG src={IMAGES.crowd} duration={62} zoomFrom={1.08} zoomTo={1.2} panY={-22} overlay={0.5} align="top" />
        <Caption delay={6} size={82} highlight="best World Cup ever.">
          Canada just had its
        </Caption>
      </AbsoluteFill>
    </Sequence>
    <Sequence from={62} durationInFrames={58}>
      <AbsoluteFill style={{ opacity: useFade(58) }}>
        <PhotoBG src={IMAGES.crowd} duration={58} zoomFrom={1.2} zoomTo={1.3} panY={10} overlay={0.82} align="top" />
        <CenterTitle delay={4} size={104}>And now it&apos;s over.</CenterTitle>
      </AbsoluteFill>
    </Sequence>
  </AbsoluteFill>
);

/* ---------- Scene 2: the world moves on ---------- */
const Scene2: React.FC = () => (
  <AbsoluteFill style={{ opacity: useFade(120) }}>
    <PhotoBG src={IMAGES.kidSunset} duration={120} zoomFrom={1.05} zoomTo={1.2} panX={-22} overlay={0.6} />
    <Caption delay={10} size={72} highlight="just watched.">
      The world moves on.<br />And a whole generation of kids
    </Caption>
  </AbsoluteFill>
);

/* ---------- Scene 3: animated stat cards ---------- */
const StatCard: React.FC<{
  delay: number;
  headline: React.ReactNode;
  sub: string;
}> = ({ delay, headline, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 90 } });
  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px) scale(${interpolate(s, [0, 1], [0.92, 1])})`,
        width: 820,
        padding: "40px 46px",
        borderRadius: 26,
        background: "linear-gradient(150deg, rgba(252,211,77,0.09), rgba(20,20,20,0.9))",
        border: "1px solid rgba(252,211,77,0.28)",
        boxShadow: "0 30px 80px -30px rgba(0,0,0,0.9)",
      }}
    >
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 96, lineHeight: 1, color: YELLOW, textShadow: glow(YELLOW, 18) }}>{headline}</div>
      <div style={{ fontFamily: body, fontWeight: 600, fontSize: 30, color: MUTED, marginTop: 12, letterSpacing: 0.5 }}>{sub}</div>
    </div>
  );
};

const Scene3: React.FC = () => {
  const label = useRise(2, 20);
  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", gap: 30, opacity: useFade(210) }}>
      {/* subtle radial glow backdrop */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(252,211,77,0.08), transparent 60%)" }} />
      <FilmGrain opacity={0.05} />
      <div style={{ ...label, position: "absolute", top: 150, fontFamily: body, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: YELLOW, textTransform: "uppercase" }}>
        The numbers don&apos;t lie
      </div>
      <StatCard delay={14} headline={<><CountUp from={21} to={29} delay={20} suffix="%" /></>} sub="of Canadians now play the game" />
      <StatCard delay={44} headline={<><CountUp from={0} to={1.2} delay={50} decimals={1} suffix="M" /></>} sub="registered players nationwide" />
      <StatCard delay={74} headline="Soccer > Hockey" sub="It just passed hockey in participation" />
      <StatCard delay={104} headline={<><CountUp from={0} to={50} delay={110} suffix="%+" /></>} sub="of them are under 18" />
    </AbsoluteFill>
  );
};

/* ---------- Scene 4: system is broken ---------- */
const Scene4: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <Sequence durationInFrames={92}>
      <AbsoluteFill style={{ opacity: useFade(92) }}>
        <PhotoBG src={IMAGES.grassroots} duration={92} zoomFrom={1.06} zoomTo={1.2} panY={16} overlay={0.62} />
        <Caption delay={8} size={78} highlight="the system to develop them is broken.">
          Record numbers are playing.<br />But
        </Caption>
      </AbsoluteFill>
    </Sequence>
    <Sequence from={92} durationInFrames={88}>
      <AbsoluteFill style={{ opacity: useFade(88) }}>
        <PhotoBG src={IMAGES.grassroots2} duration={88} zoomFrom={1.08} zoomTo={1.22} panX={20} overlay={0.68} />
        <Caption delay={6} size={64} highlight="not because of it.">
          3 coaches. 3 formations. 3 years.<br />We build stars despite the system —
        </Caption>
      </AbsoluteFill>
    </Sequence>
  </AbsoluteFill>
);

/* ---------- Scene 5: product / screen-recording slots ---------- */
const PhoneSlot: React.FC<{ label: string; src?: string; delay: number; scale?: number }> = ({ label, src, delay, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 90 } });
  const w = 300 * scale;
  const h = w * (19.5 / 9);
  return (
    <div
      style={{
        opacity: interpolate(s, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px) scale(${interpolate(s, [0, 1], [0.9, 1])})`,
        width: w,
        height: h,
        borderRadius: w * 0.12,
        background: "#000",
        border: "7px solid #242424",
        boxShadow: "0 40px 90px -25px rgba(0,0,0,0.9)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {src ? (
        <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <AbsoluteFill
          style={{
            background: "repeating-linear-gradient(135deg, #141414 0px, #141414 22px, #191919 22px, #191919 44px)",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 14,
            padding: 16,
            textAlign: "center",
          }}
        >
          <div style={{ width: 54, height: 54, borderRadius: 12, border: `2px dashed ${YELLOW}`, display: "flex", alignItems: "center", justifyContent: "center", color: YELLOW, fontSize: 30, fontFamily: display }}>▶</div>
          <div style={{ fontFamily: body, fontWeight: 700, fontSize: 20, color: YELLOW, letterSpacing: 1 }}>{label}</div>
          <div style={{ fontFamily: body, fontWeight: 500, fontSize: 14, color: MUTED }}>drop screen recording</div>
        </AbsoluteFill>
      )}
    </div>
  );
};

const Scene5: React.FC = () => {
  const caption = useRise(8, 40);
  return (
    <AbsoluteFill style={{ backgroundColor: BG, opacity: useFade(210) }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 35%, rgba(252,211,77,0.1), transparent 60%)" }} />
      <FilmGrain opacity={0.05} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 340 }}>
        <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
          <PhoneSlot label={VIDEO_SLOTS[0].label} src={VIDEO_SLOTS[0].src} delay={6} scale={0.86} />
          <PhoneSlot label={VIDEO_SLOTS[1].label} src={VIDEO_SLOTS[1].src} delay={14} scale={1} />
          <PhoneSlot label={VIDEO_SLOTS[2].label} src={VIDEO_SLOTS[2].src} delay={22} scale={0.86} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: "0 80px 180px" }}>
        <div style={{ ...caption, textAlign: "center", maxWidth: 900 }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 64, color: WHITE, lineHeight: 1.05, letterSpacing: -1 }}>
            This time, let&apos;s build the <span style={{ color: YELLOW, textShadow: glow(YELLOW, 18) }}>system.</span>
          </div>
          <div style={{ fontFamily: body, fontWeight: 600, fontSize: 34, color: MUTED, marginTop: 16 }}>
            Every player tracked. No one overlooked.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- Scene 6: logo close ---------- */
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoS = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 90 } });
  const line = interpolate(frame, [26, 50], [0, 640], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t1 = interpolate(frame, [34, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t2 = interpolate(frame, [50, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bed = interpolate(frame, [0, 30], [0.28, 0.12], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", opacity: useFade(90, 10, 10) }}>
      <Img src={staticFile(IMAGES.logoBed)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: bed, filter: "saturate(0.6) brightness(0.6) sepia(0.15)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.95) 74%)" }} />
      <FilmGrain />
      <Img src={staticFile(IMAGES.logo)} style={{ zIndex: 2, width: 470, transform: `scale(${interpolate(logoS, [0, 1], [0.72, 1])})`, opacity: logoS, filter: "drop-shadow(0 0 40px rgba(252,211,77,0.4))" }} />
      <div style={{ zIndex: 2, height: 2, width: line, background: `linear-gradient(90deg, transparent, ${YELLOW}, transparent)`, marginTop: 12 }} />
      <div style={{ zIndex: 2, opacity: t1, marginTop: 26, fontFamily: display, fontWeight: 800, fontSize: 46, color: WHITE, textAlign: "center", padding: "0 70px", lineHeight: 1.15, letterSpacing: -1 }}>
        The World Cup was the spark.<br /><span style={{ color: YELLOW, textShadow: glow(YELLOW, 18) }}>This is the follow-through.</span>
      </div>
      <div style={{ zIndex: 2, opacity: t2, marginTop: 22, fontFamily: body, fontWeight: 600, fontSize: 30, letterSpacing: 3, color: MUTED }}>
        Follow for more.
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Composition: ~31s @ 30fps = 930 frames ---------- */
export const WorldCupLegacyReel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <Series>
      <Series.Sequence durationInFrames={120}><Scene1 /></Series.Sequence>
      <Series.Sequence durationInFrames={120}><Scene2 /></Series.Sequence>
      <Series.Sequence durationInFrames={210}><Scene3 /></Series.Sequence>
      <Series.Sequence durationInFrames={180}><Scene4 /></Series.Sequence>
      <Series.Sequence durationInFrames={210}><Scene5 /></Series.Sequence>
      <Series.Sequence durationInFrames={90}><Scene6 /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
