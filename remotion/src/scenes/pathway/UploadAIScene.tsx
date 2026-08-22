import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import {
  SceneShell, Caption, Panel, Label, MiniPitch, NAVY, GOLD, IVORY, MUTED, GREEN, body, display, ease,
} from "./_shared";

const DUR = 240;

const players = [
  { id: 7, x: 0.22, y: 0.42, d: 46 },
  { id: 10, x: 0.52, y: 0.3, d: 56 },
  { id: 4, x: 0.7, y: 0.62, d: 66 },
  { id: 2, x: 0.35, y: 0.74, d: 76 },
];

const Box: React.FC<{ p: (typeof players)[number] }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - p.d, fps, config: { damping: 18, stiffness: 200 } });
  const wob = Math.sin((frame + p.id * 9) / 14) * 6;
  const w = interpolate(s, [0, 1], [130, 74]);
  const h = interpolate(s, [0, 1], [190, 118]);
  return (
    <div
      style={{
        position: "absolute",
        left: `calc(${p.x * 100}% + ${wob}px)`,
        top: `calc(${p.y * 100}% + ${wob * 0.5}px)`,
        width: w,
        height: h,
        border: `2px solid ${GOLD}`,
        borderRadius: 8,
        opacity: s * 0.95,
        boxShadow: `0 0 26px rgba(252,211,77,0.25)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -30,
          left: -2,
          background: GOLD,
          color: "#0A0C12",
          fontFamily: body,
          fontWeight: 700,
          fontSize: 17,
          padding: "3px 9px",
          borderRadius: 6,
          whiteSpace: "nowrap",
          opacity: ease(frame, p.d + 10, p.d + 20),
        }}
      >
        #{p.id} · {Math.round(ease(frame, p.d + 10, p.d + 34, 62, 97))}%
      </div>
    </div>
  );
};

const eventRows = [
  { t: "12:04", e: "Progressive pass", c: GREEN, d: 108 },
  { t: "27:41", e: "Duel won", c: GOLD, d: 118 },
  { t: "48:19", e: "Shot on target", c: GREEN, d: 128 },
  { t: "63:52", e: "Key assist", c: GOLD, d: 138 },
];

export const UploadAIScene: React.FC = () => {
  const frame = useCurrentFrame();
  const upload = ease(frame, 6, 42);
  const uploadOut = ease(frame, 46, 62, 1, 0);

  return (
    <SceneShell duration={DUR} bg={NAVY}>
      {/* Step 1 — upload */}
      <div style={{ position: "absolute", top: 150, left: 70, right: 70, opacity: uploadOut }}>
        <Panel delay={2} glow>
          <Label>Upload footage</Label>
          <div style={{ fontFamily: body, fontWeight: 600, fontSize: 26, color: IVORY, marginTop: 12 }}>
            U15_vs_Foothills.mp4
          </div>
          <div style={{ height: 10, borderRadius: 8, background: "rgba(255,255,255,0.08)", marginTop: 16 }}>
            <div style={{ height: 10, borderRadius: 8, width: `${upload * 100}%`, background: GOLD }} />
          </div>
          <div style={{ fontFamily: body, fontSize: 20, color: MUTED, marginTop: 10 }}>
            {upload < 1 ? `${Math.round(upload * 100)}% uploading…` : "Processing with AI…"}
          </div>
        </Panel>
      </div>

      {/* Step 2 — AI detection over footage */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 60,
          right: 60,
          height: 620,
          borderRadius: 24,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
          opacity: ease(frame, 48, 66) * ease(frame, 176, 200, 1, 0.35),
          transform: `scale(${interpolate(frame, [48, DUR], [0.97, 1.03])})`,
        }}
      >
        <MiniPitch opacity={0.9} />
        <div style={{ position: "absolute", inset: 0 }}>
          {players.map((p) => (
            <Box key={p.id} p={p} />
          ))}
        </div>
        {/* scanning bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            top: `${(((frame - 48) * 2.2) % 620) / 6.2}%`,
            opacity: ease(frame, 48, 60) * ease(frame, 110, 130, 1, 0),
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 18,
            left: 18,
            fontFamily: body,
            fontWeight: 700,
            fontSize: 19,
            letterSpacing: 2,
            color: GOLD,
            opacity: ease(frame, 52, 64),
          }}
        >
          ● AI TRACKING · {Math.round(ease(frame, 52, 120, 0, 22))} PLAYERS
        </div>
      </div>

      {/* Step 3 — tagged events + highlight grid */}
      <div style={{ position: "absolute", top: 900, left: 60, right: 60, opacity: ease(frame, 100, 118) }}>
        <Panel delay={100}>
          <Label>Auto-tagged moments</Label>
          <div style={{ marginTop: 12 }}>
            {eventRows.map((r) => {
              const o = ease(frame, r.d, r.d + 12);
              return (
                <div
                  key={r.t}
                  style={{
                    opacity: o,
                    transform: `translateX(${interpolate(o, [0, 1], [30, 0])}px)`,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "11px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span style={{ fontFamily: display, fontWeight: 800, fontSize: 22, color: MUTED, width: 82 }}>{r.t}</span>
                  <span style={{ width: 8, height: 8, borderRadius: 8, background: r.c }} />
                  <span style={{ fontFamily: body, fontWeight: 600, fontSize: 24, color: IVORY }}>{r.e}</span>
                </div>
              );
            })}
          </div>
        </Panel>

        <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
          {[0, 1, 2].map((i) => {
            const d = 150 + i * 10;
            const o = ease(frame, d, d + 14);
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 116,
                  borderRadius: 16,
                  overflow: "hidden",
                  position: "relative",
                  opacity: o,
                  transform: `scale(${interpolate(o, [0, 1], [0.86, 1])})`,
                  border: "1px solid rgba(252,211,77,0.28)",
                }}
              >
                <MiniPitch opacity={0.7} />
                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 10,
                    fontFamily: body,
                    fontWeight: 700,
                    fontSize: 16,
                    color: GOLD,
                  }}
                >
                  CLIP {i + 1} · 0:0{6 + i}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Caption
        delay={186}
        bottom={110}
        size={48}
        lines={[{ t: "Upload the game." }, { t: "AI does the rest.", gold: true }]}
      />
    </SceneShell>
  );
};
