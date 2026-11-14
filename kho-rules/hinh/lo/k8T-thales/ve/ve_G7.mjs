// ve_G7.mjs — vẽ hình TCHH CĐ5 Bài 1–6 (trạm G7). Chạy: node ve_G7.mjs (từ <TH>)
import {
  P, seg, segDash, tick, angleMark, rightAngle, dot, label, hinh, xuatTat, lerp, mid, foot, inter, add, mul, dist, goc,
  bisector, trongTam, labelOut, num, ray,
} from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/cf0b21d3-a89a-437b-ae80-9b607bdf58bb/scratchpad/h8t/hinh_G7'
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
const tam = (...a) => trongTam(a)
const L = (p, t, dx, dy) => label(p, t, dx, dy)

// ───────── Bài 1: tam giác ABC vuông tại C, BD=DE=EC, BC=3AC ─────────
{
  const u = 90
  const C = P(60, 190), A = P(60, 190 - u), E = P(60 + u, 190), D = P(60 + 2 * u, 190), B = P(60 + 3 * u, 190)
  hinh('TCHH-5-1', [A, B, C, E, D], [
    seg(A, C), seg(C, B), seg(A, B), seg(A, E), seg(A, D),
    rightAngle(C, A, B, 14),
    tick(C, E, 1), tick(E, D, 1), tick(D, B, 1),
    dot(A), dot(B), dot(C), dot(D), dot(E),
    L(A, 'A', 0, -12), L(C, 'C', -18, 8), L(E, 'E', 0, 34), L(D, 'D', 0, 34), L(B, 'B', 8, 34),
  ])
}

// ───────── Bài 2: O trong tam giác, AO,BO,CO cắt BC,CA,AB tại D,E,F; ℓ ∥ BC qua O cắt DE, DF tại N, M ─────────
{
  const s = 0.8
  const S = (p) => P(p.x * s, p.y * s)
  const A0 = P(90, 30), B0 = P(0, 300), C0 = P(340, 300)
  const O0 = P(0.45 * A0.x + 0.2 * B0.x + 0.35 * C0.x, 0.45 * A0.y + 0.2 * B0.y + 0.35 * C0.y)
  const D0 = inter(A0, O0, B0, C0), E0 = inter(B0, O0, A0, C0), F0 = inter(C0, O0, A0, B0)
  const hx = P(1, 0)
  const M0 = inter(O0, add(O0, hx), D0, F0), N0 = inter(O0, add(O0, hx), D0, E0)
  const m1 = P(A0.x + 1, A0.y)
  const Q0 = inter(C0, O0, A0, m1), P0 = inter(B0, O0, A0, m1), I0 = inter(D0, E0, A0, m1), H0 = inter(D0, F0, A0, m1)
  const [A, B, C, O, D, E, F, M, N, Q, Pp, I, H] = [A0, B0, C0, O0, D0, E0, F0, M0, N0, Q0, P0, I0, H0].map(S)
  const ctr = tam(A, B, C)
  const base = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(B, E), seg(C, F), seg(D, E), seg(D, F), seg(M, N),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(O), dot(M), dot(N),
    L(A, 'A', 0, -12), L(B, 'B', -16, 10), L(C, 'C', 18, 10), L(D, 'D', 0, 34), L(E, 'E', 20, -2), L(F, 'F', -20, -2),
    L(O, 'O', 4, 26), L(M, 'M', -16, 26), L(N, 'N', 18, 26),
  ]
  hinh('TCHH-5-2', [A, B, C, D, E, F], base)
  hinh('TCHH-5-2_lg', [A, B, C, D, Q, Pp, H, I], [
    ...base,
    seg(Q, Pp), seg(Q, C), seg(Pp, B), seg(H, D), seg(I, D),
    dot(Q), dot(Pp), dot(H), dot(I),
    L(Q, 'Q', -4, -12), L(Pp, 'P', 4, -12), L(H, 'H', -6, -12), L(I, 'I', 8, -12),
  ])
}

// ───────── Bài 3: trọng tâm G, cát tuyến MN; hình lời giải: BB' ∥ MN, CC' ∥ MN ─────────
{
  const A = P(110, 30), B = P(0, 300), C = P(360, 300)
  const D = mid(B, C), G = tam(A, B, C)
  const r1 = 1.2, r2 = 1.8
  const M = lerp(A, B, 1 / r1), N = lerp(A, C, 1 / r2)
  const Bp = lerp(A, G, r1), Cp = lerp(A, G, r2)
  const base = [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(M, N),
    tick(B, D, 1), tick(D, C, 1),
    dot(A), dot(B), dot(C), dot(D), dot(G), dot(M), dot(N),
    L(A, 'A', 0, -12), L(B, 'B', -16, 10), L(C, 'C', 18, 10), L(D, 'D', 0, 36), L(G, 'G', -20, 4),
    L(M, 'M', -22, 4), L(N, 'N', 20, -2),
  ]
  hinh('TCHH-5-3', [A, B, C, D, G], base)
  hinh('TCHH-5-3_lg', [A, B, C, D, Cp, Bp], [
    ...base,
    seg(D, Cp), seg(B, Bp), seg(C, Cp),
    dot(Bp), dot(Cp),
    L(Bp, "B′", 22, 0), L(Cp, "C′", 22, 14),
  ])
}

// ───────── Bài 4: ΔABC vuông tại A (AB đứng, AC ngang), AH ⊥ BC, M,N hình chiếu của H; đường thẳng qua A cắt HM tại E, HN tại F ─────────
{
  const A = P(150, 330), B = P(150, 330 - 190), C = P(150 + 250, 330)
  const H = foot(A, B, C), M = foot(H, A, B), N = foot(H, A, C)
  const q = ray(A, 140, 100)
  const E = inter(A, q, H, M), F = inter(A, q, H, N)
  const K = inter(B, E, H, F)
  const base = [
    seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(H, M), seg(H, N),
    seg(E, F), seg(B, E), seg(C, F),
    rightAngle(A, B, C, 14), rightAngle(H, A, C, 12), rightAngle(M, A, H, 12), rightAngle(N, A, H, 12),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(N), dot(E), dot(F),
    L(A, 'A', 16, 30), L(B, 'B', -16, -4), L(C, 'C', 16, 10), L(H, 'H', 4, -14), L(M, 'M', -18, -8), L(N, 'N', 14, 30),
    L(E, 'E', -16, -4), L(F, 'F', 16, 6),
  ]
  hinh('TCHH-5-4', [A, B, C, E, F, H], base)
  hinh('TCHH-5-4_lg', [A, B, C, E, F, K], [
    ...base.slice(0, 0), ...base,
    seg(B, K), seg(H, K), dot(K), L(K, 'K', 16, 4),
  ])
}

// ───────── Bài 5: ΔABC vuông tại A (AB đứng, AC ngang), AD ⊥ BC, DE ⊥ AC, DF ⊥ AB ─────────
{
  const A = P(60, 320), B = P(60, 320 - 150), C = P(60 + 270, 320)
  const D = foot(A, B, C), E = foot(D, A, C), F = foot(D, A, B)
  hinh('TCHH-5-5', [A, B, C, D, E, F], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(D, E), seg(D, F),
    rightAngle(A, B, C, 14), rightAngle(D, A, C, 12), rightAngle(E, D, A, 12), rightAngle(F, D, A, 12),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
    L(A, 'A', -16, 22), L(B, 'B', -16, -4), L(C, 'C', 18, 10), L(D, 'D', 12, -10), L(E, 'E', 2, 34), L(F, 'F', -16, 6),
  ])
}

// ───────── Bài 6: AD phân giác trong; DE ∥ AC, E ∈ AB ─────────
{
  const A = P(100, 30), B = P(0, 300), C = P(380, 300)
  const dB = P(1, 0)
  const ub = mul(sub(B, A), 1 / dist(A, B)), uc = mul(sub(C, A), 1 / dist(A, C))
  const D = inter(A, add(A, add(ub, uc)), B, C)
  const E = inter(D, add(D, sub(C, A)), A, B)
  console.assert(Math.abs(goc(A, B, D) - goc(A, D, C)) < 1e-6)
  hinh('TCHH-5-6', [A, B, C, D, E], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(D, E),
    angleMark(A, B, D, 46, 1), angleMark(A, D, C, 46, 1),
    dot(A), dot(B), dot(C), dot(D), dot(E),
    L(A, 'A', 0, -12), L(B, 'B', -16, 10), L(C, 'C', 18, 10), L(D, 'D', 0, 36), L(E, 'E', -18, 4),
  ])
}

await xuatTat(OUT)
