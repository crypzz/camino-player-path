import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: bebas } = loadFont();
const { fontFamily: inter } = loadInter();

const BG = "#0A0E1A";
const GOLD = "#E8B400";
const BLUE = "#2B7FE8";
const GREEN = "#1DB870";
const RED = "#EF4444";
const PURPLE = "#A855F7";

const EVENT_DOTS = [
  { pct: 12, color: BLUE, label: "Touch" },
  { pct: 22, color: GREEN, label: "Pass" },
  { pct: 35, color: GOLD, label: "Shot" },
  { pct: 41, color: RED, label: "Foul" },
  { pct: 55, color: GREEN, label: "Pass" },
  { pct: 62, color: BLUE, label: "Touch" },
  { pct: 71, color: GOLD, label: "Goal" },
  { pct: 85, color: PURPLE, label: "Assist" },
];

const BUTTONS = ["Touch", "Pass", "Shot", "Goal", "Tackle", "Foul"];
const BTN_COLORS: Record<string, string> = { Touch: BLUE, Pass: GREEN, Shot: GOLD, Goal: "#F59E0B", Tackle: "#6366F1", Foul: RED };

export const VATimelineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline bar entrance
  const barSpring = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const barW = interpolate(barSpring, [0, 1], [0, 100]);

  // Scrubber moves along
  const scrubberPct = interpolate(frame, [20, 120], [5, 75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Title
  const titleOp = interpolate(frame, [110, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(spring({ frame: frame - 110, fps, config: { damping: 16 } }), [0, 1], [30, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, gap: 40 }}>
        {/* Player select mock */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
        }}>
          <div style={{
            width: 50, height: 50, borderRadius: "50%", backgroundColor: BLUE + "33",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: inter, fontSize: 18, color: BLUE, fontWeight: 700,
          }}>7</div>
          <div style={{ fontFamily: inter, fontSize: 24, color: "white", fontWeight: 600 }}>Carlos Mendoza</div>
        </div>

        {/* Timeline bar */}
        <div style={{
          width: `${barW}%`, maxWidth: 850, height: 48, backgroundColor: "#1F2937",
          borderRadius: 12, position: "relative", overflow: "visible",
        }}>
          {/* Progress fill */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: 12,
            width: `${scrubberPct}%`, backgroundColor: BLUE + "22",
          }} />

          {/* Scrubber */}
          <div style={{
            position: "absolute", top: 0, bottom: 0, width: 3, backgroundColor: BLUE,
            left: `${scrubberPct}%`, zIndex: 20,
          }}>
            <div style={{
              position: "absolute", top: -6, left: -8, width: 19, height: 19,
              borderRadius: "50%", backgroundColor: BLUE, border: "3px solid #0A0E1A",
            }} />
          </div>

          {/* Event dots */}
          {EVENT_DOTS.map((dot, i) => {
            const dotDelay = 15 + i * 8;
            const dotSpring = spring({ frame: frame - dotDelay, fps, config: { damping: 10, stiffness: 200 } });
            const dotScale = interpolate(dotSpring, [0, 1], [0, 1]);
            return (
              <div key={i} style={{
                position: "absolute", top: "50%", transform: `translateY(-50%) scale(${dotScale})`,
                left: `${dot.pct}%`, width: 16, height: 16, borderRadius: "50%",
                backgroundColor: dot.color, border: "2px solid #0A0E1A", zIndex: 10,
              }} />
            );
          })}
        </div>

        {/* Event buttons row */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          {BUTTONS.map((btn, i) => {
            const btnDelay = 50 + i * 6;
            const btnSpring = spring({ frame: frame - btnDelay, fps, config: { damping: 14, stiffness: 180 } });
            const btnScale = interpolate(btnSpring, [0, 1], [0.7, 1]);
            const btnOp = interpolate(frame, [btnDelay, btnDelay + 6], [0, 1], { extrapolateRight: "clamp" });
            const c = BTN_COLORS[btn] || "#6B7280";
            // Flash effect on the "Goal" button
            const isGoal = btn === "Goal";
            const flashOp = isGoal ? interpolate(frame, [90, 95, 100], [0, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
            return (
              <div key={btn} style={{
                fontFamily: inter, fontSize: 20, fontWeight: 600, color: "white",
                backgroundColor: c + "22", border: `1px solid ${c}55`,
                padding: "12px 28px", borderRadius: 10,
                transform: `scale(${btnScale})`, opacity: btnOp,
                boxShadow: flashOp > 0 ? `0 0 30px ${c}${Math.round(flashOp * 255).toString(16).padStart(2, "0")}` : "none",
              }}>
                {btn}
              </div>
            );
          })}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: bebas, fontSize: 64, color: GOLD, letterSpacing: 4,
          opacity: titleOp, transform: `translateY(${titleY}px)`,
        }}>
          TAG EVERY MOMENT.
        </div>
      </div>
    </AbsoluteFill>
  );
};
