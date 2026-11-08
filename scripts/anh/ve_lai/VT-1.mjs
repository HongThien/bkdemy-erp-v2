// Vẽ lại hình — gói VT-1 (HGT K10, Tích của véc tơ với một số): hình ĐỀ.
//   node scripts/anh/ve_lai/VT-1.mjs [<thu_muc_ra>]
import { P, seg, tick, rightAngle, lerp, mid, dot, label, hinh, xuatTat, goc, trongTam, labelOut, dist } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/VT-1/moi'

// T310010201083 — tam giác ABC (đề chỉ cho tam giác; M là ẩn nên KHÔNG vẽ M, I)
{
  const B = P(0, 150), C = P(330, 150), A = P(55, 0), G = trongTam([A, B, C])
  hinh('T310010201083', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), dot(A), dot(B), dot(C),
    label(A, 'A', 0, -14), label(B, 'B', -8, 32), label(C, 'C', 8, 32)])
}

// T310010201026 — đoạn AB, M thuộc AB, AM = AB/4 (ảnh cũ có 5 chấm chia 4 phần, chỉ ghi A, M, B)
{
  const A = P(0, 0), B = P(360, 0), M = lerp(A, B, 1 / 4)
  console.assert(Math.abs(dist(A, M) / dist(A, B) - 0.25) < 1e-6)
  hinh('T310010201026', [A, B], [seg(A, B), dot(A), dot(B), dot(M), dot(lerp(A, B, 0.5)), dot(lerp(A, B, 0.75)),
    label(A, 'A', -4, -14), label(B, 'B', 4, -14), label(M, 'M', 0, 34)])
}

// T310010201076 — hình chữ nhật ABCD (B trên trái, C trên phải, A dưới trái, D dưới phải), I trung điểm BC, K trung điểm CD
{
  const A = P(0, 200), B = P(0, 0), C = P(340, 0), D = P(340, 200)
  const I = mid(B, C), K = mid(C, D)
  hinh('T310010201076', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, I), seg(A, C), seg(A, K),
    dot(A), dot(B), dot(C), dot(D), dot(I), dot(K),
    label(B, 'B', -16, -10), label(C, 'C', 16, -10), label(D, 'D', 16, 32), label(A, 'A', -16, 32),
    label(I, 'I', 0, -14), label(K, 'K', 20, 8)])
}

// T310010201027 — A, D, C, B thẳng hàng; C trung điểm AB, D trung điểm AC (AD : DC : CB = 1 : 1 : 2)
{
  const A = P(0, 0), B = P(360, 0), C = mid(A, B), D = mid(A, C)
  hinh('T310010201027', [A, B], [seg(A, B), dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', 0, 34), label(D, 'D', 0, 34), label(C, 'C', 0, 34), label(B, 'B', 0, 34)])
}

// T310010102020 — tam giác ABC, M, N, P trung điểm BC, CA, AB; nối PN, PM, MN
{
  const B = P(0, 200), C = P(340, 200), A = P(95, 0)
  const M = mid(B, C), N = mid(C, A), Pp = mid(A, B)
  hinh('T310010102020', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(Pp, N), seg(Pp, M), seg(M, N),
    dot(A), dot(B), dot(C), dot(M), dot(N), dot(Pp),
    label(A, 'A', 0, -14), label(B, 'B', -12, 32), label(C, 'C', 12, 32), label(M, 'M', 0, 32),
    label(N, 'N', 22, -8), label(Pp, 'P', -22, -6)])
}

// T310010201080 — tam giác ABC đều, H trung điểm BC, E trung điểm AH; nối AH, EC; HB = HC (gạch)
{
  const s = 300, B = P(0, 260), C = P(s, 260), A = P(s / 2, 260 - s * Math.sqrt(3) / 2)
  const H = mid(B, C), E = mid(A, H)
  console.assert(Math.abs(goc(A, B, C) - 60) < 0.5 && Math.abs(dist(A, B) - dist(B, C)) < 1e-6)
  hinh('T310010201080', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(E, C),
    tick(B, H, 1), tick(H, C, 1), dot(A), dot(B), dot(C), dot(H), dot(E),
    label(A, 'A', 0, -14), label(B, 'B', -12, 32), label(C, 'C', 12, 32), label(H, 'H', 0, 36), label(E, 'E', -20, 8)])
}

// T310010201067 — tam giác MNP, G trọng tâm, J trung điểm NP; nối MJ (ảnh cũ: M trên, N trái, P phải)
{
  const N = P(0, 280), Pp = P(300, 280), M = P(92, 0)
  const J = mid(N, Pp), G = trongTam([M, N, Pp])
  hinh('T310010201067', [M, N, Pp], [seg(M, N), seg(N, Pp), seg(Pp, M), seg(M, J), dot(M), dot(N), dot(Pp), dot(J), dot(G),
    label(M, 'M', 0, -14), label(N, 'N', -12, 32), label(Pp, 'P', 12, 32), label(J, 'J', 0, 34), label(G, 'G', -20, 8)])
}

await xuatTat(RA)
