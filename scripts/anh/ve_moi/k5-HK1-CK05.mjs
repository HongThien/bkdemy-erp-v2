// k5-HK1-CK05.mjs — Toán 5 HK1, Cuối kì 5: Bài 4 (T105000000108) hình tròn tâm O nội tiếp hình vuông (chu vi hình vuông 32 cm có trong đề, không ghi trên hình).
import { P, seg, dot, label, circle, hinh, xuatTat } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5-HK1-CK05.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
{
  const r = 110, O = P(0, 0)
  const a = P(-r, -r), b = P(r, -r), c = P(r, r), d = P(-r, r)
  ok('đường tròn tiếp xúc 4 cạnh hình vuông (bán kính = nửa cạnh)', 2 * r === c.x - d.x && 2 * r === d.y - a.y)
  hinh('T105000000108', [a, b, c, d], [seg(a, b), seg(b, c), seg(c, d), seg(d, a), circle(O, r), dot(O), label(O, 'O', 22, 30)], { padDuoi: 48 })
}
await xuatTat(dir)
