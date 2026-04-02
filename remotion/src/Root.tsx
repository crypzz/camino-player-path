import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { PathToProVideo } from "./PathToProVideo";
import { LevelUpVideo } from "./LevelUpVideo";
import { PlatformPromoVideo } from "./PlatformPromoVideo";
import { IdentityPromoVideo } from "./IdentityPromoVideo";
import { PreLaunchHypeVideo } from "./PreLaunchHypeVideo";

export const RemotionRoot = () => (
  <>
    <Composition
      id="main"
      component={MainVideo}
      durationInFrames={750}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="path-to-pro"
      component={PathToProVideo}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="level-up"
      component={LevelUpVideo}
      durationInFrames={402}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="platform-promo"
      component={PlatformPromoVideo}
      durationInFrames={650}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="identity-promo"
      component={IdentityPromoVideo}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="pre-launch-hype"
      component={PreLaunchHypeVideo}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
