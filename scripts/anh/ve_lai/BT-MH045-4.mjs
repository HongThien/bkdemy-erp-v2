// Vẽ lại hình — gói BT-MH045-4 (MH.045 Hai đường thẳng song song, Hình 7 · Luyện · bài toán).
//   node scripts/anh/ve_lai/BT-MH045-4.mjs [<thu_muc_ra>]
import { P, seg, angleMark, ray, goc, dot, label, angleText, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH045-4/moi'

// ───── Hình chung của BT.07.045.26 / .27 / .28 (cùng một ảnh cũ) ─────
// a ∥ b; c cắt a tại A, b tại C (ACD = 80°); d cắt a tại B, b tại D (EBD = BDC = 50°); AF ∥ BD (F ∈ b).
// Ảnh cũ có sẵn AF, F (điểm của bài 28) nên giữ cho cả ba bài.
function hinhChung(ten) {
  const S = 120, t50 = Math.tan(50 * Math.PI / 180), t80 = Math.tan(80 * Math.PI / 180)
  const A = P(0, 0), C = P(-S / t80, S)
  const B = P(185, 0), D = P(185 + S / t50, S)
  const E = P(275, 0), F = P(S / t50, S)
  const a0 = P(-80, 0), a1 = P(330, 0), b0 = P(-80, S), b1 = P(330, S)
  const cT = ray(A, 80, 80), cB = ray(C, 260, 40)
  const dT = ray(B, 130, 80), dB = ray(D, -50, 46)
  const fB = ray(F, -50, 47)
  console.assert(Math.abs(goc(C, A, P(C.x + 50, S)) - 80) < 0.01, ten + ' ACD')
  console.assert(Math.abs(goc(B, E, D) - 50) < 0.01, ten + ' EBD')
  console.assert(Math.abs(goc(D, B, P(D.x - 50, S)) - 50) < 0.01, ten + ' BDC')
  console.assert(Math.abs(goc(A, B, C) - 100) < 0.01 && Math.abs(goc(A, F, C) - 50) < 0.01, ten + ' BAC/FAC')
  const rC = P(C.x + 60, S), rB = P(B.x + 60, 0), lD = P(D.x - 60, S)
  hinh(ten, [a0, a1, b0, b1, cT, cB, dT, dB, fB], [
    seg(a0, a1), seg(b0, b1), seg(cB, cT), seg(dT, dB), seg(A, fB),
    angleMark(C, A, rC, 32), angleMark(B, rB, D, 32), angleMark(D, lD, B, 32),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
    angleText(C, A, rC, '80°', 66),
    angleText(B, rB, D, '50°', 66),
    angleText(D, lD, B, '50°', 66),
    label(a0, 'a', 0, -12), label(b0, 'b', 0, -12), label(cT, 'c', -20, 4),
    label(dT, 'd', 18, 6),
    label(A, 'A', 18, -12), label(B, 'B', 4, -14), label(E, 'E', 0, -14),
    label(C, 'C', -18, -10), label(D, 'D', 16, -12), label(F, 'F', -14, 30),
  ])
}

hinhChung('BT.07.045.27')
hinhChung('BT.07.045.28')

await xuatTat(RA)
