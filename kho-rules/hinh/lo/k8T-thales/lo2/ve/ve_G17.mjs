// ve_G17.mjs — hình đề + hình lời giải VHB2 BT 179..187 (§13 Định lí Ta-lét). Chạy: node ve_G17.mjs (từ thư mục h8t2)
import { P, seg, segDash, tick, rightAngle, dot, label, labelOut, num, bien, mid, lerp, foot, inter, dist, trongTam, add, hinh, xuatTat }
  from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/cf0b21d3-a89a-437b-ae80-9b607bdf58bb/scratchpad/h8t2/hinh_G17'
const dots = (...ps) => ps.map(dot).join('')
const near = (a, b, e = 0.01) => console.assert(Math.abs(a - b) < e, 'sai dữ kiện', a, b)
const par = (a, b, c, d) => console.assert(Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) / (dist(a, b) * dist(c, d)) < 1e-6, 'không song song')
const NP = { pad: 42, padDuoi: 52 }
const lab = (p, t, from, d = 22) => labelOut(p, t, from, d)
const vec = (a, b) => P(b.x - a.x, b.y - a.y)
const sh = (p, v) => P(p.x + v.x, p.y + v.y)

// ───── 179: D chia BA, DB:DA = 1:2; E chia AC, EA:EC = 2:5; F = ED ∩ BC ─────
{
  const A = P(150, 40), B = P(60, 260), C = P(380, 260)
  const D = lerp(B, A, 1 / 3), E = lerp(A, C, 2 / 7), F = inter(D, E, B, C)
  near(dist(F, B) / dist(F, C), 0.2, 1e-9)
  const g = trongTam([A, B, C])
  const base = [seg(A, B), seg(B, C), seg(C, A), seg(F, E)]
  const lbl = [lab(A, 'A', g, 22), lab(B, 'B', g, 24), lab(C, 'C', g, 24), lab(D, 'D', g, 22), lab(E, 'E', g, 22), lab(F, 'F', g, 26)]
  hinh('VHB2-179', [A, B, C, D, E, F], [...base, seg(F, B), dots(A, B, C, D, E, F), ...lbl], NP)
  const G = inter(B, sh(B, vec(D, E)), A, C)
  par(B, G, D, E)
  hinh('VHB2-179_lg', [A, B, C, D, E, F, G], [...base, segDash(B, G), dots(A, B, C, D, E, F, G), ...lbl, lab(G, 'G', g, 22)], NP)
}

// ───── 180: D chia BC, DB:DC = 1:2; O chia AD, OA:OD = 3:2; K = BO ∩ AC ─────
{
  const A = P(150, 30), B = P(40, 240), C = P(370, 240)
  const D = lerp(B, C, 1 / 3), O = lerp(A, D, 3 / 5), K = inter(B, O, A, C)
  near(dist(A, K) / dist(K, C), 0.5, 1e-9)
  const g = trongTam([A, B, C])
  const base = [seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(B, K)]
  const lbl = [lab(A, 'A', g, 22), lab(B, 'B', g, 24), lab(C, 'C', g, 24), lab(D, 'D', g, 24), label(K, 'K', 18, -4), label(O, 'O', -16, -6)]
  hinh('VHB2-180', [A, B, C, D, O, K], [...base, dots(A, B, C, D, O, K), ...lbl], NP)
  const G = inter(D, sh(D, vec(B, K)), A, C)
  par(D, G, B, K)
  hinh('VHB2-180_lg', [A, B, C, D, O, K, G], [...base, segDash(D, G), dots(A, B, C, D, O, K, G), ...lbl, label(G, 'G', 18, 10)], NP)
}

// ───── 181: AM trung tuyến; I ∈ BC; IK ∥ AC (K ∈ AB); IE ∥ AB cắt AM ở D, AC ở E ─────
{
  const A = P(100, 30), B = P(30, 250), C = P(380, 250)
  const M = mid(B, C), I = lerp(B, M, 0.55)
  const K = inter(I, sh(I, vec(A, C)), A, B), E = inter(I, sh(I, vec(A, B)), A, C), D = inter(I, E, A, M)
  par(I, K, A, C); par(I, E, A, B)
  const g = trongTam([A, B, C])
  const base = [seg(A, B), seg(B, C), seg(C, A), seg(A, M), seg(I, K), seg(I, E)]
  const lbl = [lab(A, 'A', g, 22), lab(B, 'B', g, 24), lab(C, 'C', g, 24), label(M, 'M', 16, 30), label(I, 'I', -6, 30), lab(K, 'K', g, 22), lab(E, 'E', g, 22), label(D, 'D', -8, -12)]
  hinh('VHB2-181', [A, B, C, M, I, K, E, D], [...base, dots(A, B, C, M, I, K, E, D), ...lbl], NP)
  const G = inter(M, sh(M, vec(I, E)), A, C)
  par(M, G, I, E)
  near(dist(A, G), dist(G, C), 1e-6)
  hinh('VHB2-181_lg', [A, B, C, M, I, K, E, D, G], [...base, segDash(M, G), dots(A, B, C, M, I, K, E, D, G), ...lbl, lab(G, 'G', g, 22)], NP)
}

// ───── 182: tứ giác ABCD; E, F trung điểm CD, CB; O = AE ∩ DF; OA = 4OE; OD = 2/3 OF ─────
{
  const O = P(0, 0), e = P(30, 45), f = P(110, -10)
  const A = P(O.x - 4 * e.x, O.y - 4 * e.y), E = P(e.x, e.y), F = P(f.x, f.y), D = P(-2 / 3 * f.x, -2 / 3 * f.y)
  const C = P(2 * e.x + 2 / 3 * f.x, 2 * e.y + 2 / 3 * f.y), B = P(4 / 3 * f.x - 2 * e.x, 4 / 3 * f.y - 2 * e.y)
  near(dist(E, D), dist(E, C), 1e-6); near(dist(F, C), dist(F, B), 1e-6)
  near(dist(O, A), 4 * dist(O, E), 1e-6); near(dist(O, D), 2 / 3 * dist(O, F), 1e-6)
  const g = trongTam([A, B, C, D])
  const base = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, E), seg(D, F),
    tick(D, C, 1, 0.25), tick(D, C, 1, 0.75), tick(C, B, 2, 0.25), tick(C, B, 2, 0.75)]
  const lbl = [lab(A, 'A', g, 22), lab(B, 'B', g, 22), lab(C, 'C', g, 24), lab(D, 'D', g, 24), lab(E, 'E', g, 22), lab(F, 'F', g, 22), label(O, 'O', 4, 28)]
  hinh('VHB2-182', [A, B, C, D, E, F, O], [...base, dots(A, B, C, D, E, F, O), ...lbl], NP)
  const I = P(O.x - (D.x - O.x) / 4, O.y - (D.y - O.y) / 4), K = mid(C, F)
  par(E, I, A, D); near(dist(I, F), 2.5 / 2 * dist(O, D), 1e-6)
  hinh('VHB2-182_lg', [A, B, C, D, E, F, O, I, K], [...base, segDash(E, I), segDash(E, K), dots(A, B, C, D, E, F, O, I, K), ...lbl, label(I, 'I', 4, -14), lab(K, 'K', g, 22)], NP)
}

// ───── 183: tứ giác ABCD; M, N trung điểm AB, CD; MN cắt AD, BC ở I, K ─────
{
  const A = P(60, 64), B = P(360, 22), C = P(250, 187), D = P(130, 154)
  const M = mid(A, B), N = mid(C, D)
  const I = inter(M, N, A, D), K = inter(M, N, B, C)
  near(dist(I, A) / dist(I, D), dist(K, B) / dist(K, C), 1e-9)
  const base = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, I), seg(B, K), seg(M, K),
    tick(A, B, 1, 0.25), tick(A, B, 1, 0.75), tick(D, C, 2, 0.25), tick(D, C, 2, 0.75)]
  const lbl = [label(A, 'A', -16, -10), label(B, 'B', 14, -10), label(C, 'C', 22, 18), label(D, 'D', -18, 22), label(M, 'M', -18, -8), label(N, 'N', -18, 18), label(I, 'I', -20, 22), label(K, 'K', -20, 20)]
  hinh('VHB2-183', [A, B, C, D, M, N, I, K], [...base, dots(A, B, C, D, M, N, I, K), ...lbl], NP)
  const dDC = vec(C, D)
  const E = inter(A, sh(A, dDC), M, N), F = inter(B, sh(B, dDC), M, N)
  par(A, E, D, C); par(B, F, D, C)
  hinh('VHB2-183_lg', [A, B, C, D, M, N, I, K, E, F], [...base, segDash(A, E), segDash(B, F), seg(F, M), dots(A, B, C, D, M, N, I, K, E, F), ...lbl, label(E, 'E', 18, -6), label(F, 'F', 18, -4)], NP)
}

// ───── 184: M ∈ BC; MH ∥ AC (H ∈ AB); MK ∥ AB (K ∈ AC) ─────
{
  const A = P(110, 30), B = P(30, 190), C = P(250, 190)
  const g = trongTam([A, B, C])
  // hình đề: M trong đoạn BC
  {
    const M = lerp(B, C, 0.45)
    const H = inter(M, sh(M, vec(C, A)), A, B), K = inter(M, sh(M, vec(B, A)), A, C)
    par(M, H, A, C); par(M, K, A, B)
    hinh('VHB2-184', [A, B, C, M, H, K], [seg(A, B), seg(B, C), seg(C, A), seg(M, H), seg(M, K), dots(A, B, C, M, H, K),
      lab(A, 'A', g, 22), lab(B, 'B', g, 24), lab(C, 'C', g, 24), lab(M, 'M', g, 26), lab(H, 'H', g, 22), lab(K, 'K', g, 22)], NP)
  }
  // hình lời giải ý b: M thuộc tia đối của tia CB
  {
    const t = 1.4
    const M = P(B.x + t * (C.x - B.x), B.y + t * (C.y - B.y))
    const H = inter(M, sh(M, vec(C, A)), A, B), K = inter(M, sh(M, vec(B, A)), A, C)
    par(M, H, A, C); par(M, K, A, B)
    hinh('VHB2-184_b_lg', [A, B, C, M, H, K], [seg(B, H), seg(B, M), seg(A, K), seg(M, H), seg(M, K), seg(A, C), dots(A, B, C, M, H, K),
      lab(A, 'A', g, 22), lab(B, 'B', g, 24), lab(C, 'C', g, 24), label(M, 'M', 6, 30), lab(H, 'H', g, 22), lab(K, 'K', g, 24)], NP)
  }
}

// ───── 185: AM trung tuyến; O ∈ AM; đường thẳng qua O cắt AB, AC ở B', C' ─────
{
  const A = P(150, 30), B = P(30, 240), C = P(340, 240)
  const M = mid(B, C), g = trongTam([A, B, C])
  const u = P(1, 0.3)
  const ve = (ten, ratio, lg) => {
    const O = lerp(A, M, ratio)
    const B1 = inter(O, sh(O, u), A, B), C1 = inter(O, sh(O, u), A, C)
    const I = inter(B, sh(B, u), A, M), K = inter(C, sh(C, u), A, M)
    // kiểm: tổng AB/AB' + AC/AC' = 2AM/AO
    near(dist(A, B) / dist(A, B1) + dist(A, C) / dist(A, C1), 2 * dist(A, M) / dist(A, O), 1e-9)
    near(dist(M, I), dist(M, K), 1e-6)
    const body = [seg(A, B), seg(B, C), seg(C, A), seg(A, M), seg(B1, C1), dots(A, B, C, M, O, B1, C1),
      lab(A, 'A', g, 22), lab(B, 'B', g, 24), lab(C, 'C', g, 24), label(M, 'M', 14, 30), label(B1, "B′", -22, -4), label(C1, "C′", 22, -4), label(O, 'O', -16, -10)]
    const pts = [A, B, C, M, O, B1, C1]
    if (lg) { body.push(segDash(B, I), segDash(C, K), dots(I, K), label(I, 'I', 0, 26), label(K, 'K', 20, 4)); pts.push(I, K) }
    hinh(ten, pts, body, NP)
  }
  ve('VHB2-185', 0.5, false)
  ve('VHB2-185_a_lg', 0.5, true)
  ve('VHB2-185_b_lg', 0.38, true)
}

// ───── 186: ABC vuông cân tại A; trung tuyến BM; D ∈ BC, BD = 2DC ─────
{
  const A = P(40, 40), B = P(40, 240), C = P(240, 40)
  const M = mid(A, C), D = lerp(B, C, 2 / 3)
  near(dist(B, D), 2 * dist(D, C), 1e-9)
  const K = P(40, -60)
  const g = trongTam([A, B, C])
  const base = [seg(A, B), seg(B, C), seg(C, A), seg(B, M), seg(A, D), rightAngle(A, B, C), tick(A, B, 1, 0.5), tick(A, C, 1, 0.5), tick(A, M, 2, 0.5), tick(M, C, 2, 0.5)]
  const lbl = [label(A, 'A', -18, -8), label(B, 'B', -18, 26), label(C, 'C', 22, 6), label(M, 'M', 0, -14), label(D, 'D', 20, 18)]
  hinh('VHB2-186', [A, B, C, M, D], [...base, dots(A, B, C, M, D), ...lbl], NP)
  const dAD = vec(A, D)
  const Kk = inter(C, sh(C, dAD), A, B)
  near(dist(A, Kk), dist(A, M), 1e-6); par(C, Kk, A, D)
  hinh('VHB2-186_lg', [A, B, C, M, D, Kk], [...base, seg(A, Kk), segDash(C, Kk), dots(A, B, C, M, D, Kk), ...lbl, label(Kk, 'K', -18, 0)], NP)
}

// ───── 187: ABC vuông tại A; BD = DE = EC; AD = 10, AE = 15 ─────
{
  const x = Math.sqrt(160 / 3), y = Math.sqrt(35 / 3), s = 13
  const A = P(30, 30), B = P(30, 30 + 3 * y * s), C = P(30 + 3 * x * s, 30)
  const D = lerp(B, C, 1 / 3), E = lerp(B, C, 2 / 3)
  near(dist(A, D) / s, 10, 1e-6); near(dist(A, E) / s, 15, 1e-6)
  const base = [seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(A, E), rightAngle(A, B, C), tick(B, D, 1, 0.5), tick(D, E, 1, 0.5), tick(E, C, 1, 0.5)]
  const lbl = [label(A, 'A', -18, -8), label(B, 'B', -18, 24), label(C, 'C', 20, 8), label(D, 'D', -6, 30), label(E, 'E', 14, 28)]
  hinh('VHB2-187', [A, B, C, D, E], [...base, dots(A, B, C, D, E), ...lbl, num(mid(A, D), '10', -22, 8, 20), num(P(mid(A, E).x + 8, mid(A, E).y - 8), '15', 8, -4, 20)], NP)
  const H = P(A.x, D.y), K = P(E.x, A.y)
  par(D, H, A, C); par(E, K, A, B)
  hinh('VHB2-187_lg', [A, B, C, D, E, H, K], [...base, segDash(D, H), segDash(E, K), dots(A, B, C, D, E, H, K), ...lbl,
    label(H, 'H', -18, 6), label(K, 'K', 0, -14), bien(mid(D, H), 'x', 0, -8, 22), bien(mid(E, K), 'y', 16, 4, 22)], NP)
}

await xuatTat(OUT)
