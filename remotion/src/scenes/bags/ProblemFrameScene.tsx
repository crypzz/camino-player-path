import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const ChaosCard = ({ title, lines, delay, rotate }: { title: string; lines: string[]; delay: number; rotate: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 13, stiffness: 130 } });
  const o = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(s, [0, 1], [60, 0]);
  // Shake effect
  const shake = Math.sin(frame * 0.4) * 1.5;

  return (
    <div style={{
      width: 360, padding: "22px 26px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14,
      transform: `translateY(${y}px) rotate(${rotate + shake * 0.1}deg)`,
      opacity: o,
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    }}>
      <div style={{
        fontFamily: body, fontSize: 18, fontWeight: 700, color: "#FF6B6B",
        textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 14,
      }}>
        {title}
      </div>
      {lines.map((l, i) => (
        <div key={i} style={{
          fontFamily: body, fontSize: 18, color: "#8B92A3", marginBottom: 6,
          fontFamily: i % 2 === 0 ? body : "monospace",
        }}>
          {l}
        </div>
      ))}
    </div>
  );
};

export const ProblemFrameScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame, fps, config: { damping: 14 } });
  const titleO = interpolate(titleS, [0, 1], [0, 1]);
  const titleY = interpolate(titleS, [0, 1], [-30, 0]);

  // Cross-out at end
  const strikeW = interpolate(frame, [110, 140], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12", justifyContent: "center", alignItems: "center" }}>
      <div style={{
        textAlign: "center", marginBottom: 50,
        opacity: titleO, transform: `translateY(${titleY}px)`,
      }}>
        <div style={{
          fontFamily: display, fontSize: 88, fontWeight: 800, color: "#FFFFFF",
          letterSpacing: "-0.03em", position: "relative", display: "inline-block",
        }}>
          Academies run on <span style={{ color: "#FF6B6B", position: "relative" }}>
            chaos
            <div style={{
              position: "absolute", left: 0, top: "55%",
              width: `${strikeW}%`, height: 6,
              background: "#E8B400", borderRadius: 3,
            }} />
          </span>.
        </div>
      </div>
      <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
        <ChaosCard
          title="Spreadsheets"
          lines={["U12_stats_FINAL_v3.xlsx", "row 47: missing", "row 88: #REF!", "last edit: 3 wks ago"]}
          delay={6} rotate={-3}
        />
        <ChaosCard
          title="WhatsApp Groups"
          lines={["Coach: 'send video pls'", "Parent: 'which one?'", "[14 unread images]", "video.mov (89.4 MB)"]}
          delay={14} rotate={2}
        />
        <ChaosCard
          title="Lost Footage"
          lines={["DCIM_4471.mp4", "from someone's phone", "no tags. no players.", "no one will ever see"]}
          delay={22} rotate={-2}
        />
      </div>
    </AbsoluteFill>
  );
};
