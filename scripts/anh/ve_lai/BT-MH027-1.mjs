// Vẽ lại hình — gói BT-MH027-1 (MH.027 Tứ giác có 2 cạnh bên cắt nhau).
//   node scripts/anh/ve_lai/BT-MH027-1.mjs [<thu_muc_ra>]
// ABCD là tứ giác; E = AD∩BC (đáy, bên phải), F = AB∩CD (đỉnh trên); I = giao hai tia phân giác của góc F và góc E.
import { P, seg, angleMark, sector, lerp, inter, bisector, goc, dot, label, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH027-1/moi'
const k = 0.62
const S = (x, y) => P(x * k, y * k)

// BT.08.027.01
{
  const B = S(83, 452), C = S(425, 452), E = S(645, 452), F = S(272, 73)
  const A = lerp(F, B, 0.396)
  const D = inter(A, E, F, C)
  const I = inter(F, bisector(F, B, C, 100), E, bisector(E, B, A, 100))
  // kiểm: D nằm trên FC và AE; FI, EI là phân giác
  console.assert(Math.abs(goc(F, B, I) - goc(F, I, C)) < 0.3, 'FI phân giác góc F')
  console.assert(Math.abs(goc(E, B, I) - goc(E, I, A)) < 0.3, 'EI phân giác góc E')
  hinh('BT.08.027.01', [A, B, C, D, E, F, I], [
    sector(F, A, D, 38), sector(E, D, C, 50),
    seg(F, B), seg(B, E), seg(F, C), seg(A, E), seg(F, I), seg(I, E),
    angleMark(F, A, D, 38, 1), angleMark(E, D, C, 44, 2),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(I),
    label(F, 'F', 16, -10), label(A, 'A', -16, -6), label(B, 'B', -4, 32), label(C, 'C', 4, 32),
    label(D, 'D', 16, -8), label(E, 'E', 16, -8), label(I, 'I', 14, -8),
  ])
}

await xuatTat(RA)
