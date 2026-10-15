// Scoring: raw totals per ingredient are compared with what *random* answering would produce
// (computed analytically), turned into z-scores, then mapped to shares with a softmax.
// Result: the center isn't a magnet. Only a genuinely balanced answer pattern lands there.
(function () {
  const BETA = 0.7;  // contrast: higher pushes results further toward corners/edges
  const Q = window.QUESTIONS;
  // multi-select questions: choose up to cap answers (2 for small lists, 3 for 5+); the chosen weights are averaged
  const capOf = q => q.a.length >= 5 ? 3 : 2;
  window.capOf = capOf;
  const avg = (q, idxs) => { const w = [0, 0, 0]; idxs.forEach(i => q.a[i][1].forEach((v, k) => w[k] += v / idxs.length)); return w; };
  // the "random answerer" baseline: one random answer, or (multi) a random subset of allowed size
  function options(q) {
    if (!q.multi) return q.a.map((_, i) => q.a[i][1]);
    const n = q.a.length, cap = capOf(q), out = [];
    for (let m = 1; m < (1 << n); m++) {
      const idxs = []; for (let i = 0; i < n; i++) if (m >> i & 1) idxs.push(i);
      if (idxs.length <= cap) out.push(avg(q, idxs));
    }
    return out;
  }
  const stats = Q.map(q => {
    const opts = options(q), n = opts.length, mean = [0, 0, 0], vari = [0, 0, 0];
    opts.forEach(w => w.forEach((v, k) => mean[k] += v / n));
    opts.forEach(w => w.forEach((v, k) => vari[k] += (v - mean[k]) ** 2 / n));
    return { mean, vari };
  });
  // answers: per question, an answer index, an array of indices (multi-select), or null
  window.computeShares = function (answers) {
    const S = [0, 0, 0], mu = [0, 0, 0], va = [0, 0, 0]; let n = 0;
    answers.forEach((ai, qi) => {
      if (ai == null || (Array.isArray(ai) && !ai.length)) return; n++;
      const w = Array.isArray(ai) ? avg(Q[qi], ai) : Q[qi].a[ai][1];
      for (let k = 0; k < 3; k++) { S[k] += w[k]; mu[k] += stats[qi].mean[k]; va[k] += stats[qi].vari[k]; }
    });
    if (!n) return [1 / 3, 1 / 3, 1 / 3];
    const beta = BETA * Math.sqrt(n / Q.length); // damp the live preview early on
    const e = S.map((s, k) => Math.exp(beta * (s - mu[k]) / (Math.sqrt(va[k]) || 1)));
    const t = e[0] + e[1] + e[2];
    return e.map(v => v / t);
  };
})();
