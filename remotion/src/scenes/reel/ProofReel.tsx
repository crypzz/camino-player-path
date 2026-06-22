import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, FONT, glow } from "../../theme";

const Quote: React.FC<{ text: string; who: string; role: string }> = ({ text, who, role }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 18 }, durationInFrames: 24 });
  const o = interpolate(frame, [0, 8, 40, 50], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 60 }}>
      <div style={{ opacity: o, transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`, textAlign: "center", maxWidth: 880 }}>
        <div style={{ fontSize: 70, fontWeight: 900, color: COLORS.white, lineHeight: 1.1, letterSpacing: -1 }}>
          “{text}”
        </div>
        <div style={{ marginTop: 30, display: "flex", gap: 14, alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.yellow}, ${COLORS.yellowDeep})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 900,
              color: "#000",
            }}
          >
            {who[0]}
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.white }}>{who}</div>
            <div style={{ fontSize: 22, color: COLORS.yellow, fontWeight: 700 }}>{role}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ProfileCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 16 }, durationInFrames: 26 });
  const badge = spring({ frame: frame - 30, fps, config: { damping: 10 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 720,
          transform: `scale(${0.85 + p * 0.15})`,
          opacity: p,
          borderRadius: 28,
          padding: 40,
          background: "linear-gradient(160deg, rgba(30,30,30,0.95), rgba(10,10,10,0.95))",
          border: `1px solid ${COLORS.yellow}44`,
          boxShadow: "0 40px 100px -30px rgba(0,0,0,0.9)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: 24,
              background: `linear-gradient(135deg, ${COLORS.yellow}, ${COLORS.yellowDeep})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              fontWeight: 900,
              color: "#000",
            }}
          >
            10
          </div>
          <div>
            <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.white }}>Marcus Silva</div>
            <div style={{ fontSize: 24, color: COLORS.muted, fontWeight: 700 }}>Attacking Mid · U16</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
          {[
            ["3,482", "TOUCHES"],
            ["11.2km", "DISTANCE"],
            ["92%", "PASS %"],
          ].map(([v, l]) => (
            <div key={l} style={{ flex: 1, textAlign: "center", padding: 18, borderRadius: 16, background: "rgba(255,255,255,0.04)" }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: COLORS.yellow, textShadow: glow(COLORS.yellow, 14) }}>{v}</div>
              <div style={{ fontSize: 18, color: COLORS.muted, fontWeight: 700, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 28,
            transform: `scale(${badge})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "16px 24px",
            borderRadius: 999,
            background: COLORS.yellow,
            color: "#000",
            fontSize: 26,
            fontWeight: 900,
            letterSpacing: 0.5,
            boxShadow: glow(COLORS.yellow, 24),
          }}
        >
          ✓ READY FOR THE NEXT LEVEL
        </div>
      </div>
    </AbsoluteFill>
  );
};

// SCENE 4 — THE PROOF (14-22s). Social proof + verified profile.
export const ProofReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: FONT, backgroundColor: COLORS.bg }}>
      <Sequence durationInFrames={52}>
        <Quote text="This changes everything." who="James Carter" role="Pro Scout" />
      </Sequence>
      <Sequence from={52} durationInFrames={52}>
        <Quote text="Now I see the real player." who="Coach Diallo" role="Academy Director" />
      </Sequence>
      <Sequence from={104} durationInFrames={52}>
        <Quote text="Finally, I understand the game." who="Maria L." role="Parent" />
      </Sequence>
      <Sequence from={156}>
        <ProfileCard />
      </Sequence>
      <Sequence from={210}>
        <FinalLine />
      </Sequence>
    </AbsoluteFill>
  );
};

const FinalLine: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 200 }}>
      <div style={{ opacity: o, textAlign: "center", fontSize: 64, fontWeight: 900, color: COLORS.white, letterSpacing: -1 }}>
        From invisible
        <span style={{ display: "block", color: COLORS.yellow, textShadow: `0 0 36px ${COLORS.yellow}` }}>to unforgettable.</span>
      </div>
    </AbsoluteFill>
  );
};
