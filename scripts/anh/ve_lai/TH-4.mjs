// Vẽ hình — gói TH-4 (câu hình học Toán 7 trong đề thi, kho chưa có hình). Không có ảnh cũ.
//   node scripts/anh/ve_lai/TH-4.mjs [<thu_muc_ra>]
// Không vẽ: HHC002816, HHC002826, HHC002834, HHC002836 (xem báo cáo).
import { P, seg, angleMark, rightAngle, ray, rot, inter, bisector, goc, dot, label, num, angleText, labelOut, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/TH-4/moi'
const gần = (a, b, tol = 0.5) => console.assert(Math.abs(a - b) < tol, `lệch: ${a} ≠ ${b}`)

// Góc xOy có tia phân giác Oz (không đánh dấu hai góc bằng nhau — đó là điều đề hỏi)
function gocPhanGiac(ten, angX, angY, ten3, L = 230) {
  const O = P(0, 0), x = ray(O, angX, L), y = ray(O, angY, L), z = bisector(O, x, y, L)
  gần(goc(O, x, z), goc(O, z, y))
  const trong = bisector(O, x, y, 60)
  hinh(ten, [O, x, y, z], [seg(O, x), seg(O, y), seg(O, z), dot(O),
    labelOut(O, 'O', trong, 24), labelOut(x, 'x', O, 20), labelOut(y, 'y', O, 20), labelOut(z, ten3, O, 20)])
}
// HHC002815 — Oz là tia phân giác của góc xOy
gocPhanGiac('HHC002815', 20, 100, 'z')
// HHC002821 — Ot là tia phân giác của góc xOy
gocPhanGiac('HHC002821', 10, 130, 't')

// HHC002817 — tam giác ABC vuông tại A, B = 30°, tia phân giác của C cắt AB tại D (không ghi C = 60°, BCD = 30°)
{
  const A = P(0, 0), B = P(330, 0)
  const AB = 330, AC = AB * Math.tan(30 * Math.PI / 180)
  const Cc = P(0, -AC)
  const D = inter(Cc, bisector(Cc, A, B, 100), A, B)
  gần(goc(B, A, Cc), 30); gần(goc(A, B, Cc), 90) // B = 30°, A = 90°
  gần(goc(Cc, B, D), 30)
  const G = P((A.x + B.x + Cc.x) / 3, (A.y + B.y + Cc.y) / 3)
  hinh('HHC002817', [A, B, Cc, D], [seg(A, B), seg(B, Cc), seg(Cc, A), seg(Cc, D), dot(A), dot(B), dot(Cc), dot(D),
    rightAngle(A, B, Cc, 16), angleMark(B, A, Cc, 56), angleText(B, A, Cc, '30°', 110, 20),
    angleMark(Cc, A, D, 40), angleMark(Cc, D, B, 52), // CD là phân giác (đề cho): hai góc ACD, DCB đánh dấu bằng nhau, hai bán kính khác nhau
    labelOut(A, 'A', G, 26), labelOut(B, 'B', G, 26), labelOut(Cc, 'C', G, 26), label(D, 'D', 2, 32)])
}

// HHC002820 — tam giác ABC có B = 80°, C = 30°; tia phân giác góc A cắt BC tại D (không ghi A = 70°)
{
  const B = P(0, 0), C = P(340, 0)
  const A = inter(B, ray(B, 80, 100), C, ray(C, 150, 100))
  gần(goc(B, C, A), 80); gần(goc(C, B, A), 30)
  const D = inter(A, bisector(A, B, C, 100), B, C)
  const G = P((A.x + B.x + C.x) / 3, (A.y + B.y + C.y) / 3)
  hinh('HHC002820', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, A), seg(A, D), dot(A), dot(B), dot(C), dot(D),
    angleMark(B, C, A, 34), angleText(B, C, A, '80°', 62, 20),
    angleMark(C, B, A, 56), angleText(C, B, A, '30°', 112, 20),
    angleMark(A, B, D, 44), angleMark(A, D, C, 56), // AD là phân giác (đề cho): hai góc BAD, DAC đánh dấu bằng nhau
    labelOut(A, 'A', G, 26), labelOut(B, 'B', G, 26), labelOut(C, 'C', G, 26), label(D, 'D', 0, 34)])
}

// HHC002824 — xy và ab cắt nhau tại E, xEa = 60°; tia Em phân giác của xEb (ý b). Chỉ ghi 60° đề cho.
{
  const E = P(0, 0), L = 165
  const x = ray(E, 180, L), y = ray(E, 0, L), a = ray(E, 120, L), b = ray(E, 300, L), m = ray(E, 240, L)
  gần(goc(E, x, a), 60); gần(goc(E, x, b), 120); gần(goc(E, x, m), goc(E, m, b))
  hinh('HHC002824', [x, y, a, b, m], [seg(x, y), seg(a, b), seg(E, m), dot(E),
    angleMark(E, x, a, 38), angleText(E, x, a, '60°', 68, 20),
    label(E, 'E', 18, -22),
    labelOut(x, 'x', E, 20), labelOut(y, 'y', E, 20), labelOut(a, 'a', E, 20), labelOut(b, 'b', E, 20), labelOut(m, 'm', E, 20)])
}

// HHC002825 — hai góc mAn = 50° (đỉnh A) và xBy = 130° (đỉnh B), vẽ tách rời nhau
{
  const A = P(0, 0), n = ray(A, 5, 130), m = ray(A, 55, 130)
  const B = P(290, 0), x = ray(B, 20, 125), y = ray(B, 150, 125)
  gần(goc(A, m, n), 50); gần(goc(B, x, y), 130)
  const tA = bisector(A, m, n, 60), tB = bisector(B, x, y, 60)
  hinh('HHC002825', [A, m, n, B, x, y], [seg(A, n), seg(A, m), seg(B, x), seg(B, y), dot(A), dot(B),
    angleMark(A, n, m, 34), angleText(A, n, m, '50°', 70, 20),
    angleMark(B, x, y, 28), angleText(B, x, y, '130°', 62, 20),
    labelOut(A, 'A', tA, 24), labelOut(B, 'B', tB, 24),
    labelOut(m, 'm', A, 20), labelOut(n, 'n', A, 20), labelOut(x, 'x', B, 20), labelOut(y, 'y', B, 20)])
}

await xuatTat(RA)
