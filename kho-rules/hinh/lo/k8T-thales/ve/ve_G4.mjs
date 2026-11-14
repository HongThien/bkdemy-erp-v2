// ve_G4.mjs — hình NDT-H3.6 … H3.9 (trạm G4). Chạy từ h8t: node ve_G4.mjs → hinh_G4\
import { P, seg, segDash, tick, rightAngle, dot, label, hinh, xuatTat, mid, lerp, inter, add, vec, doiXung, lineExt, poly, trongTam, labelOut } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

// toạ độ toán học (y hướng lên) → toạ độ ảnh (y xuống)
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
const Q = (x, y) => P(x, -y)
const L = (p, t, dx, dy) => label(p, t, dx, dy)
const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/cf0b21d3-a89a-437b-ae80-9b607bdf58bb/scratchpad/h8t/hinh_G4'

// ───────── BÀI 6 ─────────
{
  const A = Q(90, 200), B = Q(0, 0), C = Q(340, 0)
  const G = P((A.x + B.x + C.x) / 3, (A.y + B.y + C.y) / 3)
  const D = inter(G, add(G, sub(B, A)), B, C)
  const M = mid(B, C)
  const base = [seg(A, B), seg(B, C), seg(C, A), seg(G, D)]
  const pts = [A, B, C, G, D]
  const nhan = [labelOut(A, 'A', trongTam([A, B, C]), 22), labelOut(B, 'B', trongTam([A, B, C]), 22), labelOut(C, 'C', trongTam([A, B, C]), 22),
    L(D, 'D', 0, 30), L(G, 'G', 18, -8)]
  hinh('NDT-H3-6', pts, [...base, dot(G), dot(D), ...nhan])
  hinh('NDT-H3-6_lg', [...pts, M], [...base, seg(A, M), tick(B, M, 1), tick(M, C, 1), dot(G), dot(D), dot(M), ...nhan.filter((_, i) => i !== 3), L(D, 'D', -2, 30), L(M, 'M', 0, 30)])
}

// ───────── BÀI 7 ─────────
{
  const A = Q(0, 0), D = Q(260, 0), B = Q(70, 150), C = add(B, sub(D, A))
  const E = lerp(A, B, 0.3), F = lerp(A, D, 0.7)
  const O = inter(E, F, A, C)
  const dir = sub(F, E)
  const M = inter(B, add(B, dir), A, C), N = inter(D, add(D, dir), A, C)
  const tg = trongTam([A, B, C, D])
  // đường thẳng d: kéo dài cả hai phía
  const u = (() => { const l = Math.hypot(dir.x, dir.y); return P(dir.x / l, dir.y / l) })()
  const dA = P(E.x - u.x * 55, E.y - u.y * 55), dB = P(F.x + u.x * 55, F.y + u.y * 55)
  const base = [poly([A, B, C, D]), seg(A, C), seg(dA, dB), dot(E), dot(F), dot(O)]
  const nhan = [L(A, 'A', -20, 18), L(B, 'B', -8, -14), L(C, 'C', 14, -12), L(D, 'D', 16, 20),
    L(E, 'E', -24, 22), L(F, 'F', 2, 30), L(O, 'O', 4, -14), L(dB, 'd', 12, 22)]
  const pts = [A, B, C, D, dA, dB]
  hinh('NDT-H3-7', pts, [...base, ...nhan])
  // hình lời giải: kẻ BM // d, DN // d
  hinh('NDT-H3-7_lg', [...pts, M, N], [...base, seg(B, M), seg(D, N), dot(M), dot(N), L(M, 'M', 4, -14), L(N, 'N', 20, -8), ...nhan.filter((_, i) => i !== 6), L(O, 'O', -12, 26)])
}

// ───────── BÀI 8 ─────────
{
  const A = Q(90, 200), B = Q(0, 0), C = Q(340, 0)
  const M = mid(B, C), N = lerp(A, M, 0.55)
  const D = inter(C, N, A, B), E = inter(B, N, A, C)
  const F = doiXung(N, M)
  const tg = trongTam([A, B, C])
  const base = [poly([A, B, C]), seg(A, M), seg(C, D), seg(B, E), tick(B, M, 1), tick(M, C, 1), dot(N), dot(M), dot(D), dot(E)]
  const nhan = [labelOut(A, 'A', tg, 22), L(B, 'B', -14, 18), L(C, 'C', 16, 18), L(M, 'M', 4, 30), L(N, 'N', 24, 4), L(D, 'D', -22, 4), L(E, 'E', 22, -6)]
  hinh('NDT-H3-8', [A, B, C, D, E], [...base, ...nhan])
  hinh('NDT-H3-8_lg', [A, B, C, D, E, F], [...base.filter((_, i) => i !== 4 && i !== 5), tick(B, M, 1), tick(M, C, 1), tick(N, M, 2), tick(M, F, 2), segDash(M, F), segDash(B, F), segDash(C, F), dot(F), ...nhan.filter((_, i) => i !== 3), L(M, 'M', 24, -14), L(F, 'F', 4, 32)])
}

// ───────── BÀI 9 ─────────
{
  const A = Q(0, 0), D = Q(300, 0), B = Q(80, 150), C = add(B, sub(D, A))
  const O = mid(A, C)
  const M = mid(B, O), N = mid(A, O), F = lerp(A, B, 0.35)
  const E = inter(F, M, B, C), K = inter(F, N, A, D)
  const dd = sub(E, F)
  const I = inter(A, add(A, dd), B, D), Lp = inter(C, add(C, dd), B, D)
  const base = [poly([A, B, C, D]), seg(A, C), seg(B, D), seg(F, E), seg(F, K), tick(B, M, 1), tick(M, O, 1), tick(A, N, 2), tick(N, O, 2),
    dot(O), dot(M), dot(N), dot(F), dot(E), dot(K)]
  const nhan = [L(A, 'A', -18, 18), L(B, 'B', -14, -10), L(C, 'C', 16, -10), L(D, 'D', 18, 18), L(O, 'O', 18, 24),
    L(M, 'M', -4, -14), L(N, 'N', 6, 30), L(F, 'F', -22, 6), L(E, 'E', 2, -14), L(K, 'K', 2, 30)]
  hinh('NDT-H3-9', [A, B, C, D], [...base, ...nhan])
  hinh('NDT-H3-9_a_lg', [A, B, C, D, I, Lp], [...base, seg(A, I), seg(C, Lp), dot(I), dot(Lp), ...nhan.filter((_, i) => i !== 4), L(O, 'O', 4, -16), L(I, 'I', 4, 30), L(Lp, 'L', 20, 22)])
}

await xuatTat(OUT)
