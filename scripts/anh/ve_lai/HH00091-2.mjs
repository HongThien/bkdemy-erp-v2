// Vẽ lại hình — gói HH00091-2 (Hình chữ nhật, Hình học 8 lớp chuyên; 3 hình LỜI GIẢI).
//   node scripts/anh/ve_lai/HH00091-2.mjs [<thu_muc_ra>]
import { P, seg, segDash, rightAngle, angleMark, tick, dot, label, num, hinh, xuatTat,
  mid, foot, inter, lerp, add, vec, mul, ray, rot, goc, dist, bisector } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00091-2/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.01, m)
const dot2 = (a, b, c, d) => (b.x - a.x) * (d.x - c.x) + (b.y - a.y) * (d.y - c.y)
const OPT = { pad: 34, padDuoi: 38 }

// ── HH00091009_lg — hình chữ nhật ABCD, ∠BDC = 30°; CE ⊥ BD (E ∈ BD), CE cắt phân giác góc ADB tại M;
//    N, K = hình chiếu của M trên DA, AB.  Nét: AD (kéo dài tới N), DC, CB, BA, DB, DM, CM, MK, MN, AM, BM; nét đứt NE.
//    Góc đánh số: D1 = ∠CDB, D2 = ∠BDM, D3 = ∠MDA; A1 = ∠MAB; B1 = ∠MBA, B2 = ∠ABD; C1 = ∠BCM.  Vuông: E.
{
  const w = 260, h = w * Math.tan(30 * Math.PI / 180)
  const D = P(0, 0), C = P(w, 0), B = P(w, -h), A = P(0, -h)
  gt(goc(D, B, C), 30, '∠BDC = 30°')
  const E = foot(C, D, B)
  const M = inter(D, ray(D, 60, 100), C, E)                 // phân giác của ∠ADB (tia 60°) cắt đường thẳng CE
  const N = foot(M, A, D), K = foot(M, A, B)
  gt(dot2(C, E, D, B), 0, 'CE ⊥ BD')
  gt(goc(D, B, M), 30, '∠BDM = 30°'); gt(goc(D, M, A), 30, '∠MDA = 30°'); gt(goc(D, C, B), 30, '∠CDB = 30°')
  gt(goc(A, M, B), 30, '∠MAB = 30°'); gt(goc(B, M, A), 30, '∠MBA = 30°'); gt(goc(B, A, D), 30, '∠ABD = 30°'); gt(goc(C, B, E), 30, '∠BCE = 30°')
  gt(goc(B, M, C), 120, '∠MBC = 120°'); gt(dist(A, M), dist(B, M), 'AM = BM')
  gt(dot2(M, K, A, B), 0, 'MK ⊥ AB'); gt(dot2(M, N, A, D), 0, 'MN ⊥ DA')
  gt(Math.abs((E.x - N.x) * (K.y - N.y) - (E.y - N.y) * (K.x - N.x)), 0, 'N, K, E thẳng hàng (hệ quả)')
  gt(dist(M, N), dist(M, E), 'MN = ME (lời giải)'); gt(goc(N, M, E), 30, '∠MNE = 30° (lời giải)'); gt(goc(M, N, E), 120, '∠NME = 120°')
  const so = (v, p, q, t, r) => num(bisector(v, p, q, r), t, 0, 6, 18)
  hinh('HH00091009_lg', [N, M, D, C, B, A, K, E], [
    seg(N, D), seg(D, C), seg(C, B), seg(B, A), seg(D, B), seg(D, M), seg(C, M), seg(M, K), seg(M, N), seg(A, M), seg(B, M),
    segDash(N, E),
    angleMark(D, C, B, 34), angleMark(D, B, M, 46), angleMark(D, M, A, 34),
    so(D, C, B, '1', 62), so(D, B, M, '2', 70), so(D, M, A, '3', 62),
    angleMark(A, B, M, 30), so(A, B, M, '1', 56),
    angleMark(B, A, M, 30), so(B, A, M, '1', 56),
    angleMark(B, A, D, 44), so(B, A, D, '2', 66),
    angleMark(C, B, E, 34), so(C, B, E, '1', 60),
    rightAngle(E, C, B, 12),
    dot(N), dot(M), dot(D), dot(C), dot(B), dot(A), dot(K), dot(E),
    label(N, 'N', -16, -4), label(M, 'M', 0, -14), label(A, 'A', -18, 6), label(K, 'K', -16, 26), label(B, 'B', 18, -6),
    label(E, 'E', 2, 28), label(D, 'D', -18, 20), label(C, 'C', 18, 20),
  ], OPT)
}

// ── HH00091010_lg — hình chữ nhật ABCD; M trong (a) / ngoài (b) hình chữ nhật; E, F, G, H = hình chiếu của M trên AD, BC, AB, CD.
//    Nét: hình chữ nhật, MA, MB, MC, MD; nét đứt qua M (EF, GH) / (b) E–M–F, E–A, F–B, M–H.
{
  const w = 185, h = 134, X0 = 268
  const capY = h + 56
  // (a) M nằm trong
  {
    const A = P(0, 0), B = P(w, 0), C = P(w, h), D = P(0, h)
    const M = P(0.76 * w, 0.5 * h)
    const E = P(0, M.y), F = P(w, M.y), G = P(M.x, 0), H = P(M.x, h)
    gt(dist(M, A) ** 2 + dist(M, C) ** 2, dist(M, B) ** 2 + dist(M, D) ** 2, 'MA² + MC² = MB² + MD²')
    gt(dist(M, A) ** 2 + dist(M, C) ** 2, dist(M, E) ** 2 + dist(M, G) ** 2 + dist(M, F) ** 2 + dist(M, H) ** 2, 'MA² + MC² = ME² + MG² + MF² + MH²')
    var Ba = [A, B, C, D, E, F, G, H, M, P(w / 2, capY)]
    var bodyA = [
      seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(M, A), seg(M, B), seg(M, C), seg(M, D),
      segDash(E, F), segDash(G, H),
      dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(G), dot(H), dot(M),
      label(A, 'A', -16, -8), label(B, 'B', 16, -8), label(C, 'C', 16, 26), label(D, 'D', -16, 26),
      label(E, 'E', -16, 8), label(F, 'F', 16, 8), label(G, 'G', 0, -14), label(H, 'H', 0, 34), label(M, 'M', -18, 26),
      num(P(w / 2, capY), 'a)', 0, 0),
    ]
  }
  // (b) M nằm ngoài (phía trên AB)
  {
    const A = P(X0, 0), B = P(X0 + w, 0), C = P(X0 + w, h), D = P(X0, h)
    const M = P(X0 + 0.58 * w, -92)
    const E = P(X0, M.y), F = P(X0 + w, M.y), G = P(M.x, 0), H = P(M.x, h)
    gt(dist(M, A) ** 2 + dist(M, C) ** 2, dist(M, B) ** 2 + dist(M, D) ** 2, 'MA² + MC² = MB² + MD² (ngoài)')
    gt(dist(M, A) ** 2 + dist(M, C) ** 2, dist(M, E) ** 2 + dist(A, E) ** 2 + dist(M, F) ** 2 + dist(C, F) ** 2, 'MA² + MC² = ME² + AE² + MF² + CF²')
    var Bb = [A, B, C, D, E, F, G, H, M, P(X0 + w / 2, capY)]
    var bodyB = [
      seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(M, A), seg(M, B), seg(M, C), seg(M, D),
      segDash(E, F), segDash(E, A), segDash(F, B), segDash(M, H),
      dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(G), dot(H), dot(M),
      label(A, 'A', -16, 6), label(B, 'B', 18, 6), label(C, 'C', 16, 26), label(D, 'D', -16, 26),
      label(E, 'E', -16, -4), label(F, 'F', 16, -4), label(G, 'G', -14, 26), label(H, 'H', 0, 34), label(M, 'M', 0, -14),
      num(P(X0 + w / 2, capY), 'b)', 0, 0),
    ]
  }
  hinh('HH00091010_lg', [...Ba, ...Bb], [...bodyA, ...bodyB], OPT)
}

// ── HH00091011_lg — tam giác ABC; hình chữ nhật ABDE, ACFG, BCHK dựng ra ngoài; M = giao các trung trực của DK, FH (và EG).
//    Nét: 3 hình chữ nhật, EG, DK, FH; MA, MB, MC (liền); ME, MG, MD, MK, MH, MF (nét đứt); M tới trung điểm DK, FH (liền, ô vuông).
{
  const k = 0.88
  const A = P(197 * k, 134 * k), B = P(142 * k, 281 * k), C = P(370 * k, 281 * k)
  const ngoai = (a, b, c, len) => {                          // véc-tơ vuông góc với ab, hướng RA PHÍA NGOÀI (xa c), dài len
    const d = vec(a, b), l = Math.hypot(d.x, d.y)
    let n = P(-d.y / l * len, d.x / l * len)
    if (n.x * (c.x - a.x) + n.y * (c.y - a.y) > 0) n = P(-n.x, -n.y)
    return n
  }
  const nAB = ngoai(A, B, C, 0.61 * dist(A, B)), nAC = ngoai(A, C, B, 0.33 * dist(A, C)), nBC = ngoai(B, C, A, 0.63 * dist(B, C))
  const D = add(B, nAB), E = add(A, nAB)                     // ABDE
  const F = add(C, nAC), G = add(A, nAC)                     // ACFG
  const H = add(C, nBC), K = add(B, nBC)                     // BCHK
  for (const [p, q, r, s] of [[A, B, B, D], [B, D, D, E], [A, C, C, F], [C, F, F, G], [B, C, C, H], [C, H, H, K]])
    gt(dot2(p, q, r, s), 0, 'các cạnh hình chữ nhật vuông góc')
  gt(dist(A, E), dist(B, D), 'ABDE là hình chữ nhật'); gt(dist(A, G), dist(C, F), 'ACFG là hình chữ nhật'); gt(dist(B, K), dist(C, H), 'BCHK là hình chữ nhật')
  const Q1 = mid(D, K), Q2 = mid(F, H)
  const M = inter(Q1, rot(D, Q1, 90), Q2, rot(F, Q2, 90))
  gt(dist(M, D), dist(M, K), 'MD = MK'); gt(dist(M, F), dist(M, H), 'MF = MH'); gt(dist(M, E), dist(M, G), 'ME = MG (hệ quả cần chứng minh)')
  hinh('HH00091011_lg', [A, B, C, D, E, F, G, H, K, M], [
    seg(A, B), seg(B, D), seg(D, E), seg(E, A), seg(A, C), seg(C, F), seg(F, G), seg(G, A), seg(B, C), seg(C, H), seg(H, K), seg(K, B),
    seg(E, G), seg(D, K), seg(F, H),
    seg(M, A), seg(M, B), seg(M, C), seg(M, Q1), seg(M, Q2),
    segDash(M, E), segDash(M, G), segDash(M, D), segDash(M, K), segDash(M, H), segDash(M, F),
    rightAngle(Q1, D, M, 12), rightAngle(Q2, F, M, 12),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(G), dot(H), dot(K), dot(M),
    label(A, 'A', -2, -14), label(B, 'B', -20, 10), label(C, 'C', 12, 18), label(D, 'D', -20, 4), label(E, 'E', -16, -6),
    label(G, 'G', 6, -14), label(F, 'F', 20, -2), label(K, 'K', -8, 30), label(H, 'H', 14, 30), label(M, 'M', 2, 32),
  ], OPT)
}

await xuatTat(RA)
