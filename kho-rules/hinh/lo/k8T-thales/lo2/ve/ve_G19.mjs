// ve_G19.mjs — hình VHB2 §13 BT 198–207 (lô 2, trạm G19). Chạy: node ve_G19.mjs  (từ thư mục h8t2) ⇒ hinh_G19/
import { P, seg, segDash, tick, angleMark, rightAngle, dot, label, num, add, mul, vec, lerp, mid, foot, inter, labelOut, trongTam, hinh, xuatTat, ray, bisector, goc, lineExt } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const dots = (ps) => ps.map(dot).join('')
const OUT = process.argv[2] || 'hinh_G19'
const L = (p, t, from, d = 24) => labelOut(p, t, from, d)

// ───────── 198: tam giác đều ABC, trọng tâm G, M trong tam giác, đường MG cắt BC, AC, AB ở A′, B′, C′ ─────────
{
  const B = P(60, 280), C = P(330, 280), A = P(195, 280 - 135 * Math.sqrt(3))
  const G = trongTam([A, B, C]), M = P(G.x - 62 * Math.cos(40 * Math.PI / 180), G.y + 62 * Math.sin(40 * Math.PI / 180))
  const dir = vec(G, M)
  const far = (a, b) => inter(G, add(G, dir), a, b)
  const A1 = far(B, C), B1 = far(A, C), C1 = far(A, B)
  console.log('198 A′', A1, 'B′', B1, 'C′', C1)
  const c = trongTam([A, B, C])
  const pts = [A, B, C, A1, B1, C1]
  // đường thẳng MG kéo dài tới A′ và C′ (B′ nằm trên cạnh)
  const phia = [A1, B1, C1].map((p) => ({ p, t: (p.x - G.x) * dir.x + (p.y - G.y) * dir.y }))
  const xa = phia.reduce((m, q) => (q.t > m.t ? q : m)), gan = phia.reduce((m, q) => (q.t < m.t ? q : m))
  console.log('xa', xa.p, 'gan', gan.p)
  hinh('VHB2-198', pts, [seg(A, B), seg(B, C), seg(C, A), seg(gan.p, xa.p), dots([A, B, C, G, M, A1, B1, C1]),
    L(A, 'A', c), L(B, 'B', c), L(C, 'C', c), label(G, 'G', 18, -6), label(M, 'M', -16, -8),
    label(A1, 'A′', 14, 28), L(B1, 'B′', c, 26), L(C1, 'C′', c, 26)])
  // hình lời giải: D, D′ (và E′, F′), PQ ∥ BC qua M, K
  const D = mid(B, C), E = mid(C, A), F = mid(A, B)
  const D1 = foot(M, B, C), E1 = foot(M, C, A), F1 = foot(M, A, B)
  const Pp = inter(M, P(M.x + 100, M.y), A, B), Q = inter(M, P(M.x + 100, M.y), A, C)
  const K = inter(M, P(M.x + 100, M.y), A, D)
  hinh('VHB2-198_lg', [A, B, C, D, Pp, Q], [seg(A, B), seg(B, C), seg(C, A), segDash(A, D), seg(Pp, Q), segDash(M, D1), segDash(M, E1), segDash(M, F1),
    rightAngle(D1, B, M), rightAngle(E1, M, A), rightAngle(F1, M, B), rightAngle(D, B, A),
    dots([A, B, C, D, G, M, D1, E1, F1, Pp, Q, K]),
    L(A, 'A', c), L(B, 'B', c), L(C, 'C', c), label(D, 'D', 0, 30), label(M, 'M', 0, -16), label(G, 'G', 18, -4),
    label(D1, 'D′', 0, 30), L(E1, 'E′', M, 24), L(F1, 'F′', M, 24), L(Pp, 'P', c, 24), L(Q, 'Q', c, 24), label(K, 'K', 16, 24)])
}

// ───────── 199: tam giác ABC vuông cân tại A (AB đứng, AC ngang); D∈AB, E∈BC, F∈CA chia theo cùng tỉ số DA/DB = EB/EC = FC/FA = 1/2 ─────────
{
  const A = P(50, 330), B = P(50, 30), C = P(350, 330)
  const t = 1 / 3 // DA/AB = EB/BC = FC/CA = k/(1+k), k=1/2
  const D = lerp(A, B, t), E = lerp(B, C, t), F = lerp(C, A, t)
  const c = trongTam([A, B, C])
  const base = [seg(A, B), seg(B, C), seg(C, A), seg(A, E), seg(D, F), rightAngle(A, B, C, 18), dots([A, B, C, D, E, F]),
    label(A, 'A', -20, 30), label(B, 'B', 0, -14), label(C, 'C', 14, 30), label(D, 'D', -20, 8), label(E, 'E', 22, -6), label(F, 'F', 0, 34)]
  hinh('VHB2-199', [A, B, C], base, { pad: 46 })
  const H = foot(E, A, B)
  hinh('VHB2-199_lg', [A, B, C], [...base, segDash(E, H), rightAngle(H, A, E, 14), dot(H), label(H, 'H', -20, 8)], { pad: 46 })
}

// ───────── 203: góc xOy, A∈Ox, B∈Oy ─────────
{
  const O = P(60, 320), ox = 0, oy = 62
  const A = ray(O, ox, 300), B = ray(O, oy, 230)
  const X = ray(O, ox, 380), Y = ray(O, oy, 300)
  hinh('VHB2-203', [O, X, Y, A, B], [seg(O, X), seg(O, Y), seg(A, B), angleMark(O, X, Y, 34), dots([O, A, B]),
    label(O, 'O', -18, 28), label(A, 'A', 0, 32), label(B, 'B', -18, -4), label(X, 'x', 6, 30), label(Y, 'y', -14, -6)], { pad: 40 })
  // lời giải: phân giác Oz, C = Oz ∩ AB, D = (đường qua C ∥ Ox) ∩ Oy
  const Z = bisector(O, A, B, 330), C = inter(O, Z, A, B)
  const D = inter(C, P(C.x + 100, C.y), O, B)
  console.log('203 OD', Math.hypot(D.x - O.x, D.y - O.y).toFixed(1), 'DC', Math.hypot(D.x - C.x, D.y - C.y).toFixed(1))
  hinh('VHB2-203_lg', [O, X, Y, A, B, Z], [seg(O, X), seg(O, Y), seg(A, B), segDash(O, Z), segDash(D, C), angleMark(O, X, Z, 40), angleMark(O, Z, Y, 46), dots([O, A, B, C, D]),
    label(O, 'O', -18, 28), label(A, 'A', 0, 32), label(B, 'B', -18, -4), label(X, 'x', 6, 30), label(Y, 'y', -14, -6), label(Z, 'z', 12, -2),
    label(C, 'C', 16, -10), label(D, 'D', -20, 8), num(mid(D, C), 'a', 0, -10, 24), num(mid(O, D), 'a', -16, 4, 24)], { pad: 40 })
}

// ───────── 204: hình thang ABCD (AB ∥ CD), DE/DA = BF/BC = 1/3 ─────────
{
  const A = P(150, 40), B = P(290, 40), D = P(20, 260), C = P(400, 260)
  const E = lerp(D, A, 1 / 3), F = lerp(B, C, 1 / 3)
  const M = inter(E, F, B, D), N = inter(E, F, A, C)
  console.log('204 M,N', M, N)
  const base = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(E, F)]
  hinh('VHB2-204', [A, B, C, D], [...base, dots([A, B, C, D, E, F, M, N]),
    label(A, 'A', -10, -14), label(B, 'B', 10, -14), label(C, 'C', 14, 28), label(D, 'D', -14, 28), label(E, 'E', -20, 8), label(F, 'F', 22, 8),
    label(M, 'M', -4, -14), label(N, 'N', 8, 28)], { pad: 40 })
  // lời giải: EP ∥ AB (P∈BD), FR ∥ AB (R∈BD); EP′ ∥ AB (P′∈AC), FR′ ∥ AB (R′∈AC)
  const dh = vec(A, B)
  const ln = (X, a, b) => inter(X, add(X, dh), a, b)
  const Pp = ln(E, B, D), R = ln(F, B, D), P2 = ln(E, A, C), R2 = ln(F, A, C)
  hinh('VHB2-204_lg', [A, B, C, D], [...base, segDash(E, Pp), segDash(F, R), segDash(E, P2), segDash(F, R2), dots([A, B, C, D, E, F, M, N, Pp, R, P2, R2]),
    label(A, 'A', -10, -14), label(B, 'B', 10, -14), label(C, 'C', 14, 28), label(D, 'D', -14, 28), label(E, 'E', -20, 8), label(F, 'F', 22, 8),
    label(M, 'M', 2, -12), label(N, 'N', 10, 26), label(Pp, 'P', 14, 26), label(R, 'R', 18, 26), label(P2, 'P′', -18, -8), label(R2, 'R′', 8, -12)], { pad: 40 })
}

// ───────── 205a: tam giác ABC, A′ trên tia đối của tia CB với BA′:A′C = 3, B′∈CA với CB′:B′A = 1:3, C′ = A′B′ ∩ AB ─────────
{
  const A = P(120, 40), B = P(30, 270), C = P(290, 270)
  const A1 = lerp(B, C, 1.5) // BA′ = 3/2 BC, A′C = 1/2 BC
  const B1 = lerp(C, A, 0.25)
  const C1 = inter(A1, B1, A, B)
  console.log('205a C′', C1, 'mid AB', mid(A, B))
  const base = [seg(A, B), seg(B, C), seg(C, A), seg(B, A1), seg(A1, C1), dots([A, B, C, A1, B1, C1]),
    label(A, 'A', 0, -14), label(B, 'B', -14, 28), label(C, 'C', 4, 30), label(A1, 'A′', 8, 30), label(B1, 'B′', 22, 4), label(C1, 'C′', -22, -4)]
  hinh('VHB2-205a', [A, B, C, A1, C1], base, { pad: 40 })
  const dAB = vec(A, B)
  const K = inter(C, add(C, dAB), A1, B1)
  hinh('VHB2-205a_lg', [A, B, C, A1, C1, K], [...base, segDash(C, K), dot(K), label(K, 'K', 10, -12)], { pad: 40 })
}

// ───────── 206b: A′∈BC (trong cạnh), B′∈CA, C′∈AB ngoài cạnh (phía A); AA′, BB′, CC′ đồng quy tại O ngoài tam giác ─────────
{
  const A = P(150, 100), B = P(50, 240), C = P(300, 260), O = P(150, -50)
  const A1 = inter(O, A, B, C), B1 = inter(O, B, C, A), C1 = inter(O, C, A, B)
  console.log('206b A′', A1, 'B′', B1, 'C′', C1)
  const c = trongTam([A, B, C])
  const body = [seg(B, C), seg(C, B1), seg(B, C1), seg(B, O), seg(C, O), seg(A1, O)]
  const nhan = [label(A, 'A', 16, 18), L(B, 'B', c, 22), L(C, 'C', c, 22), label(A1, 'A′', 0, 32), label(B1, 'B′', -24, -2), label(C1, 'C′', 24, -2)]
  hinh('VHB2-206b', [A, B, C, A1, B1, C1, O], [...body, dots([A, B, C, A1, B1, C1]), ...nhan], { pad: 40 })
  const dBC = vec(B, C)
  const N = inter(A, add(A, dBC), B, B1), M = inter(A, add(A, dBC), C, C1)
  console.log('206b M, N', M, N)
  hinh('VHB2-206b_lg', [A, B, C, A1, B1, C1, O, M, N], [...body, seg(N, M), dots([A, B, C, A1, B1, C1, O, M, N]), ...nhan,
    label(O, 'O', 0, -14), label(M, 'M', 20, 20), label(N, 'N', -20, 20)], { pad: 40 })
}

await xuatTat(OUT)
