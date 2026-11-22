// ve-phangiac.mjs — 7 hình cho LÝ THUYẾT + VÍ DỤ bài HH00128 "Tính chất đường phân giác (trong và ngoài)" khối 8T (Thùy 22/11).
//   node kho-rules/hinh/lo/k8T-thales/lt/ve-phangiac.mjs        → kho-rules/hinh/lo/k8T-thales/lt/ra/<ten>.png + .svg
// phan_giac_trong: AD phân giác trong (có đánh dấu 2 góc bằng nhau) · phan_giac_trong_cm: kẻ CE∥AD (nét đứt), E∈tia đối AB, AE=AC
// phan_giac_ngoai: AD' phân giác ngoài, C' trên tia đối AC · phan_giac_ngoai_cm: E∈AC, AE=AB, BE (nét đứt) · hai_phan_giac: AD⊥AD'
// phan_giac_vd_song_song: DE∥AB (E∈AC) · phan_giac_vd_dao: chỉ D∈BC, KHÔNG đánh dấu điều phải chứng minh.
// Hình chỉ vẽ DỮ KIỆN. Toạ độ DỰNG theo công thức (không ước mắt) để hình khớp tỉ số.
import { P, seg, segDash, dot, label, labelOut, lerp, add, mul, inter, angleMark, rightAngle, tick, hinh, xuatTat, dist } from '../../../../../scripts/anh/ve_hinh_lib.mjs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const RA = join(dirname(fileURLToPath(import.meta.url)), 'ra')
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
const unit = (v) => { const l = Math.hypot(v.x, v.y); return P(v.x / l, v.y / l) }
const diem = (ds) => ds.map(([p]) => dot(p)).join('')
const nhan = (ds, tam) => ds.map(([p, t, tu]) => (tu && 'dx' in tu ? label(p, t, tu.dx, tu.dy) : labelOut(p, t, tu ?? tam))).join('')
const tg = (B, C, A) => ({ b: dist(A, C), c: dist(A, B), a: dist(B, C) })
const chanTrong = (A, B, C) => { const { b, c } = tg(B, C, A); return lerp(B, C, c / (b + c)) }
const dirNgoai = (A, B, C) => { const u = unit(sub(B, A)), v = unit(sub(C, A)); return P(u.x - v.x, u.y - v.y) }   // AB<AC ⇒ chỉ về phía B
const chanNgoai = (A, B, C) => { const d = dirNgoai(A, B, C); return inter(A, add(A, d), B, C) }

// tam giác AB:AC = 1:2 (BC = 240) dùng cho hình lý thuyết ngoài; A dựng từ AB:AC = 1:2
const K = 0.78                                                   // thu nhỏ để hình gọn (<560 px)
const B = P(100 * K, 210 * K), C = P(340 * K, 210 * K)
const A = P(125.8333 * K, 90 * K)                                        // |AC| = 2|AB| (xem kiem-phangiac.mjs)
const D = chanTrong(A, B, C), Dn = chanNgoai(A, B, C)

// 1) phân giác trong
{
  const ds = [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D']], tam = P(190 * K, 150 * K)
  hinh('phan_giac_trong', ds.map(([p]) => p), [seg(A, B), seg(B, C), seg(C, A), seg(A, D), angleMark(A, B, D, 34), angleMark(A, D, C, 44), diem(ds), nhan(ds, tam)])
}
// 2) chứng minh phân giác trong: E trên tia đối của AB, AE = AC ⇒ CE ∥ AD
{
  const K2 = 0.72, A2 = P(150 * K2, 70 * K2), B2 = P(60 * K2, 210 * K2), C2 = P(330 * K2, 210 * K2), D2 = chanTrong(A2, B2, C2)
  const E = add(A2, mul(unit(sub(A2, B2)), dist(A2, C2)))
  const ds = [[E, 'E'], [A2, 'A'], [B2, 'B'], [C2, 'C'], [D2, 'D']], tam = P(190 * K2, 90 * K2)
  hinh('phan_giac_trong_cm', ds.map(([p]) => p), [seg(E, B2), seg(B2, C2), seg(C2, A2), seg(A2, D2), segDash(C2, E), angleMark(A2, B2, D2, 34), angleMark(A2, D2, C2, 44), diem(ds), nhan(ds, tam)])
}
// 3) phân giác ngoài: C' trên tia đối AC, AD' phân giác góc BAC', D' ngoài đoạn BC
{
  const Cp = add(A, mul(unit(sub(A, C)), 68))
  const ds = [[A, 'A', { dx: 20, dy: -12 }], [B, 'B'], [C, 'C'], [Dn, "D'"], [Cp, "C'"]], tam = P(220 * K, 150 * K)
  hinh('phan_giac_ngoai', ds.map(([p]) => p), [seg(Cp, C), seg(Dn, C), seg(A, B), seg(A, Dn), angleMark(A, Dn, B, 34), angleMark(A, Cp, Dn, 44), diem(ds), nhan(ds, tam)])
}
// 4) chứng minh phân giác ngoài: E ∈ AC với AE = AB, BE nét đứt ⇒ BE ∥ AD'
{
  const Cp = add(A, mul(unit(sub(A, C)), 68)), E = add(A, mul(unit(sub(C, A)), dist(A, B)))
  const ds = [[A, 'A', { dx: 20, dy: -12 }], [B, 'B'], [C, 'C'], [Dn, "D'"], [Cp, "C'"], [E, 'E']], tam = P(220 * K, 150 * K)
  hinh('phan_giac_ngoai_cm', ds.map(([p]) => p), [seg(Cp, C), seg(Dn, C), seg(A, B), seg(A, Dn), segDash(B, E), tick(A, B, 1), tick(A, E, 1), angleMark(A, Dn, B, 34), angleMark(A, Cp, Dn, 44), diem(ds), nhan(ds, tam)])
}
// 5) hai phân giác vuông góc
{
  const Cp = add(A, mul(unit(sub(A, C)), 68))
  const ds = [[A, 'A', { dx: 20, dy: -12 }], [B, 'B'], [C, 'C'], [D, 'D'], [Dn, "D'"], [Cp, "C'"]], tam = P(220 * K, 150 * K)
  hinh('hai_phan_giac', ds.map(([p]) => p), [seg(Cp, C), seg(Dn, C), seg(A, B), seg(A, D), seg(A, Dn), rightAngle(A, D, Dn, 13), diem(ds), nhan(ds, tam)])
}
// 6) ví dụ 3: AD phân giác trong, DE ∥ AB (E ∈ AC)
{
  const E = lerp(C, A, dist(D, C) / dist(B, C))                  // CE/CA = CD/CB ⇒ DE ∥ AB
  const ds = [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D'], [E, 'E']], tam = P(190 * K, 150 * K)
  hinh('phan_giac_vd_song_song', ds.map(([p]) => p), [seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(D, E), angleMark(A, B, D, 34), angleMark(A, D, C, 44), diem(ds), nhan(ds, tam)])
}
// 7) ví dụ 5: chỉ có D ∈ BC (không đánh dấu phân giác)
{
  const ds = [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D']], tam = P(190 * K, 150 * K)
  hinh('phan_giac_vd_dao', ds.map(([p]) => p), [seg(A, B), seg(B, C), seg(C, A), seg(A, D), diem(ds), nhan(ds, tam)])
}
await xuatTat(RA)
