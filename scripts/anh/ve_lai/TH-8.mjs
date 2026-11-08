// Vẽ hình — gói TH-8 (câu hình học Toán 7 trong đề thi / đề cương, kho CHƯA có hình; Thùy giao 19/10).
//   node scripts/anh/ve_lai/TH-8.mjs [<thu_muc_ra>]
// Không vẽ: HHC002947 (tiên đề Euclid — thuần phát biểu), HHC002958 (định nghĩa trung trực — hình đúng định nghĩa = đáp án D).
import {
  P, seg, tick, angleMark, rightAngle, ray, rot, mid, foot, inter, bisector, doiXung, goc, dist, lerp, add,
  dot, label, num, angleText, labelOut, trongTam, hinh, xuatTat,
} from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/TH-8/moi'
const ok = (cond, msg) => { if (!cond) console.error('SAI DỰNG HÌNH:', msg) }
/** chữ đứng có nền trắng (ghi số đo trên tia mà không đè nét) */
const nen = (p, t, w = 44, h = 24) =>
  `<rect x="${p.x - w / 2}" y="${p.y - h / 2 - 2}" width="${w}" height="${h}" fill="#fff" stroke="none"/>` + num(p, t, 0, 8)

// HHC002948 — d là trung trực của AB, M ∈ d (đề hỏi so sánh MA, MB ⇒ không đánh dấu MA = MB)
{
  const A = P(0, 0), B = P(300, 0), I = mid(A, B)
  const d1 = P(I.x, I.y - 150), d2 = P(I.x, I.y + 120), M = P(I.x, I.y - 105)
  hinh('HHC002948', [A, B, d1, d2, M], [
    seg(A, B), seg(d1, d2), seg(M, A), seg(M, B), tick(A, I, 1), tick(I, B, 1), rightAngle(I, B, M), dot(A), dot(B), dot(M),
    label(A, 'A', -4, 30), label(B, 'B', 4, 30), label(M, 'M', 24, -4), label(d2, 'd', 22, 6),
  ])
}

// HHC002949 — Om là phân giác của xOy, xOm = 30° (không ghi mOy, không ghi xOy)
{
  const O = P(0, 0), x = ray(O, 0, 250), m = ray(O, 30, 250), y = ray(O, 60, 250)
  ok(Math.abs(goc(O, x, m) - 30) < 0.01 && Math.abs(goc(O, m, y) - 30) < 0.01, '2949 góc')
  hinh('HHC002949', [O, x, m, y], [
    seg(O, x), seg(O, m), seg(O, y), angleMark(O, x, m, 42), angleMark(O, m, y, 54), angleText(O, x, m, '30°', 112),
    label(O, 'O', -14, 26), label(x, 'x', 20, 8), label(m, 'm', 24, 8), label(y, 'y', 14, -8),
  ])
}

// HHC002950 — △ABC vuông tại A (AB < AC), Bx ∥ AC, Cy ∥ AB, Bx ∩ Cy = D (ABDC là hình chữ nhật do dựng đúng đề); M = BC ∩ AD
{
  const A = P(0, 0), B = ray(A, 8, 135), C = ray(A, 8 - 90, 210), D = add(B, P(C.x - A.x, C.y - A.y)), M = mid(B, C)
  ok(dist(A, B) < dist(A, C) && Math.abs(goc(A, B, C) - 90) < 0.01, '2950 vuông')
  const M2 = inter(B, C, A, D); ok(dist(M, M2) < 0.01, '2950 M')
  const xEnd = lerp(B, D, 1.28), yEnd = lerp(C, D, 1.28)
  hinh('HHC002950', [A, B, C, D, xEnd, yEnd], [
    seg(A, B), seg(A, C), seg(B, C), seg(B, xEnd), seg(C, yEnd), seg(A, D), rightAngle(A, B, C),
    dot(A), dot(B), dot(C), dot(D), dot(M),
    label(A, 'A', -16, -8), label(B, 'B', 4, -14), label(C, 'C', -16, 22), label(D, 'D', 18, -14),
    label(M, 'M', 24, 10), label(xEnd, 'x', 6, 30), label(yEnd, 'y', 24, 8),
  ])
}

// HHC002952 — Oz là phân giác của xOy, xOy = 60° (không ghi zOy)
{
  const O = P(0, 0), x = ray(O, 0, 250), z = ray(O, 30, 250), y = ray(O, 60, 250)
  hinh('HHC002952', [O, x, z, y], [
    seg(O, x), seg(O, z), seg(O, y), angleMark(O, x, z, 44), angleMark(O, z, y, 56), angleMark(O, x, y, 98),
    nen(ray(O, 14, 150), '60°', 50), // đặt ngoài tia Oz để không ngắt tia
    label(O, 'O', -14, 26), label(x, 'x', 20, 8), label(z, 'z', 24, 8), label(y, 'y', 14, -8),
  ])
}

// HHC002954 — M nằm trong góc tù xOy (dựng 120°); Mz ∥ Ox, Mt ∥ Oy, zMt nhọn (Mz cùng hướng Ox, Mt ngược hướng Oy ⇒ 60°)
{
  const O = P(0, 0), x = ray(O, 0, 290), y = ray(O, 120, 260), M = ray(O, 58, 200)
  const z = add(M, P(120, 0)), t = add(M, P(ray(O, 120 + 180, 105).x, ray(O, 120 + 180, 105).y))
  ok(Math.abs(goc(O, x, y) - 120) < 0.01 && Math.abs(goc(M, z, t) - 60) < 0.01, '2954 góc')
  hinh('HHC002954', [O, x, y, M, z, t], [
    seg(O, x), seg(O, y), seg(M, z), seg(M, t), dot(O), dot(M),
    label(O, 'O', -2, 30), label(x, 'x', 18, 8), label(y, 'y', -18, 4), label(M, 'M', -12, -12),
    label(z, 'z', 18, 8), label(t, 't', 14, 24),
  ])
}

// HHC002956 — △ABC vuông tại A, BD phân giác ABC (D ∈ AC), DE ⊥ BC (E ∈ BC), Q = tia BA ∩ tia ED, M trung điểm QC
{
  const A = P(0, 0), B = P(0, -160), C = P(220, 0)
  const D = inter(B, bisector(B, A, C, 100), A, C), E = foot(D, B, C), Q = inter(B, A, D, E), M = mid(Q, C)
  ok(Math.abs(goc(B, A, D) - goc(B, D, C)) < 0.01, '2956 phân giác')
  ok(Q.y > A.y, '2956 Q ngoài đoạn BA')
  ok(Math.abs(goc(D, B, M) - 180) < 0.01, '2956 BDM thẳng hàng (kiểm dựng)')
  hinh('HHC002956', [A, B, C, D, E, Q, M], [
    seg(B, Q), seg(A, C), seg(B, C), seg(Q, E), seg(Q, C), seg(B, M),
    rightAngle(A, B, C), rightAngle(E, D, C), angleMark(B, A, D, 38), angleMark(B, D, E, 50),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(Q), dot(M),
    label(A, 'A', -20, 8), label(B, 'B', -4, -14), label(C, 'C', 20, 8), label(D, 'D', 24, 22),
    label(E, 'E', 22, -6), label(Q, 'Q', -6, 30), label(M, 'M', 24, 14),
  ])
}

// HHC002957 — △ABC, M trung điểm BC, D đối xứng A qua M (MA = MD), AH ⊥ BC, DK ⊥ BC, I trung điểm AC, I trung điểm BE
{
  const k = 1.05
  const A = P(60 * k, 0), B = P(0, 140 * k), C = P(210 * k, 140 * k)
  const M = mid(B, C), D = doiXung(A, M), H = foot(A, B, C), K = foot(D, B, C), I = mid(A, C), E = doiXung(B, I)
  ok(Math.abs(goc(C, E, D) - 180) < 0.01, '2957 E,C,D thẳng hàng (kiểm dựng)')
  ok(H.x > B.x && H.x < C.x && K.x > B.x && K.x < C.x, '2957 H,K trong BC')
  hinh('HHC002957', [A, B, C, D, E, H, K, M, I], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(B, D), seg(C, D), seg(B, E), seg(C, E), seg(A, H), seg(D, K),
    tick(A, M, 1, 0.5), tick(M, D, 1, 0.5), tick(B, M, 2, 0.3), tick(M, C, 2, 0.7),
    tick(A, I, 3, 0.5), tick(I, C, 3, 0.5), tick(B, I, 4, 0.5), tick(I, E, 4, 0.5),
    rightAngle(H, A, B, 12), rightAngle(K, D, C, 12),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(M), dot(H), dot(K), dot(I),
    label(A, 'A', -4, -14), label(B, 'B', -16, 8), label(C, 'C', 22, 8), label(D, 'D', 4, 32), label(E, 'E', 18, 4),
    label(H, 'H', -8, 30), label(M, 'M', 22, -14), label(K, 'K', 14, 30), label(I, 'I', -16, -2),
  ])
}

// HHC002959 — △MNP và △HIK có MN = HI, PM = HK (NP, KI không cho ⇒ dựng khác nhau, không đánh dấu)
{
  const M = P(0, 0), N = ray(M, 0, 170), Pp = ray(M, 68, 130)
  const H = P(270, 0), I = ray(H, 0, 170), K = ray(H, 50, 130)
  ok(Math.abs(dist(M, N) - dist(H, I)) < 0.01 && Math.abs(dist(M, Pp) - dist(H, K)) < 0.01, '2959 cạnh')
  hinh('HHC002959', [M, N, Pp, H, I, K], [
    seg(M, N), seg(N, Pp), seg(Pp, M), seg(H, I), seg(I, K), seg(K, H),
    tick(M, N, 1), tick(H, I, 1), tick(Pp, M, 2), tick(H, K, 2),
    dot(M), dot(N), dot(Pp), dot(H), dot(I), dot(K),
    label(M, 'M', -16, 8), label(N, 'N', 16, 8), label(Pp, 'P', 0, -14),
    label(H, 'H', -16, 8), label(I, 'I', 16, 8), label(K, 'K', 0, -14),
  ])
}

await xuatTat(RA)
