// ve_hinh_hh00103055.mjs — hình đề cho câu HH00103055 (kho Hình học 7, bài HH00103 "Các trường hợp bằng nhau của tam giác vuông").
//   node scripts/anh/ve_hinh_hh00103055.mjs <thu_muc_ra>
// Đề: Cho △ABC vuông ở A. BD là phân giác góc B (D ∈ AC). Kẻ DE ⊥ BC (E ∈ BC). AE cắt BD tại I.
// Hướng (CEO 23/10): vuông tại A ⇒ A góc dưới trái, AB thẳng đứng, AC nằm ngang.
// Đánh dấu CHỈ giả thiết: góc vuông tại A và tại E, hai góc ∠ABD = ∠DBE (phân giác). KHÔNG đánh dấu AI = IE, hai tam giác bằng nhau (điều phải chứng minh).
import { P, seg, angleMark, rightAngle, dot, label, hinh, xuatTat, dist, foot, inter } from './ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_hinh_hh00103055.mjs <thu_muc_ra>'); process.exit(2) }

const A = P(0, 300), B = P(0, 50), C = P(340, 300)         // AB = 250 (đứng), AC = 340 (ngang)
const BC = dist(B, C)
const D = P((340 * 250) / (250 + BC), 300)                  // BD phân giác: AD/DC = AB/BC
const E = foot(D, B, C)                                      // DE ⊥ BC
const I = inter(B, D, A, E)                                  // AE ∩ BD

// kiểm dữ kiện bằng số (sai ⇒ dừng, không xuất hình)
const goc = (v, p, q) => { const a = [p.x - v.x, p.y - v.y], b = [q.x - v.x, q.y - v.y]; return Math.acos((a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b))) * 180 / Math.PI }
const dk = [
  ['∠BAC = 90°', Math.abs(goc(A, B, C) - 90) < 1e-6],
  ['∠ABD = ∠DBE', Math.abs(goc(B, A, D) - goc(B, D, E)) < 1e-6],
  ['DE ⊥ BC', Math.abs(goc(E, D, B) - 90) < 1e-6],
  ['D nằm giữa A, C', D.x > A.x && D.x < C.x],
  ['E nằm giữa B, C', E.x > B.x && E.x < C.x],
  ['I nằm trong đoạn AE', I.x > Math.min(A.x, E.x) && I.x < Math.max(A.x, E.x)],
  ['IA = IE (kiểm, KHÔNG vẽ ký hiệu)', Math.abs(dist(I, A) - dist(I, E)) < 1e-6],
]
for (const [t, ok] of dk) { console.log(ok ? '✔' : '✗', t); if (!ok) process.exit(1) }

hinh('HH00103055', [A, B, C, D, E, I], [
  seg(A, B), seg(A, C), seg(B, C), seg(B, D), seg(D, E), seg(A, E),
  rightAngle(A, B, C, 16), rightAngle(E, D, B, 14),
  angleMark(B, A, D, 46), angleMark(B, D, E, 62),
  [A, B, C, D, E, I].map(dot).join(''),
  label(A, 'A', -20, 6), label(B, 'B', 0, -16), label(C, 'C', 22, 8),
  label(D, 'D', -2, 32), label(E, 'E', 22, -2), label(I, 'I', -18, -10),
])
await xuatTat(dir)
