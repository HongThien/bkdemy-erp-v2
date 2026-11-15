// kiem_G14.mjs — verify số TCHH-3.II.28 (nhiều bộ toạ độ ngẫu nhiên)
let ok = 0, fail = 0
const chk = (nhan, cond) => { if (cond) ok++; else { fail++; console.log('FAIL', nhan) } }
const near = (a, b, e = 1e-7) => Math.abs(a - b) < e * Math.max(1, Math.abs(a), Math.abs(b))
const P = (x, y) => ({ x, y })
const add = (a, b) => P(a.x + b.x, a.y + b.y), sub = (a, b) => P(a.x - b.x, a.y - b.y), mul = (a, k) => P(a.x * k, a.y * k)
const mid = (a, b) => mul(add(a, b), 0.5)
const cr = (u, v) => u.x * v.y - u.y * v.x
const len = (u) => Math.hypot(u.x, u.y)
const par = (a, b, c, d) => near(cr(sub(b, a), sub(d, c)), 0, 1e-9)
const col = (a, b, c) => near(cr(sub(b, a), sub(c, a)), 0, 1e-9)
const R = (lo, hi) => lo + Math.random() * (hi - lo)

for (let t = 0; t < 60; t++) {
  const A = P(R(-9, 9), R(2, 9)), B = P(R(-9, -1), R(-2, 1)), C = P(R(1, 9), R(-2, 1))
  const M = mid(B, C), I = mid(B, M)
  const E = sub(mul(I, 2), A)               // IE = IA, E trên tia đối của IA
  const N = mid(E, C)
  chk('28 I trung điểm AE', near(len(sub(I, A)), len(sub(I, E))) && col(A, I, E))
  chk('28 ABEM: AE, BM cùng trung điểm I (AB⃗+... A+E = B+M)', near(A.x + E.x, B.x + M.x) && near(A.y + E.y, B.y + M.y))
  chk('28 AM∥BE', par(A, M, B, E))
  chk('28 MN∥BE', par(M, N, B, E))
  chk('28 MN=BE/2 (đường trung bình)', near(len(sub(N, M)), len(sub(E, B)) / 2))
  chk('28 A,M,N thẳng hàng', col(A, M, N))
  chk('28 tam giác không suy biến', Math.abs(cr(sub(B, A), sub(C, A))) > 1e-6)
}
console.log(`kiem_G14: ${ok} phép kiểm đạt, ${fail} FAIL`)
