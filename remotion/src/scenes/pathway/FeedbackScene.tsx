import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import {
  SceneShell, Caption, Panel, Label, StatBar, Chip, TypeOn, NAVY, GOLD, IVORY, MUTED, GREEN, AMBER, body, display, ease,
} from "./_shared";

const DUR = 170;

const Radar: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, delay, delay + 34);
  const vals = [0.86, 0.72, 0.64, 0.8, 0.58, 0.75];
  const cx = 130, cy = 128, R = 96;
  const pt = (i: number, r: number) => {
    const a = (Math.PI * 2 * i) / vals.length - Math.PI / 2;
    return [cx + Math.cos(a) * R * r, cy + Math.sin(a) * R * r];
  };
  const poly = vals.map((v, i) => pt(i, v * p).join(",")).join(" ");
  return (
    <svg width={260} height={256}>
      {[0.35, 0.7, 1].map((r) => (
        <polygon
          key={r}
          points={vals.map((_, i) => pt(i, r).join(",")).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.09)"
        />
      ))}
      <polygon points={poly} fill="rgba(252,211,77,0.20)" stroke={GOLD} strokeWidth={2} />
    </svg>
  );
};

export const FeedbackScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SceneShell duration={DUR} bg={NAVY}>
      <div style={{ position: "absolute", top: 140, left: 60, right: 60 }}>
        <div style={{ opacity: ease(frame, 2, 14), marginBottom: 20 }}>
          <Label color={GOLD}>Match report · D. Nunez</Label>
        </div>

        <Panel delay={6} glow style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 21, background: "rgba(252,211,77,0.18)", border: `1px solid ${GOLD}55` }} />
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 26, color: IVORY }}>Coach feedback</div>
          </div>
          <div style={{ fontFamily: body, fontSize: 27, lineHeight: 1.4, color: IVORY, minHeight: 116 }}>
            <TypeOn
              start={16}
              cps={1.9}
              text="Press trigger was sharp all game. Next block: receiving on the half-turn under pressure."
            />
            <span style={{ opacity: frame % 20 < 10 ? 1 : 0, color: GOLD }}>|</span>
          </div>
        </Panel>

        <div style={{ display: "flex", gap: 18 }}>
          <Panel delay={30} style={{ flex: 1.1 }}>
            <Label>Breakdown</Label>
            <div style={{ marginTop: 14 }}>
              <StatBar label="Pressing" value={0.88} color={GREEN} delay={40} />
              <StatBar label="Finishing" value={0.74} color={GREEN} delay={48} />
              <StatBar label="Weak foot" value={0.46} color={AMBER} delay={56} />
              <StatBar label="Decisions" value={0.61} color={AMBER} delay={64} />
            </div>
          </Panel>
          <Panel delay={38} style={{ width: 300, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Label>Profile</Label>
            <Radar delay={48} />
          </Panel>
        </div>

        <div style={{ marginTop: 18 }}>
          <Chip delay={78} color={GREEN}>2 goals</Chip>
          <Chip delay={84} color={GREEN}>7 duels won</Chip>
          <Chip delay={90}>9.4 km</Chip>
          <Chip delay={96} color={AMBER}>3 turnovers</Chip>
        </div>
      </div>

      <Caption
        delay={106}
        bottom={130}
        size={48}
        lines={[{ t: "Every game becomes" }, { t: "actionable feedback.", gold: true }]}
      />
    </SceneShell>
  );
};
