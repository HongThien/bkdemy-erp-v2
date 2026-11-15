// kiem_G10.mjs — verify số cho TCHH CĐ3 II VD3,4,5,7,8,9 (nhóm G10, lô 2). node kiem_G10.mjs
let PASS = 0, FAIL = 0
const ok = (cond, msg) => { if (cond) PASS++; else { FAIL++; console.log('FAIL:', msg) } }
const eq = (a, b, msg, e = 1e-9) => ok(Math.abs(a - b) < e * Math.max(1, Math.abs(a), Math.abs(b)), `${msg}: ${a} vs ${b}`)

const P = (x, y) => ({ x, y })
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
const add = (a, b) => P(a.x + b.x, a.y + b.y)
const mul = (a, k) => P(a.x * k, a.y * k)
const dot = (a, b) => a.x * b.x + a.y * b.y
const cr = (a, b) => a.x * b.y - a.y * b.x
const len = (a) => Math.hypot(a.x, a.y)
const d = (a, b) => len(sub(a, b))
const lerp = (a, b, t) => add(a, mul(sub(b, a), t))
const mid = (a, b) => lerp(a, b, 0.5)
const inter = (a, b, c, e) => { const r = sub(b, a), s = sub(e, c), k = cr(r, s); return lerp(a, b, cr(sub(c, a), s) / k) }
const par = (a, b, c, e) => Math.abs(cr(sub(b, a), sub(e, c))) < 1e-9 * len(sub(b, a)) * len(sub(e, c))
const coll = (a, b, c) => Math.abs(cr(sub(b, a), sub(c, a))) < 1e-9 * Math.max(1, d(a, b) * d(a, c))
const between = (a, x, b) => coll(a, x, b) && dot(sub(a, x), sub(b, x)) < 0   // x nằm giữa a, b
const ang = (v, p, q) => Math.acos(dot(sub(p, v), sub(q, v)) / (d(v, p) * d(v, q)))
const unit = (v) => mul(v, 1 / len(v))
const bis = (v, p, q) => add(v, add(unit(sub(p, v)), unit(sub(q, v))))   // điểm trên tia phân giác góc pvq
const noiTiep = (a, b, c) => inter(a, bis(a, b, c), b, bis(b, a, c))
const rnd = (a, b) => a + Math.random() * (b - a)

// ───────── VD3: ABC cân tại B (BA = BC), AM, CN phân giác ─────────
for (let i = 0; i < 6; i++) {
  const b = rnd(1, 5), a = rnd(b / 2 + 0.2, 6)             // BA = BC = a > b/2
  const A = P(0, 0), C = P(b, 0), B = P(b / 2, Math.sqrt(a * a - b * b / 4))
  const M = inter(A, bis(A, B, C), B, C), N = inter(C, bis(C, B, A), B, A)
  ok(between(B, M, C) && between(B, N, A), '3 M, N nằm trong cạnh')
  eq(d(N, B) / d(N, A), d(C, B) / d(C, A), '3 (1) NB/NA = CB/CA')
  eq(d(M, B) / d(M, C), d(A, B) / d(A, C), '3 (2) MB/MC = AB/AC')
  eq(d(C, B) / d(C, A), d(A, B) / d(A, C), '3 (3) BA = BC ⇒ CB/CA = AB/AC')
  eq(d(N, B) / d(B, A), d(M, B) / d(B, C), '3 BN/BA = BM/BC')
  ok(par(M, N, A, C), '3 MN ∥ AC')
}

// ───────── VD4: hình vuông, M ∈ BC, N = AM ∩ CD, BE = CM ─────────
for (let i = 0; i < 8; i++) {
  const s = rnd(1, 6), u = rnd(0.05, 0.95)
  const A = P(0, 0), B = P(s, 0), C = P(s, s), D = P(0, s)
  const M = lerp(B, C, u), N = inter(A, M, C, D)
  const E = lerp(B, A, d(C, M) / s)
  eq(d(B, E), d(C, M), '4 BE = CM')
  ok(between(A, E, B), '4 E nằm giữa A, B')
  ok(between(A, M, N), '4 M nằm giữa A, N (M ở giữa hai đường song song)')
  eq(d(A, E), d(B, M), '4 (1) AE = BM')
  eq(d(A, M) / d(M, N), d(B, M) / d(M, C), '4 (2) AM/MN = BM/MC')
  eq(d(A, E) / d(E, B), d(A, M) / d(M, N), '4 AE/EB = AM/MN')
  eq(d(A, E) / d(A, B), d(A, M) / d(A, N), '4 AE/AB = AM/AN')
  ok(par(M, E, B, N), '4 ME ∥ BN')
  // O = AC ∩ BD không dùng, vẫn kiểm đề: O là tâm
  const O = inter(A, C, B, D); eq(O.x, s / 2, '4 O'); eq(O.y, s / 2, '4 O')
}

// ───────── VD5: hình thang ABCD, AK ∥ BC, BI ∥ AD ─────────
for (let i = 0; i < 10; i++) {
  const D = P(0, 0), cd = rnd(3, 8), C = P(cd, 0)
  const ab = rnd(0.5, cd - 0.3), h = rnd(1, 4), x0 = rnd(-1, cd - ab + 1)
  const A = P(x0, h), B = P(x0 + ab, h)
  const K = inter(A, add(A, sub(C, B)), D, C), I = inter(B, add(B, sub(D, A)), D, C)
  const E = inter(A, K, B, D), F = inter(B, I, A, C)
  ok(par(A, B, C, D) && ab < cd, '5 gt')
  ok(between(D, K, C) && between(D, I, C), '5 K, I thuộc đoạn CD')
  eq(d(C, K), ab, '5 CK = AB'); eq(d(D, I), ab, '5 DI = AB')
  eq(d(D, K), cd - ab, '5 DK = CD − AB'); eq(d(I, C), cd - ab, '5 IC = CD − AB')
  eq(d(D, K), d(I, C), '5 (1) DK = IC')
  ok(between(A, E, K) && between(B, E, D), '5 E nằm giữa A, K và giữa B, D (đường chéo hình thang ABKD)')
  ok(between(A, F, C) && between(B, F, I), '5 F nằm giữa A, C và giữa B, I (đường chéo hình thang ABCI)')
  eq(d(A, E) / d(E, K), d(A, B) / d(D, K), '5 (2) AE/EK = AB/DK')
  eq(d(A, F) / d(F, C), d(A, B) / d(I, C), '5 (3) AF/FC = AB/IC')
  eq(d(A, E) / d(A, K), d(A, F) / d(A, C), '5 AE/AK = AF/AC')
  ok(par(E, F, C, D), '5 EF ∥ CD')
}

// ───────── VD7: ABC, trung tuyến AM, MK phân giác AMB, MH phân giác AMC ─────────
for (let i = 0; i < 8; i++) {
  const B = P(0, 0), C = P(rnd(2, 7), 0), A = P(rnd(-2, 8), rnd(1, 5)), M = mid(B, C)
  const K = inter(M, bis(M, A, B), A, B), H = inter(M, bis(M, A, C), A, C)
  ok(between(A, K, B) && between(A, H, C), '7 K, H trong cạnh')
  eq(ang(M, A, K), ang(M, K, B), '7 MK phân giác'); eq(ang(M, A, H), ang(M, H, C), '7 MH phân giác')
  eq(d(A, K) / d(K, B), d(M, A) / d(M, B), '7 (1) AK/KB = MA/MB')
  eq(d(A, H) / d(H, C), d(M, A) / d(M, C), '7 (2) AH/HC = MA/MC')
  eq(d(A, K) / d(K, B), d(A, H) / d(H, C), '7 AK/KB = AH/HC')
  eq(d(A, K) / d(A, B), d(A, H) / d(A, C), '7 AK/AB = AH/AC')
  ok(par(H, K, B, C), '7 HK ∥ BC')
}

// ───────── VD8: tứ giác lồi ABCD, O = AC ∩ BD; MN qua O; ME ∥ CD; NF ∥ AB ─────────
let nVD8 = 0
for (let tries = 0; tries < 400 && nVD8 < 10; tries++) {
  // tứ giác lồi ngẫu nhiên: 4 đỉnh trên một vòng quanh tâm, góc tăng dần
  const g0 = rnd(0, 6.28), cs = [0, 1, 2, 3].map((k) => g0 + k * 1.5708 + rnd(-0.5, 0.5))
  const [A, B, C, D] = cs.map((t) => { const r = rnd(2, 5); return P(r * Math.cos(t), r * Math.sin(t)) })
  const O = inter(A, C, B, D)
  if (!between(A, O, C) || !between(B, O, D)) continue            // chỉ lấy tứ giác lồi (hai đường chéo cắt nhau trong)
  const M = lerp(A, B, rnd(0.1, 0.9)), N = inter(M, O, C, D)
  if (!between(C, N, D) || !between(M, O, N)) continue             // đường thẳng qua O cắt đúng cạnh AB và cạnh CD
  const E = inter(M, add(M, sub(D, C)), A, C), F = inter(N, add(N, sub(B, A)), B, D)
  nVD8++
  ok(par(M, E, C, D) && par(N, F, A, B), '8 gt song song')
  ok(between(B, O, F), '8 O nằm giữa B và F'); ok(between(E, O, C), '8 O nằm giữa E và C')
  eq(d(O, B) / d(O, F), d(O, M) / d(O, N), '8 (1) OB/OF = OM/ON')
  eq(d(O, E) / d(O, C), d(O, M) / d(O, N), '8 (2) OE/OC = OM/ON')
  eq(d(O, B) / d(O, F), d(O, E) / d(O, C), '8 OB/OF = OE/OC')
  eq(d(O, F) / d(O, B), d(O, C) / d(O, E), '8 OF/OB = OC/OE')
  ok(par(B, E, C, F), '8 BE ∥ CF')
}
ok(nVD8 >= 10, `8 chỉ dựng được ${nVD8} bộ hợp lệ`)

// ───────── VD9: AB + AC = 2BC; I tâm nội tiếp, G trọng tâm ─────────
for (let i = 0; i < 10; i++) {
  const BC = rnd(1, 4), AB = rnd(BC * 0.52, BC * 1.48), AC = 2 * BC - AB
  if (Math.abs(AB - AC) < 0.05 * BC) { i--; continue }            // AB = AC thì I = G (đề loại)
  const B = P(0, 0), C = P(BC, 0), xa = (AB * AB - AC * AC + BC * BC) / (2 * BC), A = P(xa, Math.sqrt(AB * AB - xa * xa))
  eq(d(A, B), AB, '9 AB'); eq(d(A, C), AC, '9 AC'); eq(AB + AC, 2 * BC, '9 gt')
  const I = noiTiep(A, B, C), G = P((A.x + B.x + C.x) / 3, (A.y + B.y + C.y) / 3), M = mid(B, C), D = inter(A, I, B, C)
  ok(between(B, D, C), '9 D nằm giữa B, C')
  eq(d(A, B) / d(B, D), d(A, I) / d(I, D), '9 BI phân giác ΔABD: AI/ID = AB/BD')
  eq(d(A, C) / d(C, D), d(A, I) / d(I, D), '9 CI phân giác ΔACD: AI/ID = AC/CD')
  eq(d(A, I) / d(I, D), (AB + AC) / BC, '9 (1) AI/ID = (AB+AC)/BC')
  eq(d(A, I) / d(I, D), 2, '9 AI/ID = 2')
  eq(d(A, G) / d(G, M), 2, '9 AG/GM = 2')
  eq(d(A, I) / d(A, D), d(A, G) / d(A, M), '9 AI/AD = AG/AM')
  ok(d(I, G) > 1e-6 && d(D, M) > 1e-6, '9 I ≠ G, D ≠ M')
  ok(par(I, G, B, C), '9 IG ∥ BC')
}

console.log(`PASS ${PASS} · FAIL ${FAIL}`)
process.exit(FAIL ? 1 : 0)
