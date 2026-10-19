// Vẽ lại hình — gói HH00140-13 (Ôn thi giữa kì I, Hình học 9; hình đề + hình lời giải _lg).
//   node scripts/anh/ve_lai/HH00140-13.mjs [<thu_muc_ra>]
import { P, seg, segDash, tick, angleMark, rightAngle, ray, dot, label, num, bien, circle, fill,
  angleText, mid, foot, inter, lerp, doiXung, dist, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00140-13/moi'
const ok = (cond, msg) => console.assert(cond, msg)

// HHC003191_lg — Ý b (D, B trên một đường, A giữa; H trực tâm của DBC) + Ý c (hình chữ nhật APMQ)
{
  const u = 30
  // Ý b: toạ độ trong hệ A=(0,0), AB=6, AC=8, D trên tia đối AB với AD=4 ⇒ AH=3 (H trực tâm)
  const A = P(0, 0), B = P(6 * u, 0), C = P(0, -8 * u), D = P(-4 * u, 0), H = P(0, -3 * u)
  const K = foot(B, C, D), E = foot(D, B, C)
  ok(Math.abs(goc(K, B, C) - 90) < 0.5 && Math.abs(goc(K, H, C) - 90) < 0.5, 'CK vuông BH tại K')
  ok(Math.abs(dist(H, foot(H, B, C)) - dist(H, E)) < 0.5, 'D,H,E thẳng hàng và DE vuông BC')
  ok(Math.abs(goc(A, B, C) - 90) < 0.5, 'A vuông')
  ok(Math.abs(dist(A, B) / dist(A, C) - 0.75) < 0.01, 'AB:AC = 6:8')
  const bodyB = [seg(D, C), seg(C, B), seg(D, B), seg(C, A), seg(D, E), seg(B, K),
    rightAngle(A, B, C, 12), rightAngle(K, C, H, 12),
    dot(A), dot(B), dot(C), dot(D), dot(H), dot(K), dot(E),
    label(C, 'C', 0, -12), label(D, 'D', -8, 30), label(A, 'A', 4, 30), label(B, 'B', 6, 30),
    label(K, 'K', -20, 4), label(E, 'E', 22, 2), label(H, 'H', -27, 10),
    num(P(30, 72), 'Ý b')]

  // Ý c: tam giác ABC vuông tại A (AB=6, AC=8); M bất kì trên BC; P, Q hình chiếu của M trên AB, AC
  const ox = 262
  const A2 = P(ox, 0), B2 = P(ox + 6 * u, 0), C2 = P(ox, -8 * u)
  const M = lerp(B2, C2, 0.45), Pp = foot(M, A2, B2), Q = foot(M, A2, C2)
  ok(Math.abs(goc(Pp, M, A2) - 90) < 0.5 && Math.abs(goc(Q, M, C2) - 90) < 0.5, 'MP, MQ vuông')
  const bodyC = [seg(C2, A2), seg(A2, B2), seg(C2, B2), seg(Q, M), seg(M, Pp), seg(Q, Pp), segDash(A2, M),
    rightAngle(A2, B2, C2, 12), rightAngle(Q, A2, M, 12), rightAngle(Pp, A2, M, 12),
    dot(A2), dot(B2), dot(C2), dot(M), dot(Pp), dot(Q),
    label(C2, 'C', 0, -12), label(A2, 'A', -4, 30), label(B2, 'B', 6, 30), label(Pp, 'P', 4, 30),
    label(Q, 'Q', -20, 6), label(M, 'M', 22, -8),
    num(P(ox + 90, 72), 'Ý c')]
  hinh('HHC003191_lg', [D, B, C, B2, C2, A2, P(ox - 30, 0), P(30, 80)], [...bodyB, ...bodyC], { pad: 40, padDuoi: 36 })
}

// HHC003192 — hình chữ nhật MNPQ nội tiếp đường tròn (tâm trùng tâm hình chữ nhật)
{
  const a = 280, b = 104, O = P(0, 0)
  const M = P(-a / 2, -b / 2), N = P(a / 2, -b / 2), Pp = P(a / 2, b / 2), Q = P(-a / 2, b / 2)
  const R = dist(O, M)
  ok(Math.abs(dist(O, N) - R) < 0.01 && Math.abs(dist(O, Pp) - R) < 0.01 && Math.abs(dist(O, Q) - R) < 0.01, 'bốn đỉnh trên đường tròn')
  hinh('HHC003192', [P(-R, -R), P(R, R)], [circle(O, R), seg(M, N), seg(N, Pp), seg(Pp, Q), seg(Q, M),
    dot(M), dot(N), dot(Pp), dot(Q),
    label(M, 'M', -20, 2), label(N, 'N', 20, 2), label(Pp, 'P', 20, 18), label(Q, 'Q', -20, 18)], { pad: 40, padDuoi: 40 })
}

// HHC003193_lg — tam giác nhọn MNP, đường cao MK (hình dựng theo ý c: N = 68°, P = 30°, NP = 5 cm)
{
  const u = 66
  const N = P(0, 0), Pp = P(5 * u, 0)
  const far = ray(N, 68, 1000), farP = ray(Pp, 150, 1000)
  const M = inter(N, far, Pp, farP), K = foot(M, N, Pp)
  ok(Math.abs(goc(N, Pp, M) - 68) < 0.5 && Math.abs(goc(Pp, N, M) - 30) < 0.5, 'góc N = 68°, góc P = 30°')
  hinh('HHC003193_lg', [N, Pp, M], [seg(M, N), seg(M, Pp), seg(N, Pp), seg(M, K), rightAngle(K, Pp, M, 14),
    dot(M), dot(N), dot(Pp), dot(K),
    label(M, 'M', 0, -14), label(N, 'N', -4, 30), label(K, 'K', 0, 30), label(Pp, 'P', 4, 30)])
}

// HHC003194 — máy bay: tam giác ABH vuông tại H, góc A = 30°
{
  const AB = 336
  const A = P(0, 0), B = ray(A, 30, AB), H = P(B.x, 0)
  ok(Math.abs(goc(A, H, B) - 30) < 0.5 && Math.abs(goc(H, A, B) - 90) < 0.5, 'góc A = 30°, vuông tại H')
  hinh('HHC003194', [A, B, H], [seg(A, B), seg(A, H), seg(H, B), rightAngle(H, A, B, 14), angleMark(A, H, B, 66),
    angleText(A, H, B, '30°', 112, 22),
    dot(A), dot(B), dot(H), label(A, 'A', -16, 30), label(B, 'B', 6, -14), label(H, 'H', 6, 30)])
}

// HHC003195 — khúc sông: AB vuông bờ AC, AC = 50 m, góc C = 62°
{
  const AC = 140
  const A = P(0, 0), C = P(AC, 0), B = P(0, -AC * Math.tan(62 * Math.PI / 180))
  ok(Math.abs(goc(C, A, B) - 62) < 0.5 && Math.abs(goc(A, B, C) - 90) < 0.5, 'góc C = 62°, vuông tại A')
  const x0 = -60, x1 = 220
  hinh('HHC003195', [P(x0, B.y), P(x1, 0), P(x1, B.y)], [
    fill([P(x0, B.y), P(x1, B.y), P(x1, 0), P(x0, 0)], '#eceff3'),
    seg(P(x0, B.y), P(x1, B.y)), seg(P(x0, 0), P(x1, 0)),
    segDash(A, B), segDash(B, C), rightAngle(A, C, B, 14), angleMark(C, A, B, 38),
    angleText(C, A, B, '62°', 74, 20),
    dot(A), dot(B), dot(C),
    label(B, 'B', 0, -14), label(A, 'A', -4, 30), label(C, 'C', 10, 30), num(mid(A, C), '50 m', 0, 36)], { pad: 40, padDuoi: 46 })
}

// HHC003196_lg — tam giác ABC vuông tại A (BC = 5, AC = 4, AB = 3), đường cao AH, E, I, K, M, D
{
  const u = 64
  const BC = 5 * u, BH = 1.8 * u, AH = 2.4 * u
  const B = P(0, 0), C = P(BC, 0), H = P(BH, 0), A = P(BH, -AH)
  ok(Math.abs(goc(A, B, C) - 90) < 0.5, 'A vuông')
  ok(Math.abs(dist(A, B) / dist(A, C) - 0.75) < 0.01, 'AB:AC = 3:4')
  const E = foot(H, A, B), I = mid(E, B)
  const BI = dist(B, I)
  const K = P(H.x + BI, 0)                 // K trên tia HC, HK = BI
  const M = mid(B, C), D = doiXung(A, M)
  ok(Math.abs(dist(H, K) - dist(B, I)) < 0.01, 'HK = BI')
  ok(Math.abs(dist(E, I) - dist(I, B)) < 0.01, 'I trung điểm BE')
  ok(Math.abs(goc(E, A, H) - 90) < 0.5, 'HE vuông AB')
  hinh('HHC003196_lg', [A, B, C, D], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(H, E), seg(A, K), seg(I, K),
    segDash(B, D), segDash(C, D), segDash(A, D),
    rightAngle(A, B, C, 12), rightAngle(H, A, B, 12), rightAngle(E, A, H, 12),
    tick(E, I, 1), tick(I, B, 1), tick(H, K, 1),
    dot(A), dot(B), dot(C), dot(D), dot(H), dot(E), dot(I), dot(K), dot(M),
    label(A, 'A', 0, -12), label(B, 'B', -18, 8), label(C, 'C', 18, 8), label(D, 'D', 16, 28),
    label(H, 'H', -4, 30), label(K, 'K', 6, 30), label(M, 'M', 20, -12),
    label(E, 'E', -18, 8), label(I, 'I', -18, 8)], { pad: 36, padDuoi: 44 })
}

// HHC003197 — hải đăng: tam giác ABC vuông tại C, BC = 20 m (bóng), góc B = 35°
{
  const BC = 300
  const B = P(0, 0), C = P(BC, 0), A = P(BC, -BC * Math.tan(35 * Math.PI / 180))
  ok(Math.abs(goc(B, C, A) - 35) < 0.5 && Math.abs(goc(C, B, A) - 90) < 0.5, 'góc B = 35°, vuông tại C')
  hinh('HHC003197', [B, C, A, P(BC + 100, A.y / 2)], [seg(B, C), seg(C, A), seg(B, A), rightAngle(C, B, A, 14),
    angleMark(B, C, A, 62), angleText(B, C, A, '35°', 104, 20),
    dot(A), dot(B), dot(C),
    label(A, 'A', -18, -4), label(B, 'B', -4, 30), label(C, 'C', 4, 30), num(mid(B, C), '20 m', 0, 36),
    num(P(BC + 56, A.y / 2), 'Hải đăng', 0, 8)])
}

// HHC003198_lg — tam giác MNP vuông tại M (NP = 20, MN = 16, MP = 12), đường cao MH, E, F, G
{
  const u = 24
  const M = P(0, 0), N = P(16 * u, 0), Pp = P(0, -12 * u)
  const H = foot(M, N, Pp), E = foot(H, M, Pp), F = mid(E, Pp)
  const EF = dist(E, F)
  const dN = Math.hypot(N.x - H.x, N.y - H.y)
  const G = P(H.x + (N.x - H.x) / dN * EF, H.y + (N.y - H.y) / dN * EF)
  ok(Math.abs(goc(M, N, Pp) - 90) < 0.5, 'M vuông')
  ok(Math.abs(dist(H, G) - dist(E, F)) < 0.01, 'HG = EF')
  ok(Math.abs(dist(F, Pp) - dist(E, F)) < 0.01, 'F trung điểm EP')
  ok(Math.abs(goc(H, M, N) - 90) < 0.5 && Math.abs(goc(E, H, Pp) - 90) < 0.5, 'MH vuông NP, HE vuông MP')
  hinh('HHC003198_lg', [M, N, Pp], [
    seg(M, Pp), seg(M, N), seg(Pp, N), seg(E, H), seg(M, H), seg(M, G), seg(F, G),
    rightAngle(M, N, Pp, 14), rightAngle(E, H, Pp, 12), rightAngle(H, M, G, 12),
    tick(Pp, F, 1), tick(F, E, 1), tick(H, G, 1),
    dot(M), dot(N), dot(Pp), dot(H), dot(E), dot(F), dot(G),
    label(Pp, 'P', 0, -14), label(F, 'F', -22, 8), label(E, 'E', -22, 8), label(M, 'M', -6, 30),
    label(N, 'N', 6, 30), label(H, 'H', 6, -12), label(G, 'G', 14, 28)], { pad: 36, padDuoi: 46 })
}

await xuatTat(RA)
