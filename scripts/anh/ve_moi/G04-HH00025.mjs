// G04-HH00025.mjs — 6 hình đề cho bài HH00025 "Hình học" (khối 7), hình gắn vào BÀI (đủ dữ kiện dựng của mọi ý).
//   node scripts/anh/ve_moi/G04-HH00025.mjs "<gói>/moi"
import { P, seg, tick, angleMark, rightAngle, dot, label, hinh, xuatTat, dist, mid, foot, inter, bisector, goc, lerp, ray, doiXung, num } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/G04-HH00025.mjs <thu_muc_ra>'); process.exit(2) }
let nKiem = 0
const ok = (t, c) => { nKiem++; console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const eq = (a, b) => Math.abs(a - b) < 1e-6
const thang = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) < 1e-6
const vuong = (v, a, b) => Math.abs((a.x - v.x) * (b.x - v.x) + (a.y - v.y) * (b.y - v.y)) < 1e-6
const song2 = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) < 1e-6
const pts = (...a) => a.map(dot).join('')
// dấu song song ">" đặt tại t của đoạn a→b
const para = (a, b, t = 0.5) => {
  const c = lerp(a, b, t), l = dist(a, b), d = P((b.x - a.x) / l, (b.y - a.y) / l), n = P(-d.y, d.x)
  const f = (v) => v.toFixed(2)
  const p1 = P(c.x - d.x * 5 + n.x * 6, c.y - d.y * 5 + n.y * 6), p2 = P(c.x - d.x * 5 - n.x * 6, c.y - d.y * 5 - n.y * 6), tip = P(c.x + d.x * 4, c.y + d.y * 4)
  return `<path d="M ${f(p1.x)} ${f(p1.y)} L ${f(tip.x)} ${f(tip.y)} L ${f(p2.x)} ${f(p2.y)}" fill="none"/>`
}
const nam = (a, b, c) => goc(a, b, c)   // góc tại a giữa tia ab, ac

// ── HHB000459+HHB000904: △MAB nhọn, MA < MB; C ∈ MB, MA = MC; ME phân giác AMB, E ∈ AB; F = MA ∩ CE (F trên tia MA, ngoài A). ──
{
  const M = P(50, 170), A = P(250, 50), B = P(330, 300)
  const dMB = dist(M, B)
  const C = lerp(M, B, dist(M, A) / dMB)
  const E = inter(M, bisector(M, A, B, 100), A, B)
  const F = inter(C, E, M, A)
  ok('459 MA < MB (lệch rõ)', dist(M, B) - dist(M, A) > 50)
  ok('459 nhọn: góc M, A, B < 90°', nam(M, A, B) < 90 && nam(A, M, B) < 90 && nam(B, M, A) < 90)
  ok('459 C thuộc cạnh MB, MA = MC', thang(M, C, B) && C.x > M.x && C.x < B.x && eq(dist(M, A), dist(M, C)))
  ok('459 ∠AME = ∠EMB', eq(goc(M, A, E), goc(M, E, B)))
  ok('459 E thuộc cạnh AB', thang(A, E, B) && E.x > A.x && E.x < B.x)
  ok('459 F thuộc MA, C-E-F thẳng hàng', thang(M, A, F) && thang(C, E, F))
  ok('459 F nằm trên tia MA ngoài A (A giữa M, F)', dist(M, F) > dist(M, A) + 20 && thang(M, A, F))
  ok('459 (kiểm, KHÔNG gạch) EA = EC', eq(dist(E, A), dist(E, C)))
  hinh('HHB000459+HHB000904', [M, A, B, C, E, F], [
    seg(M, F), seg(M, B), seg(A, B), seg(M, E), seg(C, F),
    tick(M, A, 1, 0.5), tick(M, C, 1, 0.5),
    angleMark(M, A, E, 34), angleMark(M, E, B, 46),
    pts(M, A, B, C, E, F),
    label(M, 'M', -18, 6), label(A, 'A', -16, -8), label(B, 'B', 14, 24), label(C, 'C', -8, 30), label(E, 'E', 18, 0), label(F, 'F', 2, -14),
  ])
}

// ── HHB000460+HHB000905: góc xAy nhọn; B ∈ Ax, C ∈ Ay, AB = AC; Az phân giác cắt BC tại D; DM ⊥ AB tại M; N ∈ AC, AN = AM. Vẽ thêm DN (ý c nêu). ──
{
  const A = P(60, 200), alpha = 35, L = 225
  const B = ray(A, alpha, L), C = ray(A, -alpha, L)
  const Xe = ray(A, alpha, L + 45), Ye = ray(A, -alpha, L + 45)
  const D = inter(A, P(A.x + 100, A.y), B, C)
  const Ze = P(D.x + 90, A.y)
  const M = foot(D, A, B)
  const N = lerp(A, C, dist(A, M) / dist(A, C))
  ok('460 góc xAy nhọn, không đặc biệt (≠ 60°, ≠ 90°)', goc(A, B, C) < 90 && Math.abs(goc(A, B, C) - 60) > 5)
  ok('460 AB = AC', eq(dist(A, B), dist(A, C)))
  ok('460 Az phân giác (∠BAD = ∠DAC)', eq(goc(A, B, D), goc(A, D, C)))
  ok('460 D thuộc BC và thuộc Az', thang(B, D, C) && D.y === A.y && D.x > A.x)
  ok('460 DM ⊥ AB tại M', vuong(M, D, A) && thang(A, M, B))
  ok('460 M thuộc cạnh AB (giữa A và B), N thuộc cạnh AC', dist(A, M) < dist(A, B) && dist(A, N) < dist(A, C) && thang(A, N, C))
  ok('460 AN = AM', eq(dist(A, N), dist(A, M)))
  ok('460 tick AB nằm ngoài đoạn AM (t=0.84 > AM/AB)', 0.84 > dist(A, M) / dist(A, B) + 0.05)
  ok('460 (kiểm, KHÔNG ô vuông) DN ⊥ AC, (KHÔNG gạch) DB = DC', vuong(N, D, A) && eq(dist(D, B), dist(D, C)))
  hinh('HHB000460+HHB000905', [A, B, C, D, M, N, Xe, Ye, Ze], [
    seg(A, Xe), seg(A, Ye), seg(A, Ze), seg(B, C), seg(D, M), seg(D, N),
    angleMark(B, A, C, 26), angleMark(C, A, B, 26), tick(A, M, 2, 0.5), tick(A, N, 2, 0.5),
    angleMark(A, B, D, 34), angleMark(A, D, C, 46),
    rightAngle(M, A, D, 13),
    pts(A, B, C, D, M, N),
    label(A, 'A', -18, 6), label(B, 'B', 4, -14), label(C, 'C', 4, 28), label(D, 'D', 16, -10), label(M, 'M', -4, -14), label(N, 'N', -4, 30),
    label(Xe, 'x', 14, -4), label(Ye, 'y', 14, 14), label(Ze, 'z', 14, 6),
  ])
}

// ── HHB000461: △ABC, AB < AC; AI phân giác BAC (I ∈ BC); K ∈ AC, AK = AB; O = AI ∩ BK; E = AB ∩ KI. Vẽ thêm EC (ý c nêu). ──
{
  const A = P(50, 230), th = 31
  const B = ray(A, th, 170), C = ray(A, -th, 260)
  const K = ray(A, -th, 170)
  const I = inter(A, P(A.x + 100, A.y), B, C)
  const O = inter(A, I, B, K)
  const E = inter(K, I, A, B)
  ok('461 AB < AC (lệch rõ)', dist(A, C) - dist(A, B) > 50)
  ok('461 AI phân giác (∠BAI = ∠IAC)', eq(goc(A, B, I), goc(A, I, C)))
  ok('461 I thuộc cạnh BC', thang(B, I, C) && I.y > B.y && I.y < C.y)
  ok('461 K thuộc cạnh AC, AK = AB', thang(A, K, C) && dist(A, K) < dist(A, C) && eq(dist(A, K), dist(A, B)))
  ok('461 O = AI ∩ BK nằm trong đoạn BK', thang(B, O, K) && O.y > B.y && O.y < K.y)
  ok('461 E thuộc đường AB, ngoài B (B giữa A, E); E, I, K thẳng hàng', thang(A, B, E) && dist(A, E) > dist(A, B) + 20 && thang(K, I, E))
  ok('461 (kiểm, KHÔNG ô vuông) AI ⊥ BK', vuong(O, A, B))
  ok('461 (kiểm, KHÔNG ký hiệu) BK ∥ EC, AE = AC', song2(B, K, E, C) && eq(dist(A, E), dist(A, C)))
  hinh('HHB000461', [A, B, C, K, I, O, E], [
    seg(A, E), seg(A, C), seg(B, C), seg(A, I), seg(B, K), seg(K, E), seg(E, C),
    tick(A, B, 1, 0.5), tick(A, K, 1, 0.5),
    angleMark(A, B, I, 34), angleMark(A, I, C, 46),
    pts(A, B, C, K, I, O, E),
    label(A, 'A', -18, 6), label(B, 'B', -16, 0), label(C, 'C', 10, 24), label(K, 'K', -18, 20), label(I, 'I', 16, -6), label(O, 'O', -4, -14), label(E, 'E', -2, -14),
  ])
}

// ── HHB000462+HHB000906: △ABC, M trung điểm BC, D ∈ tia đối MA, MD = MA; AH ⊥ BC, DK ⊥ BC (H, K ∈ BC). Vẽ thêm BD (△DMB, ý b nêu). ──
{
  const B = P(60, 200), C = P(360, 200), A = P(105, 70)
  const M = mid(B, C), D = doiXung(A, M)
  const H = foot(A, B, C), K = foot(D, B, C)
  ok('462 AB ≠ AC (tam giác thường, lệch rõ)', Math.abs(dist(A, B) - dist(A, C)) > 50)
  ok('462 MB = MC', eq(dist(M, B), dist(M, C)))
  ok('462 D thuộc tia đối MA (M giữa A, D), MD = MA', thang(A, M, D) && (A.y - M.y) * (D.y - M.y) < 0 && eq(dist(M, D), dist(M, A)))
  ok('462 AH ⊥ BC, DK ⊥ BC', vuong(H, A, M) && vuong(K, D, M) && H.y === 200 && K.y === 200)
  ok('462 H, K thuộc đoạn BC; H ≠ M, K ≠ M', H.x > B.x && H.x < C.x && K.x > B.x && K.x < C.x && dist(H, M) > 30)
  ok('462 (kiểm, KHÔNG ký hiệu) AC ∥ BD, AH = DK', song2(A, C, B, D) && eq(dist(A, H), dist(D, K)))
  hinh('HHB000462+HHB000906', [A, B, C, D, M, H, K], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(B, D), seg(A, H), seg(D, K),
    tick(M, B, 1), tick(M, C, 1), tick(A, M, 2), tick(M, D, 2),
    rightAngle(H, A, C, 13), rightAngle(K, D, B, 13),
    pts(A, B, C, D, M, H, K),
    label(A, 'A', -4, -14), label(B, 'B', -16, 6), label(C, 'C', 18, 8), label(D, 'D', 6, 34), label(M, 'M', 18, -10),
    label(H, 'H', -14, -10), label(K, 'K', 14, -10),
  ])
}

// ── HHB000463+HHB000907: góc xOy = 80°, Om phân giác, A ∈ Ox, qua A kẻ AE ∥ Oy (E ∈ Om); B ∈ Oy, OB = OA. Vẽ thêm BE (△BOE, ý b nêu). ──
{
  const O = P(60, 330), a80 = 80
  const A = ray(O, 0, 200), B = ray(O, 80, 200)
  const Xe = ray(O, 0, 340), Ye = ray(O, 80, 300), Me = ray(O, 40, 360)
  const Ydir = ray(O, 80, 100)
  const E = inter(A, P(A.x + (Ydir.x - O.x), A.y + (Ydir.y - O.y)), O, Me)
  ok('463 góc xOy = 80°', Math.abs(goc(O, Xe, Ye) - a80) < 1e-6)
  ok('463 Om phân giác (∠xOm = ∠mOy)', eq(goc(O, Xe, Me), goc(O, Me, Ye)))
  ok('463 A thuộc tia Ox, B thuộc tia Oy, OA = OB', thang(O, A, Xe) && thang(O, B, Ye) && eq(dist(O, A), dist(O, B)))
  ok('463 AE ∥ Oy', song2(A, E, O, Ye))
  ok('463 E thuộc tia Om', thang(O, E, Me) && E.x > O.x)
  ok('463 (kiểm, KHÔNG ghi) △AOE: ∠O = ∠E = 40°, ∠A = 100°', Math.abs(goc(O, A, E) - 40) < 1e-6 && Math.abs(goc(E, A, O) - 40) < 1e-6 && Math.abs(goc(A, O, E) - 100) < 1e-6)
  ok('463 (kiểm, KHÔNG ký hiệu) BE ∥ Ox, EA = EB', song2(B, E, O, Xe) && eq(dist(E, A), dist(E, B)))
  hinh('HHB000463+HHB000907', [O, A, B, E, Xe, Ye, Me], [
    seg(O, Xe), seg(O, Ye), seg(O, Me), seg(A, E), seg(B, E),
    tick(O, A, 1, 0.5), tick(O, B, 1, 0.62),
    para(O, B, 0.78), para(A, E, 0.5),
    angleMark(O, Xe, Me, 36), angleMark(O, Me, Ye, 48), angleMark(O, Xe, Ye, 74),
    num(ray(O, 62, 112), '80°', 0, 7),
    pts(O, A, B, E),
    label(O, 'O', -18, 12), label(A, 'A', 6, 28), label(B, 'B', -18, 4), label(E, 'E', 20, 22),
    label(Xe, 'x', 14, 6), label(Ye, 'y', 14, 6), label(Me, 'm', 14, -2),
  ])
}

// ── HHB000464+HHB000908: △ABC có AB = AC; AD phân giác góc A, D ∈ BC; DE ⊥ AB (E ∈ AB), DF ⊥ AC (F ∈ AC). ──
{
  const h = 170 * Math.tan(40 * Math.PI / 180)
  const A = P(200, 120), B = P(200 - h, 290), C = P(200 + h, 290)
  const D = inter(A, P(200, 200), B, C)
  const E = foot(D, A, B), F = foot(D, A, C)
  ok('464 AB = AC', eq(dist(A, B), dist(A, C)))
  ok('464 không đều (BC ≠ AB, lệch rõ)', Math.abs(dist(B, C) - dist(A, B)) > 50)
  ok('464 AD phân giác (∠BAD = ∠DAC), D thuộc BC', eq(goc(A, B, D), goc(A, D, C)) && thang(B, D, C))
  ok('464 DE ⊥ AB, DF ⊥ AC', vuong(E, D, A) && vuong(F, D, A) && thang(A, E, B) && thang(A, F, C))
  ok('464 E thuộc cạnh AB, F thuộc cạnh AC', dist(A, E) < dist(A, B) && dist(A, F) < dist(A, C))
  ok('464 tick AB nằm ngoài đoạn AE (t=0.8 > AE/AB)', 0.8 > dist(A, E) / dist(A, B) + 0.05)
  ok('464 (kiểm, KHÔNG ký hiệu) DB = DC, AD ⊥ BC, DE = DF', eq(dist(D, B), dist(D, C)) && vuong(D, A, B) && eq(dist(D, E), dist(D, F)))
  hinh('HHB000464+HHB000908', [A, B, C, D, E, F], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(D, E), seg(D, F),
    angleMark(B, A, C, 26), angleMark(C, A, B, 26),
    angleMark(A, B, D, 36), angleMark(A, D, C, 48),
    rightAngle(E, A, D, 12), rightAngle(F, A, D, 12),
    pts(A, B, C, D, E, F),
    label(A, 'A', 0, -14), label(B, 'B', -16, 14), label(C, 'C', 16, 14), label(D, 'D', 0, 34), label(E, 'E', -18, 4), label(F, 'F', 18, 4),
  ])
}

await xuatTat(dir)
console.log(`Đã chạy ${nKiem} phép kiểm.`)
