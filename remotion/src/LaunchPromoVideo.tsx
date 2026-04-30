import { AbsoluteFill, Series } from "remotion";
import { LaunchHookScene } from "./scenes/launch/LaunchHookScene";
import { LaunchProblemStackScene } from "./scenes/launch/LaunchProblemStackScene";
import { LaunchRevealScene } from "./scenes/launch/LaunchRevealScene";
import { LaunchCPIScene } from "./scenes/launch/LaunchCPIScene";
import { LaunchDashboardScene } from "./scenes/launch/LaunchDashboardScene";
import { LaunchRolesScene } from "./scenes/launch/LaunchRolesScene";
import { LaunchLiveStampScene } from "./scenes/launch/LaunchLiveStampScene";
import { LaunchDomainScene } from "./scenes/launch/LaunchDomainScene";

export const LaunchPromoVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
      <Series>
        <Series.Sequence durationInFrames={75}><LaunchHookScene /></Series.Sequence>
        <Series.Sequence durationInFrames={75}><LaunchProblemStackScene /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><LaunchRevealScene /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><LaunchCPIScene /></Series.Sequence>
        <Series.Sequence durationInFrames={150}><LaunchDashboardScene /></Series.Sequence>
        <Series.Sequence durationInFrames={150}><LaunchRolesScene /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><LaunchLiveStampScene /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><LaunchDomainScene /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
