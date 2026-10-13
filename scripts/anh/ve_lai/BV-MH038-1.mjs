// Vẽ lại hình — gói BV-MH038-1 (MH.038 Đối đỉnh, Hình 7 · Luyện · biến thể đổi tên điểm / đổi số).
//   node scripts/anh/ve_lai/BV-MH038-1.mjs [<thu_muc_ra>]
import { P, seg, angleMark, sector, ray, dot, label, angleText, goc, labelOut, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BV-MH038-1/moi'
const O = P(0, 0)

// Hai đường thẳng cắt nhau tại O. ten = tên tệp; [xn, x1n, yn, y1n] = tên 4 tia (x, x′, y, y′).
// Tia x ở góc ax (độ), tia y ở góc ay. Không ghi số đo / không tô nếu goc = null.
// goc = { p:'x1'|'x', q:'y1'|'y', val:'65°', rs, rt } : tô + cung + số cho góc giữa hai tia p, q.
function dd(ten, [xn, x1n, yn, y1n], ax, ay, g = null, L1 = 190, L2 = 175) {
  const X = ray(O, ax, L1), X1 = ray(O, ax + 180, L1), Y = ray(O, ay, L2), Y1 = ray(O, ay + 180, L2)
  const pt = { x: X, x1: X1, y: Y, y1: Y1 }
  const body = []
  if (g) body.push(sector(O, pt[g.p], pt[g.q], g.rs))
  body.push(seg(X1, X), seg(Y1, Y))
  if (g) body.push(angleMark(O, pt[g.p], pt[g.q], g.rs))
  body.push(dot(O))
  if (g) body.push(angleText(O, pt[g.p], pt[g.q], g.val, g.rt))
  body.push(label(O, 'O', g && g.oDx != null ? g.oDx : g ? 4 : -12, g ? -16 : -18),
    labelOut(X, xn, O, 22), labelOut(X1, x1n, O, 22), labelOut(Y, yn, O, 22), labelOut(Y1, y1n, O, 22))
  hinh(ten, [X, X1, Y, Y1], body)
  return { O, X, X1, Y, Y1 }
}

// 1) z, z′, t, t′ — không ghi số (ảnh cũ không số); hai đường cắt nhau lệch (≈ 65° / 115°), không vuông
{
  const r = dd('18bf2098-c12c-4adc-846c-0022f6942425', ['z', 'z′', 't', 't′'], -15, 50)
  console.assert(Math.abs(goc(O, r.X, r.Y) - 65) < 0.01)
}

// 2) a, a′, b, b′ — không ghi số
{
  const r = dd('0a644cca-8840-492f-9a00-8e0bbce15a0e', ['a', 'a′', 'b', 'b′'], -15, 50)
  console.assert(Math.abs(goc(O, r.X, r.Y) - 65) < 0.01)
}

// 3) x′Oy′ = 45°
{
  const r = dd('e93b0e43-6043-448b-933c-8d990f666970', ['x', 'x′', 'y', 'y′'], -12, 168 + 45 - 180,
    { p: 'x1', q: 'y1', val: '45°', rs: 56, rt: 98 })
  console.assert(Math.abs(goc(O, r.X1, r.Y1) - 45) < 0.01, 'x′Oy′ 45')
  console.assert(Math.abs(goc(O, r.X, r.Y) - 45) < 0.01, 'xOy 45')
}

// 4) x′Oy′ = 60°  (đề viết \widehat {xOy} — cùng nghĩa)
{
  const r = dd('d477e26d-5b1f-4638-8e76-df6b267a0496', ['x', 'x′', 'y', 'y′'], -17, 163 + 60 - 180,
    { p: 'x1', q: 'y1', val: '60°', rs: 52, rt: 92 })
  console.assert(Math.abs(goc(O, r.X1, r.Y1) - 60) < 0.01, 'x′Oy′ 60')
}

// 5) xOy′ = 54° (ghi trên hình: góc xOy′ ở nửa trái); y′ ở trên-trái, x ở dưới-trái; x′ trên-phải, y dưới-phải
{
  const r = dd('8a46ad82-6b15-4d39-b92c-6a0539102c46', ['x', 'x′', 'y', 'y′'], 153 + 54, 153 + 180,
    { p: 'x', q: 'y1', val: '54°', rs: 54, rt: 94, oDx: 0 })
  console.assert(Math.abs(goc(O, r.X, r.Y1) - 54) < 0.01, 'xOy′ 54')
  console.assert(Math.abs(goc(O, r.X1, r.Y) - 54) < 0.01, 'x′Oy 54')
  console.assert(Math.abs(goc(O, r.X, r.Y) - 126) < 0.01, 'xOy 126')
}

// 6) x′Oy′ = 35° (góc nhọn nhỏ: cung và số đẩy ra xa hơn)
{
  const r = dd('ea72cfdd-d344-4128-a879-6beccbb4ecd6', ['x', 'x′', 'y', 'y′'], -10, 170 + 35 - 180,
    { p: 'x1', q: 'y1', val: '35°', rs: 74, rt: 120 }, 190, 175)
  console.assert(Math.abs(goc(O, r.X1, r.Y1) - 35) < 0.01, 'x′Oy′ 35')
}

await xuatTat(RA)
