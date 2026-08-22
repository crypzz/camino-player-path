import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { SceneShell, Caption, MiniPitch, NAVY, IVORY, MUTED, LINE, body, ease } from "./_shared";

const DUR = 150;

const Scrap: React.FC<{
  x: number;
  y: number;
  rot: number;
  delay: number;
  w: number;
  children: React.ReactNode;
}> = ({ x, y, rot, delay, w, children }) => {
  const frame = useCurrentFrame();
  const o = ease(frame, delay, delay + 18, 0, 0.85) * ease(frame, 100, 132, 1, 0);
  const drift = interpolate(frame, [0, DUR], [0, -26]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        transform: `rotate(${rot}deg) translateY(${drift}px)`,
        opacity: o,
        background: "rgba(255,255,255,0.06)",
        border: `1px solid ${LINE}`,
        borderRadius: 14,
        padding: "16px 18px",
        fontFamily: body,
        fontSize: 20,
        color: MUTED,
        filter: "grayscale(1)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
      }}
    >
      {children}
    </div>
  );
};

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const footageOpacity = ease(frame, 0, 20, 0, 0.5) * ease(frame, 96, 130, 1, 0.12);
  const zoom = interpolate(frame, [0, DUR], [1.06, 1.16]);

  return (
    <SceneShell duration={DUR} bg={NAVY}>
      {/* desaturated "raw footage" */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: -60,
          right: -60,
          height: 700,
          opacity: footageOpacity,
          filter: "grayscale(1) blur(1.5px)",
          transform: `scale(${zoom})`,
        }}
      >
        <MiniPitch />
      </div>

      <Scrap x={70} y={330} rot={-4} delay={10} w={430}>
        <div style={{ letterSpacing: 2, fontSize: 15, marginBottom: 8 }}>ATTENDANCE — MAR</div>
        {["Nunez  ✓ ✓ ✗ ✓", "Silva   ✓ ✓ ✓ ✗", "Ahmed  ✗ ✓ ✓ ✓"].map((r) => (
          <div key={r} style={{ opacity: 0.7, lineHeight: 1.6 }}>{r}</div>
        ))}
      </Scrap>

      <Scrap x={520} y={560} rot={5} delay={24} w={420}>
        <div style={{ letterSpacing: 2, fontSize: 15, marginBottom: 8 }}>COACH — TEXT</div>
        <div style={{ opacity: 0.75, lineHeight: 1.45 }}>
          "good game today, keep working on that weak foot 👍"
        </div>
      </Scrap>

      <Scrap x={110} y={800} rot={3} delay={38} w={360}>
        <div style={{ letterSpacing: 2, fontSize: 15, marginBottom: 8 }}>NOTES.XLSX</div>
        <div style={{ opacity: 0.7, lineHeight: 1.6 }}>2 goals? · sub 62' · ??</div>
      </Scrap>

      <Scrap x={560} y={330} rot={-6} delay={52} w={380}>
        <div style={{ letterSpacing: 2, fontSize: 15, marginBottom: 8 }}>CAMERA ROLL</div>
        <div style={{ opacity: 0.7, lineHeight: 1.6 }}>IMG_4471.MOV · 1:12:04</div>
      </Scrap>

      <Caption
        delay={8}
        bottom={210}
        size={54}
        lines={[{ t: "Players are constantly" }, { t: "developing." }, { t: "Most of it never gets tracked.", gold: true }]}
      />

      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: 80,
          right: 80,
          height: 1,
          background: IVORY,
          opacity: ease(frame, 40, 60, 0, 0.18),
        }}
      />
    </SceneShell>
  );
};
