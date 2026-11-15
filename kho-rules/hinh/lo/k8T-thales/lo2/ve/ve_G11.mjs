// ve_G11.mjs — hình TCHH CĐ3 II Bài 2–9 (trạm G11). Chạy: node ve_G11.mjs (từ thư mục h8t2)
import { P, seg, segDash, tick, rightAngle, dot, label, labelOut, mid, lerp, foot, inter, goc, dist, trongTam, add, hinh, xuatTat } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/cf0b21d3-a89a-437b-ae80-9b607bdf58bb/scratchpad/h8t2/hinh_G11'
const dots = (...ps) => ps.map(dot).join('')
const near = (a, b, e = 0.5) => console.assert(Math.abs(a - b) < e, 'sai dữ kiện', a, b)
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
const cr = (a, b) => a.x * b.y - a.y * b.x
const par = (a, b, c, d) => Math.abs(cr(sub(b, a), sub(d, c))) / (dist(a, b) * dist(c, d)) < 1e-6
const thro = (p, dir, q, dir2) => inter(p, add(p, dir), q, add(q, dir2))
const lab = (p, t, from, d = 22) => labelOut(p, t, from, d)
const NP = { pad: 40, padDuoi: 50 }

// ───── Bài 2 ─────
function bai2(x, ten, lg) {
  const s = lg ? 0.8 : 1
  const A = P(120 * s, 40 * s), B = P(40 * s, 280 * s), C = P(400 * s, 280 * s), M = mid(B, C), I = lerp(B, C, x)
  const K = thro(I, sub(C, A), A, sub(B, A)), D = thro(I, sub(B, A), A, sub(C, A)), E = thro(I, sub(B, A), A, sub(M, A))
  near(dist(D, E), dist(B, K), 0.01); console.assert(par(I, K, A, C) && par(I, D, A, B))
  const g = trongTam([A, B, C]); const pts = [A, B, C, M, I, K, D, E]
  hinh(ten, pts, [
    seg(A, B), seg(B, C), seg(C, A), seg(A, M), seg(I, K), lg ? seg(E, D) : seg(I, D), lg ? '' : seg(I, E),
    tick(B, M, 1, 0.5), tick(M, C, 1, 0.5),
    dots(...pts),
    lab(A, 'A', g, 20), lab(B, 'B', g, 22), lab(C, 'C', g, 22), label(M, 'M', 0, 28), label(I, 'I', 0, 28), lab(K, 'K', g, 20), label(D, 'D', 20, -4), lab(E, 'E', g, 22),
  ], NP)
}
bai2(0.3, 'TCHH-3-II-2'); bai2(0.75, 'TCHH-3-II-2_lg', true)

// ───── Bài 3 ─────
{
  const A = P(174, 94), B = P(261, 259), C = P(138, 372), D = P(62, 72)
  const M = mid(A, B), N = mid(C, D), I = inter(M, N, A, D), K = inter(M, N, B, C)
  const g = trongTam([A, B, C, D]); const pts = [A, B, C, D, M, N, I, K]
  hinh('TCHH-3-II-3', pts, [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), segDash(A, I), segDash(B, K), seg(N, K),
    tick(A, M, 1, 0.5), tick(M, B, 1, 0.5), tick(C, N, 2, 0.5), tick(N, D, 2, 0.5),
    dots(...pts),
    lab(A, 'A', g, 20), lab(B, 'B', g, 22), lab(C, 'C', g, 22), lab(D, 'D', g, 22), label(M, 'M', 6, -12), label(N, 'N', -10, 24), label(I, 'I', 4, -14), label(K, 'K', 14, -12),
  ], NP)
}

// ───── Bài 4 ─────
function bai4(lg) {
  const O = P(60, 300), th = 70 * Math.PI / 180, k = 130, OA = 300
  const OB = 1 / (1 / k - 1 / OA)
  const A = P(O.x + OA, O.y), B = P(O.x + OB * Math.cos(th), O.y - OB * Math.sin(th))
  const X = P(O.x + 380, O.y), Y = P(O.x + 300 * Math.cos(th), O.y - 300 * Math.sin(th))
  const bis = P(Math.cos(th / 2), -Math.sin(th / 2))
  const C = inter(O, add(O, bis), A, B), D = thro(C, P(1, 0), O, sub(B, O))
  near(dist(D, O), dist(D, C), 0.01); near(dist(C, D), k, 0.01)
  const Z = add(O, P(bis.x * 330, bis.y * 330))
  const pts = [O, A, B, X, Y].concat(lg ? [C, D, Z] : [])
  hinh(lg ? 'TCHH-3-II-4_lg' : 'TCHH-3-II-4', pts, [
    seg(O, X), seg(O, Y), seg(A, B),
    lg ? seg(O, Z) + seg(C, D) + tick(O, D, 1, 0.5) + tick(D, C, 1, 0.5) + dots(C, D) : '',
    dots(O, A, B),
    label(O, 'O', -18, 20), label(A, 'A', 0, 28), label(B, 'B', -22, -6), label(X, 'x', 6, 24), label(Y, 'y', 14, -8),
    lg ? label(C, 'C', 14, 26) + label(D, 'D', -22, 4) + label(Z, 'z', 12, -2) : '',
  ], NP)
}
bai4(false); bai4(true)

// ───── Bài 5 ─────
{
  const D = P(60, 330), C = P(380, 330), A = P(160, 200), B = P(270, 200)
  const O = inter(D, A, C, B), M = lerp(A, B, 0.4)
  const G = inter(O, A, C, M), H = inter(O, B, D, M)
  console.assert(par(A, B, C, D))
  const g = trongTam([A, B, C, D]); const pts = [O, A, B, C, D, M, G, H]
  hinh('TCHH-3-II-5', pts, [
    seg(O, D), seg(O, C), seg(D, C), seg(A, B), seg(C, M), seg(D, M),
    dots(...pts),
    label(O, 'O', 0, -14), label(A, 'A', -20, 6), label(B, 'B', 20, 6), lab(C, 'C', g, 22), lab(D, 'D', g, 22), label(M, 'M', 0, 26), label(G, 'G', -20, -6), label(H, 'H', 20, -6),
  ], NP)
}

// ───── Bài 6 ─────
function bai6(lg) {
  const s = lg ? 0.68 : 1
  const B = P(30 * s, 260 * s), C = P(370 * s, 260 * s), A = P(110 * s, 70 * s), m = 100 * s
  const u = (p, q) => { const l = dist(p, q); return P((q.x - p.x) / l, (q.y - p.y) / l) }
  const uB = u(A, B), uC = u(A, C), dir = P(uB.x + uC.x, uB.y + uC.y)
  const D = inter(B, C, A, add(A, dir))
  const M = add(B, P(u(B, A).x * m, u(B, A).y * m)), N = add(C, P(u(C, A).x * m, u(C, A).y * m))
  const O = inter(C, M, B, N), E = thro(O, dir, A, sub(B, A)), F = thro(O, dir, A, sub(C, A))
  near(dist(C, F), dist(A, B), 0.01); near(dist(B, E), dist(A, C), 0.01); near(dist(A, E), dist(A, F), 0.01)
  const g = trongTam([A, B, C]); let pts = [A, B, C, D, M, N, O, E, F], ex = '', exl = ''
  if (lg) {
    const K = thro(B, dir, A, sub(C, A)), Pp = thro(B, sub(C, A), C, sub(M, C))
    near(dist(A, K), dist(A, B), 0.01)
    pts = pts.concat([K, Pp])
    ex = segDash(C, K) + segDash(B, K) + segDash(B, Pp) + segDash(M, Pp) + tick(B, M, 1, 0.5) + tick(C, N, 1, 0.5) + dots(K, Pp)
    exl = label(K, 'K', -16, -6) + label(Pp, 'P', 4, 22)
  }
  hinh(lg ? 'TCHH-3-II-6_a_lg' : 'TCHH-3-II-6', pts, [
    seg(B, C), seg(A, C), seg(B, E), seg(A, D), seg(C, M), seg(B, N), seg(E, F),
    lg ? '' : tick(B, M, 1, 0.5) + tick(C, N, 1, 0.5), ex,
    dots(A, B, C, D, M, N, O, E, F),
    label(A, 'A', 16, -10), label(B, 'B', -16, 20), lab(C, 'C', g, 22), label(D, 'D', 0, 28), label(M, 'M', -18, 6), label(N, 'N', 18, -2), label(O, 'O', 14, 20), label(E, 'E', -16, -4), label(F, 'F', 20, 4), exl,
  ], NP)
}
bai6(false); bai6(true)

// ───── Bài 7 ─────
function bai7(lg) {
  const B = P(40, 280), C = P(400, 280), A = P(150, 60), M = mid(B, C), D = P(160, 280)
  const E = thro(D, sub(M, A), A, sub(B, A)), F = thro(D, sub(M, A), A, sub(C, A))
  near(dist(D, E) + dist(D, F), 2 * dist(A, M), 0.01)
  let pts = [A, B, C, M, D, E, F], ex = '', exl = ''
  if (lg) {
    const K = thro(A, sub(C, B), D, sub(M, A)); pts = pts.concat([K])
    near(dist(K, E), dist(K, F), 0.01)
    ex = segDash(A, K) + dots(K) + tick(B, M, 1, 0.5) + tick(M, C, 1, 0.5); exl = label(K, 'K', -18, -2)
  }
  const g = trongTam([A, B, C])
  hinh(lg ? 'TCHH-3-II-7_b_lg' : 'TCHH-3-II-7', pts, [
    seg(B, C), seg(B, A), seg(C, F), seg(A, M), seg(D, F), ex,
    dots(A, B, C, M, D, E, F),
    label(A, 'A', 18, -6), lab(B, 'B', g, 22), lab(C, 'C', g, 22), label(M, 'M', 6, 28), label(D, 'D', -10, 28), label(E, 'E', -18, 2), label(F, 'F', -16, -8), exl,
  ], NP)
}
bai7(false); bai7(true)

// ───── Bài 9 ─────
{
  const A = P(60, 300), B = P(250, 300), D = P(230, 160), C = P(420, 160)
  console.assert(dist(A, C) > dist(B, D))
  const M = lerp(B, C, 0.35), I = inter(D, M, A, C), N = inter(D, M, A, B)
  const K = P(2 * I.x - D.x, 2 * I.y - D.y), E = foot(C, A, B), F = foot(C, A, D)
  console.assert(par(A, B, C, D) && par(A, D, B, C))
  const g = trongTam([A, B, C, D]); const pts = [A, B, C, D, M, I, N, K, E, F]
  hinh('TCHH-3-II-9', pts, [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(D, N), seg(B, E), seg(D, F), seg(C, E), seg(C, F),
    rightAngle(E, C, B), rightAngle(F, C, A),
    dots(...pts),
    lab(A, 'A', g, 20), label(B, 'B', 0, 26), label(C, 'C', 14, -10), label(D, 'D', -8, -14), label(M, 'M', -16, -8), label(I, 'I', -8, -14), label(N, 'N', 6, 26), label(K, 'K', 16, 22), label(E, 'E', 8, 26), label(F, 'F', -18, -6),
  ], NP)
}

await xuatTat(OUT)
