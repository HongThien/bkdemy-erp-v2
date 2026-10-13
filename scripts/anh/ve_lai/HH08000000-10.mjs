// Vẽ lại hình — gói HH08000000-10 (Hình học 8 lấy từ các đề thi/đề cương; 9 hình LỜI GIẢI).
//   node scripts/anh/ve_lai/HH08000000-10.mjs [<thu_muc_ra>]
import { P, seg, segDash, rightAngle, tick, dot, label, hinh, xuatTat,
  mid, foot, inter, lerp, add, vec, goc, dist, doiXung, reflect, labelOut, trongTam } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH08000000-10/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.01, m)
const OPT = { pad: 32, padDuoi: 38 }
const song2 = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x))

// ── HHC002630_lg — ABCD chữ nhật (A trên-trái, B trên-phải, C dưới-phải, D dưới-trái); I, K ∈ CD, DI = CK; AI ⊥ IN, N ∈ BC;
//    O trung điểm AN; M ∈ AD với NM ⊥ AD; F = DO ∩ BC.  Gạch: DI = CK (1), OA = ON (2).  Vuông: D, C, M, I.
{
  const w = 330, h = 200, i = 60
  const A = P(0, 0), B = P(w, 0), C = P(w, h), D = P(0, h)
  const I = P(i, h), K = P(w - i, h)
  const n = i * (w - i) / h                       // AI ⊥ IN ⇒ (w−i)·i = h·n
  const N = P(w, h - n), M = P(0, h - n)
  const O = mid(A, N), F = inter(D, O, B, C)
  gt(goc(I, A, N), 90, 'AI ⊥ IN'); gt(dist(D, I), dist(C, K), 'DI = CK'); gt(dist(O, A), dist(O, N), 'OA = ON')
  gt(goc(M, A, N), 90, 'NM ⊥ AD')
  gt(song2(B, O, B, M), 0, 'B, O, M thẳng hàng (hệ quả)'); gt(dist(O, B), dist(O, M), 'O trung điểm BM (hệ quả)')
  ok(F.y < B.y, 'F nằm phía trên B')
  const G = trongTam([A, B, C, D])
  hinh('HHC002630_lg', [A, B, C, D, F, I, K, M, N, O], [
    seg(A, B), seg(B, F), seg(B, C), seg(C, D), seg(D, A), seg(A, I), seg(I, N), seg(A, N), seg(A, K), seg(B, K),
    seg(B, M), seg(M, N), seg(M, K), seg(D, F), seg(K, N),
    tick(D, I, 1), tick(K, C, 1), tick(A, O, 2), tick(O, N, 2),
    rightAngle(D, A, C, 14), rightAngle(C, B, D, 14), rightAngle(M, A, N, 14), rightAngle(I, A, N, 14),
    dot(A), dot(B), dot(C), dot(D), dot(F), dot(I), dot(K), dot(M), dot(N), dot(O),
    label(A, 'A', -16, -4), label(B, 'B', -16, -8), label(F, 'F', 20, 4), label(M, 'M', -20, 8), label(N, 'N', 20, 8),
    label(O, 'O', 2, -12), label(D, 'D', -18, 26), label(I, 'I', 4, 30), label(K, 'K', 4, 30), label(C, 'C', 20, 24),
  ], OPT)
}

// ── HHC002631_lg — ABC vuông tại A (C phía trên A, B bên phải); M trung điểm BC; D ∈ AM; DE ⊥ AB, DF ⊥ AC; O = AD ∩ EF.
//    Gạch: CM = MB (2).  Vuông: A, E, F.  (D lấy ở 0,6·AM — không phải trung điểm, vì "D là trung điểm" là đáp án ý c.)
{
  const A = P(0, 0), B = P(360, 0), C = P(0, -235)
  const M = mid(B, C), D = lerp(A, M, 0.6)
  const E = foot(D, A, B), F = foot(D, A, C)
  const O = inter(A, D, E, F)
  gt(goc(A, B, C), 90, 'A vuông')
  gt(goc(E, D, A), 90, 'DE ⊥ AB'); gt(dist(O, A), dist(O, D), 'O trung điểm AD (hệ quả)')
  gt(song2(E, F, B, C), 0, 'EF ∥ BC (hệ quả)')
  hinh('HHC002631_lg', [A, B, C, M, D, E, F, O], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, M), seg(E, F), seg(D, E), seg(D, F),
    tick(C, M, 2), tick(M, B, 2),
    rightAngle(A, B, C, 14), rightAngle(E, A, D, 14), rightAngle(F, A, D, 14),
    dot(A), dot(B), dot(C), dot(M), dot(D), dot(E), dot(F), dot(O),
    label(C, 'C', 2, -14), label(B, 'B', 22, 10), label(A, 'A', -16, 22), label(M, 'M', 20, -6), label(D, 'D', 8, -14),
    label(F, 'F', -18, 6), label(E, 'E', 2, 32), label(O, 'O', 4, 28),
  ], OPT)
}

// ── HHC002640_lg — ABC vuông tại A (C trên A, B phải); M trung điểm BC; H, K đối xứng M qua AB, AC; E = MH ∩ AB, F = MK ∩ AC.
//    Gạch: CM = MB (1), ME = EH (2), MF = FK (3).  Vuông: A, E, F.
{
  const A = P(0, 0), B = P(280, 0), C = P(0, -185)
  const M = mid(B, C)
  const H = reflect(M, A, B), K = reflect(M, A, C)
  const E = foot(M, A, B), F = foot(M, A, C)
  gt(goc(A, B, C), 90, 'A vuông'); gt(dist(M, E), dist(E, H), 'ME = EH'); gt(dist(M, F), dist(F, K), 'MF = FK')
  gt(dist(A, M), dist(M, B), 'AM = MB (hệ quả)'); gt(dist(A, H), dist(A, M), 'AH = AM (hệ quả)')
  hinh('HHC002640_lg', [A, B, C, M, H, K, E, F], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, M), seg(A, H), seg(H, B), seg(K, C), seg(K, A), seg(K, M), seg(M, H),
    tick(C, M, 1), tick(M, B, 1), tick(M, E, 2), tick(E, H, 2), tick(K, F, 3), tick(F, M, 3),
    rightAngle(A, B, C, 14), rightAngle(E, A, M, 14), rightAngle(F, A, M, 14),
    dot(A), dot(B), dot(C), dot(M), dot(H), dot(K), dot(E), dot(F),
    label(C, 'C', 2, -14), label(K, 'K', -20, 8), label(F, 'F', -14, -10), label(M, 'M', 22, -10), label(B, 'B', 20, 8),
    label(A, 'A', -16, 24), label(E, 'E', 18, 26), label(H, 'H', 2, 34),
  ], OPT)
}

// ── HHC002641_lg — ABC cân tại A (B trái, C phải); H trung điểm BC; D ∈ HC; ND ⊥ BC, cắt AC tại M, đường thẳng AB tại N; K trung điểm MN.
//    Gạch: AB = AC (1), BH = HC (2), NK = KM (3).  Vuông: D.
{
  const H = P(0, 0), B = P(-187, 0), C = P(187, 0), A = P(0, -198)
  const D = P(72, 0)
  const M = inter(A, C, D, P(72, -50)), N = inter(A, B, D, P(72, -50))
  const K = mid(M, N)
  gt(dist(A, B), dist(A, C), 'AB = AC')
  gt(goc(D, M, C), 90, 'MN ⊥ BC'); gt(goc(A, M, N), goc(A, N, M), 'AMN cân tại A (hệ quả)')
  gt(K.y, A.y, 'AK ∥ BC (hệ quả)')
  hinh('HHC002641_lg', [A, B, C, H, D, M, N, K], [
    seg(B, C), seg(B, N), seg(A, C), seg(A, H), seg(N, D), seg(A, K),
    tick(A, B, 1, 0.5), tick(A, C, 1, 0.7), tick(B, H, 2), tick(H, C, 2, 0.8), tick(N, K, 3), tick(K, M, 3),
    rightAngle(D, M, C, 14),
    dot(A), dot(B), dot(C), dot(H), dot(D), dot(M), dot(N), dot(K),
    label(N, 'N', 2, -14), label(A, 'A', -20, -4), label(K, 'K', 20, 8), label(M, 'M', 22, 8),
    label(B, 'B', -18, 12), label(C, 'C', 18, 24), label(H, 'H', -4, 34), label(D, 'D', 6, 34),
  ], OPT)
}

// ── HHC002642_lg — ABC bất kỳ; trung tuyến BD, CE cắt nhau tại G; H, K trung điểm GB, GC.
//    Gạch: AE = EB (1), AD = DC (2), BH = HG (3), GK = KC (4).
{
  const B = P(0, 0), C = P(400, 0), A = P(259, -250)
  ok(Math.abs(dist(A, B) - dist(A, C)) > 20, 'ABC không cân')
  const D = mid(A, C), E = mid(A, B)
  const G = inter(B, D, C, E)
  const H = mid(G, B), K = mid(G, C)
  gt(dist(G, B), 2 * dist(G, D), 'G trọng tâm'); gt(dist(G, D), dist(G, H), 'GH = GD (hệ quả)')
  gt(dist(G, E), dist(G, K), 'GK = GE (hệ quả)')
  hinh('HHC002642_lg', [A, B, C, D, E, G, H, K], [
    seg(A, B), seg(A, C), seg(B, C), seg(E, D), seg(B, D), seg(C, E), seg(E, H), seg(D, K), seg(H, K),
    tick(A, E, 1), tick(E, B, 1), tick(A, D, 2), tick(D, C, 2), tick(B, H, 3), tick(H, G, 3), tick(G, K, 4), tick(K, C, 4),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(G), dot(H), dot(K),
    label(A, 'A', 2, -14), label(E, 'E', -20, 4), label(D, 'D', 20, 4), label(G, 'G', 2, -12),
    label(B, 'B', -16, 10), label(C, 'C', 18, 10), label(H, 'H', -4, 30), label(K, 'K', 4, 30),
  ], OPT)
}

// ── HHC002643_lg — ABC vuông tại A (B trên A, C phải); M ∈ BC (không phải chân phân giác); ME ∥ AB (E ∈ AC), MF ∥ AC (F ∈ AB).
//    Vuông: A.
{
  const A = P(0, 0), B = P(0, -264), C = P(408, 0)
  const M = lerp(B, C, 0.62)
  const F = P(0, M.y), E = P(M.x, 0)
  gt(goc(A, B, C), 90, 'A vuông'); gt(song2(M, E, A, B), 0, 'ME ∥ AB'); gt(song2(M, F, A, C), 0, 'MF ∥ AC')
  ok(Math.abs(Math.abs(M.x) - Math.abs(M.y)) > 20, 'M không ở chân phân giác')
  hinh('HHC002643_lg', [A, B, C, M, E, F], [
    seg(A, B), seg(A, C), seg(B, C), seg(F, M), seg(M, E),
    rightAngle(A, B, C, 14),
    dot(A), dot(B), dot(C), dot(M), dot(E), dot(F),
    label(B, 'B', -2, -14), label(F, 'F', -20, 8), label(M, 'M', 22, -8), label(A, 'A', -18, 20), label(E, 'E', 2, 34), label(C, 'C', 20, 20),
  ], OPT)
}

// ── HHC002644_lg — ABC vuông tại A (B trên A, C phải); E, G, F trung điểm AB, BC, AC; EI ∥ BF, I ∈ GF (kéo dài qua F).
//    Gạch: BE = EA (1), AF = FC (2), BG = GC (3).  Vuông: A.
{
  const A = P(0, 0), B = P(0, -216), C = P(360, 0)
  const E = mid(A, B), G = mid(B, C), F = mid(A, C)
  const I = inter(E, add(E, vec(B, F)), G, F)
  gt(goc(A, B, C), 90, 'A vuông'); gt(song2(E, I, B, F), 0, 'EI ∥ BF')
  gt(song2(B, E, I, F), 0, 'BE ∥ IF (hệ quả)'); gt(dist(A, G), dist(G, C), 'GA = GC (hệ quả)')
  gt(dist(A, I), dist(I, C), 'AGCI hình thoi: IA = IC (hệ quả)'); gt(dist(A, I), dist(A, G), 'IA = GA (hệ quả)')
  hinh('HHC002644_lg', [A, B, C, E, G, F, I], [
    seg(A, B), seg(A, C), seg(B, C), seg(E, G), seg(G, I), seg(B, F), seg(E, I), seg(A, G), seg(A, I), seg(I, C),
    tick(B, E, 1), tick(E, A, 1), tick(A, F, 2), tick(F, C, 2), tick(B, G, 3), tick(G, C, 3),
    rightAngle(A, B, C, 14),
    dot(A), dot(B), dot(C), dot(E), dot(G), dot(F), dot(I),
    label(B, 'B', -2, -14), label(E, 'E', -20, 8), label(G, 'G', 18, -10), label(A, 'A', -18, 20),
    label(F, 'F', -16, 26), label(I, 'I', 2, 34), label(C, 'C', 20, 20),
  ], OPT)
}

// ── HHC002645_lg — ABCD chữ nhật AB = 2BC; I, K trung điểm AB, DC; S, R tâm hình vuông AIKD, BIKC.
//    Gạch: AI = IB (1), DK = KC (2).  Nét thêm: IK, AK, ID (qua S), IC, BK (qua R).
{
  const A = P(0, 0), B = P(360, 0), C = P(360, 180), D = P(0, 180)
  const I = mid(A, B), K = mid(D, C)
  const S = mid(I, D), R = mid(I, C)
  gt(dist(A, B), 2 * dist(B, C), 'AB = 2BC')
  gt(dist(S, A), dist(S, K), 'S tâm AIKD'); gt(dist(R, B), dist(R, K), 'R tâm BIKC')
  hinh('HHC002645_lg', [A, B, C, D, I, K, S, R], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(I, K), seg(A, K), seg(I, D), seg(I, C), seg(B, K),
    tick(A, I, 1), tick(I, B, 1), tick(D, K, 2), tick(K, C, 2),
    dot(A), dot(B), dot(C), dot(D), dot(I), dot(K), dot(S), dot(R),
    label(A, 'A', -16, -8), label(I, 'I', 0, -14), label(B, 'B', 16, -8),
    label(S, 'S', -20, 10), label(R, 'R', 22, 10),
    label(D, 'D', -16, 26), label(K, 'K', 0, 34), label(C, 'C', 18, 26),
  ], OPT)
}

await xuatTat(RA)
