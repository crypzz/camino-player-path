import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { TalentScene } from "./scenes/promo/TalentScene";
import { ExposureScene } from "./scenes/promo/ExposureScene";
import { UnseenScene } from "./scenes/promo/UnseenScene";
import { BeatDropScene } from "./scenes/promo/BeatDropScene";
import { AcademyScene } from "./scenes/promo/AcademyScene";
import { PromoCloseScene } from "./scenes/promo/PromoCloseScene";

const T = 15;
const t = () => springTiming({ config: { damping: 200 }, durationInFrames: T });

// Scene durations:
// TalentScene: 130 | ExposureScene: 100 | UnseenScene: 160
// BeatDropScene: 170 | AcademyScene: 130 | PromoCloseScene: 120
// Total = 810 - (5 * 15 overlap) = 735 frames = ~24.5s at 30fps

export const AcademyPromoVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C10" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={130}>
          <TalentScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={t()} />

        <TransitionSeries.Sequence durationInFrames={100}>
          <ExposureScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={t()} />

        <TransitionSeries.Sequence durationInFrames={160}>
          <UnseenScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={t()} />

        <TransitionSeries.Sequence durationInFrames={170}>
          <BeatDropScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={t()} />

        <TransitionSeries.Sequence durationInFrames={130}>
          <AcademyScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={t()} />

        <TransitionSeries.Sequence durationInFrames={120}>
          <PromoCloseScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
