import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

// Initial order vs final order — Sofia climbs from #4 to #1
const initial = [
  { name: "Lucas Martinez", cpi: 81, club: "FC Norte" },
  { name: "Mia Thompson", cpi: 79, club: "Atletico" },
  { name: "Marcus Johnson", cpi: 78, club: "United" },
  { name: "Sofia Chen", cpi: 76, club: "FC Norte", hero: true },
];
const final = [
  { name: "Sofia Chen", cpi: 87, club: "FC Norte", hero: true },
  { name: "Lucas Martinez", cpi: 83, club: "FC Norte" },
  { name: "Mia Thompson", cpi: 80, club: "Atletico" },
  { name: "Marcus Johnson", cpi: 79, club: "United" },
];

export const LeaderboardDemoScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headS = spring({ frame, fps, config: { damping: 14 } });
  const headO = interpolate(headS, [0, 1], [0, 1]);

  // Climb happens between frames 60-110
  const climbProg = spring({ frame: frame - 60, fps, config: { damping: 18, stiffness: 90 } });

  const formulaS = spring({ frame: frame - 140, fps, config: { damping: 16 } });
  const formulaO = interpolate(formulaS, [0, 1], [0, 1]);
  const formulaY = interpolate(formulaS, [0, 1], [30, 0]);

  // Build animated list — by name
  const names = initial.map(p => p.name);
  const positions = names.map(name => {
    const initIdx = initial.findIndex(p => p.name === name);
    const finalIdx = final.findIndex(p => p.name === name);
    const idx = interpolate(climbProg, [0, 1], [initIdx, finalIdx]);
    const initCpi = initial[initIdx].cpi;
    const finalCpi = final.findIndex(p => p.name === name) >= 0 ? final[finalIdx].cpi : initCpi;
    const cpi = Math.round(interpolate(climbProg, [0, 1], [initCpi, finalCpi]));
    return { name, idx, cpi, hero: initial[initIdx].hero, club: initial[initIdx].club };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
      <div style={{
        position: "absolute", top: 70, left: 0, right: 0, textAlign: "center",
        opacity: headO,
      }}>
        <div style={{
          fontFamily: body, fontSize: 24, fontWeight: 600, color: "#8B92A3",
          letterSpacing: "0.3em", textTransform: "uppercase",
        }}>
          Cross-Club Live Rankings · U14
        </div>
        <div style={{
          fontFamily: display, fontSize: 56, fontWeight: 800, color: "#FFFFFF",
          marginTop: 12, letterSpacing: "-0.02em",
        }}>
          Watch <span style={{ color: "#E8B400" }}>Sofia</span> climb to #1.
        </div>
      </div>

      <div style={{
        position: "absolute", top: 240, left: "50%", transform: "translateX(-50%)",
        width: 900,
      }}>
        {positions.map((p) => {
          const y = p.idx * 110;
          const isLeader = Math.round(p.idx) === 0;
          return (
            <div
              key={p.name}
              style={{
                position: "absolute", left: 0, right: 0,
                top: 0, transform: `translateY(${y}px)`,
                display: "flex", alignItems: "center", gap: 24,
                padding: "26px 36px",
                borderRadius: 18,
                background: p.hero
                  ? "rgba(232,180,0,0.14)"
                  : isLeader ? "rgba(232,180,0,0.06)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${p.hero ? "rgba(232,180,0,0.5)" : "rgba(255,255,255,0.06)"}`,
                boxShadow: p.hero ? "0 0 60px rgba(232,180,0,0.3)" : "none",
                marginBottom: 14,
                height: 96,
              }}
            >
              <div style={{
                fontFamily: display, fontSize: 48, fontWeight: 800,
                color: isLeader ? "#E8B400" : "#8B92A3", width: 80, textAlign: "center",
              }}>
                #{Math.round(p.idx) + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: body, fontSize: 30, fontWeight: 700, color: "#FFFFFF",
                }}>
                  {p.name}
                </div>
                <div style={{
                  fontFamily: body, fontSize: 18, fontWeight: 500, color: "#8B92A3",
                }}>
                  {p.club}
                </div>
              </div>
              <div style={{
                fontFamily: display, fontSize: 48, fontWeight: 800,
                color: isLeader ? "#E8B400" : "#FFFFFF",
              }}>
                {p.cpi}
              </div>
            </div>
          );
        })}
      </div>

      {/* Formula stamp */}
      <div style={{
        position: "absolute", bottom: 60, left: 0, right: 0, textAlign: "center",
        opacity: formulaO, transform: `translateY(${formulaY}px)`,
      }}>
        <div style={{
          display: "inline-flex", gap: 32, alignItems: "center",
          padding: "20px 40px", borderRadius: 60,
          background: "rgba(232,180,0,0.08)",
          border: "1px solid rgba(232,180,0,0.3)",
        }}>
          <div style={{ fontFamily: display, fontSize: 28, fontWeight: 800, color: "#FFFFFF" }}>
            <span style={{ color: "#E8B400" }}>60%</span> CPI
          </div>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#8B92A3" }} />
          <div style={{ fontFamily: display, fontSize: 28, fontWeight: 800, color: "#FFFFFF" }}>
            <span style={{ color: "#E8B400" }}>20%</span> Consistency
          </div>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#8B92A3" }} />
          <div style={{ fontFamily: display, fontSize: 28, fontWeight: 800, color: "#FFFFFF" }}>
            <span style={{ color: "#E8B400" }}>20%</span> Improvement
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
