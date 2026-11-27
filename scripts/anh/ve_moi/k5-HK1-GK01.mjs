// k5-HK1-GK01.mjs — Toán 5 HK1, Giữa kì 1: Câu 4 (T105000000171) hình chữ nhật chia bằng 1 đường chéo + 1 đoạn từ góc phải-trên tới điểm trên đường chéo (đếm góc nhọn).
//   node scripts/anh/ve_moi/k5-HK1-GK01.mjs "<OUT>"
import { P, seg, hinh, xuatTat } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5-HK1-GK01.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const col = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) < 1e-6
const dotv = (o, a, b) => (a.x - o.x) * (b.x - o.x) + (a.y - o.y) * (b.y - o.y)
{
  const W = 330, H = 167
  const TL = P(0, 0), TR = P(W, 0), BR = P(W, H), BL = P(0, H)
  const t = 0.658
  const D = P(W * t, H * t)
  ok('tỉ lệ chữ nhật ≈ 2:1 như sách (351:177)', Math.abs(W / H - 351 / 177) < 0.02)
  ok('D nằm trên đường chéo TL–BR', col(TL, BR, D))
  ok('D nằm giữa TL và BR', D.x > TL.x && D.x < BR.x)
  ok('TR–D không vuông góc đường chéo (như sách)', Math.abs(dotv(D, TR, TL)) > 1)
  hinh('T105000000171', [TL, TR, BR, BL], [seg(TL, TR), seg(TR, BR), seg(BR, BL), seg(BL, TL), seg(TL, BR), seg(TR, D)])
}
await xuatTat(dir)
