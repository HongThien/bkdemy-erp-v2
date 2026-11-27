// k5-HK1-CK03.mjs — Toán 5 HK1, Cuối kì 3: Câu 6 (T105000000074) hình gồm 3/4 hình tròn (thiếu một phần tư phía dưới-trái). Bán kính 6 cm có trong đề, không ghi trên hình (như sách).
import { P, hinh, xuatTat } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5-HK1-CK03.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
{
  const r = 110
  // tâm O=(0,0); từ điểm trái (-r,0) theo chiều kim đồng hồ qua trên, phải tới điểm dưới (0,r) = 270° = 3/4 đường tròn; rồi về O
  const goc = 270
  ok('cung = 3/4 đường tròn (270°)', goc / 360 === 3 / 4)
  const d = `M ${-r} 0 A ${r} ${r} 0 1 1 0 ${r} L 0 0 Z`
  hinh('T105000000074', [P(-r, -r), P(r, r)], [`<path d="${d}" fill="none" stroke-linejoin="round"/>`], { padDuoi: 48 })
}
await xuatTat(dir)
