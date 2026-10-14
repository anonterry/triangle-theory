// Generates r/<zone>/index.html: tiny pages whose <head> carries the Open Graph / Twitter tags that
// Discord and other chat apps read for link previews, then forwards visitors to the quiz app.
// Usage: node tools/build-pages.js [baseUrl]   (default: https://anonterry.github.io/triangle-theory)
const fs = require("fs"), path = require("path");
global.window = {};
require("../js/regions.js");
const base = (process.argv[2] || "https://anonterry.github.io/triangle-theory").replace(/\/$/, "");
const esc = s => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
for (const r of window.REGIONS) {
  const title = `Triangle Theory result: ${r.name}`, url = `${base}/r/${r.id}/`, img = `${base}/og/${r.id}.png`;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(r.name)} · Triangle Theory</title>
<meta name="description" content="${esc(r.desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Triangle Theory">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(r.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Triangle chart with the ${esc(r.name)} zone highlighted">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(r.desc)}">
<meta name="twitter:image" content="${img}">
<meta name="theme-color" content="#061317">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#061317;color:#f2fbf8;font:16px system-ui,sans-serif;text-align:center}a{color:#ffb347}</style>
<script>location.replace("../../" + location.search + location.hash);</script>
</head>
<body>
<p>Opening the result&hellip; <a href="../../">Continue to Triangle Theory</a></p>
</body>
</html>
`;
  const dir = path.join(__dirname, "..", "r", r.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}
console.log("wrote", window.REGIONS.length, "pages");
