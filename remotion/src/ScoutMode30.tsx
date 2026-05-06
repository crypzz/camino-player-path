import { AbsoluteFill, Series } from "remotion";
import { SMHookScene } from "./scenes/scout/SMHookScene";
import { SMCpiScene } from "./scenes/scout/SMCpiScene";
import { SMLeaderboardScene } from "./scenes/scout/SMLeaderboardScene";
import { SMVideoAIScene } from "./scenes/scout/SMVideoAIScene";
import { SMPassportScene } from "./scenes/scout/SMPassportScene";
import { SMCTAScene } from "./scenes/scout/SMCTAScene";

// 30s @ 30fps = 900 frames
// Hook 60 | CPI 180 | Leaderboard 180 | VideoAI 180 | Passport 180 | CTA 120
export const ScoutMode30 = () => (
  <AbsoluteFill style={{ backgroundColor: "#0A0C12" }}>
    <Series>
      <Series.Sequence durationInFrames={60}><SMHookScene /></Series.Sequence>
      <Series.Sequence durationInFrames={180}><SMCpiScene /></Series.Sequence>
      <Series.Sequence durationInFrames={180}><SMLeaderboardScene /></Series.Sequence>
      <Series.Sequence durationInFrames={180}><SMVideoAIScene /></Series.Sequence>
      <Series.Sequence durationInFrames={180}><SMPassportScene /></Series.Sequence>
      <Series.Sequence durationInFrames={120}><SMCTAScene /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
