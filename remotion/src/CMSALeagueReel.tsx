import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { HookScene } from "./scenes/cmsa/HookScene";
import { StandingsScene } from "./scenes/cmsa/StandingsScene";
import { TopScorersScene } from "./scenes/cmsa/TopScorersScene";
import { TeamFormScene } from "./scenes/cmsa/TeamFormScene";
import { LogMatchScene } from "./scenes/cmsa/LogMatchScene";
import { CTAScene } from "./scenes/cmsa/CTAScene";
import { NAVY } from "./scenes/cmsa/_shared";

const T = springTiming({ config: { damping: 200 }, durationInFrames: 12 });

const Grain: React.FC = () => (
  <AbsoluteFill style={{
    pointerEvents: "none",
    opacity: 0.06,
    mixBlendMode: "overlay",
    background: "repeating-radial-gradient(circle, rgba(255,255,255,0.08) 0px, transparent 1px, transparent 2px)",
  }} />
);

const Vignette: React.FC = () => (
  <AbsoluteFill style={{
    pointerEvents: "none",
    background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
  }} />
);

export const CMSALeagueReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={105}><HookScene /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={T} />
        <TransitionSeries.Sequence durationInFrames={180}><StandingsScene /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={T} />
        <TransitionSeries.Sequence durationInFrames={150}><TopScorersScene /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={T} />
        <TransitionSeries.Sequence durationInFrames={120}><TeamFormScene /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={T} />
        <TransitionSeries.Sequence durationInFrames={150}><LogMatchScene /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={T} />
        <TransitionSeries.Sequence durationInFrames={135}><CTAScene /></TransitionSeries.Sequence>
      </TransitionSeries>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
