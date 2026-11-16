// G12-HH07000000.mjs — hình đề cho câu đơn bài HH07000000 "Chưa phân dạng — Hình học 7" (HHC003439/40/59/60/69; HHC003461 không cần hình).
//   node scripts/anh/ve_moi/G12-HH07000000.mjs "<gói>/moi"
import { P, seg, tick, angleMark, rightAngle, dot, label, num, hinh, xuatTat, dist, mid, foot, inter, bisector, goc, lerp, ray, angleText } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/G12-HH07000000.mjs <thu_muc_ra>'); process.exit(2) }
let nKiem = 0
const ok = (t, c) => { nKiem++; console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const eq = (a, b) => Math.abs(a - b) < 1e-6
const thang = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) < 1e-6
const vuong = (v, a, b) => Math.abs((a.x - v.x) * (b.x - v.x) + (a.y - v.y) * (b.y - v.y)) < 1e-6
const song2 = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) < 1e-6
const pts = (...a) => a.map(dot).join('')

// ── HHC003439: aOb, bOc kề bù, aOb = 60°; Om phân giác bOc (ý b). KHÔNG ghi bOc = 120°, KHÔNG đánh dấu Ob là phân giác aOm. ──
{
  const O = P(280, 300)
  const a = ray(O, 180, 200), c = ray(O, 0, 200)
  const b = ray(O, 120, 180)                    // aOb = 60°
  const m = ray(O, 60, 180)                     // Om phân giác bOc
  ok('3439 Oa, Oc đối nhau (a, O, c thẳng hàng, O giữa)', thang(a, O, c) && (a.x - O.x) * (c.x - O.x) < 0)
  ok('3439 ∠aOb = 60°', eq(goc(O, a, b), 60))
  ok('3439 ∠aOb + ∠bOc = 180° (kề bù)', eq(goc(O, a, b) + goc(O, b, c), 180))
  ok('3439 Om phân giác bOc (∠bOm = ∠mOc)', eq(goc(O, b, m), goc(O, m, c)))
  ok('3439 b, m cùng phía đường thẳng ac', b.y < O.y && m.y < O.y)
  hinh('HHC003439', [O, a, c, b, m], [
    seg(a, c), seg(O, b), seg(O, m),
    angleMark(O, a, b, 28), angleText(O, a, b, '60°', 74),
    angleMark(O, b, m, 40, 2), angleMark(O, m, c, 54, 2),
    dot(O), label(O, 'O', 0, 34),
    label(a, 'a', -16, 8), label(c, 'c', 18, 8), label(b, 'b', -8, -12), label(m, 'm', 8, -12),
  ])
}

// ── HHC003440: xOy = 100°, Oa nằm giữa, xOa = 50° (ý a hỏi Oa có phải phân giác không ⇒ KHÔNG đánh dấu aOy); Ob tia đối Oa (ý b). ──
{
  const O = P(240, 190)
  const x = ray(O, 15, 200), y = ray(O, 115, 185), a = ray(O, 65, 160), bb = ray(O, 245, 150)
  ok('3440 ∠xOy = 100°', eq(goc(O, x, y), 100))
  ok('3440 ∠xOa = 50°', eq(goc(O, x, a), 50))
  ok('3440 Oa nằm giữa Ox, Oy (xOa + aOy = xOy)', eq(goc(O, x, a) + goc(O, a, y), goc(O, x, y)))
  ok('3440 Ob là tia đối của Oa (a, O, b thẳng hàng, O giữa)', thang(a, O, bb) && (a.x - O.x) * (bb.x - O.x) < 0)
  const ang100 = ray(O, 90, 108)
  hinh('HHC003440', [O, x, y, a, bb], [
    seg(O, x), seg(O, y), seg(O, a), seg(O, bb),
    angleMark(O, x, a, 34), angleText(O, x, a, '50°', 62),
    angleMark(O, x, y, 94), num(ang100, '100°', 0, 8, 22),
    dot(O), label(O, 'O', -22, 6),
    label(x, 'x', 18, 6), label(y, 'y', -14, -4), label(a, 'a', 12, -10), label(bb, 'b', -14, 22),
  ])
}

// ── HHC003459: xOy = 70°, A ∈ Ox, At với xAt = 70° (At trong góc xOy); AH ⊥ Oy tại H. KHÔNG ký hiệu At ∥ Oy, AH ⊥ At; KHÔNG ghi OAH. ──
{
  const O = P(60, 320)
  const A = ray(O, 0, 240)
  const x = ray(O, 0, 340), y = ray(O, 70, 270)
  const t = P(A.x + 250 * Math.cos(70 * Math.PI / 180), A.y - 250 * Math.sin(70 * Math.PI / 180))
  const H = foot(A, O, y)
  ok('3459 ∠xOy = 70°', eq(goc(O, x, y), 70))
  ok('3459 ∠xAt = 70°', eq(goc(A, x, t), 70))
  ok('3459 A thuộc tia Ox, t cùng phía y đối với Ox', A.x > O.x && thang(O, A, x) && t.y < O.y && y.y < O.y)
  ok('3459 H thuộc tia Oy (H giữa O và y)', thang(O, H, y) && dist(O, H) > 20 && dist(O, H) < dist(O, y))
  ok('3459 AH ⊥ Oy', vuong(H, A, O))
  ok('3459 (kiểm, KHÔNG ký hiệu) At ∥ Oy, AH ⊥ At', song2(A, t, O, y) && vuong(A, H, t))
  hinh('HHC003459', [O, A, x, y, t, H], [
    seg(O, x), seg(O, y), seg(A, t), seg(A, H),
    angleMark(O, x, y, 34), angleText(O, x, y, '70°', 72),
    angleMark(A, x, t, 34), angleText(A, x, t, '70°', 72),
    rightAngle(H, A, O, 14),
    pts(O, A, H),
    label(O, 'O', -16, 12), label(A, 'A', 6, 28), label(H, 'H', -18, 4),
    label(x, 'x', 18, 8), label(y, 'y', 14, -8), label(t, 't', 14, -6),
  ])
}

// ── HHC003460: ΔABC, M ∈ AB, MN ∥ BC (N ∈ AC); My phân giác AMN, Bz phân giác ABC, Mt ⊥ Bz (Mt giữa MN và MB).
//    KHÔNG đánh dấu AMN = ABC, My ∥ Bz, Mt phân giác BMN. ──
{
  const B = P(40, 320), C = P(380, 320), A = P(250, 70)
  const M = lerp(B, A, 0.68)
  const N = inter(M, P(M.x + 100, M.y), A, C)
  const Ybis = bisector(M, A, N, 1)
  const Zbis = bisector(B, A, C, 1)
  const Z = P(B.x + (Zbis.x - B.x) * 330, B.y + (Zbis.y - B.y) * 330)
  const Y = P(M.x + (Ybis.x - M.x) * 150, M.y + (Ybis.y - M.y) * 150)
  const F = foot(M, B, Z)                              // chân vuông góc hạ từ M xuống Bz
  const Tt = lerp(M, F, 1.3)                           // đầu tia Mt (kéo qua Bz một đoạn)
  ok('3460 tam giác ABC thường (ba cạnh khác nhau rõ)', Math.abs(dist(A, B) - dist(A, C)) > 30 && Math.abs(dist(A, B) - dist(B, C)) > 10 && Math.abs(dist(A, C) - dist(B, C)) > 30)
  ok('3460 M thuộc cạnh AB, khác A, B', thang(A, M, B) && dist(M, A) > 40 && dist(M, B) > 40)
  ok('3460 MN ∥ BC, N thuộc cạnh AC', song2(M, N, B, C) && thang(A, N, C) && N.x > A.x && N.x < C.x)
  ok('3460 My phân giác AMN (∠AMy = ∠yMN)', eq(goc(M, A, Y), goc(M, Y, N)))
  ok('3460 Bz phân giác ABC (∠ABz = ∠zBC)', eq(goc(B, A, Z), goc(B, Z, C)))
  ok('3460 Mt ⊥ Bz', vuong(F, M, Z) && thang(M, F, Tt))
  ok('3460 Mt nằm giữa MN và MB', eq(goc(M, N, Tt) + goc(M, Tt, B), goc(M, N, B)))
  ok('3460 (kiểm, KHÔNG ký hiệu) AMN = ABC, My ∥ Bz', eq(goc(M, A, N), goc(B, A, C)) && song2(M, Y, B, Z))
  hinh('HHC003460', [A, B, C, M, N, Y, Z, Tt], [
    seg(A, B), seg(B, C), seg(C, A), seg(M, N), seg(M, Y), seg(B, Z), seg(M, Tt),
    angleMark(M, A, Y, 28), angleMark(M, Y, N, 40),
    angleMark(B, A, Z, 42, 2), angleMark(B, Z, C, 58, 2),
    rightAngle(F, M, Z, 12),
    pts(A, B, C, M, N),
    label(A, 'A', 0, -14), label(B, 'B', -14, 24), label(C, 'C', 18, 22), label(M, 'M', -20, 4), label(N, 'N', 22, -4),
    label(Y, 'y', 10, -12), label(Z, 'z', 14, -4), label(Tt, 't', 16, 6),
  ])
}

// ── HHC003469: xOy = 60°, M ∈ tia Oy, Mz ∥ Ox cùng hướng, On phân giác xOy, Mp phân giác zMy. KHÔNG ký hiệu zMy = xOy, Mp ∥ On. ──
{
  const O = P(60, 330)
  const L = 200
  const M = ray(O, 60, L)
  const x = ray(O, 0, 340), y = ray(O, 60, 300)
  const z = P(M.x + 250, M.y)
  const n = ray(O, 30, 200)
  const p = P(M.x + 200 * Math.cos(30 * Math.PI / 180), M.y - 200 * Math.sin(30 * Math.PI / 180))
  ok('3469 ∠xOy = 60°', eq(goc(O, x, y), 60))
  ok('3469 M thuộc tia Oy, khác O', thang(O, M, y) && dist(O, M) > 50 && dist(O, M) < dist(O, y))
  ok('3469 Mz ∥ Ox cùng hướng', song2(M, z, O, x) && z.x > M.x)
  ok('3469 z cùng phía x đối với đường thẳng Oy', ((y.x - O.x) * (z.y - O.y) - (y.y - O.y) * (z.x - O.x)) * ((y.x - O.x) * (x.y - O.y) - (y.y - O.y) * (x.x - O.x)) > 0)
  ok('3469 On phân giác xOy', eq(goc(O, x, n), goc(O, n, y)))
  const yM = ray(M, 60, 100)                              // một điểm trên tia My (phía xa O)
  ok('3469 Mp phân giác zMy', eq(goc(M, z, p), goc(M, p, yM)) && eq(goc(M, z, yM), 60))
  ok('3469 (kiểm, KHÔNG ký hiệu) Mp ∥ On', song2(M, p, O, n))
  hinh('HHC003469', [O, x, y, M, z, n, p], [
    seg(O, x), seg(O, y), seg(M, z), seg(O, n), seg(M, p),
    angleMark(O, x, n, 28, 2), angleMark(O, n, y, 44, 2),
    angleMark(M, z, p, 28, 1), angleMark(M, p, yM, 44, 1),
    angleMark(O, x, y, 64), num(ray(O, 46, 100), '60°', 0, 8, 22),
    dot(O), dot(M),
    label(O, 'O', -18, 12), label(M, 'M', -20, 6),
    label(x, 'x', 18, 8), label(y, 'y', 14, -8), label(z, 'z', 18, 8), label(n, 'n', 16, 0), label(p, 'p', 12, -10),
  ])
}

await xuatTat(dir)
console.log(`Đã chạy ${nKiem} phép kiểm.`)
