import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const BEAT = 36; // ~1.2s per cut

// Flash overlay between cuts
const FlashTransition = ({ at }: { at: number }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - 1, at, at + 2], [0, 0.85, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <div style={{
      position: "absolute", inset: 0,
      backgroundColor: "#FFFFFF",
      opacity: o, pointerEvents: "none", zIndex: 50,
    }} />
  );
};

// ─── Beat 1: CPI Dial ─────────────────────────
const CPIBeat = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
  const scale = interpolate(s, [0, 1], [0.4, 1]);
  const numS = spring({ frame: frame - 4, fps, config: { damping: 18 } });
  const num = Math.round(interpolate(numS, [0, 1], [0, 87]));
  const ringP = interpolate(s, [0, 1], [0, 0.87]);
  const r = 180;
  const C = 2 * Math.PI * r;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `scale(${scale})`, textAlign: "center" }}>
        <div style={{
          fontFamily: body, fontSize: 32, fontWeight: 600, color: "#8B92A3",
          textTransform: "uppercase", letterSpacing: "0.25em", marginBottom: 30,
        }}>
          Composite Performance
        </div>
        <div style={{ position: "relative", width: 460, height: 460, margin: "0 auto" }}>
          <svg width={460} height={460} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
            <circle cx={230} cy={230} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={14} />
            <circle
              cx={230} cy={230} r={r} fill="none" stroke="#E8B400" strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - ringP)}
              style={{ filter: "drop-shadow(0 0 16px rgba(232,180,0,0.5))" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            flexDirection: "column", justifyContent: "center", alignItems: "center",
          }}>
            <div style={{
              fontFamily: display, fontSize: 180, fontWeight: 800,
              color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1,
            }}>
              {num}
            </div>
            <div style={{
              fontFamily: body, fontSize: 28, fontWeight: 600,
              color: "#E8B400", letterSpacing: "0.2em", marginTop: 8,
            }}>
              CPI
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Beat 2: Leaderboard climb ─────────────────────────
const LeaderboardBeat = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [
    { rank: 4, name: "Marcus Johnson", cpi: 71 },
    { rank: 3, name: "Mia Thompson", cpi: 73 },
    { rank: 2, name: "Lucas Martinez", cpi: 75 },
    { rank: 1, name: "Sofia Chen", cpi: 87, hero: true },
  ];

  // Hero row climbs from bottom to top
  const climbS = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 100 } });
  const heroY = interpolate(climbS, [0, 1], [240, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
      <div style={{ width: "100%", maxWidth: 920 }}>
        <div style={{
          fontFamily: body, fontSize: 28, fontWeight: 600, color: "#8B92A3",
          textTransform: "uppercase", letterSpacing: "0.25em", marginBottom: 32, textAlign: "center",
        }}>
          Live Rankings
        </div>
        {rows.map((r, i) => {
          const delay = 2 + i * 4;
          const rs = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 130 } });
          const x = interpolate(rs, [0, 1], [80, 0]);
          const o = interpolate(frame, [delay, delay + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const yShift = r.hero ? heroY : 0;
          const isTop = r.rank === 1;
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 24,
              padding: "26px 32px", marginBottom: 14,
              borderRadius: 18,
              background: isTop ? "rgba(232,180,0,0.12)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${isTop ? "rgba(232,180,0,0.4)" : "rgba(255,255,255,0.06)"}`,
              opacity: o,
              transform: `translateX(${x}px) translateY(${yShift}px)`,
              boxShadow: isTop ? "0 0 40px rgba(232,180,0,0.25)" : "none",
            }}>
              <div style={{
                fontFamily: display, fontSize: 44, fontWeight: 800,
                color: isTop ? "#E8B400" : "#8B92A3", width: 70, textAlign: "center",
              }}>
                #{r.rank}
              </div>
              <div style={{
                fontFamily: body, fontSize: 32, fontWeight: 700, color: "#FFFFFF", flex: 1,
              }}>
                {r.name}
              </div>
              <div style={{
                fontFamily: display, fontSize: 44, fontWeight: 800,
                color: isTop ? "#E8B400" : "#FFFFFF",
              }}>
                {r.cpi}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Beat 3: Video tagging ─────────────────────────
const VideoTagBeat = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, stiffness: 130 } });
  const scale = interpolate(s, [0, 1], [0.85, 1]);

  const tags = [
    { x: 22, y: 30, label: "#7", delay: 6 },
    { x: 56, y: 48, label: "#10", delay: 10, hero: true },
    { x: 78, y: 65, label: "#4", delay: 14 },
    { x: 38, y: 72, label: "#11", delay: 18 },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
      <div style={{ transform: `scale(${scale})`, width: "100%" }}>
        <div style={{
          fontFamily: body, fontSize: 28, fontWeight: 600, color: "#8B92A3",
          textTransform: "uppercase", letterSpacing: "0.25em", marginBottom: 24, textAlign: "center",
        }}>
          Match Intelligence
        </div>
        {/* Pitch / video frame */}
        <div style={{
          position: "relative", width: "100%", aspectRatio: "16 / 11",
          background: "linear-gradient(135deg, #0F4D2A 0%, #0A3E22 100%)",
          borderRadius: 22, overflow: "hidden",
          border: "2px solid rgba(232,180,0,0.3)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}>
          {/* Pitch lines */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.25 }}>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: "#FFF" }} />
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 120, height: 120, borderRadius: "50%", border: "2px solid #FFF",
            }} />
            <div style={{
              position: "absolute", top: 0, left: "25%", right: "25%", height: 80,
              border: "2px solid #FFF", borderTop: "none",
            }} />
            <div style={{
              position: "absolute", bottom: 0, left: "25%", right: "25%", height: 80,
              border: "2px solid #FFF", borderBottom: "none",
            }} />
          </div>
          {/* Player tags */}
          {tags.map((t, i) => {
            const ts = spring({ frame: frame - t.delay, fps, config: { damping: 11, stiffness: 200 } });
            const tScale = interpolate(ts, [0, 1], [0, 1]);
            return (
              <div key={i} style={{
                position: "absolute",
                left: `${t.x}%`, top: `${t.y}%`,
                transform: `translate(-50%, -50%) scale(${tScale})`,
              }}>
                <div style={{
                  width: t.hero ? 56 : 40, height: t.hero ? 56 : 40,
                  borderRadius: "50%",
                  background: t.hero ? "#E8B400" : "rgba(255,255,255,0.95)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: display, fontSize: t.hero ? 22 : 16, fontWeight: 800,
                  color: t.hero ? "#0A0C12" : "#0A0C12",
                  boxShadow: t.hero
                    ? "0 0 30px rgba(232,180,0,0.8), 0 0 0 4px rgba(232,180,0,0.3)"
                    : "0 4px 12px rgba(0,0,0,0.4)",
                }}>
                  {t.label}
                </div>
              </div>
            );
          })}
          {/* AI scan line */}
          <div style={{
            position: "absolute", left: 0, right: 0,
            top: `${interpolate(frame, [0, BEAT], [0, 100], { extrapolateRight: "clamp" })}%`,
            height: 3,
            background: "linear-gradient(90deg, transparent, #E8B400, transparent)",
            boxShadow: "0 0 16px rgba(232,180,0,0.8)",
            opacity: 0.7,
          }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Beat 4: Fitness bars ─────────────────────────
const FitnessBeat = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tests = [
    { label: "10m Sprint", value: 9.1, max: 10, color: "#E8B400" },
    { label: "Beep Test", value: 8.6, max: 10, color: "#FFFFFF" },
    { label: "Vertical Jump", value: 8.9, max: 10, color: "#E8B400" },
    { label: "Agility", value: 9.3, max: 10, color: "#FFFFFF" },
  ];

  const headS = spring({ frame, fps, config: { damping: 14 } });
  const headO = interpolate(headS, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px" }}>
      <div style={{ width: "100%", maxWidth: 880 }}>
        <div style={{
          fontFamily: body, fontSize: 28, fontWeight: 600, color: "#8B92A3",
          textTransform: "uppercase", letterSpacing: "0.25em", marginBottom: 40,
          textAlign: "center", opacity: headO,
        }}>
          Fitness Benchmarks
        </div>
        {tests.map((t, i) => {
          const delay = 4 + i * 4;
          const fillS = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 100 } });
          const fillW = interpolate(fillS, [0, 1], [0, (t.value / t.max) * 100]);
          const numS = spring({ frame: frame - delay - 2, fps, config: { damping: 20 } });
          const num = interpolate(numS, [0, 1], [0, t.value]);
          const o = interpolate(frame, [delay, delay + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ marginBottom: 32, opacity: o }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12,
              }}>
                <div style={{ fontFamily: body, fontSize: 30, fontWeight: 600, color: "#FFFFFF" }}>
                  {t.label}
                </div>
                <div style={{ fontFamily: display, fontSize: 44, fontWeight: 800, color: t.color }}>
                  {num.toFixed(1)}
                </div>
              </div>
              <div style={{
                width: "100%", height: 14, borderRadius: 7,
                backgroundColor: "rgba(255,255,255,0.06)", overflow: "hidden",
              }}>
                <div style={{
                  width: `${fillW}%`, height: "100%",
                  background: t.color === "#E8B400"
                    ? "linear-gradient(90deg, #E8B400, #FFD740)"
                    : "linear-gradient(90deg, #FFFFFF, #E8B400)",
                  borderRadius: 7,
                  boxShadow: t.color === "#E8B400" ? "0 0 12px rgba(232,180,0,0.5)" : "none",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── Beat 5: Report card ─────────────────────────
const ReportBeat = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 13, stiffness: 140 } });
  const y = interpolate(s, [0, 1], [200, 0]);
  const scale = interpolate(s, [0, 1], [0.92, 1]);

  const stats = [
    { label: "Technical", val: 8.4 },
    { label: "Tactical", val: 7.9 },
    { label: "Physical", val: 9.1 },
    { label: "Mental", val: 8.6 },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
      <div style={{
        width: "100%", maxWidth: 880,
        transform: `translateY(${y}px) scale(${scale})`,
        background: "linear-gradient(180deg, #14171F 0%, #0F1218 100%)",
        borderRadius: 28,
        border: "1px solid rgba(232,180,0,0.25)",
        padding: 50,
        boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(232,180,0,0.1)",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 36,
        }}>
          <div>
            <div style={{
              fontFamily: body, fontSize: 22, fontWeight: 600, color: "#8B92A3",
              textTransform: "uppercase", letterSpacing: "0.2em",
            }}>
              Weekly Report
            </div>
            <div style={{
              fontFamily: display, fontSize: 56, fontWeight: 800, color: "#FFFFFF",
              letterSpacing: "-0.03em", marginTop: 8,
            }}>
              Sofia Chen
            </div>
          </div>
          <div style={{
            fontFamily: display, fontSize: 64, fontWeight: 800, color: "#E8B400",
          }}>
            +6.2
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {stats.map((st, i) => {
            const delay = 6 + i * 3;
            const cs = spring({ frame: frame - delay, fps, config: { damping: 15 } });
            const o = interpolate(cs, [0, 1], [0, 1]);
            const cy = interpolate(cs, [0, 1], [20, 0]);
            return (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16, padding: "24px 28px",
                opacity: o, transform: `translateY(${cy}px)`,
              }}>
                <div style={{
                  fontFamily: body, fontSize: 22, fontWeight: 600, color: "#8B92A3",
                  textTransform: "uppercase", letterSpacing: "0.15em",
                }}>
                  {st.label}
                </div>
                <div style={{
                  fontFamily: display, fontSize: 56, fontWeight: 800, color: "#FFFFFF", marginTop: 6,
                }}>
                  {st.val}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Promo15ProofScene = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
      {/* subtle ambient gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 50% 40%, rgba(232,180,0,0.06) 0%, transparent 60%)",
      }} />

      <Sequence from={0} durationInFrames={BEAT}><CPIBeat /></Sequence>
      <Sequence from={BEAT} durationInFrames={BEAT}><LeaderboardBeat /></Sequence>
      <Sequence from={BEAT * 2} durationInFrames={BEAT}><VideoTagBeat /></Sequence>
      <Sequence from={BEAT * 3} durationInFrames={BEAT}><FitnessBeat /></Sequence>
      <Sequence from={BEAT * 4} durationInFrames={BEAT}><ReportBeat /></Sequence>

      {/* White flash overlays at each cut */}
      <FlashTransition at={BEAT} />
      <FlashTransition at={BEAT * 2} />
      <FlashTransition at={BEAT * 3} />
      <FlashTransition at={BEAT * 4} />
    </AbsoluteFill>
  );
};
