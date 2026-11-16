// G14-HH07000000.mjs — hình đề cho các câu đơn bài HH07000000 "Chưa phân dạng — Hình học 7".
//   Vẽ: HHC003486, HHC003487.
//   Không vẽ: HHC003489, HHC003490 (lý thuyết thuần), HHC003494, HHC003495 (chỉ tính số) — xem báo cáo.
//   node scripts/anh/ve_moi/G14-HH07000000.mjs "<gói>/moi"
import { P, seg, angleMark, rightAngle, dot, label, hinh, xuatTat, dist, foot, goc, ray, angleText } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/G14-HH07000000.mjs <thu_muc_ra>'); process.exit(2) }
let nKiem = 0
const ok = (t, c) => { nKiem++; console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const gan = (a, b, e = 1e-6) => Math.abs(a - b) < e
const thang = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) < 1e-6
const vuong = (v, a, b) => Math.abs((a.x - v.x) * (b.x - v.x) + (a.y - v.y) * (b.y - v.y)) < 1e-6
const pts = (...a) => a.map(dot).join('')

// ── HHC003486: ∠xOy = 70°, A ∈ tia Ox, tia At sao cho ∠xAt = 70° (At nằm trong góc xOy, cùng phía Oy), H ∈ Oy sao cho AH ⊥ Oy.
//    KHÔNG ký hiệu At ∥ Oy, AH ⊥ At (phải chứng minh), KHÔNG ghi ∠OAH. ──
{
  const O = P(60, 330)
  const X = ray(O, 0, 400), Y = ray(O, 70, 270)
  const A = ray(O, 0, 230)
  const T = ray(A, 70, 230)
  const H = foot(A, O, Y)
  ok('3486 ∠xOy = 70°', gan(goc(O, X, Y), 70, 1e-4))
  ok('3486 A thuộc tia Ox, A khác O', A.y === O.y && A.x > O.x && A.x < X.x)
  ok('3486 ∠xAt = 70° (x là phía Ax, tia ra xa O)', gan(goc(A, P(A.x + 100, A.y), T), 70, 1e-4))
  ok('3486 At cùng phía Oy với Ox (nằm trong góc xOy)', T.y < A.y && Y.y < O.y)
  ok('3486 H thuộc tia Oy (H nằm giữa O và đầu tia)', thang(O, H, Y) && dist(O, H) > 0 && dist(O, H) < dist(O, Y))
  ok('3486 AH ⊥ Oy', vuong(H, A, Y))
  ok('3486 (kiểm, KHÔNG ký hiệu) AH ⊥ At', vuong(A, H, T))
  ok('3486 (kiểm, KHÔNG ghi) ∠OAH = 20°', gan(goc(A, O, H), 20, 1e-4))
  const Xe = P(A.x + 130, A.y)
  hinh('HHC003486', [O, Xe, Y, A, T, H], [
    seg(O, Xe), seg(O, Y), seg(A, T), seg(A, H),
    rightAngle(H, A, Y, 13),
    angleMark(O, Xe, Y, 38), angleMark(A, Xe, T, 38),
    angleText(O, Xe, Y, '70°', 70), angleText(A, Xe, T, '70°', 70),
    pts(O, A, H, Xe, Y, T),
    label(O, 'O', -18, 20), label(A, 'A', 0, 34), label(H, 'H', -18, 6),
    label(Xe, 'x', 16, 6), label(Y, 'y', 12, -10), label(T, 't', 12, -10),
  ])
}

// ── HHC003487: ∠xOy = 45°, Om đối của Ox, On đối của Oy. Hình: hai đường thẳng xm, yn cắt nhau tại O. KHÔNG đánh dấu kề bù / đối đỉnh. ──
{
  const O = P(230, 200)
  const X = ray(O, 0, 170), Y = ray(O, 45, 170), M = ray(O, 180, 170), N = ray(O, 225, 170)
  ok('3487 ∠xOy = 45°', gan(goc(O, X, Y), 45, 1e-4))
  ok('3487 Om đối Ox (m, O, x thẳng hàng, O ở giữa)', thang(M, O, X) && (M.x - O.x) * (X.x - O.x) < 0)
  ok('3487 On đối Oy (n, O, y thẳng hàng, O ở giữa)', thang(N, O, Y) && (N.x - O.x) * (Y.x - O.x) < 0)
  ok('3487 bốn tia khác nhau', dist(X, Y) > 50 && dist(Y, M) > 50 && dist(M, N) > 50 && dist(N, X) > 50)
  ok('3487 (kiểm, KHÔNG ghi) ∠mOn = 45°, ∠yOm = 135°', gan(goc(O, M, N), 45, 1e-4) && gan(goc(O, Y, M), 135, 1e-4))
  hinh('HHC003487', [O, X, Y, M, N], [
    seg(M, X), seg(N, Y),
    angleMark(O, X, Y, 46), angleText(O, X, Y, '45°', 92),
    pts(O, X, Y, M, N),
    label(O, 'O', 4, 28), label(X, 'x', 16, 6), label(Y, 'y', 12, -10), label(M, 'm', -16, 6), label(N, 'n', -12, 26),
  ])
}

await xuatTat(dir)
console.log(`Đã chạy ${nKiem} phép kiểm.`)
