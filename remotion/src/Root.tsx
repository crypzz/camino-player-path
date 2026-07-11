import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { Promo45Video } from "./Promo45Video";
import { WorldCupLegacyReel } from "./WorldCupLegacyReel";

export const RemotionRoot = () => (
  <>
    <Composition
      id="main"
      component={MainVideo}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="promo45"
      component={Promo45Video}
      durationInFrames={1350}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="worldcup-legacy"
      component={WorldCupLegacyReel}
      durationInFrames={930}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
