// k5-HK1-CK15 — Đề kiểm tra Toán 5 HK1, cuối kì số 15 (sách Qbooks, tr. 60–62)
import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { P, seg, circle, ray, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const OUT = process.argv[2]
if (!OUT) throw new Error('thiếu <OUT>')

// T105000000527: tấm bìa hình tròn cắt thành 8 miếng bằng nhau (8 hình quạt 45°). Sách không ghi số đo trên hình.
const R = 120, O = P(0, 0)
const body = [circle(O, R)]
for (let i = 0; i < 8; i++) body.push(seg(O, ray(O, i * 45, R)))
hinh('T105000000527', [P(-R, -R), P(R, R)], body, { pad: 30, padDuoi: 30 })
await xuatTat(OUT)
const par = path.dirname(OUT)
mkdirSync(par, { recursive: true })
writeFileSync(path.join(par, 'bao-cao.json'), JSON.stringify([
  { ma_cau: 'T105000000527', tep: 'T105000000527.png', nguon: 've_moi', trang_pdf: 62, ghi_chu: 'Hình tròn chia 8 hình quạt bằng nhau (4 đường kính, góc 45°); sách tô 8 màu (không tô) và không ghi số đo.' },
], null, 1))
writeFileSync(path.join(par, 'khong-ve.json'), JSON.stringify([
  { ma_cau: 'T105000000519', ly_do: 'Ảnh mảnh đất hình thang trong sách là ảnh chụp trang trí, không có số đo; dữ kiện nằm trong chữ.' },
], null, 1))
