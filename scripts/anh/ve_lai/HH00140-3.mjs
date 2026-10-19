// Vẽ lại hình — gói HH00140-3 (Ôn thi giữa kì I, Hình học 9). Trạm vẽ 19/10.
//   node scripts/anh/ve_lai/HH00140-3.mjs [<thu_muc_ra>]
import { P, seg, rightAngle, angleMark, tick, ray, dot, label, num, angleText, sideText, hinh, xuatTat, foot, mid, lerp, doiXung, goc, dist, bien } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00140-3/moi'
const ok = (cond, msg) => { if (!cond) throw new Error('SAI DỰNG HÌNH: ' + msg) }

// HHC003105 — cột cờ AB, bóng AC = 12 m, góc C = 40°, vuông tại A
{
  const s = 25, A = P(0, 0), C = P(12 * s, 0), B = P(0, -12 * s * Math.tan(40 * Math.PI / 180))
  ok(Math.abs(goc(C, A, B) - 40) < 0.1 && Math.abs(goc(A, B, C) - 90) < 0.1, '3105')
  hinh('HHC003105', [A, B, C, P(-60, 0)], [seg(A, B), seg(A, C), seg(B, C), dot(A), dot(B), dot(C), rightAngle(A, C, B),
    angleMark(C, A, B, 46), angleText(C, A, B, '40°', 92),
    label(B, 'B', 0, -14), label(A, 'A', -22, 28), label(C, 'C', 24, 28),
    sideText(A, C, '12 m', B, 26), num(lerp(A, B, 0.5), 'Cột cờ', -42, 8)])
}

// HHC003107 — tòa nhà AB, bóng AC = 36 m, góc C = 34°, vuông tại A
{
  const s = 9.5, A = P(0, 0), C = P(36 * s, 0), B = P(0, -36 * s * Math.tan(34 * Math.PI / 180))
  ok(Math.abs(goc(C, A, B) - 34) < 0.1, '3107')
  hinh('HHC003107', [A, B, C, P(-70, 0)], [seg(A, B), seg(A, C), seg(B, C), dot(A), dot(B), dot(C), rightAngle(A, C, B),
    angleMark(C, A, B, 52), angleText(C, A, B, '34°', 108),
    label(B, 'B', 0, -14), label(A, 'A', -22, 28), label(C, 'C', 24, 28),
    sideText(A, C, '36 m', B, 26), num(lerp(A, B, 0.5), 'Tòa nhà', -50, 8)])
}

// HHC003109 — cây (cao ? m), bóng 7 m, tia nắng tạo với mặt đất 52°
{
  const s = 225 / 7, G = P(0, 0), Q = P(7 * s, 0), N = P(0, -7 * s * Math.tan(52 * Math.PI / 180))
  ok(Math.abs(goc(Q, G, N) - 52) < 0.1, '3109')
  hinh('HHC003109', [G, N, Q, P(-70, 0)], [seg(G, N), seg(G, Q), seg(N, Q),
    angleMark(Q, G, N, 50), angleText(Q, G, N, '52°', 118),
    sideText(G, Q, '7 m', N, 26), sideText(G, N, '? m', Q, 42), num(lerp(G, N, 0.5), 'Cây', 40, 8)])
}

// HHC003106_lg — tam giác ABC vuông tại A, AB = 6, AC = 8 (BC = 10), đường cao AH, D = hình chiếu của H trên AB
{
  const s = 48, A = P(0, 0), B = P(0, -6 * s), C = P(8 * s, 0)
  const H = foot(A, B, C), D = foot(H, A, B)
  ok(Math.abs(dist(B, C) - 10 * s) < 0.01 && Math.abs(goc(H, A, B) - 90) < 0.1 && Math.abs(goc(D, A, H) - 90) < 0.1, '3106')
  hinh('HHC003106_lg', [A, B, C, P(-30, 0)], [seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(D, H),
    dot(A), dot(B), dot(C), dot(H), dot(D), rightAngle(A, C, B), rightAngle(H, A, B), rightAngle(D, A, H),
    label(B, 'B', 0, -14), label(A, 'A', -24, 28), label(C, 'C', 24, 28), label(H, 'H', 24, -8), label(D, 'D', -24, 9)])
}

// HHC003108_lg — tam giác DEF vuông tại D, DE = 8, DF = 15 (EF = 17), đường cao DG, H = hình chiếu của G trên DE
{
  const s = 25, D = P(0, 0), E = P(0, -8 * s), F = P(15 * s, 0)
  const G = foot(D, E, F), H = foot(G, D, E)
  ok(Math.abs(dist(E, F) - 17 * s) < 0.01 && Math.abs(goc(G, D, E) - 90) < 0.1 && Math.abs(goc(H, D, G) - 90) < 0.1, '3108')
  hinh('HHC003108_lg', [D, E, F, P(-30, 0)], [seg(D, E), seg(D, F), seg(E, F), seg(D, G), seg(H, G),
    dot(D), dot(E), dot(F), dot(G), dot(H), rightAngle(D, F, E), rightAngle(G, D, E), rightAngle(H, D, G),
    label(E, 'E', 0, -14), label(D, 'D', -24, 28), label(F, 'F', 24, 28), label(G, 'G', 24, -8), label(H, 'H', -24, 9)])
}

// HHC003110_lg — tam giác nhọn ABC, đường cao AH, AB = 2,1, AC = 3,8, B = 70°
{
  const s = 95, B = P(0, 0), A = ray(B, 70, 2.1 * s), H = foot(A, B, P(1, 0))
  const C = P(H.x + Math.sqrt(3.8 * 3.8 - (2.1 * Math.sin(70 * Math.PI / 180)) ** 2) * s, 0)
  ok(Math.abs(goc(B, C, A) - 70) < 0.1 && Math.abs(dist(A, B) / s - 2.1) < 0.001 && Math.abs(dist(A, C) / s - 3.8) < 0.001, '3110')
  ok(Math.abs(goc(C, A, B)) < 90 && goc(A, B, C) < 90 && goc(B, A, C) < 90, 'tam giác nhọn')
  hinh('HHC003110_lg', [A, B, C, P(-52, 0)], [seg(A, B), seg(B, C), seg(A, C), seg(A, H),
    dot(A), dot(B), dot(C), dot(H), rightAngle(H, A, C),
    angleMark(B, C, A, 25), angleText(B, C, A, '70°', 52),
    label(A, 'A', 0, -14), label(B, 'B', -18, 32), label(H, 'H', 0, 34), label(C, 'C', 22, 32),
    sideText(B, A, '2,1 cm', C, 46), sideText(A, C, '3,8 cm', B, 34)], { pad: 44 })
}

// HHC003111_lg — ABC vuông tại A (AB = 6, AC = 8), AH ⊥ BC, M = hình chiếu H trên AB, N = trung điểm BM,
//   K ∈ tia HC với HK = BN, S đối xứng K qua A
{
  const s = 26, Q = (x, y) => P(x * s, -y * s)
  const A = Q(0, 0), B = Q(6, 0), C = Q(0, 8)
  const H = foot(A, B, C), M = foot(H, A, B), N = mid(M, B)
  const u = P((C.x - H.x) / dist(H, C), (C.y - H.y) / dist(H, C)), HK = dist(B, N)
  const K = P(H.x + u.x * HK, H.y + u.y * HK), S = doiXung(K, A)
  ok(Math.abs(dist(B, C) - 10 * s) < 0.01 && Math.abs(dist(A, H) - 4.8 * s) < 0.01 && Math.abs(dist(H, K) - dist(B, N)) < 0.01, '3111')
  ok(Math.abs(goc(H, A, B) - 90) < 0.1 && Math.abs(goc(M, A, H) - 90) < 0.1 && dist(M, N) - dist(N, B) < 0.01, '3111 vuông góc/trung điểm')
  hinh('HHC003111_lg', [A, B, C, S, P(-30, 0)], [seg(C, A), seg(A, B), seg(B, C), seg(A, H), seg(H, M), seg(S, K), seg(K, N), seg(S, N),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(K), dot(N), dot(S),
    rightAngle(A, B, C), rightAngle(M, A, H), rightAngle(H, A, B),
    tick(H, K, 1), tick(M, N, 1), tick(N, B, 1), tick(A, K, 2), tick(A, S, 2),
    label(C, 'C', -22, 9), label(A, 'A', -22, -4), label(B, 'B', 24, 9), label(M, 'M', -4, 32), label(N, 'N', 8, 32),
    label(H, 'H', 22, -4), label(K, 'K', -20, 4), label(S, 'S', -22, 9)],
  { pad: 40, padDuoi: 46 })
}

// HHC003112 — xe ở B cách chân toà nhà A 65 m; C, D trên toà nhà; góc ACB = 37°, ADB = 27°
{
  const k = 2.25, cot = (d) => 1 / Math.tan(d * Math.PI / 180)
  const A = P(0, 0), B = P(-65 * k, 0), C = P(0, -65 * cot(37) * k), D = P(0, -65 * cot(27) * k)
  ok(Math.abs(goc(C, A, B) - 37) < 0.1 && Math.abs(goc(D, A, B) - 27) < 0.1, '3112')
  hinh('HHC003112', [A, B, D, P(110, 0), P(B.x - 70, 0)], [seg(A, D), seg(A, B), seg(B, C), seg(B, D),
    dot(A), dot(B), dot(C), dot(D),
    angleMark(C, A, B, 44), angleText(C, A, B, '37°', 104), angleMark(D, A, B, 44), num(P(D.x - 58, D.y + 74), '27°'),
    label(D, 'D', 22, 9), label(C, 'C', 22, 9), label(A, 'A', 6, 32), label(B, 'B', 0, 32),
    sideText(A, B, '65 m', D, 24), num(lerp(A, C, 0.5), 'Toà nhà', 52, 8), num(B, 'Ô tô', -42, -14)])
}

await xuatTat(RA)
