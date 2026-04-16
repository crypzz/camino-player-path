import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { ProProblemScene } from "./scenes/promo-pro/ProProblemScene";
import { ProProblem2Scene } from "./scenes/promo-pro/ProProblem2Scene";
import { ProIntroScene } from "./scenes/promo-pro/ProIntroScene";
import { ProFeaturesScene } from "./scenes/promo-pro/ProFeaturesScene";
import { ProClubValueScene } from "./scenes/promo-pro/ProClubValueScene";
import { ProFutureScene } from "./scenes/promo-pro/ProFutureScene";
import { ProCloseScene } from "./scenes/promo-pro/ProCloseScene";

const T = 20;

export const ProfessionalPromoVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0D1117" }}>
      <TransitionSeries>
        {/* 0:00–0:07 Problem */}
        <TransitionSeries.Sequence durationInFrames={210}>
          <ProProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        {/* 0:07–0:15 Problem continued */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <ProProblem2Scene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        {/* 0:15–0:30 Intro to Camino */}
        <TransitionSeries.Sequence durationInFrames={450}>
          <ProIntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        {/* 0:30–0:45 Core Features */}
        <TransitionSeries.Sequence durationInFrames={450}>
          <ProFeaturesScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        {/* 0:45–0:55 Club Value */}
        <TransitionSeries.Sequence durationInFrames={300}>
          <ProClubValueScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />

        {/* 0:55–1:00 Future */}
        <TransitionSeries.Sequence durationInFrames={150}>
          <ProFutureScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 25 })}
        />

        {/* Close */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <ProCloseScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
