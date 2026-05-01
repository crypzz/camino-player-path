import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhotoBG, display, body, GOLD, IVORY } from "./_shared";

const DUR = 150;

export const AIOCTAScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const taglineS = spring({ frame: frame - 6, fps, config: { damping: 18 } });
  const taglineO = interpolate(taglineS, [0, 1], [0, 1]);
  const taglineY = interpolate(taglineS, [0, 1], [40, 0]);

  const lineW = interpolate(frame, [30, 55], [0, 100], { extrapolateRight: "clamp" });

  const domainS = spring({ frame: frame - 50, fps, config: { damping: 20 } });
  const domainO = interpolate(domainS, [0, 1], [0, 1]);
  const domainY = interpolate(domainS, [0, 1], [20, 0]);

  const liveBlink = (Math.sin(frame * 0.25) + 1) / 2;

  return (
    <AbsoluteFill>
      <PhotoBG src="aio/cta-stadium.jpg" duration={DUR} zoomFrom={1.04} zoomTo={1.16} overlayStrength={0.78} align="bottom" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 120, color: IVORY,
          textAlign: "center", letterSpacing: "-0.05em", lineHeight: 0.95,
          opacity: taglineO, transform: `translateY(${taglineY}px)`,
          textShadow: "0 6px 40px rgba(0,0,0,0.7)",
        }}>
          Be <span style={{ color: GOLD }}>seen.</span><br />
          Be <span style={{ color: GOLD }}>tracked.</span><br />
          Be <span style={{ color: GOLD }}>signed.</span>
        </div>

        <div style={{
          marginTop: 40, height: 3, backgroundColor: GOLD,
          width: `${lineW * 4}px`, maxWidth: 500,
          boxShadow: "0 0 18px rgba(232,180,0,0.6)",
        }} />

        <div style={{
          marginTop: 50, opacity: domainO, transform: `translateY(${domainY}px)`,
          textAlign: "center",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 14,
            padding: "8px 18px", marginBottom: 22,
            background: "rgba(220,38,38,0.18)", border: "1px solid #DC2626",
            borderRadius: 999,
          }}>
            <div style={{
              width: 12, height: 12, borderRadius: 999,
              backgroundColor: "#DC2626", opacity: 0.4 + liveBlink * 0.6,
              boxShadow: `0 0 ${10 + liveBlink * 10}px #DC2626`,
            }} />
            <div style={{ fontFamily: body, fontWeight: 700, fontSize: 20, color: "#FCA5A5", letterSpacing: 3, textTransform: "uppercase" }}>
              Live now
            </div>
          </div>
          <div style={{
            fontFamily: display, fontWeight: 800, fontSize: 52, color: IVORY,
            letterSpacing: "-0.02em",
          }}>
            caminodevelopment<span style={{ color: GOLD }}>.com</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
