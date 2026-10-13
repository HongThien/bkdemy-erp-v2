// Vẽ lại hình — gói BV-MH031-1 (MH.031 Hai góc kề bù, Hình 7 · Luyện · biến thể).
//   node scripts/anh/ve_lai/BV-MH031-1.mjs [<thu_muc_ra>]
import { P, seg, angleMark, sector, ray, dot, label, angleText, rightAngle, goc, labelOut, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BV-MH031-1/moi'
const O = P(0, 0), L = 195, Lz = 215

// Hai tia đối nhau Oa (góc `t`) và Ob (góc t+180), tia Oz nằm giữa ở góc `tz`.
// ghi = { ten góc: 'x°', ... } ; vuong = ô vuông góc giữa tia đầu1 và z
function mh(ten, [n1, n2, nz], t1, tz, { so = null, benSo = 1, vuong = false } = {}) {
  const A = ray(O, t1, L), B = ray(O, t1 + 180, L), Z = ray(O, tz, Lz)
  console.assert(Math.abs(goc(O, A, B) - 180) < 0.01)
  const rr = 46
  const body = [
    so && !vuong ? sector(O, benSo === 1 ? A : B, Z, rr) + angleMark(O, benSo === 1 ? A : B, Z, rr) : '',
    seg(A, B), seg(O, Z),
    vuong ? rightAngle(O, A, Z, 22) : '',
    dot(O),
    so && !vuong ? angleText(O, benSo === 1 ? A : B, Z, so, 86) : '',
    label(O, 'O', 4, 34), labelOut(A, n1, O, 22), labelOut(B, n2, O, 22), labelOut(Z, nz, O, 22),
  ]
  hinh(ten, [A, B, Z], body)
  return { A, B, Z }
}

// 1) a, b đối nhau; c ở nửa trên. Không ghi số. (bOc = 80°, aOc = 100° — không vuông)
mh('042c946e-9039-429f-9cfb-30b8645ea701', ['b', 'a', 'c'], 19, 100)

// 2) m, n đối nhau (m trái, hơi lên); p ở nửa trên. Không ghi số. mOp = 35°, nOp = 145°
mh('aac46145-605c-4ccf-8b3c-2386cc384cd1', ['m', 'n', 'p'], 173, 138)

// 3) x, y đối nhau; xOz = 115° ghi trên hình (ở phía x)
{
  const r = mh('1dd172d3-67f2-4b98-95ab-dd1ed30683b0', ['x', 'y', 'z'], 173, 173 - 115, { so: '115°' })
  console.assert(Math.abs(goc(O, r.A, r.Z) - 115) < 0.01)
}

// 4) x, y đối nhau; Oz ⊥ xy (ô vuông góc giữa x và z như ảnh cũ)
mh('a7b19e67-67a4-4975-9a53-0bf8391f8b03', ['x', 'y', 'z'], 180, 90, { vuong: true })

// 5) m, n đối nhau; mOp = 56° ghi trên hình (phía m); p lệch sang trái
{
  const r = mh('2ac50897-161e-4ed1-a575-a2e3861cbec4', ['n', 'm', 'p'], 0, 180 - 56, { so: '56°', benSo: 2 })
  console.assert(Math.abs(goc(O, r.B, r.Z) - 56) < 0.01)
}

await xuatTat(RA)
