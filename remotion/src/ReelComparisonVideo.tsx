import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { ReelHookScene } from "./scenes/reel/ReelHookScene";
import { ReplaceVeoScene } from "./scenes/reel/ReplaceVeoScene";
import { ReplaceTeamSnapScene } from "./scenes/reel/ReplaceTeamSnapScene";
import { ReplaceHudlScene } from "./scenes/reel/ReplaceHudlScene";
import { ReplaceSpreadsheetScene } from "./scenes/reel/ReplaceSpreadsheetScene";
import { MergeScene } from "./scenes/reel/MergeScene";
import { ReelCTAScene } from "./scenes/reel/ReelCTAScene";

export const ReelComparisonVideo = () => {
  return (
    <AbsoluteFill style={{ background: "#0D1117" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <ReelHookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 8 })} />

        <TransitionSeries.Sequence durationInFrames={110}>
          <ReplaceVeoScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 8 })} />

        <TransitionSeries.Sequence durationInFrames={110}>
          <ReplaceTeamSnapScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 8 })} />

        <TransitionSeries.Sequence durationInFrames={110}>
          <ReplaceHudlScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 8 })} />

        <TransitionSeries.Sequence durationInFrames={90}>
          <ReplaceSpreadsheetScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        <TransitionSeries.Sequence durationInFrames={130}>
          <MergeScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        <TransitionSeries.Sequence durationInFrames={110}>
          <ReelCTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
