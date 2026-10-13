// Vẽ lại hình — gói BT-MH059-1 (MH.059 Tam giác vuông — điểm bất kì thuộc cạnh huyền, Hình 8 · Luyện · bài toán).
//   node scripts/anh/ve_lai/BT-MH059-1.mjs [<thu_muc_ra>]
import { P, seg, segDash, rightAngle, dot, label, hinh, xuatTat, foot, lerp, mid, doiXung, goc, dist } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH059-1/moi'
const ok = (v, d, msg) => console.assert(Math.abs(v - d) < 0.5, `${msg}: ${v} ≠ ${d}`)

// Bộ điểm gốc chung cho cả chuỗi: ABC vuông tại A (AB < AC, không cân), M ∈ BC (không ở giữa), MD ⊥ AB, ME ⊥ AC.
const A = P(0, 0), B = P(0, -170), C = P(260, 0)
const M = lerp(B, C, 0.3)
const D = foot(M, A, B), E = foot(M, A, C)
ok(goc(A, B, C), 90, 'A vuông'); ok(goc(D, M, A), 90, 'MD ⊥ AB'); ok(goc(E, M, A), 90, 'ME ⊥ AC')
console.assert(Math.abs(dist(A, D) - dist(A, E)) > 20, 'không để thành hình vuông')
const I = mid(D, E)
const tamGiac = [seg(A, B), seg(B, C), seg(A, C), seg(M, D), seg(M, E), rightAngle(A, B, C, 14), rightAngle(D, M, A, 12), rightAngle(E, M, C, 12)]
const nhanChung = [label(B, 'B', 0, -12), label(A, 'A', -16, 22), label(C, 'C', 18, 8), label(M, 'M', 14, -12), label(D, 'D', -16, -10)]

// BT.08.059.01 — Tứ giác ADME là hình gì? (đề có thêm I là trung điểm DE; ảnh cũ chưa vẽ DE, I)
hinh('BT.08.059.01', [A, B, C], [...tamGiac, seg(D, E),
  dot(A), dot(B), dot(C), dot(M), dot(D), dot(E), dot(I),
  ...nhanChung, label(E, 'E', 0, 32), label(I, 'I', 16, 6)])

// BT.08.059.02 — A, I, M thẳng hàng (AM nét đứt như ảnh cũ)
hinh('BT.08.059.02', [A, B, C], [...tamGiac, seg(D, E), segDash(A, M),
  dot(A), dot(B), dot(C), dot(M), dot(D), dot(E), dot(I),
  ...nhanChung, label(E, 'E', 0, 32), label(I, 'I', 16, 6)])

// BT.08.059.03 — P trên tia đối của tia DM (DP = DM), Q trên tia đối của tia EM (EQ = EM)
{
  const Pp = doiXung(M, D), Q = doiXung(M, E)
  ok(dist(D, Pp), dist(D, M), 'DP = DM'); ok(dist(E, Q), dist(E, M), 'EQ = EM')
  ok(goc(A, Pp, Q), 180, 'A, P, Q thẳng hàng (kiểm bằng dựng)')
  hinh('BT.08.059.03', [A, B, C, Pp, Q], [...tamGiac, seg(Pp, D), seg(M, Q), seg(Pp, A), seg(A, Q), seg(D, E), segDash(A, M),
    dot(A), dot(B), dot(C), dot(M), dot(D), dot(E), dot(I), dot(Pp), dot(Q),
    label(B, 'B', 0, -12), label(A, 'A', -16, 22), label(C, 'C', 18, 8), label(M, 'M', 14, -12), label(D, 'D', -16, -10),
    label(E, 'E', 20, 22), label(I, 'I', 16, 6), label(Pp, 'P', -4, -12), label(Q, 'Q', 18, 20)])
}

await xuatTat(RA)
