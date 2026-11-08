// Vẽ lại hình — gói VT-6 (HGT: Tích của véc tơ với một số, K10).
//   node scripts/anh/ve_lai/VT-6.mjs [<thu_muc_ra>]
import { P, seg, dot, label, labelOut, trongTam, mid, foot, goc, dist, rightAngle, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/VT-6/moi'

// T310000000465 — hình vuông ABCD cạnh 2 (D trên-trái, C trên-phải, A dưới-trái, B dưới-phải như ảnh cũ)
{
  const s = 260
  const A = P(0, s), B = P(s, s), C = P(s, 0), D = P(0, 0), G = trongTam([A, B, C, D])
  console.assert(Math.abs(goc(A, B, D) - 90) < 0.5 && Math.abs(dist(A, B) - dist(A, D)) < 0.5)
  hinh('T310000000465', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), dot(A), dot(B), dot(C), dot(D),
    labelOut(A, 'A', G, 22), labelOut(B, 'B', G, 22), labelOut(C, 'C', G, 22), labelOut(D, 'D', G, 22)])
}

// Tam giác ABC thường (A trên-trái, B dưới-trái, C dưới-phải) — dùng chung cho các hình "tam giác ABC"
function tamGiac(ten) {
  const B = P(0, 150), C = P(260, 150), A = P(36, 0), G = trongTam([A, B, C])
  hinh(ten, [A, B, C], [seg(A, B), seg(B, C), seg(C, A), dot(A), dot(B), dot(C),
    labelOut(A, 'A', G, 24), labelOut(B, 'B', G, 24), labelOut(C, 'C', G, 24)])
}
tamGiac('T310000000462+T310000000463')
tamGiac('T310000000450+T310000000451+T310000000452+T310000000454')

// T310000000339 — O là tâm tam giác đều ABC (hình đề: không vẽ lục giác/đường tròn của lời giải)
{
  const a = 280, h = a * Math.sqrt(3) / 2
  const B = P(0, h), C = P(a, h), A = P(a / 2, 0), O = trongTam([A, B, C])
  console.assert(Math.abs(dist(A, B) - dist(B, C)) < 0.5 && Math.abs(dist(A, C) - dist(B, C)) < 0.5)
  hinh('T310000000339', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(O, A), seg(O, B), seg(O, C), dot(A), dot(B), dot(C), dot(O),
    label(A, 'A', 0, -14), label(B, 'B', -20, 8), label(C, 'C', 20, 8), label(O, 'O', 0, 36)])
}

// T3100000001109 — tam giác đều ABC cạnh a (ảnh cũ có sẵn đường cao AH, H giữa BC: giữ)
{
  const a = 270, h = a * Math.sqrt(3) / 2
  const B = P(0, h), C = P(a, h), A = P(a / 2, 0), H = mid(B, C)
  console.assert(Math.abs(dist(A, B) - dist(A, C)) < 0.5 && Math.abs(goc(H, A, B) - 90) < 0.5)
  hinh('T3100000001109', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(A, H), dot(A), dot(B), dot(C), dot(H),
    label(A, 'A', 0, -14), label(B, 'B', -20, 8), label(C, 'C', 20, 8), label(H, 'H', 0, 30)])
}

// T310000000457 — tam giác OAB vuông cân tại O (O dưới-trái, B trên O, A bên phải O)
{
  const s = 260
  const O = P(0, s), A = P(s, s), B = P(0, 0), G = trongTam([O, A, B])
  console.assert(Math.abs(goc(O, A, B) - 90) < 0.5 && Math.abs(dist(O, A) - dist(O, B)) < 0.5)
  hinh('T310000000457', [O, A, B], [seg(O, A), seg(O, B), seg(A, B), rightAngle(O, A, B), dot(O), dot(A), dot(B),
    labelOut(O, 'O', G, 24), labelOut(A, 'A', G, 24), labelOut(B, 'B', G, 24)])
}

// T310000000458 — hình chữ nhật ABCD (A trên-trái, D trên-phải, B dưới-trái, C dưới-phải như ảnh cũ; không phải hình vuông)
{
  const A = P(0, 0), D = P(300, 0), B = P(0, 215), C = P(300, 215), G = trongTam([A, B, C, D])
  console.assert(Math.abs(goc(A, B, D) - 90) < 0.5 && dist(A, B) !== dist(A, D))
  hinh('T310000000458', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), dot(A), dot(B), dot(C), dot(D),
    labelOut(A, 'A', G, 24), labelOut(B, 'B', G, 24), labelOut(C, 'C', G, 24), labelOut(D, 'D', G, 24)])
}

await xuatTat(RA)
