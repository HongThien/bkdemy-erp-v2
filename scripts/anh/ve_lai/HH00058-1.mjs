// Vẽ lại hình — gói HH00058-1 (Tứ giác, Hình 8).
//   node scripts/anh/ve_lai/HH00058-1.mjs [<thu_muc_ra>]
import { P, seg, angleMark, rightAngle, dot, label, num, hinh, xuatTat,
  ray, rot, inter, foot, goc, dist, labelOut, trongTam, angleText } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00058-1/moi'
const ok = (c, m) => console.assert(c, m)
const gần = (a, b, tol = 0.01) => Math.abs(a - b) < tol

// ── HHC000525+HHC000597 — tứ giác ABCD: A = 100°, B = 75°, C = 120°, D (hỏi) tự ra 65°. CD nằm ngang đáy.
{
  const C = P(0, 0), D = P(290, 0)
  const B = ray(C, 120, 200)
  const dA = ray(D, 115, 1)                       // DA hợp CD góc D = 65° (đáy→lên trái = 180 − 65)
  const A = inter(B, ray(B, 15, 1), D, dA)        // BA hợp BC góc B = 75°
  ok(gần(goc(C, B, D), 120), 'C = 120')
  ok(gần(goc(B, C, A), 75), 'B = 75')
  ok(gần(goc(D, C, A), 65), 'D = 65 (đáp số, không ghi trên hình)')
  ok(gần(goc(A, B, D), 100), 'A = 100')
  const G = trongTam([A, B, C, D])
  hinh('HHC000525+HHC000597', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    angleMark(A, B, D, 28), angleMark(B, A, C, 28), angleMark(C, B, D, 28), angleMark(D, C, A, 28),
    angleText(A, B, D, '100°', 66), angleText(B, A, C, '75°', 66), angleText(C, B, D, '120°', 70), angleText(D, C, A, '?', 60),
    dot(A), dot(B), dot(C), dot(D),
    labelOut(A, 'A', G), labelOut(B, 'B', G), labelOut(C, 'C', G), labelOut(D, 'D', G),
  ])
}

// ── Điểm M trong tứ giác ABCD (đều là tứ giác lồi). Toạ độ theo ảnh cũ (không có dữ kiện số) rồi thu về 0.6.
const k = 0.6
const Q = (x, y) => P(x * k, y * k)
const trongTu = (A, B, C, D, M) => {
  // M trong tứ giác lồi ABCD ⇔ cùng phía với mọi cạnh
  const s = (a, b, p) => Math.sign((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x))
  const t = [s(A, B, M), s(B, C, M), s(C, D, M), s(D, A, M)]
  return t.every((v) => v === t[0])
}

// ── HHC000588 — nét: 4 cạnh + MA, MB, MC, MD.
{
  const A = Q(118, 153), B = Q(395, 62), C = Q(578, 430), D = Q(25, 430), M = Q(338, 227)
  ok(trongTu(A, B, C, D, M), 'M nằm trong tứ giác')
  const G = trongTam([A, B, C, D])
  hinh('HHC000588', [A, B, C, D, M], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(M, A), seg(M, B), seg(M, C), seg(M, D),
    dot(A), dot(B), dot(C), dot(D), dot(M),
    labelOut(A, 'A', G), labelOut(B, 'B', G), labelOut(C, 'C', G), labelOut(D, 'D', G), label(M, 'M', 20, -8),
  ])
}

// ── HHC000589 — như 588 (4 cạnh + MA, MB, MC, MD).
{
  const A = Q(133, 167), B = Q(410, 75), C = Q(595, 443), D = Q(40, 443), M = Q(352, 240)
  ok(trongTu(A, B, C, D, M), 'M nằm trong tứ giác')
  const G = trongTam([A, B, C, D])
  hinh('HHC000589', [A, B, C, D, M], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(M, A), seg(M, B), seg(M, C), seg(M, D),
    dot(A), dot(B), dot(C), dot(D), dot(M),
    labelOut(A, 'A', G), labelOut(B, 'B', G), labelOut(C, 'C', G), labelOut(D, 'D', G), label(M, 'M', 20, 4),
  ])
}

// ── HHC000590 — nét: 4 cạnh + 2 đường chéo AC, BD + MA, MB, MC, MD (M nằm trong tứ giác, thấp hơn giao điểm hai đường chéo).
{
  const A = Q(253, 63), B = Q(537, 158), C = Q(632, 441), D = Q(63, 441), M = Q(348, 347)
  ok(trongTu(A, B, C, D, M), 'M nằm trong tứ giác')
  const G = trongTam([A, B, C, D])
  hinh('HHC000590', [A, B, C, D, M], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(M, A), seg(M, B), seg(M, C), seg(M, D),
    dot(A), dot(B), dot(C), dot(D), dot(M),
    labelOut(A, 'A', G), labelOut(B, 'B', G), labelOut(C, 'C', G), labelOut(D, 'D', G), label(M, 'M', 0, 30),
  ])
}

// ── HHC000591, HHC000592 — tứ giác MNPQ, hai đường chéo MP, NQ cắt nhau tại O (hình 592: đề gọi giao điểm là K, ảnh cũ ghi O → vẽ theo đề).
function chuyenMNPQ(ten, ten_giao) {
  const M = Q(210, 65), N = Q(492, 135), Pp = Q(563, 418), Qq = Q(68, 418)
  const O = inter(M, Pp, N, Qq)
  ok(goc(O, M, Pp) > 179.9 && goc(O, N, Qq) > 179.9, 'O nằm giữa M–P và N–Q')
  const G = trongTam([M, N, Pp, Qq])
  hinh(ten, [M, N, Pp, Qq], [
    seg(M, N), seg(N, Pp), seg(Pp, Qq), seg(Qq, M), seg(M, Pp), seg(N, Qq),
    dot(M), dot(N), dot(Pp), dot(Qq), dot(O),
    labelOut(M, 'M', G), labelOut(N, 'N', G), labelOut(Pp, 'P', G), labelOut(Qq, 'Q', G), label(O, ten_giao, 0, 42),
  ])
}
chuyenMNPQ('HHC000591', 'O')
chuyenMNPQ('HHC000592', 'K')

// ── HHC000593 — tứ giác PQRS: P = 90°, R = 90°, S = 100°, Q (hỏi) tự ra 80°.
{
  const s = 0.41
  const Pp = P(0, 0)
  const Qq = ray(Pp, -30, 605 * s)
  const S = ray(Pp, -120, 460 * s)                // PS ⟂ PQ
  const dirS = ray(S, -40, 1)                      // SR hợp SP góc 100° (SP hướng 60°, SR hướng −40°)
  const R = foot(Qq, S, dirS)                      // RQ ⟂ RS
  ok(gần(goc(Pp, Qq, S), 90), 'P = 90')
  ok(gần(goc(R, Qq, S), 90), 'R = 90')
  ok(gần(goc(S, Pp, R), 100), 'S = 100')
  ok(gần(goc(Qq, Pp, R), 80), 'Q = 80 (đáp số, không ghi trên hình)')
  const G = trongTam([Pp, Qq, R, S])
  hinh('HHC000593', [Pp, Qq, R, S], [
    seg(Pp, Qq), seg(Qq, R), seg(R, S), seg(S, Pp),
    rightAngle(Pp, Qq, S, 14), rightAngle(R, Qq, S, 14),
    angleText(S, Pp, R, '100°', 60), angleText(Qq, Pp, R, '?', 50),
    dot(Pp), dot(Qq), dot(R), dot(S),
    labelOut(Pp, 'P', G), labelOut(Qq, 'Q', G), labelOut(R, 'R', G), labelOut(S, 'S', G),
  ], { pad: 40, padDuoi: 46 })
}

// ── HHC000594 — tứ giác GHIK: G = 105°; góc ngoài tại H = 45° (GH kéo dài qua H), góc ngoài tại K = 120° (IK kéo dài qua K).
//    Góc trong thật: H = 135°, K = 60°, I = 60° (đều là ẩn "?", không ghi số).
{
  const s = 0.9
  const K = P(0, 0), I = P(339 * s, 0)
  const G = ray(K, 60, 231 * s)                    // góc trong K = 60° (ngoài 120°)
  const dGH = ray(G, -15, 1)                       // GK hướng 240°, GH hướng 345° ⇒ góc G = 105°
  const H = inter(G, dGH, I, ray(I, 120, 1))       // góc trong I = 60°
  const E = ray(H, -15, 75 * s)                    // GH kéo dài qua H
  const X = P(-90 * s, 0)                          // IK kéo dài qua K
  ok(gần(goc(G, K, H), 105), 'G = 105')
  ok(gần(goc(H, G, I), 135), 'H trong = 135')
  ok(gần(goc(H, E, I), 45), 'góc ngoài H = 45')
  ok(gần(goc(K, X, G), 120), 'góc ngoài K = 120')
  ok(gần(goc(K, G, I), 60) && gần(goc(I, K, H), 60), 'K = I = 60')
  const C = trongTam([G, H, I, K])
  hinh('HHC000594', [G, H, I, K, E, X], [
    seg(G, H), seg(H, I), seg(I, K), seg(K, G), seg(H, E), seg(K, X),
    angleMark(G, K, H, 30), angleMark(H, G, I, 30), angleMark(H, E, I, 30), angleMark(K, X, G, 24), angleMark(K, G, I, 40), angleMark(I, H, K, 34),
    angleText(G, K, H, '105°', 68), angleText(H, G, I, '?', 58), angleText(H, E, I, '45°', 82),
    angleText(K, X, G, '120°', 74), angleText(K, G, I, '?', 70), angleText(I, H, K, '?', 66),
    dot(G), dot(H), dot(I), dot(K),
    labelOut(G, 'G', C), labelOut(H, 'H', C, 22), labelOut(I, 'I', C, 30), labelOut(K, 'K', C, 34),
  ], { pad: 40, padDuoi: 48 })
}

await xuatTat(RA)
