import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const WHITE = "#FFFFFF";

const Stat: React.FC<{ label: string; target: number; suffix?: string; delay: number }> = ({ label, target, suffix = "", delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 22 } });
  const op = interpolate(s, [0, 1], [0, 1]);
  const y = interpolate(s, [0, 1], [30, 0]);
  const val = Math.round(interpolate(frame, [delay, delay + 40], [0, target], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <div style={{
      flex: 1, padding: "28px 20px", borderRadius: 22,
      background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
      border: "1px solid rgba(255,255,255,0.08)",
      opacity: op, transform: `translateY(${y}px)`, textAlign: "center",
    }}>
      <div style={{
        fontFamily, fontWeight: 800, fontSize: 76, color: GOLD,
        letterSpacing: "-0.04em", lineHeight: 1,
      }}>
        {val.toLocaleString()}{suffix}
      </div>
      <div style={{
        fontFamily: bodyFont, fontWeight: 700, fontSize: 18, color: "rgba(255,255,255,0.65)",
        letterSpacing: "0.22em", marginTop: 12,
      }}>{label}</div>
    </div>
  );
};

export const BagsTractionScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame, fps, config: { damping: 22 } });
  const titleOp = interpolate(titleS, [0, 1], [0, 1]);
  const titleY = interpolate(titleS, [0, 1], [24, 0]);

  const arrowS = spring({ frame: frame - 70, fps, config: { damping: 14 } });
  const arrowOp = interpolate(arrowS, [0, 1], [0, 1]);
  const arrowScale = interpolate(arrowS, [0, 1], [0.6, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
      <div style={{
        fontFamily: bodyFont, fontWeight: 700, fontSize: 24, color: GOLD,
        letterSpacing: "0.32em", marginBottom: 14, opacity: titleOp, transform: `translateY(${titleY}px)`,
      }}>REAL TRACTION</div>

      <div style={{
        fontFamily, fontWeight: 800, fontSize: 72, color: WHITE,
        letterSpacing: "-0.03em", marginBottom: 50, textAlign: "center",
        opacity: titleOp, transform: `translateY(${titleY}px)`, lineHeight: 1.05,
      }}>
        Already shipping.
      </div>

      <div style={{ display: "flex", gap: 18, width: "100%", maxWidth: 940 }}>
        <Stat label="PLAYERS" target={1240} delay={10} />
        <Stat label="ACADEMIES" target={36} delay={18} />
      </div>
      <div style={{ display: "flex", gap: 18, width: "100%", maxWidth: 940, marginTop: 18 }}>
        <Stat label="VIDEOS ANALYZED" target={4800} delay={28} />
        <Stat label="COUNTRIES" target={9} delay={38} />
      </div>

      <div style={{
        marginTop: 50, opacity: arrowOp, transform: `scale(${arrowScale})`,
        display: "flex", alignItems: "center", gap: 14,
        fontFamily, fontWeight: 800, fontSize: 44, color: GOLD,
        letterSpacing: "-0.02em",
      }}>
        Growth trajectory <span style={{ fontSize: 56 }}>↗</span>
      </div>
    </AbsoluteFill>
  );
};
