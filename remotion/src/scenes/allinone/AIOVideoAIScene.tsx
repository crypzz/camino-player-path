import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhotoBG, display, body, GOLD, IVORY, GoldChip } from "./_shared";

const DUR = 120;

export const AIOVideoAIScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerS = spring({ frame: frame - 4, fps, config: { damping: 20 } });
  const headerO = interpolate(headerS, [0, 1], [0, 1]);
  const headerY = interpolate(headerS, [0, 1], [20, 0]);

  // bounding boxes appear and pulse
  const boxO = interpolate(frame, [18, 36], [0, 1], { extrapolateRight: "clamp" });
  const pulse = 0.7 + Math.sin(frame * 0.18) * 0.3;

  // event tags drop in
  const tagS = spring({ frame: frame - 50, fps, config: { damping: 18 } });
  const tagO = interpolate(tagS, [0, 1], [0, 1]);
  const tagY = interpolate(tagS, [0, 1], [20, 0]);

  // mini pitch
  const miniS = spring({ frame: frame - 70, fps, config: { damping: 18 } });
  const miniO = interpolate(miniS, [0, 1], [0, 1]);
  const miniY = interpolate(miniS, [0, 1], [40, 0]);

  const fadeOut = interpolate(frame, [DUR - 12, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Bounding boxes (relative coords on the photo region)
  const boxes = [
    { x: 30, y: 50, w: 6, h: 12, label: "10" },
    { x: 50, y: 48, w: 5, h: 11, label: "7" },
    { x: 70, y: 52, w: 5, h: 11, label: "9" },
  ];

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <PhotoBG src="aio/videoai-match.jpg" duration={DUR} zoomFrom={1.05} zoomTo={1.15} overlayStrength={0.55} />

      {/* SVG bounding boxes overlay */}
      <AbsoluteFill style={{ opacity: boxO }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {boxes.map((b, i) => (
            <g key={i}>
              <rect
                x={b.x} y={b.y} width={b.w} height={b.h}
                fill="none" stroke={GOLD} strokeWidth={0.25}
                opacity={pulse}
              />
            </g>
          ))}
        </svg>
        {/* labels (in DOM for crisp text) */}
        {boxes.map((b, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${b.x}%`, top: `${b.y - 3.5}%`,
            background: GOLD, color: "#0A0C12",
            fontFamily: display, fontWeight: 800, fontSize: 18,
            padding: "2px 8px", borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
          }}>#{b.label}</div>
        ))}
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", padding: "120px 60px 0" }}>
        <div style={{ opacity: headerO, transform: `translateY(${headerY}px)`, marginBottom: 24 }}>
          <GoldChip>AI VIDEO ANALYSIS</GoldChip>
        </div>
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 64, color: IVORY,
          textAlign: "center", letterSpacing: "-0.03em", lineHeight: 1,
          opacity: headerO, transform: `translateY(${headerY}px)`,
        }}>
          Upload. Tag. <span style={{ color: GOLD }}>Learn.</span>
        </div>
      </AbsoluteFill>

      {/* Event tags floating */}
      <div style={{
        position: "absolute", left: 60, right: 60, top: 880,
        display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center",
        opacity: tagO, transform: `translateY(${tagY}px)`,
      }}>
        {[
          { label: "Goal", color: "#10B981" },
          { label: "Key Pass", color: GOLD },
          { label: "Tackle", color: "#3B82F6" },
          { label: "Dribble", color: "#A855F7" },
        ].map((t) => (
          <div key={t.label} style={{
            background: "rgba(20,24,33,0.92)",
            border: `1px solid ${t.color}`,
            borderRadius: 999,
            padding: "10px 22px",
            fontFamily: body, fontWeight: 700, fontSize: 22, color: t.color,
          }}>● {t.label}</div>
        ))}
      </div>

      {/* Mini pitch with event dots */}
      <div style={{
        position: "absolute", left: 60, right: 60, bottom: 120,
        opacity: miniO, transform: `translateY(${miniY}px)`,
      }}>
        <div style={{
          background: "rgba(20,24,33,0.92)",
          border: `1px solid rgba(232,180,0,0.3)`,
          borderRadius: 18, padding: 20,
        }}>
          <div style={{ fontFamily: body, fontWeight: 700, fontSize: 18, color: GOLD, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
            Pitch Map · 8 events
          </div>
          <svg width="100%" height={280} viewBox="0 0 100 60" style={{ display: "block" }}>
            {/* pitch */}
            <rect x={0} y={0} width={100} height={60} fill="#0F4D2A" />
            <rect x={0} y={0} width={100} height={60} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={0.4} />
            <line x1={50} y1={0} x2={50} y2={60} stroke="rgba(255,255,255,0.5)" strokeWidth={0.4} />
            <circle cx={50} cy={30} r={6} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={0.4} />
            <rect x={0} y={20} width={12} height={20} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={0.4} />
            <rect x={88} y={20} width={12} height={20} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={0.4} />
            {/* events */}
            {[
              { x: 78, y: 30, c: "#10B981" },
              { x: 65, y: 22, c: GOLD },
              { x: 70, y: 38, c: GOLD },
              { x: 55, y: 28, c: "#3B82F6" },
              { x: 82, y: 25, c: "#10B981" },
              { x: 45, y: 32, c: "#A855F7" },
              { x: 60, y: 45, c: GOLD },
              { x: 85, y: 38, c: "#10B981" },
            ].map((e, i) => {
              const popS = spring({ frame: frame - 80 - i * 3, fps, config: { damping: 14 } });
              const r = interpolate(popS, [0, 1], [0, 1.6]);
              return (
                <circle key={i} cx={e.x} cy={e.y} r={r} fill={e.c} opacity={0.9}
                  style={{ filter: `drop-shadow(0 0 2px ${e.c})` }} />
              );
            })}
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
