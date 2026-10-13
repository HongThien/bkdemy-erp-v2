// Vẽ lại hình — gói HH00024-2 (Ba đường thẳng song song, Hình 7).
//   node scripts/anh/ve_lai/HH00024-2.mjs [<thu_muc_ra>]
// Đường song song dựng cùng véc-tơ chỉ phương (nằm ngang); số đo ghi trên hình dựng bằng ray/tan (assert ở cuối mỗi khối).
import { P, seg, dot, label, angleMark, rightAngle, sector, ray, goc, angleText, num, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00024-2/moi'
const KHUNG = { pad: 40, padDuoi: 50 }
const gan = (v, d, ten) => console.assert(Math.abs(v - d) < 0.5, `${ten}: ${v.toFixed(2)} ≠ ${d}`)
const td = (a) => Math.tan(a * Math.PI / 180)

// HHC000732 — tia Ma (nằm ngang, hướng trái), tia Pb (nằm ngang, hướng phải); aMN = 100°, MNP = 40°, NPb = 120°
// (với số đo đó thì Ma ∥ Pb là đúng: tNM = 80°, tNP = 120° = NPb — đề bắt chứng minh nên KHÔNG ghi gì thêm).
{
  const L = 300, M = P(0, 0), N = ray(M, 80, L), Pp = ray(N, 300, 186)
  const a = P(-130, 0), b = P(Pp.x + 130, Pp.y)
  gan(goc(M, a, N), 100, '732 aMN'); gan(goc(N, M, Pp), 40, '732 MNP'); gan(goc(Pp, N, b), 120, '732 NPb')
  hinh('HHC000732', [a, b, N, M, Pp], [
    seg(a, M), seg(M, N), seg(N, Pp), seg(Pp, b), dot(M), dot(N), dot(Pp),
    angleMark(M, a, N, 34), angleText(M, a, N, '100°', 74),
    angleMark(N, M, Pp, 40), angleText(N, M, Pp, '40°', 92),
    angleMark(Pp, N, b, 34), angleText(Pp, N, b, '120°', 78),
    label(a, 'a', 0, -14), label(b, 'b', 0, -14),
    label(M, 'M', 0, 34), label(N, 'N', 0, -16), label(Pp, 'P', 0, 34)], KHUNG)
}

// HHC000733 — A–B nằm ngang (A bên trái B); F trên B, FB ⊥ FD (ô vuông tại F); F, D, E nằm ngang; C dưới, nối BC, CD.
// Không ghi số đo nào (đề cho hệ thức ABC + CDE = BCD + 180°, hỏi ABF): AB ∥ FE dựng đúng nên hệ thức đúng — assert dưới.
{
  const B = P(0, 0), A = P(-120, 0), F = P(0, -129), D = P(137, -129), E = P(277, -129), C = P(92, 116)
  gan(goc(B, A, C) + goc(D, C, E), goc(C, B, D) + 180, '733 ABC + CDE = BCD + 180')
  hinh('HHC000733', [A, B, F, D, E, C], [
    seg(A, B), seg(B, F), seg(F, E), seg(B, C), seg(C, D),
    rightAngle(F, B, D, 14),
    dot(A), dot(B), dot(F), dot(D), dot(E), dot(C),
    label(A, 'A', 0, 34), label(B, 'B', -22, 30), label(F, 'F', 0, -16), label(D, 'D', 0, -16), label(E, 'E', 0, -16), label(C, 'C', 0, 34)], KHUNG)
}

// HHC000734 — đường ngang qua B, D (kéo dài qua D); đường thẳng đứng qua D, E (⊥, ô vuông tại D);
// đường ngang qua C, E; A, B, C nối gấp khúc A–B (A thấp hơn B), A–C. ABD = 160°, BAC = 70°, ACE = 130°.
{
  const B = P(0, 0), A = ray(B, 200, 129), C = ray(A, 310, 170)
  const D = P(235, 0), E = P(235, C.y)
  const dr = P(285, 0), er = P(285, C.y), vTop = P(235, -60), vBot = P(235, C.y + 60)
  gan(goc(B, A, D), 160, '734 ABD'); gan(goc(A, B, C), 70, '734 BAC'); gan(goc(C, A, E), 130, '734 ACE')
  hinh('HHC000734', [A, B, C, D, E, dr, er, vTop, vBot], [
    seg(B, dr), seg(C, er), seg(vTop, vBot), seg(A, B), seg(A, C),
    rightAngle(D, B, vTop, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E),
    angleText(A, B, C, '70°', 62), num(B, '160°', 30, 30), num(C, '130°', 34, -14),
    label(A, 'A', -4, 34), label(B, 'B', -4, -16), label(C, 'C', -4, 34),
    label(D, 'D', 22, 26), label(E, 'E', 22, 26)], KHUNG)
}

// HHC000735 — đường ngang qua A, M; đường ngang qua C, N; đường thẳng đứng qua M, N (ô vuông tại M);
// A–B–C gấp khúc; BAM = 22°, ABC = 54° (= 22° + 32°, đúng với hai đường song song), BCN = 32°. Có tô xám các góc như ảnh cũ.
{
  const h = 190, A = P(0, 0), C = P(0, h)
  const xB = h / (td(22) + td(32)), B = P(xB, xB * td(22))
  const M = P(330, 0), N = P(330, h), mr = P(390, 0), nr = P(390, h), vTop = P(330, -45), vBot = P(330, h + 45)
  const a1 = P(100, 0), c1 = P(100, h)
  gan(goc(A, a1, B), 22, '735 BAM'); gan(goc(C, c1, B), 32, '735 BCN'); gan(goc(B, A, C), 54, '735 ABC')
  hinh('HHC000735', [A, C, B, mr, nr, vTop, vBot], [
    sector(A, a1, B, 42), sector(B, A, C, 28), sector(C, c1, B, 42),
    seg(A, mr), seg(C, nr), seg(vTop, vBot), seg(A, B), seg(B, C),
    rightAngle(M, A, vTop, 14),
    angleMark(A, a1, B, 42), angleMark(B, A, C, 28), angleMark(C, c1, B, 42),
    dot(A), dot(B), dot(C), dot(M), dot(N),
    angleText(A, a1, B, '22°', 122), angleText(B, A, C, '54°', 74), angleText(C, c1, B, '32°', 122),
    label(A, 'A', -22, 8), label(C, 'C', -22, 8), label(B, 'B', 22, 8),
    label(M, 'M', -20, 28), label(N, 'N', -20, 28)], KHUNG)
}

await xuatTat(RA)
