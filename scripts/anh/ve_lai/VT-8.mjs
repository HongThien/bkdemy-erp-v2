// Vẽ lại hình đề — gói VT-8 (HGT vectơ, K10)
import { P, seg, dot, label, num, lerp, mid, add, vec, mul, inter, trongTam, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'
import { vecto, nhanVecto } from '../ve_vecto_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/VT-8/moi'

// T310000000371 — DB = BC/5 (D phía B ngoài đoạn BC), AE = AC/4, AH = 2AB/3
{
  const A = P(100, 0), B = P(55, 170), C = P(330, 170)
  const D = lerp(B, C, -1 / 5), E = lerp(A, C, 1 / 4), H = lerp(A, B, 2 / 3)
  hinh('T310000000371', [A, B, C, D, E], [seg(A, D), seg(A, B), seg(A, C), seg(D, C), seg(D, E), dot(H),
    label(A, 'A', -4, -14), label(B, 'B', 8, 28), label(C, 'C', 16, 22), label(D, 'D', -14, 24), label(E, 'E', 16, -6), label(H, 'H', 16, 6)])
}

// T310000000447 — tam giác đều ABC (cạnh 2, không ghi số)
{
  const B = P(0, 300), C = P(300, 300), A = P(150, 300 - 150 * Math.sqrt(3))
  console.assert(Math.abs(dist(A, B) - dist(B, C)) < 0.5)
  hinh('T310000000447', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), dot(A), dot(B), dot(C),
    label(A, 'A', 0, -14), label(B, 'B', -16, 8), label(C, 'C', 16, 8)])
}

// T310000000214 — hình bình hành ABCD tâm O (A dưới trái, B trên trái, C trên phải, D dưới phải)
{
  const A = P(0, 130), B = P(110, 0), D = P(300, 130), C = add(B, vec(A, D)), O = mid(A, C)
  hinh('T310000000214', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), dot(A), dot(B), dot(C), dot(D), dot(O),
    label(A, 'A', -14, 24), label(B, 'B', -4, -14), label(C, 'C', 14, -8), label(D, 'D', 10, 28), label(O, 'O', 4, -12)])
}

// T3100000001264 — hình bình hành ABCD tâm O (A trên trái, D trên phải, B dưới trái, C dưới phải)
{
  const A = P(70, 0), D = P(370, 0), B = P(0, 130), C = add(B, vec(A, D)), O = mid(A, C)
  hinh('T3100000001264', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), dot(A), dot(B), dot(C), dot(D), dot(O),
    label(A, 'A', -14, -10), label(B, 'B', -14, 24), label(C, 'C', 4, 28), label(D, 'D', 16, -8), label(O, 'O', 0, 26)])
}

// T310000000369 — ABCD hbh, a = AB, b = AD, O = AC∩BD, M trung điểm CD, G trọng tâm OBC
{
  const A = P(60, 0), D = P(330, 0), B = P(0, 150), C = add(B, vec(A, D)), O = mid(A, C), M = mid(C, D), G = trongTam([O, B, C])
  hinh('T310000000369', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(A, M), seg(A, G),
    vecto(A, B), vecto(A, D), dot(A), dot(B), dot(C), dot(D), dot(O), dot(M), dot(G),
    label(A, 'A', -16, -8), label(B, 'B', -8, 28), label(C, 'C', 8, 28), label(D, 'D', 18, -6), label(O, 'O', 2, -12), label(M, 'M', 20, 8), label(G, 'G', -4, 24),
    nhanVecto(mid(A, D), 'b', 0, -20), nhanVecto(mid(A, B), 'a', -22, 4)])
}

// T3100000001064 — 4 hình: điểm trên đường thẳng, đơn vị 48px; MN = −3MP đúng ở Hình 3
{
  const u = 48
  const dong = (x0, y0, ten, soDiem, viTri, cap) => {   // viTri: {tên: chỉ số}
    const pts = Array.from({ length: soDiem }, (_, i) => P(x0 + i * u, y0))
    const body = [seg(pts[0], pts[soDiem - 1]), ...pts.map(dot)]
    for (const [t, i] of Object.entries(viTri)) body.push(label(pts[i], t, 0, 26))
    body.push(num(P(x0 + (soDiem - 1) * u / 2, y0), cap, 0, 56))
    return { pts, body }
  }
  const h1 = dong(0, 0, 'h1', 6, { M: 0, P: 3, N: 5 }, 'Hình 1')
  const h2 = dong(340, 0, 'h2', 4, { N: 0, M: 1, P: 3 }, 'Hình 2')
  const h3 = dong(0, 120, 'h3', 5, { N: 0, M: 3, P: 4 }, 'Hình 3')
  const h4 = dong(340, 120, 'h4', 5, { M: 0, P: 3, N: 4 }, 'Hình 4')
  hinh('T3100000001064', [P(0, 190), ...h1.pts, ...h2.pts, ...h3.pts, ...h4.pts], [...h1.body, ...h2.body, ...h3.body, ...h4.body])
}

// T310000000456 — tứ giác ABCD (ảnh cũ chỉ có tứ giác)
{
  const A = P(30, 0), B = P(200, 25), C = P(300, 170), D = P(0, 170)
  hinh('T310000000456', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', -6, -12), label(B, 'B', 14, -6), label(C, 'C', 16, 22), label(D, 'D', -16, 22)])
}

// T310000000446 — tam giác ABC (ảnh cũ chỉ có tam giác)
{
  const B = P(0, 170), C = P(260, 170), A = P(38, 0)
  hinh('T310000000446', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), dot(A), dot(B), dot(C),
    label(A, 'A', -4, -14), label(B, 'B', -14, 24), label(C, 'C', 14, 24)])
}

await xuatTat(RA)
