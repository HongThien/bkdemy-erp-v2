// Vẽ lại hình — gói HH00099-1 (Tam giác bằng nhau — trường hợp thứ nhất c.c.c, Hình 7).
//   node scripts/anh/ve_lai/HH00099-1.mjs [<thu_muc_ra>]
import { P, seg, tick, dot, label, num, angleText, hinh, xuatTat,
  lerp, mid, rot, ray, reflect, goc, dist } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00099-1/moi'
const ok = (c, m) => console.assert(c, m)
const gan = (a, b, e = 0.01) => Math.abs(a - b) < e

/** Dấu "×" (hai gạch chéo nhau) tại trung điểm đoạn a→b — cặp cạnh bằng nhau loại thứ ba, như ảnh cũ HHC000852 */
function cheo(a, b) {
  const m = mid(a, b), L = 8
  const u = P((b.x - a.x) / dist(a, b), (b.y - a.y) / dist(a, b))
  const r = (deg) => { const t = deg * Math.PI / 180; return P(u.x * Math.cos(t) - u.y * Math.sin(t), u.x * Math.sin(t) + u.y * Math.cos(t)) }
  const d1 = r(60), d2 = r(-60)
  return seg(P(m.x - d1.x * L, m.y - d1.y * L), P(m.x + d1.x * L, m.y + d1.y * L))
    + seg(P(m.x - d2.x * L, m.y - d2.y * L), P(m.x + d2.x * L, m.y + d2.y * L))
}

// ── HH00099001 — A trên, B dưới-trái, C dưới-phải, D trong tam giác. AB = AC (2 gạch), DB = DC (1 gạch). Nét: AB, AC, BC, AD, BD, CD.
{
  const A = P(0, 0), B = P(-125, 285), C = P(125, 285), D = P(0, 200)
  ok(gan(dist(A, B), dist(A, C)), 'AB = AC')
  ok(gan(dist(D, B), dist(D, C)), 'DB = DC')
  hinh('HH00099001', [A, B, C, D], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(B, D), seg(C, D),
    tick(A, B, 2), tick(A, C, 2), tick(B, D, 1), tick(C, D, 1),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', 0, -14), label(B, 'B', -14, 24), label(C, 'C', 14, 24), label(D, 'D', 0, 30),
  ])
}

// ── HHC000845 — tứ giác ABCD (diều): AB = AD (2 gạch), BC = DC (1 gạch), góc D = 120° (ghi trong góc D). Nét: AB, BC, CD, DA, AC.
//    Dựng: AD = a, DC = c, góc ADC = 120° ⇒ AC tính bằng định lý cos; B đối xứng D qua AC.
{
  const a = 230, c = 170
  const AC = Math.sqrt(a * a + c * c + a * c)           // cos120° = -1/2
  const A = P(0, 0), C = P(AC, 0)
  const cosA = (a * a + AC * AC - c * c) / (2 * a * AC)
  const angA = Math.acos(cosA) * 180 / Math.PI
  const D = ray(A, -angA, a)                              // D phía dưới AC
  const B = reflect(D, A, C)
  ok(gan(goc(D, A, C), 120, 0.05), 'góc ADC = 120°')
  ok(gan(dist(A, B), dist(A, D)) && gan(dist(C, B), dist(C, D)), 'AB = AD, CB = CD')
  hinh('HHC000845', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C),
    tick(A, B, 2), tick(A, D, 2), tick(B, C, 1), tick(C, D, 1),
    angleText(D, A, C, '120°', 58),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', -18, 10), label(B, 'B', 0, -14), label(C, 'C', 20, 10), label(D, 'D', 0, 30),
  ])
}

// ── HHC000846 — A trên, M dưới-trái, N dưới-phải, H trên trục đối xứng. AM = AN (2 gạch), HM = HN (1 gạch). Nét: AM, AN, AH, HM, HN.
//    Đề (câu c) cho góc AMH = 20° ⇒ dựng đúng: chọn góc MAH = 22°, định lý sin cho tam giác AMH.
{
  const AM = 300, alpha = 22, gM = 20
  const gH = 180 - alpha - gM
  const AH = AM * Math.sin(gM * Math.PI / 180) / Math.sin(gH * Math.PI / 180)
  const A = P(0, 0), H = P(0, AH)
  const M = ray(A, 270 - alpha, AM)                       // lệch trái so với trục thẳng đứng đi xuống
  const N = reflect(M, A, H)
  ok(gan(goc(M, A, H), 20, 0.05), 'góc AMH = 20°')
  ok(gan(goc(A, M, H), alpha, 0.05), 'góc MAH = 22°')
  ok(gan(dist(A, M), dist(A, N)) && gan(dist(H, M), dist(H, N)), 'AM = AN, HM = HN')
  ok(M.y > H.y, 'M thấp hơn H như ảnh cũ')
  hinh('HHC000846', [A, M, N, H], [
    seg(A, M), seg(A, N), seg(A, H), seg(H, M), seg(H, N),
    tick(A, M, 2), tick(A, N, 2), tick(H, M, 1), tick(H, N, 1),
    dot(A), dot(M), dot(N), dot(H),
    label(A, 'A', 0, -14), label(M, 'M', -16, 26), label(N, 'N', 16, 26), label(H, 'H', 0, 30),
  ])
}

// ── HHC000848 — A trên, B, H, C thẳng hàng ngang, H trung điểm BC. AB = AC (2 gạch), BH = HC (1 gạch). Nét: AB, AC, BC, AH.
//    Đề (câu d): AB = 5, AH = 3, HC = 4 ⇒ AH : HC = 3 : 4 (không đánh dấu góc vuông — câu c bắt chứng minh).
{
  const k = 36
  const H = P(0, 0), B = P(-4 * k, 0), C = P(4 * k, 0), A = P(0, -3 * k)
  ok(gan(dist(A, B), 5 * k) && gan(dist(A, C), 5 * k), 'AB = AC = 5 (đơn vị k)')
  ok(gan(dist(A, H), 3 * k) && gan(dist(H, C), 4 * k), 'AH = 3, HC = 4')
  hinh('HHC000848', [A, B, C, H], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, H),
    tick(A, B, 2), tick(A, C, 2), tick(B, H, 1), tick(H, C, 1),
    dot(A), dot(B), dot(C), dot(H),
    label(A, 'A', 0, -14), label(B, 'B', -14, 24), label(C, 'C', 14, 24), label(H, 'H', 0, 30),
  ])
}

// ── HHC000850 — hình MNPQ (M trên-trái, N trên-phải, P dưới-phải, Q dưới-trái), đường chéo NQ.
//    MN = PQ (2 gạch), MQ = PN (1 gạch). Đề (câu c): góc M = 120°, góc QNP = 30°, và tam giác MNQ ⇒ góc MNQ = MQN = 30° ⇒ MN = MQ:
//    hình thoi góc M = P = 120°, N = Q = 60° — dựng đúng như vậy để khớp mọi câu.
{
  const L = 230
  const M = P(0, 0), N = P(L, 0)
  const Q = ray(M, 240, L)                                // góc NMQ = 120°
  const Pp = P(N.x + Q.x - M.x, N.y + Q.y - M.y)
  ok(gan(goc(M, N, Q), 120, 0.05), 'góc M = 120°')
  ok(gan(goc(N, Q, Pp), 30, 0.05), 'góc QNP = 30°')
  ok(gan(goc(N, M, Q), 30, 0.05), 'góc MNQ = 30°')
  ok(gan(dist(M, N), dist(Pp, Q)) && gan(dist(M, Q), dist(Pp, N)), 'MN = PQ, MQ = PN')
  hinh('HHC000850', [M, N, Pp, Q], [
    seg(M, N), seg(N, Pp), seg(Pp, Q), seg(Q, M), seg(N, Q),
    tick(M, N, 2), tick(Q, Pp, 2), tick(M, Q, 1), tick(N, Pp, 1),
    dot(M), dot(N), dot(Pp), dot(Q),
    label(M, 'M', -4, -14), label(N, 'N', 8, -14), label(Pp, 'P', 4, 28), label(Q, 'Q', -18, 22),
  ])
}

// ── HHC000852 — B, M, H, N, C thẳng hàng; H trung điểm BC, MH = NH (×); A trên trục đối xứng qua H.
//    AB = AC (1 gạch), AM = AN (2 gạch). Nét: AB, AM, AH, AN, AC, BC.
{
  const k = 1
  const H = P(0, 0), A = P(0, -130 * k)
  const B = P(-210, 0), C = P(210, 0), M = P(-105, 0), N = P(105, 0)
  ok(gan(dist(H, M), dist(H, N)) && gan(dist(H, B), dist(H, C)), 'HM = HN, HB = HC')
  ok(gan(dist(A, M), dist(A, N)) && gan(dist(A, B), dist(A, C)), 'AM = AN, AB = AC')
  hinh('HHC000852', [A, B, C, H, M, N], [
    seg(A, B), seg(A, M), seg(A, H), seg(A, N), seg(A, C), seg(B, C),
    tick(A, B, 1, 0.55), tick(A, C, 1, 0.55), tick(A, M, 2, 0.55), tick(A, N, 2, 0.55),
    cheo(M, H), cheo(H, N),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(N),
    label(A, 'A', 0, -14), label(B, 'B', -8, 28), label(M, 'M', -4, 28), label(H, 'H', 0, 28), label(N, 'N', 4, 28), label(C, 'C', 8, 28),
  ])
}

// ── HHC000856 — A trên, B dưới, M trái, N phải (đối xứng qua AB). AM = AN (2 gạch), BM = BN (1 gạch). Nét: AM, AN, BM, BN, AB.
//    Đề (câu c): góc MAB = 20°, MBA = 25° ⇒ dựng đúng (định lý sin ⇒ AM = AB·sin25°/sin135°).
{
  const AB = 300, a = 20, b = 25
  const s = (d) => Math.sin(d * Math.PI / 180)
  const AMl = AB * s(b) / s(180 - a - b)
  const A = P(0, 0), B = P(0, AB)
  const M = ray(A, 270 - a, AMl), N = reflect(M, A, B)
  ok(gan(goc(M, A, B), 135, 0.05), 'góc AMB = 135°')
  ok(gan(goc(B, M, A), 25, 0.05) && gan(goc(A, M, B), 20, 0.05), 'MAB = 20°, MBA = 25°')
  ok(gan(dist(A, M), dist(A, N)) && gan(dist(B, M), dist(B, N)), 'AM = AN, BM = BN')
  hinh('HHC000856', [A, B, M, N], [
    seg(A, M), seg(A, N), seg(B, M), seg(B, N), seg(A, B),
    tick(A, M, 2), tick(A, N, 2), tick(B, M, 1), tick(B, N, 1),
    dot(A), dot(B), dot(M), dot(N),
    label(A, 'A', 0, -14), label(B, 'B', 0, 34), label(M, 'M', -20, 8), label(N, 'N', 22, 8),
  ])
}

// ── HHC000858 — hình bình hành ABCD (A trên-trái, B trên-phải, C dưới-phải, D dưới-trái), đường chéo AC.
//    AB = CD (1 gạch), BC = DA (2 gạch). Nét: AB, BC, CD, DA, AC.
{
  const A = P(0, 0), B = P(270, 0), D = P(130, 230)
  const C = P(B.x + D.x - A.x, B.y + D.y - A.y)
  ok(gan(dist(A, B), dist(C, D)) && gan(dist(B, C), dist(D, A)), 'AB = CD, BC = DA')
  hinh('HHC000858', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C),
    tick(A, B, 1), tick(C, D, 1), tick(B, C, 2), tick(D, A, 2),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', -14, -10), label(B, 'B', 8, -14), label(C, 'C', 20, 22), label(D, 'D', -6, 30),
  ])
}

await xuatTat(RA)
