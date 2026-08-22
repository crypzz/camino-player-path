import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { Atmosphere, NAVY } from "./scenes/pathway/_shared";
import { ProblemScene } from "./scenes/pathway/ProblemScene";
import { DashboardScene } from "./scenes/pathway/DashboardScene";
import { UploadAIScene } from "./scenes/pathway/UploadAIScene";
import { FeedbackScene } from "./scenes/pathway/FeedbackScene";
import { DevelopmentScene } from "./scenes/pathway/DevelopmentScene";
import { EndingScene } from "./scenes/pathway/EndingScene";

export const PATHWAY_SCENES = [
  { from: 0, dur: 150, vo: "01" },
  { from: 150, dur: 175, vo: "02" },
  { from: 325, dur: 240, vo: "03" },
  { from: 565, dur: 170, vo: "04" },
  { from: 735, dur: 225, vo: "05" },
  { from: 960, dur: 225, vo: "06" },
];

export const PATHWAY_DURATION = 1185;

export const CaminoPathway: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <Sequence from={0} durationInFrames={150}>
        <ProblemScene />
      </Sequence>
      <Sequence from={150} durationInFrames={175}>
        <DashboardScene />
      </Sequence>
      <Sequence from={325} durationInFrames={240}>
        <UploadAIScene />
      </Sequence>
      <Sequence from={565} durationInFrames={170}>
        <FeedbackScene />
      </Sequence>
      <Sequence from={735} durationInFrames={225}>
        <DevelopmentScene />
      </Sequence>
      <Sequence from={960} durationInFrames={225}>
        <EndingScene />
      </Sequence>

      <Atmosphere />

      {/* Audio — score bed + per-scene voiceover */}
      <Audio src={staticFile("audio/score.wav")} volume={0.85} />
      {PATHWAY_SCENES.map((s) => (
        <Sequence key={s.vo} from={s.from + 8}>
          <Audio src={staticFile(`audio/vo/vo-${s.vo}.wav`)} volume={1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
