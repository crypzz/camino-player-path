import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";

const { fontFamily } = loadFont("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
const { fontFamily: serif } = loadSerif("normal", { weights: ["400"], subsets: ["latin"] });

const WHITE = "#F4F4F2";
const MUTED = "rgba(244,244,242,0.55)";
const YELLOW = "#FCD34D";

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

// Instant-appear card (hard cut in). Subtle drift while on screen. Quick fade out at end.
const Card: React.FC<{
  children: React.ReactNode;
  duration: number;
  outFade?: number; // frames of fade out at end; 0 = hard cut
  size?: number;
  weight?: number;
  align?: "center" | "flex-start";
}> = ({ children, duration, outFade = 0, size = 78, weight = 800, align = "center" }) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, duration], [0, -6]);
  const opacity = outFade > 0
    ? interpolate(frame, [duration - outFade, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  return (
    <AbsoluteFill style={{ justifyContent: align, alignItems: "center", padding: "0 90px", opacity }}>
      <div
        style={{
          fontFamily,
          fontSize: size,
          fontWeight: weight,
          color: WHITE,
          lineHeight: 1.15,
          letterSpacing: "-0.025em",
          textAlign: "center",
          transform: `translateY(${drift}px)`,
        }}
      >
        {children}
      </div>
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
            fontSize: 130,
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
          The path to being seen.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [18, 46], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", opacity, padding: "0 80px" }}>
        <div style={{ fontFamily, fontSize: 78, fontWeight: 800, color: WHITE, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          The path to being <span style={{ color: YELLOW }}>seen.</span>
        </div>
        <div
          style={{
            width: `${lineW}%`,
            maxWidth: 260,
            height: 2,
            backgroundColor: "rgba(244,244,242,0.35)",
            margin: "36px auto",
          }}
        />
        <div style={{ fontFamily, fontSize: 34, fontWeight: 500, color: MUTED, lineHeight: 1.4 }}>
          Save this for a parent who needs it.
        </div>
        <div
          style={{
            fontFamily,
            fontSize: 32,
            fontWeight: 700,
            color: WHITE,
            marginTop: 26,
            letterSpacing: "0.04em",
          }}
        >
          @caminodevelopment
        </div>
      </div>
    </AbsoluteFill>
  );
};

// timings @30fps
// S1 0-90, S2 90-180, S3 180-270, S4 270-360, S5 360-510, S6 510-600, S7 600-660
export const FounderStatementV2: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Backdrop />

      {/* S1 0:00–0:03 — instant hook */}
      <Sequence from={0} durationInFrames={90}>
        <Card duration={90} size={82}>Your kid trains for years.</Card>
      </Sequence>

      {/* S2 0:03–0:06 — hard cut, yellow emphasis */}
      <Sequence from={90} durationInFrames={90}>
        <Card duration={90} size={68}>
          But no one's tracking if they're{" "}
          <span style={{ color: YELLOW, fontWeight: 800 }}>actually improving.</span>
        </Card>
      </Sequence>

      {/* S3 0:06–0:09 — italic serif emphasis, trailing em-dash */}
      <Sequence from={180} durationInFrames={90}>
        <Card duration={90} size={64} weight={700}>
          And the scouts who could{" "}
          <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400 }}>change everything</span>
          <span>—</span>
        </Card>
      </Sequence>

      {/* S4 0:09–0:12 — punch line, larger */}
      <Sequence from={270} durationInFrames={90}>
        <Card duration={90} size={104} weight={800}>—never see it.</Card>
      </Sequence>

      {/* S5 0:12–0:17 — thesis, longest & largest */}
      <Sequence from={360} durationInFrames={150}>
        <Card duration={150} size={72} weight={800} outFade={14}>
          Camino connects the two — a{" "}
          <span style={{ color: YELLOW }}>tracked development path</span>, straight to the{" "}
          <span style={{ color: YELLOW }}>scouts watching.</span>
        </Card>
      </Sequence>

      {/* S6 0:17–0:20 — logo */}
      <Sequence from={510} durationInFrames={90}>
        <LogoScene />
      </Sequence>

      {/* S7 0:20–0:22 — CTA */}
      <Sequence from={600} durationInFrames={60}>
        <FinalScene />
      </Sequence>
    </AbsoluteFill>
  );
};
