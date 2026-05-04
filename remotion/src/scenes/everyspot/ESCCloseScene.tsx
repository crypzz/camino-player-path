import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { display, body, GOLD, IVORY, NAVY, NAVY_2, PhotoBG } from "./_shared";

const DUR = 180;

// teams animate: a "Your Club" row rises from rank 6 → rank 2
const initial = [
  { name: "Foothills SC", pts: 28 },
  { name: "Calgary Villains", pts: 27 },
  { name: "Cavalry Academy", pts: 26 },
  { name: "Blizzard", pts: 25 },
  { name: "SW United", pts: 19 },
  { name: "Your Club", pts: 17 },
];
const final = [
  { name: "Foothills SC", pts: 30 },
  { name: "Your Club", pts: 28 },
  { name: "Calgary Villains", pts: 27 },
  { name: "Cavalry Academy", pts: 26 },
  { name: "Blizzard", pts: 25 },
  { name: "SW United", pts: 19 },
];

const ROW_H = 72;

export const ESCCloseScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headS = spring({ frame: frame - 2, fps, config: { damping: 22 } });
  const headO = interpolate(headS, [0, 1], [0, 1]);
  const headY = interpolate(headS, [0, 1], [20, 0]);

  // animation progress for the rise
  const rise = spring({ frame: frame - 30, fps, config: { damping: 26, stiffness: 60 } });

  // for each team in initial, find its final index, interpolate Y
  const positions = initial.map((t) => {
    const fromIdx = initial.findIndex(x => x.name === t.name);
    const toIdx = final.findIndex(x => x.name === t.name);
    const y = interpolate(rise, [0, 1], [fromIdx * ROW_H, toIdx * ROW_H]);
    const ptsFrom = t.pts;
    const ptsTo = final.find(x => x.name === t.name)!.pts;
    const pts = Math.round(interpolate(rise, [0, 1], [ptsFrom, ptsTo]));
    return { name: t.name, y, pts, isYou: t.name === "Your Club" };
  });

  const endCardS = spring({ frame: frame - 100, fps, config: { damping: 22 } });
  const endO = interpolate(endCardS, [0, 1], [0, 1]);
  const endY = interpolate(endCardS, [0, 1], [30, 0]);

  return (
    <AbsoluteFill>
      <PhotoBG src="aio/cta-stadium.jpg" duration={DUR} zoomFrom={1.1} zoomTo={1.22} panY={-15} overlayStrength={0.78} />

      <AbsoluteFill style={{ padding: "120px 60px 0", flexDirection: "column" }}>
        <div style={{ opacity: headO, transform: `translateY(${headY}px)` }}>
          <div style={{ fontFamily: body, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: GOLD, textTransform: "uppercase" }}>Climb your way up</div>
          <div style={{ marginTop: 16, fontFamily: display, fontWeight: 800, fontSize: 76, lineHeight: 0.95, color: IVORY, letterSpacing: "-0.03em", textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}>
            The path is <span style={{ color: GOLD }}>yours.</span>
          </div>
        </div>

        {/* animated table */}
        <div style={{ position: "relative", marginTop: 48, height: ROW_H * initial.length }}>
          {positions.map((p, i) => (
            <div key={p.name} style={{
              position: "absolute", left: 0, right: 0, top: p.y, height: ROW_H - 8,
              display: "grid", gridTemplateColumns: "1fr 100px",
              alignItems: "center", padding: "0 24px",
              background: p.isYou ? "rgba(232,180,0,0.18)" : "rgba(20,24,33,0.85)",
              border: `1px solid ${p.isYou ? GOLD : "rgba(245,245,245,0.08)"}`,
              borderRadius: 12,
              boxShadow: p.isYou ? "0 0 24px rgba(232,180,0,0.35)" : "none",
            }}>
              <div style={{ fontFamily: body, fontWeight: 700, fontSize: 24, color: p.isYou ? GOLD : IVORY }}>{p.name}</div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 28, color: IVORY, textAlign: "right" }}>{p.pts}</div>
            </div>
          ))}
        </div>

        {/* end card */}
        <div style={{ marginTop: "auto", marginBottom: 80, opacity: endO, transform: `translateY(${endY}px)`, textAlign: "center" }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 96, color: IVORY, letterSpacing: "-0.05em", lineHeight: 1 }}>
            camino<span style={{ color: GOLD }}>.</span>
          </div>
          <div style={{ marginTop: 12, fontFamily: body, fontWeight: 600, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: GOLD }}>
            caminodevelopment.com
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
