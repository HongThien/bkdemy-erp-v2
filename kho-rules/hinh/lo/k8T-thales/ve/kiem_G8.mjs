// kiem_G8.mjs — verify số cho TCHH CĐ5 Bài 7–12 (trạm G8). node kiem_G8.mjs
let seed = 12345
const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296 }
const between = (a, b) => a + (b - a) * rnd()
let n = 0, fail = 0
const ok = (cond, msg) => { n++; if (!cond) { fail++; console.log('FAIL', msg) } }
const eq = (a, b, msg, eps = 1e-7) => ok(Math.abs(a - b) < eps * Math.max(1, Math.abs(a), Math.abs(b)), `${msg}: ${a} vs ${b}`)

const P = (x, y) => ({ x, y })
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
const add = (a, b) => P(a.x + b.x, a.y + b.y)
const mul = (a, k) => P(a.x * k, a.y * k)
const dot = (a, b) => a.x * b.x + a.y * b.y
const crs = (a, b) => a.x * b.y - a.y * b.x
const len = (a) => Math.hypot(a.x, a.y)
const dist = (a, b) => len(sub(a, b))
const lerp = (a, b, t) => add(a, mul(sub(b, a), t))
const mid = (a, b) => lerp(a, b, 0.5)
const inter = (a, b, c, d) => { const r = sub(b, a), s = sub(d, c); const t = crs(sub(c, a), s) / crs(r, s); return add(a, mul(r, t)) }
const foot = (p, a, b) => { const d = sub(b, a); return lerp(a, b, dot(sub(p, a), d) / dot(d, d)) }
const par = (a, b, c, d) => Math.abs(crs(sub(b, a), sub(d, c))) < 1e-7 * len(sub(b, a)) * len(sub(d, c))
const perp = (a, b, c, d) => Math.abs(dot(sub(b, a), sub(d, c))) < 1e-7 * len(sub(b, a)) * len(sub(d, c))
const col = (a, b, c) => Math.abs(crs(sub(b, a), sub(c, a))) < 1e-7 * dist(a, b) * dist(a, c)
const ang = (v, p, q) => Math.acos(dot(sub(p, v), sub(q, v)) / (dist(v, p) * dist(v, q)))
const randTri = () => { // tam giác bất kỳ, không cân, không suy biến
  for (;;) {
    const A = P(between(0, 6), between(4, 9)), B = P(between(-6, -1), 0), C = P(between(1, 8), 0)
    const a = dist(B, C), b = dist(A, C), c = dist(A, B)
    if (Math.abs(a - b) > 0.4 && Math.abs(b - c) > 0.4 && Math.abs(a - c) > 0.4) return [A, B, C]
  }
}
// chân phân giác trong từ đỉnh V xuống cạnh XY: chia XY theo tỉ lệ VX:VY
const footBis = (V, X, Y) => lerp(X, Y, dist(V, X) / (dist(V, X) + dist(V, Y)))

// ───────── Bài 7 ─────────
for (let k = 0; k < 40; k++) {
  const [A, B, C] = randTri()
  const a = dist(B, C), b = dist(C, A), c = dist(A, B)
  const D = footBis(A, B, C), M = footBis(B, C, A), N = footBis(C, A, B)
  eq(ang(A, B, D), ang(A, D, C), 'B7 AD phân giác')
  // DE ∥ AC, E ∈ AB
  const E = inter(D, add(D, sub(C, A)), A, B)
  ok(par(D, E, A, C), 'B7 DE∥AC')
  // E nằm giữa A, B
  ok(dot(sub(E, A), sub(E, B)) < 0, 'B7 E giữa A,B')
  eq(ang(D, A, E), ang(A, D, E), 'B7 góc EAD = góc EDA')
  eq(dist(E, A), dist(E, D), 'B7 EA=ED')
  eq(dist(E, D) / dist(A, C), dist(B, E) / dist(B, A), 'B7 Thalès DE/AC=BE/BA')
  eq(1 / c + 1 / b, 1 / dist(A, E), 'B7 1/AB+1/AC=1/AE')
  ok(dist(A, E) + dist(E, D) > dist(A, D), 'B7 bđt tam giác')
  ok(2 * dist(A, E) > dist(A, D), 'B7 2AE>AD')
  const la = dist(A, D), lb = dist(B, M), lc = dist(C, N)
  ok(1 / la > 0.5 * (1 / b + 1 / c), 'B7 (4)')
  ok(1 / lb > 0.5 * (1 / c + 1 / a), 'B7 (5)')
  ok(1 / lc > 0.5 * (1 / a + 1 / b), 'B7 (6)')
  ok(1 / la + 1 / lb + 1 / lc >= 1 / a + 1 / b + 1 / c, 'B7 kết luận')
  // công thức la = 2bc cos(A/2)/(b+c)
  eq(la, 2 * b * c * Math.cos(ang(A, B, C) / 2) / (b + c), 'B7 la công thức')
}

// ───────── Bài 8 (DE_SAU): kiểm mệnh đề — trực tâm = tâm nội tiếp tam giác chân đường cao ─────────
for (let k = 0; k < 20; k++) {
  let A, B, C
  for (;;) { [A, B, C] = randTri(); if (ang(A, B, C) < 1.5 && ang(B, A, C) < 1.5 && ang(C, A, B) < 1.5) break }
  const D = foot(A, B, C), Ee = foot(B, A, C), F = foot(C, A, B)
  const H = inter(A, D, B, Ee)
  ok(col(C, F, H), 'B8 CF qua H')
  // H cách đều ba cạnh của DEF
  const d = (X, Y) => { const f = foot(H, X, Y); return dist(H, f) }
  eq(d(D, Ee), d(Ee, F), 'B8 khoảng cách H đến DE, EF')
  eq(d(Ee, F), d(F, D), 'B8 khoảng cách H đến EF, FD')
  // chân các khoảng cách nằm trong cạnh (H nằm trong DEF)
  eq(ang(F, D, H), ang(F, Ee, H), 'B8 FH phân giác góc F')
  eq(ang(D, F, H), ang(D, Ee, H), 'B8 DH phân giác góc D')
  eq(ang(Ee, D, H), ang(Ee, F, H), 'B8 EH phân giác góc E')
}

// ───────── Bài 9 (Mê-nê-la-uýt) ─────────
const tichMenel = (A, B, C, M, N, Pp) => dist(M, B) / dist(M, C) * dist(N, C) / dist(N, A) * dist(Pp, A) / dist(Pp, B)
const trong = (X, Y, Z) => dot(sub(Z, X), sub(Z, Y)) < 0   // Z nằm trong đoạn XY (3 điểm thẳng hàng)
let soThuan = 0, soDao = 0, soLoai = 0
for (let k = 0; k < 400; k++) {
  const [A, B, C] = randTri()
  // đường thẳng bất kì cắt ba đường thẳng cạnh
  const O = P(between(-3, 5), between(1, 6)), th = between(0, Math.PI)
  const d = P(Math.cos(th), Math.sin(th)), O2 = add(O, d)
  if (par(O, O2, B, C) || par(O, O2, C, A) || par(O, O2, A, B)) continue
  const M = inter(O, O2, B, C), N = inter(O, O2, C, A), Pp = inter(O, O2, A, B)
  if ([[M, B], [M, C], [N, C], [N, A], [Pp, A], [Pp, B]].some(([u, v]) => dist(u, v) < 1e-3)) continue
  // ý a: thuận
  eq(tichMenel(A, B, C, M, N, Pp), 1, 'B9a tích = 1', 1e-7); soThuan++
  // Thalès với AQ ∥ BC, Q ∈ MN
  const Q = inter(O, O2, A, add(A, sub(C, B)))
  ok(par(A, Q, B, C), 'B9a AQ∥BC')
  eq(dist(Pp, A) / dist(Pp, B), dist(Q, A) / dist(M, B), 'B9a PA/PB=QA/MB')
  eq(dist(N, C) / dist(N, A), dist(M, C) / dist(Q, A), 'B9a NC/NA=MC/QA')
  // số điểm ngoài cạnh phải lẻ (0 hoặc 2 điểm trong cạnh)
  const ngoai = [!trong(B, C, M), !trong(C, A, N), !trong(A, B, Pp)].filter(Boolean).length
  ok(ngoai === 1 || ngoai === 3, `B9 số điểm ngoài cạnh lẻ: ${ngoai}`)
  // ý b: đảo — thay M bởi M* khác (cùng tỉ số MB/MC nhưng khác trạng thái trong/ngoài): không thẳng hàng
  const k0 = dist(M, B) / dist(M, C)
  if (Math.abs(k0 - 1) > 1e-3) {
    const nM = trong(B, C, M)
    const Mt = nM
      ? (k0 < 1 ? add(B, mul(sub(B, C), k0 / (1 - k0))) : add(C, mul(sub(C, B), 1 / (k0 - 1))))
      : lerp(B, C, k0 / (1 + k0))
    eq(dist(Mt, B) / dist(Mt, C), k0, 'B9b điểm liên hợp cùng tỉ số')
    ok(trong(B, C, Mt) !== nM, 'B9b điểm liên hợp khác trạng thái trong/ngoài')
    eq(tichMenel(A, B, C, Mt, N, Pp), 1, 'B9b tích vẫn =1 với điểm liên hợp')
    ok(!col(Mt, N, Pp), 'B9b điểm liên hợp KHÔNG thẳng hàng (vì thế cần điều kiện chẵn lẻ)')
    const ng2 = [!trong(B, C, Mt), !trong(C, A, N), !trong(A, B, Pp)].filter(Boolean).length
    ok(ng2 === 0 || ng2 === 2, 'B9b bộ liên hợp có số điểm ngoài cạnh chẵn')
    soLoai++
  }
  // chứng minh đảo: M' = NP ∩ BC; cùng tỉ số + cùng trạng thái ⇒ M' = M
  const Mp = inter(N, Pp, B, C)
  eq(dist(Mp, M), 0, 'B9b M′=M', 1e-6); soDao++
  eq(dist(Mp, B) / dist(Mp, C), dist(M, B) / dist(M, C), 'B9b tỉ số M′ = tỉ số M')
}
console.log('B9: thuận', soThuan, 'đảo', soDao, 'bộ liên hợp loại', soLoai)
// NP ∥ BC: M trung điểm khi tích = 1, và N, P cùng trạng thái
for (let k = 0; k < 30; k++) {
  const [A, B, C] = randTri()
  const t = between(-1.5, 2.5)
  if (Math.abs(t) < 0.05 || Math.abs(t - 1) < 0.05) continue
  const Pp = lerp(A, B, t), N = lerp(A, C, t)
  ok(par(N, Pp, B, C), 'B9 NP∥BC')
  eq(dist(N, C) / dist(N, A) * dist(Pp, A) / dist(Pp, B), 1, 'B9 NP∥BC: NC/NA·PA/PB=1')
  eq(dist(Pp, A) / dist(Pp, B), dist(N, A) / dist(N, C), 'B9 NP∥BC: AP/PB=AN/NC')
  ok(trong(A, B, Pp) === trong(A, C, N), 'B9 NP∥BC: N, P cùng trạng thái')
}

// ───────── Bài 10 ─────────
for (let k = 0; k < 30; k++) {
  const h = between(2, 7), w = between(1, 5)
  const H = P(0, 0), B = P(-w, 0), C = P(w, 0), A = P(0, h)
  const E = foot(H, A, C), O = mid(H, E), D = mid(E, C)
  ok(perp(H, E, A, C), 'B10 HE⊥AC')
  ok(trong(A, C, E), 'B10 E thuộc đoạn AC')
  ok(par(H, D, B, E), 'B10 HD∥BE')
  ok(par(D, O, H, C), 'B10 DO∥HC')
  ok(perp(A, H, B, C), 'B10 AH⊥BC')
  ok(perp(D, O, A, H), 'B10 DO⊥AH')
  ok(col(A, D, C), 'B10 D∈AC')
  ok(perp(H, O, A, D), 'B10 HO⊥AD')
  ok(perp(A, O, H, D), 'B10 AO⊥HD (O trực tâm AHD)')
  ok(perp(A, O, B, E), 'B10 AO⊥BE (kết luận)')
}
// cả tam giác cân ở vị trí xoay bất kì (không đặt H ở gốc)
for (let k = 0; k < 10; k++) {
  const th = between(0, 6.28), cs = Math.cos(th), sn = Math.sin(th)
  const R = (p) => P(p.x * cs - p.y * sn + 3, p.x * sn + p.y * cs - 2)
  const A = R(P(0, 5)), B = R(P(-2.5, 0)), C = R(P(2.5, 0)), H = R(P(0, 0))
  const E = foot(H, A, C), O = mid(H, E)
  ok(perp(A, O, B, E), 'B10 xoay: AO⊥BE')
}

// ───────── Bài 11 ─────────
for (let k = 0; k < 40; k++) {
  const [A, B, C] = randTri()
  const M = lerp(B, C, between(0.1, 0.9))
  const dir = sub(M, A)
  const Pp = inter(B, add(B, dir), A, C)
  const Q = inter(C, add(C, dir), A, B)
  ok(par(B, Pp, A, M), 'B11 BP∥AM'); ok(par(C, Q, A, M), 'B11 CQ∥AM')
  eq(dist(A, M) / dist(Pp, B), dist(C, M) / dist(C, B), 'B11 AM/PB=CM/CB')
  eq(dist(A, M) / dist(Q, C), dist(B, M) / dist(B, C), 'B11 AM/QC=BM/BC')
  eq(dist(A, M) / dist(Pp, B) + dist(A, M) / dist(Q, C), 1, 'B11 tổng =1')
  eq(1 / dist(A, M), 1 / dist(Pp, B) + 1 / dist(Q, C), 'B11 kết luận')
}

// ───────── Bài 12 ─────────
for (let k = 0; k < 40; k++) {
  const [A, B, C] = randTri()
  const D = mid(B, C), E = lerp(A, D, between(0.1, 0.9))
  const M = inter(B, E, A, C), N = inter(C, E, A, B)
  const Pp = inter(E, add(E, sub(C, B)), A, B), Q = inter(E, add(E, sub(C, B)), A, C)
  eq(dist(Pp, E) / dist(B, D), dist(A, E) / dist(A, D), 'B12 PE/BD=AE/AD')
  eq(dist(E, Q) / dist(D, C), dist(A, E) / dist(A, D), 'B12 EQ/DC=AE/AD')
  eq(dist(Pp, E), dist(E, Q), 'B12 PE=EQ')
  eq(dist(N, E) / dist(N, C), dist(Pp, E) / dist(B, C), 'B12 NE/NC=PE/BC')
  eq(dist(M, E) / dist(M, B), dist(E, Q) / dist(B, C), 'B12 ME/MB=EQ/BC')
  eq(dist(N, E) / dist(N, C), dist(M, E) / dist(M, B), 'B12 NE/NC=ME/MB')
  eq(dist(E, N) / dist(E, C), dist(E, M) / dist(E, B), 'B12 EN/EC=EM/EB')
  ok(trong(N, C, E) && trong(M, B, E), 'B12 E giữa N,C và M,B')
  ok(par(M, N, B, C), 'B12 MN∥BC')
}
console.log(`KIỂM XONG: ${n} phép kiểm, ${fail} FAIL`)
process.exit(fail ? 1 : 0)
