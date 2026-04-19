import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

export const ReportScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleS = spring({ frame, fps, config: { damping: 18 } });
  const coachS = spring({ frame: frame - 18, fps, config: { damping: 20, stiffness: 140 } });
  const parentS = spring({ frame: frame - 38, fps, config: { damping: 20, stiffness: 140 } });
  const arrowS = spring({ frame: frame - 60, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #0A0E14 0%, #0D1117 100%)",
      fontFamily: body, padding: 80,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 50%, rgba(232,180,0,0.1), transparent 70%)",
      }} />

      {/* Title */}
      <div style={{
        marginTop: 100, textAlign: "center",
        opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(titleS, [0, 1], [30, 0])}px)`,
      }}>
        <div style={{
          fontFamily: body, fontWeight: 600, fontSize: 26, color: "#E8B400",
          letterSpacing: 5, textTransform: "uppercase", marginBottom: 18,
        }}>One click. Two reports.</div>
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 92, color: "#fff",
          lineHeight: 0.95, letterSpacing: -3,
        }}>
          Weekly Reports
        </div>
      </div>

      {/* Two cards side by side */}
      <div style={{ marginTop: 100, display: "flex", flexDirection: "column", gap: 36, alignItems: "center" }}>
        {/* Coach Report */}
        <div style={{
          width: "100%", maxWidth: 800,
          background: "linear-gradient(135deg, rgba(232,180,0,0.12), rgba(232,180,0,0.04))",
          border: "1px solid rgba(232,180,0,0.4)",
          borderRadius: 28, padding: 36,
          opacity: coachS, transform: `translateX(${interpolate(coachS, [0, 1], [-100, 0])}px)`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: "linear-gradient(135deg, #E8B400, #B8860B)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32,
            }}>📊</div>
            <div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: "#fff" }}>Coach Version</div>
              <div style={{ fontSize: 22, color: "rgba(255,255,255,0.5)" }}>Tactical · Detailed · Data-rich</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: body, fontSize: 22, color: "rgba(255,255,255,0.85)" }}>
            <div>✓ CPI breakdown by attribute</div>
            <div>✓ Specific drills + load adjustments</div>
            <div>✓ Comparison vs squad average</div>
          </div>
        </div>

        {/* Arrow */}
        <div style={{
          fontSize: 48, color: "#E8B400",
          opacity: arrowS, transform: `scale(${arrowS})`,
        }}>↓</div>

        {/* Parent Report */}
        <div style={{
          width: "100%", maxWidth: 800,
          background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.04))",
          border: "1px solid rgba(59,130,246,0.4)",
          borderRadius: 28, padding: 36,
          opacity: parentS, transform: `translateX(${interpolate(parentS, [0, 1], [100, 0])}px)`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: "linear-gradient(135deg, #3b82f6, #1e40af)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32,
            }}>👨‍👩‍👧</div>
            <div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 36, color: "#fff" }}>Parent Version</div>
              <div style={{ fontSize: 22, color: "rgba(255,255,255,0.5)" }}>Clear · Encouraging · Plain-language</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: body, fontSize: 22, color: "rgba(255,255,255,0.85)" }}>
            <div>✓ Wins of the week</div>
            <div>✓ What they're working on</div>
            <div>✓ How to support at home</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
