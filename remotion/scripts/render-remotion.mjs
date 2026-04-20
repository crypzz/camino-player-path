import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (config) => config,
});

const browser = await openBrowser("chrome", {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? "/bin/chromium",
  chromiumOptions: {
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  },
  chromeMode: "chrome-for-testing",
});

const compositionId = process.argv[2] || "main";
const outputMap = {
  "main": "/mnt/documents/camino-vertical-ig.mp4",
  "path-to-pro": "/mnt/documents/camino-path-to-pro.mp4",
  "level-up": "/mnt/documents/camino-level-up.mp4",
  "platform-promo": "/mnt/documents/camino-platform-promo.mp4",
  "identity-promo": "/mnt/documents/camino-identity-promo.mp4",
  "pre-launch-hype": "/mnt/documents/camino-pre-launch-hype.mp4",
  "countdown-teaser": "/mnt/documents/camino-countdown-teaser.mp4",
  "go-pro": "/mnt/documents/camino-go-pro.mp4",
  "video-analysis": "/mnt/documents/camino-video-analysis.mp4",
  "reel-comparison": "/mnt/documents/camino-reel-comparison.mp4",
  "ai-coach-reel": "/mnt/documents/camino-ai-coach-reel.mp4",
  "camino-promo-15": "/mnt/documents/camino-promo-15.mp4",
};
const outputLocation = outputMap[compositionId] || `/mnt/documents/${compositionId}.mp4`;

const composition = await selectComposition({
  serveUrl: bundled,
  id: compositionId,
  puppeteerInstance: browser,
});

await renderMedia({
  composition,
  serveUrl: bundled,
  codec: "h264",
  outputLocation,
  puppeteerInstance: browser,
  muted: true,
  concurrency: 1,
});

await browser.close({ silent: false });
console.log(`Done! Output: ${outputLocation}`);
