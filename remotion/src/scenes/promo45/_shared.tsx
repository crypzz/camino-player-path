import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
export const { fontFamily: body } = loadInter("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });

export const BG = "#0a0a0a";
export const CARD = "#1a1a1a";
export const CARD_2 = "#222222";
export const YELLOW = "#FCD34D";
export const YELLOW_DEEP = "#F59E0B";
export const WHITE = "#ffffff";
export const MUTED = "rgba(255,255,255,0.55)";
export const LINE = "rgba(255,255,255,0.08)";

export const glow = (c: string, s = 30) => `0 0 ${s}px ${c}, 0 0 ${s * 2}px ${c}66`;

// ---------- Animation helpers ----------
export const useFadeIn = (delay = 0, dur = 12) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

export const useRise = (delay = 0, distance = 30) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18 } });
  return { opacity: s, transform: `translateY(${interpolate(s, [0, 1], [distance, 0])}px)` };
};

export const CountUp: React.FC<{ to: number; delay?: number; dur?: number; decimals?: number; suffix?: string }> = ({
  to,
  delay = 0,
  dur = 24,
  decimals = 0,
  suffix = "",
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = 1 - Math.pow(1 - p, 3);
  const v = eased * to;
  return <>{v.toFixed(decimals)}{suffix}</>;
};

// ---------- Phone frame ----------
export const Phone: React.FC<{
  children: React.ReactNode;
  width?: number;
  style?: React.CSSProperties;
}> = ({ children, width = 540, style }) => {
  const height = width * (19.5 / 9);
  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * 0.13,
        background: "#000",
        border: "8px solid #2a2a2a",
        boxShadow: "0 40px 100px -20px rgba(0,0,0,0.9), inset 0 0 0 2px rgba(255,255,255,0.04)",
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
    >
      {/* status bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: width * 0.09,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `0 ${width * 0.07}px`,
          zIndex: 30,
          color: WHITE,
          fontFamily: body,
          fontSize: width * 0.038,
          fontWeight: 700,
        }}
      >
        <span>9:41</span>
        <span style={{ display: "flex", gap: 6, alignItems: "center", opacity: 0.85 }}>
          <span>📶</span>
          <span>🔋</span>
        </span>
      </div>
      {/* notch */}
      <div
        style={{
          position: "absolute",
          top: width * 0.03,
          left: "50%",
          transform: "translateX(-50%)",
          width: width * 0.32,
          height: width * 0.045,
          background: "#000",
          borderRadius: 999,
          zIndex: 40,
        }}
      />
      <AbsoluteFill style={{ background: BG }}>{children}</AbsoluteFill>
    </div>
  );
};

export const Overlay: React.FC<{
  children: React.ReactNode;
  highlight?: React.ReactNode;
  delay?: number;
  size?: number;
  bottom?: number;
}> = ({ children, highlight, delay = 0, size = 70, bottom = 150 }) => {
  const { opacity, transform } = useRise(delay, 36);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: bottom }}>
      <div
        style={{
          opacity,
          transform,
          textAlign: "center",
          color: WHITE,
          fontFamily: display,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1.05,
          letterSpacing: -1,
          padding: "0 60px",
          textShadow: "0 8px 40px rgba(0,0,0,0.8)",
        }}
      >
        {children}
        {highlight && (
          <div style={{ color: YELLOW, marginTop: 8, textShadow: glow(YELLOW, 24) }}>{highlight}</div>
        )}
      </div>
    </AbsoluteFill>
  );
};
