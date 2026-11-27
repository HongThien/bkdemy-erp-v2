// k5-HK1-CK13 — Đề kiểm tra Toán 5 HK1, cuối kì số 13 (sách Qbooks, tr. 54–56)
import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { P, circle, label, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const OUT = process.argv[2]
if (!OUT) throw new Error('thiếu <OUT>')
const ok = (c, m) => { if (!c) throw new Error('SAI: ' + m) }

// T105000000491: hai hình tròn cùng tâm O, bán kính 6,5 cm và 4,5 cm (k = 20 px/cm). Hình vành khăn (màu vàng) tô xám.
const k = 20, R = 6.5 * k, r = 4.5 * k
ok(R === 130 && r === 90, 'tỉ lệ 6,5 : 4,5')
const O = P(0, 0)
const body = [
  `<path d="M ${-R} 0 A ${R} ${R} 0 1 0 ${R} 0 A ${R} ${R} 0 1 0 ${-R} 0 Z M ${-r} 0 A ${r} ${r} 0 1 0 ${r} 0 A ${r} ${r} 0 1 0 ${-r} 0 Z" fill="#d9dde3" fill-rule="evenodd" stroke="none"/>`,
  circle(O, R), circle(O, r),
  `<circle cx="0" cy="0" r="4.5" fill="#222" stroke="none"/>`,
  label(O, 'O', -2, 28),
]
hinh('T105000000491', [P(-R, -R), P(R, R)], body, { pad: 30, padDuoi: 30 })
await xuatTat(OUT)
const par = path.dirname(OUT)
mkdirSync(par, { recursive: true })
writeFileSync(path.join(par, 'bao-cao.json'), JSON.stringify([
  { ma_cau: 'T105000000491', tep: 'T105000000491.png', nguon: 've_lenh', trang_pdf: 54, ghi_chu: 'Hai đường tròn đồng tâm O, bán kính tỉ lệ 6,5:4,5; vành khăn tô xám (màu vàng trong sách); chấm O và nhãn O như sách; không ghi số đo.' },
], null, 1))
writeFileSync(path.join(par, 'khong-ve.json'), JSON.stringify([
  { ma_cau: 'T105000000498', ly_do: 'Sách chỉ có ảnh hồ minh hoạ (phong cảnh), không có hình mang dữ kiện.' },
], null, 1))
