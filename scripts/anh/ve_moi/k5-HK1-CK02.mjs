// k5-HK1-CK02.mjs — Toán 5 HK1, Cuối kì 2: Bài 4 (T105000000066) hình thang vuông ABCD = hình vuông ABED (cạnh 3 cm) + tam giác vuông BEC (EC = 3 cm).
import { P, seg, dot, label, num, hinh, xuatTat } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5-HK1-CK02.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const head = (tip, from, s = 9) => {
  const l = Math.hypot(tip.x - from.x, tip.y - from.y), ux = (tip.x - from.x) / l, uy = (tip.y - from.y) / l
  const a = P(tip.x - ux * s - uy * s * 0.4, tip.y - uy * s + ux * s * 0.4), b = P(tip.x - ux * s + uy * s * 0.4, tip.y - uy * s - ux * s * 0.4)
  return `<path d="M ${tip.x} ${tip.y} L ${a.x} ${a.y} L ${b.x} ${b.y} Z" fill="#222" stroke="none"/>`
}
const mui = (a, b) => seg(a, b) + head(a, b) + head(b, a)
{
  const k = 55   // px / cm
  const A = P(0, 0), B = P(3 * k, 0), D = P(0, 3 * k), E = P(3 * k, 3 * k), C = P(6 * k, 3 * k)
  ok('ABED là hình vuông cạnh 3 cm', B.x - A.x === 3 * k && D.y - A.y === 3 * k && E.x === B.x && E.y === D.y)
  ok('EC = 3 cm, D–E–C thẳng hàng ngang', C.y === E.y && C.x - E.x === 3 * k)
  ok('ABCD là hình thang vuông (AB ∥ DC, AD ⟂ DC)', A.y === B.y && D.y === C.y && A.x === D.x)
  const yTren = D.y + 20, yChu = D.y + 54
  hinh('T105000000066', [A, B, C, D, P(-100, 0), P(C.x + 20, yChu + 10)], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(B, E),
    mui(P(-28, 0), P(-28, 3 * k)), num(P(-72, 3 * k / 2), '3 cm', 0, 7),
    mui(P(0, yTren), P(3 * k, yTren)), mui(P(3 * k, yTren), P(6 * k, yTren)),
    num(P(1.5 * k, yChu), '3 cm', 0, 4), num(P(4.5 * k, yChu), '3 cm', 0, 4),
    [A, B, C, D, E].map(dot).join(''),
    label(A, 'A', -4, -14), label(B, 'B', 4, -14), label(D, 'D', -2, yChu - D.y + 4), label(E, 'E', 0, yChu - E.y + 4), label(C, 'C', 4, yChu - C.y + 4),
  ], { padDuoi: 24 })
}
await xuatTat(dir)
