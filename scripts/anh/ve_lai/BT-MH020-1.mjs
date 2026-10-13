// Vẽ lại hình — gói BT-MH020-1 (MH.020 Tứ giác · Hình 8 · bài toán BT.08.020.01)
//   node scripts/anh/ve_lai/BT-MH020-1.mjs [<thu_muc_ra>]
import { P, seg, angleMark, ray, inter, goc, dot, angleText, labelOut, trongTam, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH020-1/moi'

// BT.08.020.01 — tứ giác ABCD: A = 100°, B = 75°, C = 120°, D = ? (= 65°, không ghi lên hình)
{
  const C = P(0, 0), D = P(300, 0)
  const B = ray(C, 120, 195)                                  // góc C = 120° (giữa CD và CB)
  const A = inter(B, ray(B, 15, 100), D, ray(D, 115, 100))     // góc B = 75° (BC hướng 300°, BA hướng 15°), góc D = 65° (DC hướng 180°, DA hướng 115°)
  console.assert(Math.abs(goc(C, B, D) - 120) < 0.5 && Math.abs(goc(B, A, C) - 75) < 0.5)
  console.assert(Math.abs(goc(A, B, D) - 100) < 0.5 && Math.abs(goc(D, A, C) - 65) < 0.5)
  const g = trongTam([A, B, C, D])
  hinh('BT.08.020.01', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    angleMark(A, B, D, 28), angleMark(B, A, C, 28), angleMark(C, B, D, 28), angleMark(D, A, C, 28),
    angleText(A, B, D, '100°', 70), angleText(B, A, C, '75°', 66), angleText(C, B, D, '120°', 72), angleText(D, A, C, '?', 60),
    dot(A), dot(B), dot(C), dot(D),
    labelOut(A, 'A', g, 20), labelOut(B, 'B', g, 22), labelOut(C, 'C', g, 22), labelOut(D, 'D', g, 22)])
}

await xuatTat(RA)
