// Vẽ lại hình — gói BT-MH049-1 (MH.049 Đường thẳng qua tâm, Hình 8 · Luyện · bài toán). Thùy 13/10.
//   node scripts/anh/ve_lai/BT-MH049-1.mjs [<thu_muc_ra>]
// Hình bình hành ABCD: A trên-trái, B trên-phải, C dưới-phải, D dưới-trái (như ảnh cũ). O = giao hai đường chéo = trung điểm AC.
// Điểm đối xứng qua O (F của E, P của M, N của Q) dựng bằng doiXung ⇒ nằm đúng trên cạnh đối.
import { P, seg, poly, dot, label, lerp, mid, doiXung, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH049-1/moi'

const hbh = (lech, W, H) => ({ A: P(lech, 0), B: P(lech + W, 0), C: P(W, H), D: P(0, H) })
/** Điểm trên tia a→b, cách b thêm k px (đầu mút đường kéo dài) */
const ngoai = (a, b, k) => lerp(a, b, 1 + k / dist(a, b))

// BT.08.049.01 — d qua O cắt AB, CD tại E, F (kéo dài hai phía như ảnh cũ). Ảnh cũ: AC, BD vẽ đủ.
{
  const { A, B, C, D } = hbh(55, 330, 190)
  const O = mid(A, C)
  console.assert(dist(O, mid(B, D)) < 1e-6)
  const E = lerp(A, B, 0.52), F = doiXung(E, O)
  console.assert(Math.abs(F.y - D.y) < 1e-6 && F.x > D.x && F.x < C.x)
  const e1 = ngoai(F, E, 45), e2 = ngoai(E, F, 45)
  hinh('BT.08.049.01', [A, B, C, D, e1, e2], [poly([A, B, C, D]), seg(A, C), seg(B, D), seg(e1, e2),
    dot(A), dot(B), dot(C), dot(D), dot(O), dot(E), dot(F),
    label(A, 'A', -14, -12), label(B, 'B', 14, -12), label(C, 'C', 14, 30), label(D, 'D', -14, 30),
    label(E, 'E', -16, -12), label(F, 'F', 18, 30), label(O, 'O', -34, 6)])
}

// BT.08.049.02 — a qua O cắt AB, CD tại M, P; b qua O cắt BC, AD tại N, Q. Ảnh cũ: AC, BD, hai đường a, b kéo dài,
// và bốn cạnh MN, NP, PQ, QM của tứ giác MNPQ đều đã vẽ ⇒ giữ như ảnh cũ.
{
  const { A, B, C, D } = hbh(82, 285, 163)
  const O = mid(A, C)
  const M = lerp(A, B, 0.27), Pp = doiXung(M, O)
  const Q = lerp(A, D, 0.69), N = doiXung(Q, O)
  console.assert(Math.abs(Pp.y - D.y) < 1e-6 && Pp.x > D.x && Pp.x < C.x)
  // N phải nằm trên BC: BN/BC = AQ/AD
  console.assert(dist(N, lerp(B, C, 0.31)) < 1e-6)
  const a1 = ngoai(Pp, M, 42), a2 = ngoai(M, Pp, 42), b1 = ngoai(N, Q, 42), b2 = ngoai(Q, N, 42)
  hinh('BT.08.049.02', [A, B, C, D, a1, a2, b1, b2], [poly([A, B, C, D]), seg(A, C), seg(B, D), seg(a1, a2), seg(b1, b2),
    seg(M, N), seg(N, Pp), seg(Pp, Q), seg(Q, M),
    dot(A), dot(B), dot(C), dot(D), dot(O), dot(M), dot(N), dot(Pp), dot(Q),
    label(A, 'A', -14, -12), label(B, 'B', 14, -12), label(C, 'C', 14, 30), label(D, 'D', -14, 30),
    label(M, 'M', 16, -12), label(Pp, 'P', -14, 30), label(N, 'N', 18, 24), label(Q, 'Q', -18, -8),
    label(O, 'O', -13, 33)])
}

await xuatTat(RA)
