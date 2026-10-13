// Vẽ lại hình — gói HH00092-1 (Hình thoi, Hình học 8 lớp chuyên; 6 hình LỜI GIẢI).
//   node scripts/anh/ve_lai/HH00092-1.mjs [<thu_muc_ra>]
import { P, seg, segDash, rightAngle, angleMark, tick, dot, label, num, angleText, hinh, xuatTat,
  mid, foot, inter, lerp, add, vec, ray, goc, dist, doiXung, bisector } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00092-1/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.01, m)
const OPT = { pad: 32, padDuoi: 38 }
const unitV = (v) => { const l = Math.hypot(v.x, v.y); return P(v.x / l, v.y / l) }
const thang = (a, b, c, m) => gt(Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) / dist(a, b), 0, m)

// ── HH00092002_lg — ABC; D ∈ AB, E ∈ AC, BD = CE; I, K, M, N trung điểm BE, CD, BC, DE; MN cắt AC tại G, AB tại H (H ngoài đoạn, phía A).
//    At = phân giác góc A. Nét: AB(kéo dài tới H), BC, CA, DE, BE, CD, MI, MK, NI, NK, MN(tới H), At. Góc đánh số: M1 (IMN), M2 (NMK), G1 (MGC), H.
{
  const B = P(90, 410), C = P(435, 410), A = P(196, 160)
  const BD = 150
  const D = lerp(B, A, BD / dist(B, A)), E = lerp(C, A, BD / dist(C, A))
  gt(dist(B, D), dist(C, E), 'BD = CE')
  const I = mid(B, E), K = mid(C, D), M = mid(B, C), N = mid(D, E)
  const G = inter(M, N, A, C), H = inter(M, N, A, B)
  ok(H.y < A.y, 'H nằm ngoài đoạn AB, phía A')
  gt(dist(M, I), dist(M, K), 'MINK cân/thoi: MI = MK'); gt(dist(M, I), dist(N, I), 'MI = NI'); gt(dist(M, I), dist(N, K), 'MI = NK')
  gt(goc(M, I, N), goc(M, N, K), 'M1 = M2')
  const Ct = bisector(A, B, C, 62)                                  // đầu mút tia At
  gt(goc(A, B, Ct), goc(A, Ct, C), 'At phân giác')
  const tt = 0, d1 = unitV(vec(M, H)), d2 = unitV(vec(A, Ct))
  gt(d1.x * d2.y - d1.y * d2.x, 0, 'MG ∥ At (hệ quả)')
  const Hend = H
  hinh('HH00092002_lg', [A, B, C, D, E, I, K, M, N, G, Hend, Ct], [
    seg(B, C), seg(B, A), seg(A, Hend), seg(A, C), seg(D, E), seg(B, E), seg(C, D),
    seg(M, I), seg(M, K), seg(N, I), seg(N, K), seg(M, Hend), seg(A, Ct),
    angleMark(A, B, Ct, 26, 1), angleMark(A, Ct, C, 26, 1),
    angleMark(Hend, A, M, 36, 1),
    angleMark(G, M, C, 26, 1), num(bisector(G, M, C, 46), '1', 0, 6, 18),
    angleMark(M, I, N, 40, 1), num(bisector(M, I, N, 62), '1', 0, 6, 18),
    angleMark(M, N, K, 46, 1), num(bisector(M, N, K, 66), '2', 0, 6, 18),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(I), dot(K), dot(M), dot(N), dot(G),
    label(A, 'A', -16, -2), label(B, 'B', -18, 10), label(C, 'C', 20, 10), label(D, 'D', -20, 4), label(E, 'E', 18, 4),
    label(I, 'I', -16, 10), label(K, 'K', 16, 14), label(M, 'M', 4, 34), label(N, 'N', 16, -8), label(G, 'G', 18, -6),
    label(Hend, 'H', 0, -12), label(Ct, 't', -10, 10),
  ], OPT)
}

// ── HH00092003_lg — hình bình hành ABCD, AB = 2AD, D = 70°; H = hình chiếu của B trên AD (H nằm ngoài đoạn AD, phía A);
//    M trung điểm CD; N trung điểm AB.  Nét: ABCD, DH (A–H kéo dài), BH, HM, BM, MN.  Vuông tại H.  Ghi 70° tại D.
{
  const a = 130
  const D = P(0, 0), C = P(2 * a, 0), A = ray(D, 70, a), B = add(A, vec(D, C))
  gt(dist(A, B), 2 * dist(A, D), 'AB = 2AD'); gt(goc(D, A, C), 70, 'D = 70°')
  const H = foot(B, D, A)
  const M = mid(C, D), N = mid(A, B)
  ok(dist(D, H) > dist(D, A), 'H ngoài đoạn AD, phía A')
  gt(goc(H, D, B), 90, 'BH ⊥ AD')
  gt(goc(M, H, C), 105, 'góc HMC = 105° (đáp số)')
  gt(dist(M, H), dist(M, B), 'M cách đều H, B (hệ quả)'); gt(dist(N, H), dist(N, B), 'N cách đều H, B (hệ quả)')
  hinh('HH00092003_lg', [A, B, C, D, H, M, N], [
    seg(D, C), seg(C, B), seg(B, A), seg(A, D), seg(A, H), seg(B, H), seg(H, M), seg(B, M), seg(M, N),
    angleMark(D, C, A, 34, 1), angleText(D, C, A, '70°', 66, 20),
    rightAngle(H, A, B, 13),
    dot(A), dot(B), dot(C), dot(D), dot(H), dot(M), dot(N),
    label(H, 'H', -18, -6), label(A, 'A', -20, 6), label(B, 'B', 20, 2), label(N, 'N', 18, 8),
    label(D, 'D', -16, 24), label(M, 'M', 4, 34), label(C, 'C', 16, 24),
  ], OPT)
}

// ── HH00092004_lg — hình thoi ABCD (A trên, C dưới, BD ngang), O = tâm; E, F hình chiếu của O trên BC, CD.
//    a) EF = BD/4 ⇒ góc C = 120° ; b) EF = AC/4 ⇒ góc C = 150°.  Nét: 4 cạnh, AC, BD, OE, OF, EF.  Vuông tại E, F.  Hai hình xếp 2 hàng.
{
  const hoi = (s, gocC, dy) => {
    const C2 = gocC / 2
    const AC = 2 * s * Math.cos(C2 * Math.PI / 180), BD = 2 * s * Math.sin(C2 * Math.PI / 180)
    const O = P(0, dy), A = P(0, dy - AC / 2), C = P(0, dy + AC / 2), B = P(-BD / 2, dy), D = P(BD / 2, dy)
    const E = foot(O, B, C), F = foot(O, C, D)
    gt(dist(A, B), s, 'cạnh'); gt(dist(B, C), dist(C, D), 'thoi'); gt(goc(C, B, D), gocC, 'góc C')
    return { O, A, B, C, D, E, F, AC, BD }
  }
  const a = hoi(120, 120, 0)
  gt(dist(a.E, a.F), a.BD / 4, 'a) EF = BD/4')
  const b = hoi(225, 150, 200)
  gt(dist(b.E, b.F), b.AC / 4, 'b) EF = AC/4')
  const ve = (h, ra, cap, capP) => [
    seg(h.A, h.B), seg(h.B, h.C), seg(h.C, h.D), seg(h.D, h.A), seg(h.A, h.C), seg(h.B, h.D),
    seg(h.O, h.E), seg(h.O, h.F), seg(h.E, h.F),
    rightAngle(h.E, h.O, h.C, ra), rightAngle(h.F, h.O, h.C, ra),
    dot(h.A), dot(h.B), dot(h.C), dot(h.D), dot(h.O), dot(h.E), dot(h.F),
    label(h.A, 'A', 0, -14), label(h.B, 'B', -18, 8), label(h.D, 'D', 18, 8), label(h.C, 'C', 0, 34),
    label(h.O, 'O', 16, -8),
    num(capP, cap, 0, 0, 22),
  ]
  hinh('HH00092004_lg', [a.A, a.B, a.C, a.D, b.A, b.B, b.C, b.D, P(0, b.C.y + 8)], [
    ...ve(a, 12, 'a)', P(a.D.x - 4, a.C.y + 14)),
    ...ve(b, 7, 'b)', P(b.D.x - 4, b.C.y + 14)),
    // nhãn E, F riêng cho từng hình (cách nhau gần C ở hình b)
    label(a.E, 'E', -16, 14), label(a.F, 'F', 16, 14),
    label(b.E, 'E', -17, 10), label(b.F, 'F', 17, 10),
  ], OPT)
}

// ── HH00092005_lg — hình bình hành ABCD (A dưới-trái, B trên-trái, C trên-phải, D dưới-phải; không phải hình thoi);
//    E ∈ AB, M ∈ BC, N ∈ CD, F ∈ DA; BM = DN, BE = DF; I, O, K trung điểm EF, BD, MN; Q trung điểm BF.
//    OI cắt AD tại G, AB tại H.  Nét: ABCD, BD, EF, MN, đường HK (qua G, I, O, K, kéo qua K), BF + QI + QO (đứt), Ax, Cy phân giác.
{
  const A = P(0, 0), D = P(280, 0), B = P(62, -178), C = add(B, vec(A, D))
  ok(dist(A, B) !== dist(A, D), 'không phải hình thoi')
  const BE = 92, BM = 130
  const E = lerp(B, A, BE / dist(B, A)), F = lerp(D, A, BE / dist(D, A))
  const M = lerp(B, C, BM / dist(B, C)), N = lerp(D, C, BM / dist(D, C))
  gt(dist(B, E), dist(D, F), 'BE = DF'); gt(dist(B, M), dist(D, N), 'BM = DN')
  const I = mid(E, F), O = mid(B, D), K = mid(M, N), Q = mid(B, F)
  thang(I, O, K, 'I, O, K thẳng hàng (hệ quả)')
  const G = inter(I, O, A, D), H = inter(I, O, A, B)
  ok(G.x > A.x && G.x < F.x, 'G ∈ đoạn AF'); ok(H.y > A.y, 'H ngoài đoạn AB, phía A')
  gt(dist(Q, I), dist(Q, O), 'QI = QO (hệ quả)')
  const dOI = unitV(vec(O, I))
  const Kend = P(K.x - dOI.x * 62, K.y - dOI.y * 62)              // kéo qua K phía C
  const Ax = bisector(A, B, D, 72), Cy = bisector(C, B, D, 56)
  gt(goc(A, B, Ax), goc(A, Ax, D), 'Ax phân giác'); gt(goc(C, B, Cy), goc(C, Cy, D), 'Cy phân giác')
  thang(P(0, 0), P(Ax.x - A.x, Ax.y - A.y), P(Cy.x - C.x, Cy.y - C.y), 'Ax ∥ Cy')
  hinh('HH00092005_lg', [A, B, C, D, E, F, M, N, I, O, K, Q, G, H, Kend, Ax, Cy], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(B, D), seg(E, F), seg(M, N), seg(H, Kend),
    segDash(B, F), segDash(Q, I), segDash(Q, O),
    seg(A, Ax), seg(C, Cy),
    tick(B, M, 1), tick(D, N, 1), tick(B, E, 2), tick(D, F, 2),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(M), dot(N), dot(I), dot(O), dot(K), dot(Q), dot(G),
    label(B, 'B', 0, -12), label(M, 'M', -2, -12), label(C, 'C', 16, -10), label(N, 'N', 18, 8),
    label(D, 'D', 18, 24), label(F, 'F', 2, 26), label(A, 'A', -16, 4), label(E, 'E', -16, 8),
    label(G, 'G', 6, 26), label(H, 'H', -12, 12), label(I, 'I', 4, 30), label(O, 'O', 4, -12),
    label(K, 'K', -16, 24), label(Q, 'Q', -14, 8),
    label(Ax, 'x', 14, 4), label(Cy, 'y', -14, 4),
  ], OPT)
}

// ── HH00092006_lg — tứ giác ABCD, hai đường chéo cắt nhau tại O; OC ≥ OA, OD ≥ OB; E ∈ OC với OE = OA, F ∈ OD với OF = OB.
//    Nét: AB, BC, CD, DA, AC, BD, BE, AF, EF.  (ABEF hình bình hành; hình dựng tổng quát, C ≠ E, D ≠ F.)
{
  const s = 0.9
  const u = P(Math.cos(7 * Math.PI / 180), -Math.sin(7 * Math.PI / 180)), v = P(0, 1)
  const O = P(0, 0)
  const A = P(-130 * s * u.x, -130 * s * u.y), C = P(195 * s * u.x, 195 * s * u.y)
  const B = P(0, -88 * s), D = P(0, 143 * s)
  const E = P(130 * s * u.x, 130 * s * u.y), F = P(0, 88 * s)
  ok(dist(O, C) >= dist(O, A) && dist(O, D) >= dist(O, B), 'OC ≥ OA, OD ≥ OB')
  gt(dist(O, E), dist(O, A), 'OE = OA'); gt(dist(O, F), dist(O, B), 'OF = OB')
  gt(dist(A, B), dist(E, F), 'AB = EF'); gt(dist(B, E), dist(A, F), 'BE = AF (ABEF hình bình hành)')
  hinh('HH00092006_lg', [A, B, C, D, O, E, F], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(B, E), seg(A, F), seg(E, F),
    dot(A), dot(B), dot(C), dot(D), dot(O), dot(E), dot(F),
    label(A, 'A', -18, 6), label(B, 'B', 0, -14), label(C, 'C', 18, 4), label(D, 'D', 0, 34),
    label(O, 'O', 16, 4), label(E, 'E', 8, 28), label(F, 'F', 16, 14),
  ], OPT)
}

// ── HH00092007_lg — tam giác đều ABC, AD đường cao, H trực tâm; M ∈ BC; E, F hình chiếu của M trên AB, AC; I trung điểm AM;
//    N trung điểm AH; O = ID ∩ EF (và ∈ MH).  Nét: AB, BC, CA, AD, AM, IN; đứt: ME, MF, DE, DF, IE, IF, ID, EF, MH.
{
  const L = 300
  const B = P(-L / 2, 0), C = P(L / 2, 0), A = P(0, -L * Math.sqrt(3) / 2)
  const D = mid(B, C), H = P(0, A.y * 1 / 3)
  gt(dist(A, B), dist(B, C), 'đều'); gt(dist(A, C), dist(B, C), 'đều')
  const M = lerp(B, D, 0.52)
  const E = foot(M, A, B), F = foot(M, A, C), I = mid(A, M), N = mid(A, H)
  const O = inter(I, D, E, F)
  gt(goc(A, E, M) + goc(A, M, F), 60, 'góc A = 60°')
  gt(dist(D, I), dist(E, I), 'DI = EI = AM/2'); gt(dist(D, I), dist(F, I), 'DI = FI')
  gt(dist(D, E), dist(D, F), 'DEIF thoi (hệ quả)'); gt(dist(D, E), dist(D, I), 'DEI đều (hệ quả)')
  thang(M, H, O, 'M, O, H thẳng hàng (hệ quả)')
  gt(dist(A, H), dist(H, D) * 2, 'H trọng tâm')
  hinh('HH00092007_lg', [A, B, C, D, M, E, F, I, H, N, O], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(A, M), seg(I, N),
    segDash(M, E), segDash(M, F), segDash(D, E), segDash(D, F), segDash(I, E), segDash(I, F), segDash(I, D), segDash(E, F), segDash(M, H),
    dot(A), dot(B), dot(C), dot(D), dot(M), dot(E), dot(F), dot(I), dot(H), dot(N), dot(O),
    label(A, 'A', 0, -14), label(B, 'B', -16, 22), label(C, 'C', 16, 22), label(D, 'D', 8, 32), label(M, 'M', -4, 32),
    label(E, 'E', -18, 6), label(F, 'F', 18, 2), label(I, 'I', -16, 2), label(H, 'H', 16, 4), label(N, 'N', 16, 2), label(O, 'O', -18, 4),
  ], OPT)
}

await xuatTat(RA)
