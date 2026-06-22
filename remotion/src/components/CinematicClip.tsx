import { AbsoluteFill, OffthreadVideo, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../theme";

// Cinematic footage wrapper: desaturated high-contrast color grade, slow push-in,
// dark vignette + optional yellow tint flash for "premium documentary" feel.
export const CinematicClip: React.FC<{
  src: string;
  startFrom?: number;
  playbackRate?: number;
  zoom?: [number, number]; // scale from/to over the clip
  durationInFrames: number;
  grade?: "cold" | "warm";
}> = ({ src, startFrom = 0, playbackRate = 1, zoom = [1.12, 1.22], durationInFrames, grade = "cold" }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, durationInFrames], zoom, { extrapolateRight: "clamp" });
  const fadeIn = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });

  const filter =
    grade === "cold"
      ? "saturate(0.6) contrast(1.18) brightness(0.82) hue-rotate(-6deg)"
      : "saturate(0.7) contrast(1.15) brightness(0.9)";

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden", opacity: fadeIn }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo
          src={src}
          startFrom={startFrom}
          playbackRate={playbackRate}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", filter }}
        />
      </AbsoluteFill>
      {/* tint */}
      <AbsoluteFill
        style={{
          background:
            grade === "cold"
              ? "linear-gradient(180deg, rgba(5,10,20,0.35), rgba(0,0,0,0.55))"
              : "linear-gradient(180deg, rgba(20,12,0,0.25), rgba(0,0,0,0.5))",
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.78) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Bottom-anchored impact caption used over footage.
export const ImpactCaption: React.FC<{
  children: React.ReactNode;
  delay?: number;
  highlight?: string;
  size?: number;
}> = ({ children, delay = 0, highlight, size = 78 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame, [delay, delay + 14], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 220 }}>
      <div
        style={{
          opacity: o,
          transform: `translateY(${y}px)`,
          maxWidth: 880,
          textAlign: "center",
          color: COLORS.white,
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1.05,
          letterSpacing: -1,
          textShadow: "0 6px 30px rgba(0,0,0,0.9)",
          padding: "0 40px",
        }}
      >
        {children}
        {highlight && (
          <div style={{ color: COLORS.yellow, marginTop: 6, textShadow: `0 0 30px ${COLORS.yellow}` }}>
            {highlight}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
