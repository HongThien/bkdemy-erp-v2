// Vẽ lại hình — gói HH00096-2 (Tam giác cân, Hình 7).
//   node scripts/anh/ve_lai/HH00096-2.mjs [<thu_muc_ra>]
// Tam giác ABC cân tại A (AB = AC, dựng đối xứng qua trục đứng). M (hay D) = trung điểm BC = chân phân giác góc A.
// E = chân đường vuông góc hạ từ M (D) xuống AB, F = chân đường vuông góc hạ xuống AC (⇒ AE = AF); K (I) = EF ∩ AM.
import { P, seg, rightAngle, dot, label, hinh, xuatTat, mid, foot, inter, goc, dist, doiXung } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00096-2/moi'
const ok = (c, m) => console.assert(c, m)

/** Tam giác cân tại A: A ở đỉnh (0,0), B, C ở đáy cách A chiều cao h, nửa đáy hb */
function dung(h, hb) {
  const A = P(0, 0), B = P(-hb, h), C = P(hb, h)
  const M = mid(B, C)
  const E = foot(M, A, B), F = foot(M, A, C)
  const K = inter(E, F, A, M)
  ok(Math.abs(dist(A, B) - dist(A, C)) < 0.01, 'AB = AC')
  ok(Math.abs(goc(A, B, M) - goc(A, C, M)) < 0.01, 'AM phân giác góc A')
  ok(Math.abs(goc(E, A, M) - 90) < 0.01 && Math.abs(goc(F, A, M) - 90) < 0.01, 'ME ⊥ AB, MF ⊥ AC')
  ok(Math.abs(dist(A, E) - dist(A, F)) < 0.01, 'AE = AF')
  ok(Math.abs(goc(K, A, E) - 90) < 0.01, 'AK ⊥ EF')
  ok(Math.abs(dist(K, E) - dist(K, F)) < 0.01, 'K = trung điểm EF')
  return { A, B, C, M, E, F, K }
}

// ── HHC000803 — nét: AB, AC, BC, AM, EF, ME, MF. K = AM ∩ EF.
{
  const { A, B, C, M, E, F, K } = dung(300, 150)
  hinh('HHC000803', [A, B, C, M, E, F, K], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, M), seg(E, F), seg(M, E), seg(M, F),
    dot(A), dot(B), dot(C), dot(M), dot(E), dot(F), dot(K),
    label(A, 'A', 0, -14), label(B, 'B', -20, 8), label(C, 'C', 22, 8), label(M, 'M', 0, 32),
    label(E, 'E', -20, -6), label(F, 'F', 20, -6), label(K, 'K', 16, -8),
  ], { pad: 42, padDuoi: 46 })
}

// ── HHC000805 — thêm D ∈ tia BA, DC ∥ AM (⇒ D = đối xứng của B qua A). Nét: B–A–D, AC, BC, AM, EF, ME, MF, DC.
{
  const { A, B, C, M, E, F, K } = dung(155, 120)
  const D = doiXung(B, A)
  ok(Math.abs(D.x - C.x) < 0.01, 'DC ∥ AM (cùng phương đứng)')
  ok(Math.abs(goc(A, B, D) - 180) < 0.01, 'D thuộc tia BA, ngoài đoạn BA')
  hinh('HHC000805', [A, B, C, M, E, F, K, D], [
    seg(B, D), seg(A, C), seg(B, C), seg(A, M), seg(E, F), seg(M, E), seg(M, F), seg(D, C),
    dot(A), dot(B), dot(C), dot(M), dot(E), dot(F), dot(K), dot(D),
    label(A, 'A', -22, -2), label(B, 'B', -20, 8), label(C, 'C', 22, 8), label(M, 'M', 0, 32),
    label(E, 'E', -20, -6), label(F, 'F', 18, -8), label(K, 'K', 16, -8), label(D, 'D', 18, -6),
  ], { pad: 40, padDuoi: 44 })
}

// ── HHC000817 — AD phân giác góc A, D ∈ BC. Nét: AB, AC, BC, AD.
{
  const { A, B, C, M: D } = dung(300, 150)
  hinh('HHC000817', [A, B, C, D], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', 0, -14), label(B, 'B', -20, 8), label(C, 'C', 22, 8), label(D, 'D', 0, 32),
  ], { pad: 42, padDuoi: 46 })
}

// ── HHC000818 — DE ⊥ AB, DF ⊥ AC (có ký hiệu góc vuông tại E, F). Nét: AB, AC, BC, AD, DE, DF.
{
  const { A, B, C, M: D, E, F } = dung(300, 150)
  hinh('HHC000818', [A, B, C, D, E, F], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(D, E), seg(D, F),
    rightAngle(E, A, D, 12), rightAngle(F, A, D, 12),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
    label(A, 'A', 0, -14), label(B, 'B', -20, 8), label(C, 'C', 22, 8), label(D, 'D', 0, 32),
    label(E, 'E', -20, -6), label(F, 'F', 20, -6),
  ], { pad: 42, padDuoi: 46 })
}

// ── HHC000819 — I = trung điểm EF; ảnh cũ vẽ cả AD và EF (A, I, D thẳng hàng là điều phải chứng minh, không đánh dấu).
{
  const { A, B, C, M: D, E, F, K: I } = dung(300, 150)
  hinh('HHC000819', [A, B, C, D, E, F, I], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(E, F), seg(D, E), seg(D, F),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(I),
    label(A, 'A', 0, -14), label(B, 'B', -20, 8), label(C, 'C', 22, 8), label(D, 'D', 0, 32),
    label(E, 'E', -20, -6), label(F, 'F', 20, -6), label(I, 'I', 16, -8),
  ], { pad: 42, padDuoi: 46 })
}

await xuatTat(RA)
