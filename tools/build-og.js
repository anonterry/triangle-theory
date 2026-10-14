// Renders og/<zone>.png (1200x630) with the site's own chart code and real fonts.
const { chromium } = require("playwright"), fs = require("fs"), path = require("path");
const site = path.resolve(process.argv[2] || "site"), out = path.resolve(process.argv[3] || "og");
const fonts = (fam, w) => `@font-face{font-family:"${fam}";font-weight:${w};src:url("file://${path.resolve("node_modules/@fontsource", fam === "Fraunces" ? "fraunces" : "dm-sans", "files", (fam === "Fraunces" ? "fraunces" : "dm-sans") + "-latin-" + w + "-normal.woff2")}")}`;
const css = [["Fraunces", 500], ["Fraunces", 600], ["DM Sans", 500], ["DM Sans", 600], ["DM Sans", 700], ["DM Sans", 800]].map(([f, w]) => fonts(f, w)).join("\n");
const html = `<!doctype html><meta charset=utf-8><style>${css}</style><canvas id=c></canvas>
<script src="file://${site}/js/regions.js"></script><script src="file://${site}/js/chart.js"></script>`;
(async () => {
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(path.dirname(out), "og-build.html"), html);
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto("file://" + path.join(path.dirname(out), "og-build.html"));
  await p.evaluate(async () => { await Promise.all([["500 20px Fraunces"], ["600 20px Fraunces"], ["500 20px 'DM Sans'"], ["600 20px 'DM Sans'"], ["700 20px 'DM Sans'"], ["800 20px 'DM Sans'"]].map(f => document.fonts.load(f[0]))); });
  for (const id of await p.evaluate(() => window.REGIONS.map(r => r.id))) {
    const data = await p.evaluate(id => { const r = window.REGIONS.find(x => x.id === id); window.renderOG(document.getElementById("c"), r, "#ffb347"); return document.getElementById("c").toDataURL("image/png").split(",")[1]; }, id);
    fs.writeFileSync(path.join(out, id + ".png"), Buffer.from(data, "base64"));
  }
  await b.close(); console.log("done");
})();
