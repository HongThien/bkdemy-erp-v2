// G13-HH07000000.mjs — 6 hình đề (câu đơn, khối 7, bài HH07000000 "Chưa phân dạng — Hình học 7").
//   node scripts/anh/ve_moi/G13-HH07000000.mjs "<gói>/moi"
import { P, seg, tick, angleMark, rightAngle, dot, label, hinh, xuatTat, dist, mid, foot, inter, bisector, goc, lerp, ray, num, angleText, labelOut } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/G13-HH07000000.mjs <thu_muc_ra>'); process.exit(2) }
let nKiem = 0
const ok = (t, c) => { nKiem++; console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const eq = (a, b, e = 1e-6) => Math.abs(a - b) < e
const thang = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) < 1e-6
const song2 = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) < 1e-6
const pts = (...a) => a.map(dot).join('')
// phía của điểm so với đường thẳng ab (dấu)
const phia = (a, b, p) => Math.sign((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x))

// ── HHC003470: AB, CD bị cát tuyến MN cắt tại P, Q; M, P, Q, N theo thứ tự; B, D cùng phía MN.
//    Số đo thật (giải từ đề): ∠MPB = 30°, ∠APM = 150°, ∠PQD = 30° ⇒ dựng đúng; KHÔNG ghi số, KHÔNG đánh dấu song song / góc bằng nhau. ──
{
  const M = P(40, 200), Pp = P(180, 200), Q = P(340, 200), N = P(480, 200)
  const B = ray(Pp, 150, 120), A = ray(Pp, -30, 120)
  const D = ray(Q, 150, 120), C = ray(Q, -30, 120)
  ok('470 M, P, Q, N thẳng hàng theo thứ tự', thang(M, Pp, N) && thang(M, Q, N) && M.x < Pp.x && Pp.x < Q.x && Q.x < N.x)
  ok('470 P nằm giữa A và B, Q nằm giữa C và D', thang(A, Pp, B) && Pp.x > B.x && Pp.x < A.x && thang(C, Q, D) && Q.x > D.x && Q.x < C.x)
  ok('470 B, D cùng phía đối với MN', phia(M, N, B) === phia(M, N, D) && phia(M, N, B) !== 0)
  ok('470 ∠APM = 5·∠MPB (150° = 5·30°)', eq(goc(Pp, A, M), 5 * goc(Pp, M, B), 1e-6))
  ok('470 ∠APM + ∠MPB + ∠PQD = 210°', eq(goc(Pp, A, M) + goc(Pp, M, B) + goc(Q, Pp, D), 210, 1e-6))
  ok('470 (kiểm, KHÔNG ký hiệu) AB ∥ CD', song2(A, B, C, D))
  hinh('HHC003470', [M, N, A, B, C, D], [
    seg(M, N), seg(A, B), seg(C, D),
    pts(M, N, Pp, Q, A, B, C, D),
    label(M, 'M', -4, 30), label(N, 'N', 4, 30), label(Pp, 'P', -4, 30), label(Q, 'Q', -4, 30),
    label(A, 'A', 20, 14), label(B, 'B', -14, -10), label(C, 'C', 20, 14), label(D, 'D', -14, -10),
  ])
}

// ── HHC003471: ABC thường, M ∈ BC (vị trí bất kỳ, KHÔNG phải chân phân giác); ME ∥ AB, E ∈ AC; MF ∥ AC, F ∈ AB. Nối MA (đề nêu). ──
{
  const A = P(140, 40), B = P(40, 260), C = P(400, 260)
  const M = P(300, 260)
  const E = inter(M, P(M.x + (A.x - B.x), M.y + (A.y - B.y)), A, C)
  const F = inter(M, P(M.x + (A.x - C.x), M.y + (A.y - C.y)), A, B)
  const chanPG = lerp(B, C, dist(A, B) / (dist(A, B) + dist(A, C)))
  ok('471 tam giác ABC thường (ba cạnh đôi một khác nhau rõ)', Math.abs(dist(A, B) - dist(A, C)) > 50 && Math.abs(dist(A, B) - dist(B, C)) > 50 && Math.abs(dist(A, C) - dist(B, C)) > 15)
  ok('471 M thuộc đoạn BC', M.y === 260 && M.x > B.x && M.x < C.x)
  ok('471 M không trùng chân phân giác góc A (cách ≥ 60 px)', dist(M, chanPG) > 60)
  ok('471 ME ∥ AB, E thuộc đoạn AC', song2(M, E, A, B) && thang(A, E, C) && E.x > A.x && E.x < C.x)
  ok('471 MF ∥ AC, F thuộc đoạn AB', song2(M, F, A, C) && thang(A, F, B) && F.x < A.x && F.x > B.x)
  ok('471 (kiểm, KHÔNG ký hiệu) MA chưa phân giác: ∠EMA ≠ ∠FMA', Math.abs(goc(M, E, A) - goc(M, F, A)) > 5)
  hinh('HHC003471', [A, B, C, M, E, F], [
    seg(A, B), seg(A, C), seg(B, C), seg(M, E), seg(M, F), seg(A, M),
    pts(A, B, C, M, E, F),
    label(A, 'A', -2, -14), label(B, 'B', -16, 20), label(C, 'C', 18, 20), label(M, 'M', 0, 34),
    label(E, 'E', 18, -4), label(F, 'F', -18, 6),
  ])
}

// ── HHC003472: ∠xOy = 70° (chỉ giả thiết; KHÔNG vẽ góc đối đỉnh vì đó là đáp án). ──
{
  const O = P(60, 220), X = ray(O, 0, 260), Y = ray(O, 70, 230)
  ok('472 ∠xOy = 70°', eq(goc(O, X, Y), 70, 1e-6))
  hinh('HHC003472', [O, X, Y], [
    seg(O, X), seg(O, Y),
    angleMark(O, X, Y, 40),
    angleText(O, X, Y, '70°', 82),
    dot(O),
    label(O, 'O', -18, 22), labelOut(X, 'x', O, 18), labelOut(Y, 'y', O, 18),
  ])
}

// ── HHC003477: mn ∩ ab = O, ∠mOb = 60°; Ot phân giác của ∠nOb (dữ kiện ý b). KHÔNG đánh dấu điều cần chứng minh (Ob phân giác mOt). ──
{
  const O = P(220, 190), L = 160
  const m = ray(O, 180, L), n = ray(O, 0, L), a = ray(O, 60, L), b = ray(O, 240, L)
  const t = bisector(O, n, b, L)
  ok('477 m, O, n thẳng hàng; a, O, b thẳng hàng', thang(m, O, n) && thang(a, O, b) && m.x < O.x && n.x > O.x && a.y < O.y && b.y > O.y)
  ok('477 ∠mOb = 60°', eq(goc(O, m, b), 60, 1e-6))
  ok('477 Ot phân giác ∠nOb: ∠nOt = ∠tOb', eq(goc(O, n, t), goc(O, t, b), 1e-6))
  ok('477 t nằm trong góc nOb (∠nOt + ∠tOb = ∠nOb)', eq(goc(O, n, t) + goc(O, t, b), goc(O, n, b), 1e-6))
  ok('477 (kiểm, KHÔNG ký hiệu) Ob nằm giữa Om, Ot và mOb = bOt', eq(goc(O, m, b) + goc(O, b, t), goc(O, m, t), 1e-6) && eq(goc(O, m, b), goc(O, b, t), 1e-6))
  hinh('HHC003477', [m, n, a, b, t], [
    seg(m, n), seg(a, b), seg(O, t),
    angleMark(O, m, b, 34), angleText(O, m, b, '60°', 78),
    angleMark(O, n, t, 46), angleMark(O, t, b, 58),
    dot(O),
    label(O, 'O', -14, -10),
    labelOut(m, 'm', O, 18), labelOut(n, 'n', O, 18), labelOut(a, 'a', O, 18), labelOut(b, 'b', O, 18), labelOut(t, 't', O, 18),
  ])
}

// ── HHC003480: đường thẳng ab cắt xy tại O (hình đề; KHÔNG vẽ tia phân giác — đó là yêu cầu ý b). Góc aOy tổng quát (125°). ──
{
  const O = P(220, 190), L = 160
  const x = ray(O, 180, L), y = ray(O, 0, L), a = ray(O, 125, L), b = ray(O, 305, L)
  ok('480 x, O, y thẳng hàng; a, O, b thẳng hàng', thang(x, O, y) && thang(a, O, b) && x.x < O.x && y.x > O.x)
  ok('480 Oa và Ob ở hai nửa mặt phẳng đối nhau bờ xy', a.y < O.y && b.y > O.y)
  ok('480 không vuông góc / không đặc biệt (∠aOy = 125°)', eq(goc(O, a, y), 125, 1e-6))
  hinh('HHC003480', [x, y, a, b], [
    seg(x, y), seg(a, b),
    dot(O),
    label(O, 'O', 16, -10),
    labelOut(x, 'x', O, 18), labelOut(y, 'y', O, 18), labelOut(a, 'a', O, 18), labelOut(b, 'b', O, 18),
  ])
}

// ── HHC003485: ∠xOy = 80°, Oz nằm giữa Ox, Oy, ∠xOz = 40°; Om là tia đối của Ox (ý c). KHÔNG ghi ∠zOy, ∠mOz, KHÔNG đánh dấu zOy = xOz. ──
{
  const O = P(230, 260), L = 250
  const X = ray(O, 0, L), Y = ray(O, 80, 230), Z = ray(O, 40, 230), M = ray(O, 180, 200)
  ok('485 ∠xOy = 80°', eq(goc(O, X, Y), 80, 1e-6))
  ok('485 ∠xOz = 40°', eq(goc(O, X, Z), 40, 1e-6))
  ok('485 Oz nằm giữa Ox, Oy', eq(goc(O, X, Z) + goc(O, Z, Y), goc(O, X, Y), 1e-6))
  ok('485 Om là tia đối của Ox', thang(X, O, M) && M.x < O.x && X.x > O.x)
  hinh('HHC003485', [X, Y, Z, M, O], [
    seg(O, X), seg(O, Y), seg(O, Z), seg(O, M),
    angleMark(O, X, Z, 44), angleMark(O, X, Y, 100),
    num(ray(O, 20, 74), '40°', 0, 8, 20), num(ray(O, 62, 124), '80°', 0, 8, 20),
    dot(O),
    label(O, 'O', 6, 28),
    labelOut(X, 'x', O, 18), labelOut(Y, 'y', O, 18), labelOut(Z, 'z', O, 18), labelOut(M, 'm', O, 18),
  ])
}

await xuatTat(dir)
console.log(`Đã chạy ${nKiem} phép kiểm.`)
