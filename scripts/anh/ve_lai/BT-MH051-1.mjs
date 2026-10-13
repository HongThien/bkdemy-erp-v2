// Vẽ lại hình — gói BT-MH051-1 (MH.051 Mô hình trực tâm, Hình 8 · Luyện · bài toán). Thùy 13/10.
//   node scripts/anh/ve_lai/BT-MH051-1.mjs [<thu_muc_ra>]
// Tam giác nhọn ABC (BC nằm ngang, A trên, lệch trái như ảnh cũ). H = trực tâm (dựng bằng foot). I = giao của đường qua B ⊥ AB và đường qua C ⊥ AC.
// Ảnh cũ có: AB, AC, BC, đoạn AH, BH, CH, BI, CI, AI (nét liền), HI (nét đứt) và M — nằm trên BC (trung điểm BC; cũng chính là trung điểm HI) ⇒ giữ.
import { P, seg, segDash, dot, label, mid, foot, inter, rot, doiXung, goc, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH051-1/moi'

// BT.08.051.02
{
  const B = P(0, 215), C = P(310, 215), A = P(70, 8)
  const H = inter(A, foot(A, B, C), B, foot(B, A, C))
  const I = inter(B, rot(A, B, 90), C, rot(A, C, 90))
  const M = mid(B, C)
  console.assert(Math.abs(goc(B, A, I) - 90) < 0.01 && Math.abs(goc(C, A, I) - 90) < 0.01, 'BI ⊥ AB, CI ⊥ AC')
  console.assert(Math.abs((H.x - A.x) * (C.x - B.x) + (H.y - A.y) * (C.y - B.y)) < 1e-6, 'AH ⊥ BC')
  console.assert(Math.abs((H.x - B.x) * (C.x - A.x) + (H.y - B.y) * (C.y - A.y)) < 1e-6, 'BH ⊥ AC')
  console.assert(Math.abs((H.x - C.x) * (B.x - A.x) + (H.y - C.y) * (B.y - A.y)) < 1e-6, 'CH ⊥ AB')
  console.assert(dist(doiXung(H, M), I) < 1e-6, 'BHCI là hình bình hành, M là trung điểm HI')
  console.assert(goc(A, B, C) < 89 && goc(B, A, C) < 89 && goc(C, A, B) < 89, 'tam giác nhọn')
  hinh('BT.08.051.02', [A, B, C, I], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(B, H), seg(C, H), seg(B, I), seg(C, I), seg(A, I), segDash(H, I),
    dot(A), dot(B), dot(C), dot(H), dot(I), dot(M),
    label(A, 'A', 0, -14), label(B, 'B', -14, 26), label(C, 'C', 16, 8), label(H, 'H', 16, -6),
    label(M, 'M', -18, 28), label(I, 'I', 0, 32)])
}

await xuatTat(RA)
