import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: display } = loadJakarta("normal", { weights: ["700", "800"], subsets: ["latin"] });
export const { fontFamily: body } = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

export const NAVY = "#0A0C12";
export const NAVY_2 = "#141821";
export const GOLD = "#E8B400";
export const IVORY = "#F5F5F5";
export const MUTED = "rgba(245,245,245,0.6)";

// Ken Burns photo background with navy gradient overlay
export const PhotoBG: React.FC<{
  src: string;
  duration: number;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
  overlayStrength?: number;
  align?: "top" | "center" | "bottom";
}> = ({ src, duration, zoomFrom = 1.05, zoomTo = 1.18, panX = 0, panY = 0, overlayStrength = 0.65, align = "center" }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [zoomFrom, zoomTo], { extrapolateRight: "clamp" });
  const tx = interpolate(frame, [0, duration], [0, panX], { extrapolateRight: "clamp" });
  const ty = interpolate(frame, [0, duration], [0, panY], { extrapolateRight: "clamp" });
  const objectPos = align === "top" ? "50% 20%" : align === "bottom" ? "50% 80%" : "50% 50%";
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: objectPos,
          transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(10,12,18,${overlayStrength * 0.55}) 0%, rgba(10,12,18,${overlayStrength}) 70%, rgba(10,12,18,${Math.min(overlayStrength + 0.1, 0.95)}) 100%)`,
        }}
      />
      {/* subtle film grain */}
      <AbsoluteFill style={{ opacity: 0.08, mixBlendMode: "overlay", background: "repeating-radial-gradient(circle, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 2px)" }} />
    </AbsoluteFill>
  );
};

export const GoldChip: React.FC<{ children: React.ReactNode; opacity?: number }> = ({ children, opacity = 1 }) => (
  <div style={{
    display: "inline-block",
    padding: "10px 22px",
    borderRadius: 999,
    border: `1px solid ${GOLD}`,
    backgroundColor: "rgba(232,180,0,0.12)",
    color: GOLD,
    fontFamily: body,
    fontWeight: 700,
    fontSize: 22,
    letterSpacing: 3,
    textTransform: "uppercase",
    opacity,
  }}>
    {children}
  </div>
);
