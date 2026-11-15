// kiem_G12.mjs — verify số cho TCHH-3.II.10 … 18 (nhóm G12, lô 2). node kiem_G12.mjs
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
const mid = (a, b) => lerp(a, b, 0.5)
const inter = (a, b, c, e) => { const r = sub(b, a), s = sub(e, c), k = cr(r, s); return lerp(a, b, cr(sub(c, a), s) / k) }
const foot = (p, a, b) => { const v = sub(b, a); return lerp(a, b, dot(sub(p, a), v) / dot(v, v)) }
const par = (a, b, c, e) => Math.abs(cr(sub(b, a), sub(e, c))) < 1e-8 * len(sub(b, a)) * len(sub(e, c))
const coll = (a, b, c) => Math.abs(cr(sub(b, a), sub(c, a))) < 1e-8 * Math.max(1, d(a, b) * d(a, c))
const ang = (v, p, q) => Math.acos(Math.max(-1, Math.min(1, dot(sub(p, v), sub(q, v)) / (d(v, p) * d(v, q)))))
const between = (a, x, b) => coll(a, x, b) && dot(sub(a, x), sub(b, x)) < 0
const sameSide = (o, p, q) => dot(sub(p, o), sub(q, o)) > 0
// đường qua p song song với a→b, cắt đường thẳng c→e
const parInter = (p, a, b, c, e) => inter(p, add(p, sub(b, a)), c, e)

let seed = 12345
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff }
const rr = (a, b) => a + (b - a) * rnd()
const tamGiac = () => { const B = P(0, 0), C = P(rr(4, 9), 0), A = P(rr(-2, 8), rr(3, 8)); return [A, B, C] }
// chân phân giác từ đỉnh v xuống cạnh pq : chia theo tỉ số vp : vq
const chanPG = (v, p, q) => lerp(p, q, d(v, p) / (d(v, p) + d(v, q)))

// ───────── Bài 10 ─────────
for (let it = 0; it < 6; it++) {
  const [A, B, C] = tamGiac(); const M = mid(B, C)
  const D = chanPG(M, A, B), E = chanPG(M, A, C)
  eq(ang(M, A, D), ang(M, D, B), '10 MD phân giác'); eq(ang(M, A, E), ang(M, E, C), '10 ME phân giác')
  eq(d(D, A) / d(D, B), d(M, A) / d(M, B), '10 DA/DB=MA/MB')
  eq(d(E, A) / d(E, C), d(M, A) / d(M, C), '10 EA/EC=MA/MC')
  eq(d(M, B), d(M, C), '10 MB=MC')
  eq(d(D, A) / d(D, B), d(E, A) / d(E, C), '10 DA/DB=EA/EC')
  eq(d(A, D) / d(A, B), d(A, E) / d(A, C), '10 AD/AB=AE/AC')
  ok(par(D, E, B, C), '10 DE∥BC')
}

// ───────── Bài 11 ─────────
{
  let m = 0
  while (m < 10) {
    const [A, B, C] = tamGiac(); if (!(d(A, B) < d(A, C) - 0.3)) continue; m++
    const D = chanPG(B, A, C), E = chanPG(C, A, B)
    eq(ang(B, A, D), ang(B, D, C), "11 BD phân giác"); eq(ang(C, A, E), ang(C, E, B), "11 CE phân giác")
    eq(d(A, D) / d(D, C), d(A, B) / d(B, C), "11 AD/DC=AB/BC"); eq(d(A, E) / d(E, B), d(C, A) / d(C, B), "11 AE/EB=AC/BC")
    const K = parInter(D, B, C, A, B)
    ok(par(D, K, B, C), "11 DK∥BC"); ok(between(A, K, B), "11 K nằm giữa A,B")
    eq(d(A, K) / d(K, B), d(A, D) / d(D, C), "11 AK/KB=AD/DC")
    ok(d(A, K) / d(K, B) < d(A, E) / d(E, B), "11 AK/KB<AE/EB")
    ok(d(K, B) > d(E, B), "11 KB>EB"); ok(between(B, E, K), "11a E giữa B,K")
    const gCBD = ang(B, C, D), gKDB = ang(D, K, B), gEDB = ang(D, E, B), gECB = ang(C, E, B)
    const gDEC = ang(E, D, C), gDCE = ang(C, D, E), gEBD = ang(B, E, D), gKBD = ang(B, K, D)
    eq(gCBD, gKDB, "11b CBD=KDB (so le)"); eq(gKBD, gKDB, "11b KBD=KDB"); eq(d(K, B), d(K, D), "11b KB=KD"); eq(gEBD, gKBD, "11b EBD=KBD")
    ok(gKDB > gEDB, "11b KDB>EDB"); ok(gEBD > gEDB, "11b EBD>EDB"); ok(d(E, D) > d(E, B), "11b DE>BE")
    const I = inter(B, D, C, E); ok(between(B, I, D) && between(C, I, E), "11b I giữa BD, CE")
    eq(gCBD + gECB, gEDB + gDEC, "11b CBD+ECB=EDB+DEC"); ok(gDEC > gDCE, "11b DEC>DCE"); eq(gDCE, gECB, "11b DCE=ECB")
    ok(d(C, D) > d(D, E) && d(D, E) > d(B, E), "11b CD>DE>BE")
  }
}

// ───────── Bài 12 ─────────
for (let it = 0; it < 8; it++) {
  const [A, B, C] = tamGiac()
  const a = d(B, C), b = d(C, A), c = d(A, B)
  const D = chanPG(A, B, C), E = chanPG(B, C, A), F = chanPG(C, A, B)
  eq(d(D, B) / d(D, C), c / b, '12a DB/DC=AB/AC'); eq(d(E, C) / d(E, A), a / c, '12a EC/EA=BC/BA'); eq(d(F, A) / d(F, B), b / a, '12a FA/FB=CA/CB')
  eq(d(D, B) / d(D, C) * d(E, C) / d(E, A) * d(F, A) / d(F, B), 1, '12a tích=1')
  // ý b
  const H = parInter(C, A, D, A, B)   // qua C ∥ AD cắt đường AB
  ok(between(B, A, H), '12b A giữa B,H')
  eq(ang(C, A, H), ang(A, C, D), '12b ∠ACH=∠CAD (so le)'); eq(ang(H, A, C), ang(A, B, D), '12b ∠AHC=∠BAD (đồng vị)')
  eq(d(A, H), b, '12b AH=AC')
  eq(d(A, D) / d(C, H), d(B, A) / d(B, H), '12b AD/CH=BA/BH')
  eq(d(B, H), b + c, '12b BH=b+c')
  eq(d(A, D), c * d(C, H) / (b + c), '12b AD=c·CH/(b+c)')
  ok(d(C, H) < 2 * b, '12b CH<2b'); ok(d(A, D) < 2 * b * c / (b + c), '12b da<2bc/(b+c)')
  ok(1 / d(A, D) > 0.5 * (1 / b + 1 / c), '12b 1/da>½(1/b+1/c)')
  ok(1 / d(B, E) > 0.5 * (1 / a + 1 / c) && 1 / d(C, F) > 0.5 * (1 / a + 1 / b), '12b tương tự')
  ok(1 / d(A, D) + 1 / d(B, E) + 1 / d(C, F) > 1 / a + 1 / b + 1 / c, '12b tổng')
}

// ───────── Bài 13 ─────────
let n13 = 0
while (n13 < 8) {
  const A = P(rr(0, 2), rr(5, 8)), B = P(rr(6, 9), rr(6, 9)), C = P(rr(8, 11), 0), D = P(0, 0)
  const O = inter(A, C, B, D)
  if (!(between(A, O, C) && between(B, O, D))) continue; n13++
  const E = parInter(A, B, C, B, D), G = parInter(B, A, D, A, C)
  ok(par(A, E, B, C), '13 AE∥BC'); ok(par(B, G, A, D), '13 BG∥AD')
  eq(d(O, E) / d(O, B), d(O, A) / d(O, C), '13a OE/OB=OA/OC'); eq(d(O, B) / d(O, D), d(O, G) / d(O, A), '13a OB/OD=OG/OA')
  ok(sameSide(O, E, D) && sameSide(O, G, C), '13a E∈tia OD, G∈tia OC')
  eq(d(O, E) / d(O, D), d(O, G) / d(O, C), '13a OE/OD=OG/OC'); ok(par(E, G, C, D), '13a EG∥CD')
}
let n13b = 0
while (n13b < 8) {
  const D = P(0, 0), C = P(rr(7, 11), 0), A = P(rr(0, 3), rr(4, 7)), B = P(A.x + rr(3, 9), A.y)   // AB ∥ CD
  const O = inter(A, C, B, D); if (!(between(A, O, C) && between(B, O, D))) continue; n13b++
  const E = parInter(A, B, C, B, D), G = parInter(B, A, D, A, C)
  ok(par(E, G, A, B) && par(E, G, C, D), '13b EG∥AB∥CD')
  eq(d(A, B) / d(E, G), d(O, A) / d(O, G), '13b AB/EG=OA/OG'); eq(d(O, A) / d(O, G), d(O, D) / d(O, B), '13b OA/OG=OD/OB')
  eq(d(O, D) / d(O, B), d(C, D) / d(A, B), '13b OD/OB=CD/AB'); eq(d(A, B) / d(E, G), d(C, D) / d(A, B), '13b AB/EG=CD/AB')
  eq(d(A, B) ** 2, d(C, D) * d(E, G), '13b AB²=CD·EG')
}

// ───────── Bài 14 (hình thang) ─────────
let n14 = 0, daThu = { truoc: 0, sau: 0 }
while (n14 < 10) {
  const A = P(0, 0), B = P(rr(8, 11), 0), tcd = rr(0.35, 0.9) * d(A, B), D = P(rr(0.5, 3), rr(3, 5)), C = P(D.x + tcd, D.y)
  if (!(d(C, D) < d(A, B))) continue
  n14++
  const K = parInter(D, B, C, A, B), F = parInter(C, A, D, A, B), Pp = parInter(F, A, C, B, C)
  const M = inter(D, K, A, C)
  ok(par(D, K, B, C), '14 DK∥BC'); ok(par(C, F, A, D), '14 CF∥AD'); ok(par(F, Pp, A, C), '14 FP∥AC')
  eq(d(A, F), d(D, C), '14 AF=DC'); eq(d(K, B), d(D, C), '14 KB=DC'); eq(d(A, K), d(F, B), '14 AK=FB')
  ok(between(A, K, B) && between(A, F, B), '14 K,F thuộc đoạn AB')
  if (d(A, K) < d(A, F)) daThu.truoc++; else daThu.sau++
  eq(d(C, M) / d(A, M), d(D, C) / d(A, K), '14a CM/AM=DC/AK')
  eq(d(C, Pp) / d(Pp, B), d(A, F) / d(F, B), '14a CP/PB=AF/FB')
  eq(d(C, M) / d(A, M), d(C, Pp) / d(Pp, B), '14a CM/AM=CP/PB')
  ok(between(C, Pp, B) && between(A, M, C), '14a P∈đoạn BC, M∈đoạn AC'); ok(par(M, Pp, A, B), '14a MP∥AB')
  const I = inter(B, D, C, F)
  eq(d(D, I) / d(I, B), d(D, C) / d(F, B), '14b DI/IB=DC/FB')
  eq(d(C, Pp) / d(Pp, B), d(D, I) / d(I, B), '14b CP/PB=DI/IB'); ok(par(I, Pp, D, C), '14b IP∥DC')
  ok(coll(M, I, Pp), '14b M,I,P thẳng hàng')
}
ok(daThu.truoc > 0 && daThu.sau > 0, '14 đã thử cả hai thứ tự K,F: ' + JSON.stringify(daThu))

// ───────── Bài 14bis ─────────
let n14b = 0
while (n14b < 10) {
  const [A, B, C] = tamGiac(); const a = d(B, C), c = d(B, A), b = d(A, C)
  if (!(a < c - 0.4)) continue; n14b++
  const E = chanPG(B, A, C), Dm = mid(A, C)
  const dirBE = sub(E, B), F = foot(C, B, E)
  const K = inter(C, F, A, B), G = inter(C, F, B, Dm)
  ok(Math.abs(dot(sub(C, F), dirBE)) < 1e-8, '14bis CF⊥BE')
  eq(d(B, K), a, '14bis BK=BC'); eq(d(F, C), d(F, K), '14bis FC=FK'); ok(between(A, K, B), '14bis K∈đoạn AB')
  ok(par(Dm, F, A, K), '14bis DF∥AK'); eq(d(Dm, F), d(A, K) / 2, '14bis DF=AK/2'); eq(d(A, K), c - a, '14bis AK=c−a')
  const M = inter(Dm, F, B, C); ok(par(M, Dm, A, B) && coll(M, Dm, F), '14bis (nháp) DM∥AB')
  ok(between(B, G, Dm), '14bis G∈đoạn BD')
  eq(d(B, G) / d(G, Dm), d(B, K) / d(Dm, F), '14bis BG/GD=BK/DF'); eq(d(B, G) / d(G, Dm), 2 * a / (c - a), '14bis BG/GD=2a/(c−a)')
  eq(d(A, E) / d(E, C), c / a, '14bis AE/EC=c/a'); ok(d(A, E) > d(A, Dm), '14bis AE>AD'); ok(between(Dm, E, C), '14bis E∈đoạn DC')
  eq(d(Dm, E), b * (c - a) / (2 * (a + c)), '14bis DE=b(c−a)/(2(a+c))'); eq(d(E, C), b * a / (a + c), '14bis EC=ba/(a+c)')
  eq(d(C, E) / d(E, Dm), 2 * a / (c - a), '14bis CE/DE=2a/(c−a)')
  eq(d(B, G) / d(G, Dm), d(C, E) / d(E, Dm), '14bis BG/GD=CE/DE')
  eq(d(Dm, G) / d(Dm, B), d(Dm, E) / d(Dm, C), '14bis DG/DB=DE/DC'); ok(par(E, G, B, C), '14bis EG∥BC')
}

// ───────── Bài 15 ─────────
for (let it = 0; it < 8; it++) {
  const A = P(0, 0), B = P(rr(2, 6), 0), C = P(0, rr(2, 6))   // vuông tại A (AB ngang, AC đứng)
  const a = d(B, C), b = d(A, C), c = d(A, B), H = foot(A, B, C)
  const E = foot(H, A, C), F = foot(H, A, B)
  eq(d(C, H), b * b / a, '15a CH=b²/a'); eq(d(B, H), c * c / a, '15a BH=c²/a')
  ok(par(H, E, A, B) && par(H, F, A, C), '15a HE∥AB, HF∥AC')
  eq(d(C, E) / d(C, A), d(C, H) / d(C, B), '15a CE/CA=CH/CB'); eq(d(B, F) / d(B, A), d(B, H) / d(B, C), '15a BF/BA=BH/BC')
  eq(d(C, E), b ** 3 / a ** 2, '15a CE=b³/a²'); eq(d(B, F), c ** 3 / a ** 2, '15a BF=c³/a²')
  eq(d(C, E) / d(B, F), b ** 3 / c ** 3, '15a CE/BF=AC³/AB³')
  // Pythagore dẫn CH
  eq(b * b - c * c, (d(C, H) - d(B, H)) * a, '15a AC²−AB²=(CH−BH)·BC')
  for (const t of [0.15, 0.4, 0.5, 0.77]) {
    const D = lerp(B, C, t), Mm = foot(D, A, B), N = foot(D, A, C)
    ok(par(D, Mm, A, C) && par(D, N, A, B), '15b DM∥AC, DN∥AB')
    eq(d(B, D) / d(B, C), d(B, Mm) / d(B, A), '15b BD/BC=BM/BA'); eq(d(C, D) / d(C, B), d(C, N) / d(C, A), '15b CD/CB=CN/CA')
    eq(d(B, D) * d(C, D), d(Mm, A) * d(Mm, B) + d(N, A) * d(N, C), '15b DB·DC=MA·MB+NA·NC')
    eq(d(Mm, A) * d(Mm, B), t * (1 - t) * c * c, '15b MA·MB=t(1−t)c²'); eq(d(N, A) * d(N, C), t * (1 - t) * b * b, '15b NA·NC=t(1−t)b²')
  }
}

// ───────── Bài 17 ─────────
let n17 = 0
while (n17 < 10) {
  const [A, B, C] = tamGiac(); const M = mid(B, C)
  const E = lerp(A, B, rr(0.15, 0.9)), F = lerp(A, C, rr(0.15, 0.9))
  const N = inter(E, F, A, M); if (!between(A, N, M)) continue; n17++
  const I = parInter(B, E, F, A, M), S = parInter(C, E, F, A, M)
  ok(par(B, I, E, F) && par(C, S, E, F), '17 BI∥EF∥CS')
  eq(d(A, B) / d(A, E), d(A, I) / d(A, N), '17 AB/AE=AI/AN'); eq(d(A, C) / d(A, F), d(A, S) / d(A, N), '17 AC/AF=AS/AN')
  ok(sameSide(A, I, M) && sameSide(A, S, M), '17 I,S ∈ tia AM')
  eq(d(M, I) / d(M, S), d(M, B) / d(M, C), '17 MI/MS=MB/MC'); eq(d(M, I), d(M, S), '17 MI=MS')
  ok(between(I, M, S), '17 M giữa I,S')
  eq(d(A, I) + d(A, S), 2 * d(A, M), '17 AI+AS=2AM')
  eq(d(A, B) / d(A, E) + d(A, C) / d(A, F), 2 * d(A, M) / d(A, N), '17 kết luận')
}

// ───────── Bài 18 ─────────
for (let it = 0; it < 12; it++) {
  const [A, B, C] = tamGiac()
  const u = rr(0.1, 0.9), Q = lerp(B, C, u), k = rr(0.1, 0.9), Pp = lerp(Q, A, k)   // PQ/AQ = k
  const M = parInter(Pp, A, C, A, B), N = parInter(Pp, A, B, A, C)
  ok(between(A, M, B) && between(A, N, C), '18 M,N thuộc cạnh')
  eq(d(Pp, Q) / d(A, Q), k, '18 k')
  const H = inter(Pp, N, B, C), I = inter(Pp, M, B, C)
  eq(d(Q, H) / d(Q, B), k, '18a QH/QB=k'); eq(d(Q, I) / d(Q, C), k, '18a QI/QC=k')
  ok(between(B, H, Q) && between(Q, I, C), '18a thứ tự B,H,Q,I,C')
  eq(d(B, H), (1 - k) * d(B, Q), '18a BH=(1−k)BQ'); eq(d(C, I), (1 - k) * d(C, Q), '18a CI=(1−k)CQ')
  eq(d(C, N) / d(C, A), d(C, H) / d(C, B), '18a CN/CA=CH/CB'); eq(d(A, N) / d(A, C), d(B, H) / d(B, C), '18a AN/AC=BH/BC')
  eq(d(B, M) / d(B, A), d(B, I) / d(B, C), '18a BM/BA=BI/BC'); eq(d(A, M) / d(A, B), d(C, I) / d(B, C), '18a AM/AB=CI/CB')
  const x = d(A, M) / d(A, B), y = d(A, N) / d(A, C), z = d(Pp, Q) / d(A, Q)
  eq(x + y + z, 1, '18a x+y+z=1')
  ok(x * y * z <= 1 / 27 + 1e-12, '18b xyz≤1/27')
  // thoả điều kiện ⇒ x=y=z
  if (Math.abs(x * y * z - 1 / 27) < 1e-9) ok(false, '18b ngẫu nhiên không nên đạt 1/27')
}
{
  // tìm đúng: Q trung điểm, k=1/3
  for (let it = 0; it < 4; it++) {
    const [A, B, C] = tamGiac(); const Q = mid(B, C), Pp = lerp(A, Q, 2 / 3)
    const M = parInter(Pp, A, C, A, B), N = parInter(Pp, A, B, A, C)
    eq(d(A, M) / d(A, B), 1 / 3, '18b x=1/3'); eq(d(A, N) / d(A, C), 1 / 3, '18b y=1/3'); eq(d(Pp, Q) / d(A, Q), 1 / 3, '18b z=1/3')
    eq((d(A, M) / d(A, B)) * (d(A, N) / d(A, C)) * (d(Pp, Q) / d(A, Q)), 1 / 27, '18b tích=1/27')
    // chiều thuận: x=y ⇒ MN∥BC ; J = AP∩MN trung điểm AP và MN ; Q trung điểm BC
    ok(par(M, N, B, C), '18b MN∥BC'); const J = inter(A, Pp, M, N)
    eq(d(A, J), d(J, Pp), '18b J trung điểm AP'); eq(d(M, J), d(J, N), '18b J trung điểm MN'); eq(d(A, J) / d(A, Q), 1 / 3, '18b AJ/AQ=1/3')
    eq(d(B, Q), d(Q, C), '18b BQ=QC'); ok(par(Pp, M, A, C) && par(Pp, N, A, B), '18b PM∥AC, PN∥AB')
  }
  // hình bình hành AMPN: AM=NP, AN=MP
  const [A, B, C] = tamGiac(); const Q = lerp(B, C, 0.4), Pp = lerp(A, Q, 0.6)
  const M = parInter(Pp, A, C, A, B), N = parInter(Pp, A, B, A, C)
  eq(d(A, M), d(N, Pp), '18 AM=NP'); eq(d(A, N), d(M, Pp), '18 AN=MP')
}

console.log(`kiem_G12: PASS=${PASS} FAIL=${FAIL}`)
