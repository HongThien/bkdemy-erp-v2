// Vẽ lại hình — gói HH00140-5 (Ôn thi giữa kì I, Hình học 9; có hình đề và hình lời giải _lg).
//   node scripts/anh/ve_lai/HH00140-5.mjs [<thu_muc_ra>]
import { P, seg, segDash, tick, angleMark, rightAngle, circle, ray, rot, mid, foot, inter, lerp, dot, label, num, bien, angleText, sideText, goc, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00140-5/moi'
const ok = (v, e, ten, tol = 0.5) => console.assert(Math.abs(v - e) < tol, `${ten}: ${v} ≠ ${e}`)

// HHC003124 — khúc sông rộng 350 m, thuyền bị đẩy lệch 45° (ảnh cũ không đặt tên điểm, đề cũng không nêu tên)
{
  const k = 250 // px cho bề rộng sông
  const A = P(0, 0), B = P(0, -k), C = ray(A, 90 - 45, k / Math.cos(Math.PI / 4)) // góc BAC = 45°
  ok(goc(A, B, C), 45, '45°')
  const bl = P(-60, 0), br = P(C.x + 60, 0), tl = P(-60, -k), tr = P(C.x + 60, -k)
  hinh('HHC003124', [bl, br, tl, tr], [seg(bl, br), seg(tl, tr), seg(A, B), seg(A, C),
    num(P(-46, -k / 2), '350 m', 0, 8),
    num(ray(A, 90 - 22.5, 70), '45°', 0, 8)], { pad: 36, padDuoi: 40 })
}

// HHC003125_lg — △ABC vuông tại A, AH ⊥ BC, AB = 6, AH = 5; D ∈ CH, ∠DAC = 30°
{
  const k = 38
  const H = P(0, 0), A = P(0, -5 * k)
  const B = P(-Math.sqrt(11) * k, 0)                       // BH² = 36 − 25
  const C = P((25 / Math.sqrt(11)) * k, 0)                 // HC = AH·tan(HAC), tan B = 5/√11
  const hb = Math.atan(5 / Math.sqrt(11)) * 180 / Math.PI  // B ≈ 56,44°
  const D = P(5 * Math.tan((hb - 30) * Math.PI / 180) * k, 0) // HAD = B − 30°
  ok(dist(A, B), 6 * k, 'AB'); ok(goc(A, B, C), 90, 'A vuông'); ok(goc(A, D, C), 30, '30°')
  hinh('HHC003125_lg', [A, B, C, D, H], [
    seg(B, C), seg(A, B), seg(A, C), seg(A, H), seg(A, D),
    angleMark(A, D, C, 80), rightAngle(A, B, C, 13), rightAngle(H, A, C, 14),
    dot(A), dot(B), dot(C), dot(D), dot(H),
    label(A, 'A', 0, -14), label(B, 'B', -4, 34), label(H, 'H', -6, 34), label(D, 'D', 4, 34), label(C, 'C', 6, 34),
    sideText(A, B, '6 cm', C, 34), sideText(A, H, '5 cm', C, 30),
    angleText(A, D, C, '30°', 130)])
}

// HHC003126 — ca nô dù bay: AC = 160 m, ∠ACB = 25°, AB ⊥ BC (sơ đồ: người chơi = A, ca nô = C, mặt biển = B)
{
  const k = 2.0
  const C = P(0, 0), A = ray(C, 180 - 25, 160 * k), B = P(A.x, 0)
  ok(goc(C, A, B), 25, '25°'); ok(goc(B, A, C), 90, 'B vuông')
  hinh('HHC003126', [A, B, C], [
    seg(A, C), segDash(A, B), segDash(B, C), rightAngle(B, A, C, 14),
    dot(A), dot(B), dot(C),
    label(A, 'A', -4, -16), label(B, 'B', -4, 34), label(C, 'C', 8, 34),
    sideText(A, C, '160 m', B, 30), num(mid(A, B), '?', -20, 8),
    angleText(C, A, B, '25°', 108)])
}

// HHC003127_lg — △ABC nhọn (AB > AC), BD ⊥ AC, CE ⊥ AB, H = BD ∩ CE, O trung điểm BC, ∠DBC = 30°, CM = R
{
  const s = 0.78, BC = 300 * s, R = BC / 2
  const B = P(0, 0), C = P(BC, 0), O = mid(B, C)
  const D = ray(B, 30, BC * Math.cos(Math.PI / 6))        // D ∈ (O): ∠BDC = 90°, ∠DBC = 30°
  const A = inter(B, ray(B, 50, 100), C, D)               // ∠B = 50°, ∠C = 60° ⇒ AB > AC, nhọn
  const E = foot(C, A, B), H = inter(B, D, C, E), M = P(C.x + R, 0)
  ok(goc(B, C, D), 30, '30°'); ok(goc(D, B, A), 90, 'D vuông'); ok(goc(E, A, C), 90, 'E vuông')
  ok(dist(C, M), R, 'CM = R'); ok(dist(O, D), R, 'OD = R'); ok(dist(O, E), R, 'OE = R')
  console.assert(dist(A, B) > dist(A, C), 'AB > AC')
  hinh('HHC003127_lg', [A, B, C, M, P(O.x, R), P(O.x, -R)], [
    circle(O, R), seg(B, M), seg(A, B), seg(A, C), seg(B, D), seg(C, E), seg(O, D), seg(D, M),
    angleMark(B, C, D, 46),
    tick(O, C, 1), tick(C, M, 1),
    rightAngle(E, A, C, 12), rightAngle(D, A, B, 12),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(H), dot(O), dot(M),
    label(A, 'A', 4, -14), label(E, 'E', -20, -6), label(D, 'D', 22, -4), label(H, 'H', -4, 34),
    label(B, 'B', -14, 34), label(O, 'O', -6, 34), label(C, 'C', 16, 34), label(M, 'M', 6, 34),
    angleText(B, C, D, '30°', 84)], { pad: 40, padDuoi: 46 })
}

// HHC003128 — khúc sông: con đò từ A sang B, bị đẩy xiên 32°; H = chân đường vuông góc hạ từ A (như ảnh cũ)
{
  const k = 1.0, W = 260 * k
  const A = P(0, 0), H = P(0, -W), B = ray(A, 90 - 32, W / Math.cos(32 * Math.PI / 180))
  ok(goc(A, H, B), 32, '32°')
  const bl = P(-90, 0), br = P(B.x + 90, 0), tl = P(-90, -W), tr = P(B.x + 90, -W)
  hinh('HHC003128', [bl, br, tl, tr], [
    seg(bl, br), seg(tl, tr), seg(A, H), seg(A, B), rightAngle(H, A, B, 14), angleMark(A, H, B, 44),
    dot(A), dot(B), dot(H),
    label(A, 'A', -6, 34), label(H, 'H', -6, -14), label(B, 'B', 4, -14),
    num(ray(A, 90 - 16, 76), '32°', 0, 8)], { pad: 36, padDuoi: 52 })
}

// HHC003129_lg — △ABC nhọn (AB < AC), AD ⊥ BC, E, F = hình chiếu của D lên AB, AC; K = BC ∩ EF; H trực tâm; I = BH ∩ EF
{
  const s = 0.85
  const D = P(0, 0), A = P(0, -330 * s), B = P(-120 * s, 0), C = P(300 * s, 0)
  const E = foot(D, A, B), F = foot(D, A, C), K = inter(E, F, B, C)
  const Hh = inter(A, D, B, P(B.x + (A.y - C.y), B.y - (A.x - C.x)))
  const I = inter(B, Hh, E, F)
  ok(goc(E, A, D), 90, 'E vuông'); ok(goc(F, A, D), 90, 'F vuông'); ok(goc(Hh, B, P(Hh.x + (C.x - A.x), Hh.y + (C.y - A.y))), 90, 'BH ⊥ AC', 0.6)
  console.assert(dist(A, B) < dist(A, C), 'AB < AC')
  hinh('HHC003129_lg', [A, K, C], [
    seg(K, C), segDash(K, E), seg(A, B), seg(A, C), seg(A, D), seg(D, E), seg(D, F), seg(E, F),
    seg(B, Hh), seg(I, D),
    rightAngle(E, A, D, 12), rightAngle(F, A, D, 12), rightAngle(D, A, C, 14),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(K), dot(Hh), dot(I),
    label(A, 'A', 0, -14), label(K, 'K', -6, 34), label(B, 'B', -8, 34), label(D, 'D', 4, 34), label(C, 'C', 8, 34),
    label(E, 'E', -22, 0), label(F, 'F', 24, -2), label(Hh, 'H', 22, -4), label(I, 'I', -6, -16)], { pad: 38, padDuoi: 48 })
}

// HHC003130_lg — △ABC vuông tại A, AB = 5, AH = 3 (AB > AC); D trung điểm BC; DE ⊥ AB
{
  const k = 62
  const H = P(0, 0), A = P(0, -3 * k), B = P(-4 * k, 0), C = P((9 / 4) * k, 0) // BH = 4, HC = AH²/BH = 9/4
  const D = mid(B, C), E = foot(D, A, B)
  ok(dist(A, B), 5 * k, 'AB'); ok(goc(A, B, C), 90, 'A vuông'); ok(goc(E, A, D), 90, 'E vuông')
  console.assert(dist(A, B) > dist(A, C), 'AB > AC')
  hinh('HHC003130_lg', [A, B, C], [
    seg(B, C), seg(A, B), seg(A, C), seg(A, H), segDash(A, D), seg(D, E),
    tick(B, D, 1), tick(D, C, 1),
    rightAngle(A, B, C, 13), rightAngle(H, A, C, 14), rightAngle(E, A, D, 12),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(H),
    label(A, 'A', 6, -14), label(B, 'B', -8, 34), label(C, 'C', 8, 34), label(D, 'D', -6, 34), label(H, 'H', 10, 34),
    label(E, 'E', -22, -4)], { pad: 38, padDuoi: 48 })
}

// HHC003131_de — cây tre gãy gập: thân đứng OM vuông góc mặt đất, phần ngọn MN = 8 m chạm đất, góc ở ngọn 30°
{
  const k = 30
  const N = P(0, 0), M = ray(N, 30, 8 * k)
  const O = P(M.x, 0)
  ok(goc(N, M, O), 30, '30°'); ok(dist(N, M), 8 * k, 'MN')
  const g1 = P(N.x - 50, 0), g2 = P(O.x + 60, 0)
  hinh('HHC003131_de', [g1, g2, M], [
    seg(g1, g2), seg(O, M), seg(N, M), rightAngle(O, N, M, 14)], { pad: 36, padDuoi: 44 })
}

await xuatTat(RA)
