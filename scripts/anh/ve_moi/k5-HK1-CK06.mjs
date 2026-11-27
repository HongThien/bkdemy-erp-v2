// k5-HK1-CK06.mjs — Toán 5 HK1, Cuối kì 6: Câu 6 (T105000000115) sân vận động = hình chữ nhật 90 m × 60 m + hai nửa hình tròn bán kính 30 m;
// Bài 5 (T105000000124) hình thang vuông = hình vuông + tam giác vuông (đáy 8,6 cm, diện tích 51,6 cm² → cạnh vuông 12 cm).
import { P, seg, dot, num, hinh, xuatTat } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5-HK1-CK06.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const head = (tip, from, s = 9) => {
  const l = Math.hypot(tip.x - from.x, tip.y - from.y), ux = (tip.x - from.x) / l, uy = (tip.y - from.y) / l
  const a = P(tip.x - ux * s - uy * s * 0.4, tip.y - uy * s + ux * s * 0.4), b = P(tip.x - ux * s + uy * s * 0.4, tip.y - uy * s - ux * s * 0.4)
  return `<path d="M ${tip.x} ${tip.y} L ${a.x} ${a.y} L ${b.x} ${b.y} Z" fill="#222" stroke="none"/>`
}
const mui = (a, b) => seg(a, b) + head(a, b) + head(b, a)
// ── Câu 6 · sân vận động ──
{
  const k = 3                      // px / m
  const R = 30 * k, Wd = 90 * k, Hd = 2 * R
  ok('chiều cao chữ nhật = đường kính = 60 m', Hd === 60 * k)
  ok('chiều dài chữ nhật = 90 m', Wd === 90 * k)
  const L = P(0, R), Rr = P(Wd, R)
  ok('tâm hai nửa hình tròn là trung điểm hai cạnh ngắn', L.y === Hd / 2 && Rr.y === Hd / 2 && Rr.x - L.x === Wd)
  const trai = `<path d="M 0 0 A ${R} ${R} 0 0 0 0 ${Hd}" fill="none"/>`
  const phai = `<path d="M ${Wd} 0 A ${R} ${R} 0 0 1 ${Wd} ${Hd}" fill="none"/>`
  hinh('T105000000115', [P(-R, -48), P(Wd + R, Hd)], [
    seg(P(0, 0), P(Wd, 0)), seg(P(0, Hd), P(Wd, Hd)), seg(P(0, 0), P(0, Hd)), seg(P(Wd, 0), P(Wd, Hd)), trai, phai,
    dot(L), dot(Rr),
    mui(P(0, -16), P(Wd, -16)), num(P(Wd / 2, -26), '90 m', 0, 0, 22),
    mui(P(16, 0), P(16, R)), num(P(54, R * 0.55), '30 m', 0, 0, 22),
  ], { padDuoi: 44 })
}
// ── Bài 5 · hình vuông + tam giác vuông ──
{
  const k = 17                     // px / cm
  const canh = 2 * 51.6 / 8.6      // cạnh hình vuông = chiều cao tam giác = 12 cm
  ok('cạnh hình vuông = 12 cm (từ diện tích 51,6 và đáy 8,6)', Math.abs(canh - 12) < 1e-9)
  ok('diện tích tam giác = 51,6 cm²', Math.abs(0.5 * 8.6 * canh - 51.6) < 1e-9)
  const s = canh * k, d = 8.6 * k
  const A = P(0, 0), B = P(s, 0), E = P(s, s), Dd = P(0, s), C = P(s + d, s)
  const yMui = s + 20
  hinh("T105000000124", [A, B, C, Dd, P(s + d / 2, yMui + 40)], [
    seg(A, B), seg(B, E), seg(E, Dd), seg(Dd, A), seg(B, C), seg(E, C),
    mui(P(s, yMui), P(s + d, yMui)), num(P(s + d / 2, yMui + 32), '8,6 cm', 0, 0, 22),
    num(P(s + 64, s - 20), '51,6 cm²', 0, 0, 20),
  ], { padDuoi: 40 })
}
await xuatTat(dir)
