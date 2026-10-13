// Vẽ lại hình — gói BT-MH023-1 (MH.023 Hình bình hành, Hình 8 · Luyện · bài toán). Thùy 13/10.
//   node scripts/anh/ve_lai/BT-MH023-1.mjs [<thu_muc_ra>]
// Quy ước: A trên-trái, B trên-phải, C dưới-phải, D dưới-trái (như ảnh cũ). Dựng điểm bằng foot/mid/doiXung, không chép toạ độ ước mắt.
import { P, seg, segDash, poly, tick, rightAngle, dot, label, lerp, mid, foot, doiXung, goc, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH023-1/moi'

// Hình bình hành ABCD: AB // DC, AB = DC; D lệch trái A một đoạn `lech` (như ảnh cũ). Không phải chữ nhật/hình thoi.
const hbh = (lech, W, H) => ({ A: P(lech, 0), B: P(lech + W, 0), C: P(W, H), D: P(0, H) })
const khung = ({ A, B, C, D }) => poly([A, B, C, D])
const dinh = ({ A, B, C, D }) => [dot(A), dot(B), dot(C), dot(D),
  label(A, 'A', -12, -14), label(B, 'B', 12, -14), label(C, 'C', 12, 30), label(D, 'D', -12, 30)]
/** Điểm nằm trên tia a→b, cách b thêm k px (đầu mút đường kéo dài) */
const ngoai = (a, b, k) => lerp(a, b, 1 + k / dist(a, b))

// BT.08.023.01 — AH ⊥ CD (H ∈ CD), CK ⊥ AB (K ∈ AB)
{
  const { A, B, C, D } = hbh(100, 300, 240)
  const H = foot(A, D, C), K = foot(C, A, B)
  console.assert(Math.abs(goc(H, A, C) - 90) < 0.5 && Math.abs(goc(K, C, B) - 90) < 0.5)
  hinh('BT.08.023.01', [A, B, C, D], [khung({ A, B, C, D }), seg(A, H), seg(C, K),
    rightAngle(H, A, C), rightAngle(K, C, B), ...dinh({ A, B, C, D }), dot(H), dot(K),
    label(H, 'H', 0, 32), label(K, 'K', 0, -14)])
}

// BT.08.023.02 — M, N lần lượt là trung điểm AB, CD (ảnh cũ có gạch bằng nhau MA = MB = NC = ND)
{
  const { A, B, C, D } = hbh(60, 320, 200)
  const M = mid(A, B), N = mid(D, C)
  hinh('BT.08.023.02', [A, B, C, D], [khung({ A, B, C, D }), seg(D, M), seg(B, N),
    tick(A, M), tick(M, B), tick(D, N), tick(N, C),
    ...dinh({ A, B, C, D }), dot(M), dot(N), label(M, 'M', 0, -14), label(N, 'N', 0, 32)])
}

// hình dùng chung cho BT.03 (và 05, 06, 09 mượn), 07, 08 — AH, CK ⊥ BD
function veHK(Q, thua = []) {
  const { A, B, C, D } = Q
  const H = foot(A, B, D), K = foot(C, B, D)
  console.assert(Math.abs(goc(H, A, B) - 90) < 0.5 && Math.abs(goc(K, C, B) - 90) < 0.5)
  console.assert(dist(D, H) < dist(D, K)) // thứ tự D, H, K, B
  return { H, K }
}

// BT.08.023.03 — AH, CK ⊥ BD
{
  const Q = hbh(65, 330, 205), { A, B, C, D } = Q
  const { H, K } = veHK(Q)
  hinh('BT.08.023.03', [A, B, C, D], [khung(Q), seg(B, D), seg(A, H), seg(C, K),
    rightAngle(H, A, B), rightAngle(K, C, B), ...dinh(Q), dot(H), dot(K),
    label(H, 'H', 8, 34), label(K, 'K', -6, -14)])
}

// BT.08.023.04 — AC cắt BD tại O; đường thẳng bất kì qua O cắt AB tại E, CD tại F (kéo dài hai phía như ảnh cũ)
{
  const Q = hbh(49, 330, 200), { A, B, C, D } = Q
  const O = mid(A, C)
  console.assert(dist(O, mid(B, D)) < 1e-6)
  const E = lerp(A, B, 0.62), F = doiXung(E, O) // F ∈ CD vì O là tâm đối xứng
  console.assert(Math.abs(F.y - D.y) < 1e-6 && F.x > D.x && F.x < C.x)
  const e1 = ngoai(F, E, 50), e2 = ngoai(E, F, 50)
  hinh('BT.08.023.04', [A, B, C, D, e1, e2], [khung(Q), seg(A, C), seg(B, D), seg(e1, e2),
    ...dinh(Q), dot(O), dot(E), dot(F),
    label(E, 'E', -16, -12), label(F, 'F', 18, 28), label(O, 'O', -32, 8)])
}

// BT.08.023.07 — AH, CK ⊥ BD; O là trung điểm HK. (Ảnh cũ có AC nét đứt qua O ⇒ giữ như ảnh cũ.)
// BT.08.023.08 — AH, CK ⊥ BD; O là trung điểm BD. Hai bài ra cùng một hình (O trùng nhau theo định lý) nhưng dựng O theo đề từng bài.
for (const [ten, cachO] of [['BT.08.023.07', (H, K) => mid(H, K)], ['BT.08.023.08', (H, K, B, D) => mid(B, D)]]) {
  const Q = hbh(110, 330, 220), { A, B, C, D } = Q
  const { H, K } = veHK(Q)
  const O = cachO(H, K, B, D)
  console.assert(dist(O, mid(H, K)) < 1e-6 && dist(O, mid(B, D)) < 1e-6)
  hinh(ten, [A, B, C, D], [khung(Q), seg(B, D), seg(A, H), seg(C, K), segDash(A, C),
    rightAngle(H, A, B), rightAngle(K, C, B), ...dinh(Q), dot(H), dot(K), dot(O),
    label(H, 'H', 8, 34), label(K, 'K', -6, -14), label(O, 'O', 7, -17)])
}

await xuatTat(RA)
