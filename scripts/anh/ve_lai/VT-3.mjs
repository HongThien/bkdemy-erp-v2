// Vẽ lại hình ĐỀ — gói VT-3 (HGT K10, Tích của véc tơ với một số)
//   node scripts/anh/ve_lai/VT-3.mjs [<thu_muc_ra>]
import { P, seg, mid, dot, label, num, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/VT-3/moi'

// Hình bình hành ABCD: A, B ở trên; D = A + (dx,dy), C = B + (dx,dy)
const hbh = (w, dx, dy) => { const A = P(0, 0), B = P(w, 0), D = P(dx, dy), C = P(w + dx, dy); return { A, B, C, D, O: mid(A, C) } }

// T310010102028 — M, N, P trung điểm AB, BC, CA; vẽ MP, MN, NP
{
  const A = P(150, 0), B = P(0, 160), C = P(310, 160)
  const M = mid(A, B), N = mid(B, C), Pp = mid(C, A)
  hinh('T310010102028', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(M, Pp), seg(M, N), seg(N, Pp),
    dot(A), dot(B), dot(C), dot(M), dot(N), dot(Pp),
    label(A, 'A', 4, -12), label(B, 'B', -10, 24), label(C, 'C', 12, 22), label(M, 'M', -18, 4), label(N, 'N', 0, 28), label(Pp, 'P', 20, 2)])
}

// T310010102047 — hình bình hành ABCD tâm O
{
  const { A, B, C, D, O } = hbh(300, -97, 167)
  hinh('T310010102047', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    dot(A), dot(B), dot(C), dot(D), dot(O),
    label(A, 'A', -4, -14), label(B, 'B', 16, -6), label(C, 'C', 10, 28), label(D, 'D', -14, 24), label(O, 'O', 2, 26)])
}

// T310010201070 — hình bình hành ABCD tâm O (đề nhắc điểm M nhưng không định nghĩa; ảnh cũ không có M)
{
  const { A, B, C, D, O } = hbh(300, -97, 167)
  hinh('T310010201070', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    dot(A), dot(B), dot(C), dot(D), dot(O),
    label(A, 'A', -4, -14), label(B, 'B', 16, -6), label(C, 'C', 10, 28), label(D, 'D', -14, 24), label(O, 'O', 2, 26)])
}

// T310010201016 — trục số, A=-4, B=-2, C=-1, D=2, E=3
{
  const u = 46, X = (v) => P(v * u, 0)
  const L = X(-4.7), R = X(4.7)
  const body = [seg(L, R), seg(R, P(R.x - 10, -5)), seg(R, P(R.x - 10, 5))]
  for (let v = -4; v <= 4; v++) body.push(seg(P(v * u, -4), P(v * u, 4)), num(X(v), String(v), 0, 24, 18))
  for (const [t, v] of [['A', -4], ['B', -2], ['C', -1], ['D', 2], ['E', 3]]) body.push(dot(X(v)), label(X(v), t, 0, -12))
  hinh('T310010201016', [L, R, P(0, 30), P(0, -30)], body, { pad: 30, padDuoi: 40 })
}

// T310010201078 — tam giác ABC, I trung điểm BC
{
  const B = P(0, 0), C = P(310, 0), A = P(120, -150), I = mid(B, C)
  hinh('T310010201078', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), dot(A), dot(B), dot(C), dot(I),
    label(A, 'A', 0, -14), label(B, 'B', -14, 26), label(C, 'C', 14, 26), label(I, 'I', 0, 30)])
}

// T310010201081 — hình vuông ABCD cạnh a, tâm O, M trung điểm AB, E sao cho OBEA là hình bình hành
// (ảnh cũ ghi nhãn M tại tâm — vênh với đề; vẽ theo đề: M trung điểm AB)
{
  const s = 170, A = P(0, 0), B = P(s, 0), C = P(s, s), D = P(0, s), O = mid(A, C), M = mid(A, B)
  const E = P(A.x + B.x - O.x, A.y + B.y - O.y)
  hinh('T310010201081', [A, B, C, D, E], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    seg(A, E), seg(E, B), seg(E, O),
    dot(A), dot(B), dot(C), dot(D), dot(O), dot(M), dot(E),
    label(E, 'E', -18, -10), label(A, 'A', -20, 6), label(B, 'B', 20, 6), label(C, 'C', 20, 26), label(D, 'D', -20, 26),
    label(M, 'M', 20, 26), label(O, 'O', 30, 9)])
}

// T310010201003 — hình bình hành ABCD, O = AC ∩ BD, M trung điểm AB (ảnh cũ thiếu M — thêm cho đủ đề)
{
  const { A, B, C, D, O } = hbh(300, -97, 167)
  const M = mid(A, B)
  hinh('T310010201003', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    dot(A), dot(B), dot(C), dot(D), dot(O), dot(M),
    label(A, 'A', -4, -14), label(B, 'B', 16, -6), label(C, 'C', 10, 28), label(D, 'D', -14, 24), label(O, 'O', 2, 26), label(M, 'M', 0, -14)])
}

// T310010201087 — tam giác ABC, I trung điểm AC, kẻ BI (M là đáp án nên KHÔNG vẽ)
{
  const B = P(0, 0), C = P(300, -4), A = P(100, -140), I = mid(A, C)
  hinh('T310010201087', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(B, I), dot(A), dot(B), dot(C), dot(I),
    label(A, 'A', 0, -14), label(B, 'B', -16, 20), label(C, 'C', 16, 22), label(I, 'I', 20, -6)])
}

await xuatTat(RA)
