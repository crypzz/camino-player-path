import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
const { fontFamily: body } = loadInter("normal", { weights: ["500", "600"], subsets: ["latin"] });

export const ReplaceVeoScene = () => {
  return (
    <ReplaceTemplate
      brandName="Veo"
      brandColor="#FF6B00"
      brandTagline="Camera & Highlights"
      caminoTitle="AI Video Analysis"
      caminoSubtitle="Auto tagging • Highlights • Heatmaps"
      mockContent={<VideoMock />}
    />
  );
};

const VideoMock = () => (
  <div style={{ width: "100%", height: "100%", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ flex: 1, background: "linear-gradient(135deg, #1F2937, #0D1117)", borderRadius: 16, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(232,180,0,0.15), transparent 50%)" }} />
      <div style={{ position: "absolute", top: 16, left: 16, padding: "6px 12px", background: "rgba(220,38,38,0.9)", borderRadius: 6, fontSize: 18, color: "#fff", fontWeight: 700, fontFamily: body }}>● LIVE</div>
      <div style={{ position: "absolute", bottom: 20, left: 16, right: 16, height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 3 }}>
        <div style={{ width: "62%", height: "100%", background: "#E8B400", borderRadius: 3 }} />
      </div>
    </div>
    <div style={{ display: "flex", gap: 10 }}>
      {["GOAL 12'", "ASSIST 24'", "SHOT 38'", "TACKLE 52'"].map((t) => (
        <div key={t} style={{ flex: 1, padding: "10px 8px", background: "rgba(232,180,0,0.15)", border: "1px solid #E8B400", borderRadius: 8, fontSize: 16, color: "#E8B400", fontWeight: 700, fontFamily: body, textAlign: "center" }}>{t}</div>
      ))}
    </div>
  </div>
);

export const ReplaceTemplate = ({
  brandName, brandColor, brandTagline, caminoTitle, caminoSubtitle, mockContent,
}: { brandName: string; brandColor: string; brandTagline: string; caminoTitle: string; caminoSubtitle: string; mockContent: React.ReactNode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-30): card slams in
  // Phase 2 (30-55): REPLACED stamp rotates in + shake
  // Phase 3 (55-110): Camino mock slides up, card fades
  const cardS = spring({ frame, fps, config: { damping: 8, stiffness: 200 } });
  const cardScale = interpolate(cardS, [0, 1], [1.4, 1]);
  const cardShake = frame >= 25 && frame < 45 ? Math.sin(frame * 1.2) * 8 : 0;
  const cardOpacity = interpolate(frame, [45, 65], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const stampS = spring({ frame: frame - 26, fps, config: { damping: 6, stiffness: 180 } });
  const stampScale = interpolate(stampS, [0, 1], [3, 1]);
  const stampRot = interpolate(stampS, [0, 1], [-30, -12]);
  const stampOpacity = interpolate(frame, [26, 36, 60, 70], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const mockS = spring({ frame: frame - 48, fps, config: { damping: 18, stiffness: 140 } });
  const mockY = interpolate(mockS, [0, 1], [200, 0]);

  // Card slides up and fades out as it gets stamped
  const cardExitY = interpolate(frame, [50, 70], [0, -300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0D1117", fontFamily: body }}>
      {/* Camino mock — fills screen, behind card */}
      <div style={{
        position: "absolute", inset: 0, padding: "120px 60px 60px",
        transform: `translateY(${mockY}px)`, opacity: mockS,
      }}>
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontFamily: body, fontSize: 30, color: "#E8B400", fontWeight: 600, letterSpacing: 4, textTransform: "uppercase" }}>
            Camino delivers
          </div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 96, color: "#fff", marginTop: 12, lineHeight: 1 }}>
            {caminoTitle}
          </div>
          <div style={{ fontFamily: body, fontSize: 32, color: "rgba(255,255,255,0.7)", marginTop: 12 }}>
            {caminoSubtitle}
          </div>
        </div>
        <div style={{
          width: "100%", height: 1480,
          background: "linear-gradient(180deg, #161B22, #0D1117)",
          borderRadius: 28, border: "1px solid rgba(232,180,0,0.4)",
          boxShadow: "0 20px 80px rgba(232,180,0,0.2)",
          overflow: "hidden",
        }}>
          {mockContent}
        </div>
      </div>

      {/* Competitor card — centered, slams in then exits up */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80, opacity: cardOpacity }}>
        <div style={{
          width: "100%", maxWidth: 920, position: "relative",
          transform: `scale(${cardScale}) translateY(${cardExitY}px) translateX(${cardShake}px)`,
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc)`,
            borderRadius: 32, padding: 56, display: "flex", flexDirection: "column", gap: 24,
            boxShadow: `0 30px 80px ${brandColor}80`,
          }}>
            <div style={{ fontFamily: body, fontSize: 30, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
              You're paying for
            </div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 160, color: "#fff", lineHeight: 0.95 }}>
              {brandName}
            </div>
            <div style={{ fontFamily: body, fontSize: 34, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
              {brandTagline}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              {["$$$", "Limited", "Siloed"].map((t) => (
                <div key={t} style={{ padding: "10px 20px", background: "rgba(0,0,0,0.35)", borderRadius: 8, fontSize: 22, color: "#fff", fontWeight: 600 }}>{t}</div>
              ))}
            </div>
          </div>

          {/* REPLACED stamp */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: `translate(-50%, -50%) rotate(${stampRot}deg) scale(${stampScale})`,
            opacity: stampOpacity,
          }}>
            <div style={{
              padding: "24px 70px", border: "10px solid #DC2626", color: "#DC2626",
              fontFamily: display, fontWeight: 800, fontSize: 110, letterSpacing: 4,
              background: "rgba(13,17,23,0.9)", borderRadius: 10,
              boxShadow: "0 0 80px rgba(220,38,38,0.7)",
            }}>
              REPLACED
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
