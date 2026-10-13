// Vẽ lại hình — gói HH08000000-1 (Hình học 8 lấy từ các đề thi giữa kì; hình đề + hình lời giải).
//   node scripts/anh/ve_lai/HH08000000-1.mjs [<thu_muc_ra>]
import { P, seg, segDash, rightAngle, angleMark, tick, dot, label, num, sideText, hinh, xuatTat,
  mid, foot, inter, lerp, add, vec, ray, goc, dist, doiXung } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH08000000-1/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.01, m)
const OPT = { pad: 32, padDuoi: 38 }

// ── HHC002385 (hình ĐỀ) — AHCE: A trên H, E trên C; H ∈ BC (B bên trái); I = AC ∩ HE.
//    Gạch bằng nhau: IA = IC = IH = IE (4 gạch đơn). Vuông: tại H (AH ⊥ BC, ô nằm phía B như ảnh cũ).
{
  const H = P(0, 0), C = P(240, 0), A = P(0, -125), E = P(240, -125), B = P(-95, 0)
  const I = inter(A, C, H, E)
  gt(dist(I, A), dist(I, C), 'IA = IC'); gt(dist(I, H), dist(I, E), 'IH = IE')
  gt(dist(A, C), dist(H, E), 'AC = HE')
  gt(goc(H, A, B), 90, 'AH ⊥ BC')
  hinh('HHC002385', [A, B, C, H, E, I], [
    seg(B, C), seg(A, B), seg(A, H), seg(A, E), seg(E, C), seg(A, C), seg(H, E),
    tick(A, I), tick(I, C), tick(H, I), tick(I, E),
    rightAngle(H, A, B, 14),
    dot(A), dot(B), dot(C), dot(H), dot(E), dot(I),
    label(A, 'A', -4, -14), label(E, 'E', 8, -14), label(B, 'B', -22, 8), label(C, 'C', 22, 16), label(H, 'H', 0, 34), label(I, 'I', 0, -16),
  ], OPT)
}

// ── HHC002386_lg — hình bình hành ABCD (AB > BC), K = trung điểm AB, E = trung điểm CD, O = AC ∩ BD. Nét thêm: AE, KC.
{
  const A = P(0, 0), B = P(320, 0), D = P(-60, 180), C = add(B, vec(A, D))
  const K = mid(A, B), E = mid(D, C), O = inter(A, C, B, D)
  ok(dist(A, B) > dist(B, C), 'AB > BC')
  gt(dist(O, A), dist(O, C), 'O trung điểm AC'); gt(dist(O, B), dist(O, D), 'O trung điểm BD')
  gt(dist(A, K), dist(K, B), 'K trung điểm AB'); gt(dist(D, E), dist(E, C), 'E trung điểm CD')
  hinh('HHC002386_lg', [A, B, C, D, E, K, O], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(A, E), seg(K, C),
    tick(A, K, 1), tick(K, B, 1), tick(D, E, 2), tick(E, C, 2),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(K), dot(O),
    label(A, 'A', -4, -14), label(K, 'K', 0, -14), label(B, 'B', 6, -14),
    label(D, 'D', -20, 22), label(E, 'E', 0, 34), label(C, 'C', 20, 22), label(O, 'O', 0, -16),
  ], OPT)
}

// ── HHC002390_lg — tam giác ABC vuông tại A; AH ⊥ BC; M trung điểm BC; HD ⊥ AB, HE ⊥ AC; K sao cho E trung điểm AK;
//    O = AH ∩ DE; Q = AM ∩ DE.  Nét: AB, BC, A–E–K–C, AH, AM, DE, DH, HE, HK.  Gạch: BM = MC (1), AE = EK (2).
{
  const s = 0.45
  const H = P(0, 0), B = P(-280 * s, 0), C = P(480 * s, 0)
  const A = P(0, -Math.sqrt(280 * 480) * s)
  gt(goc(A, B, C), 90, 'góc A vuông')
  const M = mid(B, C)
  const D = foot(H, A, B), E = foot(H, A, C)
  const K = doiXung(A, E)
  const O = inter(A, H, D, E), Q = inter(A, M, D, E)
  gt(goc(D, A, H), 90, 'HD ⊥ AB'); gt(goc(E, A, H), 90, 'HE ⊥ AC')
  gt(goc(A, K, B), 90, 'K ∈ AC')
  gt(dist(A, E), dist(E, K), 'E trung điểm AK')
  gt(goc(Q, A, E), 90, 'AQE vuông tại Q (hệ quả đề đòi chứng minh)')
  hinh('HHC002390_lg', [A, B, C, H, M, D, E, K, O, Q], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, H), seg(A, M), seg(D, E), seg(D, H), seg(H, E), seg(H, K),
    tick(B, M, 1), tick(M, C, 1), tick(A, E, 2), tick(E, K, 2),
    rightAngle(A, B, C, 14), rightAngle(D, A, H, 14), rightAngle(E, A, H, 14), rightAngle(H, A, B, 14),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(D), dot(E), dot(K), dot(O), dot(Q),
    label(A, 'A', 0, -14), label(B, 'B', -18, 10), label(C, 'C', 20, 10), label(H, 'H', -8, 32), label(M, 'M', 10, 32),
    label(D, 'D', -20, 6), label(E, 'E', 18, -6), label(K, 'K', 16, -12), label(O, 'O', -16, -4), label(Q, 'Q', 24, 14),
  ], OPT)
}

// ── HHC002391_lg — ABC cân tại A, AH ⊥ BC (H trung điểm BC); I trung điểm AC; K ∈ tia đối IH, IK = IH; G trung điểm AB; O = AH ∩ BK.
//    Nét: AB, BC, AC, AH, AK, KC, KH, BK, GI.  Gạch: AG = GB (1), AI = IC (1), KI = IH (2).  Vuông: H.
{
  const s = 0.55
  const H = P(0, 0), B = P(-320 * s, 0), C = P(320 * s, 0), A = P(0, -560 * s)
  gt(dist(A, B), dist(A, C), 'ABC cân tại A')
  const I = mid(A, C), K = doiXung(H, I), G = mid(A, B)
  const O = inter(A, H, B, K)
  gt(goc(H, A, C), 90, 'AH ⊥ BC')
  gt(dist(I, K), dist(I, H), 'IK = IH')
  gt(goc(H, A, C), 90, 'AHCK hình chữ nhật (hệ quả)')
  gt(dist(O, A), dist(O, H), 'O trung điểm AH (hệ quả)'); gt(dist(O, B), dist(O, K), 'O trung điểm BK (hệ quả)')
  gt(Math.abs((G.y - O.y) * (I.x - O.x) - (G.x - O.x) * (I.y - O.y)), 0, 'G, O, I thẳng hàng (hệ quả)')
  hinh('HHC002391_lg', [A, B, C, H, K, I, G, O], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, H), seg(A, K), seg(K, C), seg(K, H), seg(B, K), seg(G, I),
    tick(A, G, 1), tick(G, B, 1), tick(A, I, 1), tick(I, C, 1), tick(K, I, 2), tick(I, H, 2),
    rightAngle(H, A, C, 14),
    dot(A), dot(B), dot(C), dot(H), dot(K), dot(I), dot(G), dot(O),
    label(A, 'A', -2, -14), label(K, 'K', 14, -12), label(B, 'B', -18, 20), label(C, 'C', 20, 20), label(H, 'H', -4, 32),
    label(G, 'G', -20, 4), label(I, 'I', 20, 6), label(O, 'O', -16, -10),
  ], OPT)
}

// ── HHC002392_lg — ABC vuông tại A (AB < AC, AC ≠ 2AB), M trung điểm BC, MH ⊥ AC (H ∈ AC), D ∈ tia HM, HM = MD;
//    AK ∥ BC, CK ∥ AM (K = A + C − M).  Nét: AB, BD, DC, AC, BH, DH, AM, BC (B–M–C), AK, KC.  Gạch: BM = MC (1), DM = MH (2).  Vuông: A, H.
{
  const s = 0.55
  const A = P(0, 0), B = P(0, -360 * s), C = P(600 * s, 0)
  ok(dist(A, B) < dist(A, C) && Math.abs(dist(A, C) - 2 * dist(A, B)) > 1, 'AB < AC, AC ≠ 2AB')
  const M = mid(B, C), H = foot(M, A, C), D = doiXung(H, M)
  const K = add(A, vec(M, C))                  // AMCK hình bình hành: K = A + C − M
  gt(goc(A, B, C), 90, 'A vuông'); gt(goc(H, M, A), 90, 'MH ⊥ AC')
  gt(dist(M, H), dist(M, D), 'HM = MD')
  gt(Math.abs((K.x - A.x) * (C.y - B.y) - (K.y - A.y) * (C.x - B.x)), 0, 'AK ∥ BC')
  gt(Math.abs((K.x - C.x) * (M.y - A.y) - (K.y - C.y) * (M.x - A.x)), 0, 'CK ∥ AM')
  gt(dist(A, M), dist(M, C), 'AM = MC (hệ quả)')
  hinh('HHC002392_lg', [A, B, C, M, H, D, K], [
    seg(A, B), seg(B, D), seg(D, C), seg(A, C), seg(B, H), seg(D, H), seg(A, M), seg(B, C), seg(A, K), seg(K, C),
    tick(B, M, 1), tick(M, C, 1), tick(D, M, 2), tick(M, H, 2),
    rightAngle(A, B, C, 14), rightAngle(H, A, D, 14),
    dot(A), dot(B), dot(C), dot(M), dot(H), dot(D), dot(K),
    label(B, 'B', -14, -12), label(D, 'D', 16, -12), label(M, 'M', 20, -8), label(A, 'A', -16, 12),
    label(H, 'H', -14, 26), label(C, 'C', 20, 20), label(K, 'K', 0, 34),
  ], OPT)
}

// ── HHC002393_lg — hình thoi ABCD, góc A = 60°; BH ⊥ AD (H ∈ AD); E ∈ tia đối HB, HE = BH; nối EA, ED.
//    Nét: AB, BC, CD, DA, AC, BE, AE, ED–DC (E, D, C thẳng hàng), BD nét đứt.  Gạch: AH = ... (1) AB, BC, CD, AH; (2) BH, HE.  Cung 60° tại A.
{
  const L = 195
  const A = P(0, 0), D = P(L, 0), B = ray(A, 60, L), C = add(B, vec(A, D))
  const H = foot(B, A, D), E = doiXung(B, H)
  gt(goc(A, B, D), 60, 'góc A = 60°')
  gt(dist(A, B), dist(B, C), 'AB = BC'); gt(dist(B, C), dist(C, D), 'BC = CD'); gt(dist(C, D), dist(D, A), 'CD = DA')
  gt(dist(B, H), dist(H, E), 'HE = BH'); gt(goc(H, B, A), 90, 'BH ⊥ AD')
  gt(dist(A, H), dist(H, D), 'H trung điểm AD (hệ quả)')
  gt(goc(D, E, C), 180, 'E, D, C thẳng hàng (hệ quả)')
  hinh('HHC002393_lg', [A, B, C, D, E, H], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), segDash(B, D), seg(B, E), seg(A, E), seg(E, D),
    tick(A, B, 1), tick(B, C, 1), tick(C, D, 1), tick(A, H, 1), tick(B, H, 2), tick(H, E, 2),
    angleMark(A, B, D, 36, 1), num(ray(A, 45, 92), '60°', 0, 7.5),
    rightAngle(H, B, D, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(H),
    label(B, 'B', 0, -14), label(C, 'C', 18, -8), label(A, 'A', -20, 8), label(D, 'D', 22, 8),
    label(H, 'H', 16, 26), label(E, 'E', 0, 34),
  ], OPT)
}

// ── HHC002397_lg — hình vuông ABCD; E, F, K trung điểm AB, BC, CD; M = DF ∩ CE; N = AK ∩ DF.  Nét thêm: AK, EC, DF, MK (đứt).
//    Gạch: AE = EB, BF = FC, DK = KC (mỗi cặp 1 gạch).  Vuông: 4 đỉnh.
{
  const S = 300
  const A = P(0, 0), B = P(S, 0), C = P(S, S), D = P(0, S)
  const E = mid(A, B), F = mid(B, C), K = mid(C, D)
  const M = inter(D, F, C, E), N = inter(A, K, D, F)
  gt(goc(M, D, C), 90, 'DF ⊥ CE (hệ quả)')
  gt(dist(N, D), dist(N, M), 'ND = NM (hệ quả)')
  hinh('HHC002397_lg', [A, B, C, D, E, F, K, M, N], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, K), seg(E, C), seg(D, F), segDash(M, K),
    tick(A, E), tick(E, B), tick(B, F), tick(F, C), tick(D, K), tick(K, C),
    rightAngle(A, B, D, 14), rightAngle(B, A, C, 14), rightAngle(C, B, D, 14), rightAngle(D, A, C, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(K), dot(M), dot(N),
    label(A, 'A', -18, -6), label(E, 'E', 0, -14), label(B, 'B', 18, -6), label(F, 'F', 20, 8),
    label(C, 'C', 20, 26), label(K, 'K', 0, 36), label(D, 'D', -18, 26), label(M, 'M', 28, 10), label(N, 'N', -18, -6),
  ], OPT)
}

// ── HHC002400_lg — hai đoạn bằng nhau AC, BD cắt nhau tại trung điểm O ⇒ hình chữ nhật; ví dụ lời giải ý b: AB = 4 cm, AD = 3 cm.
//    Gạch: OA = OB = OC = OD (1 gạch). Không ô vuông (hình chữ nhật là điều ý a hỏi).
{
  const A = P(0, 0), B = P(320, 0), D = P(0, 240), C = P(320, 240)
  const O = inter(A, C, B, D)
  gt(dist(O, A), dist(O, C), 'O trung điểm AC'); gt(dist(O, B), dist(O, D), 'O trung điểm BD'); gt(dist(A, C), dist(B, D), 'AC = BD')
  hinh('HHC002400_lg', [A, B, C, D, O], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    tick(A, O), tick(O, C), tick(B, O), tick(O, D),
    dot(A), dot(B), dot(C), dot(D), dot(O),
    sideText(A, B, '4 cm', O, 20), sideText(A, D, '3 cm', O, 30),
    label(A, 'A', -18, -8), label(B, 'B', 18, -8), label(C, 'C', 18, 26), label(D, 'D', -18, 26), label(O, 'O', 0, 32),
  ], { pad: 56, padDuoi: 38 })
}

await xuatTat(RA)
