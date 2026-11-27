// k5-HK1-CK10 — Đề kiểm tra Toán 5 HK1, cuối kì số 10 (sách Qbooks, tr. 45–47)
import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { P, seg, circle, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const OUT = process.argv[2]
if (!OUT) throw new Error('thiếu <OUT>')
const ok = (c, m) => { if (!c) throw new Error('SAI: ' + m) }

// T105000000294: hình vuông, nửa đường tròn tâm O (trung điểm cạnh trái) đường kính = cạnh vuông.
// Phần màu vàng = nửa hình tròn nằm TRONG hình vuông (tô xám).
const S = 240, R = S / 2
const A = P(0, 0), B = P(S, 0), C = P(S, S), D = P(0, S), O = P(0, R)
ok(dist(O, A) === R && dist(O, D) === R, 'đường kính = cạnh hình vuông')
const body = [
  `<path d="M ${A.x} ${A.y} A ${R} ${R} 0 0 1 ${D.x} ${D.y} Z" fill="#d9dde3" stroke="none"/>`,
  seg(A, B), seg(B, C), seg(C, D), seg(D, A),
  circle(O, R),
]
hinh('T105000000294', [P(-R, 0), B, C], body, { pad: 24, padDuoi: 24 })
await xuatTat(OUT)
const par = path.dirname(OUT)
mkdirSync(par, { recursive: true })
writeFileSync(path.join(par, 'bao-cao.json'), JSON.stringify([
  { ma_cau: 'T105000000294', tep: 'T105000000294.png', nguon: 've_lenh', trang_pdf: 45, ghi_chu: 'Hình vuông + đường tròn tâm O = trung điểm cạnh trái, đường kính = cạnh; nửa hình tròn trong hình vuông (màu vàng) tô xám, không nhãn như sách.' },
], null, 1))
writeFileSync(path.join(par, 'khong-ve.json'), JSON.stringify([
  { ma_cau: 'T105000000302', ly_do: 'Sách không có hình tam giác ABC (đề chữ, chỉ có hình trang trí).' },
  { ma_cau: 'T105000000293', ly_do: 'Hình 3 lọ ớt chỉ là trang trí.' },
], null, 1))
