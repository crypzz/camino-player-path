import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";

import { CountdownNumberScene } from "./scenes/CountdownNumberScene";
import { ReasonsScene } from "./scenes/ReasonsScene";
import { PillarsScene } from "./scenes/PillarsScene";
import { BeforeAfterScene } from "./scenes/BeforeAfterScene";
import { ProfileRiseScene } from "./scenes/ProfileRiseScene";
import { EditorialRevealScene } from "./scenes/EditorialRevealScene";
import { StandardCloseScene } from "./scenes/StandardCloseScene";

const T = 20;
const t = () => springTiming({ config: { damping: 200 }, durationInFrames: T });

export const CountdownTeaser = () => (
  <AbsoluteFill style={{ backgroundColor: "#1A1714" }}>
    <TransitionSeries>
      {/* Scene 1: "5" — Days of guessing are over */}
      <TransitionSeries.Sequence durationInFrames={100}>
        <CountdownNumberScene number={5} subtitle="Days of guessing are over" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={t()} />

      {/* Scene 2: "4" — Reasons coaches lose track */}
      <TransitionSeries.Sequence durationInFrames={140}>
        <ReasonsScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={t()} />

      {/* Scene 3: "3" — Pillars that define you */}
      <TransitionSeries.Sequence durationInFrames={140}>
        <PillarsScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={t()} />

      {/* Scene 4: "2" — Before/After */}
      <TransitionSeries.Sequence durationInFrames={150}>
        <BeforeAfterScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={t()} />

      {/* Scene 5: "1" — Platform. Your path. */}
      <TransitionSeries.Sequence durationInFrames={150}>
        <ProfileRiseScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={t()} />

      {/* Scene 6: "0" — Logo reveal */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <EditorialRevealScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={t()} />

      {/* Scene 7: Tagline hold */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <StandardCloseScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
