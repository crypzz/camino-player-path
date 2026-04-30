import { AbsoluteFill, Series } from "remotion";
import { BagsHookScene } from "./scenes/bags/BagsHookScene";
import { BagsLockupScene } from "./scenes/bags/BagsLockupScene";
import { BagsPitchScene } from "./scenes/bags/BagsPitchScene";
import { BagsProductMontageScene } from "./scenes/bags/BagsProductMontageScene";
import { BagsTractionScene } from "./scenes/bags/BagsTractionScene";
import { BagsCriteriaScene } from "./scenes/bags/BagsCriteriaScene";
import { BagsLiveScene } from "./scenes/bags/BagsLiveScene";
import { BagsCtaScene } from "./scenes/bags/BagsCtaScene";

export const BagsHackathonVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
      <Series>
        <Series.Sequence durationInFrames={75}><BagsHookScene /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><BagsLockupScene /></Series.Sequence>
        <Series.Sequence durationInFrames={105}><BagsPitchScene /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><BagsProductMontageScene /></Series.Sequence>
        <Series.Sequence durationInFrames={105}><BagsTractionScene /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><BagsCriteriaScene /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><BagsLiveScene /></Series.Sequence>
        <Series.Sequence durationInFrames={75}><BagsCtaScene /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
