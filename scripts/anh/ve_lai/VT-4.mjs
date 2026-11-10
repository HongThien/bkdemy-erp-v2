// Vẽ lại hình — gói VT-4 (HGT: Tích của véc tơ với một số, K10). Hình ĐỀ.
//   node scripts/anh/ve_lai/VT-4.mjs [<thu_muc_ra>]
import { P, seg, segDash, dot, label, mid, lerp, trongTam, hinh, xuatTat, tick, num, add } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/VT-4/moi'

// T310010201077 — tam giác ABC, G trọng tâm, I trung điểm BC; đường BG kéo tới trung điểm AC (ảnh cũ không đặt tên điểm đó)
{
  const A = P(120, 0), B = P(0, 230), C = P(330, 230)
  const I = mid(B, C), E = mid(A, C), G = trongTam([A, B, C])
  const c = trongTam([A, B, C])
  hinh('T310010201077', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(A, I), seg(B, E),
    dot(A), dot(B), dot(C), dot(I), dot(G),
    label(A, 'A', 0, -14), label(B, 'B', -18, 24), label(C, 'C', 16, 24), label(I, 'I', 0, 32), label(G, 'G', -20, -4)])
}

// T310010201071 — tam giác đều ABC, M, N trung điểm AB, AC
{
  const s = 320, A = P(s / 2, 0), B = P(0, s * Math.sqrt(3) / 2), C = P(s, s * Math.sqrt(3) / 2)
  const M = mid(A, B), N = mid(A, C)
  hinh('T310010201071', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(M, N), dot(A), dot(B), dot(C), dot(M), dot(N),
    label(A, 'A', 0, -14), label(B, 'B', -16, 24), label(C, 'C', 16, 24), label(M, 'M', -20, -4), label(N, 'N', 20, -4)])
}

// T310010102030 — tam giác ABC, D, E, F trung điểm BC, CA, AB; nối DE, EF, FD
{
  const A = P(150, 0), B = P(0, 170), C = P(360, 170)
  const D = mid(B, C), E = mid(C, A), F = mid(A, B)
  hinh('T310010102030', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(F, E), seg(F, D), seg(D, E),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
    label(A, 'A', 0, -14), label(B, 'B', -16, 24), label(C, 'C', 16, 24), label(D, 'D', 0, 32), label(E, 'E', 20, -4), label(F, 'F', -20, -4)])
}

// T310010201090 — hình bình hành ABCD, M trung điểm BC, nối AM (A dưới-trái, D dưới-phải, B trên, C trên-phải)
{
  const A = P(0, 150), D = P(280, 150), B = P(110, 40), C = add(B, P(D.x - A.x, D.y - A.y))
  C.x = B.x + (D.x - A.x); C.y = B.y + (D.y - A.y)
  const M = mid(B, C)
  hinh('T310010201090', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, M),
    dot(A), dot(B), dot(C), dot(D), dot(M),
    label(A, 'A', -18, 18), label(B, 'B', -8, -14), label(C, 'C', 16, -10), label(D, 'D', 8, 30), label(M, 'M', 0, -14)])
}

// T310010201004 — hình bình hành ABCD, O giao hai đường chéo, M trung điểm AB (ảnh cũ thiếu M — thêm theo đề)
{
  const A = P(40, 0), B = P(320, 0), D = P(0, 140), C = P(B.x + D.x - A.x, B.y + D.y - A.y)
  const O = mid(A, C), M = mid(A, B)
  hinh('T310010201004', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    dot(A), dot(B), dot(C), dot(D), dot(O), dot(M),
    label(A, 'A', -16, -6), label(B, 'B', 16, -6), label(C, 'C', 16, 24), label(D, 'D', -16, 24), label(O, 'O', 0, 26), label(M, 'M', 0, -14)])
}

// T310010201075 — đoạn PQ, E trung điểm (ảnh cũ có chữ rác "Fb", bỏ)
{
  const Pp = P(0, 0), Q = P(320, 0), E = mid(Pp, Q)
  hinh('T310010201075', [Pp, Q], [seg(Pp, Q), dot(Pp), dot(Q), dot(E),
    label(Pp, 'P', -4, -14), label(Q, 'Q', 4, -14), label(E, 'E', 0, 32)], { pad: 40, padDuoi: 40 })
}

// T310010201013 — đoạn MN, P với PN = MN/4; hai điểm chia còn lại không tên (như ảnh cũ)
{
  const M = P(0, 0), N = P(360, 0), p1 = lerp(M, N, 0.25), p2 = lerp(M, N, 0.5), Pp = lerp(M, N, 0.75)
  hinh('T310010201013', [M, N], [seg(M, N), dot(M), dot(N), dot(p1), dot(p2), dot(Pp),
    label(M, 'M', 0, 32), label(Pp, 'P', 0, 32), label(N, 'N', 0, 32)], { pad: 40, padDuoi: 40 })
}

// T310010201084 — tam giác ABC, CM trung tuyến (M trung điểm AB), D trung điểm CM
{
  const A = P(100, 0), B = P(0, 290), C = P(430, 290)
  const M = mid(A, B), D = mid(C, M)
  hinh('T310010201084', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(M, C),
    dot(A), dot(B), dot(C), dot(M), dot(D),
    label(A, 'A', 0, -14), label(B, 'B', -16, 24), label(C, 'C', 18, 22), label(M, 'M', -22, -2), label(D, 'D', 0, 30)])
}

await xuatTat(RA)
