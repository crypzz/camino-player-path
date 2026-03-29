import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { PlatformHookScene } from "./scenes/PlatformHookScene";
import { FitnessShowcaseScene } from "./scenes/FitnessShowcaseScene";
import { LeaderboardShowcaseScene } from "./scenes/LeaderboardShowcaseScene";
import { FeedShowcaseScene } from "./scenes/FeedShowcaseScene";
import { ShareBadgeScene } from "./scenes/ShareBadgeScene";
import { PlatformCloseScene } from "./scenes/PlatformCloseScene";

// 6 scenes, ~130 frames each, with 15-frame transitions = ~600 total
const T = 15;

export const PlatformPromoVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0F14" }}>
      <TransitionSeries>
        {/* Hook: YOUR GAME. YOUR DATA. YOUR REPUTATION. */}
        <TransitionSeries.Sequence durationInFrames={110}>
          <PlatformHookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        {/* Fitness Test showcase */}
        <TransitionSeries.Sequence durationInFrames={130}>
          <FitnessShowcaseScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        {/* Leaderboard showcase */}
        <TransitionSeries.Sequence durationInFrames={130}>
          <LeaderboardShowcaseScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        {/* Social Feed showcase */}
        <TransitionSeries.Sequence durationInFrames={130}>
          <FeedShowcaseScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        {/* Share badge */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <ShareBadgeScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        {/* Close: CAMINO */}
        <TransitionSeries.Sequence durationInFrames={105}>
          <PlatformCloseScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
