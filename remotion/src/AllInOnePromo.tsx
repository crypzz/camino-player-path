import { AbsoluteFill, Series } from "remotion";
import { AIOHookScene } from "./scenes/allinone/AIOHookScene";
import { AIOProblemScene } from "./scenes/allinone/AIOProblemScene";
import { AIORevealScene } from "./scenes/allinone/AIORevealScene";
import { AIOCPIScene } from "./scenes/allinone/AIOCPIScene";
import { AIODashboardScene } from "./scenes/allinone/AIODashboardScene";
import { AIOVideoAIScene } from "./scenes/allinone/AIOVideoAIScene";
import { AIORolesScene } from "./scenes/allinone/AIORolesScene";
import { AIOCTAScene } from "./scenes/allinone/AIOCTAScene";

export const AllInOnePromo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
      <Series>
        <Series.Sequence durationInFrames={90}><AIOHookScene /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><AIOProblemScene /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><AIORevealScene /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><AIOCPIScene /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><AIODashboardScene /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><AIOVideoAIScene /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><AIORolesScene /></Series.Sequence>
        <Series.Sequence durationInFrames={150}><AIOCTAScene /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
