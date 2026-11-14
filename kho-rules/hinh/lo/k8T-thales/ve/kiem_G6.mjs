// kiem_G6.mjs — verify số cho NDT-H3.15 … 18 (nhóm G6). node kiem_G6.mjs
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
const inter = (a, b, c, e) => { const r = sub(b, a), s = sub(e, c), k = cr(r, s); return lerp(a, b, cr(sub(c, a), s) / k) }
const foot = (p, a, b) => { const v = sub(b, a); return lerp(a, b, dot(sub(p, a), v) / dot(v, v)) }
const par = (a, b, c, e) => Math.abs(cr(sub(b, a), sub(e, c))) < 1e-8 * len(sub(b, a)) * len(sub(e, c))
const coll = (a, b, c) => Math.abs(cr(sub(b, a), sub(c, a))) < 1e-8 * Math.max(1, d(a, b) * d(a, c))
const ang = (v, p, q) => Math.acos(dot(sub(p, v), sub(q, v)) / (d(v, p) * d(v, q)))
const between = (a, x, b) => coll(a, x, b) && dot(sub(a, x), sub(b, x)) < 0   // x nằm giữa a, b
const sameSide = (o, p, q) => dot(sub(p, o), sub(q, o)) > 0                    // p, q cùng phía o trên một đường thẳng
const through = (p, dir, q, dir2) => inter(p, add(p, dir), q, add(q, dir2))    // giao hai đường theo véc-tơ chỉ phương

// ───────── 15 ─────────
for (const [w, h] of [[2.5, 3.2], [2, 4.5], [3, 2], [1.7, 5]]) {
  const B = P(0, 0), C = P(2 * w, 0), A = P(w, h)
  const D = P(0, -2 * w * w / h)
  ok(Math.abs(dot(sub(D, B), sub(C, B))) < 1e-9, '15 BD⊥BC')
  ok(Math.abs(dot(sub(D, C), sub(A, C))) < 1e-9, '15 CD⊥AC')
  const E = foot(B, C, D)
  const M = inter(A, D, B, E)
  const N = foot(E, B, D)
  ok(par(B, E, A, C), '15 BE∥AC')
  ok(par(E, N, B, C), '15 EN∥BC')
  eq(d(D, M) / d(D, A), d(D, E) / d(D, C), '15 DM/DA=DE/DC')
  eq(d(D, N) / d(D, B), d(D, E) / d(D, C), '15 DN/DB=DE/DC')
  ok(between(D, E, C) && between(D, M, A) && between(D, N, B), '15 E,M,N nằm trong DC,DA,DB')
  ok(par(M, N, A, B), '15a MN∥AB')
  // ý b
  const F = inter(A, C, B, D)
  eq(d(A, B), d(A, F), '15b AB=AF'); eq(d(A, B), d(A, C), '15b AB=AC')
  ok(between(F, A, C), '15b A nằm giữa F,C')
  eq(ang(B, A, F), ang(F, A, B), '15b ∠ABF=∠AFB')
  eq(ang(B, A, C) + ang(B, A, F), Math.PI / 2, '15b ∠ABC+∠ABF=90°')
  ok(par(M, B, A, F), '15b MB∥AF')
  eq(d(M, E) / d(A, C), d(D, M) / d(D, A), '15b ME/AC=DM/DA')
  eq(d(M, B) / d(A, F), d(D, M) / d(D, A), '15b MB/AF=DM/DA')
  eq(d(M, B), d(M, E), '15b MB=ME'); ok(between(B, M, E), '15b M giữa B,E')
}

// ───────── 16a ─────────
for (const [a, b, c, dd, h] of [[1, 3, -2, 6, 3], [0.5, 4, -3, 5, 2.5], [2, 5, 0, 7, 4]]) {
  const A = P(a, h), B = P(b, h), D = P(c, 0), C = P(dd, 0)
  const O = inter(A, C, B, D)
  const M = inter(O, add(O, P(1, 0)), A, D), N = inter(O, add(O, P(1, 0)), B, C)
  ok(par(O, M, A, B) && par(O, N, D, C), '16a song song')
  eq(d(O, M) / d(C, D), d(A, M) / d(A, D), '16a OM/CD=AM/AD')
  eq(d(O, N) / d(C, D), d(B, O) / d(B, D), '16a ON/CD=BO/BD')
  eq(d(A, M) / d(A, D), d(B, O) / d(B, D), '16a AM/AD=BO/BD')
  eq(d(O, M), d(O, N), '16a OM=ON')
}

// ───────── 16b ─────────
for (const [bx, cx, ax, ay, t] of [[-3, 4, 0.8, 5, 0.45], [-2.5, 3.5, -0.5, 4.2, 0.3], [-4, 2, 1, 6, 0.7]]) {
  const B = P(bx, 0), C = P(cx, 0), A = P(ax, ay), D = P(ax, 0)
  ok(ang(A, B, C) < Math.PI / 2 && ang(B, A, C) < Math.PI / 2 && ang(C, A, B) < Math.PI / 2, '16b nhọn')
  const H = lerp(D, A, t)
  const E = inter(B, H, A, C), F = inter(C, H, A, B)
  ok(between(A, E, C) && between(A, F, B), '16b E∈AC, F∈AB')
  eq(ang(D, A, E), ang(D, A, F), '16b ∠EDA=∠FDA')
  const hor = [H, add(H, P(1, 0))]
  const Mm = inter(...hor, A, B), Nn = inter(...hor, D, F), I = inter(...hor, D, E), K = inter(...hor, A, C)
  eq(d(N0(Nn), H) / d(C, D), d(F, H) / d(F, C), '16b NH/CD=FH/FC')
  eq(d(Mm, H) / d(B, C), d(F, H) / d(F, C), '16b MH/BC=FH/FC')
  eq(d(H, I) / d(B, D), d(E, H) / d(E, B), '16b HI/BD=EH/EB')
  eq(d(H, K) / d(B, C), d(E, H) / d(E, B), '16b HK/BC=EH/EB')
  eq(d(Mm, H) / d(B, D), d(A, H) / d(A, D), '16b MH/BD=AH/AD')
  eq(d(H, K) / d(C, D), d(A, H) / d(A, D), '16b HK/CD=AH/AD')
  eq(d(Nn, H), d(H, I), '16b NH=HI'); ok(between(Nn, H, I), '16b H giữa N,I')
  ok(Math.abs(dot(sub(D, H), sub(I, Nn))) < 1e-9, '16b DH⊥NI')
  eq(d(D, Nn), d(D, I), '16b DN=DI')
}
function N0(x) { return x }

// ───────── 17a (Xê-va) ─────────
const rnd = (a, b) => a + (b - a) * Math.random()
for (let it = 0; it < 6; it++) {
  const A = P(rnd(-1, 1), rnd(4, 6)), B = P(rnd(-5, -2), 0), C = P(rnd(2, 5), 0)
  const M = add(add(mul(A, 0.3), mul(B, 0.3)), mul(C, 0.4)) // trong tam giác
  const Ap = inter(A, M, B, C), Bp = inter(B, M, C, A), Cp = inter(C, M, A, B)
  const prod = (d(A, Cp) / d(B, Cp)) * (d(B, Ap) / d(C, Ap)) * (d(C, Bp) / d(A, Bp))
  eq(prod, 1, '17a tích=1')
  const dir = sub(C, B)
  const Dd = inter(A, add(A, dir), C, Cp), Ee = inter(A, add(A, dir), B, Bp)
  eq(d(M, A) / d(M, Ap), d(A, Ee) / d(B, Ap), '17a MA/MA\'=AE/BA\'')
  eq(d(M, A) / d(M, Ap), d(A, Dd) / d(C, Ap), '17a MA/MA\'=AD/CA\'')
  eq(d(A, Cp) / d(B, Cp), d(A, Dd) / d(B, C), '17a AC\'/BC\'=AD/BC')
  eq(d(C, Bp) / d(A, Bp), d(B, C) / d(A, Ee), '17a CB\'/AB\'=BC/AE')
  // chiều đảo: chọn C', B' tuỳ ý, suy A' từ tích =1 rồi kiểm đồng quy
  const Cq = lerp(A, B, rnd(0.2, 0.8)), Bq = lerp(C, A, rnd(0.2, 0.8))
  const k = (d(A, Cq) / d(B, Cq)) * (d(C, Bq) / d(A, Bq))   // cần BA'/CA' = 1/k
  const r = 1 / k, t = r / (1 + r)                          // BA' = t·BC
  const Aq = lerp(B, C, t)
  const det = (p, q) => cr(sub(q, p), sub(Cq, p))
  const Mq = inter(B, Bq, C, Cq)
  ok(coll(A, Aq, Mq), "17a đảo: AA' đi qua BB' giao CC'")
  // phản ví dụ: đổi A' ⇒ không đồng quy
  const Ax = lerp(B, C, Math.min(0.95, t + 0.1))
  ok(!coll(A, Ax, Mq), '17a tích≠1 ⇒ không đồng quy')
}

// ───────── 17b (Mê-nê-la-uýt) cấu hình C' tia đối AB, B' ∈ cạnh CA, A' ∈ cạnh BC ─────────
for (let it = 0; it < 6; it++) {
  const A = P(rnd(-1, 1), rnd(4, 6)), B = P(rnd(-5, -2), 0), C = P(rnd(2, 5), 0)
  const Cp = lerp(B, A, rnd(1.2, 2.5))            // tia đối AB: ngoài đoạn, phía A
  const Bp = lerp(C, A, rnd(0.25, 0.8))           // trong cạnh CA
  const Ap = inter(Cp, Bp, B, C)
  ok(between(B, Ap, C), '17b A\' nằm trong BC')
  ok(between(B, A, Cp), '17b A nằm giữa B,C\'')
  const prod = (d(A, Cp) / d(B, Cp)) * (d(B, Ap) / d(C, Ap)) * (d(C, Bp) / d(A, Bp))
  eq(prod, 1, '17b tích=1')
  const Mm = inter(A, add(A, sub(C, B)), Cp, Bp)
  eq(d(A, Cp) / d(B, Cp), d(A, Mm) / d(B, Ap), '17b AC\'/BC\'=AM/BA\'')
  eq(d(C, Bp) / d(A, Bp), d(C, Ap) / d(A, Mm), '17b CB\'/AB\'=CA\'/AM')
  // đảo: đổi A' ⇒ tích≠1 ⇒ không thẳng hàng
  const Ax = lerp(B, C, 0.37)
  const p2 = (d(A, Cp) / d(B, Cp)) * (d(B, Ax) / d(C, Ax)) * (d(C, Bp) / d(A, Bp))
  if (Math.abs(p2 - 1) > 1e-3) ok(!coll(Cp, Bp, Ax), '17b tích≠1 ⇒ không thẳng hàng')
  // đảo: B'C' cắt BC tại A1 nằm trong BC
  const A1 = inter(Cp, Bp, B, C); ok(between(B, A1, C), '17b A1 trong BC')
}

// ───────── 18a ─────────
for (const [A, B, C, D] of [[P(0, 4), P(5, 6), P(6.5, 0), P(-1, -1)], [P(-1, 5), P(4, 6), P(5, 0), P(-2, -0.5)], [P(0.5, 3.5), P(6, 5), P(7, 0), P(1, -2)]]) {
  const O = inter(A, C, B, D)
  ok(between(A, O, C) && between(B, O, D), '18a lồi')
  const P1 = inter(A, add(A, sub(C, B)), B, D), Q1 = inter(B, add(B, sub(D, A)), A, C)
  eq(d(O, A) / d(O, C), d(O, P1) / d(O, B), '18a OA/OC=OP/OB')
  eq(d(O, Q1) / d(O, A), d(O, B) / d(O, D), '18a OQ/OA=OB/OD')
  eq(d(O, Q1) / d(O, C), d(O, P1) / d(O, D), '18a OQ/OC=OP/OD')
  ok(sameSide(O, P1, D) && sameSide(O, Q1, C), '18a P∈tia OD, Q∈tia OC')
  ok(par(P1, Q1, C, D), '18a PQ∥CD')
}

// ───────── 18c ─────────
for (let it = 0; it < 6; it++) {
  const A = P(rnd(-1, 1), rnd(4, 6)), B = P(rnd(-5, -2), 0), C = P(rnd(2, 5), 0)
  const M = add(add(mul(A, 0.25), mul(B, 0.35)), mul(C, 0.4))
  const Ap = inter(A, M, B, C), Bp = inter(B, M, C, A), Cp = inter(C, M, A, B)
  const lhs = d(A, M) / d(Ap, M), rhs = d(A, Bp) / d(C, Bp) + d(A, Cp) / d(B, Cp)
  eq(lhs, rhs, '18c kết luận')
  const dir = sub(C, B)
  const Dd = inter(A, add(A, dir), C, Cp), Ee = inter(A, add(A, dir), B, Bp)
  ok(between(Dd, A, Ee), '18c A giữa D,E')
  eq(lhs, d(A, Ee) / d(B, Ap), '18c AM/A\'M=AE/BA\'')
  eq(lhs, d(A, Dd) / d(C, Ap), '18c AM/A\'M=AD/CA\'')
  eq(lhs, d(Dd, Ee) / d(B, C), '18c =DE/BC')
  eq(d(A, Bp) / d(C, Bp), d(A, Ee) / d(B, C), '18c AB\'/CB\'=AE/BC')
  eq(d(A, Cp) / d(B, Cp), d(A, Dd) / d(B, C), '18c AC\'/BC\'=AD/BC')
}

// ───────── 18b, 18d: chỉ kiểm đề đúng (DE_SAU) ─────────
{
  const A = P(0.7, 5), B = P(-3, 0), C = P(4, 0), O = P(0.4, 1.7)
  const Pp = inter(A, O, B, C), Q = inter(B, O, C, A), R = inter(C, O, A, B)
  // đề ghi OA/AP + OB/BQ + OC/CR = 2 với O nằm TRONG; kiểm: OA/AP chính là AO/AP
  const tot = (d(A, O) / d(A, Pp)) + (d(B, O) / d(B, Q)) + (d(C, O) / d(C, R))
  console.log('18b: AO/AP+BO/BQ+CO/CR =', tot.toFixed(6), '(đề: 2?)  | OP/AP+OQ/BQ+OR/CR =', (d(O, Pp) / d(A, Pp) + d(O, Q) / d(B, Q) + d(O, R) / d(C, R)).toFixed(6))
  // 18d1
  const A2 = P(0.5, 5), B2 = P(-3, 0), C2 = P(4, 0), D2 = mid(B2, C2)
  const O2 = lerp(A2, D2, 0.4)
  const M2 = inter(C2, O2, A2, B2), N2 = inter(B2, O2, A2, C2)
  const area = (p, q, r) => Math.abs(cr(sub(q, p), sub(r, p))) / 2
  eq(area(B2, O2, M2), area(C2, O2, N2), '18d1 S_BOM=S_CON')
  ok(par(M2, N2, B2, C2), '18d MN∥BC')
  // 18d2: S_BOM/S_MNO = S_BCO/S_CON  ⇒ với S_MNO=16, S_BCO=36: S_BOM=S_CON=24 ⇒ S_BMNC = 24+24+16 = 64? (không dùng cho kết luận; chỉ in)
  const x = Math.sqrt(16 * 36)
  console.log('18d2: S_BOM = S_CON =', x, ' ⇒ S_BMNC = BOC+BOM+MON+CON =', 36 + x + 16 + x)
}
function mid(a, b) { return lerp(a, b, 0.5) }

console.log(`\nKết quả verify G6: PASS=${PASS}  FAIL=${FAIL}`)
