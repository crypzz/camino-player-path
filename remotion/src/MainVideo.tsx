import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { PersistentBackground } from "./components/PersistentBackground";
import { HookReel } from "./scenes/reel/HookReel";
import { ProblemReel } from "./scenes/reel/ProblemReel";
import { SolutionReel } from "./scenes/reel/SolutionReel";
import { ProofReel } from "./scenes/reel/ProofReel";
import { CloseReel } from "./scenes/reel/CloseReel";
import { COLORS } from "./theme";

// Viral 30s reel: Hook -> Problem -> Solution -> Proof -> Close.
// 30fps. Fast cuts, documentary feel.
export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <PersistentBackground />
      <TransitionSeries>
        {/* HOOK 0-3s */}
        <TransitionSeries.Sequence durationInFrames={95}>
          <HookReel />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 10 })}
        />

        {/* PROBLEM 3-8s */}
        <TransitionSeries.Sequence durationInFrames={155}>
          <ProblemReel />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />

        {/* SOLUTION 8-14s */}
        <TransitionSeries.Sequence durationInFrames={185}>
          <SolutionReel />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 12 })}
        />

        {/* PROOF 14-22s */}
        <TransitionSeries.Sequence durationInFrames={245}>
          <ProofReel />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        {/* CLOSE 22-30s */}
        <TransitionSeries.Sequence durationInFrames={264}>
          <CloseReel />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
