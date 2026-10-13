// Vẽ lại hình — gói HH00028-1 (Đối đỉnh thêm tia, Hình học 7)
//   node scripts/anh/ve_lai/HH00028-1.mjs [<thu_muc_ra>]
import { P, seg, ray, dot, label, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00028-1/moi'
const lab = (O, ang, L, t, d = 24) => label(ray(O, ang, L + d), t, 0, 9)

// HHC000697 — Ox, Ox′ đối nhau; Oy, Oy′ đối nhau; thêm tia Oa nằm phía trên, bên Ox′ (không cho số đo)
{
  const O = P(0, 0)
  const x = ray(O, 0, 200), x1 = ray(O, 180, 200), y = ray(O, 53, 170), y1 = ray(O, 233, 170), a = ray(O, 139, 150)
  hinh('HHC000697', [x, x1, y, y1, a], [seg(x1, x), seg(y1, y), seg(O, a), dot(O),
    label(O, 'O', 22, 28), lab(O, 0, 200, 'x', 16), lab(O, 180, 200, 'x′', 14), lab(O, 53, 170, 'y'), lab(O, 233, 170, 'y′'), lab(O, 139, 150, 'a')])
}

await xuatTat(RA)
