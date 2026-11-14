// ve_G1.mjs — hình đề NDT-H1.19..23 (§3 Đường trung bình). Chạy: node ve_G1.mjs (từ thư mục h8t)
import { P, seg, tick, rightAngle, dot, label, mid, foot, inter, goc, dist, hinh, xuatTat } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/cf0b21d3-a89a-437b-ae80-9b607bdf58bb/scratchpad/h8t/hinh_G1'
const dots = (...ps) => ps.map(dot).join('')
const near = (a, b, e = 0.5) => console.assert(Math.abs(a - b) < e, 'sai dữ kiện', a, b)

// ───── 19: ABC vuông tại A (AB đứng, AC ngang), M trung điểm BC, MN ⊥ AB tại N ─────
{
  const A = P(70, 330), B = P(70, 90), C = P(400, 330)
  const M = mid(B, C), N = foot(M, A, B)
  near(goc(A, B, C), 90); near(goc(N, B, M), 90)
  hinh('NDT-H1-19', [A, B, C, M, N], [
    seg(A, B), seg(B, C), seg(C, A), seg(M, N),
    rightAngle(A, B, C), rightAngle(N, B, M),
    tick(B, M, 1), tick(M, C, 1),
    dots(A, B, C, M, N),
    label(A, 'A', -18, 26), label(B, 'B', -18, 6), label(C, 'C', 20, 26), label(M, 'M', 22, -8), label(N, 'N', -22, 8),
  ])
}

// ───── 20: ABC cân tại A, D, E trung điểm AB, AC ─────
{
  const A = P(220, 70), B = P(80, 330), C = P(360, 330)
  const D = mid(A, B), E = mid(A, C)
  near(dist(A, B), dist(A, C), 0.01)
  hinh('NDT-H1-20', [A, B, C, D, E], [
    seg(A, B), seg(B, C), seg(C, A), seg(D, E),
    tick(A, B, 2, 0.25), tick(D, B, 2, 0.5), tick(A, C, 2, 0.25), tick(E, C, 2, 0.5),
    dots(A, B, C, D, E),
    label(A, 'A', 0, -14), label(B, 'B', -20, 26), label(C, 'C', 20, 26), label(D, 'D', -22, 6), label(E, 'E', 22, 6),
  ])
}

// ───── 21: hình thang ABCD (AB ∥ CD), M, N, K trung điểm AD, BC, AC ─────
{
  const A = P(120, 70), B = P(310, 70), D = P(40, 300), C = P(400, 300)
  const M = mid(A, D), N = mid(B, C), K = mid(A, C)
  near(A.y, B.y, 0.01); near(D.y, C.y, 0.01)
  hinh('NDT-H1-21', [A, B, C, D, M, N, K], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(M, K), seg(K, N),
    tick(A, M, 1), tick(M, D, 1), tick(B, N, 2), tick(N, C, 2), tick(A, K, 3), tick(K, C, 3),
    dots(A, B, C, D, M, N, K),
    label(A, 'A', -4, -16), label(B, 'B', 6, -16), label(C, 'C', 22, 26), label(D, 'D', -20, 26),
    label(M, 'M', -22, 6), label(N, 'N', 24, 6), label(K, 'K', -4, 32),
  ])
}

// ───── 22: ABC, trung tuyến BD, CE cắt tại G; M, N trung điểm GB, GC ─────
{
  const A = P(130, 60), B = P(50, 330), C = P(400, 330)
  const D = mid(A, C), E = mid(A, B), G = inter(B, D, C, E)
  const M = mid(B, G), N = mid(C, G)
  hinh('NDT-H1-22', [A, B, C, D, E, G, M, N], [
    seg(A, B), seg(B, C), seg(C, A), seg(B, D), seg(C, E), seg(D, E), seg(M, N),
    tick(A, E, 1), tick(E, B, 1), tick(A, D, 2), tick(D, C, 2), tick(B, M, 3), tick(M, G, 3), tick(G, N, 4), tick(N, C, 4),
    dots(A, B, C, D, E, G, M, N),
    label(A, 'A', 0, -14), label(B, 'B', -20, 26), label(C, 'C', 20, 26), label(D, 'D', 22, -2), label(E, 'E', -22, 4),
    label(G, 'G', 4, 30), label(M, 'M', -10, -14), label(N, 'N', -4, -14),
  ])
}

// ───── 23: ABC vuông tại A (AB đứng, AC ngang), AH ⊥ BC, M, N trung điểm AH, CH ─────
{
  const A = P(60, 360), B = P(60, 110), C = P(400, 360)
  const H = foot(A, B, C), M = mid(A, H), N = mid(H, C)
  near(goc(A, B, C), 90); near(goc(H, A, C), 90)
  hinh('NDT-H1-23', [A, B, C, H, M, N], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(M, N), seg(B, M), seg(A, N),
    rightAngle(A, B, C), rightAngle(H, A, C),
    tick(A, M, 1), tick(M, H, 1), tick(H, N, 2), tick(N, C, 2),
    dots(A, B, C, H, M, N),
    label(A, 'A', -20, 26), label(B, 'B', -20, 6), label(C, 'C', 22, 24), label(H, 'H', 22, -6), label(M, 'M', 16, 30), label(N, 'N', 12, 36),
  ])
}

await xuatTat(OUT)
