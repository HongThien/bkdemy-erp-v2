// Vẽ lại hình — gói HH08000000-8 (Chưa phân dạng — Hình học 8): 8 hình, 5 hình lời giải (_lg).
//   node scripts/anh/ve_lai/HH08000000-8.mjs [<thu_muc_ra>]
import { P, seg, segDash, tick, rightAngle, dot, label, num, bien, hinh, xuatTat, angleBien, sideText,
  lerp, mid, foot, inter, doiXung, goc, dist, ray, add, vec, poly } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH08000000-8/moi'
const ok = (c, m) => console.assert(c, m)
const near = (a, b, e = 0.01) => Math.abs(a - b) < e
// tên điểm có viền trắng quanh chữ (để nét đi qua không dính vào chữ)
const labelNen = (p, t, dx, dy) => label(p, t, dx, dy).replace('stroke="none"', 'stroke="#fff" stroke-width="6" paint-order="stroke" stroke-linejoin="round"')

// ── HHC002556_lg — ABC vuông tại A (AB < AC), M trung điểm BC, MH ⊥ AB, MK ⊥ AC, E: H trung điểm ME, O = AM ∩ HK.
{
  const A = P(0, 0), B = P(138, 0), C = P(0, -207)
  const M = mid(B, C), H = foot(M, A, B), K = foot(M, A, C), E = doiXung(M, H)
  const O = inter(A, M, H, K)
  ok(near(goc(A, B, C), 90) && dist(A, B) < dist(A, C), 'A vuông, AB < AC')
  ok(near(goc(H, A, M), 90) && near(goc(K, A, M), 90), 'MH ⊥ AB, MK ⊥ AC')
  ok(near(dist(H, M), dist(H, E)), 'H trung điểm ME')
  ok(near(dist(O, A), dist(O, M)), 'O trung điểm AM')
  hinh('HHC002556_lg', [A, B, C, E, P(-40, 0), P(190, 0)], [
    seg(A, B), seg(A, C), seg(C, B), seg(M, E), seg(K, M), seg(A, M), seg(K, H), segDash(A, E), segDash(B, E),
    rightAngle(A, B, C, 12), rightAngle(K, M, C, 12), rightAngle(H, B, M, 12),
    tick(C, M, 1), tick(M, B, 1), tick(M, H, 2), tick(H, E, 2),
    dot(A), dot(B), dot(C), dot(K), dot(M), dot(H), dot(O), dot(E),
    label(C, 'C', 0, -14), label(K, 'K', -20, 8), label(M, 'M', 20, -8), label(O, 'O', -18, 8),
    label(A, 'A', -16, 24), label(H, 'H', 16, 26), label(B, 'B', 12, 28), label(E, 'E', 0, 36),
  ], { pad: 36, padDuoi: 48 })
}

// ── HHC002563_lg — ABC vuông tại A (AB < AC), M trung điểm BC, MD ⊥ AB, ME ⊥ AC, E trung điểm MK, I = AM ∩ DE.
{
  const A = P(0, 0), B = P(210, 0), C = P(0, -300)
  const M = mid(B, C), D = foot(M, A, B), E = foot(M, A, C), K = doiXung(M, E)
  const I = inter(A, M, D, E)
  ok(near(goc(A, B, C), 90) && dist(A, B) < dist(A, C), 'A vuông, AB < AC')
  ok(near(goc(D, A, M), 90) && near(goc(E, A, M), 90), 'MD ⊥ AB, ME ⊥ AC')
  ok(near(dist(E, K), dist(E, M)), 'E trung điểm MK')
  hinh('HHC002563_lg', [A, B, C, K, P(-30, 30)], [
    seg(A, B), seg(A, C), seg(C, B), seg(K, M), seg(M, D), seg(A, M), seg(D, E),
    rightAngle(A, B, C, 14), rightAngle(E, M, A, 14), rightAngle(D, A, M, 14),
    tick(C, M, 1), tick(M, B, 1), tick(K, E, 2), tick(E, M, 2),
    dot(A), dot(B), dot(C), dot(K), dot(E), dot(M), dot(D), dot(I),
    label(C, 'C', 0, -14), label(K, 'K', -4, -14), label(E, 'E', 18, -12), label(M, 'M', 20, -10),
    label(I, 'I', 4, 30), label(A, 'A', -16, 26), label(D, 'D', 6, 32), label(B, 'B', 8, 30),
  ], { pad: 36, padDuoi: 48 })
}

// ── HHC002564_lg — ABC vuông tại A (AB > AC), AH ⊥ BC, HN ⊥ AB, HM ⊥ AC, O = MN ∩ AH; M trung điểm AF, I = HM ∩ FN;
//    E trung điểm BC; xy qua A, vuông góc OE; K = MN ∩ BC (nằm trên xy).
{
  const A = P(0, 0), B = P(280, 0), C = P(0, -175)
  const H = foot(A, B, C), N = foot(H, A, B), M = foot(H, A, C)
  const O = inter(A, H, M, N)
  const F = doiXung(A, M), I = inter(H, M, F, N)
  const E = mid(B, C), K = inter(M, N, B, C)
  ok(near(goc(A, B, C), 90) && dist(A, B) > dist(A, C), 'A vuông, AB > AC')
  ok(near(goc(A, N, M), 90) && near(goc(N, A, H), 90) && near(goc(M, A, H), 90) && near(goc(H, N, M), 90), 'ANHM chữ nhật')
  ok(near(dist(M, A), dist(M, F)) && F.y < C.y, 'M trung điểm AF, F ngoài đoạn AC')
  ok(near(dist(I, H), dist(I, M)), 'I trung điểm HM')
  ok(Math.abs((K.x - A.x) * (E.x - O.x) + (K.y - A.y) * (E.y - O.y)) < 1e-6 * 1e4, 'AK ⊥ OE (xy qua K)')
  const u = P((K.x - A.x) / dist(A, K), (K.y - A.y) / dist(A, K))
  const X = P(A.x - u.x * 40, A.y - u.y * 40), Y = P(K.x + u.x * 34, K.y + u.y * 34)
  hinh('HHC002564_lg', [A, B, F, K, X, Y, P(-28, 0)], [
    seg(A, B), seg(A, F), seg(C, B), seg(X, Y), segDash(K, C), segDash(K, M),
    seg(H, N), seg(H, M), seg(A, H), seg(M, N), seg(F, H), seg(F, N), seg(O, E),
    rightAngle(A, B, C, 12), rightAngle(M, H, A, 12), rightAngle(H, M, N, 12), rightAngle(N, A, H, 12),
    tick(A, M, 1), tick(M, F, 1), tick(C, E, 2, 0.3), tick(E, B, 2),
    dot(A), dot(B), dot(C), dot(M), dot(N), dot(H), dot(O), dot(E), dot(F), dot(I), dot(K),
    label(F, 'F', 0, -14), label(K, 'K', -20, 4), labelNen(C, 'C', -16, 14), labelNen(M, 'M', 18, -10),
    label(H, 'H', 22, -10), label(I, 'I', 14, 28), label(O, 'O', -18, 8), label(E, 'E', 14, -12),
    label(A, 'A', -18, 26), label(N, 'N', 0, 34), label(B, 'B', 8, 32),
    label(Y, 'y', -14, -4), label(X, 'x', 16, 20),
  ], { pad: 36, padDuoi: 52 })
}

// ── HHC002568 — sơ đồ nhà An (A), nhà Bình (B), nhà Châu (C): tam giác vuông tại A; AB = 450 m, AC = 600 m (không ghi BC).
{
  const k = 0.52
  const A = P(0, 0), B = P(0, -450 * k), C = P(600 * k, 0)
  ok(near(goc(A, B, C), 90), 'A vuông')
  hinh('HHC002568', [A, B, C, P(-90, 0), P(C.x + 32, 0)], [
    seg(A, B), seg(A, C), seg(B, C), rightAngle(A, B, C, 14),
    dot(A), dot(B), dot(C),
    label(A, 'A', 22, 28), num(A, 'Nhà An', -56, 4), label(B, 'B', -16, -2), num(B, 'Nhà Bình', 62, -8),
    label(C, 'C', 24, 8), num(C, 'Nhà Châu', 0, 34),
    sideText(A, B, '450 m', C, 40), sideText(A, C, '600 m', B, 26),
  ], { pad: 40, padDuoi: 50 })
}

// ── HHC002574_lg — ABC vuông tại A, M trung điểm BC, D, E hình chiếu của M trên AB, AC; P, Q trung điểm BM, MC.
//    Ký hiệu bằng nhau theo ảnh cũ: BM = MC (1 gạch), CQ = QM (3 gạch), MP = PB (2 gạch).
{
  const A = P(0, 0), B = P(350, 0), C = P(0, -235)
  const M = mid(B, C), D = foot(M, A, B), E = foot(M, A, C)
  const Pp = mid(B, M), Q = mid(M, C)
  ok(near(goc(A, B, C), 90) && !near(dist(A, B), dist(A, C), 1), 'A vuông, AB ≠ AC')
  ok(near(goc(D, A, M), 90) && near(goc(E, A, M), 90), 'MD ⊥ AB, ME ⊥ AC')
  hinh('HHC002574_lg', [A, B, C, P(-30, 0)], [
    seg(A, B), seg(A, C), seg(C, B), seg(E, M), seg(D, M), seg(A, M), seg(E, D), seg(E, Q), seg(D, Pp),
    rightAngle(A, B, C, 14), rightAngle(E, M, A, 14), rightAngle(D, A, M, 14),
    tick(C, Q, 1, 0.18), tick(C, Q, 3, 0.55), tick(Q, M, 3), tick(M, Pp, 2), tick(Pp, B, 2, 0.45), tick(Pp, B, 1, 0.85),
    dot(A), dot(B), dot(C), dot(M), dot(D), dot(E), dot(Pp), dot(Q),
    label(C, 'C', -4, -14), label(Q, 'Q', 20, -8), label(E, 'E', -20, 8), label(M, 'M', 22, -8),
    label(Pp, 'P', 16, -8), label(A, 'A', -16, 26), label(D, 'D', 0, 32), label(B, 'B', 8, 30),
  ], { pad: 36, padDuoi: 48 })
}

// ── HHC002575 — bốn hình: Hình 1 tứ giác lồi, Hình 2 ngũ giác lồi, Hình 3 hai cạnh cắt nhau (không lồi), Hình 4 hình chữ nhật.
{
  const s = 0.9
  const Q = (x, y) => P(x * s, y * s)
  const R = (x, y) => P((x - 450) * s, (y + 190) * s) // hàng dưới: Hình 3, Hình 4 (xếp 2×2 cho chữ khỏi bé)
  const h1 = [Q(78, 42), Q(185, 17), Q(210, 138), Q(64, 136)]
  const h2 = [Q(299, 11), Q(410, 15), Q(446, 110), Q(346, 136), Q(272, 91)]
  const h3 = [R(514, 17), R(678, 14), R(631, 122), R(520, 115)]      // nối theo thứ tự này cho ra hai cạnh cắt nhau: TL–BR, TR–BL
  const h4 = [R(740, 17), R(906, 17), R(906, 121), R(740, 121)]
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
  const lồi = (v) => { const sg = v.map((_, i) => Math.sign(cross(v[i], v[(i + 1) % v.length], v[(i + 2) % v.length]))); return sg.every((x) => x === sg[0]) }
  ok(lồi(h1) && lồi(h2) && lồi(h4), 'Hình 1, 2, 4 lồi')
  ok(!lồi([h3[0], h3[2], h3[1], h3[3]]), 'Hình 3 không lồi')
  const bow = (v) => [seg(v[0], v[1]), seg(v[0], v[2]), seg(v[1], v[3]), seg(v[3], v[2])]
  const cap = (x, t, hang = 0) => num(P(x * s, (174 + hang * 190) * s), t, 0, 0, 22)
  hinh('HHC002575', [...h1, ...h2, ...h3, ...h4, P(64 * s, 366 * s)], [
    poly(h1), poly(h2), bow(h3).join(''), poly(h4),
    ...[...h1, ...h2, ...h3, ...h4].map(dot),
    cap(137, 'Hình 1'), cap(359, 'Hình 2'), cap(142, 'Hình 3', 1), cap(373, 'Hình 4', 1),
  ], { pad: 30, padDuoi: 36 })
}

// ── HHC002578 — tứ giác MNPQ, M = x, N = 3x, P = 2x, Q = x + 10° (x = 50° ⇒ M 50°, N 150°, P 100°, Q 60°).
{
  const x = 50
  const M = P(0, 0), Qd = ray(M, 0, 330)
  const N = ray(M, x, 124)
  const dirNP = ray(N, 20, 100)                                          // N→P hợp với NM góc 150° ⇒ hướng 20°
  const Pp = inter(N, dirNP, Qd, ray(Qd, 180 - (x + 10), 100))
  ok(near(goc(M, Qd, N), x, 0.2) && near(goc(N, M, Pp), 3 * x, 0.2) && near(goc(Pp, N, Qd), 2 * x, 0.2) && near(goc(Qd, Pp, M), x + 10, 0.2), 'bốn góc x, 3x, 2x, x+10°')
  hinh('HHC002578', [M, N, Pp, Qd], [
    seg(M, N), seg(N, Pp), seg(Pp, Qd), seg(Qd, M),
    angleBien(M, Qd, N, 'x', 64), angleBien(N, M, Pp, '3x', 50), angleBien(Pp, N, Qd, '2x', 50), angleBien(Qd, M, Pp, 'x + 10°', 92),
    dot(M), dot(N), dot(Pp), dot(Qd),
    label(M, 'M', -18, 8), label(N, 'N', -18, -6), label(Pp, 'P', 4, -16), label(Qd, 'Q', 20, 8),
  ], { pad: 44, padDuoi: 54 })
}

// ── HHC002581_lg — hình bình hành ABCD (AB = 2AD), M, N trung điểm AB, CD; P = AN ∩ DM, Q = CM ∩ BN; MN nét đứt.
{
  const A = P(0, 0), B = P(340, 0), D = ray(A, 65, 170), C = add(B, vec(A, D))
  const M = mid(A, B), N = mid(D, C)
  const Pp = inter(A, N, D, M), Q = inter(M, C, B, N)
  ok(near(dist(A, B), 2 * dist(A, D)) && near(dist(D, C), dist(A, B)) && near(dist(B, C), dist(A, D)), 'ABCD bình hành, AB = 2AD')
  hinh('HHC002581_lg', [A, B, C, D], [
    poly([A, B, C, D]), seg(A, N), seg(D, M), seg(M, C), seg(N, B), segDash(M, N),
    tick(D, N, 2), tick(N, C, 2), tick(A, M, 1), tick(M, B, 1),
    dot(A), dot(B), dot(C), dot(D), dot(M), dot(N), dot(Pp), dot(Q),
    label(D, 'D', -8, -14), label(N, 'N', 0, -14), label(C, 'C', 14, -14), label(A, 'A', -14, 26), label(M, 'M', 0, 34),
    label(B, 'B', 14, 26), label(Pp, 'P', -20, 8), label(Q, 'Q', 20, 8),
  ], { pad: 40, padDuoi: 52 })
}

await xuatTat(RA)
