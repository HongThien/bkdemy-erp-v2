// Vẽ lại hình — gói HH00061-1 (Hình bình hành, Hình học 8).
//   node scripts/anh/ve_lai/HH00061-1.mjs [<thu_muc_ra>]
// Cả ba hình: ABCD hình bình hành, A trên-trái, B trên-phải, C dưới-phải, D dưới-trái (D lệch trái so với A), AB // DC, D→C = A→B.
import { P, seg, segDash, tick, rightAngle, dot, label, hinh, xuatTat,
  add, vec, mid, foot, inter, goc, dist, lerp } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00061-1/moi'
const ok = (c, m) => console.assert(c, m)
const gan = (a, b, e = 0.05) => Math.abs(a - b) < e

/** Hình bình hành ABCD: AB nằm ngang dài ab, D cách A: dx ngang (âm = lệch trái), dy xuống */
function bbh(ab, dx, dy) {
  const A = P(0, 0), B = P(ab, 0), D = P(dx, dy)
  const C = add(D, vec(A, B))                              // D→C = A→B
  ok(gan(dist(A, B), dist(D, C)) && gan(dist(A, D), dist(B, C)), 'cạnh đối bằng nhau')
  ok(gan(C.y, D.y), 'AB // DC')
  return { A, B, C, D }
}

// ── HHC000562 — AH ⊥ BD (H ∈ BD), CK ⊥ BD (K ∈ BD); O = AC ∩ BD. Nét: AB, BC, CD, DA, BD (qua H, O, K), AH, CK, AC nét đứt. Góc vuông tại H, K.
{
  const { A, B, C, D } = bbh(320, -105, 210)
  const H = foot(A, B, D), K = foot(C, B, D), O = inter(A, C, B, D)
  ok(gan(goc(H, A, B), 90) && gan(goc(K, C, B), 90), 'AH ⊥ BD, CK ⊥ BD')
  const tH = dist(D, H) / dist(D, B), tK = dist(D, K) / dist(D, B), tO = dist(D, O) / dist(D, B)
  ok(tH > 0 && tH < tO && tO < tK && tK < 1, 'thứ tự D, H, O, K, B trên BD (như ảnh cũ)')
  hinh('HHC000562', [A, B, C, D, H, K, O], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(D, B), seg(A, H), seg(C, K), segDash(A, C),
    rightAngle(H, A, B, 11), rightAngle(K, C, D, 11),
    dot(A), dot(B), dot(C), dot(D), dot(H), dot(K), dot(O),
    label(A, 'A', -16, -8), label(B, 'B', 14, -10), label(C, 'C', 20, 22), label(D, 'D', -16, 24),
    label(H, 'H', 8, 28), label(K, 'K', -4, -16), label(O, 'O', -10, 32),
  ])
}

// ── HHC000573 — M, N là trung điểm AB, CD; mỗi nửa đánh 2 gạch (AM = MB = DN = NC). Nét: AB, BC, CD, DA, AC, BD, AN, MN, MC.
//    Ba đường AC, BD, MN đồng quy (tâm hình bình hành) — hệ quả của dựng, không đánh dấu giao điểm (ảnh cũ không có).
{
  const { A, B, C, D } = bbh(340, -80, 195)
  const M = mid(A, B), N = mid(D, C)
  const O = inter(A, C, B, D)
  ok(gan(dist(O, inter(M, N, A, C)), 0, 0.01), 'AC, BD, MN đồng quy')
  hinh('HHC000573', [A, B, C, D, M, N], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(A, N), seg(M, N), seg(M, C),
    tick(A, M, 2), tick(M, B, 2), tick(D, N, 2), tick(N, C, 2),
    dot(A), dot(B), dot(C), dot(D), dot(M), dot(N),
    label(A, 'A', -14, -10), label(M, 'M', 0, -14), label(B, 'B', 14, -10), label(C, 'C', 20, 22), label(N, 'N', 0, 28), label(D, 'D', -16, 24),
  ])
}

// ── HHC000609 — ảnh cũ đặt tên H, K nhưng ĐỀ ghi E, F ⇒ vẽ theo đề: E ∈ AB, F ∈ CD là trung điểm. Nét: AB, BC, CD, DA, DE, BF. Mỗi nửa 1 gạch.
{
  const { A, B, C, D } = bbh(370, -56, 225)
  const E = mid(A, B), F = mid(D, C)
  ok(gan(dist(A, E), dist(E, B)) && gan(dist(D, F), dist(F, C)), 'E, F là trung điểm')
  hinh('HHC000609', [A, B, C, D, E, F], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(D, E), seg(B, F),
    tick(A, E, 1), tick(E, B, 1), tick(D, F, 1), tick(F, C, 1),
    dot(E), dot(F),
    label(A, 'A', -14, -10), label(E, 'E', 0, -14), label(B, 'B', 14, -10), label(C, 'C', 20, 22), label(F, 'F', 0, 28), label(D, 'D', -16, 24),
  ])
}

await xuatTat(RA)
