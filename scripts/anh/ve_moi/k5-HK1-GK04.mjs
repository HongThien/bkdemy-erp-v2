// k5-HK1-GK04.mjs — Toán 5 HK1, Giữa kì 4: Bài 4 (T105000000314) hai đường nằm ngang, một đường đứng, hai đường xiên song song
// (đếm cặp đường thẳng song song / vuông góc). Toạ độ đo từ hình sách; đường xiên 1 đi qua giao điểm của đường đứng và đường ngang trên.
import { P, seg, hinh, xuatTat } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5-HK1-GK04.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const k = 0.55
const Q = (x, y) => P(x * k, y * k)
const dirx = 283 / 530                       // dx/dy của hai đường xiên
const xAt = (x0, y0, y) => x0 + dirx * (y - y0)
const h1 = [Q(38, 252), Q(755, 252)], h2 = [Q(38, 484), Q(755, 484)]
const v = [Q(217, 45), Q(217, 578)]
const x1 = [Q(xAt(217, 252, 45), 45), Q(xAt(217, 252, 578), 578)]
const x2 = [Q(xAt(457, 252, 45), 45), Q(xAt(457, 252, 578), 578)]
const cr = (a, b, c, d) => (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)
ok('hai đường nằm ngang song song', Math.abs(cr(...h1, ...h2)) < 1e-9)
ok('hai đường xiên song song', Math.abs(cr(...x1, ...x2)) < 1e-6)
ok('đường đứng ⟂ đường ngang', Math.abs((v[1].x - v[0].x) * (h1[1].x - h1[0].x) + (v[1].y - v[0].y) * (h1[1].y - h1[0].y)) < 1e-9)
ok('đường xiên 1 qua giao điểm đường đứng – đường ngang trên (như sách)', Math.abs(x1[0].x + (x1[1].x - x1[0].x) * ((252 * k - x1[0].y) / (x1[1].y - x1[0].y)) - 217 * k) < 1e-6)
ok('đường xiên không ⟂ đường ngang', Math.abs(x1[1].x - x1[0].x) > 10)
hinh('T105000000314', [...h1, ...h2, ...v, ...x1, ...x2], [seg(...h1), seg(...h2), seg(...v), seg(...x1), seg(...x2)])
await xuatTat(dir)
