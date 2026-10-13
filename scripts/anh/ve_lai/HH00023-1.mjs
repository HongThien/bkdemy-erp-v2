// Vẽ lại hình — gói HH00023-1 (Hai đường thẳng song song, Hình 7).
//   node scripts/anh/ve_lai/HH00023-1.mjs [<thu_muc_ra>]
// Mọi đường song song dựng cùng véc-tơ chỉ phương (nằm ngang / cùng góc); số đo ghi trên hình dựng bằng ray (assert ở cuối mỗi khối).
import { P, seg, dot, label, angleMark, rightAngle, ray, goc, angleText, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00023-1/moi'
const KHUNG = { pad: 40, padDuoi: 50 }
const gan = (v, d, ten) => console.assert(Math.abs(v - d) < 0.5, `${ten}: ${v.toFixed(2)} ≠ ${d}`)
const sd = (a) => Math.sin(a * Math.PI / 180)
const td = (a) => Math.tan(a * Math.PI / 180)

// HHC000699 — xx′ ∥ yy′, cát tuyến zz′ cắt tại A, B; góc xAB = 70°
{
  const h = 180, A = P(0, 0), B = ray(A, 250, h / sd(70))
  const xl = P(-270, 0), xr = P(270, 0), yl = P(-270, h), yr = P(270, h)
  const z = ray(A, 70, 80 / sd(70)), z2 = ray(B, 250, 80 / sd(70))
  gan(goc(A, xl, B), 70, '699 xAB')
  hinh('HHC000699', [xl, xr, yl, yr, z, z2], [
    seg(xl, xr), seg(yl, yr), seg(z2, z), dot(A), dot(B),
    angleText(A, xl, B, '70°', 62),
    label(xl, 'x', 12, -14), label(xr, 'x′', -12, -14), label(yl, 'y', 12, -14), label(yr, 'y′', -12, -14),
    label(A, 'A', -26, -14), label(B, 'B', -26, -14), label(z, 'z', 26, 18), label(z2, 'z′', 28, -6)], KHUNG)
}

// HHC000700 — góc xMN = 55°, góc MNy = 125° (hai đường song song theo số đo)
{
  const h = 150, M = P(0, 0), N = ray(M, 235, h / sd(55))
  const X0 = -205, X1 = 150
  const xl = P(X0, 0), xr = P(X1, 0), yl = P(X0, h), yr = P(X1, h)
  const z = ray(M, 55, 85 / sd(55)), z2 = ray(N, 235, 80 / sd(55))
  gan(goc(M, xl, N), 55, '700 xMN'); gan(goc(N, yl, M), 125, '700 MNy')
  hinh('HHC000700', [xl, xr, yl, yr, z, z2], [
    seg(xl, xr), seg(yl, yr), seg(z2, z), dot(M), dot(N),
    angleText(M, xl, N, '55°', 64), angleText(N, yl, M, '125°', 60),
    label(xl, 'x', 12, -14), label(xr, 'x′', -14, -14), label(yl, 'y', 12, -14), label(yr, 'y′', -14, -14),
    label(M, 'M', -20, -16), label(N, 'N', 20, 34), label(z, 'z', 22, 8), label(z2, 'z′', 30, 4)], KHUNG)
}

// HHC000701 — xx′ ∥ yy′; zz′ qua A, B; tt′ qua C, D; xAB = ABD = 80°, tCx′ = 115°
{
  const h = 155, A = P(0, 0), B = ray(A, 260, h / sd(80))
  const C = P(150, 0), D = ray(C, 295, h / sd(65))
  const X0 = -105, X1 = 300
  const xl = P(X0, 0), xr = P(X1, 0), yl = P(X0, h), yr = P(X1, h)
  const z = ray(A, 80, 95 / sd(80)), z2 = ray(B, 260, 100 / sd(80))
  const t = ray(C, 115, 95 / sd(65)), t2 = ray(D, 295, 100 / sd(65))
  gan(goc(A, xl, B), 80, '701 xAB'); gan(goc(B, A, yr), 80, '701 ABD'); gan(goc(C, t, xr), 115, '701 tCx′')
  hinh('HHC000701', [xl, xr, yl, yr, z, z2, t, t2], [
    seg(xl, xr), seg(yl, yr), seg(z2, z), seg(t2, t), dot(A), dot(B), dot(C), dot(D),
    angleText(A, xl, B, '80°', 58), angleText(B, A, yr, '80°', 56), angleText(C, t, xr, '115°', 54),
    label(xl, 'x', 12, -14), label(xr, 'x′', -14, -14), label(yl, 'y', 12, -14), label(yr, 'y′', -14, -14),
    label(A, 'A', -24, -12), label(B, 'B', 20, 30), label(C, 'C', -20, 30), label(D, 'D', -22, 30),
    label(z, 'z', -22, 12), label(z2, 'z′', 30, -4), label(t, 't', 24, 12), label(t2, 't′', 24, 4)], KHUNG)
}

// HHC000702 — tia Mx, Ny (∥); zz′ qua M, N; tt′ qua P, Q; zMx = zNy = 70°, xPQ = 65°
{
  const h = 155, M = P(0, 0), N = ray(M, 250, h / sd(70))
  const Pp = P(145, 0), Q = ray(Pp, 295, h / sd(65))
  const xe = P(265, 0), ye = P(265, h)
  const z = ray(M, 70, 90 / sd(70)), z2 = ray(N, 250, 90 / sd(70))
  const t = ray(Pp, 115, 90 / sd(65)), t2 = ray(Q, 295, 85 / sd(65))
  gan(goc(M, xe, z), 70, '702 zMx'); gan(goc(N, ye, z), 70, '702 zNy'); gan(goc(Pp, xe, Q), 65, '702 xPQ')
  hinh('HHC000702', [M, N, xe, ye, z, z2, t, t2], [
    seg(M, xe), seg(N, ye), seg(z2, z), seg(t2, t), dot(M), dot(N), dot(Pp), dot(Q),
    angleText(M, xe, z, '70°', 60), angleText(N, ye, z, '70°', 60), angleText(Pp, xe, Q, '65°', 62),
    label(M, 'M', -24, -10), label(N, 'N', -26, -4), label(Pp, 'P', 16, -16), label(Q, 'Q', -24, 30),
    label(xe, 'x', -8, -14), label(ye, 'y', -8, -14),
    label(z, 'z', -22, 10), label(z2, 'z′', 28, 2), label(t, 't', 22, 12), label(t2, 't′', 26, -4)], KHUNG)
}

// HHC000703 — cát tuyến tt′ qua A, B, C; tia Ax, By, Cz song song; xAB = 130°, ABy = 50°, z′Ct′ = 50°
{
  const A = P(0, 0), B = ray(A, 230, 130), C = ray(B, 230, 130)
  const X1 = 190
  const xe = P(X1, A.y), ye = P(X1, B.y), ze = P(X1, C.y), z2 = P(C.x - 75, C.y)
  const t = ray(A, 50, 85 / sd(50)), t2 = ray(C, 230, 70 / sd(50))
  gan(goc(A, xe, B), 130, '703 xAB'); gan(goc(B, ye, A), 50, '703 ABy'); gan(goc(C, z2, t2), 50, '703 z′Ct′')
  hinh('HHC000703', [A, B, C, xe, ye, ze, z2, t, t2], [
    seg(A, xe), seg(B, ye), seg(z2, ze), seg(t2, t), dot(A), dot(B), dot(C),
    angleText(A, xe, B, '130°', 54), angleText(B, ye, A, '50°', 58), angleText(C, z2, t2, '50°', 58),
    label(A, 'A', -22, -10), label(B, 'B', -26, -10), label(C, 'C', -26, -12),
    label(xe, 'x', -14, -14), label(ye, 'y', -14, -14), label(ze, 'z', -14, -14), label(z2, 'z′', 14, -14),
    label(t, 't', -22, 10), label(t2, 't′', 10, 26)], KHUNG)
}

// HHC000704 — a ⊥ c, b ⊥ c (ô vuông), cát tuyến qua A (trên b), B (trên a); BAb = 50°; góc B1, B2, B3
{
  const h = 140, A = P(0, 0), B = ray(A, 50, h / sd(50))
  const X0 = -110, X1 = 380, cx = 263
  const al = P(X0, -h), ar = P(X1, -h), bl = P(X0, 0), br = P(X1, 0)
  const ca = P(cx, -h), cb = P(cx, 0), ctop = P(cx, -h - 72), cbot = P(cx, 73)
  const d1 = ray(A, 230, 75 / sd(50)), d2 = ray(B, 50, 80 / sd(50))
  const bR = P(A.x + 50, 0), aR = P(B.x + 50, B.y), aL = P(B.x - 50, B.y)
  const up = ray(B, 50, 50), dn = ray(B, 230, 50)
  gan(goc(A, bR, B), 50, '704 BAb')
  hinh('HHC000704', [al, ar, bl, br, ctop, cbot, d1, d2], [
    seg(al, ar), seg(bl, br), seg(ctop, cbot), seg(d1, d2),
    rightAngle(ca, P(cx, -h - 1), P(cx - 1, -h), 16), rightAngle(cb, P(cx, -1), P(cx - 1, 0), 16),
    dot(A), dot(B), dot(ca), dot(cb),
    angleMark(A, bR, B, 28), angleText(A, bR, B, '50°', 66),
    angleText(B, aR, up, '3', 30, 20), angleText(B, up, aL, '2', 30, 20), angleText(B, aR, dn, '1', 30, 20),
    label(A, 'A', 16, 28), label(B, 'B', -36, 24),
    label(ar, 'a', -12, -12), label(br, 'b', -12, -12), label(cbot, 'c', 16, 0)], KHUNG)
}

// HHC000705 — a ∥ b (cùng ⊥ m n); aMN = 120°; NP phân giác MNB; Pt ∥ MN
{
  const h = 150, N = P(0, 0), L = h / sd(60)
  const M = ray(N, 120, L), Pp = ray(N, 60, L)
  const X0 = M.x - 110, cx = Pp.x + 140, X1 = cx + 90
  const al = P(X0, -h), ar = P(X1, -h), bl = P(X0, 0), br = P(X1, 0)
  const A = P(cx, -h), B = P(cx, 0), mtop = P(cx, -h - 65), nbot = P(cx, 90)
  const t = ray(Pp, 300, 95)
  const bR = P(N.x + 50, 0)
  gan(goc(M, al, N), 120, '705 aMN'); gan(goc(N, M, bR), 120, '705 MNB'); gan(goc(N, Pp, bR), 60, '705 PNB')
  gan(Math.abs((t.x - Pp.x) * (N.y - M.y) - (t.y - Pp.y) * (N.x - M.x)), 0, '705 Pt ∥ MN')
  hinh('HHC000705', [al, ar, bl, br, mtop, nbot, t, M, Pp], [
    seg(al, ar), seg(bl, br), seg(mtop, nbot), seg(M, N), seg(N, Pp), seg(Pp, t),
    rightAngle(A, P(cx, -h - 1), P(cx - 1, -h), 16), rightAngle(B, P(cx, -1), P(cx - 1, 0), 16),
    dot(M), dot(N), dot(Pp), dot(A), dot(B),
    angleMark(M, al, N, 28), angleText(M, al, N, '120°', 60),
    angleMark(N, M, bR, 24, 2),
    label(al, 'a', 14, -14), label(bl, 'b', 14, -14),
    label(M, 'M', 0, -16), label(Pp, 'P', 0, -16), label(N, 'N', 0, 40),
    label(A, 'A', 20, -12), label(B, 'B', 20, -12), label(mtop, 'm', 20, 8), label(nbot, 'n', 20, -2),
    label(t, 't', -20, 10)], KHUNG)
}

// HHC000706 — xy ∥ mn (cùng ⊥ AB); cát tuyến EF qua C, D; ECx = 80°
{
  const h = 170, C = P(0, 0), D = ray(C, 280, h / sd(80))
  const X0 = -115, cx = 212, X1 = cx + 120
  const xl = P(X0, 0), yr = P(X1, 0), ml = P(X0, h), nr = P(X1, h)
  const A = P(cx, 0), B = P(cx, h), atop = P(cx, -85), bbot = P(cx, h + 95)
  const E = ray(C, 100, 86 / sd(80)), F = ray(D, 280, 100 / sd(80))
  gan(goc(C, xl, E), 80, '706 ECx'); gan(goc(D, C, nr), 100, '706 CDB')
  hinh('HHC000706', [xl, yr, ml, nr, atop, bbot, E, F], [
    seg(xl, yr), seg(ml, nr), seg(atop, bbot), seg(E, F),
    rightAngle(A, P(cx, -1), P(cx - 1, 0), 16), rightAngle(B, P(cx, h - 1), P(cx - 1, h), 16),
    dot(A), dot(B), dot(C), dot(D),
    angleText(C, xl, E, '80°', 62),
    label(xl, 'x', 14, -12), label(yr, 'y', -14, -12), label(ml, 'm', 14, -12), label(nr, 'n', -14, -12),
    label(E, 'E', -18, 6), label(F, 'F', 22, 14),
    label(C, 'C', 20, -14), label(A, 'A', 20, -14), label(B, 'B', 20, 34), label(D, 'D', -22, 30)], KHUNG)
}

await xuatTat(RA)
