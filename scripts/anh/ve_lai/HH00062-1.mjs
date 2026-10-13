// Vẽ lại hình — gói HH00062-1 (Hình chữ nhật, Hình học 8): 8 hình, 5 hình lời giải (_lg).
//   node scripts/anh/ve_lai/HH00062-1.mjs [<thu_muc_ra>]
import { P, seg, segDash, tick, angleMark, rightAngle, sector, dot, label, hinh, xuatTat,
  lerp, mid, foot, inter, doiXung, goc, dist } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00062-1/moi'
const ok = (c, m) => console.assert(c, m)
const near = (a, b, e = 0.01) => Math.abs(a - b) < e

// ── HH00062005_lg — tam giác ABC vuông ở A, đường cao AH; E, F = chân đường vuông góc hạ từ H xuống AB, AC;
//    O = AH ∩ EF; qua A kẻ AI ⊥ EF (I ∈ BC); giao điểm AI ∩ EF không đặt tên.
{
  const bh = 97, hc = 270
  const H = P(0, 0), B = P(-bh, 0), C = P(hc, 0), A = P(0, -Math.sqrt(bh * hc))   // AH² = BH·HC ⇒ góc A vuông
  const E = foot(H, A, B), F = foot(H, A, C)
  const O = inter(A, H, E, F)
  const d = P(F.x - E.x, F.y - E.y)
  const I = inter(A, P(A.x - d.y, A.y + d.x), B, C)                 // AI ⊥ EF
  const X = foot(A, E, F)                                             // chân AI trên EF (không tên)
  ok(near(goc(A, B, C), 90), 'góc A vuông')
  ok(near(goc(E, A, H), 90) && near(goc(F, A, H), 90), 'HE ⊥ AB, HF ⊥ AC')
  ok(near(goc(X, A, E), 90), 'AI ⊥ EF')
  ok(near(dist(I, B), dist(I, C)), 'I là trung điểm BC (hệ quả)')
  hinh('HH00062005_lg', [A, B, C, E, F, O, H, I], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, H), seg(H, E), seg(H, F), seg(E, F), seg(A, I),
    rightAngle(A, B, C, 14), rightAngle(E, B, H, 14), rightAngle(F, C, H, 14), rightAngle(H, A, C, 14), rightAngle(X, A, F, 12),
    dot(A), dot(B), dot(C), dot(E), dot(F), dot(O), dot(H), dot(I), dot(X),
    label(A, 'A', 0, -14), label(B, 'B', -8, 30), label(C, 'C', 16, 30), label(E, 'E', -20, 4), label(F, 'F', 8, -14),
    label(O, 'O', -20, 8), label(H, 'H', 0, 30), label(I, 'I', 4, 30),
  ], { pad: 40, padDuoi: 46 })
}

// ── HH00062010_lg — ABC vuông cân tại A (B phía trên A, C bên phải), AD ⊥ BC, M ∈ BC, ME ⊥ AB, MF ⊥ AC.
{
  const L = 290
  const A = P(0, 0), B = P(0, -L), C = P(L, 0)
  const D = mid(B, C), M = lerp(B, C, 0.725)
  const E = foot(M, A, B), F = foot(M, A, C)
  ok(near(goc(A, B, C), 90) && near(dist(A, B), dist(A, C)), 'ABC vuông cân tại A')
  ok(near(goc(D, A, C), 90), 'AD ⊥ BC')
  ok(near(goc(E, A, M), 90) && near(goc(F, A, M), 90), 'ME ⊥ AB, MF ⊥ AC')
  hinh('HH00062010_lg', [A, B, C, D, E, F, M], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, D), seg(D, E), seg(D, F), seg(E, F), seg(E, M), seg(M, F),
    rightAngle(A, B, C, 14), rightAngle(E, A, M, 14), rightAngle(F, M, C, 14), rightAngle(D, A, C, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(M),
    label(A, 'A', -18, 14), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(D, 'D', 20, -10),
    label(E, 'E', -18, 8), label(F, 'F', 0, 30), label(M, 'M', 20, -10),
  ], { pad: 40, padDuoi: 46 })
}

// ── HH00062016_lg — ABC vuông tại A, M ∈ BC, MD ⊥ AB, ME ⊥ AC, AH ⊥ BC; O = AM ∩ DE.
{
  const A = P(0, 0), B = P(0, -245), C = P(328, 0)
  const H = foot(A, B, C), M = lerp(B, C, 0.724)
  const D = foot(M, A, B), E = foot(M, A, C)
  const O = inter(A, M, D, E)
  ok(near(goc(A, B, C), 90), 'góc A vuông')
  ok(near(goc(H, A, B), 90) || near(goc(H, A, C), 90), 'AH ⊥ BC')
  ok(near(goc(D, A, M), 90) && near(goc(E, A, M), 90), 'MD ⊥ AB, ME ⊥ AC')
  ok(near(dist(O, A), dist(O, M)) && near(dist(O, D), dist(O, E)) && near(dist(O, A), dist(O, D)), 'OA=OM=OD=OE')
  hinh('HH00062016_lg', [A, B, C, H, M, D, E, O], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, H), seg(H, D), seg(H, E), seg(H, O), seg(D, M), seg(M, E), seg(A, M), seg(D, E),
    rightAngle(A, B, C, 14), rightAngle(D, A, M, 14), rightAngle(E, M, C, 14), rightAngle(H, A, C, 14),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(D), dot(E), dot(O),
    label(A, 'A', -18, 14), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(H, 'H', 18, -8), label(M, 'M', 14, -12),
    label(D, 'D', -20, 8), label(E, 'E', 0, 30), label(O, 'O', 4, 28),
  ], { pad: 40, padDuoi: 46 })
}

// ── HH00062023_lg — AH ⊥ BC; I = trung điểm AC; E đối xứng H qua I; M, N = trung điểm HC, CE; AM, AN cắt HE ở G, K.
{
  const H = P(0, 0), B = P(-132, 0), C = P(308, 0), A = P(0, -263)
  const I = mid(A, C), E = doiXung(H, I)
  const M = mid(H, C), N = mid(C, E)
  const G = inter(A, M, H, E), K = inter(A, N, H, E)
  ok(near(goc(H, A, C), 90), 'AH ⊥ BC')
  ok(near(dist(H, G), dist(G, K), 0.05) && near(dist(G, K), dist(K, E), 0.05), 'HG = GK = KE (hệ quả của dựng)')
  hinh('HH00062023_lg', [A, B, C, E, H, M, N, I, G, K], [
    seg(A, B), seg(B, C), seg(A, H), seg(A, C), seg(A, E), seg(E, C), seg(H, E), seg(A, M), seg(A, N),
    rightAngle(H, A, C, 14),
    tick(A, I, 2), tick(I, C, 2), tick(H, M, 3), tick(M, C, 3), tick(E, N, 1), tick(N, C, 1),
    dot(A), dot(B), dot(C), dot(E), dot(H), dot(M), dot(N), dot(I), dot(G), dot(K),
    label(A, 'A', -4, -14), label(E, 'E', 8, -14), label(B, 'B', -4, 30), label(H, 'H', 0, 30), label(M, 'M', 0, 30),
    label(C, 'C', 14, 30), label(N, 'N', 20, 8), label(K, 'K', 6, 30), label(I, 'I', 4, 32), label(G, 'G', -20, 6),
  ], { pad: 40, padDuoi: 46 })
}

// ── HH00062026_lg — hình thang vuông ABCD (A = D = 90°), E, F ∈ AD với AE = DF, ∠BFC = 90°; I = trung điểm BC.
{
  const h = 320, b = 110, c = 165
  const e = (h - Math.sqrt(h * h - 4 * b * c)) / 2                    // bc = e(h − e) ⇔ ∠BFC = 90° với AE = DF = e
  const A = P(0, 0), B = P(b, 0), D = P(0, h), C = P(c, h)
  const E = P(0, e), F = P(0, h - e), I = mid(B, C)
  ok(near(dist(A, E), dist(D, F)), 'AE = DF')
  ok(near(goc(F, B, C), 90), '∠BFC = 90°')
  ok(near(goc(A, B, D), 90) && near(goc(D, A, C), 90), 'A = D = 90°')
  ok(near(dist(I, E), dist(I, B)), 'IE = IB = IC (hệ quả)')
  hinh('HH00062026_lg', [A, B, C, D, E, F, I], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(E, B), seg(E, C), seg(F, B), seg(F, C), seg(E, I), seg(F, I),
    rightAngle(A, B, D, 14), rightAngle(D, A, C, 14), rightAngle(F, B, C, 14),
    tick(A, E, 1), tick(F, D, 1),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(I),
    label(A, 'A', -4, -14), label(B, 'B', 8, -14), label(C, 'C', 20, 30), label(D, 'D', -4, 30),
    label(E, 'E', -20, 8), label(F, 'F', -20, 8), label(I, 'I', 20, 8),
  ], { pad: 38, padDuoi: 46 })
}

// ── HH00062080 — ABC vuông tại A, M trung điểm BC, MD ⊥ AB, ME ⊥ AC, Q đối xứng M qua D (D trung điểm MQ).
{
  const A = P(0, 0), B = P(0, -171), C = P(300, 0)
  const M = mid(B, C), D = foot(M, A, B), E = foot(M, A, C), Q = doiXung(M, D)
  ok(near(goc(A, B, C), 90), 'góc A vuông')
  ok(near(goc(D, A, M), 90) && near(goc(E, A, M), 90), 'MD ⊥ AB, ME ⊥ AC')
  ok(near(dist(Q, A), dist(M, C)), 'QMCA là hình bình hành (hệ quả)')
  hinh('HH00062080', [A, B, C, M, D, E, Q], [
    seg(B, A), seg(B, C), seg(A, C), seg(Q, M), seg(M, E), seg(A, M), seg(D, E), seg(Q, A), segDash(Q, C),
    rightAngle(A, B, C, 14), rightAngle(D, B, M, 14), rightAngle(E, M, C, 14),
    dot(A), dot(B), dot(C), dot(M), dot(D), dot(E), dot(Q),
    label(A, 'A', -18, 14), label(B, 'B', 0, -14), label(C, 'C', 20, -4), label(M, 'M', 18, -10),
    label(D, 'D', -16, -12), label(E, 'E', 0, 30), label(Q, 'Q', -4, -14),
  ], { pad: 34, padDuoi: 44 })
}

// ── HH00062081 — ABC cân tại A, H ∈ BC, d ⊥ BC tại H cắt AC ở K, cắt tia BA ở N; M trung điểm BN, P đối xứng H qua M;
//    I trung điểm KC, F đối xứng H qua I. (Ảnh cũ ghi tên giao điểm HF ∩ KC là Q; đề gọi là I ⇒ theo đề.)
{
  const B = P(0, 0), C = P(200, 0), H = P(120, 0), A = P(100, -220)
  const N = inter(B, A, H, P(H.x, -100))                               // N ∈ tia BA, NH ⊥ BC
  const K = inter(H, N, A, C)
  const M = mid(B, N), Pp = doiXung(H, M)
  const I = mid(K, C), F = doiXung(H, I)
  ok(near(dist(A, B), dist(A, C)), 'ABC cân tại A')
  ok(near(goc(H, N, C), 90), 'NH ⊥ BC')
  ok(N.y < A.y && near(goc(A, B, N), 180, 0.1), 'N ∈ tia BA, A nằm giữa B và N')
  ok(near(goc(A, Pp, F), 180, 0.1), 'P, A, F thẳng hàng (hệ quả — không vẽ ra)')
  hinh('HH00062081', [B, C, H, A, N, K, M, Pp, I, F], [
    sector(B, C, A, 34), sector(C, B, A, 34),
    seg(B, Pp), seg(Pp, N), seg(N, H), seg(B, N), seg(A, C), seg(Pp, H), seg(H, F), seg(K, F), seg(F, C), seg(K, C), seg(M, I), seg(B, C),
    angleMark(B, C, A, 34), angleMark(C, B, A, 34), rightAngle(H, N, C, 14),
    dot(B), dot(C), dot(H), dot(A), dot(N), dot(K), dot(M), dot(Pp), dot(I), dot(F),
    label(Pp, 'P', -16, -8), label(N, 'N', 18, -8), label(A, 'A', -20, 8), label(K, 'K', 20, -8), label(F, 'F', 20, -8),
    label(M, 'M', -20, 8), label(I, 'I', 20, 8), label(B, 'B', -8, 30), label(H, 'H', 0, 30), label(C, 'C', 16, 30),
  ], { pad: 38, padDuoi: 46 })
}

// ── HHC000577 — ABC vuông ở A, AH ⊥ BC, HD ⊥ AB, HE ⊥ AC, M trung điểm BC; O = AH ∩ DE, I = AM ∩ DE.
{
  const A = P(0, 0), B = P(0, -234), C = P(330, 0)
  const H = foot(A, B, C), M = mid(B, C)
  const D = foot(H, A, B), E = foot(H, A, C)
  const O = inter(A, H, D, E), I = inter(A, M, D, E)
  ok(near(goc(A, B, C), 90), 'góc A vuông')
  ok(near(goc(H, A, C), 90), 'AH ⊥ BC')
  ok(near(goc(D, A, H), 90) && near(goc(E, A, H), 90), 'HD ⊥ AB, HE ⊥ AC')
  hinh('HHC000577', [A, B, C, H, M, D, E, O, I], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, H), seg(H, D), seg(H, E), seg(D, E), seg(A, M),
    rightAngle(A, B, C, 14), rightAngle(D, A, H, 14), rightAngle(E, H, C, 14), rightAngle(H, A, C, 14),
    tick(B, M, 2), tick(M, C, 2),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(D), dot(E), dot(O), dot(I),
    label(A, 'A', -18, 14), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(H, 'H', 18, -8), label(M, 'M', 14, -12),
    label(D, 'D', -20, 4), label(E, 'E', 0, 30), label(O, 'O', -18, 8), label(I, 'I', -6, 30),
  ], { pad: 40, padDuoi: 46 })
}

await xuatTat(RA)
