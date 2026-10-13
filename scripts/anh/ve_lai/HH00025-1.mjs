// Vẽ lại hình — gói HH00025-1 (Hình học 7: góc đối đỉnh, kề bù, phân giác)
//   node scripts/anh/ve_lai/HH00025-1.mjs [<thu_muc_ra>]
import { P, seg, angleMark, rightAngle, sector, ray, dot, label, angleText, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00025-1/moi'
/** nhãn tên tia đặt ngoài đầu mút, theo hướng ang */
const lab = (O, ang, L, t, d = 22) => label(ray(O, ang, L + d), t, 0, 9)

// HHC000736 — hai đường thẳng xy, zt cắt nhau tại O; ∠xOt = 33° (cung đánh dấu, không ghi số — như ảnh cũ)
{
  const O = P(0, 0), L = 170
  const x = ray(O, 190, L), y = ray(O, 10, L), t = ray(O, 223, L), z = ray(O, 43, L)
  console.assert(Math.abs(goc(O, x, t) - 33) < 0.5, 'xOt')
  hinh('HHC000736', [x, y, t, z], [seg(x, y), seg(t, z), angleMark(O, x, t, 46), dot(O),
    label(O, 'O', 20, 30), lab(O, 190, L, 'x'), lab(O, 10, L, 'y'), lab(O, 223, L, 't'), lab(O, 43, L, 'z')])
}

// HHC000737 — m, I, n thẳng hàng; ∠nIq = 40°, Ip ⟂ Im (∠mIp = 90°)
{
  const I = P(0, 0)
  const n = ray(I, 45, 190), q = ray(I, 5, 205), m = ray(I, 225, 190), p = ray(I, 315, 175)
  console.assert(Math.abs(goc(I, n, q) - 40) < 0.5, 'nIq')
  console.assert(Math.abs(goc(I, m, p) - 90) < 0.5, 'mIp')
  console.assert(Math.abs(goc(I, m, n) - 180) < 0.5, 'm I n thang hang')
  hinh('HHC000737', [n, q, m, p], [seg(m, n), seg(I, q), seg(I, p), angleMark(I, n, q, 42), rightAngle(I, m, p, 16), dot(I),
    angleText(I, n, q, '40°', 82),
    label(I, 'I', -22, -12), lab(I, 45, 190, 'n'), lab(I, 5, 205, 'q'), lab(I, 225, 190, 'm'), lab(I, 315, 175, 'p')])
}

// HHC000738 — m, E, n thẳng hàng; x, E, y thẳng hàng (không cho số đo)
{
  const E = P(0, 0)
  const m = ray(E, 180, 190), n = ray(E, 0, 210), x = ray(E, 123, 190), y = ray(E, 303, 160)
  hinh('HHC000738', [m, n, x, y], [seg(m, n), seg(x, y), dot(E),
    label(E, 'E', -14, 30), lab(E, 180, 190, 'm'), lab(E, 0, 210, 'n'), lab(E, 123, 190, 'x'), lab(E, 303, 160, 'y')])
}

// HHC000739 — ∠xOy = 80°, Oz là tia phân giác (cung đánh dấu ∠xOz như ảnh cũ, không ghi số)
{
  const O = P(0, 0)
  const x = ray(O, 0, 250), y = ray(O, 80, 250), z = ray(O, 40, 330)
  console.assert(Math.abs(goc(O, x, y) - 80) < 0.5, 'xOy')
  console.assert(Math.abs(goc(O, x, z) - goc(O, z, y)) < 0.5, 'phan giac')
  hinh('HHC000739', [x, y, z], [sector(O, x, z, 50), seg(O, x), seg(O, y), seg(O, z), angleMark(O, x, z, 50), dot(O),
    label(O, 'O', -16, 8), lab(O, 0, 250, 'x', 20), lab(O, 80, 250, 'y'), lab(O, 40, 330, 'z')])
}

await xuatTat(RA)
