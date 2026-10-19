// Vẽ lại hình — gói TH-3 (câu hình học Toán 7 trong đề thi/đề cương, kho CHƯA CÓ HÌNH).
//   node scripts/anh/ve_lai/TH-3.mjs [<thu_muc_ra>]
// Câu KHÔNG vẽ: HHC002797 (tiên đề Euclid, phát biểu) · HHC002803 (tính chất so le trong, phát biểu) · HHC002809 (điền điều kiện m, n, p; 4 PA là 4 quan hệ).
import { P, seg, lineExt, tick, angleMark, rightAngle, ray, rot, foot, mid, goc, bisector, dot, label, num, angleText, labelOut, trongTam, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/TH-3/moi'
const unit = (v) => { const l = Math.hypot(v.x, v.y); return P(v.x / l, v.y / l) }
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
/** Dấu ">" ký hiệu song song tại p theo hướng d (đơn vị) */
const chev = (p, d, s = 7) => {
  const n = P(-d.y, d.x), tip = P(p.x + d.x * s * 0.6, p.y + d.y * s * 0.6)
  return seg(P(p.x - d.x * s * 0.6 + n.x * s, p.y - d.y * s * 0.6 + n.y * s), tip) + seg(P(p.x - d.x * s * 0.6 - n.x * s, p.y - d.y * s * 0.6 - n.y * s), tip)
}

// HHC002801 — góc xOy = 70°, Ot là tia phân giác (đề hỏi xOt: không ghi số đo xOt)
{
  const O = P(0, 0), x = ray(O, 0, 260), y = ray(O, 70, 250), t = ray(O, 35, 270)
  console.assert(Math.abs(goc(O, x, y) - 70) < 0.5 && Math.abs(goc(O, x, t) - goc(O, t, y)) < 0.5)
  hinh('HHC002801', [O, x, y, t], [seg(O, x), seg(O, y), seg(O, t), dot(O),
    angleMark(O, x, t, 44), angleMark(O, t, y, 44), angleMark(O, x, y, 86),
    num(ray(O, 18, 116), '70°', 0, 8),
    label(O, 'O', -14, 22), label(x, 'x', 16, 8), label(y, 'y', 8, -10), label(t, 't', 14, -6)])
}

// HHC002802 — hai đường thẳng xx′, yy′ cắt nhau tại O; góc xOy = 50° (đề hỏi x′Oy′: không ghi)
{
  const O = P(0, 0), x = ray(O, 0, 190), x1 = ray(O, 180, 190), y = ray(O, 50, 170), y1 = ray(O, 230, 170)
  console.assert(Math.abs(goc(O, x, y) - 50) < 0.5)
  hinh('HHC002802', [x, x1, y, y1], [seg(x1, x), seg(y1, y), dot(O), angleMark(O, x, y, 46),
    num(ray(O, 25, 78), '50°', 0, 8),
    label(O, 'O', -16, -10), label(x, 'x', 18, 8), label(x1, 'x′', -14, 8), label(y, 'y', 8, -10), label(y1, 'y′', -2, 30)])
}

// HHC002804 — điểm A nằm ngoài đường thẳng d
{
  const l1 = P(0, 130), l2 = P(320, 130), A = P(150, 20)
  hinh('HHC002804', [l1, l2, A], [seg(l1, l2), dot(A), label(A, 'A', 0, -14), label(l2, 'd', 4, -10)])
}

// HHC002805 — tam giác ABC bất kì (không ghi gì thêm)
{
  const A = P(120, 0), B = P(0, 200), C = P(330, 215), G = trongTam([A, B, C])
  hinh('HHC002805', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), dot(A), dot(B), dot(C),
    labelOut(A, 'A', G, 22), labelOut(B, 'B', G, 24), labelOut(C, 'C', G, 24)])
}

// HHC002806 — tam giác MHK vuông tại H
{
  const H = P(0, 190), M = P(0, 0), K = P(270, 190), G = trongTam([H, M, K])
  hinh('HHC002806', [H, M, K], [seg(M, H), seg(H, K), seg(K, M), rightAngle(H, M, K, 16), dot(M), dot(H), dot(K),
    label(M, 'M', -4, -12), label(H, 'H', -18, 24), label(K, 'K', 14, 24)])
}

// HHC002807 — hình minh hoạ định lí: a ∥ b, c ⊥ a tại A, c cắt b tại B (c ⊥ b là KẾT LUẬN ⇒ không đánh dấu ở B)
{
  const A = P(140, 0), B = P(140, 130), a1 = P(-20, 0), a2 = P(330, 0), b1 = P(-20, 130), b2 = P(330, 130), c1 = P(140, -45), c2 = P(140, 175)
  const dx = P(1, 0)
  hinh('HHC002807', [a1, a2, b1, b2, c1, c2], [seg(a1, a2), seg(b1, b2), seg(c1, c2), dot(A), dot(B),
    rightAngle(A, c2, a2, 16), chev(P(40, 0), dx), chev(P(40, 130), dx),
    label(A, 'A', -16, -12), label(B, 'B', -16, 26), label(a2, 'a', 4, -10), label(b2, 'b', 4, -10), label(c2, 'c', 18, 10)])
}

// HHC002813 — góc xOy = 60°, A ∈ Ox, m qua A // Oy, d qua A ⊥ Oy tại B (d ⊥ m là điều phải chứng minh ⇒ không đánh dấu)
{
  const O = P(0, 0), A = ray(O, 0, 230), yEnd = ray(O, 60, 270)
  const u = unit(sub(yEnd, O)), B = foot(A, O, yEnd)
  const xEnd = ray(O, 0, 300)
  const m1 = P(A.x - u.x * 60, A.y - u.y * 60), m2 = P(A.x + u.x * 230, A.y + u.y * 230)
  const dd = unit(sub(A, B)), d1 = P(B.x - dd.x * 60, B.y - dd.y * 60), d2 = P(A.x + dd.x * 60, A.y + dd.y * 60)
  console.assert(Math.abs(goc(O, xEnd, yEnd) - 60) < 0.5 && Math.abs(goc(B, A, O) - 90) < 0.5)
  hinh('HHC002813', [O, xEnd, yEnd, m1, m2, d1, d2], [seg(O, xEnd), seg(O, yEnd), seg(m1, m2), seg(d1, d2), dot(O), dot(A), dot(B),
    angleMark(O, xEnd, yEnd, 40), num(ray(O, 30, 74), '60°', 0, 8), rightAngle(B, A, O, 16),
    chev(P(B.x + u.x * 90, B.y + u.y * 90), u), chev(P(A.x + u.x * 110, A.y + u.y * 110), u),
    label(O, 'O', -16, 22), label(A, 'A', 6, 34), label(B, 'B', -4, -22), label(xEnd, 'x', 16, 8), label(yEnd, 'y', 10, -10),
    label(m2, 'm', 18, 4), label(d1, 'd', -14, 8)])
}

await xuatTat(RA)
