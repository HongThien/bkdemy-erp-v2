// k5-HK1-GK02.mjs — Toán 5 HK1, Giữa kì 2: Câu 3 (T105000000185) bốn hình A–D, tìm hình có hai cặp cạnh song song. Toạ độ đo từ hình sách.
import { P, seg, num, hinh, xuatTat } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5-HK1-GK02.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const s = 0.7
const Q = (x, y) => P(x * s, y * s)
const cr = (a, b, c, d) => (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)
const song = (a, b, c, d) => Math.abs(cr(a, b, c, d)) < 1e-6
const dai = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const poly = (p) => p.map((q, i) => seg(q, p[(i + 1) % p.length])).join('')
// A: hình thang (đáy nằm ngang, hai cạnh bên KHÔNG song song)
const A = [Q(57, 33), Q(140, 33), Q(185, 135), Q(40, 135)]
ok('A: hai đáy song song', song(A[0], A[1], A[3], A[2]))
ok('A: hai cạnh bên KHÔNG song song', !song(A[1], A[2], A[0], A[3]))
// B: hình thoi (không phải hình vuông: hai đường chéo khác nhau)
const cB = P(369, 92), hx = 63.5, hy = 52.5
const B = [Q(cB.x, cB.y - hy), Q(cB.x + hx, cB.y), Q(cB.x, cB.y + hy), Q(cB.x - hx, cB.y)]
ok('B: 4 cạnh bằng nhau (hình thoi)', [0, 1, 2, 3].every((i) => Math.abs(dai(B[i], B[(i + 1) % 4]) - dai(B[0], B[1])) < 1e-6))
ok('B: hai cặp cạnh song song', song(B[0], B[1], B[3], B[2]) && song(B[1], B[2], B[0], B[3]))
ok('B: không phải hình vuông', Math.abs(hx - hy) > 5)
// C: hình thang vuông đặt đứng — hai cạnh bên đứng song song, đáy trên nghiêng
const C = [Q(583, 48), Q(727, 27), Q(727, 135), Q(583, 135)]
ok('C: hai cạnh bên (đứng) song song', song(C[0], C[3], C[1], C[2]))
ok('C: cạnh trên và cạnh dưới KHÔNG song song', !song(C[0], C[1], C[3], C[2]))
// D: ngũ giác không có cặp cạnh song song
const D = [Q(888, 25), Q(993, 67), Q(990, 135), Q(868, 135), Q(846, 90)]
let cap = 0
for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) if (song(D[i], D[(i + 1) % 5], D[j], D[(j + 1) % 5])) cap++
ok('D: ngũ giác không có cặp cạnh song song', cap === 0)
const nhan = [['A', A], ['B', B], ['C', C], ['D', D]].map(([t, p]) => {
  const xs = p.map((q) => q.x)
  return num(P((Math.min(...xs) + Math.max(...xs)) / 2, 150 * s + 38), t, 0, 0, 26)
})
hinh('T105000000185', [Q(40, 20), Q(1000, 20), Q(40, 215)], [poly(A), poly(B), poly(C), poly(D), ...nhan], { pad: 30, padDuoi: 40 })
await xuatTat(dir)
