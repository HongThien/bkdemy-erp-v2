// kiem_G22.mjs — verify số cho NDT-H3.19 … 27 (nhóm G22). node kiem_G22.mjs
let PASS = 0, FAIL = 0
const ok = (cond, msg) => { if (cond) PASS++; else { FAIL++; console.log('FAIL:', msg) } }
const eq = (a, b, msg, e = 1e-7) => ok(Math.abs(a - b) < e * Math.max(1, Math.abs(a), Math.abs(b)), `${msg}: ${a} vs ${b}`)

const P = (x, y) => ({ x, y })
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
const add = (a, b) => P(a.x + b.x, a.y + b.y)
const mul = (a, k) => P(a.x * k, a.y * k)
const dot = (a, b) => a.x * b.x + a.y * b.y
const cr = (a, b) => a.x * b.y - a.y * b.x
const len = (a) => Math.hypot(a.x, a.y)
const d = (a, b) => len(sub(a, b))
const lerp = (a, b, t) => add(a, mul(sub(b, a), t))
const inter = (a, b, c, e) => { const r = sub(b, a), s = sub(e, c), k = cr(r, s); return k === 0 ? null : lerp(a, b, cr(sub(c, a), s) / k) }
const foot = (p, a, b) => { const v = sub(b, a); return lerp(a, b, dot(sub(p, a), v) / dot(v, v)) }
const par = (a, b, c, e) => Math.abs(cr(sub(b, a), sub(e, c))) < 1e-8 * len(sub(b, a)) * len(sub(e, c))
const perp = (a, b, c, e) => Math.abs(dot(sub(b, a), sub(e, c))) < 1e-8 * len(sub(b, a)) * len(sub(e, c))
const coll = (a, b, c) => Math.abs(cr(sub(b, a), sub(c, a))) < 1e-8 * Math.max(1, d(a, b) * d(a, c))
const ang = (v, p, q) => Math.acos(Math.max(-1, Math.min(1, dot(sub(p, v), sub(q, v)) / (d(v, p) * d(v, q)))))
const between = (a, x, b) => coll(a, x, b) && dot(sub(a, x), sub(b, x)) < 0
// chân phân giác trong từ v xuống cạnh pq
const chan = (v, p, q) => lerp(p, q, d(v, p) / (d(v, p) + d(v, q)))
// tam giác theo ba cạnh a = BC, b = CA, c = AB
const tam = (a, b, c, ox = 0, oy = 0, rot = 0) => {
  const B = P(0, 0), C = P(a, 0), x = (c * c - b * b + a * a) / (2 * a), A = P(x, Math.sqrt(Math.max(0, c * c - x * x)))
  const R = (p) => P(ox + p.x * Math.cos(rot) - p.y * Math.sin(rot), oy + p.x * Math.sin(rot) + p.y * Math.cos(rot))
  return { A: R(A), B: R(B), C: R(C) }
}
let seed = 20251122
const rnd = (lo, hi) => { seed = (seed * 1103515245 + 12345) % 2147483648; return lo + (hi - lo) * seed / 2147483648 }
const tamNgauNhien = () => { for (;;) { const a = rnd(3, 9), b = rnd(3, 9), c = rnd(3, 9); if (a + b > c + 0.3 && b + c > a + 0.3 && a + c > b + 0.3) return [a, b, c] } }

// ───────── 19a ─────────
for (const rot of [0, 0.7]) {
  const { A, B, C } = tam(13.5, 6, 12, 3, 4, rot)
  const D = chan(A, B, C)
  eq(d(B, D), 9, '19a BD=9'); eq(d(D, C), 4.5, '19a DC=4.5'); eq(d(B, C), 13.5, '19a x=13,5')
  eq(d(B, D) / d(D, C), d(A, B) / d(A, C), '19a DB/DC=AB/AC')
  ok(between(B, D, C), '19a D giữa B,C')
  eq(ang(A, B, D), ang(A, D, C), '19a AD phân giác')
}
// ───────── 19b ─────────
for (const rot of [0, 1.1]) {
  const { A: M, B: N, C: Pp } = tam(13.5, 8, 10, -2, 5, rot)
  const I = chan(M, N, Pp)
  eq(d(I, Pp), 6, '19b y=6'); eq(d(N, I), 7.5, '19b IN=7,5')
  eq(d(N, I) / d(I, Pp), d(M, N) / d(M, Pp), '19b IN/IP=MN/MP')
  eq(13.5 - 6, 7.5, '19b 13,5-y'); eq((13.5 - 6) / 6, 10 / 8, '19b (13,5-y)/y=5/4')
}
// ───────── 20 (DE_SAU): kiểm cho chắc đề đúng ─────────
for (let i = 0; i < 4; i++) {
  const [a, b, c] = tamNgauNhien(); const { A, B, C } = tam(a, b, c, 1, 2, rnd(0, 6))
  const D = chan(A, B, C), s = (p, q, r) => Math.abs(cr(sub(q, p), sub(r, p))) / 2
  eq(s(A, B, D) / s(A, C, D), c / b, '20 S_ABD/S_ACD=AB/AC')
}
// ───────── 21 ─────────
{
  const A = P(0, 0), B = P(0, 8), C = P(6, 0)
  eq(d(B, C), 10, '21 BC=10'); eq(d(A, C), 6, '21 AC=6')
  const D = chan(A, B, C)
  eq(d(D, B), 40 / 7, '21 DB=40/7'); eq(d(D, C), 30 / 7, '21 DC=30/7')
  eq(d(D, B) / d(D, C), 8 / 6, '21 DB/DC=AB/AC'); eq(d(D, B) + d(D, C), 10, '21 DB+DC=BC')
  eq(10 / 7 * 4, 40 / 7, '21 số học'); eq(10 / 7 * 3, 30 / 7, '21 số học')
  eq(ang(A, B, D), ang(A, D, C), '21 AD phân giác')
}
// ───────── 24 ─────────
for (let i = 0; i < 40; i++) {
  const [a, b, c] = tamNgauNhien(); const { A, B, C } = tam(a, b, c, rnd(-3, 3), rnd(-3, 3), rnd(0, 6))
  const D = chan(A, B, C), E = chan(B, A, C), F = chan(C, A, B)
  const O = inter(A, D, B, E)
  ok(coll(C, F, O) || d(C, inter(C, F, A, D)) < 1e-7, '24 O thuộc CF')
  // O là giao ba phân giác: cách đều ba cạnh
  const h = (p, u, v) => d(p, foot(p, u, v))
  eq(h(O, A, B), h(O, B, C), '24 O cách đều AB, BC'); eq(h(O, B, C), h(O, C, A), '24 O cách đều BC, CA')
  eq(d(D, B), a * c / (b + c), '24 DB=ac/(b+c)')
  eq(d(D, B) / d(D, C), c / b, '24 DB/DC=c/b')
  eq(d(O, A) / d(O, D), (b + c) / a, '24 OA/OD=(b+c)/a')
  eq(d(O, A) / d(O, D), d(B, A) / d(B, D), '24 OA/OD=BA/BD (BO phân giác ∠ABD)')
  eq(ang(B, A, O), ang(B, O, D), '24 BO phân giác ∠ABD (O ∈ BE, tia BD ≡ tia BC)')
  eq(ang(B, A, E), ang(B, E, C), '24 BE phân giác')
  ok(between(A, O, D), '24 O giữa A, D')
}
// ───────── 25 ─────────
for (const m of [3, 5.5, 8]) {
  const n = 2 * m * Math.sin(18 * Math.PI / 180)
  const B = P(0, 0), C = P(n, 0), A = P(n / 2, m * Math.cos(18 * Math.PI / 180))
  eq(ang(A, B, C), 36 * Math.PI / 180, '25 A=36°'); eq(d(A, B), m, '25 AB=m'); eq(d(A, C), m, '25 AC=m')
  eq(ang(B, A, C), 72 * Math.PI / 180, '25 B=72°'); eq(ang(C, A, B), 72 * Math.PI / 180, '25 C=72°')
  const D = chan(C, A, B)                                   // CD phân giác góc C, D ∈ AB
  eq(ang(C, A, D), 36 * Math.PI / 180, '25 ∠ACD=36°'); eq(ang(C, D, B), 36 * Math.PI / 180, '25 ∠BCD=36°')
  eq(ang(A, C, D), 36 * Math.PI / 180, '25 ∠DAC=∠ACD=36°'); eq(d(D, A), d(D, C), '25 DA=DC')
  eq(ang(D, C, B), 72 * Math.PI / 180, '25 ∠CDB=72°'); eq(ang(B, C, D), 72 * Math.PI / 180, '25 ∠CBD=72°'); eq(d(C, B), d(C, D), '25 CB=CD')
  eq(d(D, A), n, '25 DA=n'); eq(d(D, B), m - n, '25 DB=m-n'); ok(between(A, D, B), '25 D giữa A,B')
  eq(d(D, A) / d(D, B), d(C, A) / d(C, B), '25 DA/DB=CA/CB'); eq(n / (m - n), m / n, '25 n/(m-n)=m/n')
  eq(n * n + m * n - m * m, 0, '25 n²+mn−m²=0', 1e-9)
}
// ───────── 26 ─────────
for (let i = 0; i < 40; i++) {
  const [a, b, c] = tamNgauNhien(); const { A, B, C } = tam(a, b, c, rnd(-3, 3), rnd(-3, 3), rnd(0, 6))
  const D = chan(B, A, C), E = chan(C, A, B)                 // BD ∩ AC, CE ∩ AB
  const I = inter(B, D, C, E)
  eq(d(D, C), a * b / (a + c), '26 DC=ab/(a+c)')
  eq(d(I, B) / d(I, D), (a + c) / b, '26 IB/ID=CB/CD=(a+c)/b')
  eq(d(I, B) / d(I, D), d(C, B) / d(C, D), '26 IB/ID=CB/CD (CI phân giác ∠BCD)')
  eq(d(I, B) / d(B, D), (a + c) / (a + b + c), '26 BI/BD=(a+c)/(a+b+c)')
  eq(d(E, B), a * c / (a + b), '26 EB=ac/(a+b)')
  eq(d(I, C) / d(I, E), (a + b) / c, '26 IC/IE=(a+b)/c')
  eq(d(I, C) / d(I, E), d(B, C) / d(B, E), '26 IC/IE=BC/BE (BI phân giác ∠CBE)')
  eq(d(I, C) / d(C, E), (a + b) / (a + b + c), '26 CI/CE=(a+b)/(a+b+c)')
  const tich = (d(I, B) / d(B, D)) * (d(I, C) / d(C, E))
  eq(tich, (a + b) * (a + c) / ((a + b + c) ** 2), '26 tích hai tỉ số')
  // tích = 1/2 ⇔ a² = b² + c²
  eq(2 * (a + b) * (a + c) - (a + b + c) ** 2, a * a - b * b - c * c, '26 khai triển: 2(a+b)(a+c)−(a+b+c)² = a²−b²−c²')
  ok(Math.abs(tich - 0.5) > 1e-4 || Math.abs(a * a - b * b - c * c) < 1e-6, '26 tích=1/2 chỉ khi vuông (ngẫu nhiên không vuông)')
}
for (const [b, c] of [[3, 4], [5, 12], [2.2, 3.7], [8, 3]]) {          // tam giác vuông tại A: tích = 1/2
  const a = Math.hypot(b, c), A = P(0, 0), B = P(c, 0), C = P(0, b)
  const D = chan(B, A, C), E = chan(C, A, B), I = inter(B, D, C, E)
  eq((d(I, B) / d(B, D)) * (d(I, C) / d(C, E)), 0.5, '26 vuông ⇒ tích = 1/2')
  eq(a * a, b * b + c * c, '26 Pythagore')
}
// ───────── 27a ─────────
for (const rot of [0, 0.9, 2.2]) {
  const { A, B, C } = tam(6, 8, 4, 1, -2, rot)
  eq(d(A, B), 4, '27a AB'); eq(d(A, C), 8, '27a AC'); eq(d(B, C), 6, '27a BC')
  const D = chan(A, B, C), E = chan(B, A, C), O = inter(A, D, B, E), M = lerp(B, C, 0.5), G = P((A.x + B.x + C.x) / 3, (A.y + B.y + C.y) / 3)
  eq(d(D, B), 2, '27a DB=2'); eq(d(D, C), 4, '27a DC=4'); eq(d(D, B) / d(D, C), 0.5, '27a DB/DC=AB/AC')
  eq(d(O, A) / d(O, D), 2, '27a OA/OD=2'); eq(d(O, A) / d(O, D), d(B, A) / d(B, D), '27a OA/OD=BA/BD')
  eq(ang(B, A, O), ang(B, O, D), '27a BO phân giác ∠ABD (O ∈ BE, tia BD ≡ tia BC)')
  ok(between(A, O, D), '27a O giữa A, D'); eq(d(A, O) / d(A, D), 2 / 3, '27a AO/AD=2/3')
  eq(d(A, G) / d(A, M), 2 / 3, '27a AG/AM=2/3'); ok(coll(A, G, M) && between(A, G, M), '27a G thuộc AM')
  ok(between(B, D, M), '27a D giữa B, M (D ≠ M)'); eq(d(B, M), 3, '27a BM=3')
  ok(par(O, G, B, C), '27a OG ∥ BC'); ok(par(O, G, D, M), '27a OG ∥ DM')
}
// ───────── 27b ─────────
const ngatTam = (A, B, C) => ang(A, B, C) < Math.PI / 2 && ang(B, A, C) < Math.PI / 2 && ang(C, A, B) < Math.PI / 2
// chung: ba đường đồng quy bất kì (hình tổng quát) — kiểm các bước KHÔNG phụ thuộc điều kiện M, N
function kiemChung(A, B, C, wa, wb, wc, ten) {
  const H = P(wa * A.x + wb * B.x + wc * C.x, wa * A.y + wb * B.y + wc * C.y)
  const D = lerp(B, C, wc / (wb + wc)), E = lerp(A, C, wc / (wa + wc)), F = lerp(A, B, wb / (wa + wb))
  ok(coll(A, H, D) && coll(B, H, E) && coll(C, H, F), ten + ' đồng quy')
  const M = inter(B, E, D, F), N = inter(C, F, D, E)
  ok(between(D, M, F), ten + ' M nằm giữa D, F'); ok(between(D, N, E), ten + ' N nằm giữa D, E')
  const Pp = inter(A, D, E, F)
  ok(between(E, Pp, F), ten + ' P thuộc đoạn EF')
  const k = (d(B, A) / d(B, F)) * (d(C, E) / d(C, A))
  eq(d(Pp, E) / d(Pp, F), k, ten + ' PE/PF=(BA/BF)(CE/CA) [Mê-nê-la-uýt ×2]')
  // hai phương trình Mê-nê-la-uýt cho △AFP (cát tuyến E,H,B) và △AEP (cát tuyến F,H,C)
  eq((d(E, F) / d(E, Pp)) * (d(H, Pp) / d(H, A)) * (d(B, A) / d(B, F)), 1, ten + ' Mê-nê-la-uýt △AFP, EHB')
  eq((d(F, Pp) / d(F, E)) * (d(C, E) / d(C, A)) * (d(H, A) / d(H, Pp)), 1, ten + ' Mê-nê-la-uýt △AEP, FHC')
  const T = inter(E, F, B, C)
  if (T) {
    eq((d(T, E) / d(T, F)) * (d(B, F) / d(B, A)) * (d(C, A) / d(C, E)), 1, ten + ' Mê-nê-la-uýt △AEF, BCT')
    eq(d(T, E) / d(T, F), k, ten + ' TE/TF=k')
    ok(!between(E, T, F), ten + ' T ngoài đoạn EF')
    ok(!between(A, B, F) && !between(A, C, E), ten + ' B, C ngoài các cạnh AF, AE')
  }
  return { H, D, E, F, M, N, Pp, T, k }
}
for (const [A, B, C, w] of [
  [P(1.2, 5.5), P(-2, 0), P(6, 0.4), [0.25, 0.4, 0.35]],
  [P(3, 7), P(0, 0), P(8, 1), [0.5, 0.2, 0.3]],
  [P(-1, 4), P(-3, -1), P(5, 0), [0.2, 0.35, 0.45]],
]) kiemChung(A, B, C, ...w, '27b[tq]')

// cấu hình đúng đề: D, E, F là chân ba đường cao
const tamNhon = () => { for (;;) { const A = P(rnd(-2, 8), rnd(4, 9)), B = P(rnd(-6, 0), rnd(-1, 1)), C = P(rnd(7, 13), rnd(-1, 1)); if (ngatTam(A, B, C)) return [A, B, C] } }
for (let i = 0; i < 30; i++) {
  const [A, B, C] = tamNhon()
  const D = foot(A, B, C), E = foot(B, A, C), F = foot(C, A, B)
  const H = inter(A, D, B, E)
  ok(coll(C, H, F), '27b ba đường cao đồng quy')
  ok(between(B, D, C) && between(A, E, C) && between(A, F, B), '27b D, E, F nằm trong cạnh (tam giác nhọn)')
  const M = inter(B, E, D, F), N = inter(C, F, D, E)
  eq(d(M, D) / d(M, F), d(E, D) / d(E, F), '27b giả thiết MD/MF=ED/EF thoả với chân đường cao')
  eq(d(N, D) / d(N, E), d(F, D) / d(F, E), '27b giả thiết ND/NE=FD/FE thoả với chân đường cao')
  // bước 1: EM là phân giác ∠DEF; FN là phân giác ∠DFE; DH là phân giác ∠EDF
  eq(ang(E, D, M), ang(E, M, F), '27b EM phân giác ∠DEF')
  eq(ang(F, D, N), ang(F, E, N), '27b FN phân giác ∠DFE')
  eq(ang(D, E, H), ang(D, F, H), '27b DH phân giác ∠EDF')
  ok(between(D, M, F) && between(D, N, E), '27b M ∈ đoạn DF, N ∈ đoạn DE')
  // M, F ở hai phía BE: (E giữa A, C) ⇒ D, F khác phía đối với BE
  ok(cr(sub(E, B), sub(D, B)) * cr(sub(E, B), sub(F, B)) < 0, '27b D, F khác phía đối với BE')
  const r = kiemChung2(A, B, C, D, E, F, H)
}
function kiemChung2(A, B, C, D, E, F, H) {
  const Pp = inter(A, D, E, F), T = inter(E, F, B, C)
  eq(d(Pp, E) / d(Pp, F), d(D, E) / d(D, F), '27b PE/PF=DE/DF (DP phân giác trong △DEF)')
  const k = (d(B, A) / d(B, F)) * (d(C, E) / d(C, A))
  eq(d(Pp, E) / d(Pp, F), k, '27b PE/PF=k')
  if (T) {
    eq(d(T, E) / d(T, F), k, '27b TE/TF=k'); eq(d(T, E) / d(T, F), d(D, E) / d(D, F), '27b TE/TF=DE/DF')
    ok(!between(E, T, F), '27b T ngoài đoạn EF'); ok(Math.abs(d(D, E) - d(D, F)) > 1e-9, '27b DE ≠ DF khi T tồn tại')
    // DT là phân giác ngoài của ∠EDF: vuông góc với phân giác trong DP; và DT ≡ BC
    ok(perp(D, Pp, D, T), '27b DT ⊥ DP'); ok(coll(D, T, B) && coll(D, T, C), '27b D, T thuộc BC')
    // T và chân phân giác ngoài T' cùng phía: nằm về phía đỉnh có cạnh kề nhỏ hơn
    const nhoHon = d(D, E) < d(D, F) ? E : F, lonHon = nhoHon === E ? F : E
    ok(dot(sub(T, nhoHon), sub(lonHon, nhoHon)) < 0, '27b T nằm về phía đỉnh có cạnh kề nhỏ hơn')
  }
  ok(perp(A, D, B, C), '27b AD ⊥ BC'); ok(perp(B, E, A, C), '27b BE ⊥ CA'); ok(perp(C, F, A, B), '27b CF ⊥ AB')
  return null
}
// trường hợp EF ∥ BC (AB = AC): k = 1, PE = PF, DE = DF
for (const h of [5, 7.5]) {
  const A = P(0, h), B = P(-3, 0), C = P(3, 0)
  const D = foot(A, B, C), E = foot(B, A, C), F = foot(C, A, B), H = inter(A, D, B, E)
  ok(par(E, F, B, C), '27b AB=AC: EF ∥ BC')
  const Pp = inter(A, D, E, F), k = (d(B, A) / d(B, F)) * (d(C, E) / d(C, A))
  eq(k, 1, '27b EF∥BC ⇒ k=1'); eq(d(Pp, E), d(Pp, F), '27b PE=PF'); eq(d(D, E), d(D, F), '27b DE=DF')
  ok(perp(D, Pp, E, F), '27b DP ⊥ EF'); ok(perp(A, D, B, C), '27b AD ⊥ BC')
  eq(d(C, E) / d(C, A), d(B, F) / d(B, A), '27b EF∥BC ⇒ CE/CA=BF/BA (Thalès)')
  ok(coll(C, H, F), '27b đồng quy')
}
// kiểm CHIỀU DUY NHẤT: nếu ba đường đồng quy mà thoả cả hai giả thiết thì H là trực tâm.
// Với mỗi tam giác nhọn, quét H bất kì (toạ độ trọng tâm) tìm các điểm thoả r(H) ≈ 0; chúng phải trùng trực tâm.
function phanDu(A, B, C, H) {
  const [wa, wb, wc] = baryOf(A, B, C, H)
  const D = lerp(B, C, wc / (wb + wc)), E = lerp(A, C, wc / (wa + wc)), F = lerp(A, B, wb / (wa + wb))
  const M = inter(B, E, D, F), N = inter(C, F, D, E)
  return Math.abs(d(M, D) / d(M, F) - d(E, D) / d(E, F)) + Math.abs(d(N, D) / d(N, E) - d(F, D) / d(F, E))
}
function baryOf(A, B, C, H) {
  const t = cr(sub(B, A), sub(C, A))
  const wb = cr(sub(H, A), sub(C, A)) / t, wc = cr(sub(B, A), sub(H, A)) / t
  return [1 - wb - wc, wb, wc]
}
for (let i = 0; i < 3; i++) {
  const [A, B, C] = tamNhon()
  const H0 = inter(A, foot(A, B, C), B, foot(B, A, C))
  eq(phanDu(A, B, C, H0), 0, '27b phần dư tại trực tâm = 0', 1e-9)
  let tot = 0, dem = 0, xa = 0
  const N = 90
  for (let u = 6; u < N; u++) for (let v = 6; v < N - u - 5; v++) {   // H nằm trong, cách mép tam giác (tránh suy biến sát cạnh)
    const H = add(add(mul(A, u / N), mul(B, v / N)), mul(C, (N - u - v) / N))
    const r = phanDu(A, B, C, H); dem++
    if (r < 0.01 && d(H, H0) > 0.6) xa++            // gần nghiệm nhưng xa trực tâm?
  }
  ok(xa === 0, `27b không có H nào xa trực tâm mà phần dư < 0,01 (tam giác ${i + 1}, ${dem} điểm quét)`)
}

console.log(`PASS ${PASS} · FAIL ${FAIL}`)
process.exit(FAIL ? 1 : 0)
