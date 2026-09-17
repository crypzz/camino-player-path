import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: display } = loadJakarta("normal", {
  weights: ["700", "800"],
  subsets: ["latin"],
});
export const { fontFamily: body } = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const BG = "#0a0a0a";
export const PANEL = "#121212";
export const GOLD = "#FCD34D";
export const GOLD_DEEP = "#F59E0B";
export const WHITE = "#FFFFFF";
export const MUTED = "#8a8a8a";
export const DULL = "#5c5c5c";
export const LINE = "rgba(255,255,255,0.08)";

export const glow = (color: string, strength = 40) =>
  `0 0 ${strength}px ${color}, 0 0 ${strength * 2}px ${color}`;

// Vignette + film grain shell used by every scene
export const Shell: React.FC<{ children: React.ReactNode; dull?: boolean }> = ({
  children,
  dull = false,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: body }}>
      <AbsoluteFill
        style={{
          background: dull
            ? "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 60%)"
            : "radial-gradient(ellipse at 50% 40%, rgba(252,211,77,0.10) 0%, rgba(0,0,0,0) 62%)",
        }}
      />
      {children}
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* grain */}
      <AbsoluteFill
        style={{
          opacity: 0.07,
          mixBlendMode: "overlay",
          pointerEvents: "none",
          transform: `translate(${(frame % 3) - 1}px, ${(frame % 5) - 2}px)`,
          background:
            "repeating-radial-gradient(circle, rgba(255,255,255,0.18) 0px, transparent 1px, transparent 2px)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode; opacity?: number; color?: string }> = ({
  children,
  opacity = 1,
  color = GOLD,
}) => (
  <div
    style={{
      display: "inline-block",
      padding: "10px 22px",
      borderRadius: 999,
      border: `1px solid ${color}`,
      backgroundColor: `${color}1f`,
      color,
      fontFamily: body,
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: 3,
      textTransform: "uppercase",
      opacity,
    }}
  >
    {children}
  </div>
);

export const Caption: React.FC<{ children: React.ReactNode; opacity?: number }> = ({
  children,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      bottom: 180,
      left: 0,
      right: 0,
      textAlign: "center",
      padding: "0 90px",
      fontFamily: body,
      fontWeight: 600,
      fontSize: 40,
      lineHeight: 1.35,
      color: "rgba(255,255,255,0.88)",
      opacity,
    }}
  >
    {children}
  </div>
);

export const fadeInOut = (frame: number, duration: number, len = 12) =>
  Math.min(
    interpolate(frame, [0, len], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [duration - len, duration], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
