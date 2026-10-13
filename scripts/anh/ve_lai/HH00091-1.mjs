// Vẽ lại hình — gói HH00091-1 (Hình chữ nhật, Hình học 8 lớp chuyên; 8 hình LỜI GIẢI).
//   node scripts/anh/ve_lai/HH00091-1.mjs [<thu_muc_ra>]
import { P, seg, segDash, rightAngle, angleMark, tick, dot, label, num, bien, hinh, xuatTat,
  mid, foot, inter, lerp, add, vec, mul, ray, rot, goc, dist, doiXung, bisector, ngoaiTiep } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00091-1/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.01, m)
const dot2 = (a, b, c, d) => (b.x - a.x) * (d.x - c.x) + (b.y - a.y) * (d.y - c.y)
const OPT = { pad: 32, padDuoi: 38 }

// ── HH00091001_lg — ABC vuông tại A, AH ⊥ BC; I, K = hình chiếu của H trên AB, AC; M trung điểm BC; O = AH ∩ IK; N = AM ∩ IK.
{
  const k = 1.3
  const H = P(0, 0), B = P(-75 * k, 0), C = P(235 * k, 0), A = P(0, -Math.sqrt(75 * 235) * k)
  gt(goc(A, B, C), 90, 'góc A vuông')
  const M = mid(B, C), I = foot(H, A, B), K = foot(H, A, C)
  const O = inter(A, H, I, K), N = inter(A, M, I, K)
  gt(dot2(A, H, B, C), 0, 'AH ⊥ BC'); gt(dot2(H, I, A, B), 0, 'HI ⊥ AB'); gt(dot2(H, K, A, C), 0, 'HK ⊥ AC')
  gt(dot2(A, M, I, K), 0, 'AM ⊥ IK (hệ quả đề đòi chứng minh — chỉ kiểm, không đánh dấu)')
  hinh('HH00091001_lg', [A, B, C, H, M, I, K, O, N], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, H), seg(A, M), seg(I, H), seg(H, K), seg(I, K),
    rightAngle(H, A, C, 12),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(I), dot(K), dot(O), dot(N),
    label(A, 'A', 0, -14), label(B, 'B', -16, 16), label(C, 'C', 18, 16), label(H, 'H', -6, 32), label(M, 'M', 8, 32),
    label(I, 'I', -16, 6), label(K, 'K', 16, -4), label(O, 'O', -14, -6), label(N, 'N', -4, 24),
  ], OPT)
}

// ── HH00091002_lg — hình bình hành ABCD (O = AC ∩ BD), H = hình chiếu của A trên OD, ∠DAH = ∠HAO = ∠OAB (= 30° ⇒ hình chữ nhật, AB = √3·AD).
//    OK ⊥ AB (K ∈ AB). Góc đánh số 1, 2, 3 tại A.
{
  const h = 190, w = h * Math.sqrt(3)
  const A = P(0, 0), B = P(w, 0), C = P(w, h), D = P(0, h)
  const O = inter(A, C, B, D), H = foot(A, O, D), K = foot(O, A, B)
  gt(dist(A, O), dist(A, D), 'AO = AD (hệ quả của 3 góc bằng nhau)')
  gt(goc(A, D, H), 30, '∠DAH = 30°'); gt(goc(A, H, O), 30, '∠HAO = 30°'); gt(goc(A, O, B), 30, '∠OAB = 30°')
  gt(goc(H, A, O), 90, 'AH ⊥ OD'); gt(goc(K, O, A), 90, 'OK ⊥ AB')
  gt(dist(D, H), dist(H, O), 'DH = HO'); gt(dist(H, O), dist(O, K), 'HO = OK')
  hinh('HH00091002_lg', [A, B, C, D, O, H, K], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(A, H), seg(O, K),
    angleMark(A, D, H, 34), angleMark(A, H, O, 46), angleMark(A, O, B, 34),
    num(bisector(A, D, H, 66), '1', 0, 7, 20), num(bisector(A, H, O, 70), '2', 0, 7, 20), num(bisector(A, O, B, 66), '3', 0, 7, 20),
    rightAngle(H, A, D, 12), rightAngle(K, O, A, 12),
    dot(A), dot(B), dot(C), dot(D), dot(O), dot(H), dot(K),
    label(A, 'A', -16, -8), label(B, 'B', 18, -8), label(C, 'C', 18, 26), label(D, 'D', -16, 26),
    label(K, 'K', 0, -14), label(O, 'O', 16, 24), label(H, 'H', 6, 26),
  ], OPT)
}

// ── HH00091003_lg — tam giác nhọn ABC, H trực tâm, I tâm đường tròn ngoại tiếp, E đối xứng A qua I.
//    Nét: AB, AC, BC, AE, BE, CE, đường cao từ A (xuống chân trên BC, có ô vuông), BH, CH; IB, IC nét đứt. Gạch: IA = IE.
{
  const B = P(0, 0), C = P(310, 0), A = P(70, -210)
  const I = ngoaiTiep(A, B, C), E = doiXung(A, I)
  const F = foot(A, B, C)                                   // chân đường cao từ A
  const H = inter(A, F, B, foot(B, A, C))
  gt(dist(I, A), dist(I, B), 'IA = IB'); gt(dist(I, B), dist(I, C), 'IB = IC'); gt(dist(I, A), dist(I, E), 'IA = IE')
  gt(dot2(A, F, B, C), 0, 'AF ⊥ BC'); gt(dot2(B, H, A, C), 0, 'BH ⊥ AC'); gt(dot2(C, H, A, B), 0, 'CH ⊥ AB')
  ok(goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90, 'tam giác nhọn')
  gt(dot2(C, A, C, E), 0, 'AC ⊥ CE (hệ quả)')
  hinh('HH00091003_lg', [A, B, C, E, H, I, F], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, E), seg(B, E), seg(C, E), seg(A, F), seg(B, H), seg(C, H),
    segDash(B, I), segDash(I, C),
    tick(A, I), tick(I, E),
    rightAngle(F, A, C, 12),
    dot(A), dot(B), dot(C), dot(E), dot(H), dot(I),
    label(A, 'A', 0, -14), label(B, 'B', -18, 8), label(C, 'C', 20, 8), label(E, 'E', 8, 34), label(H, 'H', -14, -4), label(I, 'I', 14, -12),
  ], OPT)
}

// ── HH00091004_lg — ABC vuông tại A (AB < AC), AH ⊥ BC, E ∈ AC với AE = AB, M trung điểm BE, EK ⊥ BC (K ∈ BC), EI ⊥ AH (I ∈ AH).
//    Nét: AB, AC, BC, AH, BE, AM, HM, KM, EK, EI.  Gạch: AB = AE.  Cung tại A: ∠BAM, ∠MAE (như ảnh cũ).
{
  const A = P(0, 0), B = ray(A, 238, 218), C = ray(A, 328, 345), E = ray(A, 328, 218)
  gt(goc(A, B, C), 90, 'góc A vuông'); ok(dist(A, B) < dist(A, C), 'AB < AC')
  const H = foot(A, B, C), K = foot(E, B, C), I = foot(E, A, H), M = mid(B, E)
  gt(dist(A, B), dist(A, E), 'AB = AE')
  gt(dot2(A, H, B, C), 0, 'AH ⊥ BC'); gt(dot2(E, K, B, C), 0, 'EK ⊥ BC'); gt(dot2(E, I, A, H), 0, 'EI ⊥ AH')
  gt(dist(A, M), dist(K, M), 'AM = KM (lời giải)'); gt(dist(A, H), dist(K, H), 'AH = KH (lời giải)')
  gt(goc(A, B, M), goc(A, M, E), '∠BAM = ∠MAE (AM là phân giác)')
  hinh('HH00091004_lg', [A, B, C, H, K, I, E, M], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(B, E), seg(A, M), seg(H, M), seg(K, M), seg(E, K), seg(E, I),
    tick(A, B), tick(A, E),
    angleMark(A, B, M, 24), angleMark(A, M, E, 32),
    rightAngle(H, A, C, 12), rightAngle(K, E, B, 12), rightAngle(I, A, E, 12),
    dot(A), dot(B), dot(C), dot(H), dot(K), dot(I), dot(E), dot(M),
    label(A, 'A', -2, -14), label(B, 'B', -18, 12), label(C, 'C', 20, 12), label(H, 'H', -2, 32), label(K, 'K', 4, 32),
    label(I, 'I', -16, 6), label(E, 'E', 18, -6), label(M, 'M', -18, -8),
  ], OPT)
}

// ── HH00091005_lg — hình thang cân ABCD (AB ∥ CD), ∠ACD = 60° ⇒ OCD, OAB đều; E, F, G trung điểm OA, OD, BC.
//    Nét: AB, BC, CD, DA, AC, BD, EB, FC, EF, EG, FG.  Gạch: OF = FD (1), BG = GC (2) — đúng như ảnh cũ.
{
  const L = 235, m = 0.55 * L
  const D = P(0, 0), C = P(L, 0), O = ray(D, 60, L)
  const A = add(O, mul(vec(C, O), m / L)), B = add(O, mul(vec(D, O), m / L))
  gt(goc(C, A, D), 60, '∠ACD = 60°'); gt(goc(D, B, C), 60, '∠BDC = 60°')
  gt(dist(A, D), dist(B, C), 'AD = BC (hình thang cân)'); gt(dist(A, C), dist(B, D), 'AC = BD')
  gt(dist(O, A), dist(O, B), 'OA = OB'); gt(goc(O, A, B), 60, 'OAB đều')
  gt(Math.abs(A.y - B.y), 0, 'AB ∥ CD')
  const E = mid(O, A), F = mid(O, D), G = mid(B, C)
  gt(dist(E, F), dist(F, G), 'EF = FG (hệ quả)'); gt(dist(F, G), dist(G, E), 'FG = GE (hệ quả)')
  hinh('HH00091005_lg', [A, B, C, D, O, E, F, G], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(E, B), seg(F, C), seg(E, F), seg(E, G), seg(F, G),
    tick(O, F), tick(F, D), tick(B, G, 2), tick(G, C, 2),
    dot(A), dot(B), dot(C), dot(D), dot(O), dot(E), dot(F), dot(G),
    label(A, 'A', -4, -14), label(B, 'B', 6, -14), label(C, 'C', 20, 20), label(D, 'D', -20, 20),
    label(O, 'O', 20, 2), label(E, 'E', -16, 4), label(F, 'F', -16, 2), label(G, 'G', 18, 2),
  ], OPT)
}

// ── HH00091006_lg — hình chữ nhật ABCD; H = hình chiếu của B trên AC; M, K trung điểm AH, CD; I, O trung điểm AB, IC.
//    Nét: AB, BC, CD, DA, AC, BH, IM, MK; nét đứt IC, BK.  Vuông: H.
{
  const w = 340, h = 200
  const A = P(0, 0), B = P(w, 0), C = P(w, h), D = P(0, h)
  const H = foot(B, A, C), M = mid(A, H), K = mid(C, D), I = mid(A, B), O = mid(I, C)
  gt(dot2(B, H, A, C), 0, 'BH ⊥ AC')
  gt(dist(M, O), dist(I, C) / 2, 'MO = IC/2 (hệ quả)'); gt(goc(M, B, K), 90, '∠BMK = 90° (hệ quả, không đánh dấu)')
  const O2 = inter(I, C, B, K); gt(dist(O, O2), 0, 'O = IC ∩ BK')
  hinh('HH00091006_lg', [A, B, C, D, H, M, K, I, O], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, H), seg(I, M), seg(M, K),
    segDash(I, C), segDash(B, K),
    rightAngle(H, B, C, 12),
    dot(A), dot(B), dot(C), dot(D), dot(H), dot(M), dot(K), dot(I), dot(O),
    label(A, 'A', -16, -8), label(B, 'B', 18, -8), label(C, 'C', 18, 26), label(D, 'D', -16, 26),
    label(I, 'I', 0, -14), label(K, 'K', 0, 34), label(M, 'M', -16, 12), label(H, 'H', -16, 20), label(O, 'O', 22, 6),
  ], OPT)
}

// ── HH00091007_lg — tam giác ABC: a = BC, b = CA, c = AB, đường cao h hạ từ A; d qua A song song BC; D đối xứng B qua d (BD = 2h, BD ⊥ BC).
//    Nét: AB, AC, BC, DA, DC, d; nét đứt BD; chữ h, h (hai nửa BD), a, b, c, d.
{
  const B = P(0, 0), C = P(300, 0), A = P(60, -120)
  const D = P(0, -240)
  gt(dist(A, B), dist(A, D), 'AB = AD (D đối xứng B qua d)')
  gt(dot2(B, D, B, C), 0, 'BD ⊥ BC'); gt(dist(B, D), 240, 'BD = 2h')
  hinh('HH00091007_lg', [B, C, A, D, P(-30, -120), P(330, -120)], [
    seg(A, B), seg(A, C), seg(B, C), seg(D, A), seg(D, C), seg(P(-30, -120), P(330, -120)), segDash(D, B),
    rightAngle(B, D, C, 12),
    dot(A), dot(B), dot(C), dot(D),
    label(D, 'D', -2, -16), label(A, 'A', 20, -12), label(B, 'B', -2, 32), label(C, 'C', 20, 8),
    bien(P(-20, -180), 'h', 0, 8), bien(P(-20, -60), 'h', 0, 8),
    bien(P(150, 24), 'a', 0, 8), bien(lerp(A, C, 0.5), 'b', -4, 26), bien(lerp(A, B, 0.5), 'c', 18, 6),
    bien(P(340, -128), 'd', 0, 8),
  ], OPT)
}

// ── HH00091008_lg — hình thang vuông ABCD (A = D = 90°, AB = AD = CD/2), E ∈ AB, EF ⊥ DE (F ∈ BC), M trung điểm DF.
//    Nét: AB, BC, CD, DA, BD, DE, EF, DF, EM; nét đứt BM.  Gạch: DM = MF.  Vuông: A, D, E.
{
  const s = 170
  const A = P(0, 0), B = P(s, 0), D = P(0, s), C = P(2 * s, s)
  const E = P(0.38 * s, 0)
  const F = rot(D, E, 90)
  gt(goc(B, D, C), 90, '∠DBC = 90°'); gt(goc(E, D, F), 90, 'DE ⊥ EF'); gt(dist(E, D), dist(E, F), 'ED = EF (hệ quả)')
  const F2 = inter(E, F, B, C); gt(dist(F, F2), 0, 'F ∈ BC')
  const M = mid(D, F)
  gt(dist(E, M), dist(B, M), 'EM = BM (lời giải)'); gt(goc(B, E, F), 135, '∠EBF = 135°'); gt(goc(E, M, B) + goc(F, M, B), 135, '∠MEB + ∠MFB = 135°')
  hinh('HH00091008_lg', [A, B, C, D, E, F, M], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(B, D), seg(D, E), seg(E, F), seg(D, F), seg(E, M), segDash(B, M),
    tick(D, M), tick(M, F),
    rightAngle(A, B, D, 14), rightAngle(D, A, C, 14), rightAngle(E, D, F, 12),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(M),
    label(A, 'A', -16, -8), label(E, 'E', -4, -14), label(B, 'B', 14, -12), label(F, 'F', 18, -6),
    label(C, 'C', 20, 20), label(D, 'D', -16, 26), label(M, 'M', 4, 30),
  ], OPT)
}

await xuatTat(RA)
