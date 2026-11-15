// ve_G12.mjs — hình đề + hình lời giải TCHH-3.II.10 … 18 (nhóm G12, lô 2). Chạy: node ve_G12.mjs (từ thư mục h8t2)
import { P, seg, segDash, tick, angleMark, rightAngle, dot, label, labelOut, mid, lerp, foot, inter, goc, dist, trongTam, add, hinh, xuatTat } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/cf0b21d3-a89a-437b-ae80-9b607bdf58bb/scratchpad/h8t2/hinh_G12'
const dots = (...ps) => ps.map(dot).join('')
const near = (a, b, e = 0.5) => console.assert(Math.abs(a - b) < e, 'sai dữ kiện', a, b)
const parOK = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) / (dist(a, b) * dist(c, d)) < 1e-6
const vecSub = (a, b) => P(a.x - b.x, a.y - b.y)
const dir = (p, a, b) => P(p.x + (b.x - a.x), p.y + (b.y - a.y))            // p + (b − a): hướng a→b đặt tại p
const parInter = (p, a, b, c, e) => inter(p, dir(p, a, b), c, e)             // qua p ∥ ab, cắt đường ce
const chanPG = (v, p, q) => lerp(p, q, dist(v, p) / (dist(v, p) + dist(v, q)))   // chân phân giác từ v xuống pq
const NP = { pad: 42, padDuoi: 50 }
const lab = (p, t, from, d = 22) => labelOut(p, t, from, d)

// ───── 10: ABC, trung tuyến AM; MD, ME là phân giác của ∠AMB, ∠AMC ─────
{
  const A = P(150, 40), B = P(30, 300), C = P(400, 300), M = mid(B, C)
  const D = chanPG(M, A, B), E = chanPG(M, A, C)
  near(goc(M, A, D), goc(M, D, B)); near(goc(M, A, E), goc(M, E, C))
  const g = trongTam([A, B, C])
  hinh('TCHH-3-II-10', [A, B, C, M, D, E], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, M), seg(M, D), seg(M, E), seg(D, E),
    tick(B, M, 1, 0.5), tick(M, C, 1, 0.5),
    angleMark(M, A, D, 30, 1), angleMark(M, D, B, 30, 1), angleMark(M, A, E, 38, 2), angleMark(M, E, C, 38, 2),
    dots(A, B, C, M, D, E),
    lab(A, 'A', g, 22), lab(B, 'B', g, 22), lab(C, 'C', g, 22), label(M, 'M', 0, 30), lab(D, 'D', g, 20), lab(E, 'E', g, 20),
  ], NP)
}

// ───── 11: AB < AC, phân giác BD, CE; K = (đường qua D ∥ BC) ∩ AB ─────
{
  const B = P(40, 300), C = P(420, 300), A = P(120, 50)
  console.assert(dist(A, B) < dist(A, C))
  const D = chanPG(B, A, C), E = chanPG(C, A, B), K = parInter(D, B, C, A, B), I = inter(B, D, C, E)
  near(goc(B, A, D), goc(B, D, C)); near(goc(C, A, E), goc(C, E, B)); console.assert(parOK(D, K, B, C))
  const g = trongTam([A, B, C])
  const goc3 = [
    angleMark(B, A, D, 30, 1), angleMark(B, D, C, 38, 1), angleMark(C, A, E, 34, 2), angleMark(C, E, B, 44, 2),
  ].join('')
  const nhan = [lab(A, 'A', g, 22), lab(B, 'B', g, 22), lab(C, 'C', g, 22), lab(D, 'D', g, 20), lab(E, 'E', g, 20)]
  const co = [seg(A, B), seg(B, C), seg(C, A), seg(B, D), seg(C, E)]
  hinh('TCHH-3-II-11', [A, B, C, D, E], [...co, goc3, dots(A, B, C, D, E), ...nhan], NP)
  hinh('TCHH-3-II-11_a_lg', [A, B, C, D, E, K], [...co, seg(D, K), goc3, dots(A, B, C, D, E, K), ...nhan, lab(K, 'K', g, 20)], NP)
  hinh('TCHH-3-II-11_b_lg', [A, B, C, D, E, K, I], [...co, seg(D, K), seg(D, E), goc3, dots(A, B, C, D, E, K, I), ...nhan, lab(K, 'K', g, 20), label(I, 'I', 8, 26)], NP)
}

// ───── 12: ba phân giác AD, BE, CF; ý b: CH ∥ AD, H ∈ BA ─────
{
  const B = P(30, 250), C = P(330, 250), A = P(230, 110)
  const D = chanPG(A, B, C), E = chanPG(B, C, A), F = chanPG(C, A, B)
  const g = trongTam([A, B, C])
  const H = parInter(C, A, D, A, B)
  console.assert(parOK(C, H, A, D))
  const co = [seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(B, E), seg(C, F)]
  const mk = [angleMark(A, B, D, 40, 1), angleMark(A, D, C, 48, 1), angleMark(B, C, E, 40, 2), angleMark(B, E, A, 52, 2), angleMark(C, A, F, 50, 3), angleMark(C, F, B, 60, 3)].join('')
  const nhan = [lab(A, 'A', g, 22), lab(B, 'B', g, 22), lab(C, 'C', g, 22), lab(D, 'D', g, 20), lab(E, 'E', g, 20), lab(F, 'F', g, 20)]
  hinh('TCHH-3-II-12', [A, B, C, D, E, F], [...co, mk, dots(A, B, C, D, E, F), ...nhan], NP)
  const mk2 = [angleMark(A, B, D, 30, 1), angleMark(A, D, C, 30, 1)].join('')
  hinh('TCHH-3-II-12_b_lg', [A, B, C, D, H], [seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(A, H), seg(C, H), mk2, dots(A, B, C, D, H),
    lab(A, 'A', g, 22), lab(B, 'B', g, 22), lab(C, 'C', g, 22), lab(D, 'D', g, 20), label(H, 'H', 18, 0)], NP)
}

// ───── 13: tứ giác lồi ABCD; AE ∥ BC (E ∈ BD), BG ∥ AD (G ∈ AC) ─────
{
  const D = P(40, 300), C = P(420, 300), A = P(120, 60), B = P(350, 120)
  const O = inter(A, C, B, D)
  const E = parInter(A, B, C, B, D), G = parInter(B, A, D, A, C)
  console.assert(parOK(A, E, B, C) && parOK(B, G, A, D))
  const g = trongTam([A, B, C, D])
  hinh('TCHH-3-II-13', [A, B, C, D, O, E, G], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(A, E), seg(B, G), seg(E, G),
    dots(A, B, C, D, O, E, G),
    lab(A, 'A', g, 22), lab(B, 'B', g, 22), lab(C, 'C', g, 22), lab(D, 'D', g, 22), label(O, 'O', 4, -14), label(E, 'E', -16, 24), label(G, 'G', 18, 24),
  ], NP)
  // ý b: AB ∥ CD
  const A2 = P(130, 60), B2 = P(300, 60), D2 = P(40, 300), C2 = P(440, 300)
  const O2 = inter(A2, C2, B2, D2)
  const E2 = parInter(A2, B2, C2, B2, D2), G2 = parInter(B2, A2, D2, A2, C2)
  console.assert(parOK(E2, G2, C2, D2))
  const g2 = trongTam([A2, B2, C2, D2])
  hinh('TCHH-3-II-13_b_lg', [A2, B2, C2, D2, O2, E2, G2], [
    seg(A2, B2), seg(B2, C2), seg(C2, D2), seg(D2, A2), seg(A2, C2), seg(B2, D2), seg(A2, E2), seg(B2, G2), seg(E2, G2),
    dots(A2, B2, C2, D2, O2, E2, G2),
    lab(A2, 'A', g2, 22), lab(B2, 'B', g2, 22), lab(C2, 'C', g2, 22), lab(D2, 'D', g2, 22), label(O2, 'O', 4, -14), label(E2, 'E', -16, 24), label(G2, 'G', 18, 24),
  ], NP)
}

// ───── 14: hình thang ABCD (AB ∥ CD, CD < AB); DK ∥ BC; CF ∥ AD; FP ∥ AC ─────
{
  const A = P(40, 320), B = P(440, 320), D = P(100, 160), C = P(340, 160)
  const K = parInter(D, B, C, A, B), F = parInter(C, A, D, A, B), Pp = parInter(F, A, C, B, C)
  const M = inter(D, K, A, C), I = inter(B, D, C, F)
  console.assert(parOK(D, K, B, C) && parOK(C, F, A, D) && parOK(F, Pp, A, C))
  const g = trongTam([A, B, C, D])
  const co = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(D, K), seg(C, F), seg(F, Pp)]
  const nhan = [lab(A, 'A', g, 22), lab(B, 'B', g, 22), lab(C, 'C', g, 22), lab(D, 'D', g, 22),
    label(K, 'K', -6, 32), label(F, 'F', 8, 32), label(M, 'M', -18, 6), label(Pp, 'P', 20, 0)]
  hinh('TCHH-3-II-14', [A, B, C, D, K, F, M, Pp], [...co, dots(A, B, C, D, K, F, M, Pp), ...nhan], NP)
  hinh('TCHH-3-II-14_a_lg', [A, B, C, D, K, F, M, Pp], [...co, seg(M, Pp),
    tick(A, F, 1, 0.5), tick(D, C, 1, 0.5), tick(K, B, 1, 0.5),
    dots(A, B, C, D, K, F, M, Pp), ...nhan], NP)
  hinh('TCHH-3-II-14_b_lg', [A, B, C, D, K, F, M, Pp, I], [...co, seg(M, Pp), seg(B, D),
    dots(A, B, C, D, K, F, M, Pp, I), ...nhan, label(I, 'I', 4, -14)], NP)
}

// ───── 14bis: BC < BA; BE phân giác ∠B; CF ⊥ BE; G = CF ∩ trung tuyến BD ─────
{
  const B = P(470, 150), A = P(20, 300), C = P(330, 300)
  console.assert(dist(B, C) < dist(B, A))
  const E = chanPG(B, A, C), D = mid(A, C), F = foot(C, B, E)
  const Kk = inter(C, F, A, B), G = inter(C, F, B, D)
  near(goc(F, B, C), 90) // BF ⊥ CF
  near(dist(B, Kk), dist(B, C), 0.01)
  const g = trongTam([A, B, C])
  const fin = add(G, P((G.x - C.x) * 0.1, (G.y - C.y) * 0.1))
  const co = [seg(A, B), seg(B, C), seg(C, A), seg(B, E), seg(B, D), seg(C, fin)]
  const nhan = [lab(A, 'A', g, 22), lab(B, 'B', g, 22), lab(C, 'C', g, 22), lab(D, 'D', g, 20), lab(E, 'E', g, 20), label(F, 'F', 24, 14), label(G, 'G', -20, -4)]
  hinh('TCHH-3-II-14bis', [A, B, C, D, E, F, G], [...co, rightAngle(F, B, C, 12), dots(A, B, C, D, E, F, G), ...nhan,
    angleMark(B, A, E, 40, 1), angleMark(B, E, C, 40, 1)], NP)
  hinh('TCHH-3-II-14bis_lg', [A, B, C, D, E, F, G, Kk], [seg(A, B), seg(B, C), seg(C, A), seg(B, E), seg(B, D), seg(C, Kk), segDash(D, F),
    rightAngle(F, B, C, 12), tick(B, Kk, 1, 0.5), tick(B, C, 1, 0.5), tick(C, F, 2, 0.5), tick(F, Kk, 2, 0.5),
    dots(A, B, C, D, E, F, G, Kk), ...nhan, lab(Kk, 'K', g, 20)], NP)
}

// ───── 15: ABC vuông tại A (AB đứng, AC ngang), đường cao AH; E, F hình chiếu của H; D ∈ BC; M, N hình chiếu của D ─────
{
  const A = P(60, 60), B = P(60, 300), C = P(360, 60)
  const H = foot(A, B, C), E = foot(H, A, C), F = foot(H, A, B)
  const D = lerp(B, C, 0.62), M = foot(D, A, B), N = foot(D, A, C)
  near(goc(A, B, C), 90)
  const g = trongTam([A, B, C])
  hinh('TCHH-3-II-15', [A, B, C, H, E, F, D, M, N], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, E), seg(H, F), seg(D, M), seg(D, N),
    rightAngle(A, B, C, 14), rightAngle(H, A, B, 12), rightAngle(E, H, A, 12), rightAngle(F, H, A, 12), rightAngle(M, D, A, 12), rightAngle(N, D, A, 12),
    dots(A, B, C, H, E, F, D, M, N),
    label(A, 'A', -20, -12), label(B, 'B', -20, 22), label(C, 'C', 22, -8), label(H, 'H', 20, 20), label(E, 'E', 2, -14), label(F, 'F', -20, 6),
    label(D, 'D', 20, 22), label(M, 'M', -20, 6), label(N, 'N', 2, -14),
  ], NP)
}

// ───── 16 (DE_SAU): ABC nhọn, AH ⊥ BC, D ∈ AH, E ∈ AB, F ∈ AC, ∠EDC = ∠FDB = 90° ─────
{
  const A = P(250, 40), B = P(70, 300), C = P(390, 300), H = P(250, 300), D = P(250, 100)
  const perpC = P(-(C.y - D.y), C.x - D.x), perpB = P(-(B.y - D.y), B.x - D.x)
  const E = inter(D, add(D, perpC), A, B), F = inter(D, add(D, perpB), A, C)
  console.assert(dist(A, E) < dist(A, B) && dist(A, F) < dist(A, C), '16 E,F phải thuộc cạnh')
  near(goc(D, E, C), 90); near(goc(D, F, B), 90)
  const g = trongTam([A, B, C])
  hinh('TCHH-3-II-16', [A, B, C, H, D, E, F], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(D, E), seg(D, F), seg(D, B), seg(D, C),
    rightAngle(H, A, B, 12), rightAngle(D, E, C, 11), rightAngle(D, F, B, 11),
    dots(A, B, C, H, D, E, F), lab(A, 'A', g, 22), lab(B, 'B', g, 22), lab(C, 'C', g, 22), label(H, 'H', 0, 30), label(D, 'D', -10, 34), lab(E, 'E', g, 20), lab(F, 'F', g, 20),
  ], NP)
}

// ───── 17: trung tuyến AM; d cắt AB, AC, AM tại E, F, N; ý lg: BI ∥ d, CS ∥ d ─────
{
  const A = P(160, 40), B = P(40, 300), C = P(420, 300), M = mid(B, C)
  const E = lerp(A, B, 0.45), F = lerp(A, C, 0.6), N = inter(E, F, A, M)
  console.assert(dist(A, N) < dist(A, M))
  const g = trongTam([A, B, C])
  const dE = lerp(E, F, -0.25), dF = lerp(E, F, 1.25)   // đường thẳng d kéo dài một chút hai đầu
  const nhan = [lab(A, 'A', g, 22), lab(B, 'B', g, 22), lab(C, 'C', g, 22), label(M, 'M', -16, -10), lab(E, 'E', g, 20), lab(F, 'F', g, 20), label(N, 'N', -4, -14)]
  const co = [seg(A, B), seg(B, C), seg(C, A), seg(A, M), seg(dE, dF)]
  hinh('TCHH-3-II-17', [A, B, C, M, E, F, N, dE, dF], [...co, dots(A, B, C, M, E, F, N), ...nhan, label(dF, 'd', 14, -8)], NP)
  const I = parInter(B, E, F, A, M), S = parInter(C, E, F, A, M)
  console.assert(parOK(B, I, E, F) && parOK(C, S, E, F))
  hinh('TCHH-3-II-17_lg', [A, B, C, M, E, F, N, dE, dF, I, S], [...co, seg(B, I), seg(C, S), seg(I, S),
    tick(B, M, 1, 0.5), tick(M, C, 1, 0.5),
    dots(A, B, C, M, E, F, N, I, S), ...nhan, label(I, 'I', 22, 20), label(S, 'S', 16, 22)], NP)
}

// ───── 18: ABC, Q ∈ BC, P ∈ AQ; PM ∥ AC (M ∈ AB), PN ∥ AB (N ∈ AC) ─────
{
  const A = P(150, 40), B = P(30, 300), C = P(420, 300)
  const Q = lerp(B, C, 0.4), Pp = lerp(Q, A, 0.45)
  const M = parInter(Pp, A, C, A, B), N = parInter(Pp, A, B, A, C)
  console.assert(parOK(Pp, M, A, C) && parOK(Pp, N, A, B))
  const g = trongTam([A, B, C])
  const co = [seg(A, B), seg(B, C), seg(C, A), seg(A, Q), seg(Pp, M), seg(Pp, N)]
  const nhan = [lab(A, 'A', g, 22), lab(B, 'B', g, 22), lab(C, 'C', g, 22), label(Q, 'Q', 0, 30), label(Pp, 'P', 16, 4), lab(M, 'M', g, 20), lab(N, 'N', g, 20)]
  hinh('TCHH-3-II-18', [A, B, C, Q, Pp, M, N], [...co, dots(A, B, C, Q, Pp, M, N), ...nhan], NP)
  const H = inter(Pp, N, B, C), I = inter(Pp, M, B, C)
  hinh('TCHH-3-II-18_a_lg', [A, B, C, Q, Pp, M, N, H, I], [...co, seg(N, H), seg(M, I), dots(A, B, C, Q, Pp, M, N, H, I), ...nhan,
    label(H, 'H', -4, 30), label(I, 'I', 6, 30)], NP)
  // ý b: Q trung điểm BC, AP = 2/3 AQ; J trung điểm AP
  const Q2 = mid(B, C), P2 = lerp(A, Q2, 2 / 3)
  const M2 = parInter(P2, A, C, A, B), N2 = parInter(P2, A, B, A, C), J = mid(A, P2)
  console.assert(parOK(M2, N2, B, C))
  hinh('TCHH-3-II-18_b_lg', [A, B, C, Q2, P2, M2, N2, J], [seg(A, B), seg(B, C), seg(C, A), seg(A, Q2), seg(P2, M2), seg(P2, N2), seg(M2, N2),
    tick(B, Q2, 1, 0.5), tick(Q2, C, 1, 0.5), dots(A, B, C, Q2, P2, M2, N2, J),
    lab(A, 'A', g, 22), lab(B, 'B', g, 22), lab(C, 'C', g, 22), label(Q2, 'Q', 0, 30), label(P2, 'P', 18, 8), lab(M2, 'M', g, 20), lab(N2, 'N', g, 20), label(J, 'J', -16, -6)], NP)
}

await xuatTat(OUT)
