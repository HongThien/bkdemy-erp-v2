// Vẽ lại hình — gói BV-MH032-1 (MH.032 Mô hình 3 góc bù, Hình 7 · Luyện · biến thể).
//   node scripts/anh/ve_lai/BV-MH032-1.mjs [<thu_muc_ra>]
import { P, seg, angleMark, sector, ray, dot, label, angleText, rightAngle, goc, labelOut, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BV-MH032-1/moi'

// Hai tia đối nhau (trái L, phải R), tia z ở nửa trái, tia t ở nửa phải.
// a = số đo góc (L, z); b = số đo góc (R, t). ghi = ghi số + tô cung; vuong = ô vuông góc tại (L, z).
function mh(ten, [ln, rn, zn, tn], a, b, { ghi = true, vuong = false } = {}) {
  const O = P(0, 0), L = ray(O, 180, 190), R = ray(O, 0, 190)
  const z = ray(O, 180 - a, 200), t = ray(O, b, 195)
  console.assert(Math.abs(goc(O, L, R) - 180) < 0.01)
  console.assert(Math.abs(goc(O, L, z) - a) < 0.01, ten + ' goc z')
  console.assert(Math.abs(goc(O, R, t) - b) < 0.01, ten + ' goc t')
  const rr = 48
  const body = [
    ghi && !vuong ? sector(O, L, z, rr) + angleMark(O, L, z, rr) : '',
    ghi ? sector(O, R, t, rr) + angleMark(O, R, t, rr) : '',
    seg(L, R), seg(O, z), seg(O, t),
    vuong ? rightAngle(O, L, z, 24) : '',
    dot(O),
    ghi && !vuong ? angleText(O, L, z, a + '°', a < 40 ? 100 : 84) : '',
    ghi ? angleText(O, R, t, b + '°', b < 40 ? 100 : 84) : '',
    label(O, 'O', 0, 34), label(L, ln, 0, 34), label(R, rn, 0, 34),
    labelOut(z, zn, O, 22), labelOut(t, tn, O, 22),
  ]
  hinh(ten, [L, R, z, t], body)
}

// 1) m,n đối nhau; p, q hai tia ở nửa trên; không ghi số (ảnh cũ không số) — góc mOp 55°, nOq 51° (lệch nhau, không đặc biệt)
mh('690697ee-670e-448b-9dce-36a2e504160a', ['m', 'n', 'p', 'q'], 55, 51, { ghi: false })

// 2) x, z đối nhau; y, t ở nửa trên; không ghi số. Ảnh cũ y ≈ vuông góc nhưng đề không cho ⊥ ⇒ vẽ y hơi nghiêng (xOy = 75°); t = 45° như ảnh cũ
{
  const O = P(0, 0), x = ray(O, 180, 190), zz = ray(O, 0, 190), y = ray(O, 105, 200), t = ray(O, 45, 195)
  console.assert(Math.abs(goc(O, x, y) - 75) < 0.01)
  console.assert(Math.abs(goc(O, zz, t) - 45) < 0.01)
  hinh('b344fe3e-b3ba-4bf9-8ead-0a4f18dc9043', [x, zz, y, t], [
    seg(x, zz), seg(O, y), seg(O, t), dot(O),
    label(O, 'O', 0, 34), label(x, 'x', 0, 34), label(zz, 'z', 0, 34), labelOut(y, 'y', O, 22), labelOut(t, 't', O, 22)])
}

// 3..8) Ox,Oy đối nhau; xOz = a, tOy = b (ghi trên hình)
mh('053900af-8576-47f9-8760-7c426c9e68c1', ['x', 'y', 'z', 't'], 69, 45)
mh('bd8f20c9-a6e5-4bb5-bc07-cd942803383f', ['x', 'y', 'z', 't'], 90, 36, { vuong: true })
mh('c333050d-1266-4e80-ba27-aa8784fbe5a6', ['x', 'y', 'z', 't'], 66, 36)
mh('bfbb5472-e5cf-4bc1-a975-8c5529d83d94', ['x', 'y', 'z', 't'], 75, 61)
mh('ab2d2a6d-763c-4588-90f1-f12fe9a6159c', ['x', 'y', 'z', 't'], 60, 45)
mh('52b6671b-57b5-48be-bd11-f1c1ef010b84', ['x', 'y', 'z', 't'], 78, 30)

await xuatTat(RA)
