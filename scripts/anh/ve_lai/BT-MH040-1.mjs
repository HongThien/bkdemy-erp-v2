// Vẽ lại hình — gói BT-MH040-1 (MH.040 Phân giác, Hình 7 · Luyện · bài toán).
//   node scripts/anh/ve_lai/BT-MH040-1.mjs [<thu_muc_ra>]
import { P, seg, angleMark, ray, dot, label, goc, bisector, labelOut, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH040-1/moi'

// BT.07.040.01 — xOy = 70°, Oz phân giác. Ảnh cũ: không ghi số, hai cung (bán kính khác nhau) đánh dấu xOz, zOy bằng nhau.
{
  const O = P(0, 0), x = ray(O, 70, 270), y = ray(O, 0, 300), z = ray(O, 35, 290)
  console.assert(Math.abs(goc(O, x, y) - 70) < 0.01)
  console.assert(Math.abs(goc(O, x, z) - goc(O, z, y)) < 0.01)
  hinh('BT.07.040.01', [x, y, z, O], [
    seg(O, x), seg(O, y), seg(O, z),
    angleMark(O, x, z, 64), angleMark(O, z, y, 90),
    dot(O),
    label(O, 'O', -20, 24), labelOut(x, 'x', O, 22), labelOut(y, 'y', O, 22), labelOut(z, 'z', O, 22)])
}

await xuatTat(RA)
