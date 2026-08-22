import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, AbsoluteFill } from "remotion";
import { SceneShell, NAVY, GOLD, IVORY, MUTED, body, display, ease } from "./_shared";

const DUR = 225;

const Big: React.FC<{ text: string; delay: number; gold?: boolean; size?: number }> = ({ text, delay, gold, size = 78 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 130 } });
  return (
    <div
      style={{
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.1,
        letterSpacing: -2,
        color: gold ? GOLD : IVORY,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
        filter: `blur(${interpolate(s, [0, 1], [10, 0])}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const EndingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase1Out = ease(frame, 88, 100, 1, 0);
  const markS = spring({ frame: frame - 100, fps, config: { damping: 22, stiffness: 110 } });
  const glow = interpolate(Math.sin(frame / 11), [-1, 1], [22, 60]);

  return (
    <SceneShell duration={DUR} bg="#06080D">
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(252,211,77,${0.06 + 0.05 * Math.sin(frame / 20)}) 0%, rgba(0,0,0,0) 60%)`,
        }}
      />

      <div style={{ position: "absolute", top: 620, left: 80, right: 80, opacity: phase1Out }}>
        <Big text="Don't just play" delay={4} />
        <Big text="the game." delay={12} />
        <div style={{ height: 22 }} />
        <Big text="Track your development." delay={30} gold size={62} />
      </div>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: markS }}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 108,
            letterSpacing: 8,
            color: IVORY,
            textShadow: `0 0 ${glow}px rgba(252,211,77,0.55)`,
            transform: `scale(${interpolate(markS, [0, 1], [0.88, 1])})`,
          }}
        >
          CAMINO
        </div>
        <div
          style={{
            width: interpolate(ease(frame, 114, 140), [0, 1], [0, 320]),
            height: 3,
            background: GOLD,
            marginTop: 26,
            borderRadius: 3,
          }}
        />
        <div
          style={{
            marginTop: 34,
            fontFamily: display,
            fontWeight: 700,
            fontSize: 40,
            color: IVORY,
            opacity: ease(frame, 134, 154),
            letterSpacing: -0.5,
          }}
        >
          Your development.
        </div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 700,
            fontSize: 40,
            color: GOLD,
            opacity: ease(frame, 144, 164),
            letterSpacing: -0.5,
          }}
        >
          Your pathway.
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 210,
            fontFamily: body,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: 4,
            color: MUTED,
            opacity: ease(frame, 164, 184),
          }}
        >
          CAMINODEVELOPMENT.COM
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
