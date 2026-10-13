// Vẽ lại hình — gói HH00020-1 (Hai góc kề bù) + HH00022-1 (Phân giác), Hình 7.
//   node scripts/anh/ve_lai/HH00020-1.mjs
import { P, seg, angleMark, sector, ray, dot, label, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const GOC = 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh'

// HHC000691 + HHC000692 — Ox, Oy đối nhau; Oz nằm giữa; câu 692 cho góc xOz = 60° (hình không ghi số, như ảnh cũ)
{
  const O = P(0, 0), x = ray(O, 180, 250), y = ray(O, 0, 230), z = ray(O, 240, 260) // góc xOz = 240° − 180° = 60°
  hinh('HHC000691+HHC000692', [x, y, z], [sector(O, x, z, 50), seg(x, y), seg(O, z), angleMark(O, x, z, 50), dot(O),
    label(O, 'O', 4, -16), label(x, 'x', 8, -14), label(y, 'y', -8, -14), label(z, 'z', 26, 4)])
  await xuatTat(`${GOC}/HH00020-1/moi`)
}

// HHC000698 — góc xOy = 70°, Oz là tia phân giác (hai cung đánh dấu hai góc bằng nhau, bán kính khác nhau)
{
  const O = P(0, 0), y = ray(O, 0, 330), x = ray(O, 70, 270), z = ray(O, 35, 300)
  hinh('HHC000698', [O, x, y, z], [seg(O, x), seg(O, y), seg(O, z), angleMark(O, y, z, 78), angleMark(O, z, x, 62), dot(O),
    label(O, 'O', -18, 22), label(x, 'x', 22, 10), label(y, 'y', 4, -12), label(z, 'z', 10, -12)])
  await xuatTat(`${GOC}/HH00022-1/moi`)
}
