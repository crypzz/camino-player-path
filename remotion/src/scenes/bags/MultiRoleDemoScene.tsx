import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const Quadrant = ({ role, title, delay, children }: { role: string; title: string; delay: number; children: React.ReactNode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 120 } });
  const scale = interpolate(s, [0, 1], [0.85, 1]);
  const o = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      background: "linear-gradient(180deg, #14171F 0%, #0F1218 100%)",
      borderRadius: 18, padding: 28,
      border: "1px solid rgba(232,180,0,0.18)",
      transform: `scale(${scale})`, opacity: o,
      display: "flex", flexDirection: "column",
      boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    }}>
      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18,
      }}>
        <div style={{
          fontFamily: body, fontSize: 14, fontWeight: 700, color: "#E8B400",
          letterSpacing: "0.25em", textTransform: "uppercase",
        }}>
          {role}
        </div>
        <div style={{ fontFamily: display, fontSize: 22, fontWeight: 800, color: "#FFFFFF" }}>
          {title}
        </div>
      </div>
      {children}
    </div>
  );
};

const StatRow = ({ label, value, color = "#FFFFFF" }: { label: string; value: string; color?: string }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "baseline",
    padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
  }}>
    <div style={{ fontFamily: body, fontSize: 16, color: "#8B92A3" }}>{label}</div>
    <div style={{ fontFamily: display, fontSize: 24, fontWeight: 800, color }}>{value}</div>
  </div>
);

export const MultiRoleDemoScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headS = spring({ frame, fps, config: { damping: 14 } });
  const headO = interpolate(headS, [0, 1], [0, 1]);

  const captionS = spring({ frame: frame - 200, fps, config: { damping: 16 } });
  const captionO = interpolate(captionS, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
      <div style={{
        position: "absolute", top: 50, left: 0, right: 0, textAlign: "center",
        opacity: headO,
      }}>
        <div style={{
          fontFamily: body, fontSize: 22, fontWeight: 600, color: "#8B92A3",
          letterSpacing: "0.3em", textTransform: "uppercase",
        }}>
          One platform · Four roles · Same data
        </div>
      </div>

      <div style={{
        position: "absolute", top: 130, left: 80, right: 80, bottom: 110,
        display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr",
        gap: 24,
      }}>
        <Quadrant role="Director" title="Club Overview" delay={10}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div style={{ background: "rgba(232,180,0,0.08)", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontFamily: body, fontSize: 12, color: "#8B92A3", letterSpacing: "0.15em", textTransform: "uppercase" }}>Players</div>
              <div style={{ fontFamily: display, fontSize: 36, fontWeight: 800, color: "#E8B400" }}>184</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontFamily: body, fontSize: 12, color: "#8B92A3", letterSpacing: "0.15em", textTransform: "uppercase" }}>Avg CPI</div>
              <div style={{ fontFamily: display, fontSize: 36, fontWeight: 800, color: "#FFFFFF" }}>74</div>
            </div>
          </div>
          <StatRow label="Active teams" value="12" />
          <StatRow label="Coaches" value="18" />
          <StatRow label="Sessions / wk" value="47" color="#E8B400" />
        </Quadrant>

        <Quadrant role="Coach" title="Squad Today" delay={22}>
          {["Sofia Chen — CPI 87", "Lucas Martinez — CPI 83", "Mia Thompson — CPI 80", "Marcus Johnson — CPI 79"].map((p, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: i === 0 ? "#E8B400" : "rgba(255,255,255,0.3)",
                boxShadow: i === 0 ? "0 0 8px #E8B400" : "none",
              }} />
              <div style={{ fontFamily: body, fontSize: 18, color: "#FFFFFF", flex: 1 }}>{p}</div>
            </div>
          ))}
        </Quadrant>

        <Quadrant role="Player" title="My Profile" delay={34}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #E8B400, #B8860B)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: display, fontSize: 26, fontWeight: 800, color: "#0A0C12",
            }}>
              SC
            </div>
            <div>
              <div style={{ fontFamily: display, fontSize: 22, fontWeight: 800, color: "#FFFFFF" }}>Sofia Chen</div>
              <div style={{ fontFamily: body, fontSize: 14, color: "#8B92A3" }}>FW · Level 7 · Rising</div>
            </div>
            <div style={{ marginLeft: "auto", fontFamily: display, fontSize: 40, fontWeight: 800, color: "#E8B400" }}>87</div>
          </div>
          <StatRow label="Goals this season" value="14" />
          <StatRow label="Highlights uploaded" value="23" />
          <StatRow label="Public profile views" value="412" color="#E8B400" />
        </Quadrant>

        <Quadrant role="Parent" title="Weekly Report" delay={46}>
          <div style={{
            background: "rgba(232,180,0,0.08)", borderRadius: 12, padding: "14px 18px", marginBottom: 14,
          }}>
            <div style={{ fontFamily: body, fontSize: 12, color: "#8B92A3", letterSpacing: "0.15em", textTransform: "uppercase" }}>This week</div>
            <div style={{ fontFamily: display, fontSize: 32, fontWeight: 800, color: "#E8B400" }}>+6.2 CPI</div>
          </div>
          <StatRow label="Attendance" value="100%" color="#E8B400" />
          <StatRow label="Strength" value="Finishing" />
          <StatRow label="Focus area" value="1v1 defending" />
        </Quadrant>
      </div>

      <div style={{
        position: "absolute", bottom: 30, left: 0, right: 0, textAlign: "center",
        opacity: captionO,
      }}>
        <div style={{
          fontFamily: display, fontSize: 30, fontWeight: 800, color: "#FFFFFF",
        }}>
          Built for the <span style={{ color: "#E8B400" }}>whole ecosystem</span>, not just the coach.
        </div>
      </div>
    </AbsoluteFill>
  );
};
