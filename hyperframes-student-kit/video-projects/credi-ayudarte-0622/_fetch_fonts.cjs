const https = require("https"), fs = require("fs");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
function get(url, bin) {
  return new Promise((res, rej) => {
    https.get(url, { headers: { "User-Agent": UA } }, r => {
      const ch = [];
      r.on("data", c => ch.push(c));
      r.on("end", () => res(bin ? Buffer.concat(ch) : Buffer.concat(ch).toString()));
    }).on("error", rej);
  });
}
(async () => {
  const css = await get("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@500;700;800;900&family=JetBrains+Mono:wght@700&display=block");
  const blocks = css.split("@font-face").slice(1);
  let out = ""; const seen = {};
  for (const b of blocks) {
    if (!/unicode-range:[^;]*U\+0000-00FF/.test(b)) continue;
    const fam = (b.match(/font-family:\s*'([^']+)'/) || [])[1];
    const wght = (b.match(/font-weight:\s*(\d+)/) || [])[1];
    const url = (b.match(/url\((https:[^)]+\.woff2)\)/) || [])[1];
    if (!fam || !wght || !url) continue;
    const fn = fam.replace(/\s+/g, "") + "-" + wght + ".woff2";
    if (seen[fn]) continue; seen[fn] = 1;
    const buf = await get(url, true);
    fs.writeFileSync("assets/fonts/" + fn, buf);
    out += "@font-face{font-family:'" + fam + "';font-style:normal;font-weight:" + wght + ";font-display:block;src:url('assets/fonts/" + fn + "') format('woff2');}\n";
    console.log("saved", fn, buf.length, "bytes");
  }
  fs.writeFileSync("assets/fonts/fonts.css", out);
  console.log("---FONTS_CSS_START---");
  console.log(out);
})();
