// Vẽ lại hình — gói HH00138-5 (Ôn thi giữa kì I, Hình học 7).
//   node scripts/anh/ve_lai/HH00138-5.mjs [<thu_muc_ra>]
import { P, seg, segDash, lineExt, tick, angleMark, rightAngle, sector, ray, dot, label, num, angleText, angleBien, bien,
  inter, lerp, bisector, goc, trongTam, labelOut, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00138-5/moi'
const ok = (v, e, ten) => console.assert(Math.abs(v - e) < 0.5, `${ten}: ${v} ≠ ${e}`)

// HHC002835 — xOy = 30°, Oy là phân giác của xOz ⇒ xOz = 60°; ảnh cũ không ghi số đo ⇒ không ghi
{
  const O = P(0, 0), z = ray(O, 0, 290), y = ray(O, 30, 270), x = ray(O, 60, 250)
  ok(goc(O, x, y), 30, 'xOy'); ok(goc(O, y, z), 30, 'yOz')
  hinh('HHC002835', [O, x, y, z], [seg(O, x), seg(O, y), seg(O, z), dot(O),
    label(O, 'O', -16, 20), label(x, 'x', 14, 4), label(y, 'y', 8, 26), label(z, 'z', 16, 8)])
}

// HHC002838 — a ∥ b cùng ⊥ c; cát tuyến cắt a tại A, b tại B; B1 = 75° (góc trên-phải tại B); góc đánh số 1-2-3-4 theo ảnh cũ
{
  const B = P(0, 0), A = ray(B, 75, 150 / Math.sin(75 * Math.PI / 180))
  const cx = 170
  const aL = P(-110, A.y), aR = P(270, A.y), bL = P(-110, 0), bR = P(270, 0)
  const cT = P(cx, A.y - 60), cB = P(cx, 55)
  const tT = ray(A, 75, 58), tB = ray(B, 255, 52)
  ok(goc(B, bR, A), 75, 'B1')
  const ca = P(cx, A.y), cb = P(cx, 0)
  const so = (V, ang, r, t) => num(ray(V, ang, r), t, 0, 7, 20)
  hinh('HHC002838', [aL, aR, cT, cB, tT, tB], [
    seg(aL, aR), seg(bL, bR), seg(cT, cB), seg(tB, tT),
    rightAngle(ca, P(cx - 1, A.y), P(cx, A.y + 1), 14), rightAngle(cb, P(cx - 1, 0), P(cx, 1), 14),
    dot(A), dot(B),
    label(A, 'A', -38, -26), so(A, 135, 24, '2'), so(A, 37.5, 24, '1'), so(A, 217.5, 24, '3'), so(A, 307.5, 24, '4'),
    label(B, 'B', -38, 36), so(B, 135, 24, '2'), so(B, 37.5, 17, '1'), so(B, 217.5, 24, '3'), so(B, 307.5, 24, '4'),
    angleMark(B, bR, A, 32), num(ray(B, 22, 66), '75°', 0, 8),
    label(P(262, A.y), 'a', 0, -10), label(P(262, 0), 'b', 0, -10), label(P(cx + 20, A.y - 44), 'c', 0, 0)])
}

// HHC002840 — tam giác ABC; AD phân giác góc A (D ∈ BC), BE phân giác góc B (E ∈ AC); ảnh cũ có cung ở A (2 góc) và 2 cung ở B
{
  const B = P(0, 0), C = P(330, 0), A = P(126, -167)
  const D = inter(B, C, A, bisector(A, B, C)), E = inter(A, C, B, bisector(B, A, C))
  ok(goc(A, B, D), goc(A, D, C), 'BAD=DAC'); ok(goc(B, A, E), goc(B, E, C), 'ABE=EBC')
  const g = trongTam([A, B, C])
  hinh('HHC002840', [A, B, C, D, E], [seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(B, E),
    dot(A), dot(B), dot(C), dot(D), dot(E),
    angleMark(A, B, D, 34), angleMark(A, D, C, 34), angleMark(B, A, E, 40, 2), angleMark(B, E, C, 40, 2),
    labelOut(A, 'A', g, 24), labelOut(B, 'B', g, 26), labelOut(C, 'C', g, 26),
    label(D, 'D', 0, 30), label(E, 'E', 18, -6)])
}

// HHC002843 — x ∥ y, z cắt x tại M, y tại N; M1 = 55° (trên x, phải z), M2 (trên x, trái z), N1 (trên y, trái z)
{
  const M = P(0, 0)
  const Nn = P(M.x - 140 / Math.tan(55 * Math.PI / 180), 140)
  const zT = ray(M, 55, 90), zB = ray(Nn, 235, 60)
  const xL = P(-200, 0), xR = P(190, 0), yL = P(-200 - 100 + 100, 140), yR = P(190, 140)
  ok(goc(M, xR, zT), 55, 'M1'); ok(goc(Nn, P(-300, 140), zT), 125, 'N1')
  const so = (V, ang, r, t) => num(ray(V, ang, r), t, 0, 7, 20)
  hinh('HHC002843', [xL, xR, yL, yR, zT, zB], [seg(xL, xR), seg(yL, yR), seg(zB, zT), dot(M), dot(Nn),
    angleMark(M, xR, zT, 34), num(ray(M, 18, 66), '55°', 0, 8), so(M, 27, 20, '1'), so(M, 150, 22, '2'),
    so(Nn, 150, 22, '1'),
    label(M, 'M', 20, 28), label(Nn, 'N', 18, 28),
    label(xR, 'x', 14, 8), label(yR, 'y', 14, 8), label(zT, 'z', 14, -4)])
}

// HHC002844 — A,F,E thẳng hàng; B,C,D thẳng hàng; AD cắt FC tại G (FC nằm ngang như ảnh cũ)
{
  const A = P(0, 0), B = P(209, 0), E = P(-98, 218), D = P(267, 218), t = 55 / 150
  const F = lerp(A, E, t), C = lerp(B, D, t), G = inter(A, D, F, C)
  hinh('HHC002844', [A, B, E, D, F, C, G], [seg(A, B), seg(E, D), seg(A, E), seg(B, D), seg(A, D), seg(F, C),
    dot(A), dot(B), dot(E), dot(D), dot(F), dot(C), dot(G),
    label(A, 'A', -4, -14), label(B, 'B', 4, -14), label(F, 'F', -24, 8), label(C, 'C', 24, 8),
    label(G, 'G', -18, 30), label(E, 'E', -20, 16), label(D, 'D', 20, 16)])
}

// HHC002794 — hai đường thẳng xy và mn cắt nhau tại E (không số đo)
{
  const E = P(0, 0), x = ray(E, 124, 150), y = ray(E, 304, 140), m = ray(E, 182, 175), n = ray(E, 2, 195)
  hinh('HHC002794', [x, y, m, n, E], [seg(x, y), seg(m, n), dot(E),
    label(E, 'E', -16, 26), label(x, 'x', -6, -12), label(y, 'y', 16, 18), label(m, 'm', -4, 28), label(n, 'n', 6, 28)])
}

// HHC002795 — Oy nằm giữa Ox, Oz; ảnh cũ có cung (nền xám) ở góc xOz
{
  const O = P(0, 0), x = ray(O, 0, 240), y = ray(O, 36, 215), z = ray(O, 112, 215)
  hinh('HHC002795', [O, x, y, z], [seg(O, x), seg(O, y), seg(O, z), dot(O), angleMark(O, x, z, 34),
    label(O, 'O', -16, 26), label(x, 'x', 16, 8), label(y, 'y', 14, 18), label(z, 'z', -2, -12)])
}

// HHC002798 — A ∈ xy; xAB = 70°, yAC = 55°, ACB = 55° (⇒ BAC = 55°, ABC = 70°, xy ∥ BC); hình ghi 70°, 55°, 55°
{
  const A = P(0, 0), x = P(-200, 0), y = P(200, 0)
  const B = ray(A, 250, 215), C = inter(B, P(B.x + 1, B.y), A, ray(A, 305, 100))
  ok(goc(A, x, B), 70, 'xAB'); ok(goc(A, y, C), 55, 'yAC'); ok(goc(C, A, B), 55, 'ACB'); ok(goc(A, B, C), 55, 'BAC')
  hinh('HHC002798', [x, y, B, C, A], [seg(x, y), seg(A, B), seg(A, C), seg(B, C), dot(A), dot(B), dot(C),
    angleText(A, x, B, '70°', 66), angleText(A, y, C, '55°', 66), angleText(C, A, B, '55°', 78),
    label(x, 'x', 0, -12), label(y, 'y', 0, -12), label(A, 'A', 22, -14), label(B, 'B', -8, 34), label(C, 'C', 14, 34)])
}

await xuatTat(RA)
