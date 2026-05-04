import { AbsoluteFill, Series } from "remotion";
import { ESCHookScene } from "./scenes/everyspot/ESCHookScene";
import { ESCTensionScene } from "./scenes/everyspot/ESCTensionScene";
import { ESCRevealScene } from "./scenes/everyspot/ESCRevealScene";
import { ESCProofScene } from "./scenes/everyspot/ESCProofScene";
import { ESCCloseScene } from "./scenes/everyspot/ESCCloseScene";

export const EverySpotCountsPromo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
      <Series>
        <Series.Sequence durationInFrames={120}><ESCHookScene /></Series.Sequence>
        <Series.Sequence durationInFrames={150}><ESCTensionScene /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><ESCRevealScene /></Series.Sequence>
        <Series.Sequence durationInFrames={330}><ESCProofScene /></Series.Sequence>
        <Series.Sequence durationInFrames={180}><ESCCloseScene /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
