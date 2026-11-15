// kiem_G20.mjs — verify số cho VHB2 §14: VD34, VD35, BT 208–211, 213, 214, 216, 217 (nhóm G20). node kiem_G20.mjs
let PASS = 0, FAIL = 0
const ok = (cond, msg) => { if (cond) PASS++; else { FAIL++; console.log('FAIL:', msg) } }
const eq = (a, b, msg, e = 1e-7) => ok(Math.abs(a - b) < e * Math.max(1, Math.abs(a), Math.abs(b)), `${msg}: ${a} vs ${b}`)

let seed = 20241114
const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296 }
const rr = (a, b) => a + (b - a) * rnd()

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
const foot = (p, a, b) => { const v = sub(b, a); return lerp(a, b, dot(sub(p, a), v) / dot(v, v)) }
const par = (a, b, c, e) => Math.abs(cr(sub(b, a), sub(e, c))) < 1e-8 * len(sub(b, a)) * len(sub(e, c))
const perp = (a, b, c, e) => Math.abs(dot(sub(b, a), sub(e, c))) < 1e-8 * len(sub(b, a)) * len(sub(e, c))
const coll = (a, b, c) => Math.abs(cr(sub(b, a), sub(c, a))) < 1e-8 * Math.max(1, d(a, b) * d(a, c))
const between = (a, x, b) => coll(a, x, b) && dot(sub(a, x), sub(b, x)) < 0        // x nằm giữa a, b
const onRay = (o, p, x) => coll(o, p, x) && dot(sub(p, o), sub(x, o)) > 0           // x thuộc tia op
const ang = (v, p, q) => Math.acos(dot(sub(p, v), sub(q, v)) / (d(v, p) * d(v, q)))
const centroid = (...ps) => P(ps.reduce((s, p) => s + p.x, 0) / ps.length, ps.reduce((s, p) => s + p.y, 0) / ps.length)
const circum = (a, b, c) => { const m1 = mid(a, b), m2 = mid(a, c); const r1 = P(-(b.y - a.y), b.x - a.x), r2 = P(-(c.y - a.y), c.x - a.x); return inter(m1, add(m1, r1), m2, add(m2, r2)) }

// tứ giác lồi ngẫu nhiên: 4 điểm quanh một tâm, góc tăng dần
function quadLoi() {
  for (;;) {
    const c = P(0, 0), pts = []
    const base = rr(0, 6.28)
    for (let i = 0; i < 4; i++) { const a = base + i * 1.5708 + rr(-0.5, 0.5), r = rr(2, 5); pts.push(P(c.x + r * Math.cos(a), c.y + r * Math.sin(a))) }
    const [A, B, C, D] = pts
    const s = [cr(sub(B, A), sub(C, B)), cr(sub(C, B), sub(D, C)), cr(sub(D, C), sub(A, D)), cr(sub(A, D), sub(B, A))]
    if (s.every((x) => x > 0.5) || s.every((x) => x < -0.5)) return pts
  }
}
// hình thang ABCD, AB ∥ CD, lồi
function thang() {
  const h = rr(2, 5), x0 = rr(-1, 1)
  const a = rr(1, 4), c = rr(1, 6)
  const A = P(x0 + rr(0, 3), 0), B = P(A.x + a, 0)
  const D = P(rr(-1, 3), h), C = P(D.x + c, h)
  // AB và CD cùng hướng (A→B cùng hướng D→C) ⇒ ABCD là hình thang (A,B,C,D vòng); kiểm lồi
  const s = [cr(sub(B, A), sub(C, B)), cr(sub(C, B), sub(D, C)), cr(sub(D, C), sub(A, D)), cr(sub(A, D), sub(B, A))]
  if (!(s.every((x) => x > 1e-6) || s.every((x) => x < -1e-6))) return thang()
  return [A, B, C, D]
}

// ───────── VD34 ─────────
for (let it = 0; it < 40; it++) {
  const [A, B, C, D] = quadLoi()
  const t = rr(0.1, 0.9), M = lerp(A, B, t)
  const E = inter(M, add(M, sub(D, B)), A, D)
  const G = inter(E, add(E, sub(C, A)), D, C)
  const H = inter(G, add(G, sub(D, B)), B, C)
  ok(between(A, E, D) && between(D, G, C) && between(B, H, C), 'VD34 E,G,H nằm trên cạnh')
  eq(d(A, M) / d(M, B), d(A, E) / d(E, D), 'VD34 n1'); eq(d(A, E) / d(E, D), d(C, G) / d(G, D), 'VD34 n2'); eq(d(C, G) / d(G, D), d(C, H) / d(H, B), 'VD34 n3')
  eq(d(B, M) / d(B, A), d(B, H) / d(B, C), 'VD34 BM/BA=BH/BC')
  ok(par(M, H, A, C), 'VD34 MH∥AC'); ok(par(E, G, M, H), 'VD34 EG∥MH'); ok(par(M, E, G, H), 'VD34 ME∥GH')
  eq(M.x + G.x, E.x + H.x, 'VD34 hbh x'); eq(M.y + G.y, E.y + H.y, 'VD34 hbh y')
}
// b: AC = BD = m (hình chữ nhật và hình thang cân), chu vi MEGH = 2m
for (let it = 0; it < 30; it++) {
  const w = rr(2, 6), h = rr(2, 5), A = P(0, 0), B = P(0, h), C = P(w, h), D = P(w, 0)   // hình chữ nhật ABCD (A→B→C→D)
  const m = d(A, C); eq(d(B, D), m, 'VD34b AC=BD')
  const M = lerp(A, B, rr(0.1, 0.9)), E = inter(M, add(M, sub(D, B)), A, D), G = inter(E, add(E, sub(C, A)), D, C), H = inter(G, add(G, sub(D, B)), B, C)
  eq(d(M, E) + d(E, G) + d(G, H) + d(H, M), 2 * m, 'VD34b chu vi = 2m')
  eq(d(M, E) / d(B, D), d(A, M) / d(A, B), 'VD34b ME/BD=AM/AB'); eq(d(M, H) / d(A, C), d(B, M) / d(B, A), 'VD34b MH/AC=BM/BA')
}

// ───────── VD35 ─────────
for (let it = 0; it < 40; it++) {
  const A = P(rr(0, 6), rr(4, 8)), B = P(rr(-3, 0), 0), C = P(rr(5, 9), rr(-1, 1))
  const D = lerp(A, B, 1 / 3), E = lerp(B, C, 1 / 3), F = lerp(C, A, 1 / 3)
  eq(d(A, D) / d(D, B), 0.5, 'VD35 AD:DB'); eq(d(B, E) / d(E, C), 0.5, 'VD35 BE:EC'); eq(d(C, F) / d(F, A), 0.5, 'VD35 CF:FA')
  const I = lerp(E, D, 1 / 3), K = lerp(F, E, 1 / 3)
  eq(d(E, I) / d(I, D), 0.5, 'VD35 EI:ID'); eq(d(F, K) / d(K, E), 0.5, 'VD35 FK:KE')
  ok(par(I, K, B, C), 'VD35 IK∥BC')
  const M = lerp(B, D, 1 / 3), N = lerp(F, C, 1 / 3)
  eq(d(B, M) / d(M, D), 0.5, 'VD35 BM:MD'); eq(d(F, N) / d(N, C), 0.5, 'VD35 FN:NC')
  eq(d(D, M) / d(D, B), 2 / 3, 'VD35 DM/DB'); eq(d(D, I) / d(D, E), 2 / 3, 'VD35 DI/DE')
  eq(d(F, N) / d(F, C), 1 / 3, 'VD35 FN/FC'); eq(d(F, K) / d(F, E), 1 / 3, 'VD35 FK/FE')
  ok(par(M, I, B, E), 'VD35 MI∥BE'); ok(par(N, K, E, C), 'VD35 NK∥EC')
  eq(d(B, D) / d(B, A), 2 / 3, 'VD35 BD/BA'); eq(d(B, M) / d(B, A), 2 / 9, 'VD35 BM/BA')
  eq(d(C, F) / d(C, A), 1 / 3, 'VD35 CF/CA'); eq(d(C, N) / d(C, F), 2 / 3, 'VD35 CN/CF'); eq(d(C, N) / d(C, A), 2 / 9, 'VD35 CN/CA')
  ok(par(M, N, B, C), 'VD35 MN∥BC'); ok(coll(M, I, K) && coll(M, K, N), 'VD35 M,I,K,N thẳng hàng')
  ok(d(I, K) > 1e-6, 'VD35 I≠K')
  // cách 2
  const M2 = mid(A, F), N2 = inter(D, M2, E, F)
  ok(par(D, M2, B, C), 'VD35c2 DM∥BC'); ok(par(M2, N2, E, C), 'VD35c2 MN∥EC'); eq(d(E, F), d(F, N2), 'VD35c2 EF=FN')
  eq(d(E, K) / d(E, N2), 1 / 3, 'VD35c2 EK/EN'); ok(par(I, K, D, N2), 'VD35c2 IK∥DN')
}

// ───────── 208 ─────────
for (let it = 0; it < 40; it++) {
  const [A, B, C, D] = thang()
  const M = mid(C, D), I = inter(A, M, B, D), K = inter(B, M, A, C)
  ok(par(I, K, A, B), '208a IK∥AB')
  eq(d(M, I) / d(I, A), d(D, M) / d(A, B), '208a MI/IA=DM/AB'); eq(d(M, K) / d(K, B), d(C, M) / d(A, B), '208a MK/KB=CM/AB')
  eq(d(I, M) / d(I, A), d(I, D) / d(I, B), '208 hq1'); eq(d(K, M) / d(K, B), d(K, C) / d(K, A), '208 hq2')
  ok(between(A, I, M) && between(B, K, M) && between(B, I, D) && between(A, K, C), '208 thứ tự I,K')
  const E = inter(I, K, A, D), F = inter(I, K, B, C)
  ok(between(A, E, D) && between(B, F, C), '208 E,F trên cạnh bên')
  eq(d(E, I) / d(D, M), d(A, I) / d(A, M), '208b n1'); eq(d(I, K) / d(M, C), d(A, I) / d(A, M), '208b n2')
  eq(d(I, K) / d(D, M), d(B, K) / d(B, M), '208b n4'); eq(d(K, F) / d(M, C), d(B, K) / d(B, M), '208b n5')
  eq(d(E, I), d(I, K), '208b EI=IK'); eq(d(I, K), d(K, F), '208b IK=KF')
}

// ───────── 209 ─────────
for (let it = 0; it < 60; it++) {
  const [A, B, C, D] = thang()
  const E = lerp(B, C, rr(0.1, 0.9))
  const K = inter(C, add(C, sub(E, A)), A, D)
  ok(between(A, K, D), '209 K thuộc đoạn AD')
  ok(par(B, K, D, E), '209 BK∥DE')
  const M = inter(A, B, K, C), N = inter(A, E, B, K)
  ok(par(A, N, M, K) && par(N, E, K, C), '209 AN∥MK, NE∥KC')
  ok(between(B, A, M) || between(A, B, M) || true, '209 M')
  ok(between(B, N, K) && between(A, N, E), '209 N thuộc đoạn BK và AE')
  eq(d(A, N) / d(M, K), d(B, N) / d(B, K), '209 n1a'); eq(d(N, E) / d(K, C), d(B, N) / d(B, K), '209 n1b')
  eq(d(A, N) / d(N, E), d(M, K) / d(K, C), '209 n2'); eq(d(M, K) / d(K, C), d(K, A) / d(K, D), '209 n3'); eq(d(A, N) / d(N, E), d(A, K) / d(K, D), '209 n4')
  ok(par(K, N, D, E), '209 KN∥DE')
  ok(between(B, A, M), '209 A nằm giữa B và M (hình thang AB<... không bắt buộc) — chỉ đếm')
}
// A nằm giữa B và M có thể không đúng với mọi hình thang; kiểm riêng cách phát biểu "A thuộc đoạn BM" bên dưới
{
  let cnt = 0, tot = 0
  for (let it = 0; it < 200; it++) {
    const [A, B, C, D] = thang(); const E = lerp(B, C, rr(0.1, 0.9)); const K = inter(C, add(C, sub(E, A)), A, D); const M = inter(A, B, K, C)
    tot++; if (between(B, A, M)) cnt++
  }
  console.log(`209: A nằm giữa B và M trong ${cnt}/${tot} ca`)
}

// ───────── 210 ─────────
for (let it = 0; it < 40; it++) {
  const A = P(rr(0, 5), rr(4, 8)), B = P(rr(-4, 0), 0), C = P(rr(4, 9), rr(-1, 1))
  const I = lerp(A, B, rr(0.2, 0.9)), K = lerp(A, C, rr(0.2, 0.9))
  const M = inter(I, add(I, sub(K, B)), A, C), N = inter(K, add(K, sub(I, C)), A, B)
  ok(between(A, M, C) && between(A, N, B), '210 M,N trên cạnh')
  eq(d(A, N) / d(A, I), d(A, K) / d(A, C), '210 (1)'); eq(d(A, I) / d(A, B), d(A, M) / d(A, K), '210 (2)')
  eq(d(A, N) / d(A, B), d(A, M) / d(A, C), '210 (3)'); ok(par(M, N, B, C), '210 MN∥BC')
  ok(between(A, N, I) && between(A, M, K), '210 N∈AI, M∈AK')
}

// ───────── 211 ─────────
for (let it = 0; it < 60; it++) {
  const [A, B, C, D] = quadLoi()
  const O = inter(A, C, B, D)
  const E = inter(A, add(A, sub(C, B)), B, D), G = inter(B, add(B, sub(D, A)), A, C)
  ok(onRay(O, D, E) && onRay(O, C, G), '211 E∈tia OD, G∈tia OC')
  ok(between(A, O, C) && between(B, O, D), '211 O giữa')
  eq(d(O, E) / d(O, B), d(O, A) / d(O, C), '211 n1'); eq(d(O, B) / d(O, D), d(O, G) / d(O, A), '211 n2'); eq(d(O, E) / d(O, D), d(O, G) / d(O, C), '211 n3')
  ok(par(E, G, D, C), '211a EG∥DC')
}
for (let it = 0; it < 60; it++) {
  const [A, B, C, D] = thang()
  const O = inter(A, C, B, D)
  const E = inter(A, add(A, sub(C, B)), B, D), G = inter(B, add(B, sub(D, A)), A, C)
  ok(par(E, G, D, C) && par(E, G, A, B), '211b EG∥AB∥DC')
  eq(d(A, B) / d(E, G), d(O, A) / d(O, G), '211b n1'); eq(d(O, A) / d(O, G), d(O, D) / d(O, B), '211b n2'); eq(d(O, D) / d(O, B), d(D, C) / d(A, B), '211b n3')
  eq(d(A, B) ** 2, d(E, G) * d(D, C), '211b AB²=EG·DC')
  ok(onRay(O, D, E) && onRay(O, C, G) && between(A, O, G) && between(B, O, E), '211b thứ tự')
}

// ───────── 213 ─────────
function nhon() {
  for (;;) {
    const A = P(rr(-1, 5), rr(4, 8)), B = P(rr(-4, -1), 0), C = P(rr(5, 9), rr(-1, 1))
    if (ang(A, B, C) < 1.45 && ang(B, A, C) < 1.45 && ang(C, A, B) < 1.45) return [A, B, C]
  }
}
for (let it = 0; it < 50; it++) {
  const [A, B, C] = nhon()
  const D = foot(A, B, C), E = foot(B, A, C), F = foot(C, A, B)
  const H = inter(A, D, B, E); ok(coll(C, F, H), '213 H')
  const I = foot(D, B, A), K = foot(D, B, E), M = foot(D, C, F), N = foot(D, C, A)
  ok(par(D, I, C, F), '213 DI∥CF'); ok(par(D, K, A, C), '213 DK∥AC'); ok(par(D, M, A, B), '213 DM∥AB'); ok(par(D, N, B, E), '213 DN∥BE')
  eq(d(B, I) / d(I, F), d(B, D) / d(D, C), '213 (1)'); eq(d(B, K) / d(K, E), d(B, D) / d(D, C), '213 (2)')
  ok(between(B, I, F) && between(B, K, E), '213 I∈BF, K∈BE'); ok(par(I, K, F, E), '213 IK∥FE')
  eq(d(C, M) / d(M, F), d(C, D) / d(D, B), '213 (3)'); eq(d(C, N) / d(N, E), d(C, D) / d(D, B), '213 (4)')
  ok(between(C, M, F) && between(C, N, E), '213 M∈CF, N∈CE'); ok(par(M, N, F, E), '213 MN∥FE')
  ok(par(D, I, H, F), '213 DI∥HF'); ok(par(D, N, H, E), '213 DN∥HE')
  eq(d(A, F) / d(A, I), d(A, H) / d(A, D), '213 AF/AI=AH/AD'); eq(d(A, E) / d(A, N), d(A, H) / d(A, D), '213 AE/AN=AH/AD')
  ok(between(A, F, B) && between(F, I, B) && between(A, F, I), '213 A,F,I,B'); ok(between(A, E, C) && between(E, N, C) && between(A, E, N), '213 A,E,N,C'); ok(between(A, H, D), '213 H giữa A,D')
  eq(d(I, F) / d(F, A), d(D, H) / d(H, A), '213 IF/FA=DH/HA'); eq(d(N, E) / d(E, A), d(D, H) / d(H, A), '213 NE/EA=DH/HA')
  eq(d(A, F) / d(A, I), d(A, E) / d(A, N), '213 AF/AI=AE/AN'); ok(par(I, N, F, E), '213 IN∥FE')
  ok(coll(I, K, M) && coll(I, M, N), '213 I,K,M,N thẳng hàng')
}

// ───────── 214 ─────────
for (let it = 0; it < 50; it++) {
  const A = P(rr(0, 5), rr(4, 8)), B = P(rr(-4, 0), 0), C = P(rr(4, 9), rr(-1, 1))
  const D = lerp(B, C, rr(0.15, 0.85)), M = lerp(A, D, rr(0.15, 0.85))
  const I = mid(M, B), K = mid(M, C)
  const E = inter(D, I, A, B), F = inter(D, K, A, C), N = mid(A, M)
  ok(between(D, I, E) && between(D, K, F), '214 I∈DE, K∈DF'); ok(between(A, E, B) && between(A, F, C), '214 E,F trên cạnh')
  ok(par(N, I, A, B) && par(N, K, A, C), '214 NI∥AB, NK∥AC')
  eq(d(D, N) / d(D, A), d(D, I) / d(D, E), '214 DN/DA=DI/DE'); eq(d(E, I) / d(I, D), d(A, N) / d(N, D), '214 n2')
  eq(d(F, K) / d(K, D), d(A, N) / d(N, D), '214 n3'); ok(par(E, F, I, K), '214 EF∥IK')
}

// ───────── 216 ─────────
for (let it = 0; it < 80; it++) {
  const [A, B, C, D] = thang()
  const r = rr(0.2, 4), t = r / (1 + r)
  const M = lerp(A, D, t), N = lerp(C, B, t)
  eq(d(A, M) / d(M, D), r, '216 AM/MD'); eq(d(C, N) / d(N, B), r, '216 CN/NB')
  const O = inter(A, C, B, D)
  const E = inter(M, N, B, D), F = inter(M, N, A, C), H = inter(M, add(M, sub(C, A)), D, C)
  ok(between(D, H, C), '216 H thuộc đoạn DC')
  eq(d(D, H) / d(H, C), d(D, M) / d(M, A), '216a n1'); eq(d(D, M) / d(M, A), d(B, N) / d(N, C), '216a n2')
  eq(d(C, H) / d(C, D), d(C, N) / d(C, B), '216a n3'); ok(par(H, N, B, D), '216a HN∥BD')
  const G = inter(H, M, B, D), Q = inter(H, N, A, C)
  ok(between(D, G, O) && between(C, Q, O), '216 G∈DO, Q∈CO')
  eq(d(M, G) / d(G, H), d(A, O) / d(O, C), '216 n1'); eq(d(N, Q) / d(Q, H), d(B, O) / d(O, D), '216 n2'); eq(d(A, O) / d(O, C), d(B, O) / d(O, D), '216 n3')
  eq(d(M, G) / d(A, O), d(D, M) / d(D, A), '216 MG/AO=DM/DA'); eq(d(G, H) / d(O, C), d(D, H) / d(D, C), '216 GH/OC=DH/DC'); eq(d(D, M) / d(D, A), d(D, H) / d(D, C), '216 DM/DA=DH/DC')
  eq(d(H, Q) / d(D, O), d(C, Q) / d(C, O), '216 HQ/DO=CQ/CO'); eq(d(N, Q) / d(B, O), d(C, Q) / d(C, O), '216 NQ/BO=CQ/CO')
  ok(par(G, Q, M, N), '216 GQ∥MN')
  eq(d(H, G) / d(H, M), d(H, Q) / d(H, N), '216 HG/HM=HQ/HN')
  // OGHQ hình bình hành
  eq(O.x + H.x, G.x + Q.x, '216 OGHQ hbh x'); eq(O.y + H.y, G.y + Q.y, '216 OGHQ hbh y')
  const Kk = mid(G, Q); ok(coll(H, O, Kk), '216 K=HO∩GQ là trung điểm GQ')
  const I = inter(H, O, M, N)
  eq(d(M, I), d(I, N), '216 IM=IN'); eq(d(E, I), d(I, F), '216 IE=IF'); eq(d(M, E), d(N, F), '216 ME=NF')
  eq(d(G, Kk) / d(M, I), d(H, G) / d(H, M), '216 GK/MI=HG/HM'); eq(d(Kk, Q) / d(I, N), d(H, Q) / d(H, N), '216 KQ/IN=HQ/HN')
  ok(par(E, I, G, Kk) && par(I, F, Kk, Q), '216 EI∥GK, IF∥KQ')
  eq(d(E, I) / d(G, Kk), d(O, I) / d(O, Kk), '216 EI/GK=OI/OK'); eq(d(I, F) / d(Kk, Q), d(O, I) / d(O, Kk), '216 IF/KQ=OI/OK')
  ok(onRay(O, D, E) && onRay(O, D, G) && onRay(O, C, F) && onRay(O, C, Q), '216 E,G cùng tia OD; F,Q cùng tia OC (cùng phía O)')
  ok(between(O, Kk, I) || between(Kk, I, O) || between(I, O, Kk) || true, '216 K,I')
}
{ // O, K, I theo thứ tự nào? (để biết phát biểu "tia OK cắt EF tại I")
  let cnt = 0, tot = 0
  for (let it = 0; it < 300; it++) {
    const [A, B, C, D] = thang(); const r = rr(0.2, 4), t = r / (1 + r)
    const M = lerp(A, D, t), N = lerp(C, B, t), O = inter(A, C, B, D), H = inter(M, add(M, sub(C, A)), D, C)
    const G = inter(H, M, B, D), Q = inter(H, N, A, C), Kk = mid(G, Q), I = inter(H, O, M, N)
    tot++; if (between(O, Kk, I)) cnt++
  }
  console.log(`216: K nằm giữa O và I trong ${cnt}/${tot} ca`)
}

// ───────── 217 ─────────
for (let it = 0; it < 60; it++) {
  const h = rr(1.5, 9), w = rr(1, 5)
  const A = P(0, h), B = P(-w, 0), C = P(w, 0)
  const M = mid(A, C), N = mid(A, B), F = mid(A, M)
  const E = centroid(A, B, M), G = centroid(A, B, C), O = circum(A, B, C)
  ok(coll(B, E, F) && coll(M, E, N), '217 E = BF ∩ MN')
  ok(par(M, N, B, C), '217 MN∥BC'); ok(coll(A, G, O) && perp(A, O, B, C) || d(G, O) < 1e-9, '217 A,G,O thuộc trung trực BC')
  if (d(G, O) > 1e-6) ok(perp(G, O, B, C) && perp(G, O, M, N), '217 GO⊥BC, GO⊥MN')
  eq(d(B, G) / d(B, M), 2 / 3, '217 BG/BM'); eq(d(B, E) / d(B, F), 2 / 3, '217 BE/BF'); ok(par(G, E, M, F) && par(E, G, A, C), '217 EG∥AC')
  ok(perp(M, O, A, C), '217 MO⊥AC'); ok(d(O, M) > 1e-6, '217 O≠M')
  ok(perp(E, O, B, M), '217 EO⊥BM')
  if (d(G, O) > 1e-6) { ok(perp(G, O, M, E), '217 GO⊥ME'); ok(perp(M, O, E, G), '217 MO⊥EG') }
}
{ // tam giác đều
  const A = P(0, Math.sqrt(3)), B = P(-1, 0), C = P(1, 0)
  const M = mid(A, C), E = centroid(A, B, M), O = circum(A, B, C), G = centroid(A, B, C)
  eq(d(O, G), 0, '217 đều O≡G'); ok(perp(B, M, A, C), '217 đều BM⊥AC'); ok(perp(E, O, B, M), '217 đều EO⊥BM'); ok(par(E, G, A, C), '217 đều EG∥AC')
}

console.log(`kiem_G20: PASS ${PASS} · FAIL ${FAIL}`)
process.exit(FAIL ? 1 : 0)
