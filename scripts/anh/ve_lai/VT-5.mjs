// Vẽ lại hình — gói VT-5 (HGT K10, tích véc tơ với một số). Hình ĐỀ.
//   node scripts/anh/ve_lai/VT-5.mjs [<thu_muc_ra>]
import { P, seg, dot, label, mid, lerp, inter, dist, trongTam, labelOut, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/VT-5/moi'

// T310010201066 — tam giác MNP, I, J, K trung điểm MP, MN, NP; nối JI, JK, IK
{
  const N = P(0, 260), Pp = P(340, 260), M = P(85, 0)
  const I = mid(M, Pp), J = mid(M, N), K = mid(N, Pp)
  hinh('T310010201066', [M, N, Pp], [seg(M, N), seg(N, Pp), seg(Pp, M), seg(J, I), seg(J, K), seg(I, K),
    dot(M), dot(N), dot(Pp), dot(I), dot(J), dot(K),
    label(M, 'M', 0, -14), label(N, 'N', -4, 32), label(Pp, 'P', 4, 32), label(K, 'K', 0, 32), label(J, 'J', -22, 8), label(I, 'I', 22, 8)])
}

// T310000000415 — hình bình hành ABCD, M trung điểm BC, nối AM
{
  const A = P(0, 130), D = P(250, 130), B = P(116, 0), C = P(B.x + (D.x - A.x), 0), M = mid(B, C)
  console.assert(Math.abs(dist(A, B) - dist(D, C)) < 0.01)
  hinh('T310000000415', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, M),
    dot(A), dot(B), dot(C), dot(D), dot(M),
    label(A, 'A', -20, 8), label(B, 'B', -8, -14), label(C, 'C', 18, -6), label(D, 'D', 4, 32), label(M, 'M', 0, -14)])
}

// Tam giác chung cho các hình chỉ có tam giác ABC (A trên-trái, B dưới-trái, C dưới-phải như ảnh cũ)
const tg = () => ({ A: P(60, 0), B: P(0, 220), C: P(340, 220) })
const dinh = (A, B, C) => [seg(A, B), seg(B, C), seg(C, A), dot(A), dot(B), dot(C),
  label(A, 'A', 0, -14), label(B, 'B', -18, 24), label(C, 'C', 18, 24)]

// T310000000460+T310000000461 — chỉ tam giác ABC (điểm M, N, K của hai câu khác nhau nên ảnh cũ không vẽ)
{ const { A, B, C } = tg(); hinh('T310000000460+T310000000461', [A, B, C], dinh(A, B, C)) }

// T310000000466+T310000000467 — chỉ tam giác ABC
{ const { A, B, C } = tg(); hinh('T310000000466+T310000000467', [A, B, C], dinh(A, B, C)) }

// T310000000443 — tam giác ABC, M trung điểm BC, N trung điểm AM, BN cắt AC tại P
{
  const { A, B, C } = tg()
  const M = mid(B, C), N = mid(A, M), Pp = inter(B, N, A, C)
  console.assert(Math.abs(dist(A, Pp) / dist(A, C) - 1 / 3) < 0.001)
  hinh('T310000000443', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(A, M), seg(B, Pp),
    dot(A), dot(B), dot(C), dot(M), dot(N), dot(Pp),
    label(A, 'A', 0, -14), label(B, 'B', -18, 24), label(C, 'C', 18, 24), label(M, 'M', 0, 32),
    label(N, 'N', 18, 4), label(Pp, 'P', 20, -6)])
}

// T3100000001054 — tam giác đều ABC, M trung điểm BC, nối AM (G′ là đáp án trong ảnh cũ ⇒ không vẽ)
{
  const a = 300, h = a * Math.sqrt(3) / 2
  const B = P(0, h), C = P(a, h), A = P(a / 2, 0), M = mid(B, C)
  hinh('T3100000001054', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(A, M),
    dot(A), dot(B), dot(C), dot(M),
    label(A, 'A', 0, -14), label(B, 'B', -18, 24), label(C, 'C', 18, 24), label(M, 'M', 0, 32)])
}

// T310000000010 — đoạn AB chia 5 phần bằng nhau, M cách A 4 phần
{
  const A = P(0, 0), B = P(350, 0), pts = [0, 1, 2, 3, 4, 5].map((i) => lerp(A, B, i / 5)), M = pts[4]
  hinh('T310000000010', [A, B], [seg(A, B), ...pts.map(dot), label(A, 'A', 0, 34), label(M, 'M', 0, 34), label(B, 'B', 0, 34)])
}

// T310000000400 — đoạn AB, C trung điểm AB, D trung điểm AC
{
  const A = P(0, 0), B = P(360, 0), C = mid(A, B), D = mid(A, C)
  hinh('T310000000400', [A, B], [seg(A, B), dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', 0, 34), label(D, 'D', 0, 34), label(C, 'C', 0, 34), label(B, 'B', 0, 34)])
}

await xuatTat(RA)
