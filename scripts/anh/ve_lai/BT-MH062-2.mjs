// Vẽ lại hình — gói BT-MH062-2 (MH.062 Tam giác cân, Hình 7 · Luyện).
//   node scripts/anh/ve_lai/BT-MH062-2.mjs [<thu_muc_ra>]
import { P, seg, dot, label, rightAngle, foot, inter, doiXung, goc, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH062-2/moi'
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)
const song2 = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) < 1e-6 * dist(a, b) * dist(c, d)

// Tam giác cân ABC (AB = AC, chiều cao = 2 × nửa đáy như ảnh cũ — cân hẳn); gốc ở M = D = chân đường cao (trung điểm BC)
function chung(hb, H = 2 * hb) {
  const A = P(0, -H), B = P(-hb, 0), C = P(hb, 0), M = P(0, 0)
  ok(Math.abs(dist(A, B) - dist(A, C)) < 1e-9, 'AB = AC')
  ok(Math.abs(goc(A, B, M) - goc(A, C, M)) < 1e-6, 'AM là phân giác')
  const E = foot(M, A, B), F = foot(M, A, C)
  ok(Math.abs(goc(E, A, M) - 90) < 0.01 && Math.abs(goc(F, A, M) - 90) < 0.01, 'ME ⊥ AB, MF ⊥ AC')
  return { A, B, C, M, E, F }
}
const dd = (...p) => p.map(dot).join('')
const base = (A, B, C) => [seg(A, B), seg(A, C), seg(B, C)]
const nhan = (A, B, C, M, nm = 'M') => [label(A, 'A', 0, -14), label(B, 'B', -14, -12), label(C, 'C', 16, -12), label(M, nm, 0, 36)]

// BT.07.062.16 — C kẻ CD ∥ AM cắt tia BA tại D (D đối xứng B qua A); ảnh cũ giữ M, E, F, K và các đoạn của bài trước
{
  const { A, B, C, M, E, F } = chung(100, 150)
  const D = doiXung(B, A), K = inter(A, M, E, F)
  ok(song2(C, D, A, M), 'CD ∥ AM')
  ok(Math.abs(dist(B, A) - dist(A, D)) < 1e-6, 'A trung điểm BD')
  hinh('BT.07.062.16', [A, B, C, M, E, F, K, D], [...base(A, B, C), seg(A, M), seg(M, E), seg(M, F), seg(E, F), seg(A, D), seg(C, D),
    dd(A, B, C, M, E, F, K, D),
    label(A, 'A', -22, -10), label(B, 'B', -16, 22), label(C, 'C', 16, 22), label(M, 'M', 0, 36), label(E, 'E', -20, -6), label(F, 'F', 20, -6),
    label(K, 'K', 16, -12), label(D, 'D', 18, -8)], { pad: 40, padDuoi: 52 })
}

// BT.07.062.28 — AD phân giác góc A
{
  const { A, B, C, M: D } = chung(140)
  hinh('BT.07.062.28', [A, B, C, D], [...base(A, B, C), seg(A, D), dd(A, B, C, D), nhan(A, B, C, D, 'D')])
}

// BT.07.062.29 — DE ⊥ AB, DF ⊥ AC (ô vuông ở E, F vì đề cho ⊥)
{
  const { A, B, C, M: D, E, F } = chung(140)
  hinh('BT.07.062.29', [A, B, C, D, E, F], [...base(A, B, C), seg(A, D), seg(D, E), seg(D, F), rightAngle(E, A, D), rightAngle(F, A, D),
    dd(A, B, C, D, E, F), nhan(A, B, C, D, 'D'), label(E, 'E', -20, -6), label(F, 'F', 20, -6)])
}

// BT.07.062.30 — I trung điểm EF (ảnh cũ có đoạn EF); đề bài này không nêu E, F nên không thêm ô vuông
{
  const { A, B, C, M: D, E, F } = chung(140)
  const I = inter(A, D, E, F)
  ok(dist(I, P((E.x + F.x) / 2, (E.y + F.y) / 2)) < 1e-6, 'I trung điểm EF')
  hinh('BT.07.062.30', [A, B, C, D, E, F, I], [...base(A, B, C), seg(A, D), seg(D, E), seg(D, F), seg(E, F),
    dd(A, B, C, D, E, F, I), nhan(A, B, C, D, 'D'), label(E, 'E', -20, -6), label(F, 'F', 20, -6), label(I, 'I', 16, -12)])
}

await xuatTat(RA)
