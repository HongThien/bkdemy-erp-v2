// Vẽ lại hình — gói HH08000000-11 (Hình học 8 lấy từ các đề thi/đề cương; 8 hình LỜI GIẢI, tam giác vuông / hình chữ nhật).
//   node scripts/anh/ve_lai/HH08000000-11.mjs [<thu_muc_ra>]
import { P, seg, rightAngle, tick, dot, label, hinh, xuatTat,
  mid, foot, inter, lerp, add, vec, goc, dist, doiXung } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH08000000-11/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.01, m)
const song = (a, b, c, d, m) => gt((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x), 0, m)
const vg = (v, p, q, m) => gt(goc(v, p, q), 90, m)   // góc pvq vuông (đỉnh v)
const thang = (a, b, c, m) => gt((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x), 0, m)
const OPT = { pad: 32, padDuoi: 38 }

// ── HHC002646_lg — tam giác ABC vuông tại A, BC = 2AB (⇒ AC = AB√3); M trung điểm BC; nét thêm AM.
//    Gạch như ảnh cũ: AB, BM, MC (1 gạch). Vuông: A. Không ghi AM = BM, không ghi góc B (điều phải suy ra).
{
  const L = 160
  const A = P(0, 0), B = P(0, -L), C = P(L * Math.sqrt(3), 0)
  const M = mid(B, C)
  gt(dist(B, C), 2 * dist(A, B), 'BC = 2AB'); gt(goc(A, B, C), 90, 'A vuông')
  hinh('HHC002646_lg', [A, B, C, M], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, M),
    tick(A, B), tick(B, M), tick(M, C),
    rightAngle(A, B, C, 14),
    dot(A), dot(B), dot(C), dot(M),
    label(B, 'B', -2, -14), label(A, 'A', -18, 22), label(C, 'C', 16, 22), label(M, 'M', 16, -10),
  ], OPT)
}

// ── HHC002659_lg — ABC vuông tại A (AB < AC), AH ⊥ BC, E trung điểm BC; D, F hình chiếu của E trên AB, AC; O = AE ∩ DF;
//    M = A + C − E (F trung điểm EM), N = A + C − B (F trung điểm BN).
//    Nét: AB, B–H–E–C, A–F–C, AE, DF, DE, DH, FH, B–F–N, E–F–M, A–M–N, MC, NC, AH.
//    Gạch: BE = EC (1), EF = FM (3), BF = FN (2)  [ảnh cũ dùng 3 gạch cho cả hai cặp — ở đây tách 3/2 để khỏi gợi ý EF = BF].
//    Vuông: A, D, F (giả thiết), H. Không đánh dấu góc E (ADEF chữ nhật là ý phải chứng minh).
{
  const s = 0.47
  const B = P(0, 0), C = P(720 * s, 0), H = P(195 * s, 0)
  const A = P(H.x, -Math.sqrt((195 * s) * (525 * s)))
  gt(goc(A, B, C), 90, 'A vuông'); ok(dist(A, B) < dist(A, C), 'AB < AC')
  const E = mid(B, C), D = foot(E, A, B), F = foot(E, A, C), O = inter(A, E, D, F)
  const M = add(A, vec(E, C)), N = add(A, vec(B, C))
  gt(dist(F, E), dist(F, M), 'F trung điểm EM'); gt(dist(F, B), dist(F, N), 'F trung điểm BN')
  gt(goc(F, E, A), 90, 'EF ⊥ AC'); gt(goc(D, E, A), 90, 'ED ⊥ AB'); gt(goc(H, A, B), 90, 'AH ⊥ BC')
  gt(dist(M, A), dist(M, N), 'M trung điểm AN (hệ quả)')
  hinh('HHC002659_lg', [A, B, C, H, E, D, F, O, M, N], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, E), seg(D, F), seg(D, E), seg(D, H), seg(F, H), seg(A, H),
    seg(B, N), seg(E, M), seg(A, N), seg(M, C), seg(N, C),
    tick(B, E, 1, 0.35), tick(E, C, 1), tick(E, F, 3), tick(F, M, 3), tick(B, F, 2, 0.3), tick(F, N, 2, 0.7),
    rightAngle(A, B, C, 14), rightAngle(D, A, E, 12), rightAngle(F, A, E, 12), rightAngle(H, A, E, 12),
    dot(A), dot(B), dot(C), dot(H), dot(E), dot(D), dot(F), dot(O), dot(M), dot(N),
    label(A, 'A', -4, -14), label(M, 'M', 0, -14), label(N, 'N', 6, -14),
    label(B, 'B', -18, 8), label(H, 'H', -4, 32), label(E, 'E', 8, 32), label(C, 'C', 16, 26),
    label(D, 'D', -20, 8), label(O, 'O', -10, 26), label(F, 'F', 20, 6),
  ], OPT)
}

// ── HHC002660_lg — ABC vuông tại A (AC < AB), M trung điểm BC, ME ⊥ AB, MF ⊥ AC; H ∈ tia MF, FH = FM;
//    I = EH ∩ AF; J trung điểm ME.  Nét: C–F–I–A, A–E–B, C–M–B, H–F–M, HA, H–I–E, FE, IJ, M–J–E.
//    Gạch: CM = MB (1), HF = FM (2), MJ = JE (3). Vuông: A, F, E.
{
  const s = 0.44
  const A = P(0, 0), B = P(660 * s, 0), C = P(0, -441 * s)
  ok(dist(A, C) < dist(A, B), 'AC < AB')
  const M = mid(B, C), E = foot(M, A, B), F = foot(M, A, C)
  const H = doiXung(M, F), I = inter(E, H, A, C), J = mid(M, E)
  gt(goc(A, C, B), 90, 'A vuông'); gt(goc(E, A, M), 90, 'ME ⊥ AB'); gt(goc(F, A, M), 90, 'MF ⊥ AC')
  gt(dist(F, H), dist(F, M), 'FH = FM')
  gt(dist(I, A), dist(I, F), 'I trung điểm AF (hệ quả)')
  hinh('HHC002660_lg', [A, B, C, M, E, F, H, I, J], [
    seg(C, A), seg(A, B), seg(C, B), seg(H, M), seg(H, A), seg(H, E), seg(F, E), seg(I, J), seg(M, E),
    tick(C, M), tick(M, B), tick(H, F, 2), tick(F, M, 2), tick(M, J, 3), tick(J, E, 3),
    rightAngle(A, C, B, 14), rightAngle(F, M, A, 12), rightAngle(E, M, A, 12),
    dot(A), dot(B), dot(C), dot(M), dot(E), dot(F), dot(H), dot(I), dot(J),
    label(C, 'C', -4, -14), label(H, 'H', -14, -10), label(F, 'F', -16, -10), label(M, 'M', 16, -10),
    label(I, 'I', -16, 8), label(J, 'J', 16, 8), label(A, 'A', -16, 22), label(E, 'E', 0, 34), label(B, 'B', 16, 22),
  ], OPT)
}

// ── HHC002661_lg — hình chữ nhật ABCD (AB > AD); AN ⊥ BD, CM ⊥ BD (N, M ∈ BD); K ∈ tia đối NA, NK = NA.
//    Nét: 4 cạnh, BD, A–N–K, AM, NC, KD, KC, KB.  Gạch: NA = NK (1).  Vuông: A, B, C, D, N, M.
{
  const s = 0.6
  const D = P(0, 0), C = P(640 * s, 0), A = P(0, 358 * s), B = P(640 * s, 358 * s)
  ok(dist(A, B) > dist(A, D), 'AB > AD')
  const N = foot(A, B, D), M = foot(C, B, D), K = doiXung(A, N)
  vg(A, B, D, 'ABD vuông tại A'); vg(N, A, B, 'AN ⊥ BD')
  vg(N, A, M, 'AN ⊥ BD (2)')
  gt(dist(N, K), dist(N, A), 'NK = NA')
  gt(dist(B, A), dist(B, K), 'BA = BK (hệ quả)'); gt(dist(D, A), dist(D, K), 'DA = DK (hệ quả)')
  song(K, C, B, D, 'KC ∥ BD (hệ quả)')
  hinh('HHC002661_lg', [A, B, C, D, N, M, K], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(D, B), seg(A, K), seg(A, M), seg(N, C), seg(K, D), seg(K, C), seg(K, B),
    tick(A, N), tick(N, K),
    rightAngle(A, B, D, 14), rightAngle(B, A, C, 14), rightAngle(C, B, D, 14), rightAngle(D, A, C, 14),
    rightAngle(N, M, A, 12), rightAngle(M, N, C, 12),
    dot(A), dot(B), dot(C), dot(D), dot(N), dot(M), dot(K),
    label(K, 'K', 0, -14), label(D, 'D', -18, -6), label(C, 'C', 18, -6), label(N, 'N', -18, 2),
    label(A, 'A', -18, 22), label(M, 'M', 6, 32), label(B, 'B', 18, 22),
  ], OPT)
}

// ── HHC002662_lg — ABC vuông tại A; D ∈ BC; M, N hình chiếu của D trên AB, AC; AH ⊥ BC; O = AD ∩ MN.
//    Nét: C–N–A, A–M–B, C–H–D–B, AH, HM, HN, ND, DM, MN, AD.  Vuông: A, N, M, H. Không ghi AD = MN, MHN = 90°.
{
  const s = 0.55
  const A = P(0, 0), B = P(735 * s, 0), C = P(0, -506 * s)
  const D = lerp(C, B, 0.7)
  const M = foot(D, A, B), N = foot(D, A, C), H = foot(A, C, B), O = inter(A, D, M, N)
  gt(goc(A, C, B), 90, 'A vuông'); gt(goc(M, A, D), 90, 'DM ⊥ AB'); gt(goc(N, A, D), 90, 'DN ⊥ AC')
  vg(H, A, D, 'AH ⊥ BC')
  ok(dist(C, H) < dist(C, D), 'H nằm giữa C và D (như ảnh cũ)')
  hinh('HHC002662_lg', [A, B, C, D, M, N, H, O], [
    seg(C, A), seg(A, B), seg(C, B), seg(A, H), seg(H, N), seg(H, M), seg(N, D), seg(D, M), seg(M, N), seg(A, D),
    rightAngle(A, C, B, 14), rightAngle(N, A, D, 12), rightAngle(M, A, D, 12), rightAngle(H, A, D, 12),
    dot(A), dot(B), dot(C), dot(D), dot(M), dot(N), dot(H), dot(O),
    label(C, 'C', -14, -8), label(H, 'H', 14, -10), label(D, 'D', 16, -8), label(N, 'N', -16, 2),
    label(O, 'O', 0, 28), label(A, 'A', -16, 22), label(M, 'M', 2, 32), label(B, 'B', 16, 22),
  ], OPT)
}

// ── HHC002663_lg — ABC vuông tại A (AB < AC), M ∈ BC, MD ⊥ AB, ME ⊥ AC; Ax ∥ DE cắt tia ME tại F (F = A + E − D);
//    G đối xứng M qua D (D trung điểm MG); AH ⊥ BC; O = AM ∩ DE.
//    Nét: C–E–A, A–D–B, C–M–H–B, F–E–M, M–D–G, AM, DE, AH, HD, HE, FA, AG.  Gạch: MD = DG (1).  Vuông: A, E, D, H.
//    Không ghi A trung điểm GF, không ghi DHE = 90°.
{
  const s = 0.5
  const A = P(0, 0), B = P(300 * s, 0), C = P(0, -420 * s)
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  const M = lerp(C, B, 0.457)
  const D = foot(M, A, B), E = foot(M, A, C)
  const F = add(A, vec(D, E)), G = doiXung(M, D)
  const H = foot(A, C, B), O = inter(A, M, D, E)
  gt(goc(A, C, B), 90, 'A vuông'); gt(goc(D, A, M), 90, 'MD ⊥ AB'); gt(goc(E, A, M), 90, 'ME ⊥ AC')
  song(A, F, D, E, 'Ax ∥ DE'); thang(E, F, M, 'F trên đường ME'); ok((F.x - E.x) * (M.x - E.x) <= 0, 'F phía đối của M qua E')
  gt(dist(D, G), dist(D, M), 'DG = DM')
  vg(H, A, M, 'AH ⊥ BC')
  ok(dist(M, B) > dist(H, B) && dist(M, H) > 0, 'H nằm giữa M và B (như ảnh cũ)')
  thang(G, A, F, 'G, A, F thẳng hàng (hệ quả)'); gt(dist(A, G), dist(A, F), 'A trung điểm GF (hệ quả)')
  hinh('HHC002663_lg', [A, B, C, M, D, E, F, G, H, O], [
    seg(C, A), seg(A, B), seg(C, B), seg(F, M), seg(M, G), seg(A, M), seg(D, E), seg(A, H), seg(H, D), seg(H, E), seg(F, A), seg(A, G),
    tick(M, D), tick(D, G),
    rightAngle(A, C, B, 14), rightAngle(E, M, A, 12), rightAngle(D, A, M, 12), rightAngle(H, A, B, 12),
    dot(A), dot(B), dot(C), dot(M), dot(D), dot(E), dot(F), dot(G), dot(H), dot(O),
    label(C, 'C', 0, -14), label(F, 'F', -16, 2), label(E, 'E', -18, -8), label(M, 'M', 16, -8), label(H, 'H', 18, -2),
    label(O, 'O', -14, 4), label(A, 'A', -18, 20), label(D, 'D', 12, 26), label(B, 'B', 18, 22), label(G, 'G', 18, 10),
  ], OPT)
}

// ── HHC002664_lg — hình chữ nhật ABCD; BH ⊥ AC (H ∈ AC); M, N, PP trung điểm AB, AH, DC (điểm P của đề, đặt tên PP trong code);
//    NK ∥ AB (K ∈ BH).  Nét: 4 cạnh, AC, MP, NM, NP, NK, B–K–H, KC.
//    Gạch: DP = PC (3), AM = MB (1), AN = NH (2).  Vuông: A, B, C, D, H.  Không ghi MN ⊥ AC, BK = KH.
{
  const s = 0.55
  const D = P(0, 0), C = P(756 * s, 0), A = P(0, 389 * s), B = P(756 * s, 389 * s)
  const H = foot(B, A, C)
  const M = mid(A, B), N = mid(A, H), PP = mid(D, C)
  const K = inter(B, H, N, add(N, vec(A, B)))
  vg(H, A, B, 'BH ⊥ AC')
  song(N, K, A, B, 'NK ∥ AB')
  thang(B, K, H, 'K ∈ BH')
  gt(dist(K, B), dist(K, H), 'K trung điểm BH (hệ quả)')
  hinh('HHC002664_lg', [A, B, C, D, H, M, N, PP, K], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(M, PP), seg(N, M), seg(N, PP), seg(N, K), seg(B, H), seg(K, C),
    tick(D, PP, 3), tick(PP, C, 3), tick(A, M), tick(M, B), tick(A, N, 2), tick(N, H, 2),
    rightAngle(A, B, D, 14), rightAngle(B, A, C, 14), rightAngle(C, B, D, 14), rightAngle(D, A, C, 14),
    rightAngle(H, A, B, 12),
    dot(A), dot(B), dot(C), dot(D), dot(H), dot(M), dot(N), dot(PP), dot(K),
    label(D, 'D', -18, -6), label(PP, 'P', 0, -14), label(C, 'C', 18, -6), label(H, 'H', -4, -14),
    label(N, 'N', -18, 2), label(K, 'K', 18, 8), label(A, 'A', -18, 22), label(M, 'M', 0, 32), label(B, 'B', 18, 22),
  ], OPT)
}

// ── HHC002665_lg — ABC vuông tại A (AB < AC), AH ⊥ BC; HM ⊥ AB, HN ⊥ AC; I trung điểm HC; K đối xứng A qua I; O = AH ∩ MN.
//    Nét: AB, B–H–I–C, A–N–C, AH, A–I–K, HM, HN, MN, HK, CK.  Gạch: HI = IC (2), AI = IK (3).  Vuông: A, M, N, H.
//    Không ghi O trung điểm AH/MN, MK ∥ NC.
{
  const s = 0.6
  const B = P(0, 0), H = P(173 * s, 0), C = P(575 * s, 0)
  const A = P(H.x, -Math.sqrt(dist(B, H) * dist(H, C)))
  ok(dist(A, B) < dist(A, C), 'AB < AC'); gt(goc(A, B, C), 90, 'A vuông')
  const I = mid(H, C), K = doiXung(A, I)
  const M = foot(H, A, B), N = foot(H, A, C), O = inter(A, H, M, N)
  gt(goc(M, A, H), 90, 'HM ⊥ AB'); gt(goc(N, A, H), 90, 'HN ⊥ AC')
  song(H, K, A, C, 'HK ∥ AC (hệ quả)'); thang(M, H, K, 'M, H, K thẳng hàng (hệ quả)')
  hinh('HHC002665_lg', [A, B, C, H, I, K, M, N, O], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, H), seg(A, K), seg(H, M), seg(H, N), seg(M, N), seg(H, K), seg(C, K),
    tick(H, I, 2), tick(I, C, 2), tick(A, I, 3, 0.25), tick(I, K, 3, 0.75),
    rightAngle(A, B, C, 14), rightAngle(M, A, H, 12), rightAngle(N, A, H, 12), rightAngle(H, A, C, 12),
    dot(A), dot(B), dot(C), dot(H), dot(I), dot(K), dot(M), dot(N), dot(O),
    label(A, 'A', -4, -14), label(N, 'N', 16, -10), label(M, 'M', -18, -4), label(O, 'O', -16, 0),
    label(B, 'B', -18, 10), label(H, 'H', -6, 32), label(I, 'I', 10, -12), label(C, 'C', 18, 8), label(K, 'K', 18, 18),
  ], OPT)
}

await xuatTat(RA)
