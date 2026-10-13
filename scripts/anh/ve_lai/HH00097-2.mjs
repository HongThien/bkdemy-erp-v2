// Vẽ lại hình — gói HH00097-2 (Cụng đầu, Hình 7). Vẽ 2/3 hình: HHC000833 KHÔNG vẽ (xem ghi chú cuối tệp).
//   node scripts/anh/ve_lai/HH00097-2.mjs [<thu_muc_ra>]
import { P, seg, dot, label, rightAngle, hinh, xuatTat, mid, doiXung, foot, goc, dist } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00097-2/moi'
const ok = (c, m) => console.assert(c, m)
const KHUNG = { pad: 36, padDuoi: 44 }

// HHC000836 — △ABC, M = trung điểm BC, D ∈ tia đối của MA, MD = MA; AH ⊥ BC, DK ⊥ BC (H, K ∈ BC).
// Nét: AB, AC, BC, A–M–D, AH, DK, DC (DC có trên ảnh cũ). Ô vuông ở H, K vì đề cho AH ⊥ BC, DK ⊥ BC.
{
  const B = P(0, 0), C = P(237, 0), A = P(79, -157)
  const M = mid(B, C), D = doiXung(A, M), H = foot(A, B, C), K = foot(D, B, C)
  ok(Math.abs(dist(A, M) - dist(M, D)) < 0.01, 'AM = MD'); ok(Math.abs(goc(M, A, D) - 180) < 0.1, 'A, M, D thẳng hàng')
  ok(Math.abs(goc(H, A, C) - 90) < 0.01 && Math.abs(goc(K, D, B) - 90) < 0.01, 'AH ⊥ BC, DK ⊥ BC')
  ok(H.x < M.x && M.x < K.x, 'thứ tự B, H, M, K, C như ảnh cũ')
  hinh('HHC000836', [A, B, C, D, H, K], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(A, H), seg(D, K), seg(D, C),
    rightAngle(H, A, C, 12), rightAngle(K, D, B, 12),
    dot(A), dot(B), dot(C), dot(D), dot(H), dot(M), dot(K),
    label(A, 'A', 0, -16), label(B, 'B', -20, 8), label(C, 'C', 20, 8), label(D, 'D', 22, 16),
    label(H, 'H', -16, 28), label(M, 'M', 16, -10), label(K, 'K', 16, 26)], KHUNG)
}

// HHC000837 — △ABC, M = trung điểm BC, D ∈ tia đối của MA, MD = MA; I = trung điểm AC, E đối xứng B qua I (I là trung điểm BE).
// Nét: AB, AC, BC, A–M–D, B–I–E, AE, CD, CE (đều có trên ảnh cũ; CD, CE cần cho △DCM, △CEI trong lời giải). Bỏ AH, DK, H, K (đề này không nhắc).
{
  const B = P(0, 0), C = P(233, 0), A = P(79, -155)
  const M = mid(B, C), D = doiXung(A, M), I = mid(A, C), E = doiXung(B, I)
  ok(Math.abs(dist(A, M) - dist(M, D)) < 0.01, 'AM = MD'); ok(Math.abs(dist(B, I) - dist(I, E)) < 0.01, 'IB = IE')
  ok(Math.abs(goc(C, E, D) - 180) < 0.1, 'E, C, D thẳng hàng (hệ quả của dựng đúng)')
  hinh('HHC000837', [A, B, C, D, E], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(B, E), seg(A, E), seg(C, D), seg(C, E),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(M), dot(I),
    label(A, 'A', 0, -16), label(B, 'B', -20, 8), label(C, 'C', 22, 16), label(D, 'D', 22, 16), label(E, 'E', 18, -8),
    label(M, 'M', 16, -10), label(I, 'I', -2, -16)], KHUNG)
}

// HHC000833 — KHÔNG VẼ. Ảnh cũ là hình của bài khác (M là trung điểm AC, D trên tia đối của MB, có thêm K, N); đề kho nói M là trung điểm BC,
// D trên tia đối của MA. Với đề kho thì DE = BF SAI: B(0,0) C(4,0) A(1,3) ⇒ M(2,0), D(3,−3), F(1,0), E(2,2;−0,6): BF = 1, DE ≈ 2,53.
{
  const B = P(0, 0), C = P(4, 0), A = P(1, 3), M = mid(B, C), D = doiXung(A, M), F = foot(A, B, C)
  const E = foot(C, A, D)
  console.log(`833 (đề kho): BF = ${dist(B, F).toFixed(2)}, DE = ${dist(D, E).toFixed(2)} — không bằng nhau ⇒ không vẽ`)
}

await xuatTat(RA)
