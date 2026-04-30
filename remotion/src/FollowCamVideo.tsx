import { AbsoluteFill, Series } from "remotion";
import { FCHookScene } from "./scenes/followcam/FCHookScene";
import { FCHardwareRevealScene } from "./scenes/followcam/FCHardwareRevealScene";
import { FCAutoFollowScene } from "./scenes/followcam/FCAutoFollowScene";
import { FCLiveStreamScene } from "./scenes/followcam/FCLiveStreamScene";
import { FCHalfTimeStatsScene } from "./scenes/followcam/FCHalfTimeStatsScene";
import { FC3DReplayScene } from "./scenes/followcam/FC3DReplayScene";
import { FCCoachPOVScene } from "./scenes/followcam/FCCoachPOVScene";
import { FCCTAScene } from "./scenes/followcam/FCCTAScene";

export const FollowCamVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
      <Series>
        <Series.Sequence durationInFrames={90}><FCHookScene /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><FCHardwareRevealScene /></Series.Sequence>
        <Series.Sequence durationInFrames={105}><FCAutoFollowScene /></Series.Sequence>
        <Series.Sequence durationInFrames={105}><FCLiveStreamScene /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><FCHalfTimeStatsScene /></Series.Sequence>
        <Series.Sequence durationInFrames={135}><FC3DReplayScene /></Series.Sequence>
        <Series.Sequence durationInFrames={105}><FCCoachPOVScene /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><FCCTAScene /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
