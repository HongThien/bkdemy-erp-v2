// Vẽ lại hình — gói HH00001-2 (Tổng ba góc của một tam giác, Hình học 7)
//   node scripts/anh/ve_lai/HH00001-2.mjs [<thu_muc_ra>]
import { P, seg, angleMark, rightAngle, ray, dot, label, angleText, angleBien, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00001-2/moi'

// HH00001009 — tam giác DEF vuông tại E, góc ngoài tại D = 125° (tia Dm là phần kéo dài của FD); đề hỏi y = ∠FDE, z = ∠DFE
// Giá trị thật: y = 55°, z = 35° (125° = 90° + z) ⇒ dựng góc F = 35° để số đo 125° trên hình đúng; trên hình chỉ ghi chữ y, z.
{
  const F = P(0, 0), E = P(270, 0)
  const FD = 270 / Math.cos(35 * Math.PI / 180)
  const D = ray(F, 35, FD), M = ray(F, 35, FD + 115)
  console.assert(Math.abs(goc(D, M, E) - 125) < 0.5, 'goc ngoai D')
  console.assert(Math.abs(goc(E, F, D) - 90) < 0.5, 'vuong E')
  hinh('HH00001009', [F, E, D, M], [seg(F, M), seg(F, E), seg(D, E), rightAngle(E, F, D, 16),
    angleMark(F, D, E, 44), angleMark(D, M, E, 36),
    dot(F), dot(D), dot(E),
    angleBien(F, D, E, 'z', 84), angleBien(D, F, E, 'y', 62),
    angleText(D, M, E, '125°', 86),
    label(F, 'F', -8, 32), label(E, 'E', 8, 34), label(D, 'D', -22, -14), label(M, 'm', 6, 30)])
}

await xuatTat(RA)
