// Vẽ lại hình — gói HH00024-1 (Ba đường thẳng song song, Hình 7).
//   node scripts/anh/ve_lai/HH00024-1.mjs [<thu_muc_ra>]
// Mọi đường song song dựng cùng véc-tơ chỉ phương (nằm ngang); số đo ghi trên hình dựng bằng ray/inter (assert từng góc).
import { P, seg, dot, label, num, angleMark, sector, rightAngle, fill, ray, inter, goc, angleText, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00024-1/moi'
const KHUNG = { pad: 38, padDuoi: 46 }
const gan = (v, d, ten) => console.assert(Math.abs(v - d) < 0.5, `${ten}: ${v.toFixed(2)} ≠ ${d}`)
const sd = (a) => Math.sin(a * Math.PI / 180)
const td = (a) => Math.tan(a * Math.PI / 180)

// ───────── HHC000724 / 725: Ax ∥ Cy (cùng nằm ngang), A trên, C dưới, B bên phải; xAB = 45°, BCy = 40°, ABC = 85° ─────────
function chuV(ten, coSo) {
  const h1 = 140, h = 280
  const A = P(0, 0), B = P(h1 / td(45), h1)
  const C = P(B.x - (h - h1) / td(40), h)
  const xe = P(370, 0), ye = P(370, h)
  gan(goc(A, xe, B), 45, ten + ' xAB'); gan(goc(C, ye, B), 40, ten + ' BCy'); gan(goc(B, A, C), 85, ten + ' ABC')
  const body = [
    sector(B, A, C, 28), seg(A, xe), seg(C, ye), seg(A, B), seg(B, C),
    angleMark(B, A, C, 28),
    dot(A), dot(B), dot(C),
    angleText(A, xe, B, '45°', 92), angleText(C, ye, B, '40°', 100),
    label(A, 'A', -24, -8), label(B, 'B', 30, 10), label(C, 'C', -24, 36),
    label(xe, 'x', 0, -16), label(ye, 'y', 0, 36),
  ]
  if (coSo) body.push(num(P(B.x - 66, B.y), '85°', 0, 8))
  hinh(ten, [A, B, C, xe, ye], body, KHUNG)
}
chuV('HHC000724', false)
chuV('HHC000725', true)

// ───────── HHC000726 / 730: tia Ax hướng trái từ A, tia Cy hướng phải từ C; xAB = 35°, góc BCy = 135° (ABC = 80°) ─────────
function chuZ(ten, coSo) {
  const k = 0.9
  const A = P(0, 0), B = ray(A, 215, 140 * k / sd(35))
  const C = ray(B, -45, 130 * k / sd(45))
  const xe = P(-260, 0), ye = P(150, C.y)
  gan(goc(A, xe, B), 35, ten + ' xAB'); gan(goc(C, B, ye), 135, ten + ' BCy'); gan(goc(B, A, C), 80, ten + ' ABC')
  const body = [
    seg(xe, A), seg(C, ye), seg(A, B), seg(B, C),
    dot(A), dot(B), dot(C),
    angleText(A, xe, B, '35°', 100), angleText(C, B, ye, '135°', 66),
    label(A, 'A', 28, -4), label(B, 'B', -24, 8), label(C, 'C', -4, 36),
    label(xe, 'x', 0, -16), label(ye, 'y', 0, -16),
  ]
  if (coSo) body.push(angleMark(B, A, C, 26), angleMark(C, B, ye, 30), angleText(B, A, C, '80°', 66))
  hinh(ten, [A, B, C, xe, ye], body, KHUNG)
}
chuZ('HHC000726', true)
chuZ('HHC000730', false)

// ───────── HHC000727: BD ⊥ DE, CE ⊥ DE (BD ∥ CE); ABD = 160°, ACE = 130° ─────────
{
  const H = 200, B = P(0, 0), C = P(0, H)
  const A = inter(B, ray(B, 200, 100), C, ray(C, 130, 100))
  const D = P(210, 0), E = P(210, H)
  const top = P(D.x, -45), bot = P(E.x, H + 55), r1 = P(D.x + 55, 0), r2 = P(E.x + 55, H)
  gan(goc(B, A, D), 160, '727 ABD'); gan(goc(C, A, E), 130, '727 ACE')
  const sq = (v) => fill([v, P(v.x - 16, v.y), P(v.x - 16, v.y - 16), P(v.x, v.y - 16)])
  hinh('HHC000727', [A, B, C, D, E, top, bot, r1, r2], [
    sq(D), sq(E),
    seg(B, r1), seg(C, r2), seg(top, bot), seg(A, B), seg(A, C),
    rightAngle(D, P(D.x - 1, D.y), P(D.x, D.y - 1), 16), rightAngle(E, P(E.x - 1, E.y), P(E.x, E.y - 1), 16),
    dot(A), dot(B), dot(C), dot(D), dot(E),
    angleText(B, A, D, '160°', 52), angleText(C, A, E, '130°', 62),
    label(A, 'A', -24, 6), label(B, 'B', 0, -16), label(C, 'C', 0, 40),
    label(D, 'D', 24, 34), label(E, 'E', 24, 34)], KHUNG)
}

// ───────── HHC000728: AM ⊥ MN, CN ⊥ MN (AM ∥ CN); BAM = 22°, BCN = 32° ─────────
{
  const H = 190, A = P(0, 0), C = P(-19, H)
  const B = inter(A, ray(A, -22, 100), C, ray(C, 32, 100))
  const M = P(340, 0), N = P(340, H)
  const top = P(M.x, -45), bot = P(N.x, H + 55), r1 = P(M.x + 55, 0), r2 = P(N.x + 55, H)
  gan(goc(A, M, B), 22, '728 BAM'); gan(goc(C, N, B), 32, '728 BCN')
  hinh('HHC000728', [A, B, C, M, N, top, bot, r1, r2], [
    seg(A, r1), seg(C, r2), seg(top, bot), seg(A, B), seg(B, C),
    rightAngle(M, P(M.x - 1, M.y), P(M.x, M.y - 1), 16), rightAngle(N, P(N.x - 1, N.y), P(N.x, N.y - 1), 16),
    dot(A), dot(B), dot(C), dot(M), dot(N),
    angleMark(A, M, B, 56), angleText(A, M, B, '22°', 124),
    angleMark(C, N, B, 48, 2), angleText(C, N, B, '32°', 106),
    label(A, 'A', -24, -6), label(B, 'B', 28, 8), label(C, 'C', -22, 34),
    label(M, 'M', 24, 34), label(N, 'N', 24, 34)], KHUNG)
}

// ───────── HHC000729: tia Ma (hướng trái) ∥ tia Pb (hướng phải); aMN = 100°, NPb = 120° ─────────
{
  const M = P(0, 0), t = 250
  const dN = ray(M, 80, t)               // N nằm trên tia tạo với Ma góc 100°
  const py = -120
  // N = (px + s·cos120, py − s·sin120)  ⇒  s = (py − N.y)/sin120
  const s2 = (py - dN.y) / sd(120)
  const px = dN.x - s2 * Math.cos(120 * Math.PI / 180)
  const Pp = P(px, py), N = dN
  const ae = P(-150, 0), be = P(Pp.x + 150, py)
  gan(goc(M, ae, N), 100, '729 aMN'); gan(goc(Pp, N, be), 120, '729 NPb')
  hinh('HHC000729', [ae, be, M, Pp, N], [
    seg(ae, M), seg(Pp, be), seg(M, N), seg(N, Pp),
    dot(M), dot(N), dot(Pp),
    angleText(M, ae, N, '100°', 58), angleText(Pp, N, be, '120°', 58),
    label(ae, 'a', 0, -16), label(be, 'b', 0, -16),
    label(M, 'M', 0, 38), label(Pp, 'P', 0, 38), label(N, 'N', 0, -16)], KHUNG)
}

// ───────── HHC000731: Ax ∥ Cy (nằm ngang); xAB = 40°, ABC = 60°; góc BCy cần tính (cung đôi, không ghi số) ─────────
{
  const h1 = 150, A = P(0, 0), B = P(h1 / td(40), h1)
  const C = P(B.x - 75 / td(20), 225)
  const xe = P(300, 0), ye = P(300, 225)
  gan(goc(A, xe, B), 40, '731 xAB'); gan(goc(B, A, C), 60, '731 ABC'); gan(goc(C, ye, B), 20, '731 BCy (thật)')
  hinh('HHC000731', [A, B, C, xe, ye], [
    seg(A, xe), seg(C, ye), seg(A, B), seg(B, C),
    angleMark(C, ye, B, 66, 2),
    dot(A), dot(B), dot(C),
    angleText(A, xe, B, '40°', 98), angleText(B, A, C, '60°', 62),
    label(A, 'A', -24, -8), label(B, 'B', 28, 10), label(C, 'C', -24, 36),
    label(xe, 'x', 0, -16), label(ye, 'y', 0, 36)], KHUNG)
}

await xuatTat(RA)
