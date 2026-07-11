import { AbsoluteFill, Img, staticFile, OffthreadVideo, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: display } = loadJakarta("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
export const { fontFamily: body } = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

export const BG = "#0A0A0A";
export const YELLOW = "#FCD34D";
export const WHITE = "#F5F5F5";
export const MUTED = "rgba(245,245,245,0.6)";

export const glow = (c: string, s = 26) => `0 0 ${s}px ${c}, 0 0 ${s * 2}px ${c}44`;

// ---- Cohesive grade + film grain shared by every shot ----
const GRADE = "saturate(0.78) contrast(1.1) brightness(0.9) sepia(0.12)";

export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.08 }) => {
  const frame = useCurrentFrame();
  const shift = (frame * 7) % 12;
  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
        backgroundImage:
          "repeating-radial-gradient(circle at 30% 20%, rgba(255,255,255,0.09) 0px, transparent 1px, transparent 2px), repeating-radial-gradient(circle at 70% 80%, rgba(0,0,0,0.12) 0px, transparent 1px, transparent 3px)",
        transform: `translate(${shift}px, ${-shift}px)`,
      }}
    />
  );
};

// ---- Ken Burns photo with warm desaturated grade + grain ----
export const PhotoBG: React.FC<{
  src: string;
  duration: number;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
  overlay?: number;
  align?: "top" | "center" | "bottom";
}> = ({ src, duration, zoomFrom = 1.06, zoomTo = 1.2, panX = 0, panY = 0, overlay = 0.6, align = "center" }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [zoomFrom, zoomTo], { extrapolateRight: "clamp" });
  const tx = interpolate(frame, [0, duration], [0, panX], { extrapolateRight: "clamp" });
  const ty = interpolate(frame, [0, duration], [0, panY], { extrapolateRight: "clamp" });
  const objectPos = align === "top" ? "50% 22%" : align === "bottom" ? "50% 78%" : "50% 50%";
  return (
    <AbsoluteFill style={{ backgroundColor: BG, overflow: "hidden" }}>
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
          filter: GRADE,
        }}
      />
      {/* warm tint to unify mixed photos */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(30,20,8,0.18), rgba(10,10,10,0.05))", mixBlendMode: "soft-light" }} />
      {/* readability gradient */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(10,10,10,${overlay * 0.5}) 0%, rgba(10,10,10,${overlay * 0.7}) 55%, rgba(10,10,10,${Math.min(overlay + 0.22, 0.97)}) 100%)`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 44%, rgba(0,0,0,0.55) 100%)" }} />
      <FilmGrain />
    </AbsoluteFill>
  );
};

// Fade helper for clean cut/fade only transitions
export const useFade = (dur: number, inLen = 14, outLen = 14) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, inLen, dur - outLen, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

export const useRise = (delay = 0, distance = 44) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 90 } });
  return { opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateY(${interpolate(s, [0, 1], [distance, 0])}px)` };
};

// Big bottom-anchored caption
export const Caption: React.FC<{
  children: React.ReactNode;
  highlight?: React.ReactNode;
  delay?: number;
  size?: number;
  align?: "left" | "center";
  bottom?: number;
}> = ({ children, highlight, delay = 0, size = 84, align = "left", bottom = 240 }) => {
  const { opacity, transform } = useRise(delay, 46);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: align === "center" ? "center" : "flex-start", padding: `0 88px ${bottom}px` }}>
      <div style={{ opacity, transform, maxWidth: 920, textAlign: align, color: WHITE, fontFamily: display, fontWeight: 800, fontSize: size, lineHeight: 1.05, letterSpacing: -1.5, textShadow: "0 10px 44px rgba(0,0,0,0.9)" }}>
        {children}
        {highlight && <div style={{ color: YELLOW, marginTop: 12, textShadow: glow(YELLOW, 20) }}>{highlight}</div>}
      </div>
    </AbsoluteFill>
  );
};

// Spring count-up number
export const CountUp: React.FC<{ from: number; to: number; delay?: number; suffix?: string; prefix?: string; decimals?: number }> = ({ from, to, delay = 0, suffix = "", prefix = "", decimals = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 70, mass: 1.1 } });
  const v = interpolate(s, [0, 1], [from, to]);
  return <>{prefix}{v.toFixed(decimals)}{suffix}</>;
};
