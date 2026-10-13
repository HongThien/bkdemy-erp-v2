// Vẽ lại hình — gói HH00090-2 (Hình bình hành, Hình học 8 lớp chuyên; hình LỜI GIẢI — ảnh cũ là ảnh quét từ sách, bỏ chữ in và "Hình 102").
//   node scripts/anh/ve_lai/HH00090-2.mjs [<thu_muc_ra>]
import { P, seg, segDash, dot, label, hinh, xuatTat, angleText,
  mid, inter, lerp, add, vec, goc, dist, bisector } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00090-2/moi'
const ok = (c, m) => console.assert(c, m)
const gt = (a, b, m) => ok(Math.abs(a - b) < 0.01, m)
const OPT = { pad: 32, padDuoi: 38 }
const thang = (a, b, c, m) => gt(Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)), 0, m)

// ── HH00090011_lg — ABC bất kỳ; D, E thuộc tia đối của BA, CA, BD = CE = BC; O = BE ∩ CD; qua O song song phân giác góc A, cắt AC ở K;
//    M = B + C − A (ABMC hình bình hành). Nét đứt: phân giác góc A (đường song song), KM, BM, CM.
//    Góc đánh số: A₁, A₂ (hai nửa góc A), B₁ = CBE, C₁ = ACB, M₁ = CMK, K₁ = CKM.
{
  const s = 0.85
  const p = (x, y) => P(x * s, y * s)
  const A = p(157, 62), B = p(118, 205), C = p(329, 222)
  const ext = (from, o, len) => { const d = dist(from, o); return P(o.x + (o.x - from.x) / d * len, o.y + (o.y - from.y) / d * len) }
  const bc = dist(B, C)
  const D = ext(A, B, bc), E = ext(A, C, bc)                // D ∈ tia đối BA, E ∈ tia đối CA
  gt(dist(B, D), dist(B, C), 'BD = BC'); gt(dist(C, E), dist(C, B), 'CE = CB')
  thang(A, B, D, 'A, B, D thẳng hàng'); thang(A, C, E, 'A, C, E thẳng hàng')
  const O = inter(B, E, C, D)
  const bis = bisector(A, B, C, 120)                          // điểm trên phân giác góc A
  const dirBis = vec(A, bis)
  const K = inter(O, add(O, dirBis), A, C)
  const M = P(B.x + C.x - A.x, B.y + C.y - A.y)
  ok(K.x > A.x && dist(A, K) < dist(A, C), 'K nằm giữa A và C')
  thang(M, O, K, 'M, O, K thẳng hàng (hệ quả)')
  gt(dist(A, B), dist(C, K), 'AB = CK (điều phải chứng minh)')
  gt(goc(M, B, O), goc(M, O, C), 'MO phân giác BMC (hệ quả)')
  gt(goc(M, C, O), goc(K, C, M), 'M₁ = K₁ (hệ quả)')
  hinh('HH00090011_lg', [A, B, C, D, E, O, K, M], [
    seg(A, D), seg(A, E), seg(B, C), seg(B, E), seg(C, D),
    segDash(A, bis), segDash(K, M), segDash(B, M), segDash(C, M),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(O), dot(K), dot(M),
    angleText(A, B, bis, '1', 60, 18), angleText(A, bis, C, '2', 60, 18),
    angleText(B, C, E, '1', 62, 18), angleText(C, B, A, '1', 46, 18),
    angleText(M, C, K, '1', 46, 18), angleText(K, C, M, '1', 46, 18),
    label(A, 'A', 0, -14), label(B, 'B', -18, 8), label(C, 'C', 20, 8), label(D, 'D', -6, 32), label(E, 'E', 14, 30),
    label(O, 'O', -20, -16), label(K, 'K', 16, -8), label(M, 'M', 0, 34),
  ], OPT)
}

await xuatTat(RA)
