import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const tags = [
  { x: 22, y: 32, label: "#7", delay: 18 },
  { x: 56, y: 50, label: "#10", delay: 28, hero: true },
  { x: 78, y: 68, label: "#4", delay: 38 },
  { x: 38, y: 74, label: "#11", delay: 48 },
  { x: 65, y: 25, label: "#9", delay: 58 },
];

const events = [
  { time: "00:42", type: "Pass", player: "#10 Sofia C.", delay: 70 },
  { time: "00:58", type: "Shot", player: "#7 Marcus J.", delay: 90 },
  { time: "01:14", type: "Tackle", player: "#4 Liam O.", delay: 110 },
  { time: "01:31", type: "Goal", player: "#10 Sofia C.", delay: 130, hero: true },
  { time: "01:47", type: "Assist", player: "#11 Mia T.", delay: 150 },
];

export const VideoIntelDemoScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headS = spring({ frame, fps, config: { damping: 14 } });
  const headO = interpolate(headS, [0, 1], [0, 1]);

  const pitchS = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 130 } });
  const pitchScale = interpolate(pitchS, [0, 1], [0.92, 1]);
  const pitchO = interpolate(frame, [6, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const captionS = spring({ frame: frame - 200, fps, config: { damping: 18 } });
  const captionO = interpolate(captionS, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
      <div style={{
        position: "absolute", top: 60, left: 0, right: 0, textAlign: "center",
        opacity: headO,
      }}>
        <div style={{
          fontFamily: body, fontSize: 24, fontWeight: 600, color: "#8B92A3",
          letterSpacing: "0.3em", textTransform: "uppercase",
        }}>
          AI Video Intelligence
        </div>
      </div>

      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center", gap: 40, padding: "120px 80px 100px",
      }}>
        {/* Pitch / video */}
        <div style={{
          position: "relative", width: 1100, height: 620,
          background: "linear-gradient(135deg, #0F4D2A 0%, #0A3E22 100%)",
          borderRadius: 22, overflow: "hidden",
          border: "2px solid rgba(232,180,0,0.3)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          transform: `scale(${pitchScale})`, opacity: pitchO,
        }}>
          {/* Pitch lines */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.25 }}>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: "#FFF" }} />
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 160, height: 160, borderRadius: "50%", border: "2px solid #FFF",
            }} />
            <div style={{ position: "absolute", top: 0, left: "25%", right: "25%", height: 100, border: "2px solid #FFF", borderTop: "none" }} />
            <div style={{ position: "absolute", bottom: 0, left: "25%", right: "25%", height: 100, border: "2px solid #FFF", borderBottom: "none" }} />
          </div>
          {/* Tags */}
          {tags.map((t, i) => {
            const ts = spring({ frame: frame - t.delay, fps, config: { damping: 11, stiffness: 200 } });
            const tScale = interpolate(ts, [0, 1], [0, 1]);
            return (
              <div key={i} style={{
                position: "absolute", left: `${t.x}%`, top: `${t.y}%`,
                transform: `translate(-50%, -50%) scale(${tScale})`,
              }}>
                <div style={{
                  width: t.hero ? 64 : 46, height: t.hero ? 64 : 46,
                  borderRadius: "50%",
                  background: t.hero ? "#E8B400" : "rgba(255,255,255,0.95)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: display, fontSize: t.hero ? 24 : 18, fontWeight: 800, color: "#0A0C12",
                  boxShadow: t.hero
                    ? "0 0 30px rgba(232,180,0,0.8), 0 0 0 5px rgba(232,180,0,0.25)"
                    : "0 4px 12px rgba(0,0,0,0.4)",
                }}>
                  {t.label}
                </div>
              </div>
            );
          })}
          {/* Scan line */}
          <div style={{
            position: "absolute", left: 0, right: 0,
            top: `${interpolate(frame % 100, [0, 100], [0, 100])}%`,
            height: 3,
            background: "linear-gradient(90deg, transparent, #E8B400, transparent)",
            boxShadow: "0 0 16px rgba(232,180,0,0.8)",
            opacity: 0.7,
          }} />
        </div>

        {/* Event list */}
        <div style={{ width: 460 }}>
          <div style={{
            fontFamily: body, fontSize: 18, fontWeight: 700, color: "#8B92A3",
            letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20,
          }}>
            Events Detected
          </div>
          {events.map((e, i) => {
            const es = spring({ frame: frame - e.delay, fps, config: { damping: 15, stiffness: 140 } });
            const x = interpolate(es, [0, 1], [50, 0]);
            const o = interpolate(frame, [e.delay, e.delay + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "16px 20px", marginBottom: 10,
                borderRadius: 12,
                background: e.hero ? "rgba(232,180,0,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${e.hero ? "rgba(232,180,0,0.4)" : "rgba(255,255,255,0.06)"}`,
                opacity: o, transform: `translateX(${x}px)`,
              }}>
                <div style={{
                  fontFamily: "monospace", fontSize: 18, fontWeight: 700,
                  color: "#8B92A3", width: 70,
                }}>
                  {e.time}
                </div>
                <div style={{
                  fontFamily: display, fontSize: 22, fontWeight: 800,
                  color: e.hero ? "#E8B400" : "#FFFFFF", flex: 1,
                }}>
                  {e.type}
                </div>
                <div style={{ fontFamily: body, fontSize: 16, color: "#8B92A3" }}>
                  {e.player}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Caption */}
      <div style={{
        position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center",
        opacity: captionO,
      }}>
        <div style={{
          fontFamily: display, fontSize: 32, fontWeight: 800, color: "#FFFFFF",
        }}>
          Upload a match. <span style={{ color: "#E8B400" }}>AI tags every touch.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
