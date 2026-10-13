(function () {
  const Q = window.QUESTIONS;
  const $ = id => document.getElementById(id);
  let order, answers, idx;

  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function show(id) { for (const s of ["intro", "quiz", "result"]) $(s).hidden = s !== id; window.scrollTo(0, 0); }

  function start() {
    order = Q.map(q => shuffle(q.a.map((_, i) => i)));
    answers = new Array(Q.length).fill(null); idx = 0;
    show("quiz"); render();
  }
  function render() {
    const q = Q[idx];
    $("progress-bar").style.width = (idx / Q.length * 100) + "%";
    $("progress-text").textContent = `Question ${idx + 1} of ${Q.length}`;
    $("question").textContent = q.q;
    const box = $("answers"); box.textContent = "";
    order[idx].forEach(ai => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "answer" + (answers[idx] === ai ? " selected" : "");
      b.textContent = q.a[ai][0];
      b.onclick = () => { answers[idx] = ai; if (idx < Q.length - 1) { idx++; render(); } else finish(); };
      box.appendChild(b);
    });
    $("back").disabled = idx === 0;
  }
  function finish() {
    const sum = [0, 0, 0];
    answers.forEach((ai, qi) => { const w = Q[qi].a[ai][1]; for (let k = 0; k < 3; k++) sum[k] += w[k]; });
    const total = sum[0] + sum[1] + sum[2] || 1;
    const shares = sum.map(v => v / total);
    let pct = shares.map(v => Math.round(v * 100));
    pct[2] += 100 - pct[0] - pct[1] - pct[2]; // rounding fix
    const result = { shares, percent: pct, region: window.classify(shares) };
    renderCard($("card"), result);
    $("card").setAttribute("aria-label", `${result.region.name}. Romance ${pct[0]}%, sexuality ${pct[1]}%, friendship ${pct[2]}%. ${result.region.desc}`);
    window.lastResult = result;
    show("result");
  }
  function download() {
    $("card").toBlob(blob => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "triangle-theory-result.png";
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, "image/png");
  }
  async function share() {
    $("card").toBlob(async blob => {
      const file = new File([blob], "triangle-theory-result.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: "My Triangle Theory result" }); } catch (e) {} }
      else download();
    }, "image/png");
  }

  $("start").onclick = start;
  $("back").onclick = () => { if (idx > 0) { idx--; render(); } };
  $("retake").onclick = start;
  $("download").onclick = download;
  $("share").onclick = share;
  $("count").textContent = Q.length;
  show("intro");
})();
