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
