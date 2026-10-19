// Vẽ lại hình — gói HH00140-10 (Ôn thi giữa kì I, Hình học 9; hình đề + hình lời giải _lg).
//   node scripts/anh/ve_lai/HH00140-10.mjs [<thu_muc_ra>]
// Dựng điểm bằng số đo CỦA ĐỀ (foot/mid/inter/ray…), không chép toạ độ ước mắt từ ảnh cũ.
import { P, seg, segDash, tick, angleMark, rightAngle, ray, lerp, mid, foot, inter, dist, goc, dot, label, num, sideText, angleText, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00140-10/moi'
const D = (...ps) => ps.map(dot).join('')
const ok = (v, e, tol, ten) => console.assert(Math.abs(v - e) < tol, `${ten}: ${v} ≠ ${e}`)

// HHC003164_lg — tam giác MNP vuông tại M (MN = 2√3, MP = 6 ⇒ góc N = 60°), đường cao MH, D/E hình chiếu của H, K giữa E–P, I chân đường vuông góc hạ từ M xuống NK
{
  const MP = 290, MN = MP / Math.sqrt(3)
  const M = P(0, 0), N = P(MN, 0), Pp = P(0, -MP)
  const H = foot(M, N, Pp), Dd = foot(H, M, N), E = foot(H, M, Pp)
  const K = lerp(M, Pp, 0.625), I = foot(M, N, K)
  ok(goc(N, M, Pp), 60, 0.01, 'N=60'); ok(goc(H, M, N), 90, 0.01, 'MH⊥NP'); ok(goc(I, M, K), 90, 0.01, 'MI⊥NK')
  console.assert(E.y < M.y && E.y > K.y && K.y > Pp.y, 'K nằm giữa E và P')
  hinh('HHC003164_lg', [M, N, Pp], [
    seg(M, N), seg(M, Pp), seg(Pp, N), seg(M, H), seg(H, Dd), seg(H, E), seg(K, N), seg(M, I),
    rightAngle(M, N, Pp), rightAngle(E, M, H), rightAngle(Dd, M, H), rightAngle(H, M, N), rightAngle(I, M, N),
    D(M, N, Pp, H, Dd, E, K, I),
    label(Pp, 'P', 0, -14), label(M, 'M', -20, 26), label(N, 'N', 20, 24), label(Dd, 'D', 0, 34),
    label(E, 'E', -22, 8), label(K, 'K', -22, 8), label(H, 'H', 22, -10), label(I, 'I', -6, -16)])
}

// HHC003166 — toà nhà (vật thể → sơ đồ): tam giác ABC vuông tại A, AC = 215 m, góc C = 65°
{
  const AC = 135, C = P(0, 0), A = P(AC, 0), B = P(AC, -AC * Math.tan(65 * Math.PI / 180))
  ok(goc(C, A, B), 65, 0.01, 'C=65')
  hinh('HHC003166', [C, A, B, P(A.x + 95, -100)], [
    seg(C, A), seg(A, B), seg(C, B), angleMark(C, A, B, 34), rightAngle(A, C, B),
    num(P(A.x + 52, B.y / 2), 'Toà nhà'),
    D(C, A, B), label(C, 'C', -22, 8), label(A, 'A', 22, 30), label(B, 'B', 0, -14)])
}

// HHC003167_lg — ABC vuông tại A (sin C = 3/5, BC = 20 ⇒ AB = 12, AC = 16), đường cao AH, BD ⊥ BC cắt AC tại D, K ∈ AC, KM ⊥ HC, KN ⊥ AH
{
  const u = 16, A = P(0, 0), B = P(0, -12 * u), C = P(16 * u, 0)
  const H = foot(A, B, C), Dd = inter(B, P(B.x + (C.y - B.y), B.y - (C.x - B.x)), A, C)
  const K = P(10 * u, 0), M = foot(K, H, C), N = foot(K, A, H)
  ok(goc(B, Dd, C), 90, 0.01, 'BD⊥BC'); ok(goc(A, B, C), 90, 0.01, 'A=90'); ok(goc(M, K, C), 90, 0.01, 'KM⊥HC'); ok(goc(N, K, H), 90, 0.01, 'KN⊥AH')
  ok(dist(A, Dd), 9 * u, 0.01, 'AD=AB²/AC')
  hinh('HHC003167_lg', [Dd, B, C], [
    seg(Dd, C), seg(A, B), seg(Dd, B), seg(B, C), seg(A, H), seg(N, K), seg(K, M),
    rightAngle(B, Dd, C), rightAngle(A, C, B), rightAngle(H, A, C), rightAngle(N, H, K), rightAngle(M, H, K),
    D(Dd, A, B, C, H, K, M, N),
    label(B, 'B', 0, -14), label(Dd, 'D', -6, 34), label(A, 'A', 14, 34), label(K, 'K', 0, 34), label(C, 'C', 18, 30),
    label(H, 'H', 22, -8), label(N, 'N', -22, 6), label(M, 'M', 24, -6)])
}

// HHC003168_lg — ABC vuông tại A (AB < AC; vẽ theo AB = 6, AC = 8), AH ⊥ BC, BM ⊥ AB (M ∈ AH), MN ∥ BC (N ∈ AC), K hình chiếu của M trên AN
{
  const u = 23, A = P(0, 0), B = P(6 * u, 0), C = P(0, -8 * u)
  const H = foot(A, B, C), M = inter(A, H, B, P(B.x, -50))        // M = AH ∩ (đường vuông góc AB tại B)
  const N = inter(M, P(M.x + (C.x - B.x), M.y + (C.y - B.y)), A, C) // MN ∥ BC
  const K = foot(M, A, N)
  ok(goc(H, A, C), 90, 0.01, 'AH⊥BC')
  ok(goc(B, M, A), 90, 0.01, 'MB⊥AB'); ok(goc(K, M, A), 90, 0.01, 'MK⊥AN')
  console.assert(Math.abs((N.x - M.x) * (C.y - B.y) - (N.y - M.y) * (C.x - B.x)) < 1e-6, 'MN∥BC')
  ok(goc(M, A, N), 90, 0.01, 'AM⊥MN')
  hinh('HHC003168_lg', [A, B, N, M], [
    seg(A, B), seg(A, N), seg(B, C), seg(A, M), seg(B, M), seg(M, N), seg(K, M),
    rightAngle(A, B, C), rightAngle(B, A, M), rightAngle(K, M, A), rightAngle(H, A, B),
    D(A, B, C, H, M, N, K),
    label(N, 'N', -2, -14), label(C, 'C', -22, 8), label(K, 'K', -22, 8), label(A, 'A', -16, 30), label(B, 'B', 18, 26),
    label(M, 'M', 24, 6), label(H, 'H', 26, 8)])
}

// HHC003169 — cây xanh (vật thể → sơ đồ): tam giác AHB vuông tại H, HB = 14,25 m, góc B = 55°
{
  const HB = 160, H = P(0, 0), B = P(HB, 0), A = P(0, -HB * Math.tan(55 * Math.PI / 180))
  ok(goc(B, H, A), 55, 0.01, 'B=55')
  const y = 46, mui = (x, h) => `<path d="M ${x} ${y} L ${x + h * 12} ${y - 5} L ${x + h * 12} ${y + 5} Z" fill="#222"/>`
  hinh('HHC003169', [A, P(-45, 0), P(HB + 45, 0), P(0, 60)], [
    seg(P(-45, 0), P(HB + 45, 0)), seg(H, A), seg(A, B), angleMark(B, H, A, 34), rightAngle(H, B, A),
    angleText(B, A, H, '55°', 80), seg(P(0, y), P(HB, y)), mui(0, 1), mui(HB, -1), num(P(HB / 2, y), '14,25 m', 0, 28),
    num(P(-40, A.y / 2), 'Cây'),
    D(H, B, A), label(A, 'A', -18, -8), label(H, 'H', -2, 28), label(B, 'B', 16, 28)])
}

// HHC003170_lg — ABC vuông tại A (AB = 3, AC = 4), đường cao AH, M trung điểm BC, BE ⊥ AM (E), BE cắt AC tại F
{
  const u = 84, B = P(0, 0), C = P(5 * u, 0), BH = 9 / 5 * u, AH = 2.4 * u
  const H = P(BH, 0), A = P(BH, -AH), M = mid(B, C)
  const E = foot(B, A, M), F = inter(B, E, A, C)
  ok(goc(A, B, C), 90, 0.01, 'A=90'); ok(dist(A, B), 3 * u, 0.01, 'AB'); ok(dist(A, C), 4 * u, 0.01, 'AC')
  ok(goc(E, A, F), 90, 0.01, 'BE⊥AM')
  console.assert(F.x > A.x && F.x < C.x, 'F ∈ AC')
  hinh('HHC003170_lg', [A, B, C], [
    seg(B, C), seg(A, B), seg(A, C), seg(A, H), seg(A, M), seg(B, F),
    tick(B, M, 1), tick(M, C, 1),
    rightAngle(A, B, C), rightAngle(H, A, B), rightAngle(E, A, B),
    D(A, B, C, H, M, E, F),
    label(A, 'A', -18, -12), label(B, 'B', -18, 26), label(H, 'H', -2, 34), label(M, 'M', 14, 34), label(C, 'C', 20, 28),
    label(E, 'E', 24, 30), label(F, 'F', 24, 6)])
}

// HHC003171 — ca nô A, chân tháp B, mắt người C (vật thể → sơ đồ): AB = 250 m, AB ∥ Cx, góc ACx = 32°, BC ⊥ AB
{
  const k = 0.9, AB = 250 * k, A = P(0, 0), B = P(AB, 0), C = P(AB, -AB * Math.tan(32 * Math.PI / 180))
  const X = P(-30, C.y)
  ok(goc(C, X, A), 32, 0.01, 'ACx=32'); ok(goc(A, B, C), goc(C, X, A), 0.01, 'so le trong')
  hinh('HHC003171', [A, B, C, X, P(-45, 0), P(B.x + 105, 0)], [
    seg(A, B), seg(B, C), seg(A, C), segDash(X, C), angleMark(C, X, A, 50), rightAngle(B, A, C),
    angleText(C, X, A, '32°', 118), sideText(A, B, '250 m', C, 28),
    num(P(AB + 62, C.y / 2 + 8), 'Hải đăng'), num(P(-8, -26), 'Ca nô'),
    D(A, B, C),
    label(X, 'x', -2, -12), label(A, 'A', -14, 34), label(B, 'B', 4, 34), label(C, 'C', 22, 6)])
}

// HHC003172_lg — ABC vuông tại A (AB = 5, AC = 12), AH ⊥ BC, HD ⊥ AB, HE ⊥ AC, G giữa E–C, AK ⊥ BG
{
  const u = 34, A = P(0, 0), B = P(0, -5 * u), C = P(12 * u, 0)
  const H = foot(A, B, C), Dd = foot(H, A, B), E = foot(H, A, C), G = P(0.6 * 12 * u, 0), K = foot(A, B, G)
  ok(goc(A, B, C), 90, 0.01, 'A=90'); ok(goc(H, A, C), 90, 0.01, 'AH⊥BC'); ok(goc(K, A, G), 90, 0.01, 'AK⊥BG')
  console.assert(E.x > A.x && E.x < G.x && G.x < C.x, 'G nằm giữa E và C')
  hinh('HHC003172_lg', [A, B, C], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(H, Dd), seg(H, E), seg(B, G), seg(A, K), seg(H, K),
    rightAngle(A, C, B), rightAngle(Dd, H, A), rightAngle(E, A, H), rightAngle(H, A, C), rightAngle(K, A, G),
    D(A, B, C, H, Dd, E, G, K),
    label(B, 'B', 0, -14), label(Dd, 'D', -22, 8), label(A, 'A', -18, 30), label(E, 'E', -2, 34), label(G, 'G', 4, 34),
    label(C, 'C', 20, 28), label(H, 'H', 14, -14), label(K, 'K', 44, 22)])
}

await xuatTat(RA)
