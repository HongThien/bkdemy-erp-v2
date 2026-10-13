// Vẽ lại hình — gói HH07000000-1 (Chưa phân dạng, Hình 7): góc kề bù, so le trong/đồng vị, chứng minh song song.
//   node scripts/anh/ve_lai/HH07000000-1.mjs [<thu_muc_ra>]
import { P, seg, angleMark, sector, rightAngle, ray, rot, goc, dot, label, num, angleText, bisector, add, mul, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH07000000-1/moi'
const dir = (a) => ray(P(0, 0), a, 1) // véc-tơ đơn vị theo góc a
const kiem = (ten, v, d) => console.assert(Math.abs(v - d) < 0.5, `${ten}: ${v.toFixed(2)} ≠ ${d}`)

/** Cung đánh dấu góc pvq có thêm nét gạch chéo ở giữa cung */
function cungGach(v, p, q, r) {
  const m = bisector(v, p, q, r - 7), n = bisector(v, p, q, r + 7)
  return angleMark(v, p, q, r, 1) + seg(m, n)
}

/** Ghi 4 số góc quanh đỉnh v: tl = trên-trái, tp = trên-phải, dl = dưới-trái, dp = dưới-phải.
 *  Tu/Td = điểm trên/dưới của đường cắt, Lr/Ll = điểm bên phải/trái của đường thẳng đi qua v. */
function bonGoc(v, Tu, Td, Lr, Ll, [tl, tp, dl, dp], r = 27) {
  return angleText(v, Tu, Ll, tl, r) + angleText(v, Tu, Lr, tp, r) + angleText(v, Td, Ll, dl, r) + angleText(v, Td, Lr, dp, r)
}

// HHC002598 — zx thẳng, Ot là phân giác xOy, xOt = 30° ⇒ Oy ở 60°
{
  const O = P(0, 0), z = ray(O, 180, 230), x = ray(O, 0, 230), t = ray(O, 30, 215), y = ray(O, 60, 235)
  kiem('xOt', goc(O, x, t), 30); kiem('xOy', goc(O, x, y), 60); kiem('tOy=xOt', goc(O, t, y), goc(O, x, t))
  hinh('HHC002598', [z, x, t, y], [sector(O, x, t, 44), seg(z, x), seg(O, t), seg(O, y), angleMark(O, x, t, 44), dot(O),
    label(O, 'O', 0, 30), label(z, 'z', 0, 30), label(x, 'x', 0, 30), label(y, 'y', 14, -8), label(t, 't', 16, 2)])
}

// HHC002599 — hai đường (song song) bị một đường cắt tại A (trên), B (dưới); đánh số 1-2-3-4 như đề
{
  const A = P(0, 0), B = ray(A, 255, 150), aL = 8, ang = 75
  const d = dir(aL), e = dir(ang)
  const Tu = ray(A, ang, 80), Td = ray(B, ang + 180, 60)
  const A1 = add(A, mul(d, 160)), A2 = add(A, mul(d, -160)), B1 = add(B, mul(d, 160)), B2 = add(B, mul(d, -160))
  hinh('HHC002599', [Tu, Td, A1, A2, B1, B2], [seg(Tu, Td), seg(A2, A1), seg(B2, B1), dot(A), dot(B),
    bonGoc(A, Tu, Td, A1, A2, ['1', '4', '2', '3'], 28), bonGoc(B, Tu, Td, B1, B2, ['1', '4', '2', '3'], 28),
    label(A, 'A', -50, -14), label(B, 'B', 46, 28)])
}

// HHC002600 — hai đường bị cắt tại P (trên), Q (dưới); ở P: 1 trên-trái, 4 trên-phải, 2 dưới-trái, 3 dưới-phải;
//             ở Q: 3 trên-trái, 4 trên-phải, 2 dưới-trái, 1 dưới-phải. Hai đường không cho song song (như ảnh cũ).
{
  const Pp = P(0, 0), ang = 73, Q = ray(Pp, ang + 180, 150)
  const dp = dir(-9), dq = dir(10), e = dir(ang)
  const Tu = ray(Pp, ang, 80), Td = ray(Q, ang + 180, 60)
  const P1 = add(Pp, mul(dp, 160)), P2 = add(Pp, mul(dp, -160)), Q1 = add(Q, mul(dq, 160)), Q2 = add(Q, mul(dq, -160))
  hinh('HHC002600', [Tu, Td, P1, P2, Q1, Q2], [seg(Tu, Td), seg(P2, P1), seg(Q2, Q1), dot(Pp), dot(Q),
    bonGoc(Pp, Tu, Td, P1, P2, ['1', '4', '2', '3'], 28), bonGoc(Q, Tu, Td, Q1, Q2, ['3', '4', '2', '1'], 28),
    label(Pp, 'P', -52, -16), label(Q, 'Q', 46, 28)])
}

// HHC002605 — Oa, Ob đối nhau; aOm = 58°
{
  const O = P(0, 0), a = ray(O, 0, 230), b = ray(O, 180, 230), m = ray(O, 58, 230)
  kiem('aOm', goc(O, a, m), 58); kiem('bOm', goc(O, b, m), 122)
  hinh('HHC002605', [a, b, m], [seg(b, a), seg(O, m), angleMark(O, a, m, 46), dot(O),
    angleText(O, a, m, '58°', 84, 22), label(O, 'O', 0, 30), label(a, 'a', 0, 30), label(b, 'b', 0, 30), label(m, 'm', 14, -6)])
}

// HHC002608 — xy cắt mn tại A, ab tại B; xAn = 70°, ABa = 110° (song song, dựng thật)
{
  const A = P(0, 0), th = 70, B = ray(A, th + 180, 140)
  const x = ray(A, th, 80), y = ray(B, th + 180, 70)
  const m = P(A.x - 190, A.y), n = P(A.x + 190, A.y), a = P(B.x - 190, B.y), b = P(B.x + 190, B.y)
  kiem('xAn', goc(A, x, n), 70); kiem('ABa', goc(B, A, a), 110)
  hinh('HHC002608', [x, y, m, n, a, b], [seg(x, y), seg(m, n), seg(a, b), dot(A), dot(B),
    angleText(A, x, n, '70°', 56, 22), angleText(B, A, a, '110°', 62, 22),
    label(A, 'A', -22, -14), label(B, 'B', 24, -14),
    label(x, 'x', 16, -6), label(y, 'y', 4, 30), label(m, 'm', 0, 30), label(n, 'n', 0, 30), label(a, 'a', 0, 30), label(b, 'b', 0, 30)])
}

// HHC002609 — tam giác ABC; ABC = 40°, BAC = 100°; Ax đối tia AB; Ay phân giác xAC (⇒ Ay ∥ BC)
{
  const B = P(0, 0), L = 235, A = ray(B, 40, L)
  const C = P(A.x + L * Math.cos(40 * Math.PI / 180), 0) // ACB = 40° ⇒ AB = AC, C cùng mức với B
  kiem('ABC', goc(B, A, C), 40); kiem('BAC', goc(A, B, C), 100)
  const x = ray(A, 40, 110) // trên tia BA kéo dài qua A
  const y0 = bisector(A, x, C, 200)
  const y = P(y0.x, y0.y)
  kiem('xAy', goc(A, x, y), 40); kiem('yAC', goc(A, y, C), 40)
  hinh('HHC002609', [B, C, x, y], [seg(B, x), seg(B, C), seg(A, C), seg(A, y), dot(A),
    angleMark(B, A, C, 44), angleText(B, A, C, '40°', 72, 22),
    angleMark(A, x, y, 36, 2), angleMark(A, y, C, 36, 2),
    angleMark(A, B, C, 20), angleText(A, B, C, '100°', 66, 22),
    label(A, 'A', -22, -10), label(B, 'B', -18, 4), label(C, 'C', 22, 8), label(x, 'x', 14, -6), label(y, 'y', 14, 8)])
}

// HHC002610 — O, A, y thẳng hàng; OA ⊥ OB; yAt = 40°, xOy = 140°, OBz = 130° (At ∥ Ox ∥ Bz, dựng thật)
{
  const O = P(0, 0), A = ray(O, 40, 175), y = ray(O, 40, 285), x = ray(O, 180, 190)
  const B = ray(O, -50, 130)
  const t = P(A.x + 190, A.y), z = P(B.x + 190, B.y)
  kiem('xOy', goc(O, x, y), 140); kiem('yAt', goc(A, y, t), 40); kiem('AOB', goc(O, A, B), 90); kiem('OBz', goc(B, O, z), 130)
  hinh('HHC002610', [x, y, t, z, B], [seg(x, O), seg(O, y), seg(O, B), seg(A, t), seg(B, z), dot(O), dot(A), dot(B),
    rightAngle(O, A, B, 14),
    angleMark(O, x, y, 36), angleMark(A, y, t, 38, 2), cungGach(B, O, z, 32),
    label(x, 'x', -4, -14), label(y, 'y', 18, -8), label(O, 'O', -14, 34), label(A, 'A', -4, 34), label(B, 'B', -8, 34),
    label(t, 't', 18, 8), label(z, 'z', 18, 8)])
}

// HHC002611 — OAx = 30°, OBy = 150°, AOB = 60°, Ot phân giác (Ax ∥ Ot ∥ By, dựng thật)
{
  const O = P(0, 0), A = ray(O, 30, 185), B = ray(O, -30, 185), t = ray(O, 0, 235)
  const x = P(A.x - 230, A.y), y = P(B.x + 190, B.y)
  kiem('AOB', goc(O, A, B), 60); kiem('AOt', goc(O, A, t), 30); kiem('OAx', goc(A, O, x), 30); kiem('OBy', goc(B, O, y), 150)
  hinh('HHC002611', [x, y, t, A, B], [seg(O, A), seg(O, B), seg(O, t), seg(x, A), seg(B, y), dot(O), dot(A), dot(B),
    angleMark(O, A, t, 40, 2), angleMark(O, t, B, 40, 2), angleMark(A, O, x, 36, 2), angleMark(B, O, y, 32),
    label(x, 'x', -16, 8), label(y, 'y', 18, 8), label(t, 't', 16, 8), label(A, 'A', 6, -14), label(B, 'B', 4, 34), label(O, 'O', -20, 10)])
}

await xuatTat(RA)
