// Vẽ lại hình — gói BT-MH043-1 (MH.043 Tam giác cân tạo ra hình thang cân, Hình 8 · Luyện).
//   node scripts/anh/ve_lai/BT-MH043-1.mjs [<thu_muc_ra>]
import { P, seg, dot, label, tick, rightAngle, angleMark, sector, bisector, foot, mid, inter, goc, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH043-1/moi'
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)

// Gốc chung: ABC cân tại A (tam giác thường, không đều). D ∈ AC, E ∈ AB theo từng bài.
const A = P(0, -280), B = P(-150, 0), C = P(150, 0)
ok(Math.abs(dist(A, B) - dist(A, C)) < 1e-6, 'AB = AC')
const cung = (D, E) => [seg(A, B), seg(A, C), seg(B, C), seg(D, E)]
const nhan = (D, E) => [dot(A), dot(B), dot(C), dot(D), dot(E),
  label(A, 'A', 0, -14), label(B, 'B', -20, 28), label(C, 'C', 20, 28), label(E, 'E', -22, 6), label(D, 'D', 22, 6)]

// BT.08.043.02 — BD ⊥ AC, CE ⊥ AB. Ảnh cũ có sẵn DE và hai ô vuông ở D, E ⇒ giữ
{
  const D = foot(B, A, C), E = foot(C, A, B)
  ok(Math.abs(goc(D, A, B) - 90) < 0.01 && Math.abs(goc(E, A, C) - 90) < 0.01, 'BD ⊥ AC, CE ⊥ AB')
  ok(Math.abs(dist(A, D) - dist(A, E)) < 1e-6, 'AD = AE')
  hinh('BT.08.043.02', [A, B, C, D, E], [...cung(D, E), seg(B, D), seg(C, E),
    rightAngle(E, B, C), rightAngle(D, C, B), ...nhan(D, E)])
}

// BT.08.043.04 — D, E là trung điểm AC, AB. Ảnh cũ có gạch: AE 1, EB 1, AD 2, DC 2; có DE ⇒ giữ
{
  const D = mid(A, C), E = mid(A, B)
  hinh('BT.08.043.04', [A, B, C, D, E], [...cung(D, E),
    tick(A, E, 1), tick(E, B, 1), tick(A, D, 2), tick(D, C, 2), ...nhan(D, E)])
}

// BT.08.043.06 / .07 — BD, CE là phân giác góc B, C. Ảnh cũ: có DE, tô + cung trên TOÀN góc B (1 cung) và góc C (2 cung) ⇒ giữ
function phanGiac(ten) {
  const D = inter(B, bisector(B, A, C), A, C), E = inter(C, bisector(C, A, B), A, B)
  ok(Math.abs(goc(B, A, D) - goc(B, D, C)) < 0.01 && Math.abs(goc(C, A, E) - goc(C, E, B)) < 0.01, 'BD, CE là phân giác')
  ok(Math.abs(dist(A, D) - dist(A, E)) < 1e-6, 'AD = AE')
  hinh(ten, [A, B, C, D, E], [sector(B, A, C, 50), sector(C, A, B, 50), ...cung(D, E), seg(B, D), seg(C, E),
    angleMark(B, A, C, 50, 1), angleMark(C, A, B, 44, 2), ...nhan(D, E)])
}
phanGiac('BT.08.043.06')
phanGiac('BT.08.043.07')

await xuatTat(RA)
