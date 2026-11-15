// Hình 2 bài ĐTB (14/11): DTB1 = hình chữ nhật ABCD, BH⊥AC, I/M/K trung điểm AH/BH/CD
//                          DTB2 = tam giác ABC cân tại A, H trung điểm BC, HI⊥AC, K/E trung điểm HI/IC
import { P, seg, tick, dot, label, mid, foot, rightAngle, hinh, xuatTat } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'
const DIR = 'C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/hinh/lo/k8-dtb-2bai'
const diem = (ps) => ps.map(dot).join('')
const nhan = (arr) => arr.map(([p, t, dx, dy]) => label(p, t, dx, dy)).join('')

// ── BÀI 1 ──
{
  const A = P(0, 0), B = P(250, 0), C = P(250, 155), D = P(0, 155)
  const H = foot(B, A, C), I = mid(A, H), M = mid(B, H), K = mid(C, D)
  const co = [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, H),
    seg(K, I), seg(I, M), seg(M, C), seg(B, I),
    rightAngle(H, B, C, 10),
    tick(A, I, 1), tick(I, H, 1), tick(B, M, 2), tick(M, H, 2), tick(D, K, 3), tick(K, C, 3),
    diem([A, B, C, D, H, I, M, K]),
    nhan([[A, 'A', -16, -6], [B, 'B', 8, -6], [C, 'C', 10, 20], [D, 'D', -16, 20],
      [H, 'H', -12, 28], [I, 'I', -6, -10], [M, 'M', 6, -10], [K, 'K', -4, 24]]),
  ].join('')
  hinh('DTB1', [A, B, C, D], co)
}
// ── BÀI 2 ──
{
  const A = P(140, 0), B = P(0, 150), C = P(280, 150), H = mid(B, C)
  const I = foot(H, A, C), K = mid(H, I), E = mid(I, C)
  const co = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, I), seg(K, E), seg(A, K), seg(B, I),
    rightAngle(H, A, C, 12), rightAngle(I, H, C, 12),
    tick(B, H, 1), tick(H, C, 1), tick(H, K, 2), tick(K, I, 2), tick(I, E, 3), tick(E, C, 3),
    diem([A, B, C, H, I, K, E]),
    nhan([[A, 'A', -6, -12], [B, 'B', -18, 12], [C, 'C', 12, 12], [H, 'H', -6, 28],
      [I, 'I', 14, -4], [K, 'K', -26, -6], [E, 'E', 0, 28]]),
  ].join('')
  hinh('DTB2', [A, B, C], co)
}
await xuatTat(DIR)
