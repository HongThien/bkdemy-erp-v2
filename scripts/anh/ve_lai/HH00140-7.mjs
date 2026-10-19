// Vẽ lại hình — gói HH00140-7 (Ôn thi giữa kì I, Hình học 9: hệ thức lượng trong tam giác vuông).
//   node scripts/anh/ve_lai/HH00140-7.mjs [<thu_muc_ra>]
import { P, seg, segDash, tick, angleMark, rightAngle, sector, ray, rot, mid, lerp, foot, inter, bisector, goc, dist, dot, label, num, angleText, sideText, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00140-7/moi'
const rad = (d) => d * Math.PI / 180

// HHC003139 — cột cờ ⊥ mặt đất, bóng dài 12 m, tia nắng hợp mặt đất 35° (ảnh cũ không đặt tên điểm)
{
  const k = 28
  const B = P(0, 0), C = P(12 * k, 0), A = P(0, -12 * k * Math.tan(rad(35)))
  console.assert(Math.abs(goc(C, A, B) - 35) < 0.5)
  hinh('HHC003139', [A, B, C], [seg(A, B), seg(B, C), seg(A, C), rightAngle(B, A, C),
    angleText(C, A, B, '35°', 92), sideText(B, C, '12 m', A, 26)])
}

// HHC003140_lg — tam giác MNP vuông tại M, MP = 8, góc P = 37°; MH ⊥ NP, ND phân giác, Q = ND ∩ MH, E hình chiếu của P trên ND, EI ⊥ MP
{
  const k = 36
  const M = P(0, 0), Pp = P(8 * k, 0), N = P(0, -8 * k * Math.tan(rad(37)))
  const H = foot(M, N, Pp)
  const D = inter(N, bisector(N, M, Pp, 100), M, Pp)
  const Q = inter(N, D, M, H)
  const E = foot(Pp, N, D)
  const I = inter(E, P(E.x, E.y - 100), N, Pp)
  console.assert(Math.abs(goc(Pp, N, M) - 37) < 0.5)
  console.assert(Math.abs(goc(N, M, D) - goc(N, D, Pp)) < 0.5)
  console.assert(Math.abs(goc(E, N, Pp) - 90) < 0.5 && Math.abs(goc(E, I, P(E.x, E.y - 100)) - 0) < 0.5)
  hinh('HHC003140_lg', [M, N, Pp, E, D, H, I, Q], [
    seg(N, M), seg(M, Pp), seg(N, Pp), seg(N, E), seg(E, Pp), seg(M, H), seg(E, I),
    rightAngle(M, N, Pp), rightAngle(H, N, M), rightAngle(E, D, Pp),
    angleMark(N, M, D, 40), angleMark(N, D, Pp, 52),
    dot(N), dot(M), dot(Pp), dot(H), dot(Q), dot(D), dot(E), dot(I),
    label(N, 'N', -4, -14), label(M, 'M', -22, 9), label(Pp, 'P', 14, 30), label(H, 'H', 22, -6), label(Q, 'Q', -18, 4),
    label(I, 'I', 18, -10), label(D, 'D', -16, 30), label(E, 'E', 22, 18)])
}

// HHC003141 — D, C, B thẳng hàng; góc D = 30°, góc ACB = 60°, DC = 20 m (⇒ CA = 20 m)
{
  const k = 13
  const D = P(0, 0), C = P(20 * k, 0), A = ray(C, 60, 20 * k), B = P(A.x, 0)
  console.assert(Math.abs(goc(D, A, C) - 30) < 0.5 && Math.abs(goc(C, A, B) - 60) < 0.5)
  hinh('HHC003141', [A, B, C, D], [
    sector(D, C, A, 46), sector(C, B, A, 36),
    seg(D, B), seg(D, A), seg(C, A), seg(A, B),
    angleMark(D, C, A, 46, 2), angleMark(C, B, A, 36),
    dot(A), dot(B), dot(C), dot(D),
    angleText(D, C, A, '30°', 100), angleText(C, B, A, '60°', 68),
    label(A, 'A', 2, -14), label(B, 'B', 14, 32), label(C, 'C', 0, 34), label(D, 'D', -20, 9),
    sideText(D, C, '20 m', A, 30)])
}

// HHC003142 — dốc AB nghiêng 10° so với phương ngang, BH ⊥ AH (ảnh cũ không ghi số đo nào)
{
  const L = 380
  const A = P(0, 0), H = P(L, 0), B = P(L, -L * Math.tan(rad(10)))
  console.assert(Math.abs(goc(A, B, H) - 10) < 0.2)
  hinh('HHC003142', [A, B, H], [seg(A, H), seg(H, B), seg(A, B), rightAngle(H, A, B),
    dot(A), dot(B), dot(H),
    label(A, 'A', -14, 24), label(B, 'B', 4, -14), label(H, 'H', 8, 34)])
}

// HHC003143_lg — MNP vuông tại M, MN = 6, MP = 8; MH ⊥ NP; E, F hình chiếu của H trên MN, MP; Q ∈ MP; MI ⊥ NQ
{
  const k = 36
  const N = P(0, 0), Pp = P(10 * k, 0), M = ray(N, Math.atan2(8, 6) * 180 / Math.PI, 6 * k)
  const H = foot(M, N, Pp), E = foot(H, M, N), F = foot(H, M, Pp)
  const Q = lerp(M, Pp, 0.25), I = foot(M, N, Q)
  console.assert(Math.abs(dist(M, Pp) - 8 * k) < 0.5 && Math.abs(dist(M, H) - 4.8 * k) < 0.5)
  console.assert(Math.abs(goc(M, N, Pp) - 90) < 0.5 && Math.abs(goc(I, M, N) - 90) < 0.5)
  hinh('HHC003143_lg', [N, Pp, M, H, E, F, Q, I], [
    seg(N, Pp), seg(M, N), seg(M, Pp), seg(M, H), seg(H, E), seg(H, F), seg(N, Q), seg(M, I), seg(I, H),
    rightAngle(M, N, Pp), rightAngle(H, M, Pp), rightAngle(E, M, H), rightAngle(F, M, H), rightAngle(I, M, N),
    dot(N), dot(Pp), dot(M), dot(H), dot(E), dot(F), dot(Q), dot(I),
    label(M, 'M', 0, -14), label(N, 'N', -14, 26), label(H, 'H', 0, 34), label(Pp, 'P', 16, 28),
    label(E, 'E', -20, 8), label(F, 'F', 18, -6), label(Q, 'Q', 16, -12), label(I, 'I', 6, 34)])
}

// HHC003144 — tháp BH, bóng AH = 203 m, tia nắng hợp mặt đất góc A = 58°
{
  const k = 180 / 203
  const A = P(0, 0), H = P(203 * k, 0), B = P(203 * k, -203 * k * Math.tan(rad(58)))
  console.assert(Math.abs(goc(A, B, H) - 58) < 0.5)
  hinh('HHC003144', [A, B, H], [seg(A, H), seg(H, B), seg(A, B),
    dot(A), dot(B), dot(H),
    angleText(A, H, B, '58°', 76), sideText(A, H, '203 m', B, 26),
    label(A, 'A', -14, 24), label(B, 'B', 0, -14), label(H, 'H', 16, 30)])
}

// HHC003145_lg — ABC vuông tại A, AB = 6, BC = 10 (AC = 8); AI ⊥ BC; M ∈ AC; AE ⊥ BM
{
  const k = 36
  const A = P(0, 0), B = P(6 * k, 0), C = P(0, -8 * k)
  const I = foot(A, B, C), M = lerp(A, C, 0.375), E = foot(A, B, M)
  console.assert(Math.abs(dist(B, C) - 10 * k) < 0.5 && Math.abs(goc(E, A, B) - 90) < 0.5)
  hinh('HHC003145_lg', [A, B, C, I, M, E], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, I), seg(B, M), seg(A, E),
    rightAngle(A, B, C), rightAngle(I, A, B), rightAngle(E, A, B),
    dot(A), dot(B), dot(C), dot(I), dot(M), dot(E),
    label(C, 'C', 0, -14), label(A, 'A', -16, 26), label(B, 'B', 16, 26), label(M, 'M', -20, 8),
    label(E, 'E', 16, -10), label(I, 'I', 18, -8)])
}

// HHC003146 — hải đăng AC, bóng BC = 20 m, tia nắng hợp mặt đất góc B = 51°
{
  const k = 11.5
  const B = P(0, 0), C = P(20 * k, 0), A = P(20 * k, -20 * k * Math.tan(rad(51)))
  console.assert(Math.abs(goc(B, A, C) - 51) < 0.5)
  hinh('HHC003146', [A, B, C], [seg(B, C), seg(C, A), seg(B, A),
    dot(A), dot(B), dot(C),
    angleText(B, C, A, '51°', 78), sideText(B, C, '20 m', A, 26),
    label(A, 'A', 0, -14), label(B, 'B', -16, 24), label(C, 'C', 16, 30)])
}

await xuatTat(RA)
