// Vẽ lại hình — gói BT-MH053-1 (MH.053 Đường trung bình của tam giác, Hình 8 · Luyện · bài toán). Thùy 13/10.
//   node scripts/anh/ve_lai/BT-MH053-1.mjs [<thu_muc_ra>]
// Tam giác thường ABC (BC ngang, A trên lệch trái). M, N trung điểm AB, AC (mid); K = đối xứng của M qua N (NK = NM, K trên tia đối của NM).
// Ảnh cũ có: AB, AC, BC, MK (qua N), MC, AK, KC và gạch bằng nhau AM=MB (3 gạch), AN=NC (1 gạch), MN=NK (2 gạch) ⇒ giữ đủ.
// (BT.08.053.02, .03 mượn hình này: BMKC cần KC, MN // BC cần MN — ảnh cũ đã có cả hai.)
import { P, seg, tick, dot, label, mid, doiXung, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH053-1/moi'

// BT.08.053.01
{
  const B = P(0, 195), C = P(340, 195), A = P(97, 0)
  const M = mid(A, B), N = mid(A, C), K = doiXung(M, N)
  console.assert(Math.abs(M.y - N.y) < 1e-6 && dist(N, K) - dist(N, M) < 1e-6)
  console.assert(dist(K, P(C.x + (A.x - B.x) / 2, C.y + (A.y - B.y) / 2)) < 1e-6, 'AMCK là hình bình hành')
  hinh('BT.08.053.01', [A, B, C, K], [
    seg(A, B), seg(A, C), seg(B, C), seg(M, K), seg(M, C), seg(A, K), seg(K, C),
    tick(A, M, 3), tick(M, B, 3), tick(A, N, 1), tick(N, C, 1), tick(M, N, 2), tick(N, K, 2),
    dot(A), dot(B), dot(C), dot(M), dot(N), dot(K),
    label(A, 'A', 14, -12), label(B, 'B', -12, 28), label(C, 'C', 14, 28), label(M, 'M', -26, 4),
    label(N, 'N', 6, -14), label(K, 'K', 18, 8)])
}

await xuatTat(RA)
