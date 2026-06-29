import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from "remotion";
import { BG, CARD, YELLOW, YELLOW_DEEP, WHITE, MUTED, body, display, glow } from "./_shared";

// SCENE 5 (32-45s) — THE CLOSE. Phones compress, logo, CTA.
export const Scene5Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-50): 3 nodes compress to center with connecting lines
  // Phase 2 (50+): logo + text + CTA
  const compress = spring({ frame, fps, config: { damping: 22 }, durationInFrames: 45 });
  const nodesGone = interpolate(frame, [44, 56], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const logoP = spring({ frame: frame - 52, fps, config: { damping: 12 } });
  const l1 = spring({ frame: frame - 70, fps, config: { damping: 16 } });
  const l2 = spring({ frame: frame - 80, fps, config: { damping: 16 } });
  const btnP = spring({ frame: frame - 96, fps, config: { damping: 12 } });
  const sub = spring({ frame: frame - 112, fps, config: { damping: 16 } });

  const pulse = interpolate(Math.sin(frame / 7), [-1, 1], [1, 1.05]);
  const btnGlow = interpolate(Math.sin(frame / 7), [-1, 1], [18, 46]);

  // node positions converging
  const nodes = [
    { ix: -300, iy: -160 },
    { ix: 300, iy: -160 },
    { ix: 0, iy: 220 },
  ];

  const cx = 540, cy = 760;

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, ${YELLOW}1f, transparent 60%)` }} />

      {/* Ecosystem nodes + connecting lines */}
      {nodesGone > 0.01 && (
        <AbsoluteFill style={{ opacity: nodesGone }}>
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            {nodes.map((n, i) => {
              const nx = cx + n.ix * (1 - compress);
              const ny = cy + n.iy * (1 - compress);
              return <line key={i} x1={cx} y1={cy} x2={nx} y2={ny} stroke={YELLOW} strokeWidth={3} opacity={compress * 0.7} style={{ filter: `drop-shadow(0 0 6px ${YELLOW})` }} />;
            })}
          </svg>
          {nodes.map((n, i) => {
            const nx = n.ix * (1 - compress);
            const ny = n.iy * (1 - compress);
            const labels = ["Scout", "Coach", "Parent"];
            return (
              <div key={i} style={{ position: "absolute", left: cx, top: cy, transform: `translate(-50%,-50%) translate(${nx}px,${ny}px) scale(${0.6 + 0.4 * (1 - compress)})` }}>
                <div style={{ width: 130, height: 130, borderRadius: 28, background: CARD, border: `1px solid ${YELLOW}55`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, color: YELLOW, fontWeight: 800, fontSize: 24, boxShadow: glow(YELLOW, 10) }}>
                  {labels[i]}
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}

      {/* Logo + close */}
      <Sequence from={50}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ transform: `scale(${0.6 + logoP * 0.4})`, opacity: logoP, marginBottom: 30 }}>
            <Img src={staticFile("images/logo.png")} style={{ width: 170, filter: `drop-shadow(0 0 60px ${YELLOW})` }} />
          </div>
          <div style={{ opacity: l1, transform: `translateY(${interpolate(l1, [0, 1], [24, 0])}px)`, fontFamily: display, color: WHITE, fontWeight: 800, fontSize: 88, letterSpacing: -2 }}>
            Camino
          </div>
          <div style={{ opacity: l2, transform: `translateY(${interpolate(l2, [0, 1], [24, 0])}px)`, fontFamily: body, color: MUTED, fontWeight: 600, fontSize: 34, marginTop: 12, textAlign: "center", padding: "0 60px" }}>
            Built for everyone in youth soccer
          </div>

          <div style={{ opacity: btnP, transform: `scale(${btnP * pulse})`, marginTop: 60, padding: "30px 70px", borderRadius: 999, background: `linear-gradient(135deg, ${YELLOW}, ${YELLOW_DEEP})`, color: "#111", fontFamily: display, fontWeight: 800, fontSize: 46, boxShadow: glow(YELLOW, btnGlow) }}>
            Claim Your Spot
          </div>
          <div style={{ opacity: sub, marginTop: 26, display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", borderRadius: 999, background: "rgba(255,90,90,0.12)", border: "1px solid rgba(255,90,90,0.5)", color: "#ff7a7a", fontFamily: body, fontWeight: 800, fontSize: 28 }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5a5a", boxShadow: "0 0 14px #ff5a5a" }} />
            50 founder spots available
          </div>
          <div style={{ opacity: sub * 0.85, marginTop: 30, fontFamily: body, color: MUTED, fontWeight: 700, fontSize: 28 }}>
            Link in bio
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* fade to black at very end */}
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [375, 390], [0, 1], { extrapolateLeft: "clamp" }) }} />
    </AbsoluteFill>
  );
};
