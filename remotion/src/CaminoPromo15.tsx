import { AbsoluteFill, Series } from "remotion";
import { Promo15HookScene } from "./scenes/promo15/Promo15HookScene";
import { Promo15ProofScene } from "./scenes/promo15/Promo15ProofScene";
import { Promo15TaglineScene } from "./scenes/promo15/Promo15TaglineScene";
import { Promo15CloseScene } from "./scenes/promo15/Promo15CloseScene";

export const CaminoPromo15 = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
      <Series>
        <Series.Sequence durationInFrames={90}>
          <Promo15HookScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={180}>
          <Promo15ProofScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <Promo15TaglineScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <Promo15CloseScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
