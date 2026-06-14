import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";

const { fontFamily } = loadFont("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
const { fontFamily: serif } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });

const WHITE = "#F4F4F2";
const MUTED = "rgba(244,244,242,0.5)";

// A single statement line that fades in, holds, fades out
const Line: React.FC<{
  text: string;
  in0: number;
  hold: number;
  size?: number;
  weight?: number;
  color?: string;
  serifAccent?: string;
  italic?: boolean;
}> = ({ text, in0, hold, size = 76, weight = 700, color = WHITE, serifAccent, italic }) => {
  const frame = useCurrentFrame();
  const out0 = in0 + hold;
  const opacity =
    interpolate(frame, [in0, in0 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    interpolate(frame, [out0, out0 + 18], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame, [in0, in0 + 24], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 96px",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          fontFamily: italic ? serif : fontFamily,
          fontStyle: italic ? "italic" : "normal",
          fontSize: size,
          fontWeight: italic ? 400 : weight,
          color,
          lineHeight: 1.2,
          letterSpacing: italic ? "-0.01em" : "-0.025em",
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
  const drift = Math.sin(frame * 0.008) * 5;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 85% 55% at 50% ${44 + drift}%, rgba(255,255,255,0.045) 0%, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.022'/%3E%3C/svg%3E\")",
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
  const s = spring({ frame, fps, config: { damping: 200, stiffness: 55 } });
  const opacity = interpolate(frame, [0, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(s, [0, 1], [0.93, 1]);
  const glow = interpolate(frame, [0, 46], [0, 1], { extrapolateRight: "clamp" });
  const subO = interpolate(frame, [28, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", opacity, transform: `scale(${scale})` }}>
        <div
          style={{
            fontFamily,
            fontSize: 120,
            fontWeight: 800,
            color: WHITE,
            letterSpacing: "0.05em",
            textShadow: `0 0 ${64 * glow}px rgba(255,255,255,${0.32 * glow})`,
          }}
        >
          CAMINO
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 33,
            fontWeight: 500,
            color: MUTED,
            marginTop: 34,
            letterSpacing: "-0.01em",
            opacity: subO,
          }}
        >
          Building a better pathway for athletes.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [18, 46], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [60, 84], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: fadeOut }}>
      <div style={{ textAlign: "center", opacity }}>
        <div style={{ fontFamily, fontSize: 70, fontWeight: 800, color: WHITE, letterSpacing: "0.01em" }}>
          Follow the journey.
        </div>
        <div
          style={{
            width: `${lineW}%`,
            maxWidth: 280,
            height: 2,
            backgroundColor: "rgba(244,244,242,0.35)",
            margin: "32px auto",
          }}
        />
        <div
          style={{
            fontFamily,
            fontSize: 34,
            fontWeight: 600,
            color: MUTED,
            letterSpacing: "0.04em",
          }}
        >
          @caminodevelopment
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const FounderStatement: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Backdrop />

      {/* Scene 1 — "If you're waiting to be discovered..." */}
      <Sequence from={0} durationInFrames={74}>
        <Line text="If you're waiting" in0={12} hold={36} size={72} serifAccent="to be discovered..." />
      </Sequence>

      {/* Scene 2 — "You already lost." */}
      <Sequence from={74} durationInFrames={70}>
        <Line text="You already lost." in0={6} hold={40} size={82} weight={800} />
      </Sequence>

      {/* Scene 3 — one line at a time */}
      <Sequence from={144} durationInFrames={46}>
        <Line text="The game has changed." in0={0} hold={22} size={70} />
      </Sequence>
      <Sequence from={190} durationInFrames={44}>
        <Line text="Talent isn't enough." in0={0} hold={20} size={70} />
      </Sequence>
      <Sequence from={234} durationInFrames={44}>
        <Line text="Hard work isn't enough." in0={0} hold={20} size={66} />
      </Sequence>
      <Sequence from={278} durationInFrames={46}>
        <Line text="Even results aren't enough." in0={0} hold={22} size={64} color={MUTED} />
      </Sequence>

      {/* Scene 4 */}
      <Sequence from={324} durationInFrames={50}>
        <Line text="Because talent without visibility gets ignored." in0={0} hold={26} size={56} />
      </Sequence>
      <Sequence from={374} durationInFrames={50}>
        <Line text="And opportunity doesn't always find the best player." in0={0} hold={26} size={52} />
      </Sequence>
      <Sequence from={424} durationInFrames={52}>
        <Line text="It finds the player" in0={0} hold={28} size={66} serifAccent="that's seen." />
      </Sequence>

      {/* Scene 5 */}
      <Sequence from={476} durationInFrames={44}>
        <Line text="That's the problem." in0={0} hold={22} size={72} />
      </Sequence>
      <Sequence from={520} durationInFrames={54}>
        <Line text="And that's why I'm building" in0={0} hold={30} size={60} serifAccent="something different." />
      </Sequence>

      {/* Scene 6 — logo */}
      <Sequence from={574} durationInFrames={80}>
        <LogoScene />
      </Sequence>

      {/* Final scene */}
      <Sequence from={654} durationInFrames={90}>
        <FinalScene />
      </Sequence>
    </AbsoluteFill>
  );
};
