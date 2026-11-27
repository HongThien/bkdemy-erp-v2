// k5-HK1-CK14 — Đề kiểm tra Toán 5 HK1, cuối kì số 14 (sách Qbooks, tr. 57–59)
import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { P, circle, num, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const OUT = process.argv[2]
if (!OUT) throw new Error('thiếu <OUT>')
const ok = (c, m) => { if (!c) throw new Error('SAI: ' + m) }

// ── T105000000503: ( 4/5 × ?/? ) : 14/15 = 3/2 (hai ô ? là ô trống) ──
const FS = 26
const frac = (cx, cy, n, d, box = false, w = 22) => {
  let s = `<line x1="${cx - w}" y1="${cy}" x2="${cx + w}" y2="${cy}"/>`
  if (box) {
    s += `<rect x="${cx - 17}" y="${cy - 38}" width="34" height="32"/><rect x="${cx - 17}" y="${cy + 6}" width="34" height="32"/>`
    s += num(P(cx, cy - 14), n, 0, 0, FS) + num(P(cx, cy + 30), d, 0, 0, FS)
  } else {
    s += num(P(cx, cy - 9), n, 0, 0, FS) + num(P(cx, cy + 27), d, 0, 0, FS)
  }
  return s
}
const paren = (x, cy, left) => {
  const s = left ? 1 : -1
  return `<path d="M ${x + 8 * s} ${cy - 44} Q ${x - 6 * s} ${cy} ${x + 8 * s} ${cy + 44}"/>`
}
const cy = 50
let b = ''
b += paren(14, cy, true)
b += frac(52, cy, '4', '5')
b += num(P(96, cy + 9), '×', 0, 0, FS)
b += frac(142, cy, '?', '?', true)
b += paren(182, cy, false)
b += num(P(210, cy + 9), ':', 0, 0, FS)
b += frac(256, cy, '14', '15', false, 26)
b += num(P(306, cy + 9), '=', 0, 0, FS)
b += frac(348, cy, '3', '2')
hinh('T105000000503', [P(0, 0), P(380, 100)], b, { pad: 14, padDuoi: 14 })

// ── T105000000505: biển báo tròn đường kính 70 cm, chính giữa hình chữ nhật trắng 50 × 10 cm (k = 2 px/cm) ──
const k = 2, R = 35 * k, rw = 50 * k, rh = 10 * k
ok(R * 2 === 140 && rw === 100 && rh === 20, 'd = 70, chữ nhật 50 × 10')
const O = P(0, 0)
const b2 = [
  `<circle cx="0" cy="0" r="${R}" fill="#d9dde3" stroke="none"/>`,
  `<rect x="${-rw / 2}" y="${-rh / 2}" width="${rw}" height="${rh}" fill="#fff"/>`,
  circle(O, R),
]
hinh('T105000000505', [P(-R, -R), P(R, R)], b2, { pad: 30, padDuoi: 30 })

await xuatTat(OUT)
const par = path.dirname(OUT)
mkdirSync(par, { recursive: true })
writeFileSync(path.join(par, 'bao-cao.json'), JSON.stringify([
  { ma_cau: 'T105000000503', tep: 'T105000000503.png', nguon: 've_lenh', trang_pdf: 57, ghi_chu: 'Biểu thức (4/5 × ?/?) : 14/15 = 3/2, hai ô ? là ô trống như sách (sách để nền hồng, bỏ nền).' },
  { ma_cau: 'T105000000505', tep: 'T105000000505.png', nguon: 've_lenh', trang_pdf: 57, ghi_chu: 'Biển báo tròn d=70, chữ nhật trắng 50x10 chính giữa (đúng tỉ lệ); phần đỏ tô xám, chữ nhật trắng. Không ghi số đo như sách.' },
], null, 1))
writeFileSync(path.join(par, 'khong-ve.json'), JSON.stringify([], null, 1))
