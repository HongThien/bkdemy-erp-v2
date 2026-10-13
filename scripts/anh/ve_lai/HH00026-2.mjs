// Vẽ lại hình — gói HH00026-2 (Phân giác trong tam giác — hai hình, Hình 7).
//   node scripts/anh/ve_lai/HH00026-2.mjs [<thu_muc_ra>]
// Cả hai ảnh cũ là hình GeoGebra của bài khác phần đầu đề (đề kho ghi thừa mấy câu mở đầu về tam giác vuông ABC) — vẽ theo phần đề thật.
import { P, seg, dot, label, hinh, xuatTat, lerp, inter, bisector, goc, dist } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00026-2/moi'
const ok = (c, m) => console.assert(c, m)
const KHUNG = { pad: 36, padDuoi: 44 }

// HHC000784 — △MAB nhọn, MA < MB; C ∈ MB, MC = MA; phân giác góc M cắt AB tại E; F = MA ∩ CE (F nằm trên tia MA, quá A).
// Nét: M–A–F, M–C–B, A–E–B, M–E, F–E–C. (Ảnh cũ còn đoạn FB, điểm H, đoạn EH — đề không nhắc tới ⇒ không vẽ.)
{
  const M = P(146, 36), A = P(71, 263), B = P(374, 263)
  const C = lerp(M, B, dist(M, A) / dist(M, B))
  const E = inter(M, bisector(M, A, B, 100), A, B)
  const F = inter(C, E, M, A)
  ok(dist(M, A) < dist(M, B), 'MA < MB'); ok(Math.abs(dist(M, C) - dist(M, A)) < 0.01, 'MC = MA')
  ok(Math.abs(goc(M, A, E) - goc(M, B, E)) < 0.01, 'ME phân giác AMB')
  ok(goc(M, A, B) < 90 && goc(A, M, B) < 90 && goc(B, M, A) < 90, 'tam giác MAB nhọn')
  ok(F.y > A.y && Math.abs(goc(A, M, F) - 180) < 0.1, 'F nằm trên tia MA, quá A')
  hinh('HHC000784', [M, A, B, C, E, F], [
    seg(M, F), seg(M, B), seg(A, B), seg(M, E), seg(F, C),
    dot(M), dot(A), dot(B), dot(C), dot(E), dot(F),
    label(M, 'M', 0, -16), label(A, 'A', -20, 8), label(B, 'B', 20, 8), label(C, 'C', 18, -10), label(E, 'E', 16, 28), label(F, 'F', -18, 12)], KHUNG)
}

// HHC000787 — △ABC, AB < AC; AI = phân giác góc A (I ∈ BC); K ∈ AC, AK = AB. Nét: AB, BC, CA, AI, IK (cạnh của △AKI trong đề).
// (Ảnh cũ còn BK, giao O, điểm E trên tia AB, đoạn EC — đề không nhắc tới ⇒ không vẽ.)
{
  const A = P(187, 51), B = P(68, 291), C = P(428, 291)
  const I = inter(A, bisector(A, B, C, 100), B, C)
  const K = lerp(A, C, dist(A, B) / dist(A, C))
  ok(dist(A, B) < dist(A, C), 'AB < AC'); ok(Math.abs(dist(A, K) - dist(A, B)) < 0.01, 'AK = AB')
  ok(Math.abs(goc(A, B, I) - goc(A, K, I)) < 0.01, 'AI phân giác (BAI = KAI)')
  hinh('HHC000787', [A, B, C, I, K], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, I), seg(I, K),
    dot(A), dot(B), dot(C), dot(I), dot(K),
    label(A, 'A', 0, -16), label(B, 'B', -20, 8), label(C, 'C', 20, 8), label(I, 'I', 4, 30), label(K, 'K', 18, -8)], KHUNG)
}

await xuatTat(RA)
