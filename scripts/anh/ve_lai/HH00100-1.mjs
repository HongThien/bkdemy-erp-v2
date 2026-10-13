// Vẽ lại hình — gói HH00100-1 (Chứng minh đẳng thức hình học, Hình học 9): HHC000861, HHC000863, HHC000864 (mỗi câu một cặp _de + _lg).
//   node scripts/anh/ve_lai/HH00100-1.mjs [<thu_muc_ra>]
// Ảnh cũ: hình đề và hình lời giải của mỗi câu giống hệt nhau ⇒ mỗi câu dựng MỘT lần (chung toạ độ);
// _de = giả thiết; _lg = _de + các điểm/đường phụ mà lời giải dùng.
import { P, seg, segDash, rightAngle, tick, dot, label, hinh, xuatTat,
  mid, foot, inter, add, vec, bisector, goc, dist, doiXung } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00100-1/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.01, m)
const song2 = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x))
const OPT = { pad: 32, padDuoi: 38 }

// ── HHC000861 — ABC vuông tại A (AB > AC); D ∈ AC; CE ⊥ BD (E ∈ BD, D nằm giữa B, E); M = CE ∩ AB; N = AE ∩ BC;
//    BI ∥ AC, CI ∥ BD (I = giao); H trung điểm MI, K trung điểm BC.
//    _de: AB, B–A–M, AC, B–D–E, C–E–M, A–E–N, B–K–C–N, BI, CI, M–H–I, HK.  Gạch: BK = KC (2), MH = HI (1).  Vuông: A, E.
//    _lg: thêm HB, HC (trung tuyến BH, CH của tam giác vuông MBI, MCI).
{
  const AB = 255, AC = 190
  const A = P(0, 0), B = P(0, -AB), C = P(AC, 0)
  const D = P(0.62 * AC, 0)
  ok(AB > AC, 'AB > AC')
  const E = foot(C, B, D)
  ok(dist(B, E) > dist(B, D), 'D nằm giữa B và E')
  const M = inter(C, E, A, B), N = inter(A, E, B, C)
  const I = add(B, vec(D, C))                           // BI ∥ DC, CI ∥ BD
  const K = mid(B, C), H = mid(M, I)
  gt(goc(E, C, D), 90, 'CE ⊥ BD')
  gt(song2(B, I, A, C), 0, 'BI ∥ AC'); gt(song2(C, I, B, D), 0, 'CI ∥ BD')
  ok(dist(B, N) > dist(B, C), 'N nằm ngoài đoạn BC (phía C)')
  ok(M.y > 0, 'M nằm trên tia đối của tia AB')
  gt(goc(K, H, B) + goc(K, H, C), 180, 'tam giác HBC cân tại H (hệ quả: HK ⊥ BC)')
  gt(goc(K, H, B), goc(K, H, C), 'HK ⊥ BC (hệ quả)')
  const pts = [A, B, C, D, E, M, N, I, K, H]
  const de = [
    seg(B, M), seg(A, C), seg(B, E), seg(C, M), seg(A, N), seg(B, N), seg(B, I), seg(C, I), seg(M, I), seg(H, K),
    tick(B, K, 2), tick(K, C, 2), tick(M, H, 1, 0.68), tick(H, I, 1),
    rightAngle(A, B, C, 14), rightAngle(E, C, D, 12),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(M), dot(N), dot(I), dot(K), dot(H),
    label(B, 'B', -16, -6), label(I, 'I', 14, -12), label(K, 'K', 16, -10), label(C, 'C', 20, -10),
    label(D, 'D', 8, -14), label(H, 'H', -14, 0), label(A, 'A', -16, 20), label(E, 'E', 10, 28),
    label(M, 'M', -14, 22), label(N, 'N', 14, 28),
  ]
  hinh('HHC000861_de', pts, de, OPT)
  hinh('HHC000861_lg', pts, [...de, seg(H, B), seg(H, C)], OPT)
}

// ── HHC000863 — ABC vuông tại A (AB = 3, AC = 4, BC = 5), AH ⊥ BC; AK phân giác góc HAC (K ∈ HC); I trung điểm AC;
//    AE ⊥ BI (E ∈ BI); đường qua B vuông góc BA cắt CE tại P; M ∈ tia đối AB, AM = AB.
//    _de: B–A–M, AC, BC, AH, AK, BI (qua E), AE, P–E–C, P–B, MC, MP.  Gạch: AB = AM (2), AI = IC (1).  Vuông: A, B (BP ⊥ BA), E, H.
//    _lg: thêm R = AE ∩ (đường qua B ⊥ BA): kéo dài AE tới R, kéo dài PB tới R.
{
  const k = 50
  const A = P(0, 0), B = P(0, -3 * k), C = P(4 * k, 0)
  gt(dist(B, C), 5 * k, 'BC = 5')
  const H = foot(A, B, C)
  const K = inter(A, bisector(A, H, C), B, C)
  const I = mid(A, C)
  const E = foot(A, B, I)
  const dB = add(B, P(1, 0))                             // đường qua B vuông góc BA
  const Pp = inter(C, E, B, dB)
  const M = doiXung(B, A)
  const R = inter(A, E, B, dB)
  gt(goc(A, B, C), 90, 'góc A vuông')
  gt(goc(A, B, H) + goc(A, H, C), 90, 'góc BAH + góc HAC = 90')
  gt(goc(A, K, H), goc(A, K, C), 'AK phân giác góc HAC')
  gt(goc(E, A, B), 90, 'AE ⊥ BI')
  gt(goc(B, Pp, A), 90, 'BP ⊥ BA')
  ok(Math.abs((Pp.y - B.y)) < 0.01, 'P trên đường qua B vuông góc BA')
  gt(dist(A, M), dist(A, B), 'AM = AB')
  gt(dist(B, R), dist(B, Pp), 'RB = BP (hệ quả)')
  gt(goc(M, C, Pp), 90, 'CM ⊥ MP (hệ quả)')
  const pts = [A, B, C, H, K, I, E, Pp, M, R]
  const de = [
    seg(B, M), seg(A, C), seg(B, C), seg(A, H), seg(A, K), seg(B, I), seg(A, E), seg(Pp, C), seg(Pp, B), seg(M, C), seg(M, Pp),
    tick(B, A, 2), tick(A, M, 2), tick(A, I, 1), tick(I, C, 1),
    rightAngle(A, B, C, 14), rightAngle(B, A, Pp, 14), rightAngle(E, A, I, 12), rightAngle(H, A, C, 12),
    dot(A), dot(B), dot(C), dot(H), dot(K), dot(I), dot(E), dot(Pp), dot(M),
    label(B, 'B', 14, -10), label(Pp, 'P', -6, -12), label(C, 'C', 20, 4), label(A, 'A', -16, 22), label(M, 'M', 0, 32),
    label(I, 'I', 0, 30), label(E, 'E', 14, -10), label(H, 'H', 16, -6), label(K, 'K', 20, -8),
  ]
  hinh('HHC000863_de', pts.filter((p) => p !== R), de, OPT)
  hinh('HHC000863_lg', pts, [...de, seg(B, R), seg(E, R), dot(R), label(R, 'R', 16, -10)], OPT)
}

// ── HHC000864 — ABC vuông tại A (AB = 9, AC = 12, BC = 15), AH ⊥ BC; M, N hình chiếu của H trên AB, AC; MN (nét đứt);
//    AK ∥ MN; CK ∥ AH (K = giao); I = AH ∩ BK.
//    _de: B–M–A, A–N–C, BC, AH, HM, HN, MN đứt, AK, CK, BK (qua I).  Vuông: A, H, M, N.
//    _lg: thêm F trung điểm AC, nối KF; gạch AF = FC (1).
{
  const k = 20
  const A = P(0, 0), B = P(0, -9 * k), C = P(12 * k, 0)
  gt(dist(B, C), 15 * k, 'BC = 15')
  const H = foot(A, B, C), M = foot(H, A, B), N = foot(H, A, C)
  const K = inter(A, add(A, vec(M, N)), C, add(C, vec(A, H)))
  const I = inter(A, H, B, K), F = mid(A, C)
  gt(goc(A, B, C), 90, 'góc A vuông')
  gt(goc(A, M, N), 90, 'AMHN hình chữ nhật')
  gt(song2(A, K, M, N), 0, 'AK ∥ MN'); gt(song2(C, K, A, H), 0, 'CK ∥ AH')
  gt(dist(I, A), dist(I, H), 'I trung điểm AH (hệ quả)')
  gt(goc(F, K, A), 90, 'KF ⊥ AC (hệ quả)')
  gt(Math.abs((M.x - I.x) * (N.y - I.y) - (M.y - I.y) * (N.x - I.x)), 0, 'M, I, N thẳng hàng (hệ quả)')
  const pts = [A, B, C, H, M, N, K, I, F]
  const de = [
    seg(B, A), seg(A, C), seg(B, C), seg(A, H), seg(H, M), seg(H, N), segDash(M, N), seg(A, K), seg(C, K), seg(B, K),
    rightAngle(A, B, C, 14), rightAngle(H, A, C, 12), rightAngle(M, A, H, 12), rightAngle(N, A, H, 12),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(N), dot(K), dot(I),
    label(B, 'B', 0, -14), label(M, 'M', -18, 6), label(A, 'A', -16, 22), label(H, 'H', 16, -8), label(N, 'N', 16, 28),
    label(K, 'K', 0, 34), label(C, 'C', 20, 8), label(I, 'I', 24, 8),
  ]
  hinh('HHC000864_de', pts.filter((p) => p !== F), de, OPT)
  hinh('HHC000864_lg', pts, [...de, seg(K, F), tick(A, F, 1, 0.28), tick(F, C, 1), dot(F), label(F, 'F', 2, -12)], OPT)
}

await xuatTat(RA)
