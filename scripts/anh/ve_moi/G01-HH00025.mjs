// G01-HH00025.mjs — 6 hình đề cho bài HH00025 "Hình học" (khối 7), hình gắn vào BÀI (đủ dữ kiện dựng của mọi ý).
//   node scripts/anh/ve_moi/G01-HH00025.mjs "<gói>/moi"
import { P, seg, tick, angleMark, rightAngle, dot, label, hinh, xuatTat, dist, mid, foot, inter, bisector, goc, lerp, ray, doiXung, labelOut, trongTam } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/G01-HH00025.mjs <thu_muc_ra>'); process.exit(2) }
let nKiem = 0
const ok = (t, c) => { nKiem++; console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const eq = (a, b) => Math.abs(a - b) < 1e-6
const thang = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) < 1e-6
const vuong = (v, a, b) => Math.abs((a.x - v.x) * (b.x - v.x) + (a.y - v.y) * (b.y - v.y)) < 1e-6
const song2 = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) < 1e-6
const pts = (...a) => a.map(dot).join('')

// ── HHB000441: ABC vuông tại A, E ∈ BC, BA = BE, BK phân giác góc B, K ∈ AC. Vẽ thêm EK (△EBK, EK ở ý a, b). ──
{
  const A = P(60, 330), B = P(60, 100), C = P(390, 330)
  const E = lerp(B, C, dist(B, A) / dist(B, C))
  const K = inter(B, bisector(B, A, C, 100), A, C)
  ok('441 vuông tại A (AB ⊥ AC)', vuong(A, B, C))
  ok('441 AB ≠ AC (tam giác không vuông cân)', Math.abs(dist(A, B) - dist(A, C)) > 50)
  ok('441 E thuộc đoạn BC', thang(B, E, C) && E.x > B.x && E.x < C.x)
  ok('441 BA = BE', eq(dist(B, A), dist(B, E)))
  ok('441 K thuộc đoạn AC', K.y === 330 && K.x > A.x && K.x < C.x)
  ok('441 ∠ABK = ∠EBK', eq(goc(B, A, K), goc(B, K, E)))
  ok('441 (kiểm, KHÔNG gạch) AK = KE', eq(dist(A, K), dist(K, E)))
  ok('441 (kiểm, KHÔNG ô vuông) EK ⊥ BC', vuong(E, K, B))
  const G = trongTam([A, B, C])
  hinh('HHB000441', [A, B, C, E, K], [
    seg(A, B), seg(A, C), seg(B, C), seg(B, K), seg(E, K),
    rightAngle(A, B, C, 16),
    tick(B, A, 1), tick(B, E, 1),
    angleMark(B, A, K, 38), angleMark(B, K, E, 50),
    pts(A, B, C, E, K),
    label(A, 'A', -18, 20), label(B, 'B', 0, -14), label(C, 'C', 18, 18), label(E, 'E', 20, -6), label(K, 'K', 4, 32),
  ])
}

// ── HHB000442: ABC; Ax qua trung điểm M của BC; BE ⊥ Ax, CF ⊥ Ax. Vẽ thêm CE, BF (ý c, d nêu). ──
{
  const A = P(110, 50), B = P(40, 260), C = P(380, 260)
  const M = mid(B, C)
  const E = foot(B, A, M), F = foot(C, A, M)
  const X = lerp(A, M, 1.42)
  ok('442 AB ≠ AC', Math.abs(dist(A, B) - dist(A, C)) > 50)
  ok('442 MB = MC', eq(dist(M, B), dist(M, C)))
  ok('442 M thuộc Ax, E F thuộc Ax', thang(A, M, E) && thang(A, M, F) && thang(A, M, X))
  ok('442 BE ⊥ Ax', vuong(E, B, M))
  ok('442 CF ⊥ Ax', vuong(F, C, M))
  const tAx = (p) => ((p.x - A.x) * (X.x - A.x) + (p.y - A.y) * (X.y - A.y)) / (dist(A, X) ** 2)
  ok('442 E, F thuộc tia Ax (nằm giữa A và X)', tAx(E) > 0 && tAx(E) < 1 && tAx(F) > 0 && tAx(F) < 1)
  ok('442 E, F hai phía M', (tAx(E) - tAx(M)) * (tAx(F) - tAx(M)) < 0)
  ok('442 E ≠ A, F ≠ M (điểm không trùng điểm đặc biệt)', dist(E, A) > 40 && dist(E, M) > 20)
  hinh('HHB000442', [A, B, C, M, E, F, X], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, X),
    seg(B, E), seg(C, F), seg(C, E), seg(B, F),
    tick(B, M, 1), tick(M, C, 1),
    rightAngle(E, B, M, 12), rightAngle(F, C, M, 12),
    pts(A, B, C, M, E, F),
    label(A, 'A', -4, -14), label(B, 'B', -16, 20), label(C, 'C', 18, 20), label(M, 'M', -20, 28),
    label(E, 'E', -20, -2), label(F, 'F', -14, 30), label(X, 'x', 16, 10),
  ])
}

// ── HHB000443: góc xOy, phân giác Om, A ∈ Om, H trung điểm OA, BC qua H vuông góc OA cắt Ox, Oy tại B, C. Vẽ thêm AB, AC (ý b, c, d nêu). ──
{
  const O = P(60, 200), A = P(300, 200), H = mid(O, A)
  const Xe = ray(O, 35, 260), Ye = ray(O, -35, 260), Me = P(350, 200)
  const B = inter(H, P(H.x, H.y - 50), O, Xe), C = inter(H, P(H.x, H.y + 50), O, Ye)
  ok('443 Om là phân giác (∠xOm = ∠mOy)', eq(goc(O, Xe, A), goc(O, A, Ye)))
  ok('443 góc xOy không đặc biệt (≠ 90°, ≠ 60°)', Math.abs(goc(O, Xe, Ye) - 90) > 10 && Math.abs(goc(O, Xe, Ye) - 60) > 5)
  ok('443 A thuộc Om', thang(O, A, Me))
  ok('443 H trung điểm OA', eq(dist(O, H), dist(H, A)))
  ok('443 BC ⊥ OA tại H', vuong(H, B, A) && vuong(H, C, A) && thang(B, H, C))
  ok('443 B thuộc tia Ox, C thuộc tia Oy', thang(O, B, Xe) && thang(O, C, Ye) && dist(O, B) < 260 && dist(O, C) < 260)
  ok('443 (kiểm, KHÔNG ký hiệu) AB ∥ Oy', song2(A, B, O, Ye))
  ok('443 (kiểm, KHÔNG ký hiệu) AC ∥ Ox', song2(A, C, O, Xe))
  hinh('HHB000443', [O, A, B, C, H, Xe, Ye, Me], [
    seg(O, Xe), seg(O, Ye), seg(O, Me), seg(B, C), seg(A, B), seg(A, C),
    tick(O, H, 1), tick(H, A, 1),
    rightAngle(H, A, B, 14),
    angleMark(O, Xe, A, 40), angleMark(O, A, Ye, 52),
    pts(O, A, B, C, H),
    label(O, 'O', -18, 8), label(A, 'A', 14, -14), label(B, 'B', -2, -14), label(C, 'C', -2, 34), label(H, 'H', -18, 28),
    label(Xe, 'x', 16, 0), label(Ye, 'y', 16, 8), label(Me, 'm', 16, 8),
  ])
}

// ── HHB000444+HHB000900: ABC, M trung điểm BC, D trên tia đối của MA, MD = MA. Vẽ thêm DB, DC (△DMC, BD nêu). ──
{
  const A = P(110, 40), B = P(40, 170), C = P(320, 190)
  const M = mid(B, C), D = doiXung(A, M)
  ok('444 AB ≠ AC', Math.abs(dist(A, B) - dist(A, C)) > 50)
  ok('444 MB = MC', eq(dist(M, B), dist(M, C)))
  ok('444 D thuộc tia đối của MA (A, M, D thẳng hàng, M giữa)', thang(A, M, D) && (A.y - M.y) * (D.y - M.y) < 0)
  ok('444 MD = MA', eq(dist(M, D), dist(M, A)))
  ok('444 (kiểm, KHÔNG ký hiệu) AB = DC, BD ∥ AC', eq(dist(A, B), dist(D, C)) && song2(B, D, A, C))
  hinh('HHB000444+HHB000900', [A, B, C, D, M], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(B, D), seg(C, D),
    tick(B, M, 1), tick(M, C, 1), tick(A, M, 2), tick(M, D, 2),
    pts(A, B, C, D, M),
    label(A, 'A', -4, -14), label(B, 'B', -16, 10), label(C, 'C', 18, 8), label(D, 'D', 8, 36), label(M, 'M', 20, -8),
  ])
}

// ── HHB000445: ABC vuông cân tại A (AB = AC), K trung điểm BC; CE ⊥ BC tại C cắt AB tại E. Vẽ thêm AK (△AKB, AK nêu). ──
{
  const A = P(60, 210), B = P(60, 60), C = P(210, 210)
  const K = mid(B, C)
  // E = giao đường thẳng AB với đường thẳng qua C vuông góc BC (xoay CB 90° quanh C)
  const E = inter(A, B, C, ((r) => P(r.x, r.y))(P(C.x + (B.y - C.y), C.y - (B.x - C.x))))
  ok('445 góc A = 90°', vuong(A, B, C))
  ok('445 AB = AC', eq(dist(A, B), dist(A, C)))
  ok('445 KB = KC', eq(dist(K, B), dist(K, C)))
  ok('445 CE ⊥ BC tại C', vuong(C, E, B))
  ok('445 E thuộc đường thẳng AB (E, A, B thẳng hàng)', thang(E, A, B))
  ok('445 (kiểm, KHÔNG ký hiệu) AK ⊥ BC, CB = CE', vuong(K, A, B) && eq(dist(C, B), dist(C, E)))
  hinh('HHB000445', [A, B, C, E, K], [
    seg(B, E), seg(A, C), seg(B, C), seg(C, E), seg(A, K),
    rightAngle(A, B, C, 14), rightAngle(C, B, E, 14),
    tick(A, B, 1), tick(A, C, 1), tick(B, K, 2), tick(K, C, 2),
    pts(A, B, C, E, K),
    label(A, 'A', -18, 8), label(B, 'B', -2, -14), label(C, 'C', 20, 4), label(E, 'E', -2, 34), label(K, 'K', 20, -4),
  ])
}

// ── HHB000446: ABC, M trung điểm AB, N trên tia đối MC, MC = MN; E trên tia đối BN, BN = BE; F trung điểm BC.
//    Vẽ thêm NB, BE, EC (ý a, b nêu). KHÔNG nối A–F–E (phải chứng minh thẳng hàng). ──
{
  const A = P(40, 160), B = P(290, 190), C = P(150, 40)
  const M = mid(A, B), N = doiXung(C, M), E = doiXung(N, B), F = mid(B, C)
  ok('446 tam giác ABC thường (AB, AC, BC đôi một khác nhau rõ)', Math.abs(dist(A, B) - dist(A, C)) > 50 && Math.abs(dist(A, B) - dist(B, C)) > 30 && Math.abs(dist(A, C) - dist(B, C)) > 30)
  ok('446 MA = MB', eq(dist(M, A), dist(M, B)))
  ok('446 N thuộc tia đối của MC, MC = MN', thang(C, M, N) && eq(dist(M, C), dist(M, N)) && (C.x - M.x) * (N.x - M.x) < 0)
  ok('446 E thuộc tia đối của BN, BN = BE', thang(N, B, E) && eq(dist(B, N), dist(B, E)) && (N.x - B.x) * (E.x - B.x) < 0)
  ok('446 FB = FC', eq(dist(F, B), dist(F, C)))
  ok('446 (kiểm, KHÔNG nối) A, F, E thẳng hàng', thang(A, F, E))
  ok('446 (kiểm, KHÔNG ký hiệu) NB ∥ AC, NB = AC, AB = EC', song2(N, B, A, C) && eq(dist(N, B), dist(A, C)) && eq(dist(A, B), dist(E, C)))
  hinh('HHB000446', [A, B, C, N, E, M, F], [
    seg(A, B), seg(B, C), seg(C, A), seg(C, N), seg(N, E), seg(E, C),
    tick(A, M, 1), tick(M, B, 1), tick(C, M, 2), tick(M, N, 2), tick(N, B, 3), tick(B, E, 3), tick(B, F, 4), tick(F, C, 4),
    pts(A, B, C, N, E, M, F),
    label(A, 'A', -18, 8), label(B, 'B', 4, 30), label(C, 'C', -4, -14), label(N, 'N', 4, 34), label(E, 'E', 18, -6),
    label(M, 'M', -14, 28), label(F, 'F', 8, -12),
  ])
}

await xuatTat(dir)
console.log(`Đã chạy ${nKiem} phép kiểm.`)
