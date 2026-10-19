// Vẽ hình — gói TH-9 (6 câu Toán 7 đề thi/đề cương chưa có hình). Không có ảnh cũ; vẽ theo ĐỀ.
//   node scripts/anh/ve_lai/TH-9.mjs [<thu_muc_ra>]
import { P, seg, tick, angleMark, rightAngle, ray, rot, mid, lerp, foot, inter, bisector, goc, dist,
  dot, label, num, angleText, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/TH-9/moi'
const ok = (v, d, ten) => console.assert(Math.abs(v - d) < 0.5, `${ten}: ${v} != ${d}`)

// HHC002960 — tam giác ABC vuông tại A
{
  const A = P(0, 200), B = P(0, 20), C = P(260, 200)
  ok(goc(A, B, C), 90, 'A')
  hinh('HHC002960', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), rightAngle(A, B, C, 16),
    dot(A), dot(B), dot(C),
    label(A, 'A', -18, 20), label(B, 'B', -2, -14), label(C, 'C', 18, 20)])
}

// HHC002961 — tam giác MNP cân tại M (MN = MP), góc M = 70°
{
  const M = P(150, 0), N = ray(M, 270 - 35, 260), Pp = ray(M, 270 + 35, 260)
  ok(goc(M, N, Pp), 70, 'M'); ok(dist(M, N), dist(M, Pp), 'MN=MP')
  hinh('HHC002961', [M, N, Pp], [seg(M, N), seg(M, Pp), seg(N, Pp),
    tick(M, N, 1), tick(M, Pp, 1), angleMark(M, N, Pp, 42), angleText(M, N, Pp, '70°', 78),
    dot(M), dot(N), dot(Pp),
    label(M, 'M', 0, -14), label(N, 'N', -18, 22), label(Pp, 'P', 18, 22)])
}

// HHC002963 — ABC cân tại A, E ∈ AB, D ∈ AC, AD = AE, M = BD ∩ CE; cho ACB = 50°
{
  const B = P(0, 260), C = P(300, 260)
  const A = inter(B, ray(B, 50, 100), C, ray(C, 130, 100))
  const E = lerp(A, B, 0.7), D = lerp(A, C, 0.7)
  const M = inter(B, D, C, E)
  ok(goc(C, B, A), 50, 'C'); ok(goc(B, C, A), 50, 'B')
  ok(dist(A, E), dist(A, D), 'AE=AD'); ok(dist(A, B), dist(A, C), 'AB=AC')
  hinh('HHC002963', [A, B, C, E, D, M], [seg(A, B), seg(B, C), seg(C, A), seg(B, D), seg(C, E),
    tick(A, B, 1, 0.85), tick(A, C, 1, 0.85), tick(A, E, 2), tick(A, D, 2),
    angleMark(C, B, A, 36), angleText(C, B, A, '50°', 74),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(M),
    label(A, 'A', 0, -14), label(B, 'B', -16, 24), label(C, 'C', 16, 24),
    label(E, 'E', -20, 8), label(D, 'D', 20, 8), label(M, 'M', 0, -14)])
}

// HHC002965 — △ABC và △MNP có AB = MN, BC = MP (không cho thêm gì khác)
{
  const k = 0.8
  const B = P(0, 160), C = P(210 * k, 160), A = ray(B, 75, 180 * k)
  const M = P(250, 160), Pp = P(250 + 210 * k, 160), N = ray(M, 55, 180 * k)
  ok(dist(A, B), dist(M, N), 'AB=MN'); ok(dist(B, C), dist(M, Pp), 'BC=MP')
  hinh('HHC002965', [A, B, C, M, N, Pp], [seg(A, B), seg(B, C), seg(C, A), seg(M, N), seg(M, Pp), seg(N, Pp),
    tick(A, B, 1), tick(M, N, 1), tick(B, C, 2), tick(M, Pp, 2),
    dot(A), dot(B), dot(C), dot(M), dot(N), dot(Pp),
    label(A, 'A', -2, -14), label(B, 'B', -16, 22), label(C, 'C', 16, 22),
    label(N, 'N', -2, -14), label(M, 'M', -16, 22), label(Pp, 'P', 16, 22)], { pad: 44 })
}

// HHC002966 — △ABC, B = 60°, C = 50°, tia phân giác của góc A cắt BC tại D (không ghi A, ADB)
{
  const B = P(0, 260), C = P(320, 260)
  const A = inter(B, ray(B, 60, 100), C, ray(C, 130, 100))
  const D = inter(A, bisector(A, B, C, 100), B, C)
  ok(goc(B, C, A), 60, 'B'); ok(goc(C, B, A), 50, 'C'); ok(goc(A, B, D), goc(A, C, D), 'BAD=CAD')
  hinh('HHC002966', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, A), seg(A, D),
    angleMark(B, C, A, 36), angleText(B, C, A, '60°', 72),
    angleMark(C, B, A, 36), angleText(C, B, A, '50°', 72),
    angleMark(A, B, D, 40), angleMark(A, D, C, 52),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', 0, -14), label(B, 'B', -16, 24), label(C, 'C', 16, 24), label(D, 'D', 0, 30)])
}

// HHC002967 — ABC cân tại A, AD phân giác (D ∈ BC), DE ⊥ AB, DF ⊥ AC, I trung điểm EF
{
  const B = P(0, 240), C = P(300, 240), A = P(150, 0)
  const D = inter(A, bisector(A, B, C, 100), B, C)
  const E = foot(D, A, B), F = foot(D, A, C), I = mid(E, F)
  ok(dist(A, B), dist(A, C), 'AB=AC'); ok(goc(A, B, D), goc(A, C, D), 'BAD=CAD')
  ok(goc(E, A, D), 90, 'E'); ok(goc(F, A, D), 90, 'F')
  hinh('HHC002967', [A, B, C, D, E, F, I], [seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(D, E), seg(D, F), seg(E, F),
    tick(A, B, 1, 0.3), tick(A, C, 1, 0.3), tick(E, I, 2), tick(I, F, 2),
    angleMark(A, B, D, 38), angleMark(A, D, C, 48),
    rightAngle(E, A, D, 13), rightAngle(F, A, D, 13),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(I),
    label(A, 'A', 0, -14), label(B, 'B', -16, 24), label(C, 'C', 16, 24), label(D, 'D', 0, 32),
    label(E, 'E', -20, 8), label(F, 'F', 20, 8), label(I, 'I', 16, -8)])
}

await xuatTat(RA)
