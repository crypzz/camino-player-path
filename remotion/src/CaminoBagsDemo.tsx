import { AbsoluteFill, Series, useCurrentFrame, interpolate } from "remotion";
import { ColdOpenScene } from "./scenes/bags/ColdOpenScene";
import { ProblemFrameScene } from "./scenes/bags/ProblemFrameScene";
import { ProductRevealScene } from "./scenes/bags/ProductRevealScene";
import { CPIDemoScene } from "./scenes/bags/CPIDemoScene";
import { VideoIntelDemoScene } from "./scenes/bags/VideoIntelDemoScene";
import { LeaderboardDemoScene } from "./scenes/bags/LeaderboardDemoScene";
import { MultiRoleDemoScene } from "./scenes/bags/MultiRoleDemoScene";
import { TractionStampScene } from "./scenes/bags/TractionStampScene";
import { RoadmapTeaseScene } from "./scenes/bags/RoadmapTeaseScene";
import { CloseLogoScene } from "./scenes/bags/CloseLogoScene";

// Scene boundary frames (cumulative)
// 120, 270, 450, 690, 930, 1140, 1380, 1530, 1680, 1800
const flashFrames = [120, 270, 450, 690, 930, 1140, 1380, 1530, 1680];

const FlashOverlay = () => {
  const frame = useCurrentFrame();
  let opacity = 0;
  for (const f of flashFrames) {
    const o = interpolate(frame, [f - 1, f, f + 3], [0, 0.7, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    opacity = Math.max(opacity, o);
  }
  return (
    <div style={{
      position: "absolute", inset: 0,
      backgroundColor: "#FFFFFF",
      opacity, pointerEvents: "none", zIndex: 100,
    }} />
  );
};

export const CaminoBagsDemo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
      <Series>
        <Series.Sequence durationInFrames={120}><ColdOpenScene /></Series.Sequence>
        <Series.Sequence durationInFrames={150}><ProblemFrameScene /></Series.Sequence>
        <Series.Sequence durationInFrames={180}><ProductRevealScene /></Series.Sequence>
        <Series.Sequence durationInFrames={240}><CPIDemoScene /></Series.Sequence>
        <Series.Sequence durationInFrames={240}><VideoIntelDemoScene /></Series.Sequence>
        <Series.Sequence durationInFrames={210}><LeaderboardDemoScene /></Series.Sequence>
        <Series.Sequence durationInFrames={240}><MultiRoleDemoScene /></Series.Sequence>
        <Series.Sequence durationInFrames={150}><TractionStampScene /></Series.Sequence>
        <Series.Sequence durationInFrames={150}><RoadmapTeaseScene /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><CloseLogoScene /></Series.Sequence>
      </Series>
      <FlashOverlay />
    </AbsoluteFill>
  );
};
