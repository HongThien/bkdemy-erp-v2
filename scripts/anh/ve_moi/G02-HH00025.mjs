// G02-HH00025.mjs — 6 hình đề cho bài HH00025 "Hình học" (khối 7), hình gắn vào BÀI (đủ dữ kiện dựng của mọi ý).
//   node scripts/anh/ve_moi/G02-HH00025.mjs "<gói>/moi"
import { P, seg, tick, angleMark, rightAngle, dot, label, num, hinh, xuatTat, dist, mid, foot, inter, bisector, goc, lerp, ray, doiXung } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/G02-HH00025.mjs <thu_muc_ra>'); process.exit(2) }
let nKiem = 0
const ok = (t, c) => { nKiem++; console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const eq = (a, b) => Math.abs(a - b) < 1e-6
const thang = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) < 1e-6
const vuong = (v, a, b) => Math.abs((a.x - v.x) * (b.x - v.x) + (a.y - v.y) * (b.y - v.y)) < 1e-6
const song2 = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) < 1e-6
const phia = (a, b, p) => Math.sign((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x))   // phía của p so với đường ab
const pts = (...a) => a.map(dot).join('')

// ── HHB000447: ABC cân tại A, phân giác AD (D ∈ BC); Cx ⊥ BC (nửa mặt phẳng chứa A); Ay ∥ BC (nửa mặt phẳng bờ AB chứa C);
//    I trung điểm AC, K = Ay ∩ Cx. Nối ID, IK (hai đoạn chung đỉnh I — KHÔNG gạch I là trung điểm DK). ──
{
  const B = P(70, 300), C = P(290, 300), A = P(180, 60)
  const D = inter(A, bisector(A, B, C, 100), B, C)
  const X = P(C.x, 15)                                  // đầu tia Cx (vuông góc BC tại C, về phía A)
  const K = P(C.x, A.y)                                 // Ay ∥ BC ⇒ y = A.y; K thuộc Cx
  const Y = P(K.x + 45, A.y)                            // đầu tia Ay
  const I = mid(A, C)
  ok('447 AB = AC', eq(dist(A, B), dist(A, C)))
  ok('447 tam giác không gần đều (|AB − BC| > 25)', Math.abs(dist(A, B) - dist(B, C)) > 25)
  ok('447 D thuộc BC, ∠BAD = ∠CAD', thang(B, D, C) && D.x > B.x && D.x < C.x && eq(goc(A, B, D), goc(A, D, C)))
  ok('447 Cx ⊥ BC tại C', vuong(C, X, B))
  ok('447 Cx cùng nửa mặt phẳng bờ BC với A', phia(B, C, X) === phia(B, C, A))
  ok('447 Ay ∥ BC', song2(A, Y, B, C))
  ok('447 Ay thuộc nửa mặt phẳng bờ AB chứa C', phia(A, B, Y) === phia(A, B, C))
  ok('447 K = Ay ∩ Cx (K trên cả hai tia)', eq(K.x, inter(A, Y, C, X).x) && eq(K.y, inter(A, Y, C, X).y) && K.x > A.x && K.x < Y.x && K.y > X.y && K.y < C.y)
  ok('447 I trung điểm AC', eq(dist(A, I), dist(I, C)) && thang(A, I, C))
  ok('447 (kiểm, KHÔNG ký hiệu) AD ∥ Cx, AD ⊥ BC', song2(A, D, C, X) && vuong(D, A, B))
  ok('447 (kiểm, KHÔNG nối) D, I, K thẳng hàng & I trung điểm DK', thang(D, I, K) && eq(dist(D, I), dist(I, K)))
  hinh('HHB000447', [A, B, C, D, K, I, X, Y], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(C, X), seg(A, Y), seg(I, D), seg(I, K),
    rightAngle(C, B, X, 13),
    angleMark(A, B, D, 34), angleMark(A, D, C, 44),
    angleMark(B, A, C, 32, 2), angleMark(C, A, B, 40, 2),
    tick(A, I, 1), tick(I, C, 1),
    pts(A, B, C, D, K, I),
    label(A, 'A', -4, -14), label(B, 'B', -16, 20), label(C, 'C', 16, 22), label(D, 'D', 0, 34), label(K, 'K', -18, -12),
    label(I, 'I', 18, 4), label(X, 'x', 16, 6), label(Y, 'y', 16, 6),
  ])
}

// ── HHB000448: ABC cân tại A, D, E trung điểm AC, AB; M, N: D trung điểm BM, E trung điểm CN; I = BD ∩ CE; H = AI ∩ BC;
//    K ∈ tia CB, CK = 2AH; ∠BAC = 30°. Nối AM, AN (hai đoạn chung đỉnh A — KHÔNG gạch A là trung điểm MN). ──
{
  const a = 185
  const A = P(360, 50), lAB = a / Math.cos(15 * Math.PI / 180)
  const B = ray(A, -105, lAB), C = ray(A, -75, lAB)
  const D = mid(A, C), E = mid(A, B)
  const M = doiXung(B, D), N = doiXung(C, E)
  const I = inter(B, D, C, E)
  const H = inter(A, I, B, C)
  const K = lerp(C, B, 2 * dist(A, H) / dist(C, B))
  ok('448 AB = AC', eq(dist(A, B), dist(A, C)))
  ok('448 ∠BAC = 30°', Math.abs(goc(A, B, C) - 30) < 1e-6)
  ok('448 D, E trung điểm AC, AB', eq(dist(A, D), dist(D, C)) && eq(dist(A, E), dist(E, B)))
  ok('448 D trung điểm BM, E trung điểm CN', eq(dist(B, D), dist(D, M)) && thang(B, D, M) && eq(dist(C, E), dist(E, N)) && thang(C, E, N))
  ok('448 I ∈ BD ∩ CE (I nằm giữa B–D và C–E)', thang(B, I, D) && thang(C, I, E) && lerp(B, D, 0.5).y < I.y + 200)
  ok('448 H thuộc BC, A–I–H thẳng hàng', Math.abs(H.y - B.y) < 1e-6 && thang(A, I, H))
  ok('448 K thuộc tia CB, CK = 2AH, K ngoài đoạn CB phía B', thang(C, B, K) && eq(dist(C, K), 2 * dist(A, H)) && K.x < B.x && Math.abs(K.y - B.y) < 1e-6)
  ok('448 (kiểm, KHÔNG ký hiệu) BD = CE', eq(dist(B, D), dist(C, E)))
  ok('448 (kiểm, KHÔNG nối) A trung điểm MN', thang(M, A, N) && eq(dist(A, M), dist(A, N)))
  ok('448 (kiểm) AH ⊥ BC, AH là phân giác ∠BAC', vuong(H, A, B) && eq(goc(A, B, H), goc(A, H, C)))
  ok('448 (kiểm, KHÔNG ghi) ∠KAB = 45°', Math.abs(goc(A, K, B) - 45) < 1e-6)
  const T30 = P(A.x, A.y + 78)
  hinh('HHB000448', [A, B, C, D, E, M, N, I, H, K], [
    seg(A, B), seg(A, C), seg(K, C), seg(B, M), seg(C, N), seg(A, H), seg(A, M), seg(A, N), seg(A, K),
    angleMark(A, B, C, 40),
    `<rect x="${T30.x - 15}" y="${T30.y - 10}" width="30" height="18" fill="#fff" stroke="none"/>`,
    num(T30, '30°', 0, 6, 17),
    tick(A, E, 1), tick(E, B, 1), tick(A, D, 1), tick(D, C, 1),
    tick(B, D, 2, 0.3), tick(D, M, 2, 0.35), tick(C, E, 3, 0.3), tick(E, N, 3, 0.35),
    pts(A, B, C, D, E, M, N, I, H, K),
    label(A, 'A', 0, -14), label(B, 'B', -14, 32), label(C, 'C', 16, 32), label(D, 'D', 16, -4), label(E, 'E', -16, -4),
    label(M, 'M', 0, -14), label(N, 'N', 0, -14), label(I, 'I', -22, 8), label(H, 'H', 0, 34), label(K, 'K', 0, 34),
  ])
}

// ── HHB000449+HHB000901: ABC vuông tại A, BD phân giác góc B (D ∈ AC), E ∈ BC, BE = BA; I = BD ∩ AE. Nối DE, AE. ──
{
  const A = P(60, 300), B = P(60, 100), C = P(360, 300)
  const E = lerp(B, C, dist(B, A) / dist(B, C))
  const D = inter(B, bisector(B, A, C, 100), A, C)
  const I = inter(B, D, A, E)
  ok('449 vuông tại A (AB ⊥ AC), AB thẳng đứng, AC nằm ngang', vuong(A, B, C) && A.x === B.x && A.y === C.y && B.y < A.y && C.x > A.x)
  ok('449 AB ≠ AC (không vuông cân)', Math.abs(dist(A, B) - dist(A, C)) > 50)
  ok('449 E thuộc đoạn BC, BE = BA', thang(B, E, C) && E.x > B.x && E.x < C.x && eq(dist(B, E), dist(B, A)))
  ok('449 D thuộc đoạn AC, ∠ABD = ∠EBD', D.y === 300 && D.x > A.x && D.x < C.x && eq(goc(B, A, D), goc(B, D, E)))
  ok('449 (kiểm, KHÔNG ký hiệu) DE = AD, DE ⊥ BC', eq(dist(D, E), dist(A, D)) && vuong(E, D, B))
  ok('449 (kiểm, KHÔNG ký hiệu) BD ⊥ AE, IA = IE', vuong(I, B, A) && eq(dist(I, A), dist(I, E)))
  hinh('HHB000449+HHB000901', [A, B, C, D, E, I], [
    seg(A, B), seg(A, C), seg(B, C), seg(B, D), seg(D, E), seg(A, E),
    rightAngle(A, B, C, 16),
    tick(B, A, 1), tick(B, E, 1),
    angleMark(B, A, D, 38), angleMark(B, D, E, 50),
    pts(A, B, C, D, E, I),
    label(A, 'A', -18, 20), label(B, 'B', 0, -14), label(C, 'C', 18, 18), label(D, 'D', 4, 34), label(E, 'E', 20, -6), label(I, 'I', 24, 22),
  ])
}

// ── HHB000450: ABC cân tại A, phân giác AH (H ∈ BC); D ∈ tia đối BC, E ∈ tia đối CB, BD = CE. Nối AD, AE. ──
{
  const A = P(180, 80), B = P(100, 300), C = P(260, 300)
  const H = inter(A, bisector(A, B, C, 100), B, C)
  const D = P(B.x - 55, 300), E = P(C.x + 55, 300)
  ok('450 AB = AC', eq(dist(A, B), dist(A, C)))
  ok('450 tam giác không gần đều (|AB − BC| > 40)', Math.abs(dist(A, B) - dist(B, C)) > 40)
  ok('450 H thuộc BC, ∠BAH = ∠CAH', thang(B, H, C) && H.x > B.x && H.x < C.x && eq(goc(A, B, H), goc(A, H, C)))
  ok('450 D thuộc tia đối của tia BC (B nằm giữa D, C), E thuộc tia đối của tia CB (C nằm giữa B, E)', D.x < B.x && E.x > C.x && D.y === 300 && E.y === 300)
  ok('450 BD = CE', eq(dist(B, D), dist(C, E)))
  ok('450 BD khác BH (không ngẫu nhiên bằng)', Math.abs(dist(B, D) - dist(B, H)) > 15)
  ok('450 (kiểm, KHÔNG ký hiệu) BH = CH, AH ⊥ BC, AD = AE', eq(dist(B, H), dist(C, H)) && vuong(H, A, B) && eq(dist(A, D), dist(A, E)))
  hinh('HHB000450', [A, B, C, D, E, H], [
    seg(A, B), seg(A, C), seg(D, E), seg(A, H), seg(A, D), seg(A, E),
    tick(A, B, 1), tick(A, C, 1), tick(B, D, 2), tick(C, E, 2),
    angleMark(A, B, H, 34), angleMark(A, H, C, 42),
    pts(A, B, C, D, E, H),
    label(A, 'A', 0, -14), label(B, 'B', -2, 34), label(C, 'C', 4, 34), label(D, 'D', 0, 34), label(E, 'E', 0, 34), label(H, 'H', 0, 34),
  ])
}

// ── HHB000451: ABC cân tại A, M trung điểm BC; ME ⊥ AB tại E, MF ⊥ AC tại F; K = AM ∩ EF; CD ∥ AM, D ∈ tia BA. ──
{
  const B = P(40, 330), C = P(370, 330), A = P(205, 195)
  const M = mid(B, C)
  const E = foot(M, A, B), F = foot(M, A, C)
  const K = inter(A, M, E, F)
  const D = inter(B, A, C, P(C.x, C.y - 100))           // Cd ∥ AM: AM thẳng đứng ⇒ qua C đường thẳng đứng
  ok('451 AB = AC', eq(dist(A, B), dist(A, C)))
  ok('451 tam giác không gần đều / không vuông (∠A khác 90°, 60° nhiều)', Math.abs(goc(A, B, C) - 90) > 8 && Math.abs(goc(A, B, C) - 60) > 15)
  ok('451 M trung điểm BC', eq(dist(M, B), dist(M, C)))
  ok('451 E thuộc đoạn AB, F thuộc đoạn AC', thang(A, E, B) && E.x > B.x && E.x < A.x && thang(A, F, C) && F.x > A.x && F.x < C.x)
  ok('451 ME ⊥ AB tại E, MF ⊥ AC tại F', vuong(E, M, A) && vuong(F, M, A) && vuong(E, M, B) && vuong(F, M, C))
  ok('451 K = AM ∩ EF nằm giữa A, M', thang(A, K, M) && thang(E, K, F) && K.y > A.y && K.y < M.y)
  ok('451 D thuộc tia BA (A giữa B, D), CD ∥ AM', thang(B, A, D) && D.x > A.x && song2(C, D, A, M))
  ok('451 (kiểm, KHÔNG ký hiệu) AE = AF, AM ⊥ BC, EF ∥ BC, AB = AD', eq(dist(A, E), dist(A, F)) && vuong(M, A, B) && song2(E, F, B, C) && eq(dist(A, B), dist(A, D)))
  hinh('HHB000451', [A, B, C, D, E, F, K, M], [
    seg(B, D), seg(A, C), seg(B, C), seg(A, M), seg(M, E), seg(M, F), seg(E, F), seg(C, D),
    angleMark(B, A, C, 26), angleMark(C, A, B, 26),
    tick(B, M, 2), tick(M, C, 2),
    rightAngle(E, A, M, 12), rightAngle(F, A, M, 12),
    pts(A, B, C, D, E, F, K, M),
    label(A, 'A', -18, 4), label(B, 'B', -14, 24), label(C, 'C', 16, 24), label(D, 'D', 16, -4), label(E, 'E', -18, 4),
    label(F, 'F', 20, 4), label(K, 'K', 14, 6), label(M, 'M', 0, 34),
  ])
}

// ── HHB000452: ABC cân tại A, M trung điểm BC, D bất kỳ trên đoạn AM. Nối DB, DC. ──
{
  const B = P(70, 300), C = P(290, 300), A = P(180, 50)
  const M = mid(B, C)
  const D = lerp(A, M, 0.58)
  ok('452 AB = AC', eq(dist(A, B), dist(A, C)))
  ok('452 tam giác không gần đều (|AB − BC| > 25)', Math.abs(dist(A, B) - dist(B, C)) > 25)
  ok('452 M trung điểm BC', eq(dist(M, B), dist(M, C)) && thang(B, M, C))
  ok('452 D thuộc đoạn AM, không trùng điểm đặc biệt (không là trung điểm AM)', thang(A, D, M) && D.y > A.y && D.y < M.y && Math.abs(dist(A, D) - dist(D, M)) > 20)
  ok('452 (kiểm, KHÔNG ký hiệu) DB = DC, AM ⊥ BC', eq(dist(D, B), dist(D, C)) && vuong(M, A, B))
  hinh('HHB000452', [A, B, C, D, M], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, M), seg(D, B), seg(D, C),
    tick(A, B, 1), tick(A, C, 1), tick(B, M, 2), tick(M, C, 2),
    pts(A, B, C, D, M),
    label(A, 'A', 0, -14), label(B, 'B', -14, 24), label(C, 'C', 16, 24), label(D, 'D', 18, 4), label(M, 'M', 0, 36),
  ])
}

await xuatTat(dir)
console.log(`Đã chạy ${nKiem} phép kiểm.`)
