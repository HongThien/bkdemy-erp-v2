// ve_G10.mjs — hình đề TCHH CĐ3 II VD3,4,5,7,8,9 (nhóm G10, lô 2). Chạy: node ve_G10.mjs (từ thư mục h8t2)
import { P, seg, segDash, tick, angleMark, rightAngle, dot, label, labelOut, mid, lerp, inter, bisector, noiTiep, dist, goc, trongTam, hinh, xuatTat } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/cf0b21d3-a89a-437b-ae80-9b607bdf58bb/scratchpad/h8t2/hinh_G10'
const dots = (...ps) => ps.map(dot).join('')
const near = (a, b, e = 0.5) => console.assert(Math.abs(a - b) < e, 'sai dữ kiện', a, b)
const par = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) / (dist(a, b) * dist(c, d)) < 1e-6
const NP = { pad: 40, padDuoi: 50 }
const lab = (p, t, from, d = 22) => labelOut(p, t, from, d)

// ───── VD3: ABC cân tại B (BA = BC), AM, CN phân giác ─────
{
  const A = P(40, 280), C = P(240, 280), B = P(140, 40)
  const M = inter(A, bisector(A, B, C), B, C), N = inter(C, bisector(C, B, A), B, A)
  near(dist(B, A), dist(B, C), 0.01); near(goc(A, B, M), goc(A, M, C)); near(goc(C, B, N), goc(C, N, A))
  const g = trongTam([A, B, C])
  hinh('TCHH-3-II-VD3', [A, B, C, M, N], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, M), seg(C, N), seg(M, N),
    tick(B, A, 1, 0.5), tick(B, C, 1, 0.5),
    angleMark(A, B, M, 34, 1), angleMark(A, M, C, 34, 1), angleMark(C, B, N, 34, 2), angleMark(C, N, A, 34, 2),
    dots(A, B, C, M, N),
    lab(A, 'A', g, 20), lab(B, 'B', g, 20), lab(C, 'C', g, 20), lab(M, 'M', g, 20), lab(N, 'N', g, 20),
  ], NP)
}

// ───── VD4: hình vuông ABCD, O = AC ∩ BD, M ∈ BC, N = AM ∩ CD, E ∈ AB với BE = CM ─────
{
  const A = P(40, 40), B = P(240, 40), C = P(240, 240), D = P(40, 240)
  const O = inter(A, C, B, D)
  const M = lerp(B, C, 0.55), N = inter(A, M, C, D)
  const E = lerp(B, A, dist(C, M) / dist(B, A))
  near(dist(B, E), dist(C, M), 0.01)
  hinh('TCHH-3-II-VD4', [A, B, C, D, N, E], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(A, N), seg(C, N), seg(M, E), seg(B, N),
    tick(B, E, 1, 0.5), tick(C, M, 1, 0.5),
    dots(A, B, C, D, O, M, N, E),
    label(A, 'A', -16, -10), label(B, 'B', 14, -10), label(C, 'C', -4, 26), label(D, 'D', -18, 22),
    label(O, 'O', -18, 8), label(M, 'M', 22, -10), label(N, 'N', 14, 22), label(E, 'E', 0, -16),
  ], NP)
}

// ───── VD5: hình thang ABCD (AB ∥ CD, AB < CD); AK ∥ BC, BI ∥ AD; E = AK ∩ BD, F = BI ∩ AC ─────
{
  const A = P(100, 40), B = P(300, 40), D = P(30, 230), C = P(390, 230)
  const K = P(A.x + (C.x - B.x), 230), I = P(B.x + (D.x - A.x), 230)
  console.assert(par(A, K, B, C) && par(B, I, A, D), 'VD5 song song')
  const E = inter(A, K, B, D), F = inter(B, I, A, C)
  hinh('TCHH-3-II-VD5', [A, B, C, D, K, I, E, F], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, K), seg(B, I), seg(A, C), seg(B, D), seg(E, F),
    dots(A, B, C, D, K, I, E, F),
    label(A, 'A', -4, -16), label(B, 'B', 4, -16), label(C, 'C', 20, 24), label(D, 'D', -20, 24),
    label(K, 'K', -8, 28), label(I, 'I', 10, 28), label(E, 'E', -24, -6), label(F, 'F', 24, -6),
  ], NP)
}

// ───── VD7: ABC, trung tuyến AM; MK phân giác AMB (K ∈ AB), MH phân giác AMC (H ∈ AC) ─────
{
  const A = P(110, 40), B = P(30, 280), C = P(370, 280), M = mid(B, C)
  const K = inter(M, bisector(M, A, B), A, B), H = inter(M, bisector(M, A, C), A, C)
  near(goc(M, A, K), goc(M, K, B)); near(goc(M, A, H), goc(M, H, C))
  const g = trongTam([A, B, C])
  hinh('TCHH-3-II-VD7', [A, B, C, M, K, H], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, M), seg(M, K), seg(M, H), seg(K, H),
    tick(B, M, 1, 0.5), tick(M, C, 1, 0.5),
    angleMark(M, A, K, 30, 1), angleMark(M, K, B, 30, 1), angleMark(M, A, H, 40, 2), angleMark(M, H, C, 40, 2),
    dots(A, B, C, M, K, H),
    lab(A, 'A', g, 20), lab(B, 'B', g, 20), lab(C, 'C', g, 20), label(M, 'M', 0, 26), lab(K, 'K', g, 20), lab(H, 'H', g, 20),
  ], NP)
}

// ───── VD8: tứ giác ABCD, O = AC ∩ BD; đường thẳng qua O cắt AB tại M, CD tại N; ME ∥ CD (E ∈ AC); NF ∥ AB (F ∈ BD) ─────
{
  const A = P(80, 40), B = P(30, 240), C = P(360, 260), D = P(300, 70)
  const O = inter(A, C, B, D)
  const M = lerp(A, B, 0.5), N = inter(M, O, C, D)
  const E = inter(M, P(M.x + (D.x - C.x), M.y + (D.y - C.y)), A, C)
  const F = inter(N, P(N.x + (B.x - A.x), N.y + (B.y - A.y)), B, D)
  const t = (N.x - C.x) / (D.x - C.x); console.assert(t > 0.1 && t < 0.9, 'N không nằm trong CD', t)
  console.assert(par(M, E, C, D) && par(N, F, A, B), 'VD8 song song')
  const g = trongTam([A, B, C, D])
  hinh('TCHH-3-II-VD8', [A, B, C, D, E, F, M, N, O], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(M, N), seg(M, E), seg(N, F), seg(B, E), seg(C, F),
    dots(A, B, C, D, E, F, M, N, O),
    lab(A, 'A', g, 20), lab(B, 'B', g, 20), lab(C, 'C', g, 20), lab(D, 'D', g, 20), label(E, 'E', -14, -8), label(F, 'F', 14, -8),
    label(M, 'M', -16, 4), label(N, 'N', -16, 20), label(O, 'O', 6, -14),
  ], NP)
}

// ───── VD9: AB + AC = 2BC; I = tâm nội tiếp, G = trọng tâm, D = AI ∩ BC, M = trung điểm BC ─────
{
  const BC = 300, AB = 190, AC = 410
  console.assert(AB + AC === 2 * BC, 'VD9 hệ thức')
  const xa = (AB * AB - AC * AC + BC * BC) / (2 * BC), ya = Math.sqrt(AB * AB - xa * xa)
  const B = P(110, 260), C = P(110 + BC, 260), A = P(110 + xa, 260 - ya)
  near(dist(A, B), AB, 0.01); near(dist(A, C), AC, 0.01)
  const I = noiTiep(A, B, C), G = trongTam([A, B, C]), M = mid(B, C), D = inter(A, I, B, C)
  const g = trongTam([A, B, C])
  hinh('TCHH-3-II-VD9', [A, B, C, D, M, I, G], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(A, M), seg(B, I), seg(C, I), seg(I, G),
    dots(A, B, C, D, M, I, G),
    lab(A, 'A', g, 20), lab(B, 'B', g, 20), lab(C, 'C', g, 20), label(D, 'D', 0, 26), label(M, 'M', 6, 26),
    label(I, 'I', -20, 4), label(G, 'G', 12, -14),
  ], NP)
}

await xuatTat(OUT)
