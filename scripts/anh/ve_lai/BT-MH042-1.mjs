// Vẽ lại hình — gói BT-MH042-1 (MH.042 Hình thang cân trong tam giác cân, Hình 8 · Luyện).
//   node scripts/anh/ve_lai/BT-MH042-1.mjs [<thu_muc_ra>]
import { P, seg, dot, label, lerp, inter, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH042-1/moi'
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)

// Dựng chung: ABCD hình thang cân (AB // CD), O = AD ∩ BC (tam giác OCD cân tại O, tam giác thường — không đều), E = AC ∩ BD
function chung() {
  const O = P(0, 0), D = P(-170, 270), C = P(170, 270)
  const A = lerp(O, D, 0.46), B = lerp(O, C, 0.46)
  const E = inter(A, C, B, D)
  ok(Math.abs(A.y - B.y) < 1e-9, 'AB // CD')
  ok(Math.abs(dist(A, D) - dist(B, C)) < 1e-6, 'AD = BC (hình thang cân)')
  ok(Math.abs(dist(A, C) - dist(B, D)) < 1e-6, 'AC = BD')
  ok(Math.abs(dist(O, D) - dist(O, C)) < 1e-6, 'OD = OC')
  ok(Math.abs(dist(E, A) - dist(E, B)) < 1e-6 && Math.abs(dist(E, C) - dist(E, D)) < 1e-6, 'EA = EB, EC = ED')
  return { O, A, B, C, D, E }
}
const nhan = (O, A, B, C, D, E) => [dot(O), dot(A), dot(B), dot(C), dot(D), dot(E),
  label(O, 'O', 0, -14), label(A, 'A', -22, 6), label(B, 'B', 22, 6), label(D, 'D', -6, 32), label(C, 'C', 6, 32), label(E, 'E', 0, 32)]
const khung = (O, A, B, C, D, E) => [seg(O, D), seg(O, C), seg(D, C), seg(A, B), seg(A, C), seg(B, D)]

// BT.08.042.02 — EA = EB (ảnh cũ: O, A, B, C, D, E, hai đường chéo AC, BD; không có OE)
{
  const { O, A, B, C, D, E } = chung()
  hinh('BT.08.042.02', [O, A, B, C, D, E], [...khung(O, A, B, C, D, E), ...nhan(O, A, B, C, D, E)])
}

// BT.08.042.03 — OE là trung trực của AB (ảnh cũ có sẵn đoạn OE)
{
  const { O, A, B, C, D, E } = chung()
  hinh('BT.08.042.03', [O, A, B, C, D, E], [...khung(O, A, B, C, D, E), seg(O, E), ...nhan(O, A, B, C, D, E)])
}

// BT.08.042.04 — EC = ED (hình như .02)
{
  const { O, A, B, C, D, E } = chung()
  hinh('BT.08.042.04', [O, A, B, C, D, E], [...khung(O, A, B, C, D, E), ...nhan(O, A, B, C, D, E)])
}

// BT.08.042.05 — OE là trung trực của CD. Ảnh cũ KHÔNG có OE, nhưng câu hỏi nêu tên OE ⇒ vẽ thêm (theo ngoại lệ a)
{
  const { O, A, B, C, D, E } = chung()
  hinh('BT.08.042.05', [O, A, B, C, D, E], [...khung(O, A, B, C, D, E), seg(O, E), ...nhan(O, A, B, C, D, E)])
}

await xuatTat(RA)
