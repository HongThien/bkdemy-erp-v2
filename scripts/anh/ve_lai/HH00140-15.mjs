// Vẽ lại hình — gói HH00140-15 (Ôn thi giữa kì I, Hình học 9).
//   node scripts/anh/ve_lai/HH00140-15.mjs [<thu_muc_ra>]
import { P, seg, segDash, lineExt, tick, rightAngle, angleMark, ray, foot, inter, mid, dist, goc, dot, label, num, sideText, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00140-15/moi'
const T = (d) => Math.tan(d * Math.PI / 180)
const dir = (a, b) => { const l = dist(a, b); return P((b.x - a.x) / l, (b.y - a.y) / l) }
const perp = (v) => P(-v.y, v.x)
const add = (a, v, k = 1) => P(a.x + v.x * k, a.y + v.y * k)
const ok = (c, m) => console.assert(c, m)

// HHC003208 — A, H, B thẳng hàng trên mặt đất, CH ⊥ AB; góc A = 6°, góc B = 8° (dựng đúng số đo, không ghi AC, CH)
{
  const A = P(0, 0), H = P(240, 0), C = P(240, -240 * T(6)), B = P(240 + 240 * T(6) / T(8), 0)
  ok(Math.abs(goc(A, B, C) - 6) < 0.05 && Math.abs(goc(B, A, C) - 8) < 0.05, '3208 góc A/B')
  hinh('HHC003208', [A, B, C], [seg(A, B), seg(A, C), seg(B, C), seg(C, H), rightAngle(H, A, C, 10),
    dot(A), dot(B), dot(C), dot(H),
    label(C, 'C', 0, -14), label(A, 'A', -10, 32), label(H, 'H', 0, 32), label(B, 'B', 8, 32),
    num(A, '6°', 58, 28), num(B, '8°', -44, 28)])
}

// HHC003209_lg — tam giác ABC vuông tại A (AB:AC = 12:16), AH ⊥ BC, HM ⊥ AB, HN ⊥ AC (ảnh cũ không ghi số, không vẽ MN)
{
  const A = P(0, 0), B = P(214, 0), C = P(0, -285)
  const H = foot(A, B, C), M = foot(H, A, B), N = foot(H, A, C)
  ok(Math.abs(goc(A, B, C) - 90) < 0.01 && Math.abs(goc(H, A, B) - 90) < 0.01, '3209 vuông')
  hinh('HHC003209_lg', [A, B, C], [seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(H, M), seg(H, N),
    rightAngle(A, B, C), rightAngle(M, A, H), rightAngle(N, A, H), rightAngle(H, A, B),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(N),
    label(C, 'C', 4, -16), label(N, 'N', -22, 8), label(H, 'H', 24, -10), label(A, 'A', -20, 30), label(M, 'M', 0, 34), label(B, 'B', 22, 8)])
}

// HHC003210 — khúc sông: AC = 300 m (bề rộng), BC = 400 m (tỉ lệ 0,9 px/m); hai bờ là hai đường nằm ngang
{
  const k = 0.9
  const A = P(0, 0), C = P(0, 300 * k), B = P(k * Math.sqrt(400 * 400 - 300 * 300), 0)
  ok(Math.abs(dist(B, C) - 400 * k) < 0.01, '3210 BC')
  const bo1 = [P(-70, 0), P(B.x + 70, 0)], bo2 = [P(-70, C.y), P(B.x + 70, C.y)]
  hinh('HHC003210', [...bo1, ...bo2], [seg(bo1[0], bo1[1]), seg(bo2[0], bo2[1]), seg(A, C), seg(B, C),
    dot(A), dot(B), dot(C),
    label(A, 'A', -20, 30), label(B, 'B', 20, 30), label(C, 'C', -20, -10),
    sideText(A, C, '300 m', B, 42), sideText(B, C, '400 m', A, 46)])
}

// HHC003211_lg — ABC vuông tại A (AB = 3, AC = 4), AH ⊥ BC, HE ⊥ AB, HF ⊥ AC (ảnh cũ không có EF)
{
  const A = P(0, 0), B = P(214, 0), C = P(0, 285)
  const H = foot(A, B, C), E = foot(H, A, B), F = foot(H, A, C)
  ok(Math.abs(goc(H, A, B) - 90) < 0.01, '3211 AH ⊥ BC')
  hinh('HHC003211_lg', [A, B, C], [seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(H, E), seg(H, F),
    rightAngle(A, B, C), rightAngle(E, A, H), rightAngle(F, A, H), rightAngle(H, A, B),
    dot(A), dot(B), dot(C), dot(H), dot(E), dot(F),
    label(A, 'A', -22, -10), label(E, 'E', 0, -16), label(B, 'B', 24, 8), label(F, 'F', -22, 8), label(H, 'H', 20, 30), label(C, 'C', 4, 36)])
}

// HHC003212 — A cách mặt đất 5 km (AH ⊥ mặt đất), AB tạo với mặt đất góc 3° (dựng đúng 3°, ảnh cũ không ghi số; bỏ hình máy bay)
{
  const H = P(0, 0), B = P(325, 0), A = P(0, -325 * T(3))
  ok(Math.abs(goc(B, H, A) - 3) < 0.01, '3212 góc B')
  const dau = P(-25, 0), cuoi = P(B.x + 75, 0)
  hinh('HHC003212', [A, dau, cuoi], [seg(dau, cuoi), segDash(A, H), seg(A, B), rightAngle(H, A, B, 10),
    dot(A), dot(B), dot(H),
    label(A, 'A', -20, -4), label(H, 'H', -18, 32), label(B, 'B', 0, 34)])
}

// HHC003213_lg — ABC vuông tại A, AB:AC = 2:3, AH ⊥ BC, HM ⊥ AB, HN ⊥ AC; I = MN ∩ BC; K trên tia đối NH, NK = BM
{
  const k = 92
  const B = P(0, 0), C = P(k * Math.sqrt(13), 0)
  const A = ray(B, Math.atan(1.5) * 180 / Math.PI, 2 * k)
  ok(Math.abs(goc(A, B, C) - 90) < 0.01, '3213 vuông tại A')
  const H = foot(A, B, C), M = foot(H, A, B), N = foot(H, A, C)
  const K = add(N, dir(H, N), dist(B, M))
  const I = inter(M, N, B, C)
  ok(Math.abs(dist(N, K) - dist(B, M)) < 0.01, '3213 NK = BM')
  ok(I.x < B.x && (M.x - I.x) * (N.x - M.x) > 0, '3213 I–B–H, I–M–N')
  hinh('HHC003213_lg', [I, C, A, K], [seg(I, C), seg(A, B), seg(A, C), seg(A, H), seg(H, M), seg(H, K), seg(I, N), segDash(A, I), segDash(K, C),
    rightAngle(A, B, C), rightAngle(H, A, C), rightAngle(M, A, H), rightAngle(N, A, H),
    tick(N, K, 1), tick(B, M, 1),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(N), dot(I), dot(K),
    label(A, 'A', 0, -16), label(K, 'K', 0, -16), label(N, 'N', 6, 34), label(M, 'M', -22, -6),
    label(I, 'I', 0, 34), label(B, 'B', 0, 34), label(H, 'H', 0, 34), label(C, 'C', 0, 34)])
}

// HHC003214_lg — ABC vuông tại A, AB = 5 cm, góc B = 64° (35 px/cm); HD ⊥ AB, HE ⊥ AC; I trung điểm AH;
// đường qua I ⊥ ED cắt trung trực EC tại J (trung điểm EC là chấm không tên như ảnh cũ)
{
  const s = 35
  const B = P(0, 0), A = ray(B, 64, 5 * s)
  const Cc = P((5 / Math.cos(64 * Math.PI / 180)) * s, 0)
  ok(Math.abs(goc(A, B, Cc) - 90) < 0.01 && Math.abs(goc(B, A, Cc) - 64) < 0.01, '3214 tam giác')
  const H = foot(A, B, Cc), D = foot(H, A, B), E = foot(H, A, Cc), I = mid(A, H), Q = mid(E, Cc)
  const J = inter(I, add(I, perp(dir(D, E))), Q, add(Q, perp(dir(A, Cc))))
  const r = [dist(J, B), dist(J, D), dist(J, E), dist(J, Cc)]
  ok(Math.max(...r) - Math.min(...r) < 0.01, '3214 J cách đều B,D,E,C: ' + r)
  hinh('HHC003214_lg', [B, Cc, A, J], [seg(B, Cc), seg(A, B), seg(A, Cc), seg(A, H), seg(H, D), seg(H, E), seg(D, E), seg(I, J), seg(Q, J),
    rightAngle(A, B, Cc), rightAngle(H, A, B), rightAngle(D, A, H), rightAngle(E, A, H), rightAngle(I, E, J), rightAngle(Q, E, J),
    angleMark(B, Cc, A, 24),
    tick(A, I, 2), tick(I, H, 2), tick(E, Q, 1), tick(Q, Cc, 1),
    dot(A), dot(B), dot(Cc), dot(H), dot(D), dot(E), dot(I), dot(J), dot(Q),
    label(A, 'A', 0, -16), label(E, 'E', 24, -6), label(D, 'D', -22, 6), label(I, 'I', -20, -6), label(B, 'B', -20, 22),
    label(H, 'H', 0, 34), label(Cc, 'C', 22, 18), label(J, 'J', 0, 36),
    num(B, '64°', 32, 32), sideText(A, B, '5 cm', Cc, 36)])
}

await xuatTat(RA)
