import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

const features = [
  {
    title: "Player Profile",
    desc: "A structured, shareable profile showcasing stats, history, and highlights.",
    mockContent: [
      { l: "Position", v: "Central Midfielder" },
      { l: "CPI Score", v: "78 / 100" },
      { l: "Preferred Foot", v: "Right" },
      { l: "Club", v: "Metro FC Academy" },
    ],
  },
  {
    title: "Highlight Clips",
    desc: "Organize and showcase your best moments in a professional reel.",
    mockContent: [
      { l: "Goals", v: "12 clips" },
      { l: "Assists", v: "8 clips" },
      { l: "Defensive", v: "5 clips" },
      { l: "Skills", v: "15 clips" },
    ],
  },
  {
    title: "Video Uploads",
    desc: "Upload match footage and training videos to build your portfolio.",
    mockContent: [
      { l: "Match vs. City FC", v: "Full game" },
      { l: "Training Session", v: "Jun 12" },
      { l: "Cup Semifinal", v: "Highlights" },
      { l: "1v1 Drills", v: "Skills" },
    ],
  },
];

export const ProFeaturesScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeOut = interpolate(frame, [420, 450], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(165deg, #0D1117 0%, #0F172A 50%, #0D1117 100%)",
      justifyContent: "center", alignItems: "center",
    }}>
      <div style={{ opacity: fadeOut, width: "100%", padding: "0 80px" }}>
        {/* Section title */}
        <div style={{
          textAlign: "center", marginBottom: 50,
          opacity: interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [5, 25], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        }}>
          <div style={{
            fontFamily: body, fontSize: 14, fontWeight: 500,
            color: "#6B7280", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12,
          }}>Core Features</div>
          <div style={{
            fontFamily: display, fontSize: 44, fontWeight: 800,
            color: "#F5F5F5", letterSpacing: "-0.02em",
          }}>
            Everything a player needs to be seen.
          </div>
        </div>

        {/* 3 feature cards */}
        <div style={{ display: "flex", gap: 24 }}>
          {features.map((feat, i) => {
            const delay = 30 + i * 30;
            const s = spring({ frame: frame - delay, fps, config: { damping: 25, stiffness: 120 } });
            const y = interpolate(s, [0, 1], [50, 0]);
            const o = interpolate(s, [0, 1], [0, 1]);

            return (
              <div key={i} style={{
                flex: 1,
                backgroundColor: "#141B2D",
                border: "1px solid #1E293B",
                borderRadius: 14,
                padding: "28px 24px",
                opacity: o,
                transform: `translateY(${y}px)`,
              }}>
                <div style={{
                  fontFamily: display, fontSize: 22, fontWeight: 800,
                  color: "#E8B400", marginBottom: 8,
                }}>{feat.title}</div>
                <div style={{
                  fontFamily: body, fontSize: 14, fontWeight: 400,
                  color: "#9CA3AF", lineHeight: 1.5, marginBottom: 24,
                }}>{feat.desc}</div>

                {/* Mock data rows */}
                {feat.mockContent.map((row, j) => {
                  const rowDelay = delay + 20 + j * 10;
                  const rowO = interpolate(frame, [rowDelay, rowDelay + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  return (
                    <div key={j} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "10px 0",
                      borderTop: j > 0 ? "1px solid #1E293B" : "none",
                      opacity: rowO,
                    }}>
                      <div style={{ fontFamily: body, fontSize: 13, color: "#6B7280" }}>{row.l}</div>
                      <div style={{ fontFamily: body, fontSize: 13, fontWeight: 600, color: "#F5F5F5" }}>{row.v}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
