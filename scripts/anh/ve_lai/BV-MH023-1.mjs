// Vẽ lại hình — gói BV-MH023-1 (MH.023 Hình bình hành, Hình 8 · Luyện · biến thể). Thùy 13/10.
//   node scripts/anh/ve_lai/BV-MH023-1.mjs [<thu_muc_ra>]
// Mỗi biến thể vẽ theo ĐỀ CỦA BIẾN THỂ (tên điểm đã đổi). Cùng khuôn hình với gói BT-MH023-1 (BT.01 / .02 / .03 / .04).
import { P, seg, poly, tick, rightAngle, dot, label, lerp, mid, foot, doiXung, goc, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BV-MH023-1/moi'

const hbh = (lech, W, H) => ({ A: P(lech, 0), B: P(lech + W, 0), C: P(W, H), D: P(0, H) })
const khung = ({ A, B, C, D }) => poly([A, B, C, D])
const dinh = ({ A, B, C, D }) => [dot(A), dot(B), dot(C), dot(D),
  label(A, 'A', -12, -14), label(B, 'B', 12, -14), label(C, 'C', 12, 30), label(D, 'D', -12, 30)]
const ngoai = (a, b, k) => lerp(a, b, 1 + k / dist(a, b))

// 624c0277… — Kẻ AE ⊥ CD (E ∈ CD), CF ⊥ AB (F ∈ AB)
// 4f51e7be… — Kẻ AM ⊥ CD (M ∈ CD), CN ⊥ AB (N ∈ AB)
for (const [ten, tenCD, tenAB] of [
  ['624c0277-b69c-44d2-8712-135c619de0d7', 'E', 'F'],
  ['4f51e7be-5398-45bc-9bb1-5c5043cf37f0', 'M', 'N'],
]) {
  const Q = hbh(100, 300, 240), { A, B, C, D } = Q
  const X = foot(A, D, C), Y = foot(C, A, B) // X ∈ CD, Y ∈ AB
  console.assert(Math.abs(goc(X, A, C) - 90) < 0.5 && Math.abs(goc(Y, C, B) - 90) < 0.5)
  // hai đường chéo AC, BD: đề không nhắc nhưng ảnh cũ của hai biến thể này có (đường phụ của lời giải ý b) ⇒ giữ như ảnh cũ
  hinh(ten, [A, B, C, D], [khung(Q), seg(A, X), seg(C, Y), seg(A, C), seg(B, D), rightAngle(X, A, C), rightAngle(Y, C, B),
    ...dinh(Q), dot(X), dot(Y), label(X, tenCD, 0, 32), label(Y, tenAB, 0, -14)])
}

// 8a7cab26… — E, F lần lượt là trung điểm của AB, CD (ảnh cũ có gạch bằng nhau)
{
  const Q = hbh(60, 320, 200), { A, B, C, D } = Q
  const E = mid(A, B), F = mid(D, C)
  hinh('8a7cab26-529d-4518-81bf-75012ba745ca', [A, B, C, D], [khung(Q), seg(D, E), seg(B, F),
    tick(A, E), tick(E, B), tick(D, F), tick(F, C),
    ...dinh(Q), dot(E), dot(F), label(E, 'E', 0, -14), label(F, 'F', 0, 32)])
}

// 53950c9b… — Kẻ AE, CF ⊥ BD
{
  const Q = hbh(65, 330, 205), { A, B, C, D } = Q
  const E = foot(A, B, D), F = foot(C, B, D)
  console.assert(Math.abs(goc(E, A, B) - 90) < 0.5 && Math.abs(goc(F, C, B) - 90) < 0.5 && dist(D, E) < dist(D, F))
  hinh('53950c9b-0f24-40f7-9f96-bb8bb1991e79', [A, B, C, D], [khung(Q), seg(B, D), seg(A, E), seg(C, F),
    rightAngle(E, A, B), rightAngle(F, C, B), ...dinh(Q), dot(E), dot(F),
    label(E, 'E', 8, 34), label(F, 'F', -6, -14)])
}

// 026fdaf1… — AC cắt DB tại O; đường thẳng bất kì qua O cắt AD tại E và CB tại F (khác bài gốc: E ∈ AD, F ∈ CB)
{
  const Q = hbh(49, 330, 200), { A, B, C, D } = Q
  const O = mid(A, C)
  console.assert(dist(O, mid(B, D)) < 1e-6)
  const E = lerp(A, D, 0.3), F = doiXung(E, O) // F ∈ CB vì O là tâm đối xứng
  console.assert(Math.abs(goc(C, F, B)) < 0.5 || Math.abs(goc(C, F, B) - 0) < 0.5) // F nằm trên tia CB
  console.assert(dist(F, lerp(C, B, (F.y - C.y) / (B.y - C.y))) < 1e-6)
  const e1 = ngoai(F, E, 45), e2 = ngoai(E, F, 45)
  hinh('026fdaf1-41df-4615-9975-5cfae96e3655', [A, B, C, D, e1, e2], [khung(Q), seg(A, C), seg(B, D), seg(e1, e2),
    ...dinh(Q), dot(O), dot(E), dot(F),
    label(E, 'E', -20, 26), label(F, 'F', 20, -8), label(O, 'O', -8, 28)])
}

await xuatTat(RA)
