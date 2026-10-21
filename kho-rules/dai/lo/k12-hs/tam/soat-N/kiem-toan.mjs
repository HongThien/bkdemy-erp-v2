// Soát N1–N3: kiểm số các công thức lý thuyết nhóm (độc lập trạm soạn)
const rnd = () => Math.round((Math.random() * 10 - 5) * 2) / 2 || 1
const demCucTri = (f, a = -30, b = 30, n = 300000) => { // đếm đổi chiều trên lưới
  let c = 0, prev = null, h = (b - a) / n
  for (let i = 1; i < n; i++) { const d = f(a + (i + 1) * h) - f(a + i * h); if (Math.abs(d) < 1e-13) continue; const s = Math.sign(d); if (prev !== null && s !== prev) c++; prev = s }
  return c
}
let loi = 0; const ok = (c, m) => { if (!c) { loi++; console.log('SAI:', m) } }
// 1) bậc ba: số cực trị theo Δ'=b²−3ac; tâm x=−b/3a là trung điểm hai cực trị; luôn cắt Ox ≥1 lần
for (let k = 0; k < 300; k++) {
  const [a, b, c, d] = [rnd(), rnd(), rnd(), rnd()], f = (x) => a * x ** 3 + b * x ** 2 + c * x + d, D = b * b - 3 * a * c
  if (Math.abs(D) < 1e-9) continue
  ok(demCucTri(f) === (D > 0 ? 2 : 0), `bậc ba ${[a, b, c, d]}`)
  const x0 = -b / (3 * a); for (const t of [0.3, 1.7, 4]) ok(Math.abs(f(x0 + t) + f(x0 - t) - 2 * f(x0)) < 1e-6, 'tâm đối xứng')
  if (D > 0) { const r = Math.sqrt(D), x1 = (-b - r) / (3 * a), x2 = (-b + r) / (3 * a); ok(Math.abs((x1 + x2) / 2 - x0) < 1e-9 && Math.abs((x1 + x2) + 2 * b / (3 * a)) < 1e-9 && Math.abs(x1 * x2 - c / (3 * a)) < 1e-9, 'Viète') }
}
// 2) trùng phương: ab<0 → 3 cực trị, chiều cao b²/(4|a|), BC=2√(−b/2a); ab≥0 → 1
for (let k = 0; k < 300; k++) {
  const [a, b, c] = [rnd(), rnd(), rnd()], f = (x) => a * x ** 4 + b * x ** 2 + c
  ok(demCucTri(f, -10, 10) === (a * b < 0 ? 3 : 1), `trùng phương ${a},${b}`)
  if (a * b < 0) { const xk = Math.sqrt(-b / (2 * a)); ok(Math.abs(Math.abs(f(0) - f(xk)) - b * b / (4 * Math.abs(a))) < 1e-9, 'chiều cao') }
}
// 3) b2/b1: y=αx+β+γ/(x−x0): 2 cực trị ⇔ αγ>0, nằm hai bên x0; tâm I(x0; αx0+β)
for (let k = 0; k < 200; k++) {
  const [al, be, ga, x0] = [rnd(), rnd(), rnd(), rnd()], f = (x) => al * x + be + ga / (x - x0)
  const L = demCucTri(f, x0 - 30, x0 - 1e-3), R = demCucTri(f, x0 + 1e-3, x0 + 30)
  ok(L + R === (al * ga > 0 ? 2 : 0) && L === R, `b2/b1 ${al},${ga}`)
  for (const t of [0.5, 2]) ok(Math.abs(f(x0 + t) + f(x0 - t) - 2 * (al * x0 + be)) < 1e-9, 'tâm b2/b1')
}
// 4) |f| = p+q và f(|x|) = 2k+1 trên vài đa thức có nghiệm đơn
const pol = (r) => (x) => r.reduce((s, z) => s * (x - z), 1)
for (const [roots, p, q] of [[[-2, 0, 1, 3], 3, 4], [[-1, 2, 4], 2, 3]]) {
  const f = pol(roots); ok(demCucTri(f, -6, 7) === p, 'p'); ok(demCucTri((x) => Math.abs(f(x)), -6, 7) === p + q, `|f| p+q ${roots}`)
}
{ const f = pol([-2, 0.5, 1, 3]); // cực trị của f: đếm cực trị dương
  const kp = demCucTri(f, 1e-6, 8); ok(demCucTri((x) => f(Math.abs(x)), -8, 8) === 2 * kp + 1, 'f(|x|) 2k+1') }
// 5) |f+m| trên đoạn: f=x³−3x trên [−2;2] có K=2,k=−2... dùng f lệch: x³−3x+1 trên [0;2]: K=3,k=−1
{ const f = (x) => x ** 3 - 3 * x + 1, K = 3, kk = -1
  for (let m = -5; m <= 3; m += 0.25) { let mx = -1, mn = 1e9; for (let i = 0; i <= 20000; i++) { const v = Math.abs(f(2 * i / 20000) + m); mx = Math.max(mx, v); mn = Math.min(mn, v) }
    ok(Math.abs(mx - Math.max(Math.abs(m + K), Math.abs(m + kk))) < 1e-6, `max|f+m| m=${m}`)
    const kyv = (-K < m && m < -kk) ? 0 : Math.min(Math.abs(m + K), Math.abs(m + kk)); ok(Math.abs(mn - kyv) < 1e-3, `min|f+m| m=${m}`) } }
// 6) P3.3: M(xI+u; yI+K/u): d1·d2=|K|, điểm đối xứng thuộc đồ thị
{ const f = (x) => (2 * x + 1) / (x - 1) /* = 2 + 3/(x−1) */; for (const u of [0.5, -2, 3]) { const y = f(1 + u); ok(Math.abs(Math.abs(u) * Math.abs(y - 2) - 3) < 1e-9, 'd1d2'); ok(Math.abs(f(1 - u) - (4 - y)) < 1e-9, 'đối xứng') } }
console.log(loi ? `${loi} chỗ sai` : 'Tất cả công thức kiểm đều đúng')
