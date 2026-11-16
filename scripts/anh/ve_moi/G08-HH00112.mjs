// G08-HH00112.mjs — hình đề cho bài HH00112 "Ôn tập Chương III. Góc và đường thẳng song song" (khối 7).
//   node scripts/anh/ve_moi/G08-HH00112.mjs "<gói>/moi"
// Vẽ: HHB000554 (bài nhiều ý), HHC002078, HHC002086, HHC002088.
// KHÔNG vẽ: HHC002085, HHC002087 (xem báo cáo).
import { P, seg, tick, angleMark, rightAngle, dot, label, num, hinh, xuatTat, dist, goc, ray, labelOut, angleText } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/G08-HH00112.mjs <thu_muc_ra>'); process.exit(2) }
let nKiem = 0
const ok = (t, c) => { nKiem++; console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const eq = (a, b, e = 1e-6) => Math.abs(a - b) < e
const thang = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) < 1e-6
const vuong = (v, a, b) => Math.abs((a.x - v.x) * (b.x - v.x) + (a.y - v.y) * (b.y - v.y)) < 1e-6
const song2 = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) < 1e-6
const pts = (...a) => a.map(dot).join('')

/** Ký hiệu song song ">" (n = 1 | 2 mũi) đặt giữa đoạn a→b, mũi chỉ theo chiều a→b */
function par(a, b, n = 1, t = 0.5) {
  const L = dist(a, b), d = P((b.x - a.x) / L, (b.y - a.y) / L), nr = P(-d.y, d.x)
  const m = P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
  let s = ''
  for (let i = 0; i < n; i++) {
    const c = P(m.x + d.x * (i - (n - 1) / 2) * 9, m.y + d.y * (i - (n - 1) / 2) * 9)
    const tip = P(c.x + d.x * 4, c.y + d.y * 4)
    for (const sg of [1, -1]) {
      const e = P(c.x - d.x * 4 + nr.x * 6 * sg, c.y - d.y * 4 + nr.y * 6 * sg)
      s += seg(e, tip)
    }
  }
  return s
}

// ── HHB000554: Ox, Oy, Oz cùng phía, ∠xOz = 2/3 ∠xOy. Ý a: ∠xOy = 120°. Ý b: Ot phân giác ∠yOz. (Ý c dùng a = 108° khác — hình theo ý a, b.) ──
{
  const O = P(150, 300), L = 190
  const X = ray(O, 0, L), Z = ray(O, 80, L), T = ray(O, 100, L), Y = ray(O, 120, L)
  ok('554 Oy, Oz cùng phía so với Ox', Y.y < O.y && Z.y < O.y)
  ok('554 ∠xOy = 120°', eq(goc(O, X, Y), 120, 1e-6))
  ok('554 ∠xOz = 2/3 ∠xOy', eq(goc(O, X, Z), 2 / 3 * goc(O, X, Y), 1e-6))
  ok('554 Ot phân giác ∠yOz (∠zOt = ∠tOy)', eq(goc(O, Z, T), goc(O, T, Y), 1e-6))
  ok('554 Oz, Ot nằm trong ∠xOy', goc(O, X, Z) + goc(O, Z, Y) - goc(O, X, Y) < 1e-6 && goc(O, X, T) + goc(O, T, Y) - goc(O, X, Y) < 1e-6)
  ok('554 (kiểm, KHÔNG ghi) ∠yOz = 40°, ∠xOt = 100°', eq(goc(O, Z, Y), 40, 1e-6) && eq(goc(O, X, T), 100, 1e-6))
  hinh('HHB000554', [O, X, Y, Z, T, P(O.x - 60, O.y), P(X.x + 30, X.y)], [
    seg(O, X), seg(O, Y), seg(O, Z), seg(O, T),
    angleMark(O, X, Y, 104),
    angleMark(O, Z, T, 56), angleMark(O, T, Y, 72),
    num(ray(O, 30, 68), '120°', 0, 8, 22),
    dot(O), label(O, 'O', -18, 20),
    labelOut(X, 'x', O, 18), labelOut(Y, 'y', O, 18), labelOut(Z, 'z', O, 18), labelOut(T, 't', O, 18),
  ])
}

// ── HHC002078: hai góc kề bù xOy, yOx' (Ox, Ox' đối nhau), ∠xOy = 100°; Ot phân giác ∠xOy, Ot' phân giác ∠x'Oy. ──
{
  const O = P(240, 280), L = 200, Lr = 190
  const X = ray(O, 0, L), Xp = ray(O, 180, L), Y = ray(O, 100, Lr), T = ray(O, 50, Lr), Tp = ray(O, 140, Lr)
  ok('078 Ox, Ox\' đối nhau (O giữa)', thang(Xp, O, X) && (Xp.x - O.x) * (X.x - O.x) < 0)
  ok('078 ∠xOy = 100°', eq(goc(O, X, Y), 100, 1e-6))
  ok('078 Ot phân giác ∠xOy', eq(goc(O, X, T), goc(O, T, Y), 1e-6))
  ok('078 Ot\' phân giác ∠x\'Oy', eq(goc(O, Xp, Tp), goc(O, Tp, Y), 1e-6))
  ok('078 hai góc kề bù ∠xOy + ∠yOx\' = 180°', eq(goc(O, X, Y) + goc(O, Xp, Y), 180, 1e-6))
  ok('078 y, t, t\' cùng phía bờ xx\'', Y.y < O.y && T.y < O.y && Tp.y < O.y)
  ok('078 (kiểm, KHÔNG ghi) ∠tOt\' = 90°', eq(goc(O, T, Tp), 90, 1e-6))
  hinh('HHC002078', [O, X, Xp, Y, T, Tp, P(X.x + 25, X.y), P(Xp.x - 25, Xp.y)], [
    seg(Xp, X), seg(O, Y), seg(O, T), seg(O, Tp),
    angleMark(O, X, Y, 108),
    angleMark(O, X, T, 34), angleMark(O, T, Y, 46),
    angleMark(O, Xp, Tp, 34, 2), angleMark(O, Tp, Y, 54, 2),
    num(ray(O, 20, 82), '100°', 0, 8, 22),
    dot(O), label(O, 'O', 6, 28),
    labelOut(X, 'x', O, 18), labelOut(Xp, 'x′', O, 20), labelOut(Y, 'y', O, 18), labelOut(T, 't', O, 18), labelOut(Tp, 't′', O, 20),
  ])
}

// ── HHC002086: a ∥ b, b ⊥ c. Hình giả thiết (a ⊥ c là điều cần kết luận — KHÔNG ô vuông tại a∩c). ──
{
  const a1 = P(40, 80), a2 = P(380, 80), b1 = P(40, 190), b2 = P(380, 190), c1 = P(210, 30), c2 = P(210, 240)
  const M = P(210, 190)
  ok('086 a ∥ b', song2(a1, a2, b1, b2))
  ok('086 b ⊥ c', vuong(M, b2, c1))
  ok('086 c cắt a và b', c1.y < a1.y && a1.y < b1.y && b1.y < c2.y)
  hinh('HHC002086', [a1, a2, b1, b2, c1, c2, P(a2.x + 22, a2.y), P(c1.x, c1.y - 22)], [
    seg(a1, a2), seg(b1, b2), seg(c1, c2),
    par(a1, a2, 1, 0.2), par(b1, b2, 1, 0.2),
    rightAngle(M, P(M.x, 30), b2, 16),
    label(P(a2.x + 22, a2.y), 'a', 0, 8), label(P(b2.x + 22, b2.y), 'b', 0, 8), label(P(c1.x, c1.y - 12), 'c', 0, 0),
  ])
}

// ── HHC002088: hình bình hành ABCD (AB ∥ CD, AD ∥ BC). Hình đề: chỉ hình bình hành + ký hiệu song song giả thiết;
//    KHÔNG vẽ đường phụ xy/mn của lời giải, KHÔNG đánh dấu góc đối bằng nhau (kết luận). ──
{
  const A = P(120, 60), B = P(400, 60), C = P(330, 230), D = P(50, 230)
  ok('088 AB ∥ CD', song2(A, B, D, C))
  ok('088 AD ∥ BC', song2(A, D, B, C))
  ok('088 ABCD hình bình hành thường (AB ≠ AD, không chữ nhật)', Math.abs(dist(A, B) - dist(A, D)) > 40 && Math.abs(goc(A, B, D) - 90) > 10)
  ok('088 D→C = A→B', eq(C.x - D.x, B.x - A.x) && eq(C.y - D.y, B.y - A.y))
  hinh('HHC002088', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    par(A, B, 1), par(D, C, 1), par(A, D, 2), par(B, C, 2),
    pts(A, B, C, D),
    label(A, 'A', -4, -14), label(B, 'B', 4, -14), label(C, 'C', 18, 24), label(D, 'D', -18, 24),
  ])
}

await xuatTat(dir)
console.log(`Đã chạy ${nKiem} phép kiểm.`)
