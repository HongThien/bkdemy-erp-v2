// Vẽ lại hình — gói TH-6 (câu hình học Toán 7 trong đề thi/đề cương, kho chưa có hình). Chạy:
//   node scripts/anh/ve_lai/TH-6.mjs [<thu_muc_ra>]
// Không vẽ: HHC002917 · 002921 · 002925 (quy ước đỉnh tương ứng — hình lộ đáp án) · 002924 (tiên đề) · 002926 (định nghĩa).
import {
  P, seg, tick, angleMark, rightAngle, ray, dot, label, num, angleText, hinh, xuatTat,
  lerp, mid, foot, inter, bisector, goc, dist, labelOut, trongTam, rot,
} from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/TH-6/moi'

// HHC002915 — tam giác ABC cân tại A, góc C = 30° (đề cho)
{
  const B = P(0, 0), C = P(330, 0), A = P(165, -165 * Math.tan(30 * Math.PI / 180))
  console.assert(Math.abs(goc(C, B, A) - 30) < 0.01 && Math.abs(dist(A, B) - dist(A, C)) < 0.01)
  const g = trongTam([A, B, C])
  hinh('HHC002915', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A), tick(A, B, 1), tick(A, C, 1),
    angleMark(C, B, A, 46), angleText(C, B, A, '30°', 92),
    dot(A), dot(B), dot(C),
    label(A, 'A', 0, -14), label(B, 'B', -16, 10), label(C, 'C', 16, 10),
  ])
}

// HHC002916 — ABC vuông tại A, D∈BC (BD=AB), BE phân giác góc B (E∈AC), H trung điểm AD
{
  const A = P(0, 0), B = P(0, -210), C = P(320, 0)
  const D = lerp(B, C, 210 / dist(B, C))
  const E = inter(B, bisector(B, A, C), A, C)
  const H = mid(A, D)
  console.assert(Math.abs(dist(B, D) - dist(A, B)) < 0.01 && Math.abs(goc(B, A, E) - goc(B, E, D)) < 0.01)
  hinh('HHC002916', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A), seg(B, E), seg(D, E), seg(A, D),
    rightAngle(A, B, C, 16), tick(A, B, 1), tick(B, D, 1),
    angleMark(B, A, E, 46), angleMark(B, E, D, 56),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(H),
    label(A, 'A', -16, 8), label(B, 'B', -4, -14), label(C, 'C', 18, 10),
    label(D, 'D', 20, -6), label(E, 'E', -6, 34), label(H, 'H', 22, 14),
  ])
}

// HHC002920 — ΔABC có góc A = 90°
{
  const A = P(0, 0), B = P(0, -190), C = P(270, 0)
  hinh('HHC002920', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A), rightAngle(A, B, C, 16),
    dot(A), dot(B), dot(C),
    label(A, 'A', -16, 8), label(B, 'B', 0, -14), label(C, 'C', 16, 10),
  ])
}

// Hình chung cho 002919 và 002922 (cùng một cấu hình, khác tên điểm):
//   tam giác vuông tại A; phân giác góc B cắt AC tại X; Y∈BC với BY = BA (⇔ XY ⊥ BC);
//   Z = giao tia YX với tia BA (nằm ngoài, dưới A); K chân đường vuông góc hạ từ A xuống XZ;
//   H chân đường vuông góc hạ từ Y xuống AC; N = giao AK và YH.
function cauHinh() {
  const A = P(0, 0), B = P(0, -150), C = P(230, 0)
  const Y = lerp(B, C, dist(A, B) / dist(B, C))
  const X = inter(B, bisector(B, A, C), A, C)
  const Z = inter(Y, X, A, B)
  const K = foot(A, X, Z)
  const Hh = foot(Y, A, C)
  const N = inter(A, K, Y, Hh)
  console.assert(Math.abs(goc(Y, B, X) - 90) < 0.01 && Math.abs(goc(X, A, K) - goc(X, Hh, Y)) < 5)
  return { A, B, C, X, Y, Z, K, Hh, N }
}

// HHC002919 — M∈AC phân giác BM; D∈BC, MD⊥BC; E = DM ∩ BA; AK⊥ME, DH⊥MC; N = AK ∩ DH
{
  const { A, B, C, X: M, Y: D, Z: E, K, Hh: H, N } = cauHinh()
  console.log('N', N, 'K', K, 'H', H)
  hinh('HHC002919', [A, B, C, E, N], [
    seg(A, B), seg(B, C), seg(C, A), seg(B, M), seg(E, D), seg(B, E),
    seg(A, N), seg(D, N),
    rightAngle(A, B, C, 16), rightAngle(D, M, B, 14), rightAngle(K, A, M, 12), rightAngle(H, D, A, 12),
    angleMark(B, A, M, 46), angleMark(B, M, D, 56),
    dot(A), dot(B), dot(C), dot(M), dot(D), dot(E), dot(K), dot(H), dot(N),
    label(A, 'A', -16, 4), label(B, 'B', -4, -14), label(C, 'C', 18, 10), label(M, 'M', 20, 28),
    label(D, 'D', 20, -6), label(E, 'E', -16, 10), label(K, 'K', 0, 32), label(H, 'H', 20, 28), label(N, 'N', 22, 8),
  ])
}

// HHC002922 — D∈AC phân giác BD; E∈BC, BA=BE; M = BA ∩ ED; EH⊥DC, AK⊥DM; N = AK ∩ EH
{
  const { A, B, C, X: D, Y: E, Z: M, K, Hh: H, N } = cauHinh()
  hinh('HHC002922', [A, B, C, M, N], [
    seg(A, B), seg(B, C), seg(C, A), seg(B, D), seg(M, E), seg(B, M),
    seg(A, N), seg(E, N),
    rightAngle(A, B, C, 16), rightAngle(H, E, A, 12), rightAngle(K, A, D, 12),
    tick(A, B, 1), tick(B, E, 1),
    angleMark(B, A, D, 46), angleMark(B, D, E, 56),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(M), dot(K), dot(H), dot(N),
    label(A, 'A', -16, 4), label(B, 'B', -4, -14), label(C, 'C', 18, 10), label(D, 'D', 20, 28),
    label(E, 'E', 20, -6), label(M, 'M', -16, 10), label(K, 'K', 0, 32), label(H, 'H', 20, 28), label(N, 'N', 22, 8),
  ])
}

await xuatTat(RA)
