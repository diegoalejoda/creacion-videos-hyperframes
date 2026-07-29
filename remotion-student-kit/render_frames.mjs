import { bundle } from "@remotion/bundler";
import { selectComposition, renderFrames } from "@remotion/renderer";
import path from "path";
import fs from "fs";

const entry = path.resolve("src/index.ts");
console.log("bundling...");
const serveUrl = await bundle({ entryPoint: entry });
const composition = await selectComposition({ serveUrl, id: "CrediSlides" });
console.log(`comp ${composition.durationInFrames}f @ ${composition.fps}fps`);

const outDir = path.resolve("frames_seq");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

await renderFrames({
  serveUrl,
  composition,
  outputDir: outDir,
  imageFormat: "jpeg",
  jpegQuality: 95,
  timeoutInMilliseconds: 90000,
  onFrameUpdate: (framesRendered) => {
    if (framesRendered % 200 === 0)
      console.log(`frames ${framesRendered}/${composition.durationInFrames}`);
  },
});

const files = fs.readdirSync(outDir);
console.log("FRAMES DONE:", files.length, "sample:", files.slice(0, 2).join(", "));
