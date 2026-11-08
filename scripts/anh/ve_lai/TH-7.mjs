// Vẽ hình cho gói TH-7 (câu hình học Toán 7 trong đề thi / đề cương, kho chưa có hình).
//   node scripts/anh/ve_lai/TH-7.mjs [<thu_muc_ra>]
// Vẽ: HHC002929 · HHC002931 · HHC002938 · HHC002942 · HHC002943 · HHC002945
// Không vẽ: HHC002933 · HHC002934 · HHC002935 · HHC002936 (xem báo cáo)
import { P, seg, tick, angleMark, rightAngle, ray, dot, label, num, bien, angleText, sideText, labelOut, trongTam,
  inter, bisector, foot, lerp, rot, dist, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/TH-7/moi'

// HHC002929 — △ABC có A = 20°, B = 40° (đề hỏi loại tam giác; không ghi góc C)
{
  const A = P(0, 0), B = P(340, 0)
  const C = inter(A, ray(A, 20, 100), B, ray(B, 140, 100))
  console.assert(Math.abs(goc(A, B, C) - 20) < 0.01 && Math.abs(goc(B, A, C) - 40) < 0.01)
  const g = trongTam([A, B, C])
  hinh('HHC002929', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), angleMark(A, B, C, 62), angleMark(B, A, C, 52),
    dot(A), dot(B), dot(C),
    angleText(A, B, C, '20°', 140), angleText(B, A, C, '40°', 104),
    labelOut(A, 'A', g, 26), labelOut(B, 'B', g, 26), labelOut(C, 'C', g, 26)])
}

// HHC002931 — △ABC = △DEF; AB = 5 cm, DF = 3 cm, EF = 4 cm (A↔D, B↔E, C↔F). Không ghi DE (đáp án suy ra).
{
  const s = 32 // px / cm
  const C = P(0, 0), B = P(4 * s, 0), A = P(0, -3 * s)             // AC = 3 (= DF), BC = 4 (= EF), AB = 5
  const dx = 4 * s + 80
  const F = P(dx + 4 * s, 0), E = P(dx, 0), D = P(dx + 4 * s, -3 * s) // DF = 3, EF = 4, DE = 5 (đối xứng gương)
  console.assert(Math.abs(dist(A, B) - 5 * s) < 0.01 && Math.abs(dist(D, E) - 5 * s) < 0.01)
  const g1 = trongTam([A, B, C]), g2 = trongTam([D, E, F])
  hinh('HHC002931', [A, B, C, D, E, F, P(F.x + 72, 0)], [
    seg(A, B), seg(B, C), seg(C, A), seg(D, E), seg(E, F), seg(F, D),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
    labelOut(A, 'A', g1, 24), labelOut(B, 'B', g1, 24), labelOut(C, 'C', g1, 24),
    labelOut(D, 'D', g2, 24), labelOut(E, 'E', g2, 24), labelOut(F, 'F', g2, 24),
    sideText(A, B, '5 cm', C, 30), sideText(D, F, '3 cm', E, 30), sideText(E, F, '4 cm', D, 22)])
}

// HHC002938 — △ABC vuông tại B (AB < AC), AD phân giác góc A (D ∈ BC), DM ⊥ AC (M ∈ AC)
{
  const B = P(0, 0), A = P(0, -230), C = P(320, 0)
  const D = inter(A, bisector(A, B, C, 100), B, C)
  const M = foot(D, A, C)
  console.assert(Math.abs(goc(A, B, D) - goc(A, M, D)) < 0.01 && Math.abs(goc(M, D, A) - 90) < 0.01)
  const g = trongTam([A, B, C])
  hinh('HHC002938', [A, B, C, D, M], [seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(D, M),
    rightAngle(B, A, C, 14), rightAngle(M, D, A, 14),
    angleMark(A, B, D, 40), angleMark(A, D, M, 52),
    dot(A), dot(B), dot(C), dot(D), dot(M),
    labelOut(A, 'A', g, 24), labelOut(B, 'B', g, 24), labelOut(C, 'C', g, 24),
    label(D, 'D', -2, 30), label(M, 'M', 20, -4)])
}

// HHC002942 — △ABC cân tại A (AB = AC)
{
  const B = P(0, 0), C = P(240, 0), A = P(120, -280)
  const g = trongTam([A, B, C])
  hinh('HHC002942', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), tick(A, B, 1), tick(A, C, 1),
    dot(A), dot(B), dot(C),
    labelOut(A, 'A', g, 24), labelOut(B, 'B', g, 24), labelOut(C, 'C', g, 24)])
}

// HHC002943 — △ABC và △IKH: AB = IH, BC = HK, Ĥ = B̂ (c.g.c)
{
  const B = P(0, 0), C = P(180, 0), A = rot(P(130, 0), B, 70)
  // △IKH = bản sao △ABC (I↔A, H↔B, K↔C) quay 20° và tịnh tiến sang phải
  const sh = (p) => { const q = rot(p, B, 20); return P(q.x + 250, q.y + 20) }
  const H = sh(B), K = sh(C), I = sh(A)
  console.assert(Math.abs(dist(A, B) - dist(I, H)) < 0.01 && Math.abs(goc(B, A, C) - goc(H, I, K)) < 0.01)
  const g1 = trongTam([A, B, C]), g2 = trongTam([I, K, H])
  hinh('HHC002943', [A, B, C, I, K, H], [
    seg(A, B), seg(B, C), seg(C, A), seg(I, H), seg(H, K), seg(K, I),
    tick(A, B, 1), tick(I, H, 1), tick(B, C, 2), tick(H, K, 2),
    angleMark(B, A, C, 34), angleMark(H, I, K, 34),
    dot(A), dot(B), dot(C), dot(I), dot(K), dot(H),
    labelOut(A, 'A', g1, 24), labelOut(B, 'B', g1, 24), labelOut(C, 'C', g1, 24),
    labelOut(I, 'I', g2, 24), labelOut(K, 'K', g2, 24), labelOut(H, 'H', g2, 24)])
}

// HHC002945 — △ABC nhọn (AB < AC), AD phân giác (D ∈ BC), E ∈ AC với AE = AB, F = ED ∩ AB
{
  const B = P(0, 0), C = P(300, 0), A = P(110, -230)
  const AB = dist(A, B), AC = dist(A, C)
  console.assert(AB < AC && goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90)
  const D = inter(A, bisector(A, B, C, 100), B, C)
  const E = lerp(A, C, AB / AC)
  const F = inter(E, D, A, B)
  console.assert(Math.abs(dist(A, E) - AB) < 0.01 && Math.abs(goc(A, B, D) - goc(A, E, D)) < 5)
  console.error('F =', F, ' B giữa A,F:', dist(A, F) > AB)
  const g = trongTam([A, B, C])
  hinh('HHC002945', [A, B, C, D, E, F], [seg(A, F), seg(A, C), seg(B, C), seg(A, D), seg(F, E), seg(F, C),
    tick(A, B, 1), tick(A, E, 1),
    angleMark(A, B, D, 40), angleMark(A, D, E, 52),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
    labelOut(A, 'A', g, 24), labelOut(B, 'B', g, 24), labelOut(C, 'C', g, 24),
    label(D, 'D', -24, -12), label(E, 'E', 22, -6), labelOut(F, 'F', g, 24)])
}

await xuatTat(RA)
