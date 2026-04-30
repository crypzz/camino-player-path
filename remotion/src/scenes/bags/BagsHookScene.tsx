import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["600"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const WHITE = "#FFFFFF";

export const BagsHookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Big number slam
  const slam = spring({ frame, fps, config: { damping: 11, stiffness: 180 } });
  const numScale = interpolate(slam, [0, 1], [2.4, 1]);
  const numOp = interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });

  // Flash on impact
  const flashOp = interpolate(frame, [4, 8, 18], [0, 0.22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Shake
  const shakeAmt = frame >= 6 && frame <= 18 ? Math.sin((frame - 6) * 2.4) * (1 - (frame - 6) / 12) * 10 : 0;

  // Subline
  const labelS = spring({ frame: frame - 4, fps, config: { damping: 22 } });
  const labelOp = interpolate(labelS, [0, 1], [0, 1]);

  const sub1 = spring({ frame: frame - 28, fps, config: { damping: 20 } });
  const sub1Op = interpolate(sub1, [0, 1], [0, 1]);
  const sub1Y = interpolate(sub1, [0, 1], [24, 0]);

  const sub2 = spring({ frame: frame - 42, fps, config: { damping: 20 } });
  const sub2Op = interpolate(sub2, [0, 1], [0, 1]);
  const sub2Y = interpolate(sub2, [0, 1], [24, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", padding: "0 60px", transform: `translateX(${shakeAmt}px)` }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: GOLD, opacity: flashOp }} />

      <div style={{
        fontFamily: bodyFont, fontWeight: 600, fontSize: 28, color: GOLD,
        letterSpacing: "0.32em", marginBottom: 30, opacity: labelOp, textAlign: "center",
      }}>
        THE BAGS HACKATHON
      </div>

      <div style={{
        fontFamily, fontWeight: 800, fontSize: 200, color: WHITE,
        letterSpacing: "-0.045em", lineHeight: 1,
        opacity: numOp, transform: `scale(${numScale})`,
        textShadow: `0 0 60px ${GOLD}55`,
      }}>
        $4,000,000
      </div>

      <div style={{ marginTop: 40, textAlign: "center" }}>
        <div style={{
          fontFamily, fontWeight: 800, fontSize: 56, color: WHITE,
          letterSpacing: "-0.025em", opacity: sub1Op, transform: `translateY(${sub1Y}px)`,
        }}>
          100 teams.
        </div>
        <div style={{
          fontFamily, fontWeight: 800, fontSize: 56, color: GOLD,
          letterSpacing: "-0.025em", opacity: sub2Op, transform: `translateY(${sub2Y}px)`,
          marginTop: 6,
        }}>
          One mission.
        </div>
      </div>
    </AbsoluteFill>
  );
};
