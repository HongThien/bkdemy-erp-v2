// Vẽ lại hình — gói HH00098-1 (Ứng dụng tiên đề Ơ-clit, Hình học 7)
//   node scripts/anh/ve_lai/HH00098-1.mjs [<thu_muc_ra>]
import { P, seg, mid, doiXung, dist, dot, label, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00098-1/moi'

// HHC000838+839+840 — tam giác ABC; D, E trung điểm AC, AB; M đối xứng B qua D (DM = DB); N đối xứng C qua E (EN = EC)
{
  const s = 0.575
  const B = P(0, 0), C = P(374 * s, 0), A = P(125 * s, -313 * s)
  const D = mid(A, C), E = mid(A, B), M = doiXung(B, D), N = doiXung(C, E)
  console.assert(Math.abs(dist(D, M) - dist(D, B)) < 1e-6 && Math.abs(dist(E, N) - dist(E, C)) < 1e-6)
  hinh('HHC000838+HHC000839+HHC000840', [A, B, C, D, E, M, N], [
    seg(N, M), seg(A, B), seg(A, C), seg(B, C), seg(B, M), seg(C, N),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(M), dot(N),
    label(A, 'A', 0, -14), label(B, 'B', -14, 28), label(C, 'C', 14, 28), label(D, 'D', 28, 12), label(E, 'E', -14, -16),
    label(M, 'M', 6, -14), label(N, 'N', -6, -14)], { pad: 40, padDuoi: 52 })
}

await xuatTat(RA)
