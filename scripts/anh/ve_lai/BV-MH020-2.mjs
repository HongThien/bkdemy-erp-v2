// Vẽ lại hình — gói BV-MH020-2 (MH.020 Tứ giác · biến thể của BT.08.020.04)
//   node scripts/anh/ve_lai/BV-MH020-2.mjs [<thu_muc_ra>]
import { P, seg, inter, dot, label, labelOut, trongTam, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BV-MH020-2/moi'

// Đề: tứ giác MNPQ, MP cắt NQ tại K (ảnh cũ ghi giao điểm là O — vẽ theo đề: K)
{
  const M = P(120, 0), N = P(290, 44), P_ = P(333, 215), Q = P(34, 215)
  const K = inter(M, P_, N, Q)
  const g = trongTam([M, N, P_, Q])
  hinh('02eceade-32c1-42b5-ae31-f2a4fc1b3b15', [M, N, P_, Q], [
    seg(M, N), seg(N, P_), seg(P_, Q), seg(Q, M), seg(M, P_), seg(N, Q),
    dot(M), dot(N), dot(P_), dot(Q), dot(K),
    labelOut(M, 'M', g, 20), labelOut(N, 'N', g, 22), labelOut(P_, 'P', g, 22), labelOut(Q, 'Q', g, 22),
    label(K, 'K', 0, 36)])
}

await xuatTat(RA)
