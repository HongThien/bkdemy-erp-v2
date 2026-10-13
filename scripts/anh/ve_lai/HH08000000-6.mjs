// Vẽ lại hình — gói HH08000000-6 (Chưa phân dạng, Hình học 8).
//   node scripts/anh/ve_lai/HH08000000-6.mjs [<thu_muc_ra>]
import { P, seg, segDash, rightAngle, angleMark, tick, dot, label, hinh, xuatTat, sideText,
  mid, foot, inter, lerp, add, vec, ray, rot, goc, dist, doiXung, trongTam } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH08000000-6/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.01, m)

// ── HHC002501_lg — ao cá: tam giác MNP, A = trung điểm MN (MA = AN = 9), B = trung điểm MP (MB = BP = 16), NP = 29.
//    Lời giải: K trên tia đối của tia BA, BK = BA. Nét liền: MN, MP, NP, AB. Nét đứt: MK, AP, PK, BK.
{
  const k = 12                                   // px / m
  const N = P(0, 0), Pp = P(29 * k, 0)
  const mx = (18 ** 2 + 29 ** 2 - 32 ** 2) / (2 * 29), my = Math.sqrt(18 ** 2 - mx ** 2)
  const M = P(mx * k, -my * k)
  const A = mid(M, N), B = mid(M, Pp), K = doiXung(A, B)
  gt(dist(M, N) / k, 18, 'MN = 18'); gt(dist(M, Pp) / k, 32, 'MP = 32'); gt(dist(N, Pp) / k, 29, 'NP = 29')
  gt(dist(M, A) / k, 9, 'MA = 9'); gt(dist(M, B) / k, 16, 'MB = 16')
  gt(dist(B, K), dist(B, A), 'BK = BA')
  gt(dist(A, B) / k, 14.5, 'AB = 14,5 (hệ quả)')
  const c = trongTam([M, N, Pp])
  hinh('HHC002501_lg', [M, N, Pp, A, B, K], [
    seg(M, N), seg(M, Pp), seg(N, Pp), seg(A, B),
    segDash(M, K), segDash(A, Pp), segDash(Pp, K), segDash(B, K),
    tick(A, B, 1, 0.5), tick(B, K, 1, 0.5),
    dot(M), dot(N), dot(Pp), dot(A), dot(B), dot(K),
    label(M, 'M', 0, -14), label(N, 'N', -4, 32), label(Pp, 'P', 6, 32), label(A, 'A', -20, 8),
    label(B, 'B', 4, -16), label(K, 'K', 24, 8),
    sideText(M, A, '9 m', c, 28), sideText(A, N, '9 m', c, 28),
    sideText(M, B, '16 m', K, 30), sideText(B, Pp, '16 m', N, 30),
    sideText(N, Pp, '29 m', M, 26),
  ])
}

// ── HHC002502_lg — tam giác nhọn MNP, trung tuyến ME, NF cắt nhau tại G.
//    K: tia đối của FE, FK = FE (ý a). D: tia đối của FN, FD = FG. H: tia đối của EM, GH = MG (ý b).
//    Gạch: MF = FP (2 gạch), GF = FD (3 gạch), NE = EP (1 gạch). Nét đứt: MK, K–F–E, KD, NH.
{
  const N = P(0, 0), Pp = P(340, 0), M = P(130, -210)
  const E = mid(N, Pp), F = mid(M, Pp)
  const G = inter(M, E, N, F)
  const D = doiXung(G, F), H = doiXung(M, G), K = doiXung(E, F)
  ok(goc(M, N, Pp) < 90 && goc(N, M, Pp) < 90 && goc(Pp, M, N) < 90, 'tam giác nhọn')
  gt(dist(M, G), 2 * dist(G, E), 'G trọng tâm')
  gt(dist(F, D), dist(F, G), 'FD = FG'); gt(dist(G, H), dist(M, G), 'GH = MG')
  gt(dist(G, E), dist(E, H), 'GE = EH (hệ quả)')
  gt(dist(M, D), dist(G, Pp), 'MGPD hình bình hành (hệ quả)')
  gt(dist(E, F) * 2, dist(M, N), 'EF = MN/2 (hệ quả)')
  hinh('HHC002502_lg', [M, N, Pp, E, F, G, D, H, K], [
    seg(M, N), seg(M, Pp), seg(N, Pp), seg(M, H), seg(N, D), seg(M, D), seg(D, Pp), seg(G, Pp), seg(H, Pp),
    segDash(M, K), segDash(K, E), segDash(K, D), segDash(N, H),
    tick(M, F, 2, 0.5), tick(F, Pp, 2, 0.5), tick(G, F, 3, 0.5), tick(F, D, 3, 0.5),
    tick(N, E, 1, 0.5), tick(E, Pp, 1, 0.5),
    dot(M), dot(N), dot(Pp), dot(E), dot(F), dot(G), dot(D), dot(H), dot(K),
    label(M, 'M', 0, -14), label(N, 'N', -18, 24), label(Pp, 'P', 20, 24), label(E, 'E', -16, -6),
    label(F, 'F', 24, 10), label(G, 'G', -20, 0), label(D, 'D', 24, 6), label(H, 'H', 0, 34), label(K, 'K', 14, -12),
  ])
}

// ── HHC002509 — hình thoi ABCD (AB = CD, ∠ABD = ∠ADB = ∠BDC), đường chéo BD.
//    Dựng: D góc dưới-trái, DC ngang, ∠ADC = 72° ⇒ DB là phân giác 36°, AD = AB = CD.
{
  const s = 290
  const D = P(0, 0), C = P(s, 0)
  const A = ray(D, 72, s), B = add(A, vec(D, C))
  gt(dist(A, B), dist(D, C), 'AB = CD')
  gt(goc(B, A, D), goc(D, A, B), 'ABD = ADB')
  gt(goc(B, A, D), goc(D, B, C), 'ABD = BDC')
  gt(goc(B, A, D), 36, 'góc 36°')
  hinh('HHC002509', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(B, D),
    tick(A, B, 1, 0.5), tick(D, C, 1, 0.5),
    angleMark(B, A, D, 38, 1), angleMark(D, A, B, 44, 1), angleMark(D, B, C, 62, 1),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', 0, -14), label(B, 'B', 14, -14), label(C, 'C', 16, 28), label(D, 'D', -18, 26),
  ])
}

// ── HHC002513_lg — △ABC vuông tại A, Ĉ = 37°, AH ⊥ BC, HD ⊥ AB, HE ⊥ AC, M trung điểm BC; I = AH ∩ DE, G = AM ∩ DE.
{
  const B = P(0, 0), C = P(380, 0)
  const A = ray(C, 180 - 37, 380 * Math.cos(37 * Math.PI / 180))
  const H = foot(A, B, C), D = foot(H, A, B), E = foot(H, A, C), M = mid(B, C)
  const I = inter(A, H, D, E), G = inter(A, M, D, E)
  gt(goc(A, B, C), 90, 'góc A vuông'); gt(goc(C, A, B), 37, 'C = 37°')
  gt(goc(D, A, H), 90, 'HD ⊥ AB'); gt(goc(E, A, H), 90, 'HE ⊥ AC')
  gt(goc(A, G, E), 37, 'GAE = C (hệ quả)'); gt(goc(G, A, E), 90, 'AM ⊥ DE (hệ quả)')
  hinh('HHC002513_lg', [A, B, C, H, D, E, M, I, G], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, H), seg(D, H), seg(H, E), seg(D, E), seg(A, M),
    tick(B, M, 1, 0.5), tick(M, C, 1, 0.5),
    rightAngle(A, B, C, 14), rightAngle(D, A, H, 14), rightAngle(E, A, H, 14), rightAngle(H, A, C, 14),
    dot(A), dot(B), dot(C), dot(H), dot(D), dot(E), dot(M), dot(I), dot(G),
    label(A, 'A', 0, -14), label(B, 'B', -20, 8), label(C, 'C', 22, 8), label(H, 'H', -6, 32),
    label(M, 'M', 14, 32), label(D, 'D', -20, 4), label(E, 'E', 22, -10), label(I, 'I', -16, -4), label(G, 'G', 20, 22),
  ])
}

// ── HHC002514 — hình bình hành EFGH, M = giao hai đường chéo; EF = 40, EM = 36, HM = 16 (đơn vị m, dựng đúng tỉ lệ).
{
  const k = 5.5
  const ex = 0, fx = 40
  const mx = (36 ** 2 - 16 ** 2 + 40 ** 2) / (2 * 40), my = Math.sqrt(36 ** 2 - mx ** 2)
  const E = P(ex * k, 0), F = P(fx * k, 0), M = P(mx * k, my * k)
  const G = doiXung(E, M), H = doiXung(F, M)
  gt(dist(E, F) / k, 40, 'EF = 40'); gt(dist(E, M) / k, 36, 'EM = 36'); gt(dist(H, M) / k, 16, 'HM = 16')
  gt(dist(H, G), dist(E, F), 'HG = EF (hình bình hành)')
  gt(dist(E, G) / k, 72, 'EG = 72 (hệ quả)'); gt(dist(F, H) / k, 32, 'FH = 32 (hệ quả)')
  hinh('HHC002514', [E, F, G, H, M], [
    seg(E, F), seg(F, G), seg(G, H), seg(H, E), seg(E, G), seg(F, H),
    dot(E), dot(F), dot(G), dot(H), dot(M),
    label(E, 'E', -16, -10), label(F, 'F', 16, -10), label(G, 'G', 18, 26), label(H, 'H', -14, 28), label(M, 'M', 4, -14),
  ])
}

// ── HHC002515_lg — △ABC vuông tại A (AB < AC), AH ⊥ BC, HD ⊥ AB, HE ⊥ AC, K: E trung điểm AK, M trung điểm BC, Q = DE ∩ AM.
//    A góc dưới-trái, B bên phải, C phía trên.
{
  const A = P(0, 0), B = P(171, 0), C = P(0, -285)
  const H = foot(A, B, C), D = foot(H, A, B), E = foot(H, A, C)
  const K = doiXung(A, E), M = mid(B, C), Q = inter(D, E, A, M)
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  gt(goc(H, A, B), 90, 'AH ⊥ BC'); gt(goc(D, A, H), 90, 'HD ⊥ AB')
  gt(dist(E, K), dist(A, E), 'E trung điểm AK')
  gt(goc(Q, A, E), 90, 'AQE vuông tại Q (hệ quả)')
  gt(dist(D, H), dist(K, E), 'DH = KE (hệ quả)')
  hinh('HHC002515_lg', [A, B, C, H, D, E, K, M, Q], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(D, H), seg(E, H), seg(D, E), seg(A, M), seg(K, H),
    tick(A, E, 2, 0.5), tick(E, K, 2, 0.5), tick(C, M, 1, 0.5), tick(M, B, 1, 0.8),
    rightAngle(A, B, C, 14), rightAngle(E, A, H, 14), rightAngle(D, A, H, 14), rightAngle(H, A, B, 14),
    dot(A), dot(B), dot(C), dot(H), dot(D), dot(E), dot(K), dot(M), dot(Q),
    label(A, 'A', -20, 8), label(B, 'B', 18, 24), label(C, 'C', 0, -14), label(H, 'H', 24, -4), label(D, 'D', 0, 32),
    label(E, 'E', -20, 8), label(K, 'K', -20, 6), label(M, 'M', 22, -8), label(Q, 'Q', 24, 2),
  ])
}

// ── HHC002521_lg — △MNP vuông tại M, ME trung tuyến, H, K = hình chiếu của E trên MN, MP.
{
  const M = P(0, 0), N = P(380, 0), Pp = P(0, -200)
  const E = mid(N, Pp), H = foot(E, M, N), K = foot(E, M, Pp)
  gt(goc(M, N, Pp), 90, 'góc M vuông')
  gt(goc(H, M, E), 90, 'EH ⊥ MN'); gt(goc(K, M, E), 90, 'EK ⊥ MP')
  gt(dist(E, Pp), dist(E, N), 'E trung điểm NP')
  gt(dist(H, K) * 2, dist(N, Pp), 'HK = NP/2 (hệ quả)')
  hinh('HHC002521_lg', [M, N, Pp, E, H, K], [
    seg(Pp, M), seg(M, N), seg(N, Pp), seg(E, K), seg(E, H), seg(K, H), seg(M, E),
    tick(Pp, E, 2, 0.5), tick(E, N, 2, 0.5),
    rightAngle(M, N, Pp, 14), rightAngle(K, Pp, E, 14), rightAngle(H, N, E, 14),
    dot(M), dot(N), dot(Pp), dot(E), dot(H), dot(K),
    label(M, 'M', -18, 26), label(N, 'N', 20, 26), label(Pp, 'P', 0, -14), label(E, 'E', 18, -10),
    label(H, 'H', 0, 32), label(K, 'K', -22, 6),
  ])
}

// ── HHC002525 — hình thoi ABCD, O = giao hai đường chéo (không đặt tên): AO = OC (2 gạch), BO = OD (1 gạch), AC ⊥ BD.
{
  const O = P(0, 0)
  const A = P(-150, 0), C = P(150, 0), B = P(0, -72), D = P(0, 72)
  gt(goc(O, A, B), 90, 'AC ⊥ BD')
  gt(dist(A, B), dist(B, C), 'AB = BC (hình thoi, hệ quả)')
  hinh('HHC002525', [A, B, C, D, O], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    tick(A, O, 2, 0.5), tick(O, C, 2, 0.5), tick(B, O, 1, 0.5), tick(O, D, 1, 0.5),
    rightAngle(O, B, C, 14),
    dot(A), dot(B), dot(C), dot(D), dot(O),
    label(A, 'A', -20, 8), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(D, 'D', 0, 36),
  ])
}

await xuatTat(RA)
