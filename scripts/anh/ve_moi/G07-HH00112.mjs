// G07-HH00112.mjs — 6 hình đề cho bài HH00112 "Ôn tập Chương III. Góc và đường thẳng song song" (khối 7), hình gắn vào BÀI.
//   node scripts/anh/ve_moi/G07-HH00112.mjs "<gói>/moi"
import { P, seg, tick, angleMark, dot, label, num, hinh, xuatTat, dist, goc, ray, bisector, labelOut } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/G07-HH00112.mjs <thu_muc_ra>'); process.exit(2) }
let nKiem = 0
const ok = (t, c) => { nKiem++; console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const eq = (a, b, e = 1e-6) => Math.abs(a - b) < e
const thang = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) < 1e-6
const doi = (a, o, b) => thang(a, o, b) && (a.x - o.x) * (b.x - o.x) + (a.y - o.y) * (b.y - o.y) < 0   // O nằm giữa A và B
const al = (s) => s.replace(/α/g, '<tspan font-style="italic">α</tspan>')
// số đo/biểu thức ghi TRONG góc pvq, cách đỉnh r px theo phân giác
const gt = (v, p, q, t, r = 60, size = 22) => { const b = bisector(v, p, q, r); return num(b, al(t), 0, size * 0.34, size) }
const L = 150

// ── HHB000548: xx', yy' cắt nhau tại O; xOy = 60°. ──
{
  const O = P(200, 200)
  const a1 = 20, a2 = 80
  const X = ray(O, a1, L), X2 = ray(O, a1 + 180, L), Y = ray(O, a2, L), Y2 = ray(O, a2 + 180, L)
  ok('548 x, O, x\' thẳng hàng, O giữa', doi(X, O, X2))
  ok('548 y, O, y\' thẳng hàng, O giữa', doi(Y, O, Y2))
  ok('548 góc xOy = 60°', eq(goc(O, X, Y), 60))
  ok('548 góc x\'Oy\' = góc xOy (đối đỉnh, tự có)', eq(goc(O, X2, Y2), 60))
  ok('548 hai đường thẳng không vuông góc', Math.abs(goc(O, X, Y) - 90) > 10)
  hinh('HHB000548', [O, X, X2, Y, Y2, P(O.x, O.y + 24)], [
    seg(X, X2), seg(Y, Y2),
    angleMark(O, X, Y, 34), gt(O, X, Y, '60°', 66),
    dot(O), label(ray(O, 140, 24), 'O', 0, 9),
    labelOut(X, 'x', O, 24), labelOut(X2, 'x′', O, 26), labelOut(Y, 'y', O, 24), labelOut(Y2, 'y′', O, 26),
  ])
}

// ── HHB000549: xy, zt cắt nhau tại A; xAz = 100°. ──
{
  const O = P(200, 200)
  const a1 = 20, a2 = 120
  const X = ray(O, a1, L), Y = ray(O, a1 + 180, L), Z = ray(O, a2, L), T = ray(O, a2 + 180, L)
  ok('549 x, A, y thẳng hàng, A giữa', doi(X, O, Y))
  ok('549 z, A, t thẳng hàng, A giữa', doi(Z, O, T))
  ok('549 góc xAz = 100°', eq(goc(O, X, Z), 100))
  ok('549 góc yAt = góc xAz (đối đỉnh, tự có)', eq(goc(O, Y, T), 100))
  ok('549 góc zAy = 80° (kề bù, tự có)', eq(goc(O, Z, Y), 80))
  hinh('HHB000549', [O, X, Y, Z, T, P(O.x, O.y + 20)], [
    seg(X, Y), seg(Z, T),
    angleMark(O, X, Z, 34), gt(O, X, Z, '100°', 68),
    dot(O), label(ray(O, 160, 26), 'A', 0, 9),
    labelOut(X, 'x', O, 24), labelOut(Y, 'y', O, 24), labelOut(Z, 'z', O, 24), labelOut(T, 't', O, 24),
  ])
}

// ── HHB000550: xx', yy' cắt nhau tại O; xOy = 3·yOx' ⇒ xOy = 135°, yOx' = 45°. ──
{
  const O = P(200, 200)
  const a1 = 10
  const a2 = a1 + 135                 // y cách x 135° (ngược chiều kim đồng hồ)
  const X = ray(O, a1, L), X2 = ray(O, a1 + 180, L), Y = ray(O, a2, L), Y2 = ray(O, a2 + 180, L)
  ok('550 x, O, x\' thẳng hàng, O giữa', doi(X, O, X2))
  ok('550 y, O, y\' thẳng hàng, O giữa', doi(Y, O, Y2))
  ok('550 xOy = 3·yOx\'', eq(goc(O, X, Y), 3 * goc(O, Y, X2)))
  ok('550 xOy + yOx\' = 180° (kề bù)', eq(goc(O, X, Y) + goc(O, Y, X2), 180))
  ok('550 xOy = 135°, yOx\' = 45° (giải ra rồi dựng)', eq(goc(O, X, Y), 135) && eq(goc(O, Y, X2), 45))
  ok('550 hai đường thẳng không vuông góc', Math.abs(goc(O, X, Y) - 90) > 10)
  hinh('HHB000550', [O, X, X2, Y, Y2, P(O.x, O.y + 24)], [
    seg(X, X2), seg(Y, Y2),
    angleMark(O, X, Y, 28), gt(O, X, Y, '3α', 62),
    angleMark(O, Y, X2, 48), gt(O, Y, X2, 'α', 84),
    dot(O), label(ray(O, 257, 24), 'O', 0, 9),
    labelOut(X, 'x', O, 24), labelOut(X2, 'x′', O, 26), labelOut(Y, 'y', O, 24), labelOut(Y2, 'y′', O, 26),
  ])
}

// ── HHB000551: xy, zt cắt nhau tại A; xAz = 5·zAy ⇒ xAz = 150°, zAy = 30°. ──
{
  const O = P(200, 200)
  const a1 = 10
  const a2 = a1 + 150                 // z cách x 150°
  const X = ray(O, a1, L), Y = ray(O, a1 + 180, L), Z = ray(O, a2, L), T = ray(O, a2 + 180, L)
  ok('551 x, A, y thẳng hàng, A giữa', doi(X, O, Y))
  ok('551 z, A, t thẳng hàng, A giữa', doi(Z, O, T))
  ok('551 xAz = 5·zAy', eq(goc(O, X, Z), 5 * goc(O, Z, Y)))
  ok('551 xAz + zAy = 180° (kề bù)', eq(goc(O, X, Z) + goc(O, Z, Y), 180))
  ok('551 xAz = 150°, zAy = 30° (giải ra rồi dựng)', eq(goc(O, X, Z), 150) && eq(goc(O, Z, Y), 30))
  hinh('HHB000551', [O, X, Y, Z, T, P(O.x, O.y + 24)], [
    seg(X, Y), seg(Z, T),
    angleMark(O, X, Z, 28), gt(O, X, Z, '5α', 62),
    angleMark(O, Z, Y, 50), gt(O, Z, Y, 'α', 98),
    dot(O), label(ray(O, 265, 24), 'A', 0, 9),
    labelOut(X, 'x', O, 24), labelOut(Y, 'y', O, 24), labelOut(Z, 'z', O, 24), labelOut(T, 't', O, 24),
  ])
}

// ── HHB000552: góc bẹt xOy, Oz với xOz = 75°; Oa phân giác xOz, Ob phân giác zOy (ý b). ──
{
  const O = P(200, 200)
  const X = ray(O, 180, L), Y = ray(O, 0, L)
  const Z = ray(O, 105, L)                       // xOz = 75°
  const A = ray(O, 142.5, L - 15), B = ray(O, 52.5, L - 15)
  ok('552 x, O, y thẳng hàng, O giữa (góc bẹt)', doi(X, O, Y))
  ok('552 xOz = 75°', eq(goc(O, X, Z), 75))
  ok('552 zOy = 105° (kề bù, tự có)', eq(goc(O, Z, Y), 105))
  ok('552 Oa phân giác xOz (xOa = aOz)', eq(goc(O, X, A), goc(O, A, Z)))
  ok('552 Ob phân giác zOy (zOb = bOy)', eq(goc(O, Z, B), goc(O, B, Y)))
  ok('552 (kiểm, KHÔNG ký hiệu) aOb = 90°', eq(goc(O, A, B), 90))
  ok('552 a, b, z cùng nửa mặt phẳng bờ xy', A.y < O.y && B.y < O.y && Z.y < O.y)
  hinh('HHB000552', [O, X, Y, Z, A, B, P(O.x, O.y + 24)], [
    seg(X, Y), seg(O, Z), seg(O, A), seg(O, B),
    angleMark(O, X, Z, 96), num(ray(O, 165, 122), '75°', 0, 7, 22),
    angleMark(O, X, A, 30, 1), angleMark(O, A, Z, 42, 1),
    angleMark(O, Z, B, 30, 2), angleMark(O, B, Y, 50, 2),
    dot(O), label(ray(O, 270, 24), 'O', 0, 9),
    labelOut(X, 'x', O, 24), labelOut(Y, 'y', O, 24), labelOut(Z, 'z', O, 24), labelOut(A, 'a', O, 24), labelOut(B, 'b', O, 24),
  ])
}

// ── HHB000553: góc bẹt xOy, Oz với xOz = 2·yOz ⇒ xOz = 120°, yOz = 60°; Ot phân giác xOz (ý b). ──
{
  const O = P(200, 200)
  const X = ray(O, 180, L), Y = ray(O, 0, L)
  const Z = ray(O, 60, L)                        // yOz = 60°
  const T = ray(O, 120, L - 15)                  // Ot phân giác xOz
  ok('553 x, O, y thẳng hàng, O giữa (góc bẹt)', doi(X, O, Y))
  ok('553 xOz = 2·yOz', eq(goc(O, X, Z), 2 * goc(O, Z, Y)))
  ok('553 xOz = 120°, yOz = 60° (giải ra rồi dựng)', eq(goc(O, X, Z), 120) && eq(goc(O, Z, Y), 60))
  ok('553 Ot phân giác xOz (xOt = tOz)', eq(goc(O, X, T), goc(O, T, Z)))
  ok('553 t, z cùng nửa mặt phẳng bờ xy', T.y < O.y && Z.y < O.y)
  ok('553 (kiểm, KHÔNG ký hiệu) yOz = zOt', eq(goc(O, Y, Z), goc(O, Z, T)))
  hinh('HHB000553', [O, X, Y, Z, T, P(O.x, O.y + 24)], [
    seg(X, Y), seg(O, Z), seg(O, T),
    angleMark(O, X, T, 28, 1), angleMark(O, T, Z, 40, 1),
    angleMark(O, X, Z, 96), num(ray(O, 160, 122), '2α', 0, 7, 22).replace('2α', '2<tspan font-style="italic">α</tspan>'),
    angleMark(O, Y, Z, 56), gt(O, Y, Z, 'α', 80),
    dot(O), label(ray(O, 270, 24), 'O', 0, 9),
    labelOut(X, 'x', O, 24), labelOut(Y, 'y', O, 24), labelOut(Z, 'z', O, 24), labelOut(T, 't', O, 24),
  ])
}

await xuatTat(dir)
console.log(`Đã chạy ${nKiem} phép kiểm.`)
