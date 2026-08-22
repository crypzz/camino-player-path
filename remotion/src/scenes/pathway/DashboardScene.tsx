import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import {
  SceneShell, Caption, Panel, Label, CountUp, NAVY, GOLD, IVORY, MUTED, GREEN, body, display, ease,
} from "./_shared";

const DUR = 175;

const Dial: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, delay, delay + 40, 0, 0.78);
  const R = 62;
  const C = 2 * Math.PI * R;
  return (
    <div style={{ position: "relative", width: 160, height: 160 }}>
      <svg width={160} height={160}>
        <circle cx={80} cy={80} r={R} stroke="rgba(255,255,255,0.09)" strokeWidth={12} fill="none" />
        <circle
          cx={80} cy={80} r={R} stroke={GOLD} strokeWidth={12} fill="none" strokeLinecap="round"
          strokeDasharray={`${C * p} ${C}`} transform="rotate(-90 80 80)"
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <CountUp from={0} to={78} start={delay} dur={40} style={{ fontFamily: display, fontWeight: 800, fontSize: 48, color: IVORY }} />
        <div style={{ fontFamily: body, fontSize: 15, letterSpacing: 3, color: MUTED }}>CPI</div>
      </div>
    </div>
  );
};

const Row: React.FC<{ name: string; pos: string; val: string; delay: number }> = ({ name, pos, val, delay }) => {
  const frame = useCurrentFrame();
  const o = ease(frame, delay, delay + 12);
  const x = interpolate(o, [0, 1], [26, 0]);
  return (
    <div style={{
      opacity: o, transform: `translateX(${x}px)`, display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(252,211,77,0.16)", border: "1px solid rgba(252,211,77,0.3)" }} />
        <div>
          <div style={{ fontFamily: body, fontWeight: 600, fontSize: 24, color: IVORY }}>{name}</div>
          <div style={{ fontFamily: body, fontSize: 17, color: MUTED }}>{pos}</div>
        </div>
      </div>
      <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: GOLD }}>{val}</div>
    </div>
  );
};

export const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const grid = ease(frame, 0, 26, 0, 0.16);

  return (
    <SceneShell duration={DUR} bg={NAVY}>
      <div style={{
        position: "absolute", inset: 0, opacity: grid,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "90px 90px",
        transform: `translateY(${interpolate(frame, [0, DUR], [0, -30])}px)`,
      }} />

      <div style={{ position: "absolute", top: 150, left: 70, right: 70 }}>
        <div style={{ opacity: ease(frame, 4, 18), display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 34, color: IVORY, letterSpacing: -0.6 }}>
            CAMINO<span style={{ color: GOLD }}>.</span>
          </div>
          <Label>Coach dashboard</Label>
        </div>

        <Panel delay={10} glow style={{ display: "flex", alignItems: "center", gap: 30, marginBottom: 20 }}>
          <Dial delay={20} />
          <div style={{ flex: 1 }}>
            <Label>Squad average</Label>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 40, color: IVORY, marginTop: 8 }}>
              Trending <span style={{ color: GREEN }}>+<CountUp from={0} to={6.4} start={30} decimals={1} /></span>
            </div>
            <div style={{ fontFamily: body, fontSize: 21, color: MUTED, marginTop: 6 }}>last 30 days</div>
          </div>
        </Panel>

        <div style={{ display: "flex", gap: 20 }}>
          <Panel delay={22} style={{ flex: 1 }}>
            <Label>Squad</Label>
            <div style={{ marginTop: 10 }}>
              <Row name="D. Nunez" pos="Forward" val="82" delay={34} />
              <Row name="A. Silva" pos="Midfield" val="76" delay={42} />
              <Row name="M. Ahmed" pos="Defender" val="71" delay={50} />
            </div>
          </Panel>
        </div>

        <Panel delay={34} style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
          {[
            { l: "SESSIONS", v: 18 },
            { l: "MATCHES", v: 9 },
            { l: "CLIPS", v: 143 },
          ].map((s, i) => (
            <div key={s.l} style={{ textAlign: "center", flex: 1 }}>
              <CountUp from={0} to={s.v} start={46 + i * 6} style={{ fontFamily: display, fontWeight: 800, fontSize: 42, color: IVORY }} />
              <div style={{ fontFamily: body, fontSize: 16, letterSpacing: 3, color: MUTED, marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </Panel>
      </div>

      <Caption delay={70} bottom={190} lines={[{ t: "Meet Camino." }, { t: "A live development platform.", gold: true }]} />
    </SceneShell>
  );
};
