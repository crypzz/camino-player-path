import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { GoProHookScene } from "./scenes/GoProHookScene";
import { RealityCheckScene } from "./scenes/RealityCheckScene";
import { ProblemStackScene } from "./scenes/ProblemStackScene";
import { PivotScene } from "./scenes/PivotScene";
import { SolutionStackScene } from "./scenes/SolutionStackScene";
import { ProofProfileScene } from "./scenes/ProofProfileScene";
import { GetSeenScene } from "./scenes/GetSeenScene";
import { GoProCloseScene } from "./scenes/GoProCloseScene";

export const GoProVideo = () => {
  return (
    <TransitionSeries>
      {/* Scene 1: Hook — 0-3s (90 frames) */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <GoProHookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 12 })}
      />

      {/* Scene 2: Reality Check — 3-6.5s (105 frames) */}
      <TransitionSeries.Sequence durationInFrames={105}>
        <RealityCheckScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 12 })}
      />

      {/* Scene 3: Problems — 6.5-12s (165 frames) */}
      <TransitionSeries.Sequence durationInFrames={165}>
        <ProblemStackScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 15 })}
      />

      {/* Scene 4: Pivot — 12-16s (120 frames) */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <PivotScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 12 })}
      />

      {/* Scene 5: Solutions — 16-21s (150 frames) */}
      <TransitionSeries.Sequence durationInFrames={150}>
        <SolutionStackScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 12 })}
      />

      {/* Scene 6: Profile — 21-25s (120 frames) */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <ProofProfileScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 12 })}
      />

      {/* Scene 7: Get Seen — 25-28s (90 frames) */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <GetSeenScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 10 })}
      />

      {/* Scene 8: Close — 28-30s (75 frames) */}
      <TransitionSeries.Sequence durationInFrames={75}>
        <GoProCloseScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
