// Vẽ lại hình — gói HH08000000-5 (Chưa phân dạng — Hình học 8).
//   node scripts/anh/ve_lai/HH08000000-5.mjs [<thu_muc_ra>]
import { P, seg, rightAngle, tick, angleMark, sector, dot, label, num, angleText, angleBien, sideText, trongTam,
  hinh, xuatTat, mid, foot, add, ray, goc, dist, doiXung } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH08000000-5/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.5, `${m}: ${a} ≠ ${b}`)
const rad = (d) => d * Math.PI / 180

// ── HHC002480 — tam giác ABC, D, E trung điểm AB, AC; BC = 5 cm; ∠ADE = 70°, ∠DAE = 60° (⇒ B = 70°, C = 50°).
//    Hình đề: ticks AD=DB (1), AE=EC (2). Hình lời giải: thêm F đối xứng D qua E, nét DF, CF, tick DE=EF (3).
{
  const L = 330
  const B = P(0, 0), C = P(L, 0)
  const AB = L * Math.sin(rad(50)) / Math.sin(rad(60))
  const A = ray(B, 70, AB)
  const D = mid(A, B), E = mid(A, C)
  const F = doiXung(D, E)
  gt(goc(A, B, C), 60, 'góc A = 60°')
  gt(goc(B, A, C), 70, 'góc B = 70°')
  gt(goc(D, A, E), 70, 'góc ADE = 70° (DE ∥ BC)')
  gt(goc(C, A, B), 50, 'góc C = 50°')
  gt(dist(D, E), L / 2, 'DE = BC/2')
  const chung = [
    seg(A, B), seg(B, C), seg(A, C), seg(D, E),
    sector(A, B, C, 34), angleMark(A, B, C, 34),
    angleMark(D, A, E, 28), angleText(D, A, E, '70°', 62),
    angleText(A, B, C, '60°', 66),
    tick(A, D, 1), tick(D, B, 1), tick(A, E, 2), tick(E, C, 2),
    num(mid(B, C), '5 cm', 0, 30),
    dot(A), dot(B), dot(C), dot(D), dot(E),
    label(A, 'A', 0, -16), label(B, 'B', -16, 26), label(C, 'C', 18, 26),
    label(D, 'D', -22, 8), label(E, 'E', 22, -12),
  ]
  hinh('HHC002480_de', [A, B, C, D, E], chung)
  hinh('HHC002480_lg', [A, B, C, D, E, F], [
    ...chung, seg(E, F), seg(C, F), tick(D, E, 3), tick(E, F, 3), dot(F), label(F, 'F', 20, -10),
  ])
}

// ── HHC002481_lg — ABC vuông tại A (AB < AC), M trung điểm BC, MD ⊥ AB, ME ⊥ AC, AH ⊥ BC.
//    Nét: AB, AC, BC, AH, AM, DE, DM, ME, DH, HE. Gạch: BM = MC. Vuông: A, D, E, H.
{
  const B = P(0, 0), C = P(370, 0)
  const H = P(133, 0)
  const A = P(H.x, -Math.sqrt(dist(B, H) * dist(H, C)))        // AH² = BH·HC ⇒ góc A vuông
  const M = mid(B, C)
  const D = foot(M, A, B), E = foot(M, A, C)
  gt(goc(A, B, C), 90, 'góc A vuông')
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  gt(goc(D, M, A), 90, 'MD ⊥ AB'); gt(goc(E, M, A), 90, 'ME ⊥ AC')
  gt(goc(H, A, B), 90, 'AH ⊥ BC')
  gt(dist(D, E), dist(A, M), 'DE = AM')
  hinh('HHC002481_lg', [A, B, C, H, M, D, E], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(A, M), seg(D, E), seg(D, M), seg(M, E), seg(D, H), seg(H, E),
    tick(B, M, 1, 0.5), tick(M, C, 1, 0.5),
    rightAngle(A, B, C, 14), rightAngle(D, A, M, 12), rightAngle(E, A, M, 12), rightAngle(H, A, C, 12),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(D), dot(E),
    label(A, 'A', 0, -16), label(B, 'B', -14, 26), label(C, 'C', 16, 26), label(H, 'H', -4, 34), label(M, 'M', 6, 34),
    label(D, 'D', -22, 8), label(E, 'E', 24, 8),
  ])
}

// ── HHC002486 — hình thoi ABCD, ∠ADC = 60°; x = ∠BAC. D dưới-trái, C dưới-phải, A trên, B trên-phải.
{
  const s = 270
  const D = P(0, 0), C = P(s, 0)
  const A = ray(D, 60, s)
  const B = add(A, P(C.x - D.x, C.y - D.y))
  gt(goc(D, A, C), 60, 'góc ADC = 60°')
  gt(dist(A, B), dist(B, C), 'hình thoi')
  gt(goc(A, B, C), 60, 'x = 60° (hệ quả, tự kiểm)')
  hinh('HHC002486', [A, B, C, D], [
    sector(D, A, C, 34), angleMark(D, A, C, 34),
    sector(A, B, C, 32), angleMark(A, B, C, 32),
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C),
    angleText(D, A, C, '60°', 68),
    angleBien(A, B, C, 'x', 58),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', -8, -14), label(B, 'B', 18, -10), label(C, 'C', 6, 34), label(D, 'D', -20, 10),
  ])
}

// ── HHC002490_lg — ABC vuông tại A (AB < AC), M trung điểm BC, MN ⊥ AC, MP ⊥ AB; Q đối xứng M qua N, K đối xứng M qua P.
//    Nét: AB, AC, BC, KM (qua P), MQ (qua N), AM, PN. Gạch: KP = PM (2), MN = NQ (1). Vuông: A, P, N.
{
  const A = P(0, 0), B = P(0, -170), C = P(270, 0)
  const M = mid(B, C)
  const Pp = foot(M, A, B), N = foot(M, A, C)
  const Q = doiXung(M, N), K = doiXung(M, Pp)
  gt(goc(A, B, C), 90, 'góc A vuông')
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  gt(goc(Pp, M, A), 90, 'MP ⊥ AB'); gt(goc(N, M, A), 90, 'MN ⊥ AC')
  gt(dist(N, Q), dist(M, N), 'NQ = NM'); gt(dist(Pp, K), dist(M, Pp), 'PK = PM')
  hinh('HHC002490_lg', [A, B, C, M, Pp, N, Q, K], [
    seg(B, A), seg(A, C), seg(B, C), seg(K, M), seg(M, Q), seg(A, M), seg(Pp, N),
    tick(K, Pp, 2, 0.5), tick(Pp, M, 2, 0.5), tick(M, N, 1, 0.5), tick(N, Q, 1, 0.5),
    rightAngle(A, B, C, 14), rightAngle(Pp, A, M, 12), rightAngle(N, A, M, 12),
    dot(A), dot(B), dot(C), dot(M), dot(Pp), dot(N), dot(Q), dot(K),
    label(A, 'A', -18, 22), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(M, 'M', 22, -12),
    label(Pp, 'P', -18, -10), label(N, 'N', 20, 26), label(Q, 'Q', 0, 36), label(K, 'K', -20, 8),
  ])
}

// ── HHC002499 — tứ giác ABCD: AB = BC (1 gạch); ∠A = ∠C (1 cung), ∠B = ∠D (2 cung). Dựng đúng hình thoi (góc D = 50°).
{
  const s = 240
  const D = P(0, 0), C = P(s, 0)
  const A = ray(D, 50, s)
  const B = add(A, P(C.x - D.x, C.y - D.y))
  gt(dist(A, B), dist(B, C), 'AB = BC')
  gt(goc(A, B, D), goc(C, B, D), 'góc A = góc C')
  gt(goc(B, A, C), goc(D, A, C), 'góc B = góc D')
  hinh('HHC002499', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    tick(A, B, 1, 0.5), tick(B, C, 1, 0.5),
    angleMark(A, B, D, 28, 1), angleMark(C, B, D, 28, 1),
    angleMark(B, A, C, 28, 2), angleMark(D, A, C, 28, 2),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', -16, -10), label(B, 'B', 18, -10), label(C, 'C', 8, 34), label(D, 'D', -20, 10),
  ])
}

// ── HHC002500_lg — MNP vuông tại M, MH ⊥ NP (đường cao), HI ⊥ MN, HK ⊥ MP. Nét: PM, MN, NP, KH, HI, MH, KI.
{
  const M = P(0, 0), N = P(330, 0), Pp = P(0, -220)
  const H = foot(M, Pp, N)
  const I = foot(H, M, N), K = foot(H, M, Pp)
  gt(goc(M, Pp, N), 90, 'góc M vuông')
  gt(goc(H, M, Pp), 90, 'MH ⊥ NP')
  gt(dist(M, H), dist(I, K), 'MH = IK')
  hinh('HHC002500_lg', [M, N, Pp, H, I, K], [
    seg(Pp, M), seg(M, N), seg(N, Pp), seg(K, H), seg(H, I), seg(M, H), seg(K, I),
    rightAngle(M, Pp, N, 14), rightAngle(K, M, H, 12), rightAngle(I, M, H, 12), rightAngle(H, M, N, 12),
    dot(M), dot(N), dot(Pp), dot(H), dot(I), dot(K),
    label(M, 'M', -18, 28), label(N, 'N', 16, 26), label(Pp, 'P', -18, -10), label(H, 'H', 20, -14),
    label(I, 'I', 0, 36), label(K, 'K', -22, 8),
  ])
}

// ── HHC002501_de — tam giác MNP: MA = AN = 9 m, MB = BP = 16 m, NP = 29 m; ao cá giữa A và B; đoạn AB.
{
  const k = 11.4                                   // px / m
  const MN = 18 * k, MP = 32 * k, NP = 29 * k
  const N = P(0, 0), Pp = P(NP, 0)
  const xm = (MN * MN + NP * NP - MP * MP) / (2 * NP)
  const M = P(xm, -Math.sqrt(MN * MN - xm * xm))
  const A = mid(M, N), B = mid(M, Pp)
  gt(dist(M, A) / k, 9, 'MA = 9'); gt(dist(A, N) / k, 9, 'AN = 9')
  gt(dist(M, B) / k, 16, 'MB = 16'); gt(dist(B, Pp) / k, 16, 'BP = 16')
  gt(dist(N, Pp) / k, 29, 'NP = 29')
  // ao: đường cong khép kín (Catmull-Rom) quanh trung điểm AB, không chạm hai cạnh bên
  const O = mid(A, B)
  const pt = [[-52, -4], [-34, -26], [-4, -28], [26, -22], [48, -6], [40, 16], [10, 26], [-24, 24], [-46, 14]]
    .map(([dx, dy]) => P(O.x + dx, O.y + dy + 4))
  const n = pt.length
  let d = `M ${pt[0].x.toFixed(2)} ${pt[0].y.toFixed(2)}`
  for (let i = 0; i < n; i++) {
    const p0 = pt[(i - 1 + n) % n], p1 = pt[i], p2 = pt[(i + 1) % n], p3 = pt[(i + 2) % n]
    const c1 = P(p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6), c2 = P(p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6)
    d += ` C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)} ${c2.x.toFixed(2)} ${c2.y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }
  const ao = `<path d="${d} Z" fill="#dfe3e8" stroke="#222"/>`
  const g = trongTam([M, N, Pp])
  hinh('HHC002501_de', [M, N, Pp, A, B], [
    ao,
    seg(M, N), seg(M, Pp), seg(N, Pp), seg(A, B),
    dot(M), dot(N), dot(Pp), dot(A), dot(B),
    label(M, 'M', 0, -16), label(N, 'N', -18, 24), label(Pp, 'P', 20, 22),
    label(A, 'A', -20, 6), label(B, 'B', 16, -10),
    sideText(M, A, '9 m', g, 26), sideText(A, N, '9 m', g, 26),
    sideText(M, B, '16 m', g, 30), sideText(B, Pp, '16 m', g, 30),
    sideText(N, Pp, '29 m', g, 30),
  ], { pad: 62 })
}

await xuatTat(RA)
