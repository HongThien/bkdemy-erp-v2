// Vẽ lại hình — gói BT-MH061-2 (MH.061 Phân giác trong Tam giác vuông, Hình 7 · Luyện).
//   node scripts/anh/ve_lai/BT-MH061-2.mjs [<thu_muc_ra>]
import { P, seg, dot, label, rightAngle, mid, lerp, inter, bisector, goc, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH061-2/moi'
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)

// ── BT.07.061.31 — ABC có AB < AC (tam giác thường, không vuông/cân); AI phân giác góc A (I ∈ BC); K ∈ AC, AK = AB.
// Ảnh cũ: A trên, B trái-dưới, C phải-dưới, BC nằm ngang; có thêm O = AI ∩ BK, E (AB ∩ KI) với đoạn BE, EC (bài sau) ⇒ giữ như ảnh cũ.
// Ảnh cũ KHÔNG có đoạn KI, nhưng đề của chính bài nêu △AKI ⇒ thêm KI (ghi báo cáo).
{
  const B = P(0, 0), C = P(317, 0), A = P(106, -211)
  const I = inter(A, bisector(A, B, C), B, C)
  const K = lerp(A, C, dist(A, B) / dist(A, C))
  const O = inter(A, I, B, K)
  const E = inter(A, B, K, I)
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  ok(Math.abs(goc(A, B, I) - goc(A, K, I)) < 0.01, 'AI phân giác góc A')
  ok(Math.abs(dist(A, K) - dist(A, B)) < 0.01, 'AK = AB')
  ok(Math.abs(goc(O, A, B) - 90) < 0.5, 'AI ⊥ BK (hệ quả)')
  ok(Math.abs(dist(A, E) - dist(A, C)) < 0.01 && E.y > 0, 'E trên tia AB kéo dài, AE = AC (hệ quả)')
  ok(Math.abs((E.x - C.x) * (K.y - B.y) - (E.y - C.y) * (K.x - B.x)) < 1, 'BK ∥ EC (hệ quả)')
  hinh('BT.07.061.31', [A, B, C, I, K, O, E], [seg(A, E), seg(A, C), seg(B, C), seg(A, I), seg(B, K), seg(E, C), seg(K, I),
    dot(A), dot(B), dot(C), dot(I), dot(K), dot(O), dot(E),
    label(A, 'A', 0, -12), label(B, 'B', -20, 6), label(C, 'C', 22, 8), label(I, 'I', -14, 23),
    label(K, 'K', 16, -8), label(O, 'O', 14, -8), label(E, 'E', -18, 8)])
}

await xuatTat(RA)
