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

  return (
    <AbsoluteFill style={{ background: "#0D1117", fontFamily: body }}>
      {/* Top: competitor card */}
      <div style={{
        position: "absolute", top: 120, left: 80, right: 80, height: 600,
        transform: `scale(${cardScale}) translateX(${cardShake}px)`,
        opacity: cardOpacity * cardS,
      }}>
        <div style={{
          width: "100%", height: "100%",
          background: `linear-gradient(135deg, ${brandColor}, ${brandColor}99)`,
          borderRadius: 32, padding: 48, display: "flex", flexDirection: "column", justifyContent: "space-between",
          boxShadow: `0 30px 80px ${brandColor}60`,
        }}>
          <div>
            <div style={{ fontFamily: body, fontSize: 28, color: "rgba(255,255,255,0.7)", fontWeight: 600, marginBottom: 12 }}>
              You're paying for
            </div>
            <div style={{ fontFamily: display, fontWeight: 800, fontSize: 180, color: "#fff", lineHeight: 1 }}>
              {brandName}
            </div>
            <div style={{ fontFamily: body, fontSize: 32, color: "rgba(255,255,255,0.85)", marginTop: 16, fontWeight: 600 }}>
              {brandTagline}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {["$$$", "Limited", "Siloed"].map((t) => (
              <div key={t} style={{ padding: "10px 18px", background: "rgba(0,0,0,0.3)", borderRadius: 8, fontSize: 22, color: "#fff", fontWeight: 600 }}>{t}</div>
            ))}
          </div>
        </div>

        {/* REPLACED stamp */}
        {frame >= 32 && (
          <div style={{
            position: "absolute", top: "40%", left: "50%",
            transform: `translate(-50%, -50%) rotate(${stampRot}deg) scale(${stampScale})`,
            opacity: Math.min(1, stampS),
          }}>
            <div style={{
              padding: "20px 60px", border: "8px solid #DC2626", color: "#DC2626",
              fontFamily: display, fontWeight: 800, fontSize: 100, letterSpacing: 4,
              background: "rgba(13,17,23,0.85)", borderRadius: 8,
              boxShadow: "0 0 60px rgba(220,38,38,0.6)",
            }}>
              REPLACED
            </div>
          </div>
        )}
      </div>

      {/* Bottom: Camino mock */}
      <div style={{
        position: "absolute", bottom: 60, left: 60, right: 60, height: 1100,
        transform: `translateY(${mockY}px)`, opacity: mockS,
      }}>
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontFamily: body, fontSize: 28, color: "#E8B400", fontWeight: 600, letterSpacing: 4, textTransform: "uppercase" }}>
            Camino delivers
          </div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 76, color: "#fff", marginTop: 8 }}>
            {caminoTitle}
          </div>
          <div style={{ fontFamily: body, fontSize: 28, color: "rgba(255,255,255,0.7)", marginTop: 8 }}>
            {caminoSubtitle}
          </div>
        </div>
        <div style={{
          width: "100%", height: 820,
          background: "linear-gradient(180deg, #161B22, #0D1117)",
          borderRadius: 24, border: "1px solid rgba(232,180,0,0.3)",
          boxShadow: "0 20px 60px rgba(232,180,0,0.15)",
          overflow: "hidden",
        }}>
          {mockContent}
        </div>
      </div>
    </AbsoluteFill>
  );
};
