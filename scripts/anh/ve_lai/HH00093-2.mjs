// Vẽ lại hình — gói HH00093-2 (Hình học 8T: Hình vuông; 7 hình LỜI GIẢI).
//   node scripts/anh/ve_lai/HH00093-2.mjs [<thu_muc_ra>]
import { P, seg, segDash, rightAngle, dot, label, num, hinh, xuatTat,
  mid, foot, inter, add, vec, goc, dist, doiXung, rot, reflect, bisector } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00093-2/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.01, m)
const OPT = { pad: 34, padDuoi: 40 }
const sc = (p, s) => P(p.x * s, p.y * s)
const un = (v) => { const l = Math.hypot(v.x, v.y); return P(v.x / l, v.y / l) }
/** đoạn trên đường thẳng qua p theo hướng u, kéo e1 về phía −u và e2 về phía +u */
const lineThru = (p, u, e1, e2) => { const w = un(u); return [P(p.x - w.x * e1, p.y - w.y * e1), P(p.x + w.x * e2, p.y + w.y * e2)] }
/** Tâm hình vuông dựng NGOÀI tam giác trên đoạn p1p2 (ref = đỉnh đối diện) */
const tamNgoai = (p1, p2, ref) => { const m = mid(p1, p2), c1 = rot(p2, m, 90), c2 = rot(p2, m, -90); return dist(c1, ref) > dist(c2, ref) ? c1 : c2 }

// ── HH00093009_lg — hình vuông ABCD (B trên-trái, C trên-phải, A dưới-trái, D dưới-phải như ảnh cũ), M ∈ CD,
//    BI phân giác góc ABM (I ∈ AD), MH ⊥ BI cắt tia BA ở E (E nằm ngoài, dưới A), MK ⊥ AB. Nét đứt: MI, MK. Vuông: K.
{
  const S = 270
  const B = P(0, 0), C = P(S, 0), A = P(0, S), D = P(S, S)
  const M = P(S, 0.42 * S)
  const bs = bisector(B, A, M, 300)
  const I = inter(B, bs, A, D)
  const dB = vec(B, bs), pv = P(-dB.y, dB.x)
  const E = inter(M, add(M, pv), A, B)
  const H = inter(B, I, M, E)
  const K = foot(M, A, B)
  gt(goc(B, A, I), goc(B, I, M), 'BI phân giác góc ABM')
  gt(goc(H, M, B), 90, 'MH ⊥ BI')
  gt(dist(M, E), dist(B, I), 'ME = BI (hệ quả lời giải)')
  ok(E.y > A.y, 'E nằm ngoài, dưới A')
  hinh('HH00093009_lg', [A, B, C, D, E, M], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(B, E), seg(B, M), seg(B, I), seg(M, E), segDash(M, I), segDash(M, K),
    rightAngle(K, M, A, 12),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(H), dot(I), dot(K), dot(M),
    label(B, 'B', -16, -8), label(C, 'C', 16, -8), label(K, 'K', -20, 8), label(M, 'M', 20, 8),
    label(H, 'H', -18, 6), label(A, 'A', -20, 2), label(E, 'E', -20, 12), label(I, 'I', 0, 30), label(D, 'D', 18, 24),
  ], OPT)
}

// ── HH00093010_lg — tam giác ABC, D, E, F trung điểm BC, AC, AB; A′, B′, C′ tâm các hình vuông dựng ngoài trên BC, AC, AB.
//    Nét liền: tam giác, AA′, DA′, EB′, FC′, C′B′ · nét đứt: FA′, FB′. (Ảnh cũ không vẽ các hình vuông.)
{
  const s = 0.62
  const A = sc(P(390, 200), s), B = sc(P(298, 490), s), C = sc(P(650, 520), s)
  const D = mid(B, C), E = mid(A, C), F = mid(A, B)
  const A1 = tamNgoai(B, C, A), B1 = tamNgoai(A, C, B), C1 = tamNgoai(A, B, C)
  gt(dist(F, A1), dist(F, B1), 'FA′ = FB′'); gt(goc(F, A1, B1), 90, 'FA′ ⊥ FB′')
  gt(dist(B1, C1), dist(A, A1), "B′C′ = AA′")
  gt(dist(D, A1), dist(B, C) / 2, 'DA′ = BC/2'); gt(goc(D, A1, B), 90, 'DA′ ⊥ BC')
  hinh('HH00093010_lg', [A, B, C, A1, B1, C1], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, A1), seg(D, A1), seg(E, B1), seg(F, C1), seg(C1, B1), segDash(F, A1), segDash(F, B1),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(A1), dot(B1), dot(C1),
    label(A, 'A', 0, -14), label(B, 'B', -16, 18), label(C, 'C', 18, 20), label(D, 'D', 18, 22),
    label(E, 'E', 20, 12), label(F, 'F', -18, 8),
    label(A1, 'A′', 0, 34), label(B1, 'B′', 22, -4), label(C1, 'C′', -22, 0),
  ], { pad: 42, padDuoi: 40 })
}

// ── HH00093011_lg — ABC (BC ngang), hình vuông ABDE, ACFG dựng ngoài, tâm M, N; I = trung điểm EG, K = trung điểm BC;
//    P sao cho AEPG là hình bình hành (A là trung điểm IP), H chân đường cao hạ từ A.
//    Liền: AB, AC, BC, các hình vuông, AE–EP–PG–GA, KM, MI, IN, NK · đứt: PH (qua I, A), EI–IG, EB, GC.
{
  const s = 0.42
  const B = sc(P(390, 850), s), C = sc(P(880, 850), s), A = sc(P(525, 570), s)
  const nB = tamNgoai(A, B, C), nC = tamNgoai(A, C, B)
  const vAB = vec(mid(A, B), nB), vAC = vec(mid(A, C), nC)       // nửa véc-tơ pháp của hình vuông
  const D = add(B, sc(vAB, 2)), E = add(A, sc(vAB, 2))
  const F = add(C, sc(vAC, 2)), G = add(A, sc(vAC, 2))
  const M = nB, N = nC
  const K = mid(B, C), I = mid(E, G), H = foot(A, B, C)
  const Pp = add(E, vec(A, G))
  gt(dist(M, K), dist(K, N), 'KM = KN'); gt(goc(K, M, N), 90, 'KM ⊥ KN')
  gt(dist(K, M), dist(M, I), 'KMIN hình vuông'); gt(dist(M, I), dist(I, N), 'KMIN hình vuông')
  gt(dist(I, A), dist(A, Pp) / 2, 'A trung điểm IP'); gt(goc(A, H, I), 180, 'H, A, I, P thẳng hàng')
  gt(goc(B, A, E), 45, 'tâm M nằm trên BE')
  hinh('HH00093011_lg', [A, B, C, D, E, F, G, Pp], [
    seg(A, B), seg(A, C), seg(B, C), seg(B, D), seg(D, E), seg(E, A), seg(C, F), seg(F, G), seg(G, A),
    seg(E, Pp), seg(Pp, G), seg(M, K), seg(M, I), seg(I, N), seg(N, K),
    segDash(Pp, H), segDash(E, G), segDash(E, B), segDash(G, C),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(G), dot(H), dot(I), dot(K), dot(M), dot(N), dot(Pp),
    label(Pp, 'P', 0, -14), label(G, 'G', 18, -6), label(F, 'F', 20, 8), label(N, 'N', 18, 10), label(C, 'C', 4, 28),
    label(K, 'K', 4, 28), label(H, 'H', 0, 28), label(B, 'B', -2, 28), label(D, 'D', -20, 8), label(E, 'E', -16, -4),
    label(M, 'M', -18, 6), label(I, 'I', -16, -4), label(A, 'A', 20, 12),
  ], OPT)
}

// ── HH00093012_lg — tứ giác ABCD, E, F, G, H tâm các hình vuông dựng ngoài trên AB, BC, CD, DA;
//    K, I trung điểm AC, BD; M, N trung điểm HF, EG.  Liền: ABCD, HF, KE, KF, KG, KH, IMKN · đứt: AC, BD, EG.
{
  const s = 0.86
  const A = sc(P(172.5, 135), s), B = sc(P(309, 102.5), s), C = sc(P(372.5, 305), s), D = sc(P(127.5, 305), s)
  const cen = trongTam([A, B, C, D])
  const E = tamNgoai(A, B, cen), F = tamNgoai(B, C, cen), G = tamNgoai(C, D, cen), H = tamNgoai(D, A, cen)
  const K = mid(A, C), I = mid(B, D), M = mid(H, F), N = mid(E, G)
  gt(dist(E, G), dist(F, H), 'EG = FH')
  gt(goc(inter(E, G, F, H), E, F), 90, 'EG ⊥ FH')
  gt(dist(K, E), dist(K, F), 'KE = KF'); gt(goc(K, E, F), 90, 'KE ⊥ KF')
  gt(dist(I, M), dist(M, K), 'IMKN hình vuông'); gt(dist(M, K), dist(K, N), 'IMKN hình vuông')
  gt(dist(K, N), dist(N, I), 'IMKN hình vuông'); gt(goc(K, M, N), 90, 'góc MKN vuông')
  hinh('HH00093012_lg', [A, B, C, D, E, F, G, H], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), segDash(A, C), segDash(B, D), segDash(E, G), seg(H, F),
    seg(K, E), seg(K, F), seg(K, G), seg(K, H),
    seg(I, M), seg(M, K), seg(K, N), seg(N, I),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(G), dot(H), dot(I), dot(K), dot(M), dot(N),
    label(A, 'A', -14, -8), label(B, 'B', 14, -8), label(C, 'C', 16, 22), label(D, 'D', -16, 22),
    label(E, 'E', 0, -14), label(F, 'F', 18, 4), label(G, 'G', 0, 34), label(H, 'H', -18, 4),
    label(M, 'M', 6, -14), label(I, 'I', -16, -12), label(N, 'N', -14, 22), label(K, 'K', 26, 8),
  ], OPT)
  console.log('  [012] I,K,M,N =', [I, K, M, N].map((p) => `(${p.x.toFixed(0)},${p.y.toFixed(0)})`).join(' '))
}

// ── HH00093013_lg — hình vuông ABCD; E ∈ AD, F ∈ BC, G ∈ AB, H ∈ CD (4 điểm cho trước), F′ hình chiếu của F lên AD,
//    G′ hình chiếu của G lên CD; GI ⊥ EF (I ∈ EF) cắt CD ở K, GK = EF.  Liền: ABCD, EF, GK · đứt: FF′, GG′ · vuông: I.
{
  const S = 240
  const A = P(0, 0), B = P(S, 0), C = P(S, S), D = P(0, S)
  const E = P(0, 0.19 * S), F = P(S, 0.57 * S), G = P(0.6 * S, 0), H = P(0.78 * S, S)
  const Fp = P(0, F.y), Gp = P(G.x, S)
  const d = F.y - E.y
  const K = add(G, P(-d, S))                              // GK ⊥ EF, K ∈ CD
  const I = inter(E, F, G, K)
  gt(goc(I, G, F), 90, 'GK ⊥ EF'); gt(dist(G, K), dist(E, F), 'GK = EF'); gt(K.y, S, 'K ∈ CD')
  hinh('HH00093013_lg', [A, B, C, D, E, F, K], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(E, F), seg(G, K), segDash(F, Fp), segDash(G, Gp),
    rightAngle(I, G, F, 11),
    dot(E), dot(F), dot(G), dot(H), dot(K), dot(Fp), dot(Gp), dot(I),
    label(A, 'A', -16, -10), label(B, 'B', 16, -10), label(C, 'C', 18, 30), label(D, 'D', -16, 30),
    label(E, 'E', -20, 4), label(F, 'F', 20, 6), label(G, 'G', 0, -14), label(H, 'H', 6, 32), label(K, 'K', -2, 32),
    label(Fp, 'F′', -22, 6), label(Gp, 'G′', -6, 32), label(I, 'I', -14, -8),
  ], { pad: 36, padDuoi: 42 })
}

// ── HH00093014_lg — hình vuông ABCD tâm O; E, F′ ∈ AB; F, E′ ∈ CD; E′ đối xứng E, F′ đối xứng F qua O.
//    Liền: ABCD, AC, BD · đứt: EE′, FF′ (qua O).
{
  const S = 280
  const A = P(0, 0), B = P(S, 0), C = P(S, S), D = P(0, S)
  const O = mid(A, C)
  const E = P(0.32 * S, 0), F = P(0.39 * S, S)
  const E1 = doiXung(E, O), F1 = doiXung(F, O)
  gt(E1.y, S, 'E′ ∈ CD'); gt(F1.y, 0, 'F′ ∈ AB')
  hinh('HH00093014_lg', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), segDash(E, E1), segDash(F, F1),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F1), dot(F), dot(E1), dot(O),
    label(A, 'A', -16, -10), label(B, 'B', 16, -10), label(C, 'C', 16, 26), label(D, 'D', -16, 26),
    label(E, 'E', 0, -14), label(F1, 'F′', 2, -14), label(F, 'F', 0, 34), label(E1, 'E′', 2, 34), label(O, 'O', -20, 8),
  ], OPT)
}

// ── HH00093015_lg — hình vuông ABCD có đường chéo BD nằm trên d; A ∈ a, C ∈ b; a′ đối xứng a qua d (đứt) đi qua C;
//    AC ⊥ BD tại O (đứt, có ký hiệu vuông).  Liền: a, b, d, ABCD.
{
  const O = P(174, 175), h = 105
  const A = P(O.x, O.y - h), C = P(O.x, O.y + h), B = P(O.x - h, O.y), D = P(O.x + h, O.y)
  const ua = un(P(295, 60)), ub = un(P(0.65, 1))
  const X = inter(A, add(A, ua), C, add(C, ub))             // a ∩ b
  const ua2 = un(P(ua.x, -ua.y))                            // hướng a′ (đối xứng a qua d nằm ngang)
  gt(goc(A, O, B), 45, 'ABCD hình vuông'); gt(goc(O, B, D), 180, 'B, O, D thẳng hàng')
  const a1 = reflect(A, P(0, O.y), P(100, O.y))
  gt(a1.y, C.y, 'A′ đối xứng A qua d = C'); gt(a1.x, C.x, 'A′ đối xứng A qua d = C')
  const aEnd = P(A.x + ua.x * 165, A.y + ua.y * 165)
  const [a1s, a1e] = lineThru(C, ua2, 120, 170)
  const bEnd = P(C.x + ub.x * 90, C.y + ub.y * 90)
  const dS = P(B.x - 65, O.y), dE = P(D.x + 72, O.y)
  hinh('HH00093015_lg', [X, aEnd, a1s, a1e, bEnd, dS, dE], [
    seg(X, aEnd), seg(X, bEnd), seg(dS, dE), segDash(a1s, a1e),
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), segDash(A, C),
    rightAngle(O, A, D, 12),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', 0, -14), label(B, 'B', -16, 30), label(D, 'D', 16, 24), label(C, 'C', -12, 36),
    label(aEnd, 'a', 16, 10), label(dE, 'd', -2, -12), label(a1e, 'a′', -6, 28), label(bEnd, 'b', 14, 20),
  ], OPT)
}

function trongTam(pts) { return P(pts.reduce((s, p) => s + p.x, 0) / pts.length, pts.reduce((s, p) => s + p.y, 0) / pts.length) }

await xuatTat(RA)
