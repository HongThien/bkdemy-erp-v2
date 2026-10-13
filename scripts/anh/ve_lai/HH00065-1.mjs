// Vẽ lại hình — gói HH00065-1 (Định lý trung tuyến ứng với cạnh huyền và ứng dụng, Hình 8).
//   node scripts/anh/ve_lai/HH00065-1.mjs [<thu_muc_ra>]
// Mọi câu: tam giác ABC vuông tại A (A góc dưới-trái, B phía trên A, C bên phải), AH ⊥ BC.
// Ảnh cũ: hình đề và hình lời giải của mỗi câu GIỐNG HỆT nhau ⇒ mỗi câu dựng một lần (chung toạ độ), xuất cả _de và _lg.
import { P, seg, rightAngle, tick, dot, label, hinh, xuatTat,
  mid, foot, inter, add, vec, rot, goc, dist } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00065-1/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.01, m)

/** Hai tên tệp cùng một hình (hình đề = hình lời giải trong ảnh cũ) */
const xuat = (ma, pts, body, opt) => { for (const s of ['_de', '_lg']) hinh(ma + s, pts, body, opt) }

// ── HH00065001 — AB < AC, AH ⊥ BC, E ∈ AC với AE = AB, EI ⊥ AH (I ∈ AH), EK ⊥ BC (K ∈ BC), M = trung điểm BE.
//    Nét: AB, BC, AC, AH, BE, EI, EK, AM, MK, HM. Gạch bằng nhau: BM = ME. Vuông: A, H, I, K.
{
  const A = P(0, 0), B = P(0, -230), C = P(370, 0)
  const H = foot(A, B, C)
  const E = P(dist(A, B), 0)                    // AE = AB
  const I = foot(E, A, H), K = foot(E, B, C)
  const M = mid(B, E)
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  gt(goc(A, B, C), 90, 'góc A vuông')
  gt(goc(H, A, C), 90, 'AH ⊥ BC')
  gt(dist(A, E), dist(A, B), 'AE = AB')
  gt(goc(I, E, A), 90, 'EI ⊥ AH')
  gt(goc(K, E, C), 90, 'EK ⊥ BC')
  gt(dist(B, M), dist(M, E), 'M trung điểm BE')
  // hệ quả đề đòi chứng minh (tự kiểm hình đúng): AM = KM, HM phân giác AHC
  gt(dist(A, M), dist(K, M), 'AM = KM (hệ quả)')
  gt(goc(H, A, M), goc(H, M, C), 'HM phân giác góc AHC (hệ quả)')
  xuat('HH00065001', [A, B, C, H, E, I, K, M], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, H), seg(B, E), seg(E, I), seg(E, K), seg(A, M), seg(M, K), seg(H, M),
    tick(B, M, 1, 0.5), tick(M, E, 1, 0.5),
    rightAngle(A, B, C, 14), rightAngle(H, A, C, 14), rightAngle(I, H, E, 14), rightAngle(K, E, C, 14),
    dot(A), dot(B), dot(C), dot(H), dot(E), dot(I), dot(K), dot(M),
    label(A, 'A', -20, 10), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(H, 'H', 6, -14),
    label(E, 'E', 0, 32), label(I, 'I', -16, 6), label(K, 'K', 10, -12), label(M, 'M', 18, -8),
  ])
}

// ── HH00065002 — AH ⊥ BC, HD ⊥ AB, HE ⊥ AC, M = trung điểm BC; O = AH ∩ DE, I = AM ∩ DE.
//    Nét: AB, BC, AC, DH, HE, AH, DE, AM. Vuông: A, D, H (AHC), E.
{
  const A = P(0, 0), B = P(0, -240), C = P(360, 0)
  const H = foot(A, B, C)
  const D = foot(H, A, B), E = foot(H, A, C)
  const M = mid(B, C)
  const O = inter(A, H, D, E), I = inter(A, M, D, E)
  gt(goc(D, A, H), 90, 'HD ⊥ AB'); gt(goc(E, A, H), 90, 'HE ⊥ AC')
  gt(dist(B, M), dist(M, C), 'M trung điểm BC')
  // AM ⊥ DE (hệ quả đề đòi chứng minh)
  gt(goc(I, A, E), 90, 'AM ⊥ DE (hệ quả)')
  xuat('HH00065002', [A, B, C, H, D, E, M, O, I], [
    seg(A, B), seg(B, C), seg(A, C), seg(D, H), seg(H, E), seg(A, H), seg(D, E), seg(A, M),
    rightAngle(A, B, C, 14), rightAngle(D, B, H, 14), rightAngle(H, A, C, 14), rightAngle(E, H, C, 14),
    dot(A), dot(B), dot(C), dot(H), dot(D), dot(E), dot(M), dot(O), dot(I),
    label(A, 'A', -20, 10), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(H, 'H', 6, -14),
    label(D, 'D', -20, 6), label(E, 'E', 0, 32), label(M, 'M', 6, -14), label(O, 'O', -16, 6), label(I, 'I', 18, 14),
  ])
}

// ── HH00065003 — như 002 nhưng KHÔNG cho M là trung điểm: M ∈ BC với AM ⊥ DE (I = AM ∩ DE); M trung điểm BC là điều phải chứng minh.
//    Nét: AB, BC, AC, DH, HE, AH, DE, AM. Vuông: D, H (AHC), E, I (AIE).
{
  const A = P(0, 0), B = P(0, -240), C = P(360, 0)
  const H = foot(A, B, C)
  const D = foot(H, A, B), E = foot(H, A, C)
  const hdDE = vec(D, E)
  const M = inter(A, add(A, rot(hdDE, P(0, 0), 90)), B, C)   // AM ⊥ DE, M ∈ BC
  const O = inter(A, H, D, E), I = inter(A, M, D, E)
  gt(goc(I, A, E), 90, 'AM ⊥ DE')
  gt(dist(B, M), dist(M, C), 'M trung điểm BC (hệ quả đề đòi chứng minh)')
  xuat('HH00065003', [A, B, C, H, D, E, M, O, I], [
    seg(A, B), seg(B, C), seg(A, C), seg(D, H), seg(H, E), seg(A, H), seg(D, E), seg(A, M),
    rightAngle(D, B, H, 14), rightAngle(H, A, C, 14), rightAngle(E, H, C, 14), rightAngle(I, A, E, 14),
    dot(A), dot(B), dot(C), dot(H), dot(D), dot(E), dot(M), dot(O), dot(I),
    label(A, 'A', -20, 10), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(H, 'H', 6, -14),
    label(D, 'D', -20, 6), label(E, 'E', 0, 32), label(M, 'M', 6, -14), label(O, 'O', -16, 6), label(I, 'I', 18, 14),
  ])
}

// ── HH00065004 — AH ⊥ BC, HD ⊥ AB, HE ⊥ AC; qua A kẻ đường ∥ DE cắt đường qua C ∥ AH tại M; CM cắt AB tại I.
//    Nét: B–A–I (thẳng), BC, AC, DH, HE, AH, DE, AM, C–M–I. Vuông: A (DAE), D, E.
{
  const A = P(0, 0), B = P(0, -190), C = P(150, 0)
  const H = foot(A, B, C)
  const D = foot(H, A, B), E = foot(H, A, C)
  const M = inter(A, add(A, vec(D, E)), C, add(C, vec(A, H)))   // AM ∥ DE ; CM ∥ AH
  const I = inter(C, M, A, B)
  gt(goc(A, D, E), 90, 'góc A vuông')
  gt(dist(C, M), dist(M, I), 'M trung điểm CI (hệ quả đề đòi chứng minh)')
  gt(Math.abs((M.x - A.x) * (E.y - D.y) - (M.y - A.y) * (E.x - D.x)), 0, 'AM ∥ DE')
  xuat('HH00065004', [A, B, C, H, D, E, M, I], [
    seg(B, I), seg(B, C), seg(A, C), seg(D, H), seg(H, E), seg(A, H), seg(D, E), seg(A, M), seg(C, I),
    rightAngle(A, D, E, 14), rightAngle(D, B, H, 14), rightAngle(E, H, C, 14),
    dot(A), dot(B), dot(C), dot(H), dot(D), dot(E), dot(M), dot(I),
    label(A, 'A', -20, 10), label(B, 'B', 0, -14), label(C, 'C', 22, 0), label(H, 'H', 18, -8),
    label(D, 'D', -20, 8), label(E, 'E', -4, 32), label(M, 'M', 22, 20), label(I, 'I', 20, 14),
  ], { pad: 32, padDuoi: 38 })
}

await xuatTat(RA)
