// Vẽ lại hình — gói HH00090-1 (Hình bình hành, Hình học 8 lớp chuyên; tất cả là hình LỜI GIẢI).
//   node scripts/anh/ve_lai/HH00090-1.mjs [<thu_muc_ra>]
import { P, seg, segDash, rightAngle, tick, dot, label, num, hinh, xuatTat, sector, angleMark,
  mid, foot, inter, lerp, add, vec, mul, ray, rot, goc, dist, doiXung, reflect, bisector } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00090-1/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.01, m)
const OPT = { pad: 32, padDuoi: 38 }
const thang = (a, b, c, m) => gt(Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)), 0, m)

// ── HH00090001_lg — ABC đều, D trong tam giác; BDE, CDF đều (E, F, D cùng phía BC). Hình bình hành AEDF.
//    Nét: AB, AC, BC, BE, ED, DB, DC, DF, CF, AE, AF (CF thêm vào: ảnh cũ thiếu cạnh thứ ba của tam giác đều CDF).
{
  const s = 300
  const B = P(0, 0), C = P(s, 0), A = ray(B, 60, s)
  const D = ray(B, 45, 0.475 * s)
  const E = rot(D, B, 60), F = rot(D, C, -60)
  ok(D.y < 0 && E.y < 0 && F.y < 0, 'E, F, D cùng phía BC')
  ok(goc(B, A, C) > 59.9 && goc(B, A, C) < 60.1, 'ABC đều')
  gt(dist(E, B), dist(E, D), 'BDE đều'); gt(dist(E, D), dist(B, D), 'BDE đều')
  gt(dist(F, C), dist(F, D), 'CDF đều'); gt(dist(F, D), dist(C, D), 'CDF đều')
  gt(dist(mid(A, D), mid(E, F)) , 0, 'AEDF hình bình hành (hệ quả)')
  ok(goc(B, A, D) < 60 && goc(C, B, D) < 60 && D.y < 0, 'D ở trong tam giác')
  hinh('HH00090001_lg', [A, B, C, D, E, F], [
    seg(A, B), seg(A, C), seg(B, C), seg(B, E), seg(E, D), seg(D, B), seg(D, C), seg(D, F), seg(C, F), seg(A, E), seg(A, F),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
    label(A, 'A', 0, -14), label(E, 'E', -18, -6), label(F, 'F', 18, -6), label(B, 'B', -18, 16), label(C, 'C', 20, 16), label(D, 'D', 0, 32),
  ], OPT)
}

// ── HH00090002_lg — ABC cân tại A, D ∈ AB, E ∈ AC, AD = CE; I trung điểm DE; K = AI ∩ BC; DM ∥ BC, IN ∥ BC (M, N ∈ AC).
//    Gạch: AD = CE (1), DI = IE (2). Ảnh cũ gọi trung điểm DE là F — theo ĐỀ là I.
{
  const w = 260, t = 0.367
  const B = P(0, 0), C = P(w, 0), A = P(w / 2, -261)
  gt(dist(A, B), dist(A, C), 'ABC cân tại A')
  const D = lerp(A, B, t), E = lerp(C, A, t)
  gt(dist(A, D), dist(C, E), 'AD = CE')
  const I = mid(D, E), K = inter(A, I, B, C)
  const dir = vec(B, C)
  const M = inter(D, add(D, dir), A, C), N = inter(I, add(I, dir), A, C)
  gt(K.x, D.x + E.x - A.x, 'ADKE hình bình hành (hệ quả)'); gt(K.y, 0, 'K ∈ BC')
  gt(dist(I, A), dist(I, K), 'I trung điểm AK (hệ quả)')
  hinh('HH00090002_lg', [A, B, C, D, E, I, K, M, N], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, K), seg(D, E), seg(D, K), seg(K, E), seg(D, M), seg(I, N),
    tick(A, D, 1), tick(C, E, 1), tick(D, I, 2), tick(I, E, 2),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(I), dot(K), dot(M), dot(N),
    label(A, 'A', 0, -14), label(B, 'B', -18, 16), label(C, 'C', 18, 16), label(D, 'D', -18, 4), label(M, 'M', 18, -6),
    label(N, 'N', 18, -2), label(E, 'E', 20, 12), label(I, 'I', -16, 26), label(K, 'K', 0, 32),
  ], OPT)
}

// ── HH00090003_lg — tứ giác ABCD (hình bất kỳ lồi); E, F, G, H trung điểm AB, BC, CD, DA; I, K trung điểm BD, AC; M = EG ∩ FH ∩ IK.
//    Nét: AB, BC, CD, DA, AC, BD, EG, FH, IK (như ảnh cũ — không vẽ sẵn các hình bình hành EFGH, EIGK).
{
  const s = 0.75
  const p = (x, y) => P(x * s, y * s)
  const A = p(117, 141), B = p(400, 69), C = p(613, 425), D = p(45, 425)
  const E = mid(A, B), F = mid(B, C), G = mid(C, D), H = mid(D, A), I = mid(B, D), K = mid(A, C)
  const M = mid(I, K)
  gt(dist(M, mid(E, G)), 0, 'M trung điểm EG'); gt(dist(M, mid(F, H)), 0, 'M trung điểm FH')
  hinh('HH00090003_lg', [A, B, C, D, E, F, G, H, I, K, M], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(E, G), seg(F, H), seg(I, K),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(G), dot(H), dot(I), dot(K), dot(M),
    label(A, 'A', -10, -12), label(B, 'B', 14, -10), label(C, 'C', 20, 18), label(D, 'D', -16, 8), label(E, 'E', 0, -14),
    label(F, 'F', 18, 4), label(G, 'G', 0, 32), label(H, 'H', -20, 6), label(I, 'I', -14, -8), label(K, 'K', 4, 28), label(M, 'M', -18, 26),
  ], OPT)
}

// ── HH00090004_lg — tứ giác ABCD; E, F chia AB làm ba; G, H chia DC làm ba (DG = GH = HC); M, I, K, N trung điểm AD, EG, FH, BC.
//    Gạch: AE = EF = FB (1), DG = GH = HC (2). Nét: tứ giác, EG, FH, FI, IH, FN, NH, MN nét đứt (qua I, K).
{
  const s = 0.7
  const p = (x, y) => P(x * s, y * s)
  const A = p(121, 134), B = p(481, 45), C = p(692, 375), D = p(62, 375)
  const E = lerp(A, B, 1 / 3), F = lerp(A, B, 2 / 3), G = lerp(D, C, 1 / 3), H = lerp(D, C, 2 / 3)
  const M = mid(A, D), I = mid(E, G), K = mid(F, H), N = mid(B, C)
  gt(dist(A, E), dist(E, F), 'AE = EF'); gt(dist(E, F), dist(F, B), 'EF = FB')
  gt(dist(D, G), dist(G, H), 'DG = GH'); gt(dist(G, H), dist(H, C), 'GH = HC')
  thang(M, I, K, 'M, I, K thẳng hàng (hệ quả)'); thang(M, I, N, 'M, I, N thẳng hàng (hệ quả)')
  gt(dist(M, I), dist(I, K), 'MI = IK (hệ quả)'); gt(dist(I, K), dist(K, N), 'IK = KN (hệ quả)')
  hinh('HH00090004_lg', [A, B, C, D, E, F, G, H, I, K, M, N], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(E, G), seg(F, H), seg(F, I), seg(I, H), seg(F, N), seg(N, H), segDash(M, N),
    tick(A, E, 1), tick(E, F, 1), tick(F, B, 1), tick(D, G, 2), tick(G, H, 2), tick(H, C, 2),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(G), dot(H), dot(I), dot(K), dot(M), dot(N),
    label(A, 'A', -12, -8), label(E, 'E', -4, -14), label(F, 'F', -4, -14), label(B, 'B', 14, -8), label(M, 'M', -20, 6),
    label(I, 'I', -16, 22), label(K, 'K', 4, -12), label(N, 'N', 18, -4), label(D, 'D', -6, 32), label(G, 'G', 0, 32),
    label(H, 'H', 0, 32), label(C, 'C', 18, 22),
  ], OPT)
}

// ── HH00090005_lg — ABCD hình bình hành, A = 60°; E ∈ AD, F ∈ CD, DE = CF; K đối xứng F qua BC; N = ED ∩ KC.
//    Gạch: DE = CF (2), K–chân = chân–F (1). Vuông: KF ⊥ BC. Cung đánh dấu góc C (như ảnh cũ). Ghi 60° ở A (theo đề).
{
  const s = 0.6, L = 420 * s, ab = 275 * s, d = 161 * s
  const A = P(0, 0), D = P(L, 0), B = ray(A, 60, ab), C = add(B, vec(A, D))
  gt(goc(A, B, D), 60, 'A = 60°')
  const E = P(L - d, 0)
  const F = lerp(C, D, d / ab)
  gt(dist(D, E), dist(C, F), 'DE = CF')
  const K = reflect(F, B, C), Q = foot(F, B, C)
  const N = inter(E, D, K, C)
  gt(dist(N, C), dist(N, D), 'NCD đều (hệ quả)'); gt(dist(C, D), dist(N, D), 'NCD đều (hệ quả)')
  gt(dist(N, K), dist(N, E), 'NKE đều (hệ quả)')
  thang(K, C, N, 'K, C, N thẳng hàng')
  hinh('HH00090005_lg', [A, B, C, D, E, F, K, N], [
    sector(C, B, D, 30),
    seg(A, B), seg(B, C), seg(C, D), seg(A, N), seg(K, E), seg(K, N), seg(K, F),
    tick(E, D, 2), tick(C, F, 2), tick(K, Q, 1), tick(Q, F, 1),
    rightAngle(Q, K, C, 12), angleMark(C, B, D, 30), angleMark(A, D, B, 30),
    num(ray(A, 30, 66), '60°', 0, 7.5),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(K), dot(N),
    label(A, 'A', -16, 6), label(B, 'B', -8, -14), label(C, 'C', 16, -12), label(K, 'K', 0, -14), label(E, 'E', 0, 32),
    label(D, 'D', 0, 32), label(N, 'N', 8, 32), label(F, 'F', 18, 10),
  ], OPT)
}

// ── HH00090006_lg — ABC có A > 90°; AD ⊥ AB, AD = AB; AE ⊥ AC, AE = AC (D, E trong góc A); M trung điểm DE; ADKE hình bình hành (K đối xứng A qua M); H = AM ∩ BC.
//    Vuông: BAD, CAE. Góc A₁ = DAK ghi "1" (lời giải dùng, ảnh cũ không ghi).
{
  const s = 0.65
  const A = P(0, 0), B = P(-193 * s, 145 * s), C = P(339 * s, 145 * s)
  ok(goc(A, B, C) > 90, 'A > 90°')
  const D = rot(B, A, 90), E = rot(C, A, -90)
  gt(goc(A, B, D), 90, 'AD ⊥ AB'); gt(dist(A, D), dist(A, B), 'AD = AB')
  gt(goc(A, C, E), 90, 'AE ⊥ AC'); gt(dist(A, E), dist(A, C), 'AE = AC')
  gt(goc(A, B, D) + goc(A, D, C), goc(A, B, C), 'D trong góc A'); gt(goc(A, B, E) + goc(A, E, C), goc(A, B, C), 'E trong góc A')
  const M = mid(D, E), K = doiXung(A, M), H = inter(A, M, B, C)
  gt(goc(H, A, B), 90, 'AH ⊥ BC (hệ quả)')
  gt(dist(A, D), dist(E, K), 'ADKE hình bình hành')
  hinh('HH00090006_lg', [A, B, C, D, E, K, M, H], [
    seg(B, C), seg(A, B), seg(A, C), seg(A, D), seg(A, E), seg(D, E), seg(A, K), seg(E, K), seg(D, K),
    rightAngle(A, B, D, 13), rightAngle(A, C, E, 20),
    num(bisector(A, D, K, 46), '1', 0, 8),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(K), dot(M), dot(H),
    label(A, 'A', 0, -14), label(B, 'B', -18, 4), label(C, 'C', 20, 4), label(H, 'H', -16, 24), label(M, 'M', 18, 22),
    label(D, 'D', 18, 4), label(E, 'E', -18, 6), label(K, 'K', 16, 28),
  ], OPT)
}

// ── HH00090007_lg — ABD vuông cân tại B, ACE vuông cân tại C (ra ngoài); M trung điểm DE; N đối xứng B qua M (BDNE hình bình hành); EN ⊥ AB tại P.
//    Nét: AB, AC, BC, BD, CE, DE, AD, AE (thêm: cạnh thứ ba hai tam giác vuông cân), BN, NC, NE, nét đứt AP, PN.
{
  const s = 0.55
  const p = (x, y) => P(x * s, y * s)
  const B = p(307, 401), C = p(590, 401), A = p(418, 143)
  const D = rot(A, B, 90), E = rot(A, C, -90)
  gt(goc(B, A, D), 90, 'ABD vuông tại B'); gt(dist(B, A), dist(B, D), 'BA = BD')
  gt(goc(C, A, E), 90, 'ACE vuông tại C'); gt(dist(C, A), dist(C, E), 'CA = CE')
  ok(D.y < B.y && E.y < C.y && D.x < B.x && E.x > C.x, 'ra phía ngoài tam giác')
  const M = mid(D, E), N = doiXung(B, M)
  gt(N.x, D.x + E.x - B.x, 'BDNE hình bình hành'); gt(N.y, D.y + E.y - B.y, 'BDNE hình bình hành')
  const Pp = inter(A, B, E, N)
  gt(goc(Pp, A, N), 90, 'EN ⊥ AB'); gt(dist(E, N), dist(A, B), 'EN = AB')
  gt(goc(C, B, N), 90, 'NC ⊥ BC (hệ quả)'); gt(dist(N, C), dist(B, C), 'NC = BC (hệ quả)')
  gt(goc(M, B, C), 90, 'BMC vuông tại M (hệ quả)'); gt(dist(M, B), dist(M, C), 'MB = MC (hệ quả)')
  hinh('HH00090007_lg', [A, B, C, D, E, M, N, Pp], [
    seg(A, B), seg(A, C), seg(B, C), seg(B, D), seg(C, E), seg(D, E), seg(A, D), seg(A, E), seg(B, N), seg(N, C), seg(N, E),
    segDash(A, Pp), segDash(Pp, N), rightAngle(Pp, A, N, 12),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(M), dot(N),
    label(A, 'A', -16, -8), label(B, 'B', -2, 34), label(C, 'C', 4, 34), label(D, 'D', -6, -12), label(E, 'E', 14, -10),
    label(M, 'M', 0, 34), label(N, 'N', 14, -12),
  ], OPT)
}

// ── HH00090008_lg — ABC đều; DE ∥ BC (D ∈ AB, E ∈ AC); G trọng tâm ADE; I trung điểm CD; cách 1: K ∈ DE, CK ∥ BD (BDKC hình bình hành, B, I, K thẳng hàng);
//    cách 2: H sao cho I trung điểm GH. Nét đứt: BK, DC, GH. Nét: AB, AC, BC, DK, BG, GK, BH, HK, CK.
{
  const s = 0.7
  const p = (x, y) => P(x * s, y * s)
  const B = p(91, 431), C = p(512, 431), A = p(301.5, 431 - 421 * Math.sqrt(3) / 2)
  const D = lerp(A, B, 0.672), E = lerp(A, C, 0.672)
  gt(D.y, E.y, 'DE ∥ BC')
  const G = P((A.x + D.x + E.x) / 3, (A.y + D.y + E.y) / 3)
  const I = mid(C, D)
  const K = add(D, vec(B, C))
  gt(K.y, D.y, 'K ∈ DE')
  const H = doiXung(G, I)
  thang(B, I, K, 'B, I, K thẳng hàng')
  gt(goc(G, I, B), 60, 'góc G của GIB = 60°')
  gt(goc(I, G, B), 90, 'góc I của GIB = 90°')
  gt(goc(B, G, I), 30, 'góc B của GIB = 30°')
  gt(dist(G, B), dist(G, H), 'GBH đều (hệ quả)'); gt(dist(G, B), dist(B, H), 'GBH đều (hệ quả)')
  hinh('HH00090008_lg', [A, B, C, D, E, K, G, I, H], [
    seg(A, B), seg(A, C), seg(B, C), seg(D, K), seg(B, G), seg(G, K), seg(B, H), seg(H, K), seg(C, K),
    segDash(B, K), segDash(D, C), segDash(G, H),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(K), dot(G), dot(I), dot(H),
    label(A, 'A', 0, -14), label(D, 'D', -18, -2), label(E, 'E', 8, -12), label(K, 'K', 18, -6), label(B, 'B', -18, 12),
    label(C, 'C', 20, 16), label(G, 'G', -6, -14), label(I, 'I', 16, -10), label(H, 'H', 0, 34),
  ], OPT)
}

await xuatTat(RA)
