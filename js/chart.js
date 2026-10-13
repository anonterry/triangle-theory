// Draws the triangle chart + result text onto a canvas "share card".
(function () {
  const CW = 900, BOX = { x: 40, y: 80, w: 820, h: 600 };
  const V = { R: [410, 40], S: [110, 560], F: [710, 560] }; // within box
  const pt = (r, s, f) => [r * V.R[0] + s * V.S[0] + f * V.F[0], r * V.R[1] + s * V.S[1] + f * V.F[1]];

  function wrap(ctx, text, maxW) {
    const words = text.split(" "), lines = []; let line = "";
    for (const w of words) {
      const t = line ? line + " " + w : w;
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
    }
    if (line) lines.push(line);
    return lines;
  }
  function splitName(name) {
    const w = name.split(" "); if (w.length < 2) return [name];
    let best = 1, diff = Infinity;
    for (let i = 1; i < w.length; i++) { const d = Math.abs(w.slice(0, i).join(" ").length - w.slice(i).join(" ").length); if (d < diff) { diff = d; best = i; } }
    return [w.slice(0, best).join(" "), w.slice(best).join(" ")];
  }

  function drawChart(ctx, result) {
    const regions = window.REGIONS;
    // region shading (offscreen, 1px resolution), clipped to triangle
    const off = document.createElement("canvas"); off.width = BOX.w; off.height = BOX.h;
    const octx = off.getContext("2d"), img = octx.createImageData(BOX.w, BOX.h);
    const cxy = regions.map(r => pt(...r.center));
    const [x1, y1] = V.R, [x2, y2] = V.S, [x3, y3] = V.F;
    const det = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
    for (let y = 0; y < BOX.h; y++) for (let x = 0; x < BOX.w; x++) {
      const l1 = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / det;
      const l2 = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / det;
      if (l1 < 0 || l2 < 0 || 1 - l1 - l2 < 0) continue;
      let bi = 0, bd = Infinity;
      for (let i = 0; i < cxy.length; i++) { const d = (x - cxy[i][0]) ** 2 + (y - cxy[i][1]) ** 2; if (d < bd) { bd = d; bi = i; } }
      const c = regions[bi].color, o = (y * BOX.w + x) * 4;
      img.data[o] = c[0]; img.data[o + 1] = c[1]; img.data[o + 2] = c[2];
      img.data[o + 3] = regions[bi] === result.region ? 90 : 45;
    }
    octx.putImageData(img, 0, 0);

    ctx.save(); ctx.translate(BOX.x, BOX.y);
    ctx.drawImage(off, 0, 0);

    // grid
    ctx.strokeStyle = "rgba(0,0,0,.22)"; ctx.lineWidth = 1;
    for (let k = 1; k < 10; k++) {
      const t = k / 10;
      for (const [a, b] of [[pt(t, 1 - t, 0), pt(t, 0, 1 - t)], [pt(1 - t, t, 0), pt(0, t, 1 - t)], [pt(1 - t, 0, t), pt(0, 1 - t, t)]]) {
        ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke();
      }
    }
    // coloured edges
    ctx.lineWidth = 5; ctx.lineCap = "round";
    const edge = (a, b, col) => { ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); };
    edge(V.R, V.S, "#a040b0"); edge(V.R, V.F, "#22aa55"); edge(V.S, V.F, "#4040c8");

    // tick labels
    ctx.fillStyle = "#222"; ctx.font = "13px system-ui, sans-serif";
    for (let k = 0; k <= 10; k++) {
      const t = k / 10, n = String(k * 10);
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      let p = pt(1 - t, t, 0); ctx.fillText(n, p[0] - 10, p[1]);               // sexuality %, left edge
      ctx.textAlign = "left"; p = pt(t, 0, 1 - t); ctx.fillText(n, p[0] + 10, p[1]); // romance %, right edge
      ctx.textAlign = "center"; ctx.textBaseline = "top"; p = pt(0, 1 - t, t); ctx.fillText(n, p[0], p[1] + 9); // friendship %, bottom
    }
    // edge annotations
    ctx.font = "italic 13px system-ui, sans-serif";
    ctx.fillStyle = "#a040b0"; ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText("aplatonic line", 170, 255);
    ctx.fillStyle = "#22aa55"; ctx.textAlign = "left"; ctx.fillText("asexual line", 665, 255);
    ctx.fillStyle = "#4040c8"; ctx.textAlign = "center"; ctx.fillText("aromantic line", 410, 592);

    // region labels
    ctx.font = "600 12px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    regions.forEach((r, i) => {
      const lines = splitName(r.name), [x, y] = cxy[i];
      lines.forEach((ln, j) => {
        const yy = y + (j - (lines.length - 1) / 2) * 14;
        ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.strokeText(ln, x, yy);
        ctx.fillStyle = `rgb(${r.color.map(c => Math.round(c * .6)).join(",")})`; ctx.fillText(ln, x, yy);
      });
    });

    // vertices
    ctx.font = "bold 16px system-ui, sans-serif";
    const vert = (p, label, dx, dy, align) => {
      ctx.fillStyle = "#e02020"; ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, 7); ctx.fill();
      ctx.fillStyle = "#e02020"; ctx.textAlign = align; ctx.textBaseline = "middle"; ctx.fillText(label, p[0] + dx, p[1] + dy);
    };
    vert(V.R, "Romance", 0, -22, "center"); vert(V.S, "Sexuality", -4, 24, "right"); vert(V.F, "Friendship", 4, 24, "left");

    // user
    const [ux, uy] = pt(...result.shares);
    ctx.fillStyle = "#ff7a00"; ctx.strokeStyle = "#fff"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(ux, uy, 11, 0, 7); ctx.fill(); ctx.stroke();
    ctx.font = "bold 14px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
    ctx.lineWidth = 4; ctx.strokeStyle = "#fff"; ctx.strokeText("You", ux, uy - 14);
    ctx.fillStyle = "#c25500"; ctx.fillText("You", ux, uy - 14);
    ctx.restore();
  }

  window.renderCard = function (canvas, result) {
    const SCALE = 2, tctx = canvas.getContext("2d");
    const pad = 50, textW = CW - pad * 2;
    tctx.font = "20px system-ui, sans-serif";
    const lines = wrap(tctx, result.region.desc, textW);
    const H = BOX.y + BOX.h + 30 + 44 + 34 + lines.length * 30 + 60;
    canvas.width = CW * SCALE; canvas.height = H * SCALE;
    const ctx = canvas.getContext("2d"); ctx.scale(SCALE, SCALE);
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, CW, H);
    ctx.fillStyle = "#111"; ctx.font = "bold 30px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    ctx.fillText("Triangle Theory", CW / 2, 52);
    drawChart(ctx, result);
    let y = BOX.y + BOX.h + 30 + 34;
    ctx.fillStyle = `rgb(${result.region.color.map(c => Math.round(c * .75)).join(",")})`;
    ctx.font = "bold 32px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.fillText(result.region.name, CW / 2, y);
    y += 34; ctx.fillStyle = "#333"; ctx.font = "600 17px system-ui, sans-serif";
    const p = result.percent;
    ctx.fillText(`Romance ${p[0]}%  ·  Sexuality ${p[1]}%  ·  Friendship ${p[2]}%`, CW / 2, y);
    y += 36; ctx.font = "20px system-ui, sans-serif"; ctx.textAlign = "left"; ctx.fillStyle = "#222";
    for (const ln of lines) { ctx.fillText(ln, pad, y); y += 30; }
    ctx.fillStyle = "#888"; ctx.font = "14px system-ui, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("anonterry.github.io/triangle-theory", CW / 2, H - 22);
  };
})();
