(function () {
  const Q = window.QUESTIONS, $ = id => document.getElementById(id);
  const COLORS = [["#ffb347", "255,179,71", "#ff8a3d", "#1a1203", "Amber"], ["#2ee6c8", "46,230,200", "#19b8d6", "#03231f", "Aqua"], ["#ff7a6b", "255,122,107", "#ff4f6d", "#2a0a08", "Coral"], ["#a78bfa", "167,139,250", "#7c6cf5", "#12082e", "Lavender"]];
  let order, answers, idx, accentIdx = 0, accent = COLORS[0][0], name = "", result = null, shared = false;

  function show(id) { for (const s of ["intro", "quiz", "result"]) $(s).classList.toggle("active", s === id); window.scrollTo(0, 0); }

  // color picker
  function setAccent(i) {
    const [hex, rgb, hex2, on] = COLORS[i], root = document.documentElement.style;
    accentIdx = i; accent = hex;
    root.setProperty("--accent", hex); root.setProperty("--accent-rgb", rgb); root.setProperty("--accent2", hex2); root.setProperty("--on", on);
    [...$("colors").children].forEach((c, j) => { c.classList.toggle("active", j === i); c.setAttribute("aria-checked", j === i); });
  }
  COLORS.forEach(([hex, , , , label], i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "color" + (i ? "" : " active"); b.style.setProperty("--swatch", hex);
    b.setAttribute("role", "radio"); b.setAttribute("aria-label", label); b.setAttribute("aria-checked", i ? "false" : "true");
    b.onclick = () => setAccent(i);
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
    shared = false; name = $("name").value.trim();
    // answers display shortest to longest, unless a question is a scale (keep:true)
    order = Q.map(q => q.a.map((_, i) => i).sort((x, y) => q.keep ? x - y : q.a[x][0].length - q.a[y][0].length || x - y)); answers = new Array(Q.length).fill(null); idx = 0;
    show("quiz"); render(); updateDot();
  }
  function render() {
    const q = Q[idx], multi = !!q.multi, cap = multi ? window.capOf(q) : 1;
    $("progress-bar").style.width = (idx / Q.length * 100) + "%";
    $("progress-text").textContent = `${idx + 1} / ${Q.length}`;
    $("qnum").textContent = `QUESTION ${idx + 1}`;
    $("question").textContent = q.q;
    $("pick-hint").hidden = $("next").hidden = !multi;
    if (multi) $("pick-hint").textContent = `Pick up to ${cap}`;
    const box = $("answers"); box.textContent = "";
    const advance = () => { if (idx < Q.length - 1) { idx++; render(); } else present(window.computeShares(answers), false); };
    const sel = () => answers[idx] || [];
    // an "exclusive" answer (like "Not much") disables the others while it's checked
    const paint = () => {
      const lock = multi && q.exclusive != null && sel().includes(q.exclusive);
      [...box.children].forEach(c => { const a = +c.dataset.ai; c.classList.toggle("chosen", sel().includes(a)); c.disabled = lock && a !== q.exclusive; });
      $("next").disabled = !sel().length;
    };
    order[idx].forEach(ai => {
      const b = document.createElement("button");
      b.type = "button"; b.dataset.ai = ai; b.textContent = q.a[ai][0];
      if (multi) {
        b.className = "answer multi";
        b.onclick = () => {
          let cur = sel().slice();
          if (cur.includes(ai)) cur = cur.filter(x => x !== ai);
          else if (ai === q.exclusive) cur = [ai]; // checking it clears everything else
          else { cur.push(ai); if (cur.length > cap) cur.shift(); } // at the cap, the oldest pick drops off
          answers[idx] = cur.length ? cur : null; paint(); updateDot();
        };
      } else {
        b.className = "answer" + (answers[idx] === ai ? " chosen" : "");
        b.onclick = () => {
          answers[idx] = ai; updateDot();
          b.classList.add("chosen"); [...box.children].forEach(c => c.disabled = true);
          setTimeout(advance, 180);
        };
      }
      box.appendChild(b);
    });
    if (multi) { paint(); $("next").textContent = idx < Q.length - 1 ? "Continue" : "See my result"; $("next").onclick = advance; }
    $("back").disabled = idx === 0;
  }

  // Show a result. `isShared` = opened from a shared link (someone else's result).
  function present(shares, isShared) {
    shared = isShared;
    const pct = shares.map(v => Math.round(v * 100)); pct[2] += 100 - pct[0] - pct[1] - pct[2];
    result = { shares, percent: pct, region: window.classify(shares) };
    $("r-eyebrow").textContent = name ? `${name.toUpperCase()}'S RESULT` : (shared ? "THEIR RESULT" : "YOUR RESULT");
    $("zone-kicker").textContent = shared ? "THEIR ZONE" : "YOUR ZONE";
    $("r-name").textContent = result.region.name; $("r-desc").textContent = result.region.desc;
    $("traits").innerHTML = ["Romance", "Sexuality", "Friendship"].map((l, i) => `<div class="trait"><span>${l}</span><div class="trait-track"><div class="trait-fill" data-w="${pct[i]}"></div></div><strong>${pct[i]}%</strong></div>`).join("");
    $("legend").innerHTML = window.REGIONS.map(r => `<li class="${r === result.region ? "mine" : ""}" style="--c:rgb(${r.color})"><i></i><span><b>${r.name}</b>${r.desc}</span></li>`).join("");
    // visitors of a shared link get only "Take it yourself"
    $("take").hidden = !shared; $("owner-actions").hidden = shared;
    if (!shared) $("share-url").value = shareUrl();
    $("save-note").textContent = "";
    document.title = (name ? name + "'s " : "") + "Triangle Theory result";
    show("result"); drawResult();
    requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll(".trait-fill").forEach(e => e.style.width = e.dataset.w + "%")));
  }
  function drawResult() { if (result) window.renderChart($("chart"), result, accent); }
  $("chart").setAttribute("role", "img");

  // image save
  function cardBlob(cb) { const c = document.createElement("canvas"); window.renderCard(c, result, accent, name); c.toBlob(cb, "image/png"); }
  function download() {
    cardBlob(blob => {
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "triangle-theory-result.png";
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      $("save-note").textContent = "Saved. Check your downloads or photos.";
    });
  }

  // share link: <site>/r/<zone>/?r=..&s=..&f=..&name=..&c=..  (the zone page carries the Discord/social preview)
  function shareUrl() {
    const base = location.origin + location.pathname.replace(/[^/]*$/, "");
    const p = new URLSearchParams({ r: result.shares[0].toFixed(3), s: result.shares[1].toFixed(3), f: result.shares[2].toFixed(3) });
    if (name) p.set("name", name); p.set("c", accentIdx);
    return `${base}r/${result.region.id}/?${p}`;
  }
  async function copyAgain() {
    const input = $("share-url"), url = shareUrl(); input.value = url; input.focus(); input.select();
    let ok = false;
    try { await navigator.clipboard.writeText(url); ok = true; } catch (e) {}
    $("save-note").textContent = ok ? "Link copied. Paste it into Discord, a text, anywhere." : "Select the link above and copy it.";
    if (ok && navigator.share && window.matchMedia("(pointer:coarse)").matches) {
      try { await navigator.share({ title: "My Triangle Theory result", text: `${name || "I"} ${name ? "is" : "am"} a ${result.region.name}`, url }); } catch (e) {}
    }
  }

  // open a shared result: ?r=&s=&f=[&name=][&c=]
  function fromQuery() {
    const p = new URLSearchParams(location.search);
    if (!(p.has("r") && p.has("s") && p.has("f"))) return false;
    const v = ["r", "s", "f"].map(k => { const n = parseFloat(p.get(k)); return isFinite(n) && n >= 0 ? Math.min(n, 1) : NaN; });
    const t = v[0] + v[1] + v[2]; if (v.some(isNaN) || t <= 0) return false;
    name = (p.get("name") || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 24);
    const ci = parseInt(p.get("c"), 10); if (ci >= 0 && ci < COLORS.length) setAccent(ci);
    present(v.map(x => x / t), true);
    return true;
  }

  let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { if ($("result").classList.contains("active")) drawResult(); }, 120); });

  $("start").onclick = start;
  $("name").addEventListener("keydown", e => { if (e.key === "Enter") start(); });
  $("back").onclick = () => { if (idx > 0) { idx--; render(); } };
  $("retake").onclick = () => { show("intro"); };
  $("download").onclick = download; $("copy").onclick = copyAgain;
  $("count").textContent = Q.length;
  if (!fromQuery()) show("intro");
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawResult).catch(() => {});
})();
