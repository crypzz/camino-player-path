import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { display, body, GOLD, IVORY, NAVY, GoldChip } from "./_shared";

const DUR = 90;

const roles = [
  { src: "aio/role-player.jpg", label: "Players" },
  { src: "aio/role-coach.jpg", label: "Coaches" },
  { src: "aio/role-director.jpg", label: "Directors" },
  { src: "aio/role-parent.jpg", label: "Parents" },
];

export const AIORolesScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerS = spring({ frame: frame - 4, fps, config: { damping: 20 } });
  const headerO = interpolate(headerS, [0, 1], [0, 1]);
  const headerY = interpolate(headerS, [0, 1], [20, 0]);

  const fadeOut = interpolate(frame, [DUR - 10, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, opacity: fadeOut }}>
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 220 }}>
        <div style={{ opacity: headerO, transform: `translateY(${headerY}px)`, marginBottom: 20 }}>
          <GoldChip>BUILT FOR EVERYONE</GoldChip>
        </div>
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 72, color: IVORY,
          textAlign: "center", letterSpacing: "-0.03em", lineHeight: 1,
          opacity: headerO, transform: `translateY(${headerY}px)`,
        }}>
          One platform.<br /><span style={{ color: GOLD }}>Four perspectives.</span>
        </div>
      </AbsoluteFill>

      <div style={{
        position: "absolute", left: 50, right: 50, bottom: 120,
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20,
      }}>
        {roles.map((r, i) => {
          const s = spring({ frame: frame - 18 - i * 6, fps, config: { damping: 18, stiffness: 140 } });
          const o = interpolate(s, [0, 1], [0, 1]);
          const sc = interpolate(s, [0, 1], [0.85, 1]);
          return (
            <div key={r.label} style={{
              opacity: o, transform: `scale(${sc})`,
              borderRadius: 18, overflow: "hidden",
              border: `1px solid rgba(232,180,0,0.3)`,
              aspectRatio: "1 / 1", position: "relative",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}>
              <Img src={staticFile(r.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, rgba(10,12,18,0) 40%, rgba(10,12,18,0.9) 100%)",
              }} />
              <div style={{
                position: "absolute", bottom: 18, left: 20, right: 20,
                fontFamily: display, fontWeight: 800, fontSize: 36,
                color: IVORY, letterSpacing: "-0.02em",
              }}>
                {r.label}
                <div style={{
                  width: 40, height: 3, backgroundColor: GOLD, marginTop: 6,
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
