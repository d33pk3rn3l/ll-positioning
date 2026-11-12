/** Small dense matrix operations; no display dependencies. */
export const zeros = (n, m = n) =>
  Array.from({ length: n }, () => Array(m).fill(0));
export const identity = (n) =>
  zeros(n).map((r, i) => r.map((_, j) => Number(i === j)));
export const transpose = (a) => a[0].map((_, j) => a.map((r) => r[j]));
export const add = (a, b) => a.map((r, i) => r.map((v, j) => v + b[i][j]));
export const multiply = (a, b) =>
  a.map((r) => b[0].map((_, j) => r.reduce((v, x, k) => v + x * b[k][j], 0)));
export const sandwich = (a, p) => multiply(multiply(a, p), transpose(a));
export const outer = (a, b = a) => a.map((x) => b.map((y) => x * y));
export const scale = (a, k) => a.map((r) => r.map((x) => x * k));
export const sum = (parts) => parts.reduce(add, zeros(parts[0].length));
export const symmetrize = (p) =>
  p.map((r, i) => r.map((v, j) => (v + p[j][i]) / 2));
/** Jacobi eigensystem for symmetric matrices, used for covariance checks. */
export function eigenSymmetric(matrix) {
  const a = matrix.map((r) => [...r]),
    n = a.length,
    vectors = identity(n);
  for (let iter = 0; iter < 100 * n * n; iter++) {
    let p = 0,
      q = 1,
      max = 0;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++)
        if (Math.abs(a[i][j]) > max) {
          max = Math.abs(a[i][j]);
          p = i;
          q = j;
        }
    if (max < 1e-12) break;
    const phi = 0.5 * Math.atan2(2 * a[p][q], a[q][q] - a[p][p]),
      c = Math.cos(phi),
      s = Math.sin(phi);
    const app = a[p][p],
      aqq = a[q][q],
      apq = a[p][q];
    for (let i = 0; i < n; i++)
      if (i !== p && i !== q) {
        const ip = a[i][p],
          iq = a[i][q];
        a[i][p] = a[p][i] = c * ip - s * iq;
        a[i][q] = a[q][i] = s * ip + c * iq;
      }
    a[p][p] = c * c * app - 2 * c * s * apq + s * s * aqq;
    a[q][q] = s * s * app + 2 * c * s * apq + c * c * aqq;
    a[p][q] = a[q][p] = 0;
    for (let i = 0; i < n; i++) {
      const ip = vectors[i][p],
        iq = vectors[i][q];
      vectors[i][p] = c * ip - s * iq;
      vectors[i][q] = s * ip + c * iq;
    }
  }
  return { values: a.map((r, i) => r[i]), vectors };
}
