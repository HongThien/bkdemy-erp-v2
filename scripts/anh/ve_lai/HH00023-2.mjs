// Vẽ lại hình — gói HH00023-2 (Hai đường thẳng song song, Hình 7).
//   node scripts/anh/ve_lai/HH00023-2.mjs [<thu_muc_ra>]
// Đường song song dựng cùng véc-tơ chỉ phương (nằm ngang); số đo ghi trên hình dựng bằng ray (assert cuối mỗi khối).
import { P, seg, dot, label, num, angleMark, rightAngle, ray, lerp, goc, angleText, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00023-2/moi'
const KHUNG = { pad: 48, padDuoi: 54 }
const gan = (v, d, ten) => console.assert(Math.abs(v - d) < 0.5, `${ten}: ${v.toFixed(2)} ≠ ${d}`)
const sd = (a) => Math.sin(a * Math.PI / 180)
const td = (a) => Math.tan(a * Math.PI / 180)

// HHC000707 — xx′ ∥ yy′ ∥ tt′ (nằm ngang); zz′ qua A, B, C; đường thẳng đứng qua A, H, K (ô vuông tại H, K); xAC = 50°
{
  const h1 = 90, h2 = 100
  const A = P(0, 0), B = ray(A, 230, h1 / sd(50)), C = ray(A, 230, (h1 + h2) / sd(50))
  const H = P(0, h1), K = P(0, h1 + h2)
  const X0 = -240, X1 = 120
  const xl = P(X0, 0), xr = P(X1, 0), yl = P(X0, h1), yr = P(X1, h1), tl = P(X0, h1 + h2), tr = P(X1, h1 + h2)
  const z = ray(A, 50, 60 / sd(50)), z2 = ray(C, 230, 45 / sd(50))
  const nt = P(0, -44), nb = P(0, h1 + h2 + 44)
  gan(goc(A, xl, C), 50, '707 xAC'); gan(goc(A, xl, B), 50, '707 xAB')
  gan(B.y, h1, '707 B∈yy′'); gan(C.y, h1 + h2, '707 C∈tt′')
  hinh('HHC000707', [xl, xr, yl, yr, tl, tr, z, z2, nt, nb], [
    seg(xl, xr), seg(yl, yr), seg(tl, tr), seg(z2, z), seg(nt, nb),
    rightAngle(H, P(0, h1 - 10), P(10, h1), 14), rightAngle(K, P(0, h1 + h2 - 10), P(10, h1 + h2), 14),
    dot(A), dot(B), dot(C), dot(H), dot(K),
    angleMark(A, xl, B, 30), angleText(A, xl, B, '50°', 68),
    label(xl, 'x', 12, -12), label(xr, 'x′', -12, -12),
    label(yl, 'y', 12, 28), label(yr, 'y′', -12, 28),
    label(tl, 't', 12, 28), label(tr, 't′', -12, 28),
    label(A, 'A', -20, -14), label(B, 'B', 20, 28), label(H, 'H', 18, 28),
    label(C, 'C', 18, 28), label(K, 'K', 18, 28),
    label(z, 'z', 16, 6), label(z2, 'z′', -14, 12)], KHUNG)
}

// HHC000708–711 — cùng một hình: a ∥ b ∥ c (nằm ngang), d ⊥ a, b tại A, B (cắt c tại F); xiên e qua C, D, E; aCe = 70°, cEe = 110°
function hinhABC(ten) {
  const h1 = 85, h2 = 90
  const A = P(0, 0), B = P(0, h1), F = P(0, h1 + h2)
  const cx = 255, k = 1 / td(70)
  const C = P(cx, 0), D = P(cx - h1 * k, h1), E = P(cx - (h1 + h2) * k, h1 + h2)
  const X0 = -60, X1 = 330
  const al = P(X0, 0), ar = P(X1, 0), bl = P(X0, h1), br = P(X1, h1), cl = P(X0, h1 + h2), cr = P(X1, h1 + h2)
  const dt = P(0, -48), db = P(0, h1 + h2 + 48)
  const et = ray(C, 70, 62 / sd(70)), eb = ray(E, 250, 62 / sd(70))
  gan(goc(C, al, E), 70, `${ten} aCe`); gan(goc(E, cl, et), 110, `${ten} cEe`)
  gan(goc(D, br, et), 70, `${ten} D2`); gan(goc(D, bl, et), 110, `${ten} D1`)
  const aTrai = P(C.x - 50, 0), eNgang = P(E.x - 50, E.y)
  hinh(ten, [al, ar, bl, br, cl, cr, dt, db, et, eb], [
    seg(al, ar), seg(bl, br), seg(cl, cr), seg(dt, db), seg(eb, et),
    rightAngle(A, P(0, -10), P(10, 0), 14), rightAngle(B, P(0, h1 - 10), P(10, h1), 14),
    dot(A), dot(B), dot(F), dot(C), dot(D), dot(E),
    angleMark(C, aTrai, E, 34), angleText(C, aTrai, E, '70°', 54),
    angleMark(E, eNgang, et, 26, 2), angleText(E, eNgang, et, '110°', 66),
    angleText(D, bl, et, '1', 26, 20), angleText(D, et, br, '2', 26, 20),
    label(dt, 'd', 16, 6), label(ar, 'a', -10, -12), label(br, 'b', -10, -12), label(cr, 'c', -10, -12),
    label(et, 'e', -16, 10),
    label(A, 'A', -20, 26), label(B, 'B', -20, 26), label(F, 'F', -20, 26),
    label(C, 'C', 22, 26), label(D, 'D', 22, 26), label(E, 'E', 22, 26)], KHUNG)
}
for (const t of ['HHC000708', 'HHC000709', 'HHC000710', 'HHC000711']) hinhABC(t)

// HHC000712–714 — tứ giác DABC: DA ∥ BC ∥ EF (nằm ngang); DAB = 30°, AEF = 30°, ACB = 60° (⇒ tam giác ABC vuông tại A)
function hinhDABC(ten) {
  const L = 400, B = P(0, 0), C = P(L, 0)
  const A = ray(B, 30, L * Math.cos(30 * Math.PI / 180))
  const D = P(70, A.y)
  const E = lerp(A, B, 0.6), F = lerp(A, C, 0.6)
  const dA = P(D.x, A.y), g = P(A.x - 60, A.y)
  gan(goc(A, D, B), 30, `${ten} DAB`); gan(goc(E, A, F), 30, `${ten} AEF`); gan(goc(C, B, A), 60, `${ten} ACB`)
  gan(E.y, F.y, `${ten} EF ngang`)
  const eNgangF = P(E.x + 60, E.y)
  hinh(ten, [D, A, B, C], [
    seg(D, A), seg(A, B), seg(B, C), seg(C, A), seg(D, B), seg(E, F),
    dot(D), dot(A), dot(B), dot(C), dot(E), dot(F),
    angleMark(A, D, B, 44), angleText(A, D, B, '30°', 96),
    angleMark(E, A, F, 40), angleText(E, A, F, '30°', 96),
    angleMark(C, B, A, 34), angleText(C, B, A, '60°', 70),
    label(D, 'D', -6, -14), label(A, 'A', 0, -14), label(B, 'B', -12, 28), label(C, 'C', 14, 28),
    label(E, 'E', -22, -4), label(F, 'F', 22, -4)], KHUNG)
}
for (const t of ['HHC000712', 'HHC000713', 'HHC000714']) hinhDABC(t)

await xuatTat(RA)
