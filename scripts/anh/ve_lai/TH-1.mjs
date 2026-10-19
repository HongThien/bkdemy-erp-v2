// Vẽ hình — gói TH-1 (câu hình học Toán 7 đề thi/đề cương, kho CHƯA CÓ HÌNH). Không có ảnh cũ: vẽ theo ĐỀ.
//   node scripts/anh/ve_lai/TH-1.mjs [<thu_muc_ra>]
// Không vẽ: HHC002602 (4 phương án mô tả 4 tình huống khác nhau), HHC002775 (phát biểu tiên đề), HHC002776 (khái niệm).
import { P, seg, angleMark, sector, ray, dot, label, num, angleText, labelOut, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/TH-1/moi'
const O = P(0, 0)
const L = 200
const chk = (v, p, q, d) => console.assert(Math.abs(goc(v, p, q) - d) < 0.5, `góc lệch: ${goc(v, p, q)} != ${d}`)

// HHC002597 — Op là phân giác của mOn, nOp = 30°
{
  const n = ray(O, 0, L), p = ray(O, 30, L), m = ray(O, 60, L)
  chk(O, n, p, 30); chk(O, p, m, 30)
  hinh('HHC002597', [O, n, p, m], [seg(O, n), seg(O, p), seg(O, m), dot(O),
    angleMark(O, n, p, 34), angleMark(O, p, m, 46),
    angleText(O, n, p, '30°', 100),
    label(O, 'O', -16, 18), labelOut(n, 'n', O, 22), labelOut(p, 'p', O, 22), labelOut(m, 'm', O, 22)])
}

// HHC002687 — Oy là phân giác của xOz, xOy = 40°
{
  const x = ray(O, 0, L), y = ray(O, 40, L), z = ray(O, 80, L)
  chk(O, x, y, 40); chk(O, y, z, 40)
  hinh('HHC002687', [O, x, y, z], [seg(O, x), seg(O, y), seg(O, z), dot(O),
    angleMark(O, x, y, 34), angleMark(O, y, z, 46),
    angleText(O, x, y, '40°', 105),
    label(O, 'O', -16, 18), labelOut(x, 'x', O, 22), labelOut(y, 'y', O, 22), labelOut(z, 'z', O, 22)])
}

// HHC002601 — đường thẳng a cắt b, c; có cặp góc so le trong bằng nhau (đánh dấu cung bằng nhau, không ghi số)
{
  const A = P(0, 0), B = P(55, 130)
  const dirU = { x: B.x - A.x, y: B.y - A.y }, k = 1 / Math.hypot(dirU.x, dirU.y)
  const u = { x: dirU.x * k, y: dirU.y * k }
  const a1 = P(A.x - u.x * 70, A.y - u.y * 70), a2 = P(B.x + u.x * 70, B.y + u.y * 70)
  const bL = P(-150, 0), bR = P(210, 0), cL = P(-95, 130), cR = P(265, 130)
  const Ar = P(120, 0), Bl = P(-60, 130)   // tia phải trên b tại A; tia trái trên c tại B (cặp so le trong)
  hinh('HHC002601', [a1, a2, bL, bR, cL, cR], [seg(bL, bR), seg(cL, cR), seg(a1, a2),
    angleMark(A, Ar, B, 36), angleMark(B, Bl, A, 36),
    label(bR, 'b', 16, 8), label(cR, 'c', 16, 8), label(a1, 'a', -16, -6)])
}

// HHC002603 — xOy, yOz kề bù; Om, On là phân giác (cung 1 cho nửa xOy, cung 2 cho nửa yOz)
{
  const x = ray(O, 180, L), z = ray(O, 0, L), y = ray(O, 65, L)
  const m = ray(O, 122.5, L), n = ray(O, 32.5, L)
  chk(O, x, y, 115); chk(O, y, z, 65); chk(O, x, m, 57.5); chk(O, m, y, 57.5)
  hinh('HHC002603', [x, z, y, m, n, O], [seg(x, z), seg(O, y), seg(O, m), seg(O, n), dot(O),
    angleMark(O, x, m, 40), angleMark(O, m, y, 54),
    angleMark(O, y, n, 40, 2), angleMark(O, n, z, 54, 2),
    label(O, 'O', 4, 28), labelOut(x, 'x', O, 22), labelOut(z, 'z', O, 22), labelOut(y, 'y', O, 22), labelOut(m, 'm', O, 22), labelOut(n, 'n', O, 22)])
}

// HHC002604 — xx′, yy′ cắt nhau tại O, xOy = 30°, Om phân giác của xOy
{
  const x = ray(O, 0, L), y = ray(O, 30, L), x1 = ray(O, 180, L), y1 = ray(O, 210, L)
  const m = ray(O, 15, 90)
  chk(O, x, y, 30); chk(O, x, m, 15); chk(O, m, y, 15); chk(O, x1, y1, 30)
  hinh('HHC002604', [x, y, x1, y1, m, O], [seg(x1, x), seg(y1, y), seg(O, m), dot(O),
    angleMark(O, x, m, 34), angleMark(O, m, y, 46), angleMark(O, x, y, 135),
    num(ray(O, 15, 170), '30°', 0, 8),
    label(O, 'O', -14, -12), labelOut(x, 'x', O, 22), labelOut(y, 'y', O, 22), labelOut(x1, 'x′', O, 24), labelOut(y1, 'y′', O, 24), labelOut(m, 'm', O, 22)])
}

// HHC002606 — Ox, Oy đối nhau; yOt = 40°, xOz = 100°; Ot nằm giữa Oy và Oz (không ghi zOy, zOt)
{
  const x = ray(O, 180, L), y = ray(O, 0, L), z = ray(O, 80, L), t = ray(O, 40, L)
  chk(O, y, t, 40); chk(O, x, z, 100); chk(O, y, z, 80)
  hinh('HHC002606', [x, y, z, t, O], [seg(x, y), seg(O, z), seg(O, t), dot(O),
    angleMark(O, y, t, 44), angleMark(O, x, z, 36),
    angleText(O, y, t, '40°', 105), angleText(O, x, z, '100°', 80),
    label(O, 'O', 4, 28), labelOut(x, 'x', O, 22), labelOut(y, 'y', O, 22), labelOut(z, 'z', O, 22), labelOut(t, 't', O, 22)])
}

// HHC002607 — xOm = 50°, Oy đối Ox; On cùng nửa mặt phẳng với Om, yOn = 80° (không ghi mOn, xOn, yOm)
{
  const x = ray(O, 180, L), y = ray(O, 0, L), m = ray(O, 130, L), n = ray(O, 80, L)
  chk(O, x, m, 50); chk(O, y, n, 80)
  hinh('HHC002607', [x, y, m, n, O], [seg(x, y), seg(O, m), seg(O, n), dot(O),
    angleMark(O, x, m, 44), angleMark(O, y, n, 44),
    angleText(O, x, m, '50°', 100), angleText(O, y, n, '80°', 80),
    label(O, 'O', 4, 28), labelOut(x, 'x', O, 22), labelOut(y, 'y', O, 22), labelOut(m, 'm', O, 22), labelOut(n, 'n', O, 22)])
}

await xuatTat(RA)
