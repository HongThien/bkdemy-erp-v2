// kiem_G3.mjs — kiểm các khẳng định của lời giải NDT Ch.III §1 bài 1–5. node kiem_G3.mjs
let n = 0, fail = 0
const eq = (a, b, m, tol = 1e-9) => { n++; if (!(Math.abs(a - b) < tol)) { fail++; console.log('FAIL', m, a, b) } }
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const cross = (u, v) => u[0] * v[1] - u[1] * v[0]
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const inter = (a, b, c, d) => { const r = sub(b, a), s = sub(d, c); const k = cross(r, s); const t = cross(sub(c, a), s) / k; return [a[0] + r[0] * t, a[1] + r[1] * t] }
let seed = 12345; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648

// Bài 1
eq(5 / 30, 1 / 6, '1a'); eq(42 / (2.4 * 100), 7 / 40, '1b'); eq(2.4 * 100, 240, '1b đổi đơn vị')
// Bài 2: giải hệ bằng vét lưới thay vì công thức
{
  let sol = []
  for (let mn = 0; mn <= 32; mn += 0.5) { const pq = 32 - mn; if (Math.abs(3 * mn - 5 * pq) < 1e-9) sol.push([mn, pq]) }
  n++; if (sol.length !== 1 || sol[0][0] !== 20 || sol[0][1] !== 12) { fail++; console.log('FAIL 2', sol) }
  eq(20 / 5, 12 / 3, '2 MN/5=PQ/3'); eq(32 / 8, 4, '2 tỉ số chung')
}
// Bài 3: dựng toạ độ trên trục, M chia AB sao cho AM/MB = 2/7
for (let i = 0; i < 3; i++) {
  const A = [rnd() * 10, rnd() * 10], B = [rnd() * 10 + 15, rnd() * 10 - 5]
  const M = lerp(A, B, 2 / 9)
  eq(dist(A, M) / dist(M, B), 2 / 7, '3 giả thiết'); eq(dist(A, M) / dist(A, B), 2 / 9, '3a'); eq(dist(M, B) / dist(A, B), 7 / 9, '3b')
  eq(dist(A, M) + dist(M, B), dist(A, B), '3 AM+MB=AB')
}
// Bài 4a: tam giác bất kì, D chia PQ theo PD:DQ=5:3, DE∥QR ⇒ E; co giãn để PE=8 rồi đo ER
for (let i = 0; i < 3; i++) {
  const P = [rnd() * 5, rnd() * 5 + 8], Q = [rnd() * 3 - 5, rnd() * 3], R = [rnd() * 8 + 5, rnd() * 3]
  const D = lerp(P, Q, 5 / 8)
  // E = giao của PR với đường qua D song song QR
  const E = inter(D, [D[0] + (R[0] - Q[0]), D[1] + (R[1] - Q[1])], P, R)
  const s = 8 / dist(P, E)               // hệ số co giãn để PE = 8
  const x = dist(E, R) * s
  eq(x, 4.8, '4a x'); eq(dist(P, D) * s / (dist(D, Q) * s), 5 / 3, '4a PD/DQ')
  eq(cross(sub(E, D), sub(R, Q)), 0, '4a DE//QR', 1e-7)
}
// Bài 4b: SK=12, SN=9; MN∥HK; MH=2,4 — tìm SH bằng bisection, đo SM
for (let i = 0; i < 3; i++) {
  const S = [0, 0], th = 0.3 + rnd(), K = [12 * Math.cos(th), 12 * Math.sin(th)]
  const N = lerp(S, K, 9 / 12)
  const dirH = 1.2 + rnd() * 1.5, uH = [Math.cos(dirH + th), Math.sin(dirH + th)]
  const hamMH = (L) => { const H = [uH[0] * L, uH[1] * L]; const M = inter(N, [N[0] + (K[0] - H[0]), N[1] + (K[1] - H[1])], S, H); return dist(M, H) }
  let lo = 0.1, hi = 100; for (let it = 0; it < 200; it++) { const mid = (lo + hi) / 2; if (hamMH(mid) < 2.4) lo = mid; else hi = mid }
  const L = (lo + hi) / 2, H = [uH[0] * L, uH[1] * L]
  const M = inter(N, [N[0] + (K[0] - H[0]), N[1] + (K[1] - H[1])], S, H)
  eq(dist(S, M), 7.2, '4b x', 1e-6); eq(dist(N, K), 3, '4b NK=3'); eq(dist(S, M) / 2.4, 9 / 3, '4b Thalès', 1e-6)
}
// Bài 5: nhiều bộ ngẫu nhiên (góc, B giữa A và C, hướng song song bất kì)
for (let i = 0; i < 5; i++) {
  const A = [0, 0], ux = [1, 0], th = 0.5 + rnd() * 1.5, uy = [Math.cos(th), Math.sin(th)]
  const b = 1 + rnd() * 3, c = b + 1 + rnd() * 3
  const B = [b, 0], C = [c, 0]
  const ph = th + 0.4 + rnd() * 1.5, w = [Math.cos(ph), Math.sin(ph)]       // hướng của BD, CE (không phải vuông góc)
  const ln = (p) => [p[0] + w[0], p[1] + w[1]]
  const far = (u, t) => [u[0] * t, u[1] * t]
  const E = inter(C, ln(C), A, far(uy, 5)), D = inter(B, ln(B), A, far(uy, 5))
  const F = inter(E, [E[0] + (C[0] - D[0]), E[1] + (C[1] - D[1])], A, [1, 0])
  eq(cross(sub(D, B), sub(E, C)), 0, '5 BD//CE', 1e-7)
  eq(cross(sub(E, F), sub(C, D)), 0, '5 EF//CD', 1e-7)
  const r1 = dist(A, B) / dist(A, C), r2 = dist(A, D) / dist(A, E), r3 = dist(A, C) / dist(A, F)
  eq(r1, r2, '5a (1)'); eq(r3, r2, '5a (2)'); eq(r1, r3, '5 AB/AC=AC/AF')
  eq(dist(A, C) ** 2, dist(A, B) * dist(A, F), '5b AC²=AB·AF', 1e-7)
  n++; if (!(dist(A, B) < dist(A, C) && dist(A, C) < dist(A, F) && dist(A, D) < dist(A, E))) { fail++; console.log('FAIL 5 thứ tự') }
}
console.log(`kiem_G3: ${n} phép kiểm, ${fail} FAIL`)
