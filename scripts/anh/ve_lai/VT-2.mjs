// Vẽ lại hình — gói VT-2 (HGT K10, Tích của véc tơ với một số). Hình đề, không có hình lời giải.
//   node scripts/anh/ve_lai/VT-2.mjs [<thu_muc_ra>]
import { P, seg, dot, label, num, lerp, mid, trongTam, labelOut, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/VT-2/moi'

// T310010201021 — M trên đoạn AB, AM = AB/4
{
  const A = P(0, 0), B = P(280, 0), M = lerp(A, B, 0.25)
  console.assert(Math.abs(dist(A, M) / dist(A, B) - 0.25) < 1e-6)
  hinh('T310010201021', [A, B], [seg(A, B), dot(A), dot(M), dot(B),
    label(A, 'A', 0, 36), label(M, 'M', 0, 36), label(B, 'B', 0, 36)])
}

// T310010201079 — hình bình hành ABCD tâm O (A,D trên; B,C dưới)
{
  const B = P(0, 130), A = P(87, 0), D = P(306, 0), C = P(B.x + (D.x - A.x), 130)
  const O = mid(A, C)
  console.assert(dist(O, mid(B, D)) < 1e-6)
  hinh('T310010201079', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    dot(A), dot(B), dot(C), dot(D), dot(O),
    label(A, 'A', -18, -6), label(D, 'D', 16, -6), label(B, 'B', -18, 30), label(C, 'C', 18, 30), label(O, 'O', 0, 28)])
}

// T310010201068 — tam giác MNP, trọng tâm G, J trung điểm NP
{
  const N = P(0, 261), M = P(87, 0), Pp = P(349, 261)
  const J = mid(N, Pp), G = trongTam([M, N, Pp])
  console.assert(Math.abs(dist(M, G) / dist(M, J) - 2 / 3) < 1e-6)
  hinh('T310010201068', [M, N, Pp], [seg(M, N), seg(N, Pp), seg(Pp, M), seg(M, J),
    dot(M), dot(N), dot(Pp), dot(J), dot(G),
    label(M, 'M', 0, -14), label(N, 'N', -6, 36), label(Pp, 'P', 8, 36), label(J, 'J', 0, 36), label(G, 'G', -20, 8)])
}

// T310010201015 — A trên đoạn IB, AI = AB/3 (I,A,B: AI=1 phần, AB=3 phần)
{
  const I = P(0, 0), B = P(280, 0), A = lerp(I, B, 0.25)
  const m1 = lerp(I, B, 0.5), m2 = lerp(I, B, 0.75)
  console.assert(Math.abs(dist(A, I) / dist(A, B) - 1 / 3) < 1e-6)
  hinh('T310010201015', [I, B], [seg(I, B), dot(I), dot(A), dot(m1), dot(m2), dot(B),
    label(I, 'I', 0, -12), label(A, 'A', 0, 36), label(B, 'B', 0, -12)])
}

// T310010201002 — hình bình hành ABCD, O = AC ∩ BD, M trung điểm AB
{
  const D = P(0, 126), A = P(62, 0), B = P(314, 0), C = P(D.x + (B.x - A.x), 126)
  const O = mid(A, C), M = mid(A, B)
  hinh('T310010201002', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    dot(A), dot(B), dot(C), dot(D), dot(O), dot(M),
    label(A, 'A', -18, -6), label(B, 'B', 18, -6), label(D, 'D', -18, 30), label(C, 'C', 18, 30), label(O, 'O', 0, 28), label(M, 'M', 0, -14)])
}

// T310010201061 — tam giác ABC, M trung điểm BC, G trọng tâm
{
  const B = P(0, 244), A = P(122, 0), C = P(367, 244)
  const M = mid(B, C), G = trongTam([A, B, C])
  hinh('T310010201061', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(A, M),
    dot(A), dot(B), dot(C), dot(M), dot(G),
    label(A, 'A', 0, -14), label(B, 'B', -14, 34), label(C, 'C', 16, 10), label(M, 'M', 0, 36), label(G, 'G', 20, 8)])
}

// T310010201063 — tam giác ABC, G trọng tâm, I trung điểm BC
{
  const B = P(0, 185), A = P(87, 0), C = P(323, 185)
  const I = mid(B, C), G = trongTam([A, B, C])
  hinh('T310010201063', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(A, I),
    dot(A), dot(B), dot(C), dot(I), dot(G),
    label(A, 'A', 0, -14), label(B, 'B', -14, 34), label(C, 'C', 16, 10), label(I, 'I', 0, 36), label(G, 'G', 20, 8)])
}

// T310010201010 — 4 hình A–D: vị trí điểm P với MN = −3·MP (đúng ở A)
{
  const u = 56, X0 = 40, dy = 78
  const hang = [
    { k: 'A.', pos: { N: 0, M: 3, P: 4 }, phu: [1, 2] },
    { k: 'B.', pos: { M: 0, P: 3, N: 5 }, phu: [1, 2, 4] },
    { k: 'C.', pos: { M: 0, P: 3, N: 4 }, phu: [1, 2] },
    { k: 'D.', pos: { N: 0, M: 1, P: 3 }, phu: [2] },
  ]
  const pts = [], body = []
  hang.forEach((h, i) => {
    const y = i * dy
    const at = (t) => P(X0 + t * u, y)
    const ts = Object.values(h.pos)
    const lo = Math.min(...ts, ...h.phu), hi = Math.max(...ts, ...h.phu)
    body.push(seg(at(lo), at(hi)), num(P(0, y), h.k, 0, 8, 24))
    pts.push(at(lo), at(hi), P(-14, y), P(-14, y - 30))
    for (const t of h.phu) body.push(dot(at(t)))
    for (const [n, t] of Object.entries(h.pos)) body.push(dot(at(t)), label(at(t), n, 0, -14))
  })
  hinh('T310010201010', pts, body)
}

await xuatTat(RA)
