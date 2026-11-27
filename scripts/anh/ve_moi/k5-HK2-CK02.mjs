// k5-HK2-CK02.mjs — Toán 5 HK2 · Cuối kì 2 · Bài 4 (T105000000245): biểu đồ quạt cỡ giày của 50 đôi (Cỡ 36/37/38/39).
//   node scripts/anh/ve_moi/k5-HK2-CK02.mjs <thu_muc_ra>      (ra T105000000245.png)
// Biểu đồ quạt tròn vẽ theo % thật (xuất phát 12 giờ, chiều kim đồng hồ, đúng thứ tự trong sách). Không ghi đáp án.
import { svgDoc, luu } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/k5-HK2-CK02.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }

// thứ tự các nan từ 12 giờ theo chiều kim đồng hồ
const SLICES = [{ c: '#f79a3e', p: 24 }, { c: '#e8433f', p: 32 }, { c: '#2f9a63', p: 28 }, { c: '#ffe81a', p: 16 }]
// chú thích theo thứ tự trong sách (trên xuống)
const LEG = [{ c: '#ffe81a', t: 'Cỡ 36' }, { c: '#f79a3e', t: 'Cỡ 37' }, { c: '#e8433f', t: 'Cỡ 38' }, { c: '#2f9a63', t: 'Cỡ 39' }]
const sum = SLICES.reduce((a, s) => a + s.p, 0)
ok('tổng các % = 100', sum === 100)

const R = 105, cx = 20 + R, cy = 20 + R
const pt = (deg, r) => [cx + r * Math.sin(deg * Math.PI / 180), cy - r * Math.cos(deg * Math.PI / 180)]
let body = '', a0 = 0
for (const s of SLICES) {
  const a1 = a0 + s.p * 3.6
  const [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R)
  body += `<path d="M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z" fill="${s.c}" stroke="#222" stroke-width="1.6" stroke-linejoin="round"/>`
  const [tx, ty] = pt((a0 + a1) / 2, s.p <= 6 ? R * 0.76 : R * 0.62)
  body += `<text x="${tx.toFixed(1)}" y="${(ty + 7).toFixed(1)}" text-anchor="middle" fill="#222" stroke="none" font-family="'Times New Roman',Times,serif" font-weight="700" font-size="${s.p <= 6 ? 13 : 21}">${s.p}%</text>`
  a0 = a1
}
ok('các góc cộng lại = 360°', Math.abs(a0 - 360) < 1e-9)
const lx = 2 * R + 20 + 34
LEG.forEach((l, i) => {
  const y = cy - 1.5 * 40 + i * 40 - 14
  body += `<rect x="${lx}" y="${y}" width="28" height="28" rx="5" fill="${l.c}" stroke="#222" stroke-width="1.6"/>`
  body += `<text x="${lx + 38}" y="${y + 21}" fill="#111" stroke="none" font-family="'Times New Roman',Times,serif" font-size="22">${l.t}</text>`
})
const w = 400, h = 2 * R + 40
console.log(`${w}×${h}`)
ok('khung ≤ 560×450', w <= 560 && h <= 450)
await luu(dir, 'T105000000245', w, h, svgDoc(w, h, body))
