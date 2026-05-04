import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";
import { PhotoBG, display, body, GOLD, IVORY } from "./_shared";

const DUR = 150;

const Beat: React.FC<{ from: number; img: string; label: string; align?: "top" | "center" | "bottom" }> = ({ from, img, label, align }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - from;
  const s = spring({ frame: local - 2, fps, config: { damping: 22 } });
  const o = interpolate(s, [0, 1], [0, 1]);
  const y = interpolate(s, [0, 1], [20, 0]);
  return (
    <AbsoluteFill>
      <PhotoBG src={img} duration={50} zoomFrom={1.12} zoomTo={1.25} panY={10} overlayStrength={0.72} align={align} />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: "0 80px 240px" }}>
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 72, lineHeight: 1,
          color: IVORY, textAlign: "center", letterSpacing: "-0.03em",
          opacity: o, transform: `translateY(${y}px)`,
          textShadow: "0 4px 30px rgba(0,0,0,0.7)",
        }}>{label}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ESCTensionScene = () => {
  const frame = useCurrentFrame();

  const headerO = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [DUR - 12, DUR], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Sequence from={0} durationInFrames={50}>
        <Beat from={0} img="aio/problem-notes.jpg" label="Lost notebooks." />
      </Sequence>
      <Sequence from={50} durationInFrames={50}>
        <Beat from={0} img="aio/role-coach.jpg" label="Group chat chaos." align="top" />
      </Sequence>
      <Sequence from={100} durationInFrames={50}>
        <Beat from={0} img="aio/videoai-match.jpg" label="Clips going nowhere." />
      </Sequence>

      {/* persistent top label */}
      <AbsoluteFill style={{ alignItems: "center", padding: "120px 60px 0", justifyContent: "flex-start", pointerEvents: "none" }}>
        <div style={{
          fontFamily: body, fontWeight: 700, fontSize: 22, letterSpacing: 4,
          color: GOLD, textTransform: "uppercase", opacity: headerO,
        }}>
          The Grind Is Invisible
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
