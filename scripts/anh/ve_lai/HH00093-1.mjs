// Vẽ lại hình — gói HH00093-1 (Hình vuông, Hình học 8 chuyên; 8 hình LỜI GIẢI).
//   node scripts/anh/ve_lai/HH00093-1.mjs [<thu_muc_ra>]
import { P, seg, segDash, rightAngle, angleMark, tick, dot, label, num, angleText, bien, hinh, xuatTat,
  mid, foot, inter, lerp, add, vec, ray, rot, goc, dist, bisector } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00093-1/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.01, m)
const OPT = { pad: 32, padDuoi: 38 }
const thang = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) < 0.5

// ── HH00093001_lg — h.124: a) tứ giác ABCD bất kỳ, E, F, G, H trung điểm AB, BD, DC, CA; b) AD ⊥ BC, AD = BC (EFGH vuông).
//    Hình b: AD, BC kéo dài (nét đứt) gặp nhau tại X ⇒ AD ⊥ BC; gạch AD = BC.
{
  const k = 0.76, sc = 0.85 * k
  const pa = (x, y) => P((x - 88) * sc, (y - 66) * sc)
  const A = pa(130, 108), B = pa(288, 68), C = pa(358, 258), D = pa(88, 262)
  const E = mid(A, B), F = mid(B, D), G = mid(D, C), H = mid(C, A)
  gt(dist(E, F), dist(H, G), 'a) EF = HG'); gt(dist(E, H), dist(F, G), 'a) EH = FG')

  const D2 = P(300 * k + 30, D.y), C2 = P(590 * k + 30, D.y)
  const TH = Math.acos(158 / 290) * 180 / Math.PI
  const X = ray(D2, TH, 158 * k)                       // đỉnh góc vuông: DX ⊥ CX (X nằm trên đường tròn đường kính DC)
  gt(goc(X, D2, C2), 90, 'X: DX ⊥ CX')
  const A2 = ray(D2, TH, 88 * k)                      // A ∈ DX, DA = 125
  const dX = vec(C2, X); const lX = Math.hypot(dX.x, dX.y)
  const B2 = P(C2.x + dX.x / lX * 88 * k, C2.y + dX.y / lX * 88 * k)   // B ∈ CX, CB = 125
  gt(dist(D2, A2), dist(C2, B2), 'b) AD = BC'); gt(goc(X, A2, B2), 90, 'b) AD ⊥ BC')
  const E2 = mid(A2, B2), F2 = mid(B2, D2), G2 = mid(D2, C2), H2 = mid(C2, A2)
  gt(dist(E2, F2), dist(F2, G2), 'b) EFGH thoi'); gt(goc(E2, F2, H2), 90, 'b) EFGH vuông (hệ quả)')
  gt(dist(E2, F2), dist(E2, H2), 'b) EF = EH')
  const ca = P((A.x + C.x) / 2 - 10, D.y + 60), cb = P((D2.x + C2.x) / 2, D.y + 60)
  hinh('HH00093001_lg', [A, B, C, D, A2, B2, C2, D2, X, ca, cb], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    seg(E, F), seg(F, G), seg(G, H), seg(H, E),
    seg(A2, B2), seg(B2, C2), seg(C2, D2), seg(D2, A2), seg(A2, C2), seg(B2, D2),
    seg(E2, F2), seg(F2, G2), seg(G2, H2), seg(H2, E2),
    segDash(A2, X), segDash(B2, X), rightAngle(X, A2, B2, 12),
    tick(D2, A2, 1), tick(C2, B2, 1),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(G), dot(H),
    dot(A2), dot(B2), dot(C2), dot(D2), dot(E2), dot(F2), dot(G2), dot(H2),
    label(A, 'A', -14, -8), label(B, 'B', 14, -8), label(C, 'C', 18, 20), label(D, 'D', -16, 20),
    label(E, 'E', 0, -14), label(F, 'F', -16, 8), label(G, 'G', 0, 32), label(H, 'H', 16, 8),
    label(A2, 'A', -16, -2), label(B2, 'B', 12, -12), label(C2, 'C', 18, 20), label(D2, 'D', -16, 20),
    label(E2, 'E', 0, -14), label(F2, 'F', -20, -4), label(G2, 'G', 0, 32), label(H2, 'H', 24, 26),
    num(ca, 'a)'), num(cb, 'b)'),
  ], OPT)
}

// ── HH00093002_lg — h.125: hình vuông ABCD, M ∈ AC; E, F hình chiếu của M trên AD, CD; K = EM ∩ BC; H = BM ∩ EF.
//    Nét liền: cạnh, AC, EK, MF, BH (B–M–H), EF.  Nét đứt: BE, AF.  Góc vuông tại K.
{
  const S = 300
  const A = P(0, 0), B = P(S, 0), C = P(S, S), D = P(0, S)
  const M = lerp(A, C, 0.4)
  const E = foot(M, A, D), F = foot(M, D, C), K = foot(M, B, C)
  const H = inter(B, M, E, F)
  gt(goc(E, M, A), 90, 'ME ⊥ AD'); gt(goc(F, M, D), 90, 'MF ⊥ CD'); gt(goc(K, M, B), 90, 'MK ⊥ BC')
  gt(goc(H, B, E), 90, 'BH ⊥ EF (hệ quả)')
  ok(thang(B, M, H), 'B, M, H thẳng hàng'); ok(thang(E, H, F), 'E, H, F thẳng hàng')
  hinh('HH00093002_lg', [A, B, C, D, E, F, K, M, H], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(E, K), seg(M, F), seg(B, H), seg(E, F),
    segDash(B, E), segDash(A, F),
    rightAngle(K, M, C, 12),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(K), dot(M), dot(H),
    label(A, 'A', -4, -14), label(B, 'B', 4, -14), label(C, 'C', 18, 24), label(D, 'D', -16, 26),
    label(E, 'E', -18, 8), label(F, 'F', 0, 34), label(K, 'K', 18, 8), label(M, 'M', -2, -12), label(H, 'H', -16, 24),
  ], OPT)
}

// ── HH00093003_lg — h.126: hình vuông ABCD; E trong hình vuông, ECD cân (ED = EC) góc đáy 15°; I: IAD cân tại I, góc đáy 15°.
//    Cung đánh dấu 15° tại A (IAD) và tại D (IDA).  Nét: cạnh, AE, BE, DE, CE, AI, DI, IE.
{
  const S = 300
  const A = P(0, 0), B = P(S, 0), C = P(S, S), D = P(0, S)
  const E = ray(D, 15, S / 2 / Math.cos(15 * Math.PI / 180))      // góc EDC = 15°, E nằm trên trung trực CD
  const I = ray(A, -75, S / 2 / Math.cos(15 * Math.PI / 180))     // góc IAD = 15°
  gt(goc(D, E, C), 15, 'EDC = 15°'); gt(goc(C, E, D), 15, 'ECD = 15°'); gt(dist(E, D), dist(E, C), 'ED = EC')
  gt(goc(A, I, D), 15, 'IAD = 15°'); gt(goc(D, I, A), 15, 'IDA = 15°'); gt(dist(I, A), dist(I, D), 'IA = ID')
  gt(dist(A, E), dist(A, B), 'AE = AB (hệ quả)'); gt(dist(B, E), dist(A, B), 'BE = AB (hệ quả)')
  gt(dist(D, I), dist(D, E), 'DIE đều (hệ quả)'); gt(dist(I, E), dist(D, E), 'IE = DE (hệ quả)')
  hinh('HH00093003_lg', [A, B, C, D, E, I], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, E), seg(B, E), seg(D, E), seg(C, E),
    seg(A, I), seg(D, I), seg(I, E),
    angleMark(A, D, I, 50, 1), angleMark(D, A, I, 50, 1),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(I),
    label(A, 'A', -4, -14), label(B, 'B', 4, -14), label(C, 'C', 18, 24), label(D, 'D', -16, 26),
    label(E, 'E', 26, -12), label(I, 'I', 22, 6),
  ], OPT)
}

// ── HH00093004_lg — h.127: ABC cân tại A, góc đáy 75°; hình vuông BDEC (D ở trên B, E ở trên C); I: tam giác đều BIC trong hình vuông.
//    Nét: AB, AC, AD, AE, DE, BD, EC, BC, AI, IB, IC.  Gạch: IB = IC = BC (1 gạch).
{
  const S = 170
  const B = P(0, 0), C = P(S, 0), D = P(0, -S), E = P(S, -S)
  const A = ray(B, 75, S / 2 / Math.cos(75 * Math.PI / 180))
  const I = ray(B, 60, S)
  gt(goc(B, A, C), 75, 'B = 75°'); gt(goc(C, A, B), 75, 'C = 75°'); gt(dist(A, B), dist(A, C), 'AB = AC')
  gt(dist(I, B), S, 'IB = BC'); gt(dist(I, C), S, 'IC = BC'); ok(thang(A, I, mid(B, C)), 'A, I, trung điểm BC thẳng hàng')
  gt(dist(A, D), S, 'AD = DE (hệ quả)'); gt(dist(A, E), S, 'AE = DE (hệ quả)')
  hinh('HH00093004_lg', [A, B, C, D, E, I], [
    seg(B, C), seg(B, D), seg(C, E), seg(D, E), seg(A, B), seg(A, C), seg(A, D), seg(A, E), seg(A, I), seg(I, B), seg(I, C),
    tick(B, C, 1), tick(B, I, 1), tick(C, I, 1),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(I),
    label(A, 'A', 0, -14), label(D, 'D', -18, 6), label(E, 'E', 20, 6), label(B, 'B', -16, 24), label(C, 'C', 18, 24),
    label(I, 'I', 18, 4),
  ], OPT)
}

// ── HH00093005_lg — h.128: hình vuông ABCD, F ∈ BC, E ∈ CD với ∠EAF = 45°; K ∈ tia đối DC, DK = BF.
//    Nét: cạnh, K–D–E–C, AK, AE, AF, EF.  Gạch: DK = BF (1).  Cung: ∠KAE và ∠EAF (bằng nhau, 1 cung mỗi góc).
{
  const S = 300, b = 0.35, d = (1 - b) / (1 + b)
  const A = P(0, 0), B = P(S, 0), C = P(S, S), D = P(0, S)
  const F = P(S, b * S), E = P(d * S, S), K = P(-b * S, S)
  gt(goc(A, E, F), 45, 'EAF = 45°'); gt(goc(A, K, F), 90, 'KAF = 90°'); gt(dist(A, K), dist(A, F), 'AK = AF')
  gt(dist(D, K), dist(B, F), 'DK = BF')
  gt(dist(C, E) + dist(C, F) + dist(E, F), S + S, 'chu vi CEF = nửa chu vi ABCD (hệ quả)')
  hinh('HH00093005_lg', [A, B, C, D, E, F, K], [
    seg(A, B), seg(B, C), seg(K, C), seg(A, D), seg(A, K), seg(A, E), seg(A, F), seg(E, F),
    tick(D, K, 1), tick(B, F, 1),
    angleMark(A, K, E, 54, 1), angleMark(A, E, F, 40, 1),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(K),
    label(A, 'A', -4, -14), label(B, 'B', 6, -14), label(F, 'F', 20, 8), label(C, 'C', 18, 26),
    label(E, 'E', 0, 34), label(D, 'D', 0, 34), label(K, 'K', -4, 34),
  ], OPT)
}

// ── HH00093006_lg — h.129: hình vuông ABCD, M ∈ AB; CN phân giác ∠MCD (N ∈ AD); BM = m, DN = n; K ∈ tia đối BA, BK = n.
//    Nét: cạnh, MC, NC, KB(K), KC.  Nét đứt cong: MB (m), BK (n), DN (n).  Góc đánh số 1 (DCN), 2 (NCM), 3 (MCB), 4 (BCK).
{
  const S = 240, m = 0.75 * S
  const A = P(0, 0), B = P(S, 0), C = P(S, S), D = P(0, S)
  const M = P(S - m, 0)
  const NN = inter(C, bisector(C, D, M, 100), A, D)
  const n = dist(D, NN)
  gt(goc(C, D, NN), goc(C, NN, M), 'CN phân giác MCD')
  gt(n, Math.sqrt(S * S + m * m) - m, 'DN = CM − BM (hệ quả: CM = m + n)')
  const K = P(S + n, 0)
  gt(dist(B, K), n, 'BK = DN'); gt(dist(C, M), m + n, 'CM = m + n (hệ quả)')
  const cong = (a, b, ox, oy) => { const c = mid(a, b); return `<path d="M ${a.x} ${a.y} Q ${c.x + ox * 2} ${c.y + oy * 2} ${b.x} ${b.y}" fill="none" stroke-dasharray="6 5"/>` }
  hinh('HH00093006_lg', [A, B, C, D, K, NN, M], [
    seg(A, B), seg(B, K), seg(B, C), seg(C, D), seg(D, A), seg(M, C), seg(NN, C), seg(K, C),
    cong(M, B, 0, 9), cong(B, K, 0, 9), cong(NN, D, -9, 0),
    angleMark(C, D, NN, 56, 1), angleMark(C, NN, M, 44, 1),
    angleText(C, D, NN, '1', 86, 20), angleText(C, NN, M, '2', 86, 20), angleText(C, M, B, '3', 86, 20), angleText(C, B, K, '4', 86, 20),
    bien(mid(M, B), 'm', 0, -10), bien(mid(B, K), 'n', 0, -10), bien(mid(NN, D), 'n', -26, 8),
    dot(A), dot(B), dot(C), dot(D), dot(M), dot(NN), dot(K),
    label(A, 'A', -4, -14), label(M, 'M', 0, -14), label(B, 'B', 0, -14), label(K, 'K', 12, -14),
    label(NN, 'N', -20, 6), label(D, 'D', -4, 32), label(C, 'C', 4, 32),
  ], OPT)
}

// ── HH00093007_lg — h.130: hình vuông ABCD, hình vuông A'B'C'D' bên trong cùng chiều; E, F, G, H trung điểm AA', BB', CC', DD';
//    I = trung điểm BC', K = trung điểm CD'.  Nét: 2 hình vuông, AA', BB', CC', DD', BC', CD', EFGH, FI, IG, GK, KH.
//    Cung bằng nhau ∠FIG = ∠GKH (△FIG = △GKH).
{
  const S = 330
  const A = P(0, 0), B = P(S, 0), C = P(S, S), D = P(0, S)
  const A1 = P(105, 175), L = 95, th = 40
  const B1 = ray(A1, th, L), C1 = ray(B1, th - 90, L), D1 = ray(C1, th - 180, L)
  gt(dist(C1, D1), L, 'A\'B\'C\'D\' đều cạnh'); gt(goc(A1, B1, D1), 90, 'góc vuông A′')
  const E = mid(A, A1), F = mid(B, B1), G = mid(C, C1), H = mid(D, D1)
  const I = mid(B, C1), K = mid(C, D1)
  gt(dist(E, F), dist(F, G), 'EFGH: EF = FG'); gt(goc(E, F, G), 45, 'EFGH: EG tạo 45° (hệ quả)')
  gt(goc(G, F, H), 90, 'GF ⊥ GH (hệ quả)'); gt(dist(G, F), dist(G, H), 'GF = GH (hệ quả)')
  gt(dist(F, I), dist(G, K), 'FI = GK'); gt(dist(I, G), dist(K, H), 'IG = KH'); gt(goc(I, F, G), goc(K, G, H), '∠FIG = ∠GKH')
  hinh('HH00093007_lg', [A, B, C, D, A1, B1, C1, D1, E, F, G, H, I, K], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    seg(A1, B1), seg(B1, C1), seg(C1, D1), seg(D1, A1),
    seg(A, A1), seg(B, B1), seg(C, C1), seg(D, D1), seg(B, C1), seg(C, D1),
    seg(E, F), seg(F, G), seg(G, H), seg(H, E), seg(F, I), seg(I, G), seg(G, K), seg(K, H),
    angleMark(I, F, G, 22, 1), angleMark(K, G, H, 22, 1),
    dot(A), dot(B), dot(C), dot(D), dot(A1), dot(B1), dot(C1), dot(D1),
    dot(E), dot(F), dot(G), dot(H), dot(I), dot(K),
    label(A, 'A', -14, -8), label(B, 'B', 14, -8), label(C, 'C', 14, 24), label(D, 'D', -16, 24),
    label(A1, 'A′', -16, 12), label(B1, 'B′', -14, 26),
    label(C1, 'C′', -18, 2), label(D1, 'D′', 2, -14),
    label(E, 'E', -14, -4), label(F, 'F', -2, -12), label(G, 'G', 16, 6), label(H, 'H', -4, 28),
    label(I, 'I', 14, 6), label(K, 'K', 4, 28),
  ], OPT)
}

// ── HH00093008_lg — h.131: hình vuông ABCD, E ∈ AD, F ∈ AB, AE = AF; H = chân đường vuông góc hạ từ A xuống BE;
//    K = AH ∩ CD (BFKC hình chữ nhật).  Nét: cạnh, BE, AK, FK, FH, HC.  Gạch: AE = AF.  Vuông: D.
{
  const S = 300, a = 0.44 * S
  const A = P(0, 0), B = P(S, 0), C = P(S, S), D = P(0, S)
  const E = P(0, a), F = P(a, 0)
  const H = foot(A, B, E)
  const K = inter(A, H, D, C)
  gt(dist(A, E), dist(A, F), 'AE = AF'); gt(goc(H, A, B), 90, 'AH ⊥ BE')
  gt(K.x, F.x, 'FK ∥ BC (BFKC chữ nhật, hệ quả)'); ok(thang(A, H, K), 'A, H, K thẳng hàng'); ok(thang(B, H, E), 'B, H, E thẳng hàng')
  hinh('HH00093008_lg', [A, B, C, D, E, F, H, K], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(B, E), seg(A, K), seg(F, K), seg(F, H), seg(H, C),
    tick(A, F, 1), tick(A, E, 1),
    rightAngle(D, A, C, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(H), dot(K),
    label(A, 'A', -4, -14), label(F, 'F', 0, -14), label(B, 'B', 6, -14), label(E, 'E', -18, 8), label(H, 'H', -8, 28),
    label(D, 'D', -16, 26), label(K, 'K', 0, 34), label(C, 'C', 18, 26),
  ], OPT)
}

await xuatTat(RA)
