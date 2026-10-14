// Triangle chart renderer. drawChart works at a 820x600 logical size scaled by k;
// "compact" mode (small screens) drops the crowded labels. renderCard builds the full saved image.
(function () {
  const SERIF = 'Fraunces, Georgia, serif', SANS = '"DM Sans", system-ui, sans-serif';
  const CW = 900, BOX = { x: 40, y: 150, w: 820, h: 600 };
  const V = { R: [410, 40], S: [110, 560], F: [710, 560] };
  const pt = (r, s, f) => [r * V.R[0] + s * V.S[0] + f * V.F[0], r * V.R[1] + s * V.S[1] + f * V.F[1]];
  const light = (c, a) => c.map(v => Math.round(v + (255 - v) * a)).join(",");

  function wrap(ctx, text, maxW) {
    const words = text.split(" "), lines = []; let line = "";
    for (const w of words) { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
    if (line) lines.push(line); return lines;
  }
  function splitName(name) {
    const w = name.split(" "); if (w.length < 2) return [name];
    let best = 1, diff = Infinity;
    for (let i = 1; i < w.length; i++) { const d = Math.abs(w.slice(0, i).join(" ").length - w.slice(i).join(" ").length); if (d < diff) { diff = d; best = i; } }
    return [w.slice(0, best).join(" "), w.slice(best).join(" ")];
  }

  function drawChart(ctx, result, o) {
    const k = o.k || 1, compact = !!o.compact, accent = o.accent || "#ffb347";
    const F = (px, wt) => `${wt || 500} ${px / k}px ${SANS}`;
    const regions = window.REGIONS;
    const off = document.createElement("canvas"); off.width = BOX.w; off.height = BOX.h;
    const octx = off.getContext("2d"), img = octx.createImageData(BOX.w, BOX.h);
    const cxy = regions.map(r => pt(...r.center));
    const [x1, y1] = V.R, [x2, y2] = V.S, [x3, y3] = V.F;
    const det = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
    for (let y = 0; y < BOX.h; y++) for (let x = 0; x < BOX.w; x++) {
      const l1 = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / det, l2 = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / det;
      if (l1 < 0 || l2 < 0 || 1 - l1 - l2 < 0) continue;
      let bi = 0, bd = Infinity;
      for (let i = 0; i < cxy.length; i++) { const d = (x - cxy[i][0]) ** 2 + (y - cxy[i][1]) ** 2; if (d < bd) { bd = d; bi = i; } }
      const c = regions[bi].color, p = (y * BOX.w + x) * 4;
      img.data[p] = c[0]; img.data[p + 1] = c[1]; img.data[p + 2] = c[2]; img.data[p + 3] = regions[bi] === result.region ? 105 : 40;
    }
    octx.putImageData(img, 0, 0);
    ctx.drawImage(off, 0, 0);

    ctx.strokeStyle = "rgba(255,255,255,.16)"; ctx.lineWidth = 1 / k;
    for (let n = 1; n < 10; n++) {
      const t = n / 10;
      for (const [a, b] of [[pt(t, 1 - t, 0), pt(t, 0, 1 - t)], [pt(1 - t, t, 0), pt(0, t, 1 - t)], [pt(1 - t, 0, t), pt(0, 1 - t, t)]]) { ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); }
    }
    ctx.lineWidth = (compact ? 3 : 5) / k; ctx.lineCap = "round";
    const edge = (a, b, col) => { ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); };
    edge(V.R, V.S, "#c25ae0"); edge(V.R, V.F, "#2fd272"); edge(V.S, V.F, "#6b6bf2");

    ctx.fillStyle = "#b9d0cd"; ctx.font = F(compact ? 11 : 13);
    const step = compact ? 2 : 1;
    for (let n = 0; n <= 10; n += step) {
      const t = n / 10, s = String(n * 10);
      ctx.textAlign = "right"; ctx.textBaseline = "middle"; let p = pt(1 - t, t, 0); ctx.fillText(s, p[0] - 8 / k * (compact ? .8 : 1.2), p[1]);
      ctx.textAlign = "left"; p = pt(t, 0, 1 - t); ctx.fillText(s, p[0] + 8 / k * (compact ? .8 : 1.2), p[1]);
      ctx.textAlign = "center"; ctx.textBaseline = "top"; p = pt(0, 1 - t, t); ctx.fillText(s, p[0], p[1] + 8 / k);
    }
    if (!compact) {
      ctx.font = `italic 500 13px ${SANS}`; ctx.textBaseline = "middle";
      ctx.fillStyle = "#c25ae0"; ctx.textAlign = "right"; ctx.fillText("aplatonic line", 170, 255);
      ctx.fillStyle = "#2fd272"; ctx.textAlign = "left"; ctx.fillText("asexual line", 665, 255);
      ctx.fillStyle = "#8a8af5"; ctx.textAlign = "center"; ctx.fillText("aromantic line", 410, 592);
      ctx.font = `700 12px ${SANS}`; ctx.textBaseline = "middle";
      regions.forEach((r, i) => {
        const lines = splitName(r.name), [x, y] = cxy[i];
        lines.forEach((ln, j) => {
          const yy = y + (j - (lines.length - 1) / 2) * 14;
          ctx.lineWidth = 3; ctx.strokeStyle = "rgba(6,19,23,.85)"; ctx.strokeText(ln, x, yy);
          ctx.fillStyle = `rgb(${light(r.color, .55)})`; ctx.fillText(ln, x, yy);
        });
      });
    }

    ctx.font = F(compact ? 13 : 16, 700);
    const vert = (p, label, dx, dy, al) => {
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(p[0], p[1], (compact ? 5 : 8) / k, 0, 7); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.textAlign = al; ctx.textBaseline = "middle"; ctx.fillText(label, p[0] + dx / k, p[1] + dy / k);
    };
    if (compact) { vert(V.R, "Romance", 0, -20, "center"); vert(V.S, "Sexuality", 8, 26, "left"); vert(V.F, "Friendship", -8, 26, "right"); }
    else { vert(V.R, "Romance", 0, -22, "center"); vert(V.S, "Sexuality", -4, 24, "right"); vert(V.F, "Friendship", 4, 24, "left"); }

    const [ux, uy] = pt(...result.shares);
    const g = ctx.createRadialGradient(ux, uy, 0, ux, uy, 34 / k * (compact ? .8 : 1));
    g.addColorStop(0, accent + "88"); g.addColorStop(1, accent + "00");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ux, uy, 34 / k, 0, 7); ctx.fill();
    ctx.fillStyle = accent; ctx.strokeStyle = "#fff"; ctx.lineWidth = 3 / k;
    ctx.beginPath(); ctx.arc(ux, uy, (compact ? 8 : 11) / k, 0, 7); ctx.fill(); ctx.stroke();
    ctx.font = F(compact ? 12 : 14, 800); ctx.textAlign = "center"; ctx.textBaseline = "bottom";
    ctx.lineWidth = 4 / k; ctx.strokeStyle = "rgba(6,19,23,.92)"; ctx.strokeText("YOU", ux, uy - 14 / k);
    ctx.fillStyle = "#fff"; ctx.fillText("YOU", ux, uy - 14 / k);
  }

  // Responsive on-screen chart.
  window.renderChart = function (canvas, result, accent) {
    const W = Math.min(canvas.parentElement.clientWidth || 820, 820), k = W / 820, dpr = Math.min(window.devicePixelRatio || 1, 3);
    const padT = 26, padB = 34; // css px of breathing room for vertex/tick labels
    canvas.width = Math.round(W * dpr); canvas.height = Math.round((600 * k + padT + padB) * dpr);
    const ctx = canvas.getContext("2d"); ctx.setTransform(dpr * k, 0, 0, dpr * k, 0, padT * dpr);
    drawChart(ctx, result, { k, compact: W < 600, accent });
  };

  // Full shareable image (dark card, fixed size).
  window.renderCard = function (canvas, result, accent, name) {
    const SCALE = 2, pad = 56, tctx = canvas.getContext("2d");
    tctx.font = `500 26px ${SERIF}`;
    const lines = wrap(tctx, result.region.desc, CW - pad * 2);
    const H = BOX.y + BOX.h + 50 + 70 + 40 + lines.length * 36 + 70;
    canvas.width = CW * SCALE; canvas.height = H * SCALE;
    const ctx = canvas.getContext("2d"); ctx.scale(SCALE, SCALE);
    ctx.fillStyle = "#061317"; ctx.fillRect(0, 0, CW, H);
    const bg = ctx.createRadialGradient(180, 0, 0, 180, 0, 520); bg.addColorStop(0, accent + "33"); bg.addColorStop(1, accent + "00");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, CW, H);
    ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    ctx.fillStyle = accent; ctx.font = `700 15px ${SANS}`;
    if (ctx.letterSpacing !== undefined) ctx.letterSpacing = "4px";
    ctx.fillText(name ? (name.toUpperCase() + "'S RESULT") : "YOUR RESULT", CW / 2 + 2, 58);
    ctx.fillStyle = "#fff"; ctx.font = `600 66px ${SERIF}`; if (ctx.letterSpacing !== undefined) ctx.letterSpacing = "-1px";
    ctx.fillText("Triangle Theory", CW / 2, 120);
    if (ctx.letterSpacing !== undefined) ctx.letterSpacing = "0px";
    ctx.save(); ctx.translate(BOX.x, BOX.y); drawChart(ctx, result, { k: 1, compact: false, accent }); ctx.restore();
    let y = BOX.y + BOX.h + 80;
    ctx.fillStyle = "#fff"; ctx.font = `600 54px ${SERIF}`; ctx.fillText(result.region.name, CW / 2, y);
    y += 40; ctx.fillStyle = "#9db5b3"; ctx.font = `600 16px ${SANS}`;
    const p = result.percent; ctx.fillText(`Romance ${p[0]}%   ·   Sexuality ${p[1]}%   ·   Friendship ${p[2]}%`, CW / 2, y);
    y += 50; ctx.fillStyle = "#d4e6e3"; ctx.font = `500 26px ${SERIF}`; ctx.textAlign = "left";
    for (const ln of lines) { ctx.fillText(ln, pad, y); y += 36; }
    ctx.fillStyle = "#7d707a"; ctx.font = `500 14px ${SANS}`; ctx.textAlign = "center";
    ctx.fillText("anonterry.github.io/triangle-theory", CW / 2, H - 28);
  };
})();
