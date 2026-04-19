import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AICoachHookScene } from "./scenes/ai-coach/AICoachHookScene";
import { ChatRevealScene } from "./scenes/ai-coach/ChatRevealScene";
import { UseCasesScene } from "./scenes/ai-coach/UseCasesScene";
import { ReportScene } from "./scenes/ai-coach/ReportScene";
import { AICoachCTAScene } from "./scenes/ai-coach/AICoachCTAScene";

export const AICoachReelVideo = () => {
  return (
    <AbsoluteFill style={{ background: "#0D1117" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={100}>
          <AICoachHookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        <TransitionSeries.Sequence durationInFrames={180}>
          <ChatRevealScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        <TransitionSeries.Sequence durationInFrames={170}>
          <UseCasesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        <TransitionSeries.Sequence durationInFrames={170}>
          <ReportScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 10 })} />

        <TransitionSeries.Sequence durationInFrames={130}>
          <AICoachCTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
