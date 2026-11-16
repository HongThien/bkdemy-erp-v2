// ve_hinh_k7_thang_hang.mjs — 5 hình cho 5 ví dụ của 3 bài Hình–Học K7 "Thẳng hàng" (HH00170–172), dựng theo hình trong "thẳng hàng.pdf" của Thùy.
//   node scripts/anh/ve_hinh_k7_thang_hang.mjs <thu_muc_ra>
// Đánh dấu CHỈ giả thiết (gạch bằng nhau, góc bằng nhau, trung điểm). KHÔNG nối sẵn 3 điểm phải chứng minh thẳng hàng; không vẽ đường phụ của lời giải.
import { P, seg, tick, angleMark, dot, label, hinh, xuatTat, dist, mid, ray, goc } from './ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_hinh_k7_thang_hang.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const eq = (a, b) => Math.abs(a - b) < 1e-6
const thang = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) < 1e-6
const pts = (...a) => a.map(dot).join('')

// ── Hình 1 · HH00170 ví dụ 1: AB = AC, AD là phân giác ∠BAC (D ∈ BC), I trong tam giác, BI = CI. Vẽ AD (giả thiết). ──
{
  const A = P(200, 40), B = P(40, 320), C = P(360, 320), D = P(200, 320), I = P(200, 190)
  ok('H1 AB = AC', eq(dist(A, B), dist(A, C)))
  ok('H1 BI = CI', eq(dist(B, I), dist(C, I)))
  ok('H1 AD phân giác ∠BAC', eq(goc(A, B, D), goc(A, D, C)))
  ok('H1 D thuộc BC', D.y === B.y && D.x > B.x && D.x < C.x)
  hinh('HH00170_vd1', [A, B, C, D, I], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(B, I), seg(C, I),
    tick(A, B, 1), tick(A, C, 1), tick(B, I, 2), tick(C, I, 2),
    angleMark(A, B, D, 40), angleMark(A, D, C, 52),
    pts(A, B, C, D, I),
    label(A, 'A', 0, -14), label(B, 'B', -14, 16), label(C, 'C', 16, 16), label(D, 'D', 0, 30), label(I, 'I', 18, 4),
  ])
}
// ── Hình 2 · HH00170 ví dụ 2: AB = AC, D trung điểm BC, I trong tam giác, IB = IC. KHÔNG vẽ AD. ──
{
  const A = P(200, 40), B = P(40, 320), C = P(360, 320), D = mid(B, C), I = P(200, 190)
  ok('H2 AB = AC', eq(dist(A, B), dist(A, C)))
  ok('H2 IB = IC', eq(dist(I, B), dist(I, C)))
  ok('H2 DB = DC', eq(dist(D, B), dist(D, C)))
  hinh('HH00170_vd2', [A, B, C, D, I], [
    seg(A, B), seg(A, C), seg(B, C), seg(B, I), seg(C, I),
    tick(A, B, 1), tick(A, C, 1), tick(B, I, 2), tick(C, I, 2), tick(B, D, 3), tick(D, C, 3),
    pts(A, B, C, D, I),
    label(A, 'A', 0, -14), label(B, 'B', -14, 16), label(C, 'C', 16, 16), label(D, 'D', 0, 30), label(I, 'I', 18, 4),
  ])
}
// ── Hình 3 · HH00171 ví dụ 1: A, M, B thẳng hàng (M giữa), C và D hai phía của AB, ∠AMC = ∠BMD. ──
{
  const A = P(40, 200), M = P(220, 200), B = P(400, 200)
  const C = ray(M, 130, 150), D = ray(M, -50, 150)
  ok('H3 ∠AMC = ∠BMD', eq(goc(M, A, C), goc(M, B, D)))
  ok('H3 C, D khác phía AB', (C.y - A.y) * (D.y - A.y) < 0)
  ok('H3 (kiểm, KHÔNG nối sẵn) C, M, D thẳng hàng', thang(C, M, D))
  hinh('HH00171_vd1', [A, M, B, C, D], [
    seg(A, B), seg(M, C), seg(M, D),
    angleMark(M, A, C, 38), angleMark(M, B, D, 38),
    pts(A, M, B, C, D),
    label(A, 'A', -14, 6), label(M, 'M', 16, -12), label(B, 'B', 16, 6), label(C, 'C', -14, -8), label(D, 'D', 16, 16),
  ])
}
// ── Hình 4 · HH00171 ví dụ 2: M trung điểm BC; CD ∥ AB, CD = AB; D, A hai phía BC. KHÔNG vẽ AM, MD. ──
{
  const k = 46, S = (x, y) => P(40 + k * x, 200 - k * y)
  const Bm = { x: 0, y: 0 }, Cm = { x: 6, y: 0 }, Am = { x: 1.6, y: 3 }
  const Dm = { x: Cm.x + (Bm.x - Am.x), y: Cm.y + (Bm.y - Am.y) }      // CD ∥ AB, CD = AB, D khác phía A đối với BC
  const A = S(Am.x, Am.y), B = S(Bm.x, Bm.y), C = S(Cm.x, Cm.y), D = S(Dm.x, Dm.y), M = mid(B, C)
  ok('H4 CD = AB', eq(dist(C, D), dist(A, B)))
  ok('H4 CD ∥ AB', eq((B.x - A.x) * (D.y - C.y), (B.y - A.y) * (D.x - C.x)))
  ok('H4 A, D khác phía BC', (A.y - B.y) * (D.y - B.y) < 0)
  ok('H4 (kiểm, KHÔNG vẽ) A, M, D thẳng hàng', thang(A, M, D))
  hinh('HH00171_vd2', [A, B, C, D, M], [
    seg(A, B), seg(B, C), seg(C, A), seg(C, D),
    tick(A, B, 1), tick(C, D, 1), tick(B, M, 2), tick(M, C, 2),
    pts(A, B, C, D, M),
    label(A, 'A', 0, -14), label(B, 'B', -16, 6), label(C, 'C', 16, -8), label(D, 'D', 12, 22), label(M, 'M', 0, -14),
  ])
}
// ── Hình 5 · HH00172 ví dụ: M, N trung điểm AB, AC; M trung điểm CD, N trung điểm BE. KHÔNG nối D–A–E. ──
{
  const k = 36, S = (x, y) => P(170 + k * x, 200 - k * y)
  const Am = { x: 2.5, y: 4 }, Bm = { x: 0, y: 0 }, Cm = { x: 6, y: 0 }
  const Mm = { x: (Am.x + Bm.x) / 2, y: (Am.y + Bm.y) / 2 }, Nm = { x: (Am.x + Cm.x) / 2, y: (Am.y + Cm.y) / 2 }
  const Dm = { x: 2 * Mm.x - Cm.x, y: 2 * Mm.y - Cm.y }, Em = { x: 2 * Nm.x - Bm.x, y: 2 * Nm.y - Bm.y }
  const A = S(Am.x, Am.y), B = S(Bm.x, Bm.y), C = S(Cm.x, Cm.y), M = S(Mm.x, Mm.y), N = S(Nm.x, Nm.y), D = S(Dm.x, Dm.y), E = S(Em.x, Em.y)
  ok('H5 MA = MB, MC = MD', eq(dist(M, A), dist(M, B)) && eq(dist(M, C), dist(M, D)))
  ok('H5 NA = NC, NB = NE', eq(dist(N, A), dist(N, C)) && eq(dist(N, B), dist(N, E)))
  ok('H5 (kiểm, KHÔNG nối) D, A, E thẳng hàng', thang(D, A, E))
  hinh('HH00172_vd1', [A, B, C, D, E, M, N], [
    seg(A, B), seg(A, C), seg(B, C), seg(C, D), seg(B, E),
    tick(A, M, 1), tick(M, B, 1), tick(A, N, 2), tick(N, C, 2), tick(M, C, 3), tick(M, D, 3), tick(N, B, 4), tick(N, E, 4),
    pts(A, B, C, D, E, M, N),
    label(A, 'A', 0, -14), label(B, 'B', -14, 18), label(C, 'C', 16, 18), label(D, 'D', -16, -8), label(E, 'E', 16, -8),
    label(M, 'M', -26, 12), label(N, 'N', 26, 12),
  ])
}
await xuatTat(dir)
