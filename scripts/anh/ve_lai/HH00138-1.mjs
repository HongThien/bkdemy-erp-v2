// Vẽ lại hình — gói HH00138-1 (Ôn thi giữa kì I, Hình học 7: góc tạo bởi đường thẳng cắt hai đường thẳng, song song).
//   node scripts/anh/ve_lai/HH00138-1.mjs [<thu_muc_ra>]
import { P, seg, segDash, dot, label, num, angleMark, rightAngle, sector, ray, inter, goc, hinh, xuatTat, angleText } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00138-1/moi'
const ok = (v, e, m) => console.assert(Math.abs(v - e) < 0.5, `${m}: ${v} ≠ ${e}`)

// HHC002686 — a ∥ b, cát tuyến cắt a tại N, b tại M; N1 (trái, giữa), M1 (phải, giữa) = so le trong (M1 = 75° theo đề, không ghi lên hình)
{
  const M = P(0, 140), N = ray(M, 75, 140 / Math.sin(75 * Math.PI / 180))
  const top = ray(N, 75, 55), bot = ray(M, 255, 55)
  const aL = P(-165, N.y), aR = P(N.x + 135, N.y), bL = P(-165, M.y), bR = P(M.x + 130, M.y)
  ok(goc(M, P(M.x + 100, M.y), N), 75, 'M1')
  ok(goc(N, P(N.x - 100, N.y), M), 75, 'N1')
  hinh('HHC002686', [top, bot, aL, aR, bL, bR, P(-190, 0), P(N.x + 40, N.y - 40)], [
    seg(aL, aR), seg(bL, bR), seg(top, bot), dot(N), dot(M),
    angleText(N, P(N.x - 100, N.y), M, '1', 34), angleText(M, P(M.x + 100, M.y), N, '1', 34),
    label(N, 'N', -18, -10), label(M, 'M', 22, 28),
    label(P(-185, N.y), 'a', 0, -8), label(P(-185, M.y), 'b', 0, -8)])
}

// HHC002688 — A, B, C thẳng hàng; H dưới; E ∈ HC; BE ∥ AH (như ảnh cũ: hai cung đồng vị ở A và B)
{
  const A = P(0, 0), B = P(75, 0), C = P(205, 0), H = P(80, 85)
  const E = inter(H, C, B, P(B.x + (H.x - A.x), B.y + (H.y - A.y)))
  ok(goc(A, C, H), goc(B, C, E), 'đồng vị')
  hinh('HHC002688', [A, B, C, H, E], [
    seg(A, C), seg(A, H), seg(B, E), seg(H, C),
    angleMark(A, C, H, 28), angleMark(B, C, E, 28),
    dot(A), dot(B), dot(C), dot(H), dot(E),
    label(A, 'A', -16, -10), label(B, 'B', 0, -12), label(C, 'C', 16, -10),
    label(H, 'H', -2, 34), label(E, 'E', 22, 30)])
}

// HHC002689 — AB, DC nằm ngang; BC ⊥ AB tại B; ∠BAD = 110°, ∠ADC = 70°
{
  const A = P(0, 0), B = P(90, 0), D = ray(A, 250, 140), C = P(B.x, D.y)
  ok(goc(A, B, D), 110, 'BAD'); ok(goc(D, A, C), 70, 'ADC')
  const top = P(B.x, -35), bot = P(B.x, D.y + 35)
  hinh('HHC002689', [P(-110, 0), P(185, 0), top, bot, D, P(185, D.y)], [
    seg(P(-110, 0), P(185, 0)), seg(P(-110, D.y), P(185, D.y)), seg(top, bot), seg(A, D),
    rightAngle(B, P(B.x, B.y - 1), P(B.x + 1, B.y)),
    dot(A), dot(B), dot(C), dot(D),
    angleText(A, B, D, '110°', 52), angleText(D, A, C, '70°', 62),
    label(A, 'A', -2, -12), label(B, 'B', -16, -12), label(D, 'D', -10, 26), label(C, 'C', 18, 28)])
}

// HHC002690 — EF cắt DC tại F, AB tại E; ∠DFE = 55°; góc 125° ở E (EB và tia đối của EF)
{
  const F = P(0, 0), E = ray(F, 235, 120 / Math.sin(55 * Math.PI / 180))
  const D = P(-170, 0), C = P(95, 0), A = P(-175, E.y), B = P(95, E.y)
  const top = ray(F, 55, 45), bot = ray(E, 235, 45)
  ok(goc(F, D, E), 55, 'DFE'); ok(goc(E, B, bot), 125, 'góc 125')
  hinh('HHC002690', [top, bot, D, C, A, B], [
    seg(D, C), seg(A, B), seg(top, bot),
    angleMark(F, D, E, 30), angleMark(E, B, bot, 30),
    dot(F), dot(E), dot(A), dot(B), dot(C), dot(D),
    angleText(F, D, E, '55°', 66), angleText(E, B, bot, '125°', 62),
    label(F, 'F', -16, -10), label(E, 'E', -18, -12),
    label(D, 'D', 0, 28), label(C, 'C', 0, 28), label(A, 'A', 0, 28), label(B, 'B', 0, 28)])
}

// HHC002691 — cát tuyến cắt a tại C, b tại A; các góc 1, 2 ở C (dưới a) và ở A (trên b), 1 bên trái, 2 bên phải
{
  const C = P(0, 0), A = P(-130 / Math.tan(65 * Math.PI / 180), 130)
  const top = ray(C, 65, 50), bot = ray(A, 245, 50)
  const aL = P(-150, 0), aR = P(160, 0), bL = P(-150 + A.x, 130), bR = P(A.x + 100, 130)
  hinh('HHC002691', [top, bot, aL, aR, bL, bR, P(-175, -20)], [
    seg(aL, aR), seg(bL, bR), seg(top, bot), dot(C), dot(A),
    angleText(C, P(-100, 0), A, '1', 32), angleText(C, P(100, 0), A, '2', 32),
    angleText(A, P(A.x - 100, 130), C, '1', 32), angleText(A, P(A.x + 100, 130), C, '2', 32),
    label(C, 'C', -18, -10), label(A, 'A', 24, 28),
    label(P(aL.x - 14, 0), 'a', 0, -8), label(P(bL.x - 14, 130), 'b', 0, -8)])
}

// HHC002692 — a, b, c nằm ngang; AB ⊥ a, b; ∠B1 = ∠C2 = 40° (so le trong, tô xám như ảnh cũ)
{
  const B = P(0, 0), A = P(0, -90), C = ray(B, 220, 100 / Math.sin(40 * Math.PI / 180))
  ok(goc(B, P(-100, 0), C), 40, 'B1'); ok(goc(C, P(100, C.y), B), 40, 'C2')
  const aL = P(-190, A.y), aR = P(150, A.y), bL = P(-190, 0), bR = P(150, 0), cL = P(-190, C.y), cR = P(150, C.y)
  hinh('HHC002692', [aL, aR, bL, bR, cL, cR, P(180, A.y - 20)], [
    sector(B, P(-100, 0), C, 36), sector(C, P(C.x + 100, C.y), B, 36),
    seg(aL, aR), seg(bL, bR), seg(cL, cR), seg(A, B), seg(B, C),
    angleMark(B, P(-100, 0), C, 36), angleMark(C, P(C.x + 100, C.y), B, 36),
    rightAngle(A, P(A.x, A.y + 1), P(A.x + 1, A.y)), rightAngle(B, A, P(B.x + 1, B.y)),
    dot(A), dot(B), dot(C),
    angleText(B, P(-100, 0), C, '1', 62), angleText(C, P(C.x + 100, C.y), B, '2', 62),
    label(A, 'A', -16, -10), label(B, 'B', -16, -10), label(C, 'C', -16, -10),
    label(P(168, A.y), 'a', 0, -8), label(P(168, 0), 'b', 0, -8), label(P(168, C.y), 'c', 0, -8)])
}

// HHC002693 — tam giác ABC, ∠A = 80°, ∠C = 55° (⇒ ∠B = 45°); Ay là tia đối của AB; Ax là phân giác góc CAy (50°)
{
  const B = P(0, 0), C = P(290, 0)
  const A = inter(B, ray(B, 45, 1), C, ray(C, 125, 1))
  const y = ray(A, 45, 100), x = ray(A, -5, 170)
  ok(goc(A, B, C), 80, 'A'); ok(goc(C, B, A), 55, 'C')
  ok(goc(A, C, y), 100, 'CAy'); ok(goc(A, y, x), 50, 'yAx'); ok(goc(A, x, C), 50, 'xAC')
  hinh('HHC002693', [B, C, A, y, x, P(B.x - 20, 0)], [
    seg(B, y), seg(A, x), seg(B, C), seg(A, C),
    angleMark(A, B, C, 32), angleMark(C, B, A, 36),
    dot(A), dot(B), dot(C),
    angleText(A, B, C, '80°', 60), angleText(C, B, A, '55°', 70),
    label(A, 'A', -20, -6), label(B, 'B', -14, 24), label(C, 'C', 16, 24),
    label(y, 'y', 16, 2), label(x, 'x', 4, -12)])
}

// HHC002694 — a ∥ b; AD ⊥ b tại A; ∠DCB = 130°; D1, C1 trên a; B1, B2 trên b
{
  const D = P(0, 0), A = P(0, 110), C = P(150, 0)
  const B = ray(C, 310, 110 / Math.sin(50 * Math.PI / 180))
  ok(goc(C, D, B), 130, 'DCB'); ok(B.y, 110, 'B trên b')
  const top = ray(C, 130, 45), bot = ray(B, 310, 45), vUp = P(0, -35), vDn = P(0, 145)
  const aL = P(-45, 0), aR = P(300, 0), bL = P(-45, 110), bR = P(300, 110)
  hinh('HHC002694', [aL, aR, bL, bR, top, bot, vUp, vDn, P(325, -20)], [
    seg(aL, aR), seg(bL, bR), seg(vUp, vDn), seg(top, bot),
    rightAngle(A, D, P(A.x + 1, A.y)),
    angleMark(C, D, B, 24),
    dot(D), dot(A), dot(C), dot(B),
    angleText(D, P(100, 0), vUp, '1', 28),
    angleText(C, P(C.x + 100, 0), top, '1', 36),
    angleText(C, D, B, '130°', 58),
    angleText(B, P(B.x + 100, B.y), top, '1', 36),
    angleText(B, P(B.x - 100, B.y), top, '2', 46),
    label(D, 'D', -20, -8), label(A, 'A', -20, 28), label(C, 'C', 42, 24), label(B, 'B', -14, 30),
    label(P(318, 0), 'a', 0, -8), label(P(318, 110), 'b', 0, -8)])
}

await xuatTat(RA)
