import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: display } = loadJakarta("normal", { weights: ["600", "700", "800"], subsets: ["latin"] });
export const { fontFamily: body } = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

export const NAVY = "#0A0C12";
export const NAVY_2 = "#121722";
export const PANEL = "rgba(255,255,255,0.045)";
export const LINE = "rgba(255,255,255,0.09)";
export const GOLD = "#FCD34D";
export const GOLD_DEEP = "#E8B400";
export const IVORY = "#F5F5F5";
export const MUTED = "rgba(245,245,245,0.52)";
export const GREEN = "#34D399";
export const AMBER = "#FBBF24";

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

/** Standard entrance: fade + rise + blur-off */
export const useEnter = (delay: number, damping = 20, stiffness = 140) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping, stiffness } });
  return {
    s,
    style: {
      opacity: s,
      transform: `translateY(${interpolate(s, [0, 1], [34, 0])}px)`,
      filter: `blur(${interpolate(s, [0, 1], [8, 0])}px)`,
    } as React.CSSProperties,
  };
};

export const ease = (frame: number, from: number, to: number, a = 0, b = 1) =>
  interpolate(frame, [from, to], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE });

export const SceneShell: React.FC<{
  children: React.ReactNode;
  duration: number;
  bg?: string;
  padTop?: number;
}> = ({ children, duration, bg = NAVY, padTop = 0 }) => {
  const frame = useCurrentFrame();
  const inO = ease(frame, 0, 10);
  const outO = interpolate(frame, [duration - 10, duration - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: bg, opacity: Math.min(inO, outO), paddingTop: padTop }}>
      {children}
    </AbsoluteFill>
  );
};

/** Caption block anchored near the bottom */
export const Caption: React.FC<{
  delay: number;
  lines: (string | { t: string; gold?: boolean })[];
  size?: number;
  bottom?: number;
}> = ({ delay, lines, size = 52, bottom = 170 }) => {
  const { style } = useEnter(delay, 22, 120);
  return (
    <div
      style={{
        position: "absolute",
        bottom,
        left: 80,
        right: 80,
        textAlign: "left",
        fontFamily: display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.18,
        letterSpacing: -1.2,
        color: IVORY,
        ...style,
      }}
    >
      {lines.map((l, i) => {
        const o = typeof l === "string" ? { t: l } : l;
        return (
          <div key={i} style={{ color: o.gold ? GOLD : IVORY }}>
            {o.t}
          </div>
        );
      })}
    </div>
  );
};

export const Panel: React.FC<{
  delay: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  glow?: boolean;
}> = ({ delay, children, style, glow }) => {
  const { style: enter } = useEnter(delay, 22, 160);
  return (
    <div
      style={{
        background: `linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025))`,
        border: `1px solid ${glow ? "rgba(252,211,77,0.35)" : LINE}`,
        borderRadius: 26,
        padding: 26,
        boxShadow: glow ? "0 0 60px rgba(252,211,77,0.10)" : "0 24px 60px rgba(0,0,0,0.45)",
        ...enter,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Label: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = MUTED }) => (
  <div
    style={{
      fontFamily: body,
      fontWeight: 700,
      fontSize: 19,
      letterSpacing: 3,
      textTransform: "uppercase",
      color,
    }}
  >
    {children}
  </div>
);

export const CountUp: React.FC<{
  from: number;
  to: number;
  start: number;
  dur?: number;
  decimals?: number;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ from, to, start, dur = 28, decimals = 0, suffix = "", style }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [start, start + dur], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return (
    <span style={style}>
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export const StatBar: React.FC<{
  label: string;
  value: number; // 0..1
  color: string;
  delay: number;
  width?: number;
}> = ({ label, value, color, delay, width = 100 }) => {
  const frame = useCurrentFrame();
  const w = ease(frame, delay, delay + 26) * value;
  const o = ease(frame, delay - 4, delay + 8);
  return (
    <div style={{ opacity: o, marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: body,
          fontSize: 22,
          fontWeight: 600,
          color: IVORY,
          marginBottom: 8,
        }}
      >
        <span>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{Math.round(w * 100)}</span>
      </div>
      <div style={{ height: 10, borderRadius: 8, background: "rgba(255,255,255,0.08)", width: `${width}%` }}>
        <div style={{ height: 10, borderRadius: 8, width: `${w * 100}%`, background: color }} />
      </div>
    </div>
  );
};

export const Chip: React.FC<{ children: React.ReactNode; delay: number; color?: string }> = ({
  children,
  delay,
  color = GOLD,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 200 } });
  return (
    <div
      style={{
        display: "inline-block",
        padding: "10px 18px",
        borderRadius: 999,
        border: `1px solid ${color}55`,
        background: `${color}14`,
        color,
        fontFamily: body,
        fontWeight: 700,
        fontSize: 21,
        opacity: s,
        transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`,
        marginRight: 10,
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
};

/** Character-by-character type-on */
export const TypeOn: React.FC<{ text: string; start: number; cps?: number; style?: React.CSSProperties }> = ({
  text,
  start,
  cps = 1.6,
  style,
}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor((frame - start) * cps));
  return <span style={style}>{text.slice(0, n)}</span>;
};

/** Persistent grain + vignette + scanline drift */
export const Atmosphere: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 38%, rgba(255,255,255,0.055) 0%, rgba(0,0,0,0) 55%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.72) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.05,
          transform: `translateY(${(frame * 0.6) % 6}px)`,
          background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.7) 0px, rgba(255,255,255,0) 2px, rgba(255,255,255,0) 6px)",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.07,
          mixBlendMode: "overlay",
          background:
            "repeating-radial-gradient(circle at 30% 20%, rgba(255,255,255,0.6) 0px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 3px)",
          transform: `translate(${(frame % 5) - 2}px, ${(frame % 3) - 1}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Simple top-down pitch used as a footage stand-in */
export const MiniPitch: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <svg viewBox="0 0 300 190" style={{ width: "100%", height: "100%", opacity }}>
    <rect x="0" y="0" width="300" height="190" fill="#101c17" />
    <g stroke="rgba(255,255,255,0.22)" strokeWidth="1.4" fill="none">
      <rect x="10" y="10" width="280" height="170" />
      <line x1="150" y1="10" x2="150" y2="180" />
      <circle cx="150" cy="95" r="30" />
      <rect x="10" y="55" width="42" height="80" />
      <rect x="248" y="55" width="42" height="80" />
    </g>
    {[...Array(9)].map((_, i) => (
      <rect key={i} x={i * 34} y="0" width="17" height="190" fill="rgba(255,255,255,0.018)" />
    ))}
  </svg>
);
