// Vẽ lại hình — gói TH-2 (Toán 7, câu đề thi/đề cương chưa có hình). Chỉ 3 câu cần hình; 7 câu còn lại KHÔNG vẽ (xem báo cáo).
//   node scripts/anh/ve_lai/TH-2.mjs [<thu_muc_ra>]
import { P, seg, ray, inter, dot, label, labelOut, trongTam, angleMark, angleText, num, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/TH-2/moi'

// HHC002777 — tam giác ABC, Â = 50°, B̂ = 80° (đề hỏi Ĉ ⇒ không ghi Ĉ)
{
  const A = P(0, 0), B = ray(A, 0, 270)
  const C = inter(A, ray(A, 50, 100), B, ray(B, 180 - 80, 100))
  console.assert(Math.abs(goc(A, B, C) - 50) < 0.5 && Math.abs(goc(B, A, C) - 80) < 0.5)
  const g = trongTam([A, B, C])
  hinh('HHC002777', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), dot(A), dot(B), dot(C),
    angleMark(A, B, C, 36), angleMark(B, A, C, 36),
    angleText(A, B, C, '50°', 66), angleText(B, A, C, '80°', 66),
    labelOut(A, 'A', g, 22), labelOut(B, 'B', g, 22), labelOut(C, 'C', g, 22)])
}

// HHC002781 — tam giác ABC, Â = 50°, B̂ = 60° (đề hỏi Ĉ ⇒ không ghi Ĉ)
{
  const A = P(0, 0), B = ray(A, 0, 280)
  const C = inter(A, ray(A, 50, 100), B, ray(B, 180 - 60, 100))
  console.assert(Math.abs(goc(A, B, C) - 50) < 0.5 && Math.abs(goc(B, A, C) - 60) < 0.5)
  const g = trongTam([A, B, C])
  hinh('HHC002781', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), dot(A), dot(B), dot(C),
    angleMark(A, B, C, 38), angleMark(B, A, C, 38),
    angleText(A, B, C, '50°', 70), angleText(B, A, C, '60°', 70),
    labelOut(A, 'A', g, 22), labelOut(B, 'B', g, 22), labelOut(C, 'C', g, 22)])
}

// HHC002782 — AD là tia phân giác của góc BAC, CAD = 35° (đề hỏi BAC ⇒ không ghi số đo BAC)
{
  const A = P(0, 0), L = 280
  const C = ray(A, 20, L), D = ray(A, 20 + 35, L), B = ray(A, 20 + 70, L)
  console.assert(Math.abs(goc(A, C, D) - 35) < 0.5 && Math.abs(goc(A, D, B) - 35) < 0.5)
  hinh('HHC002782', [A, B, C, D], [seg(A, B), seg(A, C), seg(A, D), dot(A), dot(B), dot(C), dot(D),
    angleMark(A, C, D, 44), angleMark(A, D, B, 44),
    angleText(A, C, D, '35°', 112),
    label(A, 'A', -20, 8), label(B, 'B', 6, -14), label(C, 'C', 22, 8), label(D, 'D', 20, -8)])
}

await xuatTat(RA)
