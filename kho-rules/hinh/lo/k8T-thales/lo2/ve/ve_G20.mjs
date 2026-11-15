// ve_G20.mjs — hình VHB2 §14 (VD34, VD35, 208–211, 213, 214, 216, 217). Chạy: node ve_G20.mjs (từ thư mục h8t2)
import { P, seg, segDash, rightAngle, dot, label, labelOut, mid, lerp, foot, inter, dist, trongTam, add, ngoaiTiep, hinh, xuatTat } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/cf0b21d3-a89a-437b-ae80-9b607bdf58bb/scratchpad/h8t2/hinh_G20'
const dots = (...ps) => ps.map(dot).join('')
const par = (a, b, c, d) => { if (Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) / (dist(a, b) * dist(c, d)) > 1e-6) throw new Error('không song song') }
const vec = (a, b) => P(b.x - a.x, b.y - a.y)
const NP = { pad: 40, padDuoi: 50 }
const L = (pts, g) => (obj) => Object.entries(obj).map(([t, p]) => labelOut(p, t, g, 22)).join('')
const onSeg = (a, x, b) => { const t = ((x.x - a.x) * (b.x - a.x) + (x.y - a.y) * (b.y - a.y)) / dist(a, b) ** 2; if (t < 0.02 || t > 0.98) throw new Error('điểm ngoài đoạn') }

// ── VD34 (tứ giác thường) ──
{
  const A = P(40, 150), B = P(210, 30), C = P(390, 170), D = P(220, 320)
  const M = lerp(A, B, 0.4), E = inter(M, add(M, vec(B, D)), A, D), G = inter(E, add(E, vec(A, C)), D, C), H = inter(G, add(G, vec(B, D)), B, C)
  par(M, E, B, D); par(E, G, A, C); par(G, H, B, D); onSeg(A, E, D); onSeg(D, G, C); onSeg(B, H, C)
  const g = trongTam([A, B, C, D]), lb = L(0, g)
  hinh('VHB2-VD34', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), segDash(A, C), segDash(B, D), seg(M, E), seg(E, G), seg(G, H), seg(H, M), dots(A, B, C, D, M, E, G, H), lb({ A, B, C, D, M, E, G, H })], NP)
  // hình chữ nhật (ý b)
  const a = P(40, 220), b = P(40, 50), c = P(360, 50), d = P(360, 220)
  const m = lerp(a, b, 0.4), e = inter(m, add(m, vec(b, d)), a, d), gg = inter(e, add(e, vec(a, c)), d, c), h = inter(gg, add(gg, vec(b, d)), b, c)
  const g2 = trongTam([a, b, c, d])
  hinh('VHB2-VD34_b_lg', [a, b, c, d], [seg(a, b), seg(b, c), seg(c, d), seg(d, a), segDash(a, c), segDash(b, d), seg(m, e), seg(e, gg), seg(gg, h), seg(h, m), dots(a, b, c, d, m, e, gg, h), L(0, g2)({ A: a, B: b, C: c, D: d, M: m, E: e, G: gg, H: h })], NP)
}
// ── VD35 ──
{
  const A = P(180, 30), B = P(30, 260), C = P(400, 250)
  const D = lerp(A, B, 1 / 3), E = lerp(B, C, 1 / 3), F = lerp(C, A, 1 / 3), I = lerp(E, D, 1 / 3), K = lerp(F, E, 1 / 3)
  const g = trongTam([A, B, C]), lb = L(0, g)
  const base = [seg(A, B), seg(B, C), seg(C, A), seg(D, E), seg(E, F), seg(I, K)]
  hinh('VHB2-VD35', [A, B, C], [...base, dots(A, B, C, D, E, F, I, K), lb({ A, B, C, D, E, F, I, K })], NP)
  const M = lerp(B, D, 1 / 3), N = lerp(F, C, 1 / 3)
  par(M, N, B, C)
  hinh('VHB2-VD35_lg', [A, B, C], [...base, segDash(M, N), dots(A, B, C, D, E, F, I, K, M, N), lb({ A, B, C, D, E, F, I, K, M, N })], NP)
}
// ── 208 ──
{
  const A = P(130, 40), B = P(300, 40), C = P(390, 230), D = P(30, 230), M = mid(C, D)
  const I = inter(A, M, B, D), K = inter(B, M, A, C), g = trongTam([A, B, C, D])
  const base = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, M), seg(B, M), seg(A, C), seg(B, D)]
  hinh('VHB2-208', [A, B, C, D], [...base, dots(A, B, C, D, M, I, K), L(0, g)({ A, B, C, D, M })+ labelOut(I, 'I', g, 20) + labelOut(K, 'K', g, 20)], NP)
  const E = inter(I, K, A, D), F = inter(I, K, B, C)
  par(I, K, A, B)
  hinh('VHB2-208_b_lg', [A, B, C, D], [...base, seg(E, F), dots(A, B, C, D, M, I, K, E, F), L(0, g)({ A, B, C, D, M, E, F }) + label(I, 'I', 0, 28) + label(K, 'K', 4, 28)], NP)
}
// ── 209 ──
{
  const A = P(120, 50), B = P(280, 50), C = P(400, 230), D = P(40, 230), E = lerp(B, C, 0.5)
  const K = inter(C, add(C, vec(A, E)), A, D); par(C, K, A, E); onSeg(A, K, D)
  const g = trongTam([A, B, C, D])
  const base = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, E), seg(C, K), seg(B, K), seg(D, E)]
  hinh('VHB2-209', [A, B, C, D], [...base, dots(A, B, C, D, E, K), L(0, g)({ A, B, C, D, E, K })], NP)
  const M = inter(A, B, K, C), N = inter(A, E, B, K)
  hinh('VHB2-209_lg', [A, B, C, D, M], [...base, seg(A, M), seg(K, M), dots(A, B, C, D, E, K, M, N), L(0, g)({ A, B, C, D, E, K, M }) + label(N, 'N', 14, 24)], NP)
}
// ── 210 ──
{
  const A = P(170, 30), B = P(30, 260), C = P(400, 250), I = lerp(A, B, 0.55), K = lerp(A, C, 0.6)
  const M = inter(I, add(I, vec(B, K)), A, C), N = inter(K, add(K, vec(C, I)), A, B)
  par(I, M, B, K); par(K, N, C, I); onSeg(A, M, C); onSeg(A, N, B)
  const g = trongTam([A, B, C])
  hinh('VHB2-210', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(B, K), seg(C, I), seg(I, M), seg(K, N), seg(M, N), dots(A, B, C, I, K, M, N), L(0, g)({ A, B, C, I, K, M, N })], NP)
}
// ── 211 ──
{
  const mk = (A, B, C, D, ten) => {
    const E = inter(A, add(A, vec(B, C)), B, D), G = inter(B, add(B, vec(A, D)), A, C), O = inter(A, C, B, D)
    par(A, E, B, C); par(B, G, A, D)
    const g = trongTam([A, B, C, D])
    hinh(ten, [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(A, E), seg(B, G), seg(E, G), dots(A, B, C, D, E, G), L(0, g)({ A, B, C, D }) + label(E, 'E', -6, 28) + label(G, 'G', 8, 28)], NP)
  }
  mk(P(100, 60), P(330, 40), P(390, 250), P(30, 240), 'VHB2-211')
  mk(P(130, 50), P(300, 50), P(400, 230), P(40, 230), 'VHB2-211_b_lg')
}
// ── 213 ──
{
  const A = P(190, 30), B = P(40, 290), C = P(390, 260)
  const D = foot(A, B, C), E = foot(B, A, C), F = foot(C, A, B), H = inter(A, D, B, E)
  const I = foot(D, B, A), K = foot(D, B, E), M = foot(D, C, F), N = foot(D, C, A)
  const g = trongTam([A, B, C])
  const base = [seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(B, E), seg(C, F), seg(D, I), seg(D, K), seg(D, M), seg(D, N), rightAngle(D, A, C, 10), rightAngle(E, B, A, 10), rightAngle(F, C, B, 10)]
  const lb = L(0, g)
  hinh('VHB2-213', [A, B, C], [...base, dots(A, B, C, D, E, F, I, K, M, N), lb({ A, B, C, D, E, F }) + label(I, 'I', -16, 6) + label(K, 'K', -14, 22) + label(M, 'M', 14, 22) + label(N, 'N', 16, -2)], NP)
  hinh('VHB2-213_lg', [A, B, C], [...base, seg(F, E), segDash(I, N), dots(A, B, C, D, E, F, I, K, M, N, H), lb({ A, B, C, D, E, F }) + label(I, 'I', -16, 6) + label(K, 'K', -14, 22) + label(M, 'M', 14, 22) + label(N, 'N', 16, -2) + label(H, 'H', 14, 24)], NP)
}
// ── 214 ──
{
  const A = P(190, 30), B = P(30, 260), C = P(400, 250), D = lerp(B, C, 0.45), M = lerp(A, D, 0.45), I = mid(M, B), K = mid(M, C)
  const E = inter(D, I, A, B), F = inter(D, K, A, C), N = mid(A, M)
  onSeg(A, E, B); onSeg(A, F, C)
  const g = trongTam([A, B, C])
  const base = [seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(M, B), seg(M, C), seg(D, E), seg(D, F), seg(E, F), seg(I, K)]
  hinh('VHB2-214', [A, B, C], [...base, dots(A, B, C, D, M, I, K, E, F), L(0, g)({ A, B, C, D, E, F }) + label(M, 'M', 16, 4) + label(I, 'I', -14, 12) + label(K, 'K', 14, 12)], NP)
  par(N, I, A, B); par(N, K, A, C)
  hinh('VHB2-214_lg', [A, B, C], [...base, segDash(N, I), segDash(N, K), dots(A, B, C, D, M, I, K, E, F, N), L(0, g)({ A, B, C, D, E, F }) + label(M, 'M', 16, 4) + label(I, 'I', -14, 12) + label(K, 'K', 14, 12) + label(N, 'N', -14, -2)], NP)
}
// ── 216 ──
{
  const A = P(130, 40), B = P(310, 40), C = P(400, 230), D = P(30, 230), r = 0.6, t = r / (1 + r)
  const M = lerp(A, D, t), N = lerp(C, B, t), O = inter(A, C, B, D)
  const E = inter(M, N, B, D), F = inter(M, N, A, C), H = inter(M, add(M, vec(A, C)), D, C)
  par(M, H, A, C); par(H, N, B, D); onSeg(D, H, C)
  const G = inter(H, M, B, D), Q = inter(H, N, A, C), K = mid(G, Q), I = inter(H, O, M, N)
  const g = trongTam([A, B, C, D])
  const base = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(M, N), seg(M, H), seg(H, N)]
  hinh('VHB2-216', [A, B, C, D], [...base, dots(A, B, C, D, M, N, E, F, H), L(0, g)({ A, B, C, D, M, N, H }) + label(E, 'E', -4, 28) + label(F, 'F', 8, 28)], NP)
  hinh('VHB2-216_b_lg', [A, B, C, D], [...base, segDash(H, O), segDash(G, Q), dots(A, B, C, D, M, N, E, F, H, O, G, Q, K, I), L(0, g)({ A, B, C, D, M, N, H }) + label(E, 'E', -4, 28) + label(F, 'F', 10, 28) + label(O, 'O', -2, -12) + label(G, 'G', -14, 18) + label(Q, 'Q', 16, 18) + label(K, 'K', 0, 30) + label(I, 'I', 0, -12)], NP)
}
// ── 217 ──
{
  const A = P(210, 40), B = P(90, 300), C = P(330, 300), M = mid(A, C), N = mid(A, B), F = mid(A, M)
  const E = trongTam([A, B, M]), G = trongTam([A, B, C]), O = ngoaiTiep(A, B, C)
  const g = trongTam([A, B, C])
  const base = [seg(A, B), seg(B, C), seg(C, A), seg(B, M), seg(E, O)]
  hinh('VHB2-217', [A, B, C, O], [...base, dots(A, B, C, M, O, E), L(0, g)({ A, B, C, M }) + label(O, 'O', 14, 20) + label(E, 'E', -14, 4)], NP)
  hinh('VHB2-217_lg', [A, B, C, O], [...base, segDash(M, N), segDash(B, F), segDash(G, O), segDash(E, G), dots(A, B, C, M, O, E, N, F, G), L(0, g)({ A, B, C, M }) + label(O, 'O', 14, 20) + label(E, 'E', -14, 4) + label(N, 'N', -14, 0) + label(F, 'F', 14, -4) + label(G, 'G', 14, 14)], NP)
}
await xuatTat(OUT)
