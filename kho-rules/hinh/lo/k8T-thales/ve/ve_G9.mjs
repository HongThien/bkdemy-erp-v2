// ve_G9.mjs — hình cho TCHH CĐ5 Bài 13–17 (trạm G9). Chạy: node ve_G9.mjs   → hinh_G9/
import { P, seg, segDash, tick, angleMark, rightAngle, dot, label, labelOut, lerp, mid, foot, inter, bisector, dist, goc, hinh, xuatTat, trongTam, add } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'hinh_G9')

// ghi nhãn: mỗi điểm [p, tên, from, d]; from = điểm để đẩy nhãn ra xa
const pts = (arr) => arr.map(([p]) => dot(p)).join('')
const nhan = (arr) => arr.map(([p, t, from, d]) => labelOut(p, t, from, d ?? 22)).join('')
const chk = (cond, msg) => { if (!cond) { console.error('ASSERT SAI:', msg); process.exitCode = 1 } }
const song = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) < 1e-6 * dist(a, b) * dist(c, d)
const sub = (a, b) => P(a.x - b.x, a.y - b.y)

// ============================================================ BÀI 13
{
  const S = 52
  const B = P(0, 0), C = P(8 * S, 0), A = P(6.2 * S, -3.4 * S)       // y xuống: A nằm trên (y âm)
  const Dd = mid(B, C)
  const t = dist(A, B) / (dist(A, B) + dist(A, C)); const E = lerp(B, C, t)
  chk(dist(A, B) > dist(A, C), '13: AB>AC')
  const F = foot(C, A, E)
  const G = inter(C, F, A, Dd)
  const N = lerp(A, B, dist(A, C) / dist(A, B))
  const M = mid(A, C)
  const dirAC = sub(C, A)
  const Pp = inter(F, add(F, dirAC), Dd, A), Q = inter(F, add(F, dirAC), Dd, C)
  chk(song(Dd, F, A, B), '13: DF ∥ AB'); chk(song(G, E, A, C), '13: GE ∥ AC')
  chk(Math.abs(goc(A, B, E) - goc(A, E, C)) < 1e-6, '13: AE phân giác')
  const cen = trongTam([A, B, C])
  const goc1 = angleMark(A, B, E, 38), goc2 = angleMark(A, E, C, 38)
  const base = [seg(A, B), seg(A, C), seg(B, C), seg(A, E), seg(A, Dd), seg(C, G), seg(Dd, F), seg(G, E),
    tick(B, Dd, 3), tick(Dd, C, 3), goc1, goc2, rightAngle(F, A, C, 12)]
  // hình đề
  hinh('TCHH-5-13', [A, B, C, G], [...base, pts([[A], [B], [C], [Dd], [E], [F], [G]]),
    nhan([[A, 'A', cen, 22], [B, 'B', cen, 24], [C, 'C', cen, 24], [Dd, 'D', A, 26], [E, 'E', A, 26], [F, 'F', P(F.x, F.y + 30), 24], [G, 'G', C, 22]])])
  // ý a: thêm N trên AB (AN = AC), đoạn CN
  hinh('TCHH-5-13_a_lg', [A, B, C, N], [seg(A, B), seg(A, C), seg(B, C), seg(A, E), seg(C, N), seg(Dd, F), seg(A, Dd),
    tick(B, Dd, 3), tick(Dd, C, 3), tick(A, N, 1, 0.5), tick(A, C, 1, 0.5), tick(C, F, 2), tick(F, N, 2), goc1, goc2, rightAngle(F, A, C, 12),
    pts([[A], [B], [C], [Dd], [E], [F], [N]]),
    nhan([[A, 'A', cen, 22], [B, 'B', cen, 24], [C, 'C', cen, 24], [Dd, 'D', A, 26], [E, 'E', A, 26], [F, 'F', P(F.x, F.y + 30), 24], [N, 'N', C, 22]])])
  // ý b: thêm M (trung điểm AC), đường qua F song song AC (P, Q), tam giác ADC
  hinh('TCHH-5-13_b_lg', [A, B, C, G, Pp], [seg(A, B), seg(A, C), seg(B, C), seg(A, E), seg(A, Dd), seg(C, G), seg(Dd, M), seg(G, E), seg(Pp, Q),
    tick(B, Dd, 3), tick(Dd, C, 3, 0.82), tick(A, M, 1), tick(M, C, 1),
    pts([[A], [B], [C], [Dd], [E], [F], [G], [M], [Pp], [Q]]),
    nhan([[A, 'A', cen, 22], [B, 'B', cen, 24], [C, 'C', cen, 24], [Dd, 'D', A, 26], [E, 'E', A, 26], [F, 'F', P(F.x, F.y + 30), 24], [G, 'G', C, 22], [M, 'M', B, 22], [Pp, 'P', C, 24], [Q, 'Q', A, 24]])])
  // ý c: thêm giao điểm K của DM và GE
  const K = inter(Dd, M, G, E)
  hinh('TCHH-5-13_c_lg', [A, B, C, G], [seg(A, C), seg(B, C), seg(A, B), seg(A, Dd), seg(Dd, M), seg(G, E), seg(C, G), seg(A, E),
    tick(A, M, 1), tick(M, C, 1),
    pts([[A], [B], [C], [Dd], [E], [F], [G], [M], [K]]),
    nhan([[A, 'A', cen, 22], [B, 'B', cen, 24], [C, 'C', cen, 24], [Dd, 'D', A, 26], [E, 'E', A, 26], [F, 'F', P(F.x, F.y + 30), 24], [G, 'G', C, 22], [M, 'M', B, 22], [K, 'K', C, 20]])])
}

// ============================================================ BÀI 14
{
  const S = 38
  const m = (x, y) => P(x * S, -y * S)
  const B = m(0, 0), C = m(8, 0), A = m(2, 5), D = m(5, 0)
  const F = lerp(B, A, 1.5)
  const E = inter(D, F, A, C)
  const H = add(B, sub(E, D))
  const I = inter(F, add(F, sub(C, B)), H, A)
  chk(Math.abs(dist(F, I) - dist(D, C)) < 1e-6, '14: FI = DC (dựng đúng)')
  chk(song(B, D, E, H) && song(B, H, D, E), '14: BDEH hình bình hành')
  const K = inter(F, I, A, C), M = inter(A, B, E, H)
  const cen = trongTam([A, B, C])
  const g = [seg(A, B), seg(B, C), seg(A, C), seg(F, A), seg(F, D), seg(B, H), seg(H, E), seg(F, I), seg(H, I)]
  hinh('TCHH-5-14', [B, C, F, H, I], [...g, pts([[A], [B], [C], [D], [E], [F], [H], [I]]),
    nhan([[A, 'A', P(cen.x, cen.y + 60), 24], [B, 'B', cen, 24], [C, 'C', cen, 24], [D, 'D', E, 26], [E, 'E', B, 24], [F, 'F', D, 22], [H, 'H', E, 24], [I, 'I', H, 22]])])
  hinh('TCHH-5-14_lg', [B, C, F, H, I, K, M], [...g, segDash(F, K), seg(K, A), segDash(M, E),
    pts([[A], [B], [C], [D], [E], [F], [H], [I], [K], [M]]),
    nhan([[A, 'A', P(cen.x, cen.y + 60), 24], [B, 'B', cen, 24], [C, 'C', cen, 24], [D, 'D', E, 26], [E, 'E', B, 24], [F, 'F', D, 22], [H, 'H', E, 24], [I, 'I', H, 22], [K, 'K', B, 22], [M, 'M', C, 24]])])
}

// ============================================================ BÀI 15 (DE_SAU — vẫn vẽ hình)
{
  const L = 105, s = 1.38, th = 32, ph0 = 212
  const toa = (k) => { const r = L * Math.pow(s, k), a = (ph0 + k * th) * Math.PI / 180; return P(r * Math.cos(a), -r * Math.sin(a)) }
  const A = P(0, 0), B = toa(0), C = toa(1), D = toa(2), E = toa(3)
  const Mm = inter(B, D, C, E)
  const ang = (v, p, q) => goc(v, p, q)
  chk(Math.abs(ang(A, B, C) - th) < 1e-6 && Math.abs(ang(A, C, D) - th) < 1e-6 && Math.abs(ang(A, D, E) - th) < 1e-6, '15: góc ở A')
  chk(Math.abs(ang(B, A, C) - ang(C, A, D)) < 1e-6 && Math.abs(ang(C, A, D) - ang(D, A, E)) < 1e-6, '15: ABC=ACD=ADE')
  // lồi?
  const crs = (a, b, c) => (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x)
  const v = [A, B, C, D, E]; const sg = v.map((_, i) => Math.sign(crs(v[i], v[(i + 1) % 5], v[(i + 2) % 5])))
  chk(sg.every((x) => x === sg[0]), '15: ngũ giác lồi')
  const cen = trongTam(v)
  hinh('TCHH-5-15', [A, B, C, D, E], [seg(A, B), seg(B, C), seg(C, D), seg(D, E), seg(E, A), seg(B, D), seg(C, E), seg(A, Mm),
    angleMark(A, B, C, 30), angleMark(A, C, D, 40), angleMark(A, D, E, 30),
    angleMark(B, A, C, 24, 2), angleMark(C, A, D, 24, 2), angleMark(D, A, E, 24, 2),
    pts([[A], [B], [C], [D], [E], [Mm]]),
    nhan([[A, 'A', cen, 24], [B, 'B', cen, 24], [C, 'C', cen, 24], [D, 'D', cen, 24], [E, 'E', cen, 24], [Mm, 'M', P(Mm.x - 25, Mm.y + 25), 26]])])
}

// ============================================================ BÀI 16
{
  const S = 50
  const m = (x, y) => P(x * S, -y * S)
  const B = m(0, 0), C = m(8, 0), A = m(2.4, 5.6)
  const Dd = mid(A, C), E = mid(A, B)
  const O = inter(B, Dd, C, E)
  const M = lerp(B, C, 0.37)
  const G = inter(M, add(M, sub(Dd, B)), A, C), H = inter(M, add(M, sub(E, C)), A, B)
  chk(song(M, G, B, Dd) && song(M, H, C, E), '16: MG∥BD, MH∥CE')
  const N = inter(H, M, B, Dd), Pp = inter(G, M, C, E), I = inter(H, G, B, Dd), K = inter(H, G, C, E)
  const J = mid(H, G), L = mid(N, Pp)
  const cen = trongTam([A, B, C])
  const g = [seg(A, B), seg(B, C), seg(C, A), seg(B, Dd), seg(C, E), seg(M, G), seg(M, H), seg(H, G), tick(A, Dd, 1), tick(Dd, C, 1), tick(A, E, 2), tick(E, B, 2)]
  const base = [[A], [B], [C], [Dd], [E], [M], [G], [H]]
  const lab = [[A, 'A', cen, 22], [B, 'B', cen, 24], [C, 'C', cen, 24], [Dd, 'D', B, 22], [E, 'E', C, 22], [M, 'M', A, 26], [G, 'G', B, 22], [H, 'H', C, 22]]
  hinh('TCHH-5-16', [A, B, C], [...g, pts(base), nhan(lab)])
  hinh('TCHH-5-16_a_lg', [A, B, C], [...g, pts([...base, [O], [N], [Pp], [I], [K]]),
    nhan([...lab, [O, 'O', P(O.x + 25, O.y + 25), 18], [N, 'N', A, 20], [Pp, 'P', A, 20], [I, 'I', C, 18], [K, 'K', B, 18]])])
  hinh('TCHH-5-16_b_lg', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(B, Dd), seg(C, E), seg(M, G), seg(M, H), seg(H, G), seg(M, J), seg(N, Pp),
    pts([...base, [O], [N], [Pp], [J], [L]]),
    nhan([...lab, [O, 'O', P(O.x + 25, O.y + 25), 18], [N, 'N', A, 20], [Pp, 'P', A, 20], [J, 'J', P(J.x, J.y + 30), 20], [L, 'L', P(L.x, L.y - 30), 20]])])
}

// ============================================================ BÀI 17
{
  const S = 1
  // trục OC, OD (màn hình, y xuống); OA = k·OC, OB = k·OD, k = 1/2; P = p·OC, N = n·OD, p + n = 1/2
  const O = P(0, 0), k = 0.5, c1 = P(196, 102), d1 = P(-150, 117)
  const C = add(O, c1), D = add(O, d1)
  const A = P(-k * c1.x, -k * c1.y), B = P(-k * d1.x, -k * d1.y)
  const p = 0.17, n = 0.33
  const Pp = P(p * c1.x, p * c1.y), N = P(n * d1.x, n * d1.y)
  const M = P(2 * N.x - Pp.x, 2 * N.y - Pp.y), Q = P(2 * Pp.x - N.x, 2 * Pp.y - N.y)
  chk(song(A, B, D, C), '17: AB ∥ CD'); chk(dist(C, D) > 1.99 * dist(A, B) && dist(C, D) < 2.01 * dist(A, B), '17: CD = 2AB (dựng)')
  chk(Math.abs((Q.x - M.x) * (Pp.y - M.y) - (Q.y - M.y) * (Pp.x - M.x)) < 1e-6, '17: M,N,P,Q thẳng hàng')
  chk(Math.abs(dist(M, N) - dist(N, Pp)) < 1e-6 && Math.abs(dist(N, Pp) - dist(Pp, Q)) < 1e-6, '17: MN=NP=PQ')
  const cen = trongTam([A, B, C, D])
  const g = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(M, Q), tick(M, N, 1), tick(N, Pp, 1), tick(Pp, Q, 1)]
  hinh('TCHH-5-17', [A, B, C, D, M, Q], [...g, pts([[A], [B], [C], [D], [M], [N], [Pp], [Q]]),
    nhan([[A, 'A', cen, 22], [B, 'B', cen, 22], [C, 'C', cen, 24], [D, 'D', cen, 24], [M, 'M', P(M.x + 40, M.y + 40), 22], [N, 'N', P(N.x + 25, N.y - 25), 22], [Pp, 'P', P(Pp.x - 20, Pp.y - 25), 22], [Q, 'Q', P(Q.x - 40, Q.y + 40), 22]])])
  // lời giải: thêm O, J (qua M song song AC cắt BD), K (qua Q song song BD cắt AC)
  const J = P(2 * n * d1.x, 2 * n * d1.y), K = P(2 * p * c1.x, 2 * p * c1.y)
  chk(song(M, J, A, C) && song(Q, K, B, D), '17: MJ∥AC, QK∥BD')
  hinh('TCHH-5-17_lg', [A, B, C, D, M, Q], [...g, segDash(M, J), segDash(Q, K),
    pts([[A], [B], [C], [D], [M], [N], [Pp], [Q], [O], [J], [K]]),
    nhan([[A, 'A', cen, 22], [B, 'B', cen, 22], [C, 'C', cen, 24], [D, 'D', cen, 24], [M, 'M', P(M.x + 40, M.y + 40), 22], [N, 'N', P(N.x + 20, N.y - 40), 22], [Pp, 'P', P(Pp.x + 20, Pp.y + 30), 22], [Q, 'Q', P(Q.x - 40, Q.y + 40), 22], [O, 'O', P(O.x + 30, O.y + 10), 22], [J, 'J', P(J.x - 30, J.y - 20), 22], [K, 'K', P(K.x - 30, K.y - 30), 22]])])
}

await xuatTat(DIR)
