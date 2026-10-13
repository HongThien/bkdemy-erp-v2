// Vẽ lại hình — gói BV-MH029-1 (MH.029 Tứ giác có hai tia phân giác cắt nhau · biến thể).
//   node scripts/anh/ve_lai/BV-MH029-1.mjs [<thu_muc_ra>]
// Tứ giác ABCD, đáy DC nằm ngang (D trái, C phải), A trên-trái, B trên-phải; AI, BI là phân giác góc A, góc B.
// Dựng từ SỐ ĐO CỦA ĐỀ: biết D, C (đáy) và A (góc tại A) ⇒ B suy ra; B = 360° − A − C − D.
import { P, seg, angleMark, sector, ray, rot, inter, bisector, goc, dot, label, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BV-MH029-1/moi'

/** D = (0,0), C = (L,0); góc D, C ở đáy; AD = a; góc tại A = gA. Trả về A, B, C, D, I (đã assert các số đo). */
function dung(gD, gC, gA, a, L = 360) {
  const D = P(0, 0), C = P(L, 0)
  const A = ray(D, gD, a)
  // cạnh AB: quay tia AD quanh A một góc gA (ngược chiều kim đồng hồ trên hình) rồi cắt tia CB (hợp đáy CD góc gC)
  const dirAB = rot(D, A, gA), dirCB = ray(C, 180 - gC, 100)
  const B = inter(A, dirAB, C, dirCB)
  const gB = 360 - gA - gC - gD
  console.assert(Math.abs(goc(D, A, C) - gD) < 0.3 && Math.abs(goc(C, B, D) - gC) < 0.3, 'góc D, C')
  console.assert(Math.abs(goc(A, D, B) - gA) < 0.3 && Math.abs(goc(B, A, C) - gB) < 0.3, 'góc A, B')
  const I = inter(A, bisector(A, D, B, 100), B, bisector(B, A, C, 100))
  console.assert(Math.abs(goc(I, A, B) - (180 - (gA + gB) / 2)) < 0.3, 'AIB = 180° − (A+B)/2')
  return { A, B, C, D, I, gB }
}

/** Phần thân hình (nét + nhãn + ký hiệu góc A, B đúng như ảnh cũ: góc A một cung, góc B hai cung, tô nhạt) */
function ve(h, rA = 38, rB = 36, dyI = 32) {
  const { A, B, C, D, I } = h
  return [
    sector(A, D, B, rA), sector(B, A, C, rB + 6),
    seg(A, D), seg(D, C), seg(C, B), seg(B, A), seg(A, I), seg(B, I),
    angleMark(A, D, B, rA, 1), angleMark(B, A, C, rB, 2),
    dot(A), dot(B), dot(C), dot(D), dot(I),
    label(A, 'A', 6, -14), label(B, 'B', 14, -12), label(C, 'C', 12, 30), label(D, 'D', -10, 30), label(I, 'I', 0, dyI),
  ]
}

// bd1069fb: D − C = 20°, AIB = 60° ⇒ C + D = 120° ⇒ D = 70°, C = 50°; A + B = 240°
{
  const h = dung(70, 50, 100, 200)
  console.assert(Math.abs(goc(h.I, h.A, h.B) - 60) < 0.3 && Math.abs(goc(h.D, h.A, h.C) - goc(h.C, h.B, h.D) - 20) < 0.3, 'đề: AIB = 60°, D − C = 20°')
  hinh('bd1069fb-90b1-4fe6-8d8f-948e0b4cd25e', [h.A, h.B, h.C, h.D, h.I], ve(h))
}

// e25527fd: A + B = 150° (hỏi AIB) ⇒ C + D = 210°
{
  const h = dung(100, 110, 70, 200, 250)
  console.assert(Math.abs(goc(h.B, h.A, h.C) + goc(h.A, h.D, h.B) - 150) < 0.3, 'đề: A + B = 150°')
  hinh('e25527fd-dd0e-44df-99ed-612623129946', [h.A, h.B, h.C, h.D, h.I], ve(h, 44, 40))
}

// 7a37870c: A + B = 200° (hỏi AIB) ⇒ C + D = 160°
{
  const h = dung(84, 76, 92, 200)
  console.assert(Math.abs(goc(h.B, h.A, h.C) + goc(h.A, h.D, h.B) - 200) < 0.3, 'đề: A + B = 200°')
  hinh('7a37870c-d131-4e17-8a3d-c9376205d122', [h.A, h.B, h.C, h.D, h.I], ve(h, 38, 36, -14)) // I sát đáy DC ⇒ nhãn đặt phía trên
}

await xuatTat(RA)
