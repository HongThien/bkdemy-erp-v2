// Vẽ lại hình — gói HH00027-1 (Mô hình 3 góc bù, Hình học 7)
//   node scripts/anh/ve_lai/HH00027-1.mjs [<thu_muc_ra>]
import { P, seg, angleMark, sector, ray, dot, label, angleText, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00027-1/moi'

// HHC000693 — Ox, Oy đối nhau; Oz, Ot nằm giữa (không cho số đo)
{
  const O = P(0, 0)
  const x = ray(O, 180, 210), y = ray(O, 0, 210), z = ray(O, 150, 210), t = ray(O, 60, 200)
  hinh('HHC000693', [x, y, z, t], [seg(x, y), seg(O, z), seg(O, t), dot(O),
    label(O, 'O', 0, 34), label(x, 'x', -4, 34), label(y, 'y', 4, 34), label(z, 'z', -14, -8), label(t, 't', 16, 2)])
}

// HHC000694 — ∠xOz = 30°, ∠tOy = 60° (đề hỏi tOz, xOt, yOz nên không ghi các số đo đó)
{
  const O = P(0, 0)
  const x = ray(O, 180, 210), y = ray(O, 0, 210), z = ray(O, 150, 210), t = ray(O, 60, 200)
  console.assert(Math.abs(goc(O, x, z) - 30) < 0.5, 'xOz')
  console.assert(Math.abs(goc(O, t, y) - 60) < 0.5, 'tOy')
  hinh('HHC000694', [x, y, z, t], [sector(O, x, z, 66), sector(O, t, y, 66), seg(x, y), seg(O, z), seg(O, t),
    angleMark(O, x, z, 66), angleMark(O, t, y, 66), dot(O),
    angleText(O, x, z, '30°', 100), angleText(O, t, y, '60°', 100),
    label(O, 'O', 0, 34), label(x, 'x', -4, 34), label(y, 'y', 4, 34), label(z, 'z', -14, -8), label(t, 't', 16, 2)])
}

await xuatTat(RA)
