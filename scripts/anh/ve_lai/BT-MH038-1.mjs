// Vẽ lại hình — gói BT-MH038-1 (MH.038 Đối đỉnh, Hình 7 · Luyện · bài toán).
//   node scripts/anh/ve_lai/BT-MH038-1.mjs [<thu_muc_ra>]
import { P, seg, angleMark, sector, ray, dot, label, angleText, goc, labelOut, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH038-1/moi'

// BT.07.038.02 — Ox, Ox′ đối nhau; Oy, Oy′ đối nhau; ghi góc x′Oy′ = 65° (tô xám + cung), đề hỏi góc xOy, x′Oy
{
  const O = P(0, 0), x = ray(O, -18, 190), x1 = ray(O, 162, 190)
  const y1 = ray(O, 162 + 65, 175), y = ray(O, 162 + 65 - 180, 175)
  console.assert(Math.abs(goc(O, x1, y1) - 65) < 0.01, 'x′Oy′')
  console.assert(Math.abs(goc(O, x, y) - 65) < 0.01, 'xOy')
  console.assert(Math.abs(goc(O, x1, y) - 115) < 0.01, 'x′Oy')
  hinh('BT.07.038.02', [x, x1, y, y1], [
    sector(O, x1, y1, 50), seg(x1, x), seg(y1, y), angleMark(O, x1, y1, 50), dot(O),
    angleText(O, x1, y1, '65°', 90),
    label(O, 'O', 4, -16), labelOut(x, 'x', O, 22), labelOut(x1, 'x′', O, 22), labelOut(y, 'y', O, 22), labelOut(y1, 'y′', O, 22)])
}

await xuatTat(RA)
