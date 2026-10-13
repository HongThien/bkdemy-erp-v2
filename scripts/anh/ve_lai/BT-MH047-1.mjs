// Vẽ lại hình — gói BT-MH047-1 (MH.047 Trung điểm cạnh của hình bình hành, Hình 8 · Luyện · bài toán). Thùy 13/10.
//   node scripts/anh/ve_lai/BT-MH047-1.mjs [<thu_muc_ra>]
// Quy ước (như ảnh cũ): A trên-trái, B trên-phải, C dưới-phải, D dưới-trái (D lệch trái A). M, N trung điểm AB, CD.
// Cả 3 hình dùng CHUNG một hình bình hành (không chữ nhật, không hình thoi).
import { P, seg, segDash, tick, dot, label, mid, inter, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH047-1/moi'

const W = 310, LECH = 70, H = 190
const A = P(LECH, 0), B = P(LECH + W, 0), C = P(W, H), D = P(0, H)
const M = mid(A, B), N = mid(D, C)
console.assert(dist(A, B) === dist(D, C) && Math.abs(dist(A, D) - dist(B, C)) < 1e-9 && dist(A, B) !== dist(A, D), 'hình bình hành thường')
const pts = [A, B, C, D]
const khung = [seg(A, B), seg(B, C), seg(C, D), seg(D, A)]
const gach = [tick(A, M), tick(M, B), tick(D, N), tick(N, C)]
const tenABCD = [dot(A), dot(B), dot(C), dot(D),
  label(A, 'A', -12, -14), label(B, 'B', 12, -14), label(C, 'C', 12, 30), label(D, 'D', -12, 30)]
const tenMN = [dot(M), dot(N), label(M, 'M', 0, -14), label(N, 'N', 0, 32)]

// BT.08.047.02 — AC cắt DM ở E, cắt BN ở F (ảnh cũ + lời giải: BN; đề ghi "NM" là vênh). Ảnh cũ có DM, BN, AC; không có MN, BD.
{
  const E = inter(A, C, D, M), F = inter(A, C, N, B)
  console.assert(Math.abs(dist(A, E) - dist(E, F)) < 1e-6 && Math.abs(dist(E, F) - dist(F, C)) < 1e-6, 'AE = EF = FC')
  hinh('BT.08.047.02', pts, [...khung, seg(A, C), seg(D, M), seg(N, B), ...gach, ...tenABCD, ...tenMN,
    dot(E), dot(F), label(E, 'E', -24, 8), label(F, 'F', 24, 8)])
}

// BT.08.047.03 — AC, BD, MN đồng quy. Ảnh cũ có AC, BD, MN, và thêm AN, MC (giữ như ảnh cũ). Không có điểm O.
{
  const O = inter(A, C, B, D)
  console.assert(Math.abs(O.x - mid(M, N).x) < 1e-6 && Math.abs(O.y - mid(M, N).y) < 1e-6, 'MN đi qua giao điểm hai đường chéo')
  hinh('BT.08.047.03', pts, [...khung, seg(A, C), seg(B, D), seg(M, N), seg(A, N), seg(M, C), ...gach, ...tenABCD, ...tenMN])
}

// BT.08.047.04 — O là trung điểm AC; ảnh cũ có DM, BN, AC và MN nét đứt đi qua O (giữ). Không có BD.
{
  const O = mid(A, C)
  console.assert(Math.abs(O.x - mid(M, N).x) < 1e-6 && Math.abs(O.y - mid(M, N).y) < 1e-6, 'O thuộc MN')
  hinh('BT.08.047.04', pts, [...khung, seg(A, C), seg(D, M), seg(N, B), segDash(M, N), ...gach, ...tenABCD, ...tenMN,
    dot(O), label(O, 'O', 26, 6)])
}

await xuatTat(RA)
