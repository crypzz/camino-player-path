import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import {
  SceneShell, Caption, Panel, Label, CountUp, NAVY, GOLD, IVORY, MUTED, GREEN, body, display, ease,
} from "./_shared";

const DUR = 225;

const pts = [0.18, 0.24, 0.21, 0.33, 0.42, 0.4, 0.55, 0.62, 0.71, 0.78, 0.86];
const W = 860;
const H = 260;

const Chart: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, delay, delay + 80);
  const coords = pts.map((v, i) => [(i / (pts.length - 1)) * W, H - v * H]);
  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ");
  const total = 1600;
  const idx = Math.min(coords.length - 1, Math.floor(p * (coords.length - 1)));
  const head = coords[idx];
  return (
    <svg width={W} height={H + 40} style={{ overflow: "visible" }}>
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={0} y1={H - g * H} x2={W} y2={H - g * H} stroke="rgba(255,255,255,0.06)" />
      ))}
      <path
        d={`${path} L${W},${H} L0,${H} Z`}
        fill="url(#g)"
        opacity={p * 0.5}
        clipPath="url(#clip)"
      />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.45" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </linearGradient>
        <clipPath id="clip">
          <rect x="0" y="0" width={W * p} height={H + 40} />
        </clipPath>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={GOLD}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={total}
        strokeDashoffset={total * (1 - p)}
      />
      <circle cx={head[0]} cy={head[1]} r={9} fill={GOLD} opacity={p > 0.02 ? 1 : 0} />
      <circle cx={head[0]} cy={head[1]} r={18} fill="none" stroke={GOLD} strokeOpacity={0.35} opacity={p > 0.02 ? 1 : 0} />
      {["W1", "W4", "W8", "W12"].map((l, i) => (
        <text
          key={l}
          x={(i / 3) * W}
          y={H + 30}
          fill="rgba(245,245,245,0.45)"
          fontFamily={body}
          fontSize={18}
          textAnchor={i === 0 ? "start" : i === 3 ? "end" : "middle"}
        >
          {l}
        </text>
      ))}
    </svg>
  );
};

const timeline = [
  { d: "Mar 2", t: "vs Foothills · 2G 1A", c: GREEN, delay: 118 },
  { d: "Mar 9", t: "Fitness test · +0.4s sprint", c: GOLD, delay: 128 },
  { d: "Mar 16", t: "Evaluation · Level 6 reached", c: GREEN, delay: 138 },
];

export const DevelopmentScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell duration={DUR} bg={NAVY}>
      <div style={{ position: "absolute", top: 380, left: 60, right: 60 }}>
        <Panel delay={4} glow style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 18 }}>
          <div style={{ width: 78, height: 78, borderRadius: 24, background: "rgba(252,211,77,0.16)", border: `1px solid ${GOLD}55` }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 34, color: IVORY }}>Diego Nunez</div>
            <div style={{ fontFamily: body, fontSize: 21, color: MUTED }}>Forward · U15 · Camino passport</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: body, fontSize: 15, letterSpacing: 3, color: MUTED }}>LEVEL</div>
            <CountUp from={4} to={6} start={30} dur={30} style={{ fontFamily: display, fontWeight: 800, fontSize: 44, color: GOLD }} />
          </div>
        </Panel>

        <Panel delay={12}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
            <Label>CPI progression</Label>
            <div>
              <CountUp from={41} to={82} start={26} dur={80} style={{ fontFamily: display, fontWeight: 800, fontSize: 44, color: IVORY }} />
              <span style={{ fontFamily: body, fontSize: 22, color: GREEN, marginLeft: 10 }}>
                +<CountUp from={0} to={41} start={26} dur={80} />
              </span>
            </div>
          </div>
          <Chart delay={26} />
        </Panel>

        <Panel delay={106} style={{ marginTop: 18 }}>
          <Label>Development record</Label>
          <div style={{ marginTop: 14 }}>
            {timeline.map((r) => {
              const o = ease(frame, r.delay, r.delay + 14);
              return (
                <div key={r.d} style={{ opacity: o, transform: `translateY(${interpolate(o, [0, 1], [18, 0])}px)`, display: "flex", gap: 18, alignItems: "center", padding: "12px 0" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 10, background: r.c }} />
                  <span style={{ fontFamily: body, fontWeight: 700, fontSize: 21, color: MUTED, width: 100 }}>{r.d}</span>
                  <span style={{ fontFamily: body, fontWeight: 600, fontSize: 24, color: IVORY }}>{r.t}</span>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <Caption
        delay={158}
        bottom={120}
        size={48}
        lines={[{ t: "Track development" }, { t: "over time.", gold: true }]}
      />
    </SceneShell>
  );
};
