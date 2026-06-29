import { AbsoluteFill, Series } from "remotion";
import { Scene1Hook } from "./scenes/promo45/Scene1Hook";
import { Scene2Hub } from "./scenes/promo45/Scene2Hub";
import { Scene3AI } from "./scenes/promo45/Scene3AI";
import { Scene4Impact } from "./scenes/promo45/Scene4Impact";
import { Scene5Close } from "./scenes/promo45/Scene5Close";
import { BG } from "./scenes/promo45/_shared";

// 45s product walkthrough. 30fps. 1350 frames.
export const Promo45Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Series>
        <Series.Sequence durationInFrames={150}>
          <Scene1Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={210}>
          <Scene2Hub />
        </Series.Sequence>
        <Series.Sequence durationInFrames={300}>
          <Scene3AI />
        </Series.Sequence>
        <Series.Sequence durationInFrames={300}>
          <Scene4Impact />
        </Series.Sequence>
        <Series.Sequence durationInFrames={390}>
          <Scene5Close />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
