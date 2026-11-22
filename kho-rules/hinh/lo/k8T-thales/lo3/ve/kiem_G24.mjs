// kiem_G24.mjs — verify số cho TCHH-4.1 … 4.7 (nhóm G24). node kiem_G24.mjs
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
const perp = (a, b, c, e) => Math.abs(dot(sub(b, a), sub(e, c))) < 1e-8 * len(sub(b, a)) * len(sub(e, c))
const ang = (v, p, q) => Math.acos(dot(sub(p, v), sub(q, v)) / (d(v, p) * d(v, q))) * 180 / Math.PI
const between = (a, x, b) => coll(a, x, b) && dot(sub(a, x), sub(b, x)) < 0           // x nằm giữa a, b
const side = (a, b, p) => Math.sign(cr(sub(b, a), sub(p, a)))                          // phía của p đối với đường thẳng ab
const rot = (v, deg) => { const t = deg * Math.PI / 180; return P(v.x * Math.cos(t) - v.y * Math.sin(t), v.x * Math.sin(t) + v.y * Math.cos(t)) }
const ortho = (a, b, c) => inter(a, foot(a, b, c), b, foot(b, a, c))
const lcg = (s) => () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296

// ───────── 4.1 (KHAC HH00093): ABCD vuông, M ∈ tia đối CB, N ∈ tia đối DC, DN = BM; AMFN hbh; O = trung điểm FA; B, O, D thẳng hàng ─────────
for (const [s, k] of [[1, 0.6], [2, 1.7], [3, 0.2], [1.3, 2.4]]) {
  const D = P(0, 0), C = P(s, 0), B = P(s, s), A = P(0, s)            // A trên-trái, B trên-phải, C dưới-phải, D dưới-trái (y hướng lên)
  const BM = s + k                                                    // M trên tia đối CB (qua C): BM = BC + CM
  const M = P(s, s - BM)
  const N = P(-(s + k), 0)                                            // N trên tia đối DC (qua D): DN = BM
  eq(d(D, N), d(B, M), '4.1 DN=BM')
  ok(between(B, C, M) && between(C, D, N), '4.1 vị trí M, N')
  const F = add(add(A, sub(M, A)), sub(N, A))                         // AMFN hbh: F = M + N − A
  ok(par(M, F, A, N) && par(N, F, A, M), '4.1 MF∥AN, NF∥AM')
  eq(d(A, N), d(A, M), '4.1 AN=AM'); eq(ang(A, N, M), 90, '4.1 ∠NAM=90°')
  const O = lerp(A, F, 0.5)
  ok(coll(B, O, D), '4.1 B,O,D thẳng hàng'); eq(d(O, A), d(O, C), '4.1 OA=OC')
  eq(d(O, M), d(O, C), '4.1 OM=OC (trung tuyến ứng cạnh huyền MN của tam giác MCN vuông tại C)')
}

// ───────── 4.2 (HH00131) ─────────
for (const [c, a] of [[4.5, 4], [3, 5], [6, 2.5], [2, 7], [4, 4.1]]) {   // c = AB, a = BC, B = 120°
  const B = P(0, 0), C = P(a, 0), A = rot(P(c, 0), 120)
  const AC = d(A, C); ok(AC > c, `4.2 AC>AB (c=${c},a=${a})`)
  // F: phân giác ngoài tại A cắt BC. Hướng phân giác ngoài = vuông góc phân giác trong
  const u1 = mul(sub(B, A), 1 / c), u2 = mul(sub(C, A), 1 / AC)
  const trong = add(u1, u2), ngoai = P(-trong.y, trong.x)
  const F = inter(A, add(A, ngoai), B, C)
  const D = lerp(A, C, c / (c + a)), E = lerp(A, B, AC / (AC + a))          // BD, CE phân giác trong
  ok(coll(A, D, C) && between(A, D, C) && between(A, E, B), '4.2 D,E trong cạnh')
  eq(ang(B, A, D), 60, '4.2 ∠ABD'); eq(ang(B, D, C), 60, '4.2 ∠DBC')
  eq(ang(C, A, E), ang(C, E, B), '4.2 CE phân giác C')
  // n1 ý a: F nằm trên tia đối tia BC (B giữa F, C), FB/FC = AB/AC
  ok(between(F, B, C), '4.2a B giữa F,C'); eq(d(F, B) / d(F, C), c / AC, '4.2a FB/FC=AB/AC')
  ok(d(F, B) < d(F, C), '4.2a FB<FC')
  // n2: Bx tia đối BD; ∠ABF = 60 = ∠FBx = ∠DBC
  const x = sub(B, sub(D, B))
  eq(ang(B, A, F), 60, '4.2a ∠ABF=60'); eq(ang(B, F, x), 60, '4.2a ∠FBx=60'); eq(ang(B, A, x), 120, '4.2a ∠ABx=120')
  eq(ang(B, A, F) + ang(B, F, x), ang(B, A, x), '4.2a BF nằm trong góc ABx')
  // n3: chân đường vuông góc
  const Pp = foot(F, A, B), Q = foot(F, A, C), R = foot(F, B, D)
  eq(d(F, Pp), d(F, Q), '4.2a FP=FQ'); eq(d(F, Pp), d(F, R), '4.2a FP=FR'); eq(d(F, Q), d(F, R), '4.2a FQ=FR')
  // n4: F trong góc ADB
  ok(side(A, C, F) === side(A, C, B), '4.2a F, B cùng phía AC'); ok(side(B, D, F) === side(B, D, A), '4.2a F, A cùng phía BD')
  ok(side(B, D, F) !== side(B, D, C), '4.2a F, C khác phía BD')
  eq(ang(D, A, F), ang(D, F, B), '4.2a ∠ADF=∠BDF'); eq(ang(D, A, F) + ang(D, F, B), ang(D, A, B), '4.2a DF nằm trong góc ADB')
  // ý b: Mê-nê-la-uýt
  eq((d(F, B) / d(F, C)) * (d(D, C) / d(D, A)) * (d(E, A) / d(E, B)), 1, '4.2b tích 1')
  eq(d(D, C) / d(D, A), a / c, '4.2b DC/DA=BC/BA'); eq(d(E, A) / d(E, B), AC / a, '4.2b EA/EB=CA/CB')
  ok(coll(D, E, F), '4.2b D,E,F thẳng hàng'); ok(!between(B, F, C), '4.2b F ngoài cạnh')
}

// ───────── 4.3 (KHAC): ba đường thẳng AH, BE, CD đồng quy ─────────
{
  const r = lcg(7)
  for (let i = 0; i < 6; i++) {
    const A = P(r() * 3 + 1, r() * 4 + 2), B = P(0, 0), C = P(r() * 4 + 3, 0)
    // tam giác vuông cân ABD, ACE vuông tại B, C, vẽ ra phía ngoài (D, E cùng phía với B... khác phía A đối với cạnh)
    const rotAround = (p, o, deg) => add(o, rot(sub(p, o), deg))
    const sgn = Math.sign(cr(sub(B, A), sub(C, A)))                  // chiều ABC
    // D: quay A quanh B 90° sao cho D ở phía ngoài AB (khác phía C đối với AB)
    let D = rotAround(A, B, 90); if (side(A, B, D) === side(A, B, C)) D = rotAround(A, B, -90)
    let E = rotAround(A, C, 90); if (side(A, C, E) === side(A, C, B)) E = rotAround(A, C, -90)
    eq(d(B, A), d(B, D), '4.3 BD=BA'); eq(ang(B, A, D), 90, '4.3 ∠ABD'); eq(d(C, A), d(C, E), '4.3 CE=CA'); eq(ang(C, A, E), 90, '4.3 ∠ACE')
    const H = foot(A, B, C)
    const O = inter(B, E, C, D)
    ok(coll(A, H, O), '4.3 AH,BE,CD đồng quy')
    // dựng theo sách: BN ⊥ CD cắt HA tại I; I A = BC; CI ⊥ BE
    const N = foot(B, C, D), I = inter(B, N, A, H)
    eq(d(I, A), d(B, C), '4.3 IA=BC'); ok(perp(C, I, B, E), '4.3 CI⊥BE')
  }
}

// ───────── 4.4 (HH00131): hình vuông ABCD, F ∈ BC, E = AF ∩ DC, G = DF ∩ BE ─────────
for (const [s, f] of [[1, 0.35], [2.5, 0.8], [1.7, 0.1], [3, 0.6], [1, 0.5]]) {
  // A trên-trái, B trên-phải, C dưới-phải, D dưới-trái; y hướng lên; cạnh s; CF = f·s
  const D = P(0, 0), C = P(s, 0), B = P(s, s), A = P(0, s), F = P(s, f * s)
  const E = inter(A, F, D, C), G = inter(D, F, B, E)
  ok(between(A, F, E) && between(C, E, D) === false && between(D, C, E), '4.4 F giữa A,E; C giữa D,E')
  ok(par(F, C, A, D) && par(A, B, C, E), '4.4 FC∥AD, AB∥CE')
  // n1: DE/FB = CE²/CF²
  eq(d(D, E) / d(F, B), d(C, E) ** 2 / d(C, F) ** 2, '4.4 n1 DE/FB=CE²/CF²')
  eq(d(E, C) / d(E, D), d(F, C) / d(A, D), '4.4 ΔEAD: EC/ED=FC/AD'); eq(d(F, B) / d(F, C), d(A, B) / d(C, E), '4.4 FB/FC=AB/CE')
  // n2: Mê-nê-la-uýt tam giác BCE, cát tuyến F, D, G:  FB/FC·DC/DE·GE/GB = 1
  eq((d(F, B) / d(F, C)) * (d(D, C) / d(D, E)) * (d(G, E) / d(G, B)), 1, '4.4 Menelaus BCE')
  eq(d(G, E) / d(G, B), (d(F, C) / d(F, B)) * (d(D, E) / d(D, C)), '4.4 n2 GE/GB')
  // n3: K chân đường cao từ C xuống EF
  const K = foot(C, E, F)
  eq(ang(C, E, F), 90, '4.4 ∠FCE=90°'); ok(between(E, K, F), '4.4 K giữa E,F')
  eq(d(K, E), d(C, E) ** 2 / d(E, F), '4.4 KE=CE²/EF'); eq(d(K, F), d(C, F) ** 2 / d(E, F), '4.4 KF=CF²/EF')
  eq(d(K, E) / d(K, F), d(C, E) ** 2 / d(C, F) ** 2, '4.4 n3 KE/KF')
  // n4: Menelaus tam giác BFE, cát tuyến C, K, G: CB/CF·KF/KE·GE/GB = 1
  eq((d(C, B) / d(C, F)) * (d(K, F) / d(K, E)) * (d(G, E) / d(G, B)), 1, '4.4 n4 tích bằng 1')
  // n5: C ngoài cạnh BF, K trong FE, G trong EB; thẳng hàng
  ok(!between(B, C, F) && between(B, F, C), '4.4 C ngoài cạnh BF (F giữa B, C)'); ok(between(B, G, E), '4.4 G giữa B,E')
  ok(side(D, F, B) !== side(D, F, E) && side(D, F, C) === side(D, F, E) && side(D, F, B) !== side(D, F, C), '4.4 B,E khác phía DF; C,E cùng phía')
  ok(coll(C, K, G), '4.4 C,K,G thẳng hàng'); ok(perp(C, G, A, E), '4.4 AE⊥CG')
}

// ───────── 4.5 (HH00131): OA/OA' = B'A/B'C + C'A/C'B ─────────
{
  const r = lcg(11)
  for (let i = 0; i < 8; i++) {
    const A = P(r() * 4, 5 + r() * 3), B = P(-3 - r() * 2, 0), C = P(4 + r() * 3, r())
    let u = 0.2 + r() * 0.5, v = 0.2 + r() * 0.5, w = 0.2 + r() * 0.5; const t = u + v + w; u /= t; v /= t; w /= t
    const O = add(add(mul(A, u), mul(B, v)), mul(C, w))
    const A1 = inter(A, O, B, C), B1 = inter(B, O, C, A), C1 = inter(C, O, A, B)
    ok(between(B, A1, C) && between(C, B1, A) && between(A, C1, B), '4.5 A\',B\',C\' trong cạnh')
    eq(d(O, A) / d(O, A1), d(B1, A) / d(B1, C) + d(C1, A) / d(C1, B), '4.5 OA/OA\'')
    // Mê-nê-la-uýt: ABA' với cát tuyến C, O, C': CB/CA'·OA'/OA·C'A/C'B = 1;  AA'C với B, O, B': BA'/BC·B'C/B'A·OA/OA' = 1
    eq((d(C, B) / d(C, A1)) * (d(O, A1) / d(O, A)) * (d(C1, A) / d(C1, B)), 1, '4.5 Menelaus ABA\'')
    eq((d(B, A1) / d(B, C)) * (d(B1, C) / d(B1, A)) * (d(O, A) / d(O, A1)), 1, '4.5 Menelaus AA\'C')
    eq(d(C, A1) + d(B, A1), d(B, C), '4.5 CA\'+BA\'=BC')
  }
}

// ───────── 4.6 (KHAC): ABC nhọn, ∠A = 60°, H trực tâm; M, N giao của trung trực BH, CH với AB, AC; M, N, H thẳng hàng ─────────
for (const [b, c, ba] of [[5, 7, 1], [6, 4.5, 1], [3.5, 8, 1], [5, 5.5, 1]]) {
  const A = P(0, 0), B = P(c, 0), C = rot(P(b, 0), 60)
  const nhon = Math.abs(ang(A, B, C) - 60) < 1e-6 && ang(B, A, C) < 90 && ang(C, A, B) < 90
  if (!nhon) continue
  const H = ortho(A, B, C)
  const perpBis = (X, Y) => { const m = lerp(X, Y, 0.5); return [m, add(m, P(-(Y.y - X.y), Y.x - X.x))] }
  const [m1, m2] = perpBis(B, H), [n1, n2] = perpBis(C, H)
  const M = inter(m1, m2, A, B), N = inter(n1, n2, A, C)
  eq(ang(B, A, H), 30, '4.6 ∠ABH=30'); eq(ang(C, H, A), 30, '4.6 ∠ACH=30'); eq(ang(H, B, C), 120, '4.6 ∠BHC=120')
  eq(d(M, B), d(M, H), '4.6 MB=MH'); eq(d(N, C), d(N, H), '4.6 NC=NH')
  ok(coll(M, H, N), '4.6 M,H,N thẳng hàng'); ok(between(M, H, N), '4.6 H giữa M,N')
}

// ───────── 4.7 (DE_SAU): trực tâm bốn tam giác tạo bởi bốn đường thẳng đôi một cắt nhau thẳng hàng (kiểm mệnh đề của đề) ─────────
{
  const r = lcg(5)
  for (let i = 0; i < 6; i++) {
    const L = []
    for (let k = 0; k < 4; k++) { const p = P(r() * 10, r() * 10), q = P(r() * 10, r() * 10); L.push([p, q]) }
    const X = (i1, i2) => inter(...L[i1], ...L[i2])
    const tam = (a, b, c) => ortho(X(a, b), X(b, c), X(a, c))
    const H = [tam(1, 2, 3), tam(0, 2, 3), tam(0, 1, 3), tam(0, 1, 2)]
    ok(coll(H[0], H[1], H[2]) && coll(H[0], H[1], H[3]), '4.7 bốn trực tâm thẳng hàng')
  }
}

console.log(`kiem_G24: ${PASS} phép kiểm, ${FAIL} FAIL`)
process.exit(FAIL ? 1 : 0)
