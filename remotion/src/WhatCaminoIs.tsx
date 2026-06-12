import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";

const { fontFamily } = loadFont("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
const { fontFamily: serif } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });

const WHITE = "#F4F4F2";
const MUTED = "rgba(244,244,242,0.55)";

const Line: React.FC<{
  text: string;
  in0: number;
  hold: number;
  size?: number;
  weight?: number;
  color?: string;
  serifAccent?: string;
}> = ({ text, in0, hold, size = 78, weight = 700, color = WHITE, serifAccent }) => {
  const frame = useCurrentFrame();
  const out0 = in0 + hold;
  const opacity =
    interpolate(frame, [in0, in0 + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    interpolate(frame, [out0, out0 + 16], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame, [in0, in0 + 20], [16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 90px",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          fontFamily,
          fontSize: size,
          fontWeight: weight,
          color,
          lineHeight: 1.18,
          letterSpacing: "-0.025em",
          textAlign: "center",
        }}
      >
        {serifAccent ? (
          <>
            {text}{" "}
            <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400 }}>{serifAccent}</span>
          </>
        ) : (
          text
        )}
      </div>
    </div>
  );
};

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.01) * 6;
  return (
    <AbsoluteFill style={{ backgroundColor: "#050505" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 90% 60% at 50% ${42 + drift}%, rgba(255,255,255,0.05) 0%, transparent 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
          mixBlendMode: "overlay",
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};

const LogoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200, stiffness: 60 } });
  const opacity = interpolate(frame, [0, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(s, [0, 1], [0.94, 1]);
  const glow = interpolate(frame, [0, 44], [0, 1], { extrapolateRight: "clamp" });
  const subO = interpolate(frame, [24, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", opacity, transform: `scale(${scale})` }}>
        <div
          style={{
            fontFamily,
            fontSize: 122,
            fontWeight: 800,
            color: WHITE,
            letterSpacing: "0.04em",
            textShadow: `0 0 ${60 * glow}px rgba(255,255,255,${0.35 * glow})`,
          }}
        >
          CAMINO
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 34,
            fontWeight: 500,
            color: MUTED,
            marginTop: 34,
            letterSpacing: "-0.01em",
            opacity: subO,
          }}
        >
          Built for Canadian players.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [16, 44], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [56, 78], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fadeOut }}>
      <div style={{ textAlign: "center", opacity }}>
        <div style={{ fontFamily, fontSize: 84, fontWeight: 800, color: WHITE, letterSpacing: "0.03em" }}>
          CAMINO
        </div>
        <div
          style={{
            width: `${lineW}%`,
            maxWidth: 300,
            height: 2,
            backgroundColor: "rgba(244,244,242,0.4)",
            margin: "30px auto",
          }}
        />
        <div
          style={{
            fontFamily,
            fontSize: 32,
            fontWeight: 600,
            color: MUTED,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Follow to stay updated
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const WhatCaminoIs: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#050505" }}>
      <Backdrop />

      {/* Scene 1 — 0-2s */}
      <Sequence from={0} durationInFrames={70}>
        <Line text="Camino is" in0={10} hold={34} serifAccent="not content." />
      </Sequence>

      {/* Scene 2 — 2-5s */}
      <Sequence from={70} durationInFrames={44}>
        <Line text="It's infrastructure." in0={0} hold={22} size={74} />
      </Sequence>
      <Sequence from={114} durationInFrames={46}>
        <Line text="Built for athlete development." in0={0} hold={24} size={62} />
      </Sequence>

      {/* Scene 3 — 5-8s */}
      <Sequence from={160} durationInFrames={42}>
        <Line text="Tracking growth." in0={0} hold={20} size={70} />
      </Sequence>
      <Sequence from={202} durationInFrames={42}>
        <Line text="Improving visibility." in0={0} hold={20} size={70} />
      </Sequence>
      <Sequence from={244} durationInFrames={48}>
        <Line text="Creating structure in" in0={0} hold={24} size={60} serifAccent="player development." />
      </Sequence>

      {/* Scene 4 — logo 8-10s */}
      <Sequence from={292} durationInFrames={70}>
        <LogoScene />
      </Sequence>

      {/* Scene 5 — final CTA */}
      <Sequence from={362} durationInFrames={80}>
        <FinalScene />
      </Sequence>
    </AbsoluteFill>
  );
};
