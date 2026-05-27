import React from "react";
import {
  AbsoluteFill,
  Series,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInstrument } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});
const { fontFamily: serif } = loadInstrument("normal", {
  weights: ["400"],
  subsets: ["latin"],
});
const { fontFamily: body } = loadInter("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

const INK = "#06070B";
const GOLD = "#E8B400";
const IVORY = "#F5F1E6";
const MUTED = "rgba(245,241,230,0.6)";

/* ---------------- Persistent backdrop ---------------- */
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;
  const gx = 50 + Math.sin(t * Math.PI * 2) * 10;
  const gy = 40 + Math.cos(t * Math.PI * 1.5) * 8;

  const particles = Array.from({ length: 24 }, (_, i) => {
    const seedX = (i * 97) % 100;
    const speed = 0.12 + ((i * 13) % 7) * 0.035;
    const y = ((frame * speed + i * 80) % (height + 200)) - 100;
    const size = 1 + (i % 4);
    const o = interpolate(
      y,
      [-100, 200, height - 200, height],
      [0, 0.55, 0.55, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    return { x: (seedX / 100) * width, y, size, o };
  });

  // grain
  const grain = (frame % 6) * 0.01;

  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${gx}% ${gy}%, rgba(232,180,0,0.16) 0%, rgba(232,180,0,0.04) 30%, rgba(6,7,11,0) 60%), radial-gradient(ellipse at 50% 115%, rgba(70,80,110,0.4) 0%, rgba(6,7,11,0) 55%), linear-gradient(180deg, #06070B 0%, #0A0C12 50%, #06070B 100%)`,
        }}
      />
      {/* subtle pitch arc */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, opacity: 0.08 }}
      >
        <circle cx={width / 2} cy={height / 2} r={width * 0.55} fill="none" stroke={IVORY} strokeWidth={1} />
        <circle cx={width / 2} cy={height / 2} r={width * 0.35} fill="none" stroke={IVORY} strokeWidth={1} />
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke={IVORY} strokeWidth={1} />
      </svg>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: 999,
            background: IVORY,
            opacity: p.o,
            boxShadow: `0 0 ${p.size * 4}px rgba(245,241,230,0.6)`,
          }}
        />
      ))}
      {/* film grain */}
      <AbsoluteFill
        style={{
          background:
            "repeating-radial-gradient(circle at 20% 30%, rgba(255,255,255,0.015) 0 1px, transparent 1px 3px)",
          opacity: 0.4 + grain,
          mixBlendMode: "overlay",
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------------- Helpers ---------------- */
const useFade = (inFrame: number, outFrame?: number, len = 14) => {
  const frame = useCurrentFrame();
  const inO = interpolate(frame, [inFrame, inFrame + len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (outFrame == null) return inO;
  const outO = interpolate(frame, [outFrame, outFrame + len], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(inO, outO);
};

/* ---------------- Scene 1: Hook ---------------- */
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t1 = spring({ frame: frame - 6, fps, config: { damping: 200 } });
  const t1y = interpolate(t1, [0, 1], [20, 0]);
  const t1o = useFade(6, 78);

  const t2 = spring({ frame: frame - 50, fps, config: { damping: 200 } });
  const t2y = interpolate(t2, [0, 1], [20, 0]);
  const t2o = useFade(50, 95);

  // ambient blurred "training" abstract shapes
  const shapeY = interpolate(frame, [0, 120], [0, -30]);

  return (
    <AbsoluteFill>
      {/* blurred ambient training silhouettes (abstract) */}
      <AbsoluteFill style={{ filter: "blur(50px)", opacity: 0.35 }}>
        <div
          style={{
            position: "absolute",
            top: 200 + shapeY,
            left: -60,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(232,180,0,0.35), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 250 - shapeY,
            right: -80,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(120,160,255,0.25), transparent 70%)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 96,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              color: IVORY,
              opacity: t1o,
              transform: `translateY(${t1y}px)`,
            }}
          >
            Talent gets
            <br />
            <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, color: GOLD }}>
              noticed.
            </span>
          </div>

          <div
            style={{
              marginTop: 48,
              fontFamily: display,
              fontWeight: 700,
              fontSize: 72,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: IVORY,
              opacity: t2o,
              transform: `translateY(${t2y}px)`,
            }}
          >
            Development
            <br />
            <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, color: IVORY }}>
              changes everything.
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- Scene 2: Product / UI scroll ---------------- */
const ProfileCard: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 140 } });
  const y = interpolate(s, [0, 1], [60, 0]);
  const o = interpolate(s, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity: o,
        transform: `translateY(${y}px)`,
        background: "rgba(15,17,22,0.85)",
        border: "1px solid rgba(245,241,230,0.1)",
        borderRadius: 28,
        padding: 28,
        boxShadow:
          "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(232,180,0,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: `conic-gradient(from 0deg, ${GOLD}, #6a8dff, ${GOLD})`,
            padding: 3,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #1a1f2b, #0a0c12)",
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 28, color: IVORY }}>
            Diego Ramirez
          </div>
          <div style={{ fontFamily: body, fontSize: 18, color: MUTED, marginTop: 2 }}>
            U-18 · Center Back
          </div>
        </div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 42,
            color: GOLD,
            letterSpacing: "-0.03em",
          }}
        >
          91
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
        {[88, 92, 76, 84].map((v, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div
              style={{
                height: 6,
                background: "rgba(245,241,230,0.08)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${v}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${GOLD}, #ffd34d)`,
                }}
              />
            </div>
            <div style={{ fontFamily: body, fontSize: 12, color: MUTED, marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {["Pace", "Tech", "IQ", "Phys"][i]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalyticsCard: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 140 } });
  const y = interpolate(s, [0, 1], [60, 0]);
  const o = interpolate(s, [0, 1], [0, 1]);

  const points = [10, 28, 22, 45, 38, 60, 55, 78, 72, 92];
  const lineProgress = interpolate(frame, [delay + 10, delay + 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const w = 480;
  const h = 180;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y2 = h - (p / 100) * h;
      return `${i === 0 ? "M" : "L"}${x},${y2}`;
    })
    .join(" ");

  return (
    <div
      style={{
        opacity: o,
        transform: `translateY(${y}px)`,
        background: "rgba(15,17,22,0.85)",
        border: "1px solid rgba(245,241,230,0.1)",
        borderRadius: 28,
        padding: 28,
        boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div style={{ fontFamily: body, fontSize: 14, color: MUTED, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Performance Index
          </div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 48, color: IVORY, marginTop: 4 }}>
            +18.4%
          </div>
        </div>
        <div style={{ fontFamily: body, fontSize: 16, color: GOLD }}>last 30 days</div>
      </div>
      <svg width={w} height={h} style={{ marginTop: 14, width: "100%" }}>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.35" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${path} L${w},${h} L0,${h} Z`}
          fill="url(#g1)"
          opacity={lineProgress}
        />
        <path
          d={path}
          fill="none"
          stroke={GOLD}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 1200,
            strokeDashoffset: 1200 - lineProgress * 1200,
          }}
        />
      </svg>
    </div>
  );
};

const SceneProduct: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  // scroll the stack of cards upward, like a UI scroll
  const scrollY = interpolate(frame, [0, 120], [200, -260], {
    extrapolateRight: "clamp",
  });

  const overlayWords = [
    { text: "Track Growth", at: 8 },
    { text: "Build Your Path", at: 48 },
    { text: "Level Up", at: 88 },
  ];

  return (
    <AbsoluteFill>
      {/* phone-like frame */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 760,
            height: 1380,
            borderRadius: 60,
            border: "1px solid rgba(245,241,230,0.12)",
            background:
              "linear-gradient(180deg, rgba(15,17,22,0.6), rgba(8,9,13,0.6))",
            boxShadow:
              "0 60px 120px -30px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(232,180,0,0.05)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* status bar */}
          <div
            style={{
              padding: "28px 40px 0",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: body,
              color: MUTED,
              fontSize: 16,
              letterSpacing: "0.1em",
            }}
          >
            <span>CAMINO</span>
            <span style={{ color: GOLD }}>● LIVE</span>
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              padding: "100px 36px 40px",
              transform: `translateY(${scrollY}px)`,
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            <div
              style={{
                fontFamily: display,
                fontWeight: 800,
                fontSize: 56,
                color: IVORY,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Your <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, color: GOLD }}>Path</span>
            </div>
            <ProfileCard delay={6} />
            <AnalyticsCard delay={26} />
            <ProfileCard delay={46} />
          </div>

          {/* top fade */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 100,
              background: "linear-gradient(180deg, rgba(8,9,13,1), transparent)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 140,
              background: "linear-gradient(0deg, rgba(8,9,13,1), transparent)",
              pointerEvents: "none",
            }}
          />
        </div>
      </AbsoluteFill>

      {/* overlay kinetic words */}
      {overlayWords.map((w, i) => {
        const s = spring({ frame: frame - w.at, fps: 30, config: { damping: 200 } });
        const o = interpolate(frame, [w.at, w.at + 14, w.at + 34, w.at + 46], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const x = interpolate(s, [0, 1], [-40, 0]);
        const yPos = [220, 960, 1640][i];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: yPos,
              left: 80,
              fontFamily: display,
              fontWeight: 800,
              fontSize: 84,
              letterSpacing: "-0.04em",
              color: IVORY,
              opacity: o,
              transform: `translateX(${x}px)`,
              textShadow: "0 8px 40px rgba(0,0,0,0.8)",
              mixBlendMode: "screen",
            }}
          >
            {w.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- Scene 3: Emotional ---------------- */
const SceneEmotional: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const s = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const y = interpolate(s, [0, 1], [40, 0]);
  const o = useFade(10, 80);

  // dramatic spotlight sweep
  const sweep = interpolate(frame, [0, 100], [-300, 1200]);

  return (
    <AbsoluteFill>
      {/* dramatic light */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: sweep,
            width: 600,
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(232,180,0,0.18), transparent)",
            filter: "blur(40px)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 100px" }}>
        <div style={{ textAlign: "center", opacity: o, transform: `translateY(${y}px)` }}>
          <div
            style={{
              fontFamily: body,
              fontSize: 22,
              color: GOLD,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              marginBottom: 36,
            }}
          >
            — CAMINO —
          </div>
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 110,
              lineHeight: 1.02,
              letterSpacing: "-0.045em",
              color: IVORY,
            }}
          >
            The future of
            <br />
            <span style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 400, color: GOLD }}>
              athlete development.
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- Scene 4: Logo reveal ---------------- */
const SceneLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const letters = "CAMINO".split("");
  const glow = interpolate(frame, [20, 70], [0, 1], { extrapolateRight: "clamp" });
  const subO = useFade(70);
  const tinyO = useFade(95);
  const fadeOut = interpolate(frame, [140, 165], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {/* soft glow behind logo */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 900,
            height: 900,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(232,180,0,${0.25 * glow}) 0%, rgba(232,180,0,0) 60%)`,
            filter: "blur(20px)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {letters.map((ch, i) => {
            const s = spring({
              frame: frame - 10 - i * 5,
              fps,
              config: { damping: 14, stiffness: 120 },
            });
            const yL = interpolate(s, [0, 1], [40, 0]);
            const oL = interpolate(s, [0, 1], [0, 1]);
            return (
              <div
                key={i}
                style={{
                  fontFamily: display,
                  fontWeight: 800,
                  fontSize: 180,
                  letterSpacing: "0.02em",
                  color: IVORY,
                  opacity: oL,
                  transform: `translateY(${yL}px)`,
                  textShadow: `0 0 ${40 * glow}px rgba(232,180,0,${0.6 * glow})`,
                }}
              >
                {ch}
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 40,
            fontFamily: display,
            fontWeight: 700,
            fontSize: 36,
            letterSpacing: "0.32em",
            color: GOLD,
            opacity: subO,
          }}
        >
          FULL PLATFORM DROPPING SOON
        </div>

        <div
          style={{
            marginTop: 28,
            fontFamily: serif,
            fontStyle: "italic",
            fontSize: 30,
            color: MUTED,
            opacity: tinyO,
          }}
        >
          For the next generation of athletes.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- Master ---------------- */
export const CaminoLandingTeaser: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Backdrop />
      <Series>
        <Series.Sequence durationInFrames={110}>
          <SceneHook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={130}>
          <SceneProduct />
        </Series.Sequence>
        <Series.Sequence durationInFrames={100}>
          <SceneEmotional />
        </Series.Sequence>
        <Series.Sequence durationInFrames={170}>
          <SceneLogo />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
