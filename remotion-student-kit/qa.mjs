import { bundle } from "@remotion/bundler";
import { selectComposition, renderStill } from "@remotion/renderer";
import path from "path";

const entry = path.resolve("src/index.ts");
console.log("bundling...");
const serveUrl = await bundle({ entryPoint: entry });
console.log("bundled:", serveUrl);
const composition = await selectComposition({ serveUrl, id: "CrediSlides" });

const frames = process.argv.slice(2).map(Number);
const list = frames.length ? frames : [10, 90, 300, 520, 690, 880, 1100, 1300, 1480, 1660];
for (const f of list) {
  const output = path.resolve("out", `still_${f}.png`);
  await renderStill({ serveUrl, composition, frame: f, output, imageFormat: "png" });
  console.log("still", f);
}
console.log("QA stills done");
