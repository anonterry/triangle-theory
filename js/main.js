(function () {
  const Q = window.QUESTIONS, $ = id => document.getElementById(id);
  const COLORS = [["#ffb347", "255,179,71", "#ff8a3d", "#1a1203", "Amber"], ["#2ee6c8", "46,230,200", "#19b8d6", "#03231f", "Aqua"], ["#ff7a6b", "255,122,107", "#ff4f6d", "#2a0a08", "Coral"], ["#a78bfa", "167,139,250", "#7c6cf5", "#12082e", "Lavender"]];
  let order, answers, idx, accent = COLORS[0][0], name = "", result = null;

  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function show(id) { for (const s of ["intro", "quiz", "result"]) $(s).classList.toggle("active", s === id); window.scrollTo(0, 0); }

  // colour picker
  COLORS.forEach(([hex, rgb, hex2, on, label], i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "color" + (i ? "" : " active"); b.style.setProperty("--swatch", hex);
    b.setAttribute("role", "radio"); b.setAttribute("aria-label", label); b.setAttribute("aria-checked", i ? "false" : "true");
    b.onclick = () => {
      accent = hex; document.documentElement.style.setProperty("--accent", hex); document.documentElement.style.setProperty("--accent-rgb", rgb); document.documentElement.style.setProperty("--accent2", hex2); document.documentElement.style.setProperty("--on", on);
      [...$("colors").children].forEach(c => { c.classList.toggle("active", c === b); c.setAttribute("aria-checked", c === b); });
    };
    $("colors").appendChild(b);
  });

  // mini triangle
  const MV = { R: [150, 24], S: [22, 246], F: [278, 246] };
  const mpt = (r, s, f) => [r * MV.R[0] + s * MV.S[0] + f * MV.F[0], r * MV.R[1] + s * MV.S[1] + f * MV.F[1]];
  (function grid() {
    let h = ""; for (const t of [.25, .5, .75]) for (const [a, b] of [[mpt(t, 1 - t, 0), mpt(t, 0, 1 - t)], [mpt(1 - t, t, 0), mpt(0, t, 1 - t)], [mpt(1 - t, 0, t), mpt(0, 1 - t, t)]]) h += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;
    $("mini-grid").innerHTML = h;
  })();
  function updateDot() {
    const sh = window.computeShares(answers);
    const [x, y] = mpt(...sh); $("mini-dot").style.transform = `translate(${x}px,${y}px)`; $("mini-dot").setAttribute("transform", `translate(${x},${y})`);
  }

  function start() {
    name = $("name").value.trim();
    // answers display shortest to longest
    order = Q.map(q => q.a.map((_, i) => i).sort((x, y) => q.keep ? x - y : q.a[x][0].length - q.a[y][0].length || x - y)); answers = new Array(Q.length).fill(null); idx = 0;
    show("quiz"); render(); updateDot();
  }
  function render() {
    const q = Q[idx];
    $("progress-bar").style.width = (idx / Q.length * 100) + "%";
    $("progress-text").textContent = `${idx + 1} / ${Q.length}`;
    $("qnum").textContent = `QUESTION ${idx + 1}`;
    $("question").textContent = q.q;
    const box = $("answers"); box.textContent = "";
    order[idx].forEach(ai => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "answer" + (answers[idx] === ai ? " chosen" : ""); b.textContent = q.a[ai][0];
      b.onclick = () => {
        answers[idx] = ai; updateDot();
        b.classList.add("chosen"); [...box.children].forEach(c => c.disabled = true);
        setTimeout(() => { if (idx < Q.length - 1) { idx++; render(); } else finish(); }, 180);
      };
      box.appendChild(b);
    });
    $("back").disabled = idx === 0;
  }
  function finish() {
    const shares = window.computeShares(answers);
    const pct = shares.map(v => Math.round(v * 100)); pct[2] += 100 - pct[0] - pct[1] - pct[2];
    result = { shares, percent: pct, region: window.classify(shares) };
    $("r-eyebrow").textContent = name ? `${name.toUpperCase()}'S RESULT` : "YOUR RESULT";
    $("r-name").textContent = result.region.name; $("r-desc").textContent = result.region.desc;
    $("traits").innerHTML = ["Romance", "Sexuality", "Friendship"].map((l, i) => `<div class="trait"><span>${l}</span><div class="trait-track"><div class="trait-fill" data-w="${pct[i]}"></div></div><strong>${pct[i]}%</strong></div>`).join("");
    $("legend").innerHTML = window.REGIONS.map(r => `<li class="${r === result.region ? "mine" : ""}" style="--c:rgb(${r.color})"><i></i><span><b>${r.name}</b>${r.desc}</span></li>`).join("");
    $("save-note").textContent = "";
    show("result"); drawResult();
    requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll(".trait-fill").forEach(e => e.style.width = e.dataset.w + "%")));
  }
  function drawResult() { if (result) window.renderChart($("chart"), result, accent); }
  $("chart").setAttribute("role", "img");

  function cardBlob(cb) {
    const c = document.createElement("canvas"); window.renderCard(c, result, accent, name); c.toBlob(cb, "image/png");
  }
  function download() {
    cardBlob(blob => {
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "triangle-theory-result.png";
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      $("save-note").textContent = "Saved. Check your downloads or photos.";
    });
  }
  function share() {
    cardBlob(async blob => {
      const file = new File([blob], "triangle-theory-result.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: "My Triangle Theory result" }); } catch (e) {} }
      else download();
    });
  }
  let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { if ($("result").classList.contains("active")) drawResult(); }, 120); });

  $("start").onclick = start;
  $("name").addEventListener("keydown", e => { if (e.key === "Enter") start(); });
  $("back").onclick = () => { if (idx > 0) { idx--; render(); } };
  $("retake").onclick = () => { show("intro"); };
  $("download").onclick = download; $("share").onclick = share;
  $("count").textContent = Q.length;
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawResult).catch(() => {});
})();
