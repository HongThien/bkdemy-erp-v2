// Vẽ lại hình — gói HH00094-1 (Hình học 8T: Đối xứng trục, đối xứng tâm; 4 hình LỜI GIẢI).
//   node scripts/anh/ve_lai/HH00094-1.mjs [<thu_muc_ra>]
import { P, seg, segDash, tick, dot, label, hinh, xuatTat,
  mid, inter, lerp, add, vec, ray, goc, dist, doiXung } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00094-1/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.01, m)
const OPT = { pad: 36, padDuoi: 42 }
const sc = (p, s) => P(p.x * s, p.y * s)
const un = (v) => { const l = Math.hypot(v.x, v.y); return P(v.x / l, v.y / l) }
/** đoạn trên đường thẳng qua p theo hướng u, kéo e1 về phía −u và e2 về phía +u */
const lineThru = (p, u, e1, e2) => { const w = un(u); return [P(p.x - w.x * e1, p.y - w.y * e1), P(p.x + w.x * e2, p.y + w.y * e2)] }
const song = (p, q, r, t) => Math.abs((q.x - p.x) * (t.y - r.y) - (q.y - p.y) * (t.x - r.x)) < 1e-6 * dist(p, q) * dist(r, t)

// ── HH00094001_lg — tam giác ABC; D, E, F trung điểm BC, CA, AB; O bất kì; A′, B′, C′ đối xứng O qua D, E, F.
//    Liền: tam giác, AA′, BB′, CC′, AB′, B′C, BA′, BC′ · đứt: OA′, OB′, OC′.
{
  const A = P(168, 35), B = P(102, 258), C = P(372, 262), O = P(220, 170)
  const D = mid(B, C), E = mid(A, C), F = mid(A, B)
  const A1 = doiXung(O, D), B1 = doiXung(O, E), C1 = doiXung(O, F)
  gt(dist(D, O), dist(D, A1), 'D trung điểm OA′')
  const Q = mid(A, A1)
  gt(dist(Q, B), dist(Q, B1), 'AA′, BB′ cắt nhau tại trung điểm (hệ quả)'); gt(dist(Q, C), dist(Q, C1), 'CC′ qua trung điểm (hệ quả)')
  hinh('HH00094001_lg', [A, B, C, A1, B1, C1], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, A1), seg(B, B1), seg(C, C1), seg(A, B1), seg(B1, C), seg(B, A1), seg(B, C1),
    segDash(O, A1), segDash(O, B1), segDash(O, C1),
    dot(A), dot(B), dot(C), dot(O), dot(D), dot(E), dot(F), dot(A1), dot(B1), dot(C1),
    label(A, 'A', 0, -14), label(B, 'B', -18, 18), label(C, 'C', 20, 18), label(O, 'O', -2, -14),
    label(D, 'D', 16, 24), label(E, 'E', 8, -14), label(F, 'F', -18, -12),
    label(A1, 'A′', 0, 34), label(B1, 'B′', 22, -2), label(C1, 'C′', -22, 0),
  ], OPT)
}

// ── HH00094002_lg — góc xOy, M trong góc; AB ∋ M, M trung điểm AB (A ∈ Ox, B ∈ Oy); D ∈ Oy với MD ∥ Ox;
//    N đối xứng O qua M, NA ∥ Oy, NB ∥ Ox; đường thẳng A′B′ bất kì qua M; E đối xứng B′ qua M (E ∈ MA′).
//    Liền: Ox, Oy, AB, A′B′ · đứt: OMN, DM, NA, NB.
{
  const s = 1.0, th = 50
  const O = P(0, 0)
  const m = 184
  const M = P(m, -m * Math.tan(th * Math.PI / 180) / 2)
  const A = P(m, 0), B = P(m, -m * Math.tan(th * Math.PI / 180))
  const Ay = ray(O, th, 330)
  const A1 = P(339, 0)
  const B1 = inter(M, A1, O, Ay)
  const D = inter(M, add(M, P(1, 0)), O, Ay)
  const N = doiXung(O, M), E = doiXung(B1, M)
  gt(goc(O, A, B), th, 'B ∈ Oy'); gt(dist(M, A), dist(M, B), 'M trung điểm AB')
  gt(dist(B1, M), dist(M, E), 'ME = MB′')
  ok(song(N, A, O, Ay), 'NA ∥ Oy'); ok(song(N, B, O, A1), 'NB ∥ Ox')
  ok(B1.y > B.y && B1.y < D.y, 'thứ tự trên Oy: O, D, B′, B')
  const Ox = P(405, 0)
  hinh('HH00094002_lg', [O, Ox, Ay, N, B], [
    seg(O, Ox), seg(O, Ay), seg(A, B), seg(B1, A1),
    segDash(O, N), segDash(D, M), segDash(N, A), segDash(N, B),
    dot(O), dot(A), dot(B), dot(M), dot(D), dot(B1), dot(A1), dot(N), dot(E),
    label(O, 'O', -16, 18), label(A, 'A', 0, 30), label(A1, 'A′', 4, 30), label(Ox, 'x', 14, 6),
    label(Ay, 'y', 16, -4), label(B, 'B', -16, 4), label(B1, 'B′', -22, 0), label(D, 'D', -20, 8),
    label(M, 'M', 27, 7), label(N, 'N', 14, -10), label(E, 'E', 12, 22),
  ], { pad: 38, padDuoi: 44 })
}

// ── HH00094003_lg — tam giác ABC, trọng tâm G, M trung điểm BC; B ∈ d1, C ∈ d2; d1′ đối xứng d1 qua M (qua C).
//    Liền: tam giác, AM, d1, d2, d1′ · gạch BM = MC.
{
  const s = 0.88
  const A = sc(P(160, 55), s), B = sc(P(80, 258), s), C = sc(P(355, 266), s)
  const M = mid(B, C), G = lerp(A, M, 2 / 3)
  gt(dist(A, G), 2 * dist(G, M), 'AG = 2GM')
  const u1 = P(105, 225), u2 = P(65, -94)
  const [d1a, d1b] = lineThru(B, u1, 122 * s, 127 * s)
  const [d2a, d2b] = lineThru(C, u2, 112 * s, 114 * s)
  const [e1a, e1b] = lineThru(C, u1, 160 * s, 120 * s)         // d1′ // d1 (đối xứng d1 qua điểm M)
  const sub = (t) => `<tspan dy="6" font-size="17">${t}</tspan>`
  hinh('HH00094003_lg', [A, B, C, d1a, d1b, d2a, d2b, e1a, e1b], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, M), seg(d1a, d1b), seg(d2a, d2b), seg(e1a, e1b),
    tick(B, M, 1), tick(M, C, 1),
    dot(A), dot(B), dot(C), dot(M), dot(G),
    label(A, 'A', 0, -14), label(B, 'B', -20, 8), label(C, 'C', 24, 8), label(M, 'M', 0, 30), label(G, 'G', 16, 6),
    label(d1a, `d${sub(1)}`, -16, 0), label(d2b, `d${sub(2)}`, 20, 8), label(e1b, `d′${sub(1)}`, 24, 4),
  ], OPT)
}

// ── HH00094004_lg — tứ giác ABCD, O trong; hình bình hành EFGH tâm O, E ∈ AB, F ∈ AD, G ∈ CD, H ∈ BC;
//    a đối xứng AB qua O (đi qua G), b đối xứng AD qua O (đi qua H).  Liền: ABCD, EFGH, a, b · đứt: EG, FH.
{
  const s = 1.15
  const A = sc(P(67, 118), s), B = sc(P(268, 70), s), C = sc(P(318, 308), s), D = sc(P(38, 308), s), O = sc(P(170, 204), s)
  const Ar = doiXung(A, O), Br = doiXung(B, O), Dr = doiXung(D, O)
  const G = inter(Ar, Br, C, D), H = inter(Ar, Dr, B, C)
  const E = doiXung(G, O), F = doiXung(H, O)
  const tr = (p, a, b) => { const t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / dist(a, b) ** 2; return t > 0 && t < 1 }
  ok(tr(E, A, B) && tr(F, A, D) && tr(G, D, C) && tr(H, B, C), 'E, F, G, H nằm trong cạnh')
  const u = un(vec(A, B)), w = un(vec(A, D))
  const [aS, aE] = lineThru(G, u, 95 * s, 78 * s)
  const [bS, bE] = lineThru(H, w, 85 * s, 82 * s)           // b: đầu trên xa hơn (hướng D→A đi lên)
  console.log('  [004] E,F,G,H =', [E, F, G, H].map((p) => `(${(p.x / s).toFixed(0)},${(p.y / s).toFixed(0)})`).join(' '), ' (ảnh cũ ~ (142,102) (50,229) (197,307) (290,177))')
  hinh('HH00094004_lg', [A, B, C, D, aS, aE, bS, bE], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(E, F), seg(F, G), seg(G, H), seg(H, E),
    segDash(E, G), segDash(F, H), seg(aS, aE), seg(bS, bE),
    dot(O), dot(E), dot(F), dot(G), dot(H),
    label(A, 'A', -16, -8), label(B, 'B', 4, -14), label(C, 'C', 20, 22), label(D, 'D', -18, 22),
    label(E, 'E', 0, -14), label(F, 'F', -20, 6), label(G, 'G', 6, 34), label(H, 'H', 22, 8), label(O, 'O', 14, -10),
    label(aS, 'a', -10, 24), label(bS, 'b', 20, 0),
  ], OPT)
}

await xuatTat(RA)
