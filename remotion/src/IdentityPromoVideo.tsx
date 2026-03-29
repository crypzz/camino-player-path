import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { IdentityHookScene } from "./scenes/IdentityHookScene";
import { PublicProfileScene } from "./scenes/PublicProfileScene";
import { LevelSystemScene } from "./scenes/LevelSystemScene";
import { RankingFormulaScene } from "./scenes/RankingFormulaScene";
import { StatCardScene } from "./scenes/StatCardScene";
import { LiveRankingsScene } from "./scenes/LiveRankingsScene";
import { IdentityCloseScene } from "./scenes/IdentityCloseScene";

// 7 scenes with 6 transitions × 15 frames = 90 frames overlap
// Total: 120+130+130+130+135+135+120 = 900, minus 90 overlap = 810 visible
// Adjusted durations to hit 900 total frames in composition

export const IdentityPromoVideo = () => {
  const t = (dir: "from-left" | "from-right" | "from-bottom" = "from-left") =>
    springTiming({ config: { damping: 200 }, durationInFrames: 15 });

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={135}>
        <IdentityHookScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={t()} />

      <TransitionSeries.Sequence durationInFrames={145}>
        <PublicProfileScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={t()} />

      <TransitionSeries.Sequence durationInFrames={145}>
        <LevelSystemScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={t()} />

      <TransitionSeries.Sequence durationInFrames={145}>
        <RankingFormulaScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={t()} />

      <TransitionSeries.Sequence durationInFrames={150}>
        <StatCardScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={t()} />

      <TransitionSeries.Sequence durationInFrames={150}>
        <LiveRankingsScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={t()} />

      <TransitionSeries.Sequence durationInFrames={120}>
        <IdentityCloseScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
