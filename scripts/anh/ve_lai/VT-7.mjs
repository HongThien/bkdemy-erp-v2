// Vẽ lại hình ĐỀ — gói VT-7 (HGT K10: Tích của véc tơ với một số).
//   node scripts/anh/ve_lai/VT-7.mjs [<thu_muc_ra>]
import { P, seg, segDash, tick, dot, label, num, lerp, mid, trongTam, hinh, xuatTat } from '../ve_hinh_lib.mjs'
import { vecto, nhanVecto } from '../ve_vecto_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/VT-7/moi'
const luoi = (c, r, s) => {
  let o = ''
  for (let i = 0; i <= c; i++) o += `<line x1="${i * s}" y1="0" x2="${i * s}" y2="${r * s}" stroke="#bbb" stroke-width="1"/>`
  for (let j = 0; j <= r; j++) o += `<line x1="0" y1="${j * s}" x2="${c * s}" y2="${j * s}" stroke="#bbb" stroke-width="1"/>`
  return o
}

// T310000000361 — lưới 7×5, a = (2,0), b = (1,−1) theo ô, M tại nút (3,3)
{
  const s = 40, g = (i, j) => P(i * s, j * s)
  const M = g(3, 3)
  hinh('T310000000361', [g(0, 0), g(7, 5)], [luoi(7, 5, s),
    vecto(g(2, 2), g(4, 2)), vecto(g(1, 3), g(2, 2)),
    dot(M), label(M, 'M', 16, 8),
    nhanVecto(g(3, 2), 'a', 0, -10), nhanVecto(g(1, 2), 'b', -2, 20)], { pad: 20, padDuoi: 20 })
}

// T310000000378 — tứ giác ABCD, M,N trung điểm AB,CD; G trung điểm MN; A′ trọng tâm BCD
{
  const A = P(0, 0), B = P(130, -10), C = P(75, 175), D = P(-55, 120)
  const M = mid(A, B), N = mid(C, D), G = mid(M, N), A1 = trongTam([B, C, D])
  const Ac = lerp(A, G, 1)   // G nằm trên AA′ (AG = 3/4 AA′)
  console.assert(Math.abs(Math.hypot(A.x - G.x, A.y - G.y) / Math.hypot(A.x - A1.x, A.y - A1.y) - 0.75) < 0.01)
  hinh('T310000000378', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(M, N), seg(A, A1),
    dot(A), dot(B), dot(C), dot(D), dot(M), dot(N), dot(G), dot(A1),
    label(A, 'A', -16, 4), label(B, 'B', 14, -6), label(C, 'C', 16, 22), label(D, 'D', -14, 22),
    label(M, 'M', -4, -14), label(N, 'N', 0, 30), label(G, 'G', 18, -2), label(A1, 'A′', 22, 18)])
}

// T310000000475 — tam giác ABC, M ∈ AB với AM = AB/3, N ∈ tia BC với CN = 2BC (BC = 1 phần, BN = 3 phần)
{
  const B = P(0, 170), A = P(85, 0), C = P(135, 170), N = P(B.x + 3 * (C.x - B.x), 170)
  const M = lerp(A, B, 1 / 3), B1 = lerp(B, A, 1 / 3), Nm = lerp(B, N, 2 / 3)
  hinh('T310000000475', [A, B, N], [seg(A, B), seg(B, N), seg(A, C), seg(A, N),
    dot(A), dot(B), dot(C), dot(N), dot(M), dot(B1), dot(Nm),
    label(A, 'A', 0, -14), label(B, 'B', -12, 26), label(C, 'C', 0, 30), label(N, 'N', 16, 22), label(M, 'M', -20, 6)])
}

// T310000000464 — tứ giác ABCD, I, J trung điểm AB, CD
{
  const A = P(0, 150), B = P(20, 30), C = P(195, 0), D = P(305, 150)
  const I = mid(A, B), J = mid(C, D)
  hinh('T310000000464', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(I, J),
    dot(A), dot(B), dot(C), dot(D), dot(I), dot(J),
    label(A, 'A', -14, 8), label(B, 'B', -14, -4), label(C, 'C', 4, -14), label(D, 'D', 16, 8),
    label(I, 'I', -16, 6), label(J, 'J', 16, 0)])
}

// T310000000391 — trục số, A(−4) B(−2) C(−1) D(2) E(3)
{
  const u = 48, X = (v) => P(v * u, 0), L = X(-4.7), R = X(4.8)
  let b = [seg(L, R), `<path d="M ${R.x + 6} 0 L ${R.x - 8} -5 L ${R.x - 8} 5 Z" fill="#222" stroke="none"/>`]
  for (let v = -4; v <= 4; v++) b.push(seg(P(v * u, -5), P(v * u, 5)), num(X(v), String(v).replace('-', '−'), 0, 26, 20))
  for (const [t, v] of [['A', -4], ['B', -2], ['C', -1], ['D', 2], ['E', 3]]) b.push(dot(X(v)), label(X(v), t, 0, -14))
  hinh('T310000000391', [L, P(R.x + 6, 0), P(0, -34)], b, { pad: 20, padDuoi: 44 })
}

// T3100000001105 — hình bình hành ABCD, O = AC ∩ BD, M trung điểm AB
{
  const D = P(0, 150), C = P(250, 150), A = P(75, 0), B = P(A.x + C.x - D.x, 0)
  const O = mid(A, C), M = mid(A, B)
  console.assert(Math.hypot(O.x - mid(B, D).x, O.y - mid(B, D).y) < 1e-6)
  hinh('T3100000001105', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    dot(A), dot(B), dot(C), dot(D), dot(O), dot(M),
    label(A, 'A', -14, -6), label(B, 'B', 16, -6), label(C, 'C', 18, 22), label(D, 'D', -16, 22),
    label(O, 'O', 0, 28), label(M, 'M', 0, -14)])
}

// T310000000990 — tam giác ABC, I trung điểm BC
{
  const A = P(0, 215), C = P(300, 215), B = P(38, 0), I = mid(B, C)
  hinh('T310000000990', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), dot(A), dot(B), dot(C), dot(I),
    label(A, 'A', -16, 22), label(B, 'B', -10, -14), label(C, 'C', 18, 22), label(I, 'I', 4, -14)])
}

// T310000000217 — hình bình hành ABCD (A trên-trái, D trên-phải, B dưới-trái, C dưới-phải), hai đường chéo
{
  const B = P(0, 115), C = P(255, 115), A = P(78, 0), D = P(A.x + C.x - B.x, 0)
  hinh('T310000000217', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', -14, -6), label(B, 'B', -16, 22), label(C, 'C', 18, 22), label(D, 'D', 18, -6)])
}

await xuatTat(RA)
