// Vẽ lại hình — gói HH08000000-4 (Chưa phân dạng — Hình học 8, câu lấy từ các đề giữa kì).
//   node scripts/anh/ve_lai/HH08000000-4.mjs [<thu_muc_ra>]
import { P, seg, segDash, poly, rightAngle, tick, angleMark, dot, label, num, hinh, xuatTat,
  mid, lerp, foot, inter, add, vec, rot, ray, goc, dist, doiXung, angleText, sideText } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH08000000-4/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.5, `${m}: ${a} vs ${b}`)

// ── HHC002463 — 4 hình con: Hình 1 (tứ giác lồi), Hình 2 (đa giác 5 cạnh lồi như ảnh cũ), Hình 3 (tứ giác các cạnh cắt nhau, KHÔNG lồi), Hình 4 (hình chữ nhật).
{
  const s = 0.82   // 2 hàng × 2 hình; (x0, y0) = góc trên-trái ô đặt hình
  const mk = (pts, x0, y0) => { const mx = Math.min(...pts.map((p) => p[0])), my = Math.min(...pts.map((p) => p[1])); return pts.map(([x, y]) => P((x - mx) * s + x0, (y - my) * s + y0)) }
  const h1 = mk([[24, 58], [156, 12], [201, 145], [24, 145]], 0, 0)
  const h2 = mk([[288, 89], [338, 10], [434, 15], [463, 100], [395, 144]], 200, 0)
  const h3 = mk([[595, 13], [741, 11], [566, 134], [645, 142]], 0, 190)   // TL–TR–BL–B: cạnh TR–BL cắt cạnh B–TL
  const h4 = mk([[811, 12], [1031, 12], [1031, 144], [811, 144]], 200, 190)
  const cap = (xs) => P(xs.reduce((a, p) => a + p.x, 0) / xs.length, Math.max(...xs.map((p) => p.y)) + 36)
  const caps = [[h1, 'Hình 1'], [h2, 'Hình 2'], [h3, 'Hình 3'], [h4, 'Hình 4']].map(([h, t]) => [cap(h), t])
  const X = inter(h3[1], h3[2], h3[3], h3[0])   // hình 3: hai cạnh cắt nhau thật
  ok(X && X.x > Math.min(h3[1].x, h3[2].x) && X.x < Math.max(h3[1].x, h3[2].x), 'Hình 3 các cạnh cắt nhau')
  hinh('HHC002463', [...h1, ...h2, ...h3, ...h4, ...caps.map(([p]) => p)], [
    poly(h1), poly(h2), poly(h3), poly(h4),
    ...[...h1, ...h2, ...h3, ...h4].map(dot),
    ...caps.map(([p, t]) => num(p, t, 0, 8)),
  ], { pad: 24, padDuoi: 24 })
}

// ── HHC002464 — Hình 5: hai đường chéo AC, BD cắt nhau tại O; OA = OC (hai gạch), OB = OD (một gạch), AC ⊥ BD (ô vuông tại O).
{
  const O = P(0, 0)
  const A = P(-150, 0), C = P(150, 0), B = P(0, -85), D = P(0, 85)
  gt(dist(O, A), dist(O, C), 'OA = OC'); gt(dist(O, B), dist(O, D), 'OB = OD'); gt(goc(O, A, B), 90, 'AC ⊥ BD')
  hinh('HHC002464', [A, B, C, D, P(-120, 120)], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    tick(A, O, 2, 0.5), tick(O, C, 2, 0.5), tick(B, O, 1, 0.5), tick(O, D, 1, 0.5),
    rightAngle(O, C, B, 14),
    dot(A), dot(B), dot(C), dot(D), dot(O),
    label(A, 'A', -20, 8), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(D, 'D', 0, 34),
    num(P(-100, 112), 'Hình 5', 0, 0),
  ], { pad: 40, padDuoi: 44 })
}

// ── HHC002468_lg — hai hình con như ảnh cũ: hình thang cân · hình bình hành (cùng góc A = 60°, AB ∥ CD, AD = BC).
{
  const AB = 140, AD = 96
  const lab = (A, B, C, D) => [label(A, 'A', -18, -8), label(B, 'B', 18, -8), label(C, 'C', 18, 30), label(D, 'D', -18, 30)]
  const goc60 = (A, B, D) => [angleMark(A, B, D, 26), angleText(A, B, D, '60°', 58)]
  // hình thang cân
  const A1 = P(0, 0), B1 = P(AB, 0), D1 = ray(A1, -60, AD), C1 = P(B1.x - (D1.x - A1.x), D1.y)
  gt(goc(A1, B1, D1), 60, 'A = 60 (thang cân)'); gt(dist(A1, D1), dist(B1, C1), 'AD = BC (thang cân)'); gt(D1.y, C1.y, 'CD ∥ AB')
  gt(goc(A1, B1, D1), goc(B1, A1, C1), 'thang cân: A = B')
  // hình bình hành
  const ox2 = 215
  const A2 = P(ox2, 0), B2 = P(ox2 + AB, 0), D2 = ray(A2, -60, AD), C2 = add(B2, vec(A2, D2))
  gt(goc(A2, B2, D2), 60, 'A = 60 (bình hành)'); gt(dist(A2, D2), dist(B2, C2), 'AD = BC (bình hành)')
  gt(Math.abs(C2.x - D2.x), AB, 'DC = AB (bình hành)'); gt(C2.y, D2.y, 'CD ∥ AB')
  hinh('HHC002468_lg', [A1, B1, C1, D1, A2, B2, C2, D2, P(0, 150)], [
    seg(A1, B1), seg(B1, C1), seg(C1, D1), seg(D1, A1),
    seg(A2, B2), seg(B2, C2), seg(C2, D2), seg(D2, A2),
    tick(A1, D1, 1, 0.5), tick(B1, C1, 1, 0.5), tick(A2, D2, 1, 0.5), tick(B2, C2, 1, 0.5),
    ...goc60(A1, B1, D1), ...goc60(A2, B2, D2),
    ...[A1, B1, C1, D1, A2, B2, C2, D2].map(dot),
    ...lab(A1, B1, C1, D1), ...lab(A2, B2, C2, D2),
    num(P(mid(A1, B1).x, 150), 'Hình thang cân'), num(P(mid(A2, B2).x + 26, 150), 'Hình bình hành'),
  ], { pad: 40, padDuoi: 24 })
}

// ── HHC002470_lg — hình bình hành ABCD, AB = 7, BC = 5, AC = 10 (cm); đường chéo cắt nhau tại O.
{
  const k = 38
  const AB = 7 * k, BC = 5 * k, AC = 10 * k
  const A = P(0, 0), B = P(AB, 0)
  const cx = (AC * AC - BC * BC + AB * AB) / (2 * AB), cy = Math.sqrt(AC * AC - cx * cx)
  const C = P(cx, -cy), D = add(C, vec(B, A))
  const O = inter(A, C, B, D)
  gt(dist(A, B) / k, 7, 'AB = 7'); gt(dist(B, C) / k, 5, 'BC = 5'); gt(dist(A, C) / k, 10, 'AC = 10')
  gt(dist(A, O), dist(O, C), 'O trung điểm AC'); gt(dist(B, O), dist(O, D), 'O trung điểm BD')
  const tAC = (p, t, d) => { const q = lerp(A, C, 0.28); const u = P(1, 0); return num(P(q.x + 4, q.y + 38), t, 0, 0) }
  hinh('HHC002470_lg', [A, B, C, D, O], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    dot(A), dot(B), dot(C), dot(D), dot(O),
    label(A, 'A', -16, 22), label(B, 'B', 14, 28), label(C, 'C', 20, -6), label(D, 'D', -16, -10), label(O, 'O', 4, -14),
    sideText(A, B, '7 cm', D, 24), sideText(B, C, '5 cm', A, 30), tAC(null, '10 cm'),
  ], { pad: 44, padDuoi: 60 })
}

// ── HHC002471_lg — tam giác ABC vuông tại A, AH ⊥ BC, HD ⊥ AB, HE ⊥ AC, O trung điểm HC, G đối xứng A qua O.
//    Nét: AB, BC, AC, AH, DH, HE, A–O–G. Gạch: HO = OC (một), AO = OG (hai). Vuông: A, D, E, H.
{
  const BH = 130, AH = 160
  const H = P(0, 0), B = P(-BH, 0), C = P(AH * AH / BH, 0), A = P(0, -AH)
  gt(goc(A, B, C), 90, 'A vuông')
  const D = foot(H, A, B), E = foot(H, A, C), O = mid(H, C), G = doiXung(A, O)
  gt(goc(D, A, H), 90, 'HD ⊥ AB'); gt(goc(E, A, H), 90, 'HE ⊥ AC')
  gt(dist(H, O), dist(O, C), 'O trung điểm HC'); gt(dist(A, O), dist(O, G), 'O trung điểm AG')
  // hệ quả đề đòi chứng minh: D, H, G thẳng hàng (tự kiểm hình đúng)
  gt(goc(H, D, G), 180, 'D, H, G thẳng hàng (hệ quả)')
  hinh('HHC002471_lg', [A, B, C, G, D, E, H, O], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, H), seg(D, H), seg(H, E), seg(A, G),
    tick(H, O, 1, 0.5), tick(O, C, 1, 0.5), tick(A, O, 2, 0.5), tick(O, G, 2, 0.5),
    rightAngle(A, B, C, 14), rightAngle(D, A, H, 12), rightAngle(E, A, H, 12), rightAngle(H, A, C, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(H), dot(O), dot(G),
    label(A, 'A', 0, -14), label(B, 'B', -18, 8), label(C, 'C', 22, 8), label(D, 'D', -20, 4),
    label(E, 'E', 18, -6), label(H, 'H', -16, 26), label(O, 'O', 0, 32), label(G, 'G', 20, 14),
  ], { pad: 36, padDuoi: 42 })
}

// ── HHC002472 — tứ giác ABCD: A = 105°, B = 90° (ô vuông), D = 86°; góc C là đáp án (79°) nên KHÔNG ghi trên hình.
{
  const A = P(0, 0)
  const B = ray(A, 52.5, 200), D = ray(A, -52.5, 175)
  const C = inter(B, ray(B, -37.5, 100), D, ray(D, 41.5, 100))
  gt(goc(A, B, D), 105, 'A = 105'); gt(goc(B, A, C), 90, 'B = 90'); gt(goc(D, A, C), 86, 'D = 86'); gt(goc(C, B, D), 79, 'C = 79 (kiểm)')
  hinh('HHC002472', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    angleMark(A, B, D, 32), angleText(A, B, D, '105°', 70),
    rightAngle(B, A, C, 14),
    angleMark(D, A, C, 36), angleText(D, A, C, '86°', 72),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', -20, 8), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(D, 'D', 0, 34),
  ], { pad: 44, padDuoi: 48 })
}

// ── HHC002473_lg — ABC vuông tại A (B phía trên A, C bên phải), M ∈ BC, MD ⊥ AB, ME ⊥ AC, Ax ∥ DE cắt ME tại F, G ∈ tia MD với D trung điểm MG,
//    AM ∩ DE = O, AH ⊥ BC. Nét đứt: HD, HO, HE.
{
  const k = 1.24
  const A = P(0, 0), B = P(0, -160 * k), C = P(225 * k, 0)
  const M = lerp(B, C, 0.6)
  const D = foot(M, A, B), E = foot(M, A, C)
  const F = add(A, vec(D, E))                       // Ax ∥ DE, F ∈ ME
  const G = doiXung(M, D)
  const O = inter(A, M, D, E), H = foot(A, B, C)
  const X = lerp(A, F, 1.3)
  gt(goc(A, B, C), 90, 'A vuông'); ok(dist(A, B) < dist(A, C), 'AB < AC')
  gt(F.x, E.x, 'F ∈ ME'); gt(dist(D, M), dist(D, G), 'D trung điểm MG')
  gt(dist(A, O), dist(O, M), 'O trung điểm AM'); gt(goc(H, A, B), 90, 'AH ⊥ BC')
  gt(goc(H, D, E), 90, 'DHE = 90 (hệ quả)')
  hinh('HHC002473_lg', [A, B, C, F, G, X, M, H], [
    seg(A, B), seg(B, C), seg(A, C), seg(G, M), seg(M, F), seg(A, X), seg(A, M), seg(D, E), seg(A, H),
    segDash(D, H), segDash(O, H), segDash(E, H),
    tick(G, D, 1, 0.5), tick(D, M, 1, 0.5),
    rightAngle(A, B, C, 14), rightAngle(D, A, M, 12), rightAngle(E, A, M, 12), rightAngle(H, A, B, 12),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(G), dot(M), dot(O), dot(H),
    label(A, 'A', -20, 20), label(B, 'B', 0, -14), label(C, 'C', 22, 8), label(D, 'D', -16, -10), label(E, 'E', 8, 34),
    label(F, 'F', -16, 18), label(G, 'G', 0, -14), label(M, 'M', 14, -12), label(O, 'O', 4, 30), label(H, 'H', 6, -14),
    label(X, 'x', 14, 14),
  ], { pad: 40, padDuoi: 44 })
}

// ── HHC002479_lg — ABC vuông tại A (AB < AC), AH ⊥ BC, HM ⊥ AB, HN ⊥ AC, I trung điểm HC, K đối xứng A qua I,
//    MN ∩ AH = O, D = CO ∩ AK. Nét: AB, BC, AC, AH, MH, HN, MN, OC, A–I–K, HK, CK. Gạch: HI = IC (một), AI = IK (hai).
{
  const BH = 120, AH = 160
  const H = P(0, 0), B = P(-BH, 0), C = P(AH * AH / BH, 0), A = P(0, -AH)
  gt(goc(A, B, C), 90, 'A vuông'); ok(dist(A, B) < dist(A, C), 'AB < AC')
  const M = foot(H, A, B), N = foot(H, A, C)
  const I = mid(H, C), K = doiXung(A, I)
  const O = inter(M, N, A, H), D = inter(C, O, A, K)
  gt(goc(M, A, H), 90, 'HM ⊥ AB'); gt(goc(N, A, H), 90, 'HN ⊥ AC'); gt(dist(A, I), dist(I, K), 'I trung điểm AK')
  // hệ quả đề đòi chứng minh (tự kiểm hình đúng)
  gt(dist(A, O), dist(O, H), 'O trung điểm AH (hệ quả)'); gt(dist(A, K), 3 * dist(A, D), 'AK = 3 AD (hệ quả)')
  gt(goc(C, K, H), 90, 'KC ⊥ BC (hệ quả)')
  hinh('HHC002479_lg', [A, B, C, K, M, N, H, I, O, D], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, H), seg(M, H), seg(H, N), seg(M, N), seg(O, C), seg(A, K), seg(H, K), seg(C, K),
    tick(H, I, 1, 0.5), tick(I, C, 1, 0.5), tick(A, I, 2, 0.35), tick(I, K, 2, 0.5),
    rightAngle(A, B, C, 14), rightAngle(M, A, H, 12), rightAngle(N, A, H, 12), rightAngle(H, A, C, 14),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(N), dot(I), dot(K), dot(O), dot(D),
    label(A, 'A', 0, -14), label(B, 'B', -18, 8), label(C, 'C', 22, 0), label(M, 'M', -20, 2), label(N, 'N', 20, -10),
    label(H, 'H', -16, 26), label(I, 'I', 4, 34), label(K, 'K', 20, 14), label(O, 'O', -18, -2), label(D, 'D', 20, -6),
  ], { pad: 36, padDuoi: 42 })
}

await xuatTat(RA)
