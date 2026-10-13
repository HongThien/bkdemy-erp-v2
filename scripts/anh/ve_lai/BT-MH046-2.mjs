// Vẽ lại hình — gói BT-MH046-2 (MH.046 Ba đường thẳng song song · Luyện · bài toán 10–12).
//   node scripts/anh/ve_lai/BT-MH046-2.mjs [<thu_muc_ra>]
import { P, seg, angleMark, sector, ray, dot, label, angleText, rightAngle, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH046-2/moi'
const ok = (v, e, ten) => console.assert(Math.abs(v - e) < 0.5, ten + ' lệch: ' + v + ' ≠ ' + e)

// ───────── 10 — A, B, F, D, E, C: AB ∥ FE (ngang), BF ⊥ FE (ô vuông ở F); đề cho ABC + CDE = BCD + 180° ─────────
// Vị trí điểm theo ảnh cũ (ảnh cũ thoả đúng hệ thức này vì AB ∥ DE); thu nhỏ hệ số 0,3 so với ảnh
{
  const s = 0.3, B = P(0, 0)
  const A = P(-400 * s, 0), F = P(0, -429 * s), D = P(455 * s, -429 * s), E = P(922 * s, -429 * s), C = P(307 * s, 387 * s)
  // kiểm hệ thức đề: ABC + CDE = BCD + 180°
  const lhs = goc(B, A, C) + goc(D, C, E), rhs = goc(C, B, D) + 180
  ok(lhs, rhs, '10 ABC+CDE=BCD+180')
  console.assert(Math.abs(A.y - B.y) < 1e-9 && Math.abs(F.y - D.y) < 1e-9 && Math.abs(D.y - E.y) < 1e-9, '10 AB, FE phải ngang')
  hinh('BT.07.046.10', [A, B, C, D, E, F], [
    seg(A, B), seg(B, F), seg(F, E), seg(D, C), seg(B, C),
    rightAngle(F, E, B, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
    label(F, 'F', 0, -14), label(D, 'D', 0, -14), label(E, 'E', 0, -14),
    label(A, 'A', 0, 38), label(B, 'B', -2, 38), label(C, 'C', 0, 38)])
}

// ───────── 11 / 04 — như bài 04 nhưng ghi BAC = 70°, chỉ một ô vuông (ở D); đề hỏi CED ─────────
function dungBDE() {
  const H = 200, B = P(0, 0), C = P(0, H)
  const A = ray(B, 200, 137)
  const A2 = ray(C, 130, 200)
  console.assert(Math.hypot(A.x - A2.x, A.y - A2.y) < 0.6, 'A không khớp')
  const D = P(220, 0), E = P(220, H)
  return { A, B, C, D, E, Dt: P(220, -40), Et: P(220, H + 40), Bx: P(262, 0), Cx: P(262, H) }
}
{
  const { A, B, C, D, E, Dt, Et, Bx, Cx } = dungBDE()
  ok(goc(B, A, D), 160, '11 ABD'); ok(goc(C, A, E), 130, '11 ACE'); ok(goc(A, B, C), 70, '11 BAC')
  hinh('BT.07.046.11', [A, B, C, D, E, Dt, Et, Bx, Cx], [
    seg(B, Bx), seg(C, Cx), seg(Dt, Et), seg(A, B), seg(A, C),
    rightAngle(D, B, Dt),
    dot(A), dot(B), dot(C), dot(D), dot(E),
    angleText(B, A, D, '160°', 44), angleText(C, A, E, '130°', 50), angleText(A, B, C, '70°', 66),
    label(A, 'A', -26, 6), label(B, 'B', 0, -16), label(C, 'C', 0, 38), label(D, 'D', 22, 34), label(E, 'E', 22, 34)],
  { pad: 44, padDuoi: 50 })
}

// ───────── 12 / 05 — như bài 05 nhưng ghi ABC = 54°, cung tô ở A, B, C, một ô vuông (ở M); đề hỏi CNM ─────────
{
  const A = P(0, 0), B = ray(A, -22, 215)
  const C = P(B.x - 255 * Math.cos(32 * Math.PI / 180), B.y + 255 * Math.sin(32 * Math.PI / 180))
  const M = P(300, 0), N = P(300, C.y), Mt = P(300, -40), Nb = P(300, C.y + 40), X = P(342, 0), Y = P(342, C.y)
  ok(goc(A, M, B), 22, '12 BAM'); ok(goc(C, N, B), 32, '12 BCN'); ok(goc(B, A, C), 54, '12 ABC')
  hinh('BT.07.046.12', [A, B, C, M, N, Mt, Nb, X, Y], [
    sector(A, M, B, 50), sector(C, N, B, 50), sector(B, A, C, 34),
    seg(A, X), seg(C, Y), seg(Mt, Nb), seg(A, B), seg(B, C),
    angleMark(A, M, B, 50), angleMark(C, N, B, 50), angleMark(B, A, C, 34),
    rightAngle(M, A, Mt),
    dot(A), dot(B), dot(C), dot(M), dot(N),
    angleText(A, M, B, '22°', 108), angleText(C, N, B, '32°', 108), angleText(B, A, C, '54°', 76),
    label(A, 'A', -26, 4), label(B, 'B', 26, 9), label(C, 'C', -26, 4), label(M, 'M', -24, 34), label(N, 'N', -24, 34)],
  { pad: 40, padDuoi: 48 })
}

await xuatTat(RA)
