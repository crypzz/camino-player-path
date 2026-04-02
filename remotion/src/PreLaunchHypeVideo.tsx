import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { HypeHookScene } from "./scenes/HypeHookScene";
import { HypeProblemScene } from "./scenes/HypeProblemScene";
import { HypeFeatureTeaseScene } from "./scenes/HypeFeatureTeaseScene";
import { HypeCPITeaseScene } from "./scenes/HypeCPITeaseScene";
import { HypeProfileTeaseScene } from "./scenes/HypeProfileTeaseScene";
import { HypeLaunchCloseScene } from "./scenes/HypeLaunchCloseScene";

const T = 15;
const t = () => springTiming({ config: { damping: 200 }, durationInFrames: T });

// 6 scenes with 5 transitions × 15 = 75 overlap
// 125 + 130 + 150 + 135 + 130 + 105 = 775 + 125 = 900 total with overlap accounted

export const PreLaunchHypeVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={125}>
          <HypeHookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={t()} />

        <TransitionSeries.Sequence durationInFrames={130}>
          <HypeProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={t()} />

        <TransitionSeries.Sequence durationInFrames={150}>
          <HypeFeatureTeaseScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={t()} />

        <TransitionSeries.Sequence durationInFrames={135}>
          <HypeCPITeaseScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={t()} />

        <TransitionSeries.Sequence durationInFrames={130}>
          <HypeProfileTeaseScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={t()} />

        <TransitionSeries.Sequence durationInFrames={105}>
          <HypeLaunchCloseScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
