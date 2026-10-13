// Vẽ lại hình — gói BT-MH048-1 (MH.048 Phân giác của hình bình hành, Hình 8 · Luyện · bài toán). Thùy 13/10.
//   node scripts/anh/ve_lai/BT-MH048-1.mjs [<thu_muc_ra>]
// Quy ước (như ảnh cũ): A trên-trái, B trên-phải, C dưới-phải, D dưới-trái. AM là phân giác góc A (M ∈ CD), CN là phân giác góc C (N ∈ AB).
import { P, seg, sector, angleMark, dot, label, bisector, inter, dist, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH048-1/moi'

const W = 310, LECH = 90, H = 175
const A = P(LECH, 0), B = P(LECH + W, 0), C = P(W, H), D = P(0, H)
// M = giao của phân giác góc A với CD; N = giao của phân giác góc C với AB (dựng, không ước mắt)
const M = inter(A, bisector(A, D, B), D, C)
const N = inter(C, bisector(C, B, D), A, B)
console.assert(Math.abs(goc(A, D, M) - goc(A, M, B)) < 0.01 && Math.abs(goc(C, B, N) - goc(C, N, D)) < 0.01, 'AM, CN là phân giác')
console.assert(Math.abs(dist(D, M) - dist(D, A)) < 1e-6 && Math.abs(dist(B, N) - dist(B, C)) < 1e-6)
console.assert(M.x > D.x && M.x < C.x && N.x > A.x && N.x < B.x)

// BT.08.048.02 — ảnh cũ: AC, BD, MN, AM, CN; góc A và góc C đều tô xám + 2 cung (giữ như ảnh cũ). Không có điểm O.
{
  hinh('BT.08.048.02', [A, B, C, D], [
    sector(A, B, D, 40), sector(C, B, D, 40),
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(A, M), seg(C, N), seg(M, N),
    angleMark(A, B, D, 34, 2), angleMark(C, B, D, 34, 2),
    dot(A), dot(B), dot(C), dot(D), dot(M), dot(N),
    label(A, 'A', -12, -14), label(B, 'B', 12, -14), label(C, 'C', 12, 30), label(D, 'D', -12, 30),
    label(M, 'M', 0, 32), label(N, 'N', 0, -14)])
}

await xuatTat(RA)
