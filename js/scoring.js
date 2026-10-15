// Scoring: raw totals per ingredient are compared with what *random* answering would produce
// (computed analytically), turned into z-scores, then mapped to shares with a softmax.
// Result: the center isn't a magnet. Only a genuinely balanced answer pattern lands there.
(function () {
  const BETA = 0.7;  // contrast: higher pushes results further toward corners/edges
  const Q = window.QUESTIONS;
  const stats = Q.map(q => {
    const n = q.a.length, mean = [0, 0, 0], vari = [0, 0, 0];
    q.a.forEach(a => a[1].forEach((v, k) => mean[k] += v / n));
    q.a.forEach(a => a[1].forEach((v, k) => vari[k] += (v - mean[k]) ** 2 / n));
    return { mean, vari };
  });
  // answers: array (per question index) of chosen answer index or null
  window.computeShares = function (answers) {
    const S = [0, 0, 0], mu = [0, 0, 0], va = [0, 0, 0]; let n = 0;
    answers.forEach((ai, qi) => {
      if (ai == null) return; n++;
      const w = Q[qi].a[ai][1];
      for (let k = 0; k < 3; k++) { S[k] += w[k]; mu[k] += stats[qi].mean[k]; va[k] += stats[qi].vari[k]; }
    });
    if (!n) return [1 / 3, 1 / 3, 1 / 3];
    const beta = BETA * Math.sqrt(n / Q.length); // damp the live preview early on
    const e = S.map((s, k) => Math.exp(beta * (s - mu[k]) / (Math.sqrt(va[k]) || 1)));
    const t = e[0] + e[1] + e[2];
    return e.map(v => v / t);
  };
})();
