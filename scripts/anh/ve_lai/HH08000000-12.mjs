// Vẽ lại hình — gói HH08000000-12 (Hình học 8, hình lời giải HHC002666..HHC002669).
//   node scripts/anh/ve_lai/HH08000000-12.mjs [<thu_muc_ra>]
import { P, seg, segDash, rightAngle, tick, dot, label, hinh, xuatTat,
  mid, foot, inter, add, vec, goc, dist, doiXung } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH08000000-12/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.01, m)
const OPT = { pad: 32, padDuoi: 38 }

// ── HHC002666_lg — ABC vuông tại A (AB < AC), AH ⊥ BC; M trung điểm HC; D ∈ tia đối MA, MD = MA;
//    N, K trung điểm AH, CD.  Nét: AB, BC (B–H–M–C), AH, AC, AD (qua M), NC, N–M–K, HK, HD, CD (C–K–D).
//    Gạch: AN = NH, CK = KD (3); HM = MC (2); AM = MD (1).  Vuông: A, H.
{
  const AH = 170, HC = 260
  const H = P(0, 0), C = P(HC, 0), A = P(0, -AH), B = P(-AH * AH / HC, 0)
  gt(goc(A, B, C), 90, 'góc A vuông')
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  const M = mid(H, C), D = doiXung(A, M), N = mid(A, H), K = mid(C, D)
  gt(dist(M, A), dist(M, D), 'MD = MA')
  gt(dist(A, N), dist(N, H), 'N trung điểm AH'); gt(dist(C, K), dist(K, D), 'K trung điểm CD')
  gt(dist(A, H), dist(C, D), 'AH = CD (hệ quả: AHDC hình bình hành)')
  gt(dist(N, M), dist(M, K), 'M trung điểm NK (hệ quả)')
  hinh('HHC002666_lg', [A, B, C, D, H, M, N, K], [
    seg(A, B), seg(B, C), seg(A, H), seg(A, C), seg(A, D), seg(N, C), seg(N, K), seg(H, K), seg(H, D), seg(C, D),
    tick(A, N, 3), tick(N, H, 3), tick(H, M, 2), tick(M, C, 2), tick(A, M, 1), tick(M, D, 1), tick(C, K, 3), tick(K, D, 3),
    rightAngle(A, B, C, 14), rightAngle(H, A, C, 14),
    dot(A), dot(B), dot(C), dot(D), dot(H), dot(M), dot(N), dot(K),
    label(A, 'A', 0, -14), label(B, 'B', -4, 28), label(C, 'C', 18, -10), label(D, 'D', 14, 30), label(H, 'H', -16, 26),
    label(M, 'M', 4, -16), label(N, 'N', -18, 6), label(K, 'K', 20, 8),
  ], OPT)
}

// ── HHC002667_lg — ABC vuông tại A (AB ≥ AC), E trung điểm BC; D, H hình chiếu của E trên AB, AC; F: D trung điểm EF; O = AD ∩ HF.
//    Nét: C–H–A, A–O–D–B, C–E–B, HE, E–D–F, AF, HD, H–O–F.  Gạch: CE = EB (1), ED = DF (2).  Vuông: A, H, D.
{
  const A = P(0, 0), B = P(330, 0), C = P(0, -198)
  ok(dist(A, B) >= dist(A, C), 'AB ≥ AC')
  const E = mid(B, C), D = foot(E, A, B), H = foot(E, A, C), F = doiXung(E, D)
  const O = inter(A, D, H, F)
  gt(goc(D, E, A), 90, 'ED ⊥ AB'); gt(goc(H, E, A), 90, 'EH ⊥ AC')
  gt(dist(E, D), dist(D, F), 'D trung điểm EF')
  gt(dist(O, A), dist(O, D), 'O trung điểm AD (hệ quả)'); gt(dist(O, H), dist(O, F), 'O trung điểm HF (hệ quả)')
  gt(dist(D, A), dist(D, B), 'D trung điểm AB (hệ quả)')
  hinh('HHC002667_lg', [A, B, C, D, E, F, H, O], [
    seg(C, A), seg(A, B), seg(C, B), seg(H, E), seg(E, F), seg(A, F), seg(H, D), seg(H, F),
    tick(C, E, 1), tick(E, B, 1), tick(E, D, 2), tick(D, F, 2),
    rightAngle(A, C, B, 14), rightAngle(H, A, E, 12), rightAngle(D, A, E, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(H), dot(O),
    label(C, 'C', 0, -14), label(H, 'H', -18, 6), label(E, 'E', 18, -10), label(B, 'B', 22, 8),
    label(A, 'A', -18, 24), label(O, 'O', -2, 30), label(D, 'D', 20, 26), label(F, 'F', 0, 34),
  ], OPT)
}

// ── HHC002668_lg — ABC vuông tại A (AB < AC); M ∈ BC (BM > MC); N, D hình chiếu của M trên AB, AC; P ∈ tia đối NM, NM = NP;
//    Q hình chiếu của M trên AP (A nằm giữa Q và P); O = QM ∩ ND.
//    Nét: B–N–A, A–D–C, BC (qua M), P–N–M, N–O–D, P–A–Q, Q–O–M, MD.  Gạch: PN = NM (2).  Vuông: A, N, D, Q.
{
  const s = 0.45
  const A = P(0, 0), B = P(0, -500 * s), C = P(600 * s, 0)
  const N = P(0, -200 * s), D = P(360 * s, 0)
  const M = P(D.x, N.y)
  const M2 = inter(B, C, N, M)
  gt(dist(M, M2), 0, 'M ∈ BC')
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  ok(dist(B, M) > dist(M, C), 'BM > MC')
  gt(goc(N, M, A), 90, 'MN ⊥ AB'); gt(goc(D, M, A), 90, 'MD ⊥ AC')
  const Pp = P(2 * N.x - M.x, N.y)
  gt(dist(N, M), dist(N, Pp), 'NM = NP')
  const Q = foot(M, A, Pp)
  gt(goc(Q, M, A), 90, 'MQ ⊥ AP')
  ok(dist(A, Pp) + dist(A, Q) - dist(Pp, Q) < 0.01, 'A nằm giữa P và Q')
  const O = inter(Q, M, N, D)
  gt(dist(O, Q), dist(O, M), 'O trung điểm QM (hệ quả)')
  gt(goc(Q, A, N), goc(D, A, N), 'AQN = ADN (hệ quả)')
  hinh('HHC002668_lg', [A, B, C, D, M, N, Pp, Q, O], [
    seg(B, A), seg(A, C), seg(B, C), seg(Pp, M), seg(N, D), seg(Pp, Q), seg(Q, M), seg(M, D),
    tick(Pp, N, 2), tick(N, M, 2),
    rightAngle(A, B, C, 14), rightAngle(N, A, M, 14), rightAngle(D, A, M, 14), rightAngle(Q, A, M, 14),
    dot(A), dot(B), dot(C), dot(D), dot(M), dot(N), dot(Pp), dot(Q), dot(O),
    label(B, 'B', 0, -14), label(N, 'N', 16, -10), label(M, 'M', 16, -10), label(C, 'C', 20, 8),
    label(D, 'D', 12, 28), label(A, 'A', -16, 22), label(Q, 'Q', 0, 34), label(Pp, 'P', -14, 2), label(O, 'O', -18, -12),
  ], OPT)
}

// ── HHC002669_lg — ABC vuông tại A; M trung điểm BC; D: M trung điểm AD (ABDC chữ nhật, C trên A, D trên B); E ∈ tia đối CA, CE = CA;
//    O trung điểm CD.  Nét: A–C–E, AB, BD, C–O–D, AD, CB, ED, E–O–B.
//    Gạch: EC = CA (3), CO = OD (4), CM = MB (1), AM = MD (2).  Vuông: A.
{
  const AB = 330, AC = 165
  const A = P(0, 0), B = P(AB, 0), C = P(0, -AC)
  const D = add(B, vec(A, C)), M = mid(B, C), E = doiXung(A, C), O = mid(C, D)
  gt(goc(A, B, C), 90, 'góc A vuông')
  gt(dist(M, A), dist(M, D), 'M trung điểm AD')
  gt(dist(C, E), dist(C, A), 'CE = CA')
  gt(dist(O, B), dist(O, E), 'O trung điểm BE (hệ quả)')
  hinh('HHC002669_lg', [A, B, C, D, E, M, O], [
    seg(A, E), seg(A, B), seg(B, D), seg(C, D), seg(A, D), seg(C, B), seg(E, D), seg(E, B),
    tick(E, C, 3), tick(C, A, 3), tick(C, O, 4), tick(O, D, 4), tick(C, M, 1), tick(M, B, 1), tick(A, M, 2), tick(M, D, 2),
    rightAngle(A, B, C, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(M), dot(O),
    label(E, 'E', 0, -14), label(C, 'C', -18, 8), label(D, 'D', 20, -8), label(O, 'O', 6, -16),
    label(M, 'M', 4, 30), label(A, 'A', -18, 20), label(B, 'B', 20, 20),
  ], OPT)
}

await xuatTat(RA)
