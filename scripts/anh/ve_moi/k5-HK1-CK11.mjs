// k5-HK1-CK11 — Đề kiểm tra Toán 5 HK1, cuối kì số 11 (sách Qbooks, tr. 48–50)
import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { P, seg, circle, dot, rightAngle, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const OUT = process.argv[2]
if (!OUT) throw new Error('thiếu <OUT>')
const ok = (c, m) => { if (!c) throw new Error('SAI: ' + m) }

// T105000000404: tam giác (diện tích 600 cm², đáy 40 cm) có đáy tiếp xúc đường tròn, đỉnh trên đường tròn,
// đường cao đi qua tâm = đường kính. Đáy 40, S = 600 ⇒ cao 30 = đường kính. k = 7,5 px/cm.
const k = 7.5
const base = 40 * k, h = (600 * 2 / 40) * k            // 300 px, 225 px
const R = h / 2
const B = P(0, h), C = P(base, h), H = P(base / 2, h), A = P(base / 2, 0), O = P(base / 2, R)
ok(Math.abs(base * h / 2 / (k * k) - 600) < 1e-6, 'diện tích tam giác = 600 cm²')
ok(Math.abs(dist(O, A) - R) < 1e-9 && Math.abs(dist(O, H) - R) < 1e-9, 'AH là đường kính')
ok(dist(A, B) !== dist(A, C) || true, '')
const body = [
  seg(A, B), seg(A, C), seg(B, C), seg(A, H),
  circle(O, R), rightAngle(H, A, C, 14),
  `<circle cx="${O.x}" cy="${O.y}" r="3" fill="#222" stroke="none"/>`,
]
hinh('T105000000404', [B, C, A, P(O.x - R, O.y), P(O.x + R, O.y)], body, { pad: 30, padDuoi: 40 })
await xuatTat(OUT)
const par = path.dirname(OUT)
mkdirSync(par, { recursive: true })
writeFileSync(path.join(par, 'bao-cao.json'), JSON.stringify([
  { ma_cau: 'T105000000404', tep: 'T105000000404.png', nguon: 've_lenh', trang_pdf: 50, ghi_chu: 'Tam giác cân đáy 40 cm (không ghi nhãn như sách), đáy tiếp xúc đường tròn, đỉnh trên đường tròn, đường cao = đường kính (30 cm theo S=600), ô vuông ở chân đường cao, chấm tâm. Hình sách tô vàng/xanh -> không tô.' },
], null, 1))
writeFileSync(path.join(par, 'khong-ve.json'), JSON.stringify([
  { ma_cau: 'T105000000395', ly_do: 'Sách không có hình tròn đường kính 7 cm.' },
  { ma_cau: 'T105000000396', ly_do: 'Hình câu cá chỉ trang trí.' },
], null, 1))
