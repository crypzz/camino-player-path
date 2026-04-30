import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadInter("normal", { weights: ["600"], subsets: ["latin"] });

const BG = "#0A0C12";
const GOLD = "#E8B400";
const WHITE = "#F4F4F2";

const TEXT = "What if the camera coached too?";

export const FCHookScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const charsShown = Math.min(TEXT.length, Math.floor(interpolate(frame, [6, 60], [0, TEXT.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const visible = TEXT.slice(0, charsShown);

  const labelOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const underline = spring({ frame: frame - 60, fps, config: { damping: 22 } });
  const cursorOn = Math.floor(frame / 8) % 2 === 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center", padding: "0 70px" }}>
      <div style={{
        fontFamily: bodyFont, fontSize: 26, color: GOLD, letterSpacing: "0.36em",
        marginBottom: 50, opacity: labelOp,
      }}>
        INTRODUCING
      </div>
      <div style={{
        fontFamily, fontWeight: 800, fontSize: 110, color: WHITE,
        letterSpacing: "-0.03em", lineHeight: 1.05, textAlign: "center",
      }}>
        {visible}
        <span style={{ color: GOLD, opacity: cursorOn ? 1 : 0 }}>|</span>
      </div>
      <div style={{
        marginTop: 36, height: 6, backgroundColor: GOLD,
        width: `${interpolate(underline, [0, 1], [0, 480])}px`,
        boxShadow: `0 0 24px ${GOLD}aa`,
      }} />
    </AbsoluteFill>
  );
};
