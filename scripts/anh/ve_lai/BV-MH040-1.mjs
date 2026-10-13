// Vẽ lại hình — gói BV-MH040-1 (MH.040 Phân giác, Hình 7 · Luyện · biến thể).
//   node scripts/anh/ve_lai/BV-MH040-1.mjs [<thu_muc_ra>]
import { P, seg, angleMark, sector, ray, dot, label, rightAngle, fill, goc, labelOut, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BV-MH040-1/moi'

// Góc xOy = a (độ), Oz phân giác. Ảnh cũ: tô nhạt + một cung quanh cả góc xOy, không ghi số. Oy nằm ngang bên phải.
function pg(ten, a) {
  const O = P(0, 0), x = ray(O, a, 270), y = ray(O, 0, 300), z = ray(O, a / 2, 290)
  console.assert(Math.abs(goc(O, x, y) - a) < 0.01)
  console.assert(Math.abs(goc(O, x, z) - goc(O, z, y)) < 0.01)
  const r = 56
  hinh(ten, [x, y, z, O], [
    sector(O, x, y, r), seg(O, x), seg(O, y), seg(O, z), angleMark(O, x, y, r),
    dot(O),
    label(O, 'O', -20, 24), labelOut(x, 'x', O, 22), labelOut(y, 'y', O, 22), labelOut(z, 'z', O, 22)])
}
pg('74b745e5-1622-4d4f-9c5b-a832df7fd0a2', 110)
pg('02456d36-aa8a-432a-90dd-eb340ebecf2d', 80)
pg('58a21898-4b3a-4809-b502-dd2cbb8b9a8b', 66)

// Góc vuông (ô vuông tô nhạt như ảnh cũ), Oz ở 45°
{
  const O = P(0, 0), x = ray(O, 90, 280), y = ray(O, 0, 300), z = ray(O, 45, 290)
  const s = 24, a = ray(O, 90, s), b = ray(O, 0, s), c = P(s, -s)
  console.assert(Math.abs(goc(O, x, y) - 90) < 0.01)
  hinh('de774de8-18c1-431c-8143-d3e1278887c3', [x, y, z, O], [
    fill([O, b, c, a]), seg(O, x), seg(O, y), seg(O, z), rightAngle(O, x, y, s),
    dot(O),
    label(O, 'O', -20, 24), labelOut(x, 'x', O, 22), labelOut(y, 'y', O, 22), labelOut(z, 'z', O, 22)])
}

await xuatTat(RA)
