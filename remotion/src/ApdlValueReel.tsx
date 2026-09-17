import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { CostScene } from "./scenes/apdl/CostScene";
import { WhatYouGetScene } from "./scenes/apdl/WhatYouGetScene";
import { ParentViewScene } from "./scenes/apdl/ParentViewScene";
import { DevelopmentRecordScene } from "./scenes/apdl/DevelopmentRecordScene";
import { CloseScene } from "./scenes/apdl/CloseScene";
import { BG } from "./scenes/apdl/_shared";

const T = 8;
// 120 + 200 + 215 + 215 + 122 = 872 - (4 * 8) = 840 frames @30fps = 28s
export const APDL_DURATION = 840;

const trans = (presentation: Parameters<typeof TransitionSeries.Transition>[0]["presentation"]) => (
  <TransitionSeries.Transition
    presentation={presentation}
    timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
  />
);

export const ApdlValueReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={120}>
          <CostScene />
        </TransitionSeries.Sequence>

        {trans(fade())}

        <TransitionSeries.Sequence durationInFrames={200}>
          <WhatYouGetScene />
        </TransitionSeries.Sequence>

        {trans(wipe({ direction: "from-bottom" }))}

        <TransitionSeries.Sequence durationInFrames={215}>
          <ParentViewScene />
        </TransitionSeries.Sequence>

        {trans(wipe({ direction: "from-right" }))}

        <TransitionSeries.Sequence durationInFrames={215}>
          <DevelopmentRecordScene />
        </TransitionSeries.Sequence>

        {trans(fade())}

        <TransitionSeries.Sequence durationInFrames={122}>
          <CloseScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
