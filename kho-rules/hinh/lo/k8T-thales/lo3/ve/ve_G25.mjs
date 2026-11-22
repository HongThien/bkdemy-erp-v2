// ve_G25.mjs — hình lô 3 Hình–Học 8T, trạm G25 (TCHH CĐ4 Bài 8, 10, 11, 13). Chạy: node ve_G25.mjs (từ thư mục h8t3) → hinh_G25\
// Hình đề CHỈ vẽ dữ kiện; điều phải chứng minh (thẳng hàng, đồng quy, song song) không vẽ sẵn. Hình lời giải (_lg) thêm đường / điểm phụ của lời giải.
import { P, seg, segDash, dot, label, lerp, mid, inter, foot, add, mul, vec, dist, noiTiep, circle, rightAngle, hinh, xuatTat } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const RA = join(dirname(fileURLToPath(import.meta.url)), 'hinh_G25')
const D = (ds) => ds.map(([p]) => dot(p)).join('')
const N = (ds) => ds.map(([p, t, dx, dy]) => label(p, t, dx, dy)).join('')

// ───────── Bài 8: tam giác nhọn ABC, đường cao AH, BK, CP; D, E, J, G là hình chiếu của H lên AB, AC, BK, CP ─────────
{
  const A = P(130, 20), B = P(20, 330), C = P(400, 330)
  const H = foot(A, B, C), K = foot(B, A, C), Pp = foot(C, A, B)
  const O = inter(A, H, B, K)
  const Dd = foot(H, A, B), E = foot(H, A, C), J = foot(H, B, K), G = foot(H, C, Pp)
  const goc = [rightAngle(H, A, C, 13), rightAngle(K, B, C, 13), rightAngle(Pp, C, B, 13)]
  const co = [seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(B, K), seg(C, Pp), seg(H, Dd), seg(H, E), seg(H, J), seg(H, G)]
  const diem = D([[A], [B], [C], [H], [K], [Pp], [Dd], [E], [J], [G]])
  const ten = N([[A, 'A', 0, -14], [B, 'B', -16, 28], [C, 'C', 16, 28], [H, 'H', 4, 32], [K, 'K', 20, -4], [Pp, 'P', -20, -4], [Dd, 'D', -20, 4], [E, 'E', 20, -2], [J, 'J', -4, 30], [G, 'G', 20, 6]])
  hinh('TCHH-4-8', [A, B, C], [...co, ...goc, diem, ten])
  hinh('TCHH-4-8_lg', [A, B, C], [...co, ...goc, segDash(Pp, K), diem, dot(O), ten, label(O, 'O', -20, 6)])
}

// ───────── Bài 10: hình bình hành ABCD, I bên trong, MN ∥ BC, PQ ∥ AB ─────────
{
  const A = P(90, 30), B = P(380, 30), Dd = P(30, 230), C = P(320, 230)
  const u = vec(A, B), w = vec(A, Dd), s = 0.4, t = 0.62
  const I = add(A, add(mul(u, s), mul(w, t))), M = add(A, mul(u, s)), Nn = add(Dd, mul(u, s)), Pp = add(B, mul(w, t)), Q = add(A, mul(w, t))
  const co = [seg(A, B), seg(B, C), seg(C, Dd), seg(Dd, A), seg(M, Nn), seg(Q, Pp)]
  const diem = D([[A], [B], [C], [Dd], [M], [Nn], [Pp], [Q], [I]])
  const ten = N([[A, 'A', -4, -14], [B, 'B', 14, -10], [C, 'C', 16, 26], [Dd, 'D', -14, 26], [M, 'M', 0, -14], [Nn, 'N', 0, 30], [Pp, 'P', 22, 6], [Q, 'Q', -22, 6], [I, 'I', 18, -8]])
  hinh('TCHH-4-10', [A, B, C, Dd], [...co, diem, ten])
  const K = inter(M, C, Dd, I)
  hinh('TCHH-4-10_lg', [A, B, C, Dd], [...co, seg(M, C), seg(A, Pp), seg(Dd, I), diem, dot(K), ten, label(K, 'K', 4, 26)])
}

// ───────── Bài 11: đường tròn nội tiếp tam giác ABC, tiếp điểm D ∈ BC, E ∈ CA, F ∈ AB ─────────
{
  const A = P(190, 20), B = P(30, 270), C = P(400, 270)
  const I = noiTiep(A, B, C), r = dist(I, foot(I, B, C))
  const Dd = foot(I, B, C), E = foot(I, C, A), F = foot(I, A, B)
  const co = [seg(A, B), seg(B, C), seg(C, A), circle(I, r)]
  const diem = D([[A], [B], [C], [Dd], [E], [F]])
  const ten = N([[A, 'A', 0, -14], [B, 'B', -16, 28], [C, 'C', 16, 28], [Dd, 'D', 0, 32], [E, 'E', 22, -2], [F, 'F', -22, -2]])
  hinh('TCHH-4-11', [A, B, C], [...co, diem, ten])
  const O = inter(A, Dd, B, E)
  hinh('TCHH-4-11_lg', [A, B, C], [...co, seg(A, Dd), seg(B, E), seg(C, F), diem, dot(O), ten, label(O, 'O', 14, 24)])
}

// ───────── Bài 13: tứ giác ABCD, I, J trung điểm AD, BC; G, E trọng tâm △ABC, △ABD ─────────
{
  const A = P(110, 20), B = P(330, 90), C = P(350, 260), Dd = P(30, 260)
  const I = mid(A, Dd), J = mid(B, C)
  const G = P((A.x + B.x + C.x) / 3, (A.y + B.y + C.y) / 3), E = P((A.x + B.x + Dd.x) / 3, (A.y + B.y + Dd.y) / 3)
  const co = [seg(A, B), seg(B, C), seg(C, Dd), seg(Dd, A), seg(A, J), seg(B, I)]
  const diem = D([[A], [B], [C], [Dd], [I], [J], [G], [E]])
  const ten = N([[A, 'A', 0, -14], [B, 'B', 18, -8], [C, 'C', 18, 26], [Dd, 'D', -14, 26], [I, 'I', -18, 4], [J, 'J', 20, 6], [G, 'G', 20, -6], [E, 'E', -8, -14]])
  hinh('TCHH-4-13', [A, B, C, Dd], [...co, diem, ten])
  const M = inter(Dd, G, I, J)
  const lg = [seg(Dd, G), seg(C, E), seg(I, J)]
  hinh('TCHH-4-13_a_lg', [A, B, C, Dd], [...co, ...lg, diem, dot(M), ten, label(M, 'M', 4, 28)])
  hinh('TCHH-4-13_b_lg', [A, B, C, Dd], [...co, ...lg, segDash(G, E), diem, dot(M), ten, label(M, 'M', 4, 28)])
}

await xuatTat(RA)
