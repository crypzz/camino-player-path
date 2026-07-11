import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: display } = loadJakarta("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
export const { fontFamily: body } = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

export const NAVY = "#0A0C12";
export const GOLD = "#E8B400";
export const IVORY = "#F5F5F5";
export const MUTED = "rgba(245,245,245,0.62)";

export const glow = (c: string, s = 30) => `0 0 ${s}px ${c}, 0 0 ${s * 2}px ${c}55`;

// Cinematic Ken-Burns photo with navy documentary grade + film grain.
export const PhotoBG: React.FC<{
  src: string;
  duration: number;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
  overlay?: number;
  align?: "top" | "center" | "bottom";
  grade?: "cold" | "warm";
}> = ({ src, duration, zoomFrom = 1.06, zoomTo = 1.2, panX = 0, panY = 0, overlay = 0.6, align = "center", grade = "cold" }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [zoomFrom, zoomTo], { extrapolateRight: "clamp" });
  const tx = interpolate(frame, [0, duration], [0, panX], { extrapolateRight: "clamp" });
  const ty = interpolate(frame, [0, duration], [0, panY], { extrapolateRight: "clamp" });
  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const objectPos = align === "top" ? "50% 22%" : align === "bottom" ? "50% 78%" : "50% 50%";
  const filter =
    grade === "cold"
      ? "saturate(0.72) contrast(1.14) brightness(0.86) hue-rotate(-4deg)"
      : "saturate(0.85) contrast(1.12) brightness(0.92)";
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, overflow: "hidden", opacity: fadeIn }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: objectPos,
          transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
          filter,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(10,12,18,${overlay * 0.5}) 0%, rgba(10,12,18,${overlay * 0.75}) 55%, rgba(10,12,18,${Math.min(overlay + 0.2, 0.96)}) 100%)`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.6) 100%)" }} />
      <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay", background: "repeating-radial-gradient(circle, rgba(255,255,255,0.06) 0px, transparent 1px, transparent 2px)" }} />
    </AbsoluteFill>
  );
};

export const useRise = (delay = 0, distance = 40) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 90 } });
  return { opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateY(${interpolate(s, [0, 1], [distance, 0])}px)` };
};

export const Kicker: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const { opacity, transform } = useRise(delay, 24);
  return (
    <div style={{ opacity, transform, display: "inline-block", padding: "10px 22px", borderRadius: 999, border: `1px solid ${GOLD}`, background: "rgba(232,180,0,0.1)", color: GOLD, fontFamily: body, fontWeight: 700, fontSize: 26, letterSpacing: 4, textTransform: "uppercase" }}>
      {children}
    </div>
  );
};

// Bottom-anchored documentary caption.
export const Caption: React.FC<{
  children: React.ReactNode;
  highlight?: React.ReactNode;
  delay?: number;
  size?: number;
  align?: "left" | "center";
}> = ({ children, highlight, delay = 0, size = 86, align = "left" }) => {
  const { opacity, transform } = useRise(delay, 46);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: align === "center" ? "center" : "flex-start", padding: "0 90px 260px" }}>
      <div style={{ opacity, transform, maxWidth: 920, textAlign: align, color: IVORY, fontFamily: display, fontWeight: 800, fontSize: size, lineHeight: 1.04, letterSpacing: -1.5, textShadow: "0 10px 44px rgba(0,0,0,0.85)" }}>
        {children}
        {highlight && <div style={{ color: GOLD, marginTop: 10, textShadow: glow(GOLD, 22) }}>{highlight}</div>}
      </div>
    </AbsoluteFill>
  );
};
