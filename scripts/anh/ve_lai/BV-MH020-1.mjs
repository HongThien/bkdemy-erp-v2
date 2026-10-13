// Vẽ lại hình — gói BV-MH020-1 (MH.020 Tứ giác · Hình 8 · biến thể của BT.08.020.01 và BT.08.020.03)
//   node scripts/anh/ve_lai/BV-MH020-1.mjs [<thu_muc_ra>]
import { P, seg, angleMark, rightAngle, ray, rot, inter, lerp, goc, dot, label, angleText, labelOut, trongTam, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BV-MH020-1/moi'
const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
/** M nằm TRONG tứ giác lồi pts (theo thứ tự đỉnh) */
const trong = (pts, M) => { const s = pts.map((p, i) => Math.sign(cross(p, pts[(i + 1) % pts.length], M))); return s.every((v) => v === s[0]) }

// ───────── 06c2aab7 — tứ giác PQRS: P = R = 90°, S = 100°, Q = ? (= 80°, không ghi) ─────────
{
  const S = P(0, 0), Pp = ray(S, 62, 185), R = ray(S, -38, 200)     // góc S = 62 − (−38) = 100°
  const Q = inter(Pp, rot(S, Pp, 90), R, rot(S, R, 90))            // PQ ⊥ SP, RQ ⊥ SR
  console.assert(Math.abs(goc(S, Pp, R) - 100) < 0.5 && Math.abs(goc(Pp, S, Q) - 90) < 0.5 && Math.abs(goc(R, S, Q) - 90) < 0.5 && Math.abs(goc(Q, Pp, R) - 80) < 0.5)
  const g = trongTam([Pp, Q, R, S])
  hinh('06c2aab7-0774-47b5-82da-f972e9ff9cd6', [Pp, Q, R, S], [
    seg(Pp, Q), seg(Q, R), seg(R, S), seg(S, Pp),
    rightAngle(Pp, S, Q), rightAngle(R, S, Q),
    angleText(S, Pp, R, '100°', 62), angleText(Q, Pp, R, '?', 42),
    dot(Pp), dot(Q), dot(R), dot(S),
    labelOut(Pp, 'P', g, 22), labelOut(Q, 'Q', g, 22), labelOut(R, 'R', g, 22), labelOut(S, 'S', g, 22)])
}

// ───────── 038c358c — tứ giác GHIK, H nằm trên tia kéo dài; G = 105°, góc ngoài tại K = 120°, góc ngoài tại H = 45° ─────────
{
  const K = P(0, 0), I = P(320, 0)
  const G = ray(K, 60, 215)                                         // góc GKI = 180° − 120° = 60°
  const H = inter(G, ray(G, 345, 100), I, ray(I, 120, 100))        // góc G = 105° (GK hướng 240°, GH hướng 345°), góc I = 60°
  const E = lerp(G, H, 1.35), K1 = P(-85, 0)                       // tia kéo dài GH về phía H; kéo dài IK về phía K
  console.assert(Math.abs(goc(G, K, H) - 105) < 0.5 && Math.abs(goc(K, G, I) - 60) < 0.5 && Math.abs(goc(I, K, H) - 60) < 0.5)
  console.assert(Math.abs(goc(H, I, E) - 45) < 0.5 && Math.abs(goc(K, K1, G) - 120) < 0.5)
  const g = trongTam([G, H, I, K])
  hinh('038c358c-043e-42aa-9a74-232b5495a7b7', [G, H, I, K, E, K1], [
    seg(K1, I), seg(K, G), seg(G, E), seg(H, I),
    angleMark(G, K, H, 28), angleText(G, K, H, '105°', 58),
    angleMark(H, G, I, 38), angleText(H, G, I, '?', 62),
    angleMark(H, I, E, 26), angleText(H, I, E, '45°', 66),
    angleMark(K, K1, G, 24), angleText(K, K1, G, '120°', 62),
    angleMark(K, G, I, 42), angleText(K, G, I, '?', 68),
    angleMark(I, K, H, 30), angleText(I, K, H, '?', 62),
    dot(G), dot(H), dot(I), dot(K),
    labelOut(G, 'G', g, 20), label(H, 'H', 4, -16), labelOut(I, 'I', g, 22), label(K, 'K', 0, 34)])
}

// ───────── 198c9c45 — tứ giác MNPQ, P nằm trên tia kéo dài của QP: Q = 100°, N = 60°, góc ngoài tại P = 60°, M = ? (= 80°) ─────────
{
  const Q = P(0, 0), Pp = P(260, 0)
  const M = ray(Q, 100, 185)                                        // góc Q = 100°
  const N = inter(M, P(M.x + 100, M.y), Pp, ray(Pp, 60, 100))       // góc ngoài tại P = 60° ⇒ NPQ = 120°; góc M = 80° ⇒ MN nằm ngang
  const E = P(Pp.x + 95, Pp.y)
  console.assert(Math.abs(goc(Q, Pp, M) - 100) < 0.5 && Math.abs(goc(N, M, Pp) - 60) < 0.5 && Math.abs(goc(Pp, E, N) - 60) < 0.5 && Math.abs(goc(M, Q, N) - 80) < 0.5)
  const g = trongTam([M, N, Pp, Q])
  hinh('198c9c45-765a-4a09-acfe-6c4db1a4461b', [M, N, Pp, Q, E], [
    seg(M, N), seg(N, Pp), seg(Q, E), seg(Q, M),
    angleMark(Q, Pp, M, 30), angleText(Q, Pp, M, '100°', 72),
    angleMark(M, Q, N, 30), angleText(M, Q, N, '?', 58),
    angleMark(N, M, Pp, 30), angleText(N, M, Pp, '60°', 74),
    angleMark(Pp, E, N, 30), angleText(Pp, E, N, '60°', 74),
    dot(M), dot(N), dot(Pp), dot(Q),
    labelOut(M, 'M', g, 20), labelOut(N, 'N', g, 22), label(Pp, 'P', 0, 36), label(Q, 'Q', -6, 36)])
}

// ───────── f0811ee7 — tứ giác ABCD: A = 120°, B = C = D (đánh dấu hai cung, ghi ?) ─────────
{
  const A = P(0, 0), B = P(280, 0)
  const D = ray(A, 240, 185)                                        // góc A = 120°
  const C = inter(B, ray(B, 260, 100), D, ray(D, -20, 100))         // góc B = 80° (BA hướng 180°, BC hướng 260°), góc D = 80° (DA hướng 60°, DC hướng −20°)
  console.assert(Math.abs(goc(A, B, D) - 120) < 0.5 && Math.abs(goc(B, A, C) - 80) < 0.5 && Math.abs(goc(C, B, D) - 80) < 0.5 && Math.abs(goc(D, A, C) - 80) < 0.5)
  const g = trongTam([A, B, C, D])
  hinh('f0811ee7-fe7f-4dc1-8470-94c85c224402', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    angleMark(B, A, C, 24, 2), angleMark(C, B, D, 24, 2), angleMark(D, A, C, 24, 2),
    angleText(A, B, D, '120°', 66), angleText(B, A, C, '?', 62), angleText(C, B, D, '?', 62), angleText(D, A, C, '?', 62),
    dot(A), dot(B), dot(C), dot(D),
    labelOut(A, 'A', g, 20), labelOut(B, 'B', g, 22), labelOut(C, 'C', g, 22), labelOut(D, 'D', g, 22)])
}

// ───────── Tứ giác ABCD lồi, M nằm trong, nối MA MB MC MD (eb76593d, 868af9fb) ─────────
function tuGiacM(ten) {
  const k = 0.62
  const A = P(118 * k, 153 * k), B = P(396 * k, 62 * k), C = P(578 * k, 430 * k), D = P(25 * k, 430 * k), M = P(338 * k, 227 * k)
  console.assert(trong([A, B, C, D], M), 'M phải nằm trong ABCD')
  const g = trongTam([A, B, C, D])
  hinh(ten, [A, B, C, D, M], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    seg(M, A), seg(M, B), seg(M, C), seg(M, D),
    dot(A), dot(B), dot(C), dot(D), dot(M),
    labelOut(A, 'A', g, 20), labelOut(B, 'B', g, 22), labelOut(C, 'C', g, 22), labelOut(D, 'D', g, 22),
    label(M, 'M', 22, 4)])
}
tuGiacM('eb76593d-7ce3-4107-baeb-282c465fcf4b')
tuGiacM('868af9fb-e418-4dd8-b086-6f2e059fa74f')

// ───────── 6e62b955 — tứ giác ABCD, M nằm trong, nối MA MB MC MD và hai đường chéo AC, BD ─────────
{
  const k = 0.6
  const A = P(253 * k, 63 * k), B = P(537 * k, 158 * k), C = P(631 * k, 441 * k), D = P(63 * k, 441 * k), M = P(347 * k, 347 * k)
  console.assert(trong([A, B, C, D], M), 'M phải nằm trong ABCD')
  const g = trongTam([A, B, C, D])
  hinh('6e62b955-7ba2-40c8-80b1-4810cce75e1b', [A, B, C, D, M], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    seg(M, A), seg(M, B), seg(M, C), seg(M, D),
    dot(A), dot(B), dot(C), dot(D), dot(M),
    labelOut(A, 'A', g, 20), labelOut(B, 'B', g, 22), labelOut(C, 'C', g, 22), labelOut(D, 'D', g, 22),
    label(M, 'M', 0, 32)])
}

// ───────── 6a8fe5ee — tứ giác MNPQ, MP cắt NQ tại O ─────────
{
  const M = P(120, 0), N = P(290, 44), P_ = P(333, 215), Q = P(34, 215)
  const O = inter(M, P_, N, Q)
  console.assert(trong([M, N, P_, Q], O), 'O phải nằm trong MNPQ')
  const g = trongTam([M, N, P_, Q])
  hinh('6a8fe5ee-dab7-4be9-8db8-e002ed215458', [M, N, P_, Q], [
    seg(M, N), seg(N, P_), seg(P_, Q), seg(Q, M), seg(M, P_), seg(N, Q),
    dot(M), dot(N), dot(P_), dot(Q), dot(O),
    labelOut(M, 'M', g, 20), labelOut(N, 'N', g, 22), labelOut(P_, 'P', g, 22), labelOut(Q, 'Q', g, 22),
    label(O, 'O', 0, 36)])
}

await xuatTat(RA)
