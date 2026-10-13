// Vẽ lại hình — gói BT-MH032-1 (MH.032 Mô hình 3 góc bù, Hình 7 · Luyện · bài toán).
//   node scripts/anh/ve_lai/BT-MH032-1.mjs [<thu_muc_ra>]
import { P, seg, angleMark, sector, ray, dot, label, angleText, rightAngle, goc, labelOut, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH032-1/moi'

// Mô hình 3 góc bù: hai tia đối nhau (trái, phải), tia z ở nửa trái, tia t ở nửa phải.
// a = số đo góc (tia trái, z); b = số đo góc (tia phải, t). Số ghi trên hình khi ghi = true.
function mh(ten, [tn, pn, zn, tt], a, b, { ghi = true } = {}) {
  const O = P(0, 0), L = ray(O, 180, 190), R = ray(O, 0, 190)
  const z = ray(O, 180 - a, 200), t = ray(O, b, 195)
  console.assert(Math.abs(goc(O, L, R) - 180) < 0.01)
  console.assert(Math.abs(goc(O, L, z) - a) < 0.01, ten + ' goc z')
  console.assert(Math.abs(goc(O, R, t) - b) < 0.01, ten + ' goc t')
  const rr = 48
  const body = [
    ghi ? sector(O, L, z, rr) + sector(O, R, t, rr) : '',
    seg(L, R), seg(O, z), seg(O, t),
    ghi ? angleMark(O, L, z, rr) + angleMark(O, R, t, rr) : '',
    dot(O),
    ghi ? angleText(O, L, z, a + '°', a < 40 ? 100 : 84) + angleText(O, R, t, b + '°', b < 40 ? 100 : 84) : '',
    label(O, 'O', 0, 34), label(L, tn, 0, 34), label(R, pn, 0, 34),
    labelOut(z, zn, O, 22), labelOut(t, tt, O, 22),
  ]
  hinh(ten, [L, R, z, t], body)
}

// BT.07.032.02 — ảnh cũ ghi xOz = 30°, tOy = 60° (lời giải dùng đúng hai số này)
mh('BT.07.032.02', ['x', 'y', 'z', 't'], 30, 60)

await xuatTat(RA)
