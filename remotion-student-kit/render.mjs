import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";
import path from "path";

const entry = path.resolve("src/index.ts");
console.log("bundling...");
const serveUrl = await bundle({ entryPoint: entry });
const composition = await selectComposition({ serveUrl, id: "CrediSlides" });
console.log(`comp ${composition.durationInFrames}f @ ${composition.fps}fps`);

const output = process.env.OUT || path.resolve("out", "CrediSlides.mp4");
console.log("will write:", output);
let last = 0;
await renderMedia({
  serveUrl,
  composition,
  codec: "h264",
  output,
  crf: 18,
  pixelFormat: "yuv420p",
  x264Preset: "slow",
  timeoutInMilliseconds: 90000,
  onProgress: ({ progress }) => {
    const pct = Math.round(progress * 100);
    if (pct >= last + 5) {
      last = pct;
      console.log(`render ${pct}%`);
    }
  },
});
console.log("DONE:", output);
