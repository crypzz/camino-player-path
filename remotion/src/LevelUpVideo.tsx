import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { LevelUpHookScene } from "./scenes/LevelUpHookScene";
import { FitnessTestScene } from "./scenes/FitnessTestScene";
import { ProgressTrackerScene } from "./scenes/ProgressTrackerScene";
import { CoachFeedbackScene } from "./scenes/CoachFeedbackScene";
import { LevelUpCloseScene } from "./scenes/LevelUpCloseScene";

const T = 12;

export const LevelUpVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <LevelUpHookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <FitnessTestScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <ProgressTrackerScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <CoachFeedbackScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <LevelUpCloseScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
