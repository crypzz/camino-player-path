import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin"] });

const pillars = [
  { label: "Technical", value: 8.4, count: 6, color: "#E8B400" },
  { label: "Tactical", value: 7.9, count: 5, color: "#FFFFFF" },
  { label: "Physical", value: 9.1, count: 6, color: "#E8B400" },
  { label: "Mental", value: 8.6, count: 6, color: "#FFFFFF" },
];

export const CPIDemoScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelS = spring({ frame, fps, config: { damping: 14 } });
  const labelO = interpolate(labelS, [0, 1], [0, 1]);

  const dialS = spring({ frame: frame - 8, fps, config: { damping: 12, stiffness: 100 } });
  const dialScale = interpolate(dialS, [0, 1], [0.6, 1]);
  const numS = spring({ frame: frame - 14, fps, config: { damping: 22 } });
  const num = Math.round(interpolate(numS, [0, 1], [0, 87]));
  const ringP = interpolate(dialS, [0, 1], [0, 0.87]);
  const r = 200;
  const C = 2 * Math.PI * r;

  const captionS = spring({ frame: frame - 180, fps, config: { damping: 18 } });
  const captionO = interpolate(captionS, [0, 1], [0, 1]);
  const captionY = interpolate(captionS, [0, 1], [20, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 30% 50%, rgba(232,180,0,0.08) 0%, transparent 50%)",
      }} />
      {/* Header */}
      <div style={{
        position: "absolute", top: 80, left: 0, right: 0, textAlign: "center",
        opacity: labelO,
      }}>
        <div style={{
          fontFamily: body, fontSize: 24, fontWeight: 600, color: "#8B92A3",
          letterSpacing: "0.3em", textTransform: "uppercase",
        }}>
          The Camino Performance Index
        </div>
      </div>

      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center", gap: 100, padding: "0 100px",
      }}>
        {/* CPI Dial */}
        <div style={{
          position: "relative", width: 500, height: 500,
          transform: `scale(${dialScale})`,
        }}>
          <svg width={500} height={500} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
            <circle cx={250} cy={250} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={16} />
            <circle
              cx={250} cy={250} r={r} fill="none" stroke="#E8B400" strokeWidth={16}
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - ringP)}
              style={{ filter: "drop-shadow(0 0 24px rgba(232,180,0,0.6))" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            flexDirection: "column", justifyContent: "center", alignItems: "center",
          }}>
            <div style={{
              fontFamily: display, fontSize: 220, fontWeight: 800,
              color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1,
            }}>
              {num}
            </div>
            <div style={{
              fontFamily: body, fontSize: 32, fontWeight: 600,
              color: "#E8B400", letterSpacing: "0.25em", marginTop: 12,
            }}>
              CPI
            </div>
          </div>
        </div>

        {/* Pillar breakdown */}
        <div style={{ width: 460 }}>
          {pillars.map((p, i) => {
            const delay = 30 + i * 12;
            const ps = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 130 } });
            const x = interpolate(ps, [0, 1], [80, 0]);
            const o = interpolate(frame, [delay, delay + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const fillW = interpolate(ps, [0, 1], [0, (p.value / 10) * 100]);
            return (
              <div key={i} style={{
                marginBottom: 22, opacity: o, transform: `translateX(${x}px)`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <div style={{
                    fontFamily: body, fontSize: 24, fontWeight: 700, color: "#FFFFFF",
                  }}>
                    {p.label}
                    <span style={{ color: "#8B92A3", fontWeight: 500, marginLeft: 12, fontSize: 18 }}>
                      · {p.count} attrs
                    </span>
                  </div>
                  <div style={{
                    fontFamily: display, fontSize: 36, fontWeight: 800, color: p.color,
                  }}>
                    {p.value}
                  </div>
                </div>
                <div style={{
                  width: "100%", height: 10, borderRadius: 5,
                  background: "rgba(255,255,255,0.06)", overflow: "hidden",
                }}>
                  <div style={{
                    width: `${fillW}%`, height: "100%",
                    background: p.color === "#E8B400"
                      ? "linear-gradient(90deg, #E8B400, #FFD740)"
                      : "linear-gradient(90deg, #FFFFFF, #E8B400)",
                    boxShadow: p.color === "#E8B400" ? "0 0 12px rgba(232,180,0,0.5)" : "none",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Caption */}
      <div style={{
        position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center",
        opacity: captionO, transform: `translateY(${captionY}px)`,
      }}>
        <div style={{
          fontFamily: display, fontSize: 38, fontWeight: 800, color: "#FFFFFF",
          letterSpacing: "-0.02em",
        }}>
          One score. <span style={{ color: "#E8B400" }}>23 attributes.</span> Zero ambiguity.
        </div>
      </div>
    </AbsoluteFill>
  );
};
