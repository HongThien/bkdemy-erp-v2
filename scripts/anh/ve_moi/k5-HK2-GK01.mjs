// k5-HK2-GK01.mjs — Toán 5 HK2 · Giữa kì 1 · Câu 4 (T105000000423): 4 hình khai triển, hộp chữ nhật các mặt đối diện cùng màu.
//   node scripts/anh/ve_moi/k5-HK2-GK01.mjs <thu_muc_ra>      (ra T105000000423.png)
// Kích thước đo từ hình sách (trang 67 PDF). KHÔNG đánh dấu phương án đúng.
import { svgDoc, luu } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/k5-HK2-GK01.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }

const S = 0.62
const COL = { c: '#f0a23a', x: '#b3d36b', t: '#a98cc6' } // c = cam, x = xanh lá, t = tím
// đơn vị đo từ sách: hàng 4 mặt rộng [70,143,66,140], cao 77; hai mặt trên/dưới rộng 143 cao 83
const W = [70, 143, 66, 140], H = 77, F = 83
const NETS = {
  A: { hang: ['t', 'x', 'x', 't'], tren: 'c', duoi: 'c' },
  B: { hang: ['t', 'x', 't', 'x'], tren: 'c', duoi: 'c' },
  C: { hang: ['t', 'c', 'x', 'c'], tren: 'x', duoi: 't' },
  D: { hang: ['t', 'c', 't', 'x'], tren: 'x', duoi: 'c' },
}
const rect = (x, y, w, h, c) => `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${COL[c]}" stroke="#222" stroke-width="2"/>`

function net(ox, oy, n) {
  let s = ''
  const x1 = ox + W[0] * S
  s += rect(x1, oy, W[1] * S, F * S, n.tren)
  let x = ox
  n.hang.forEach((c, i) => { s += rect(x, oy + F * S, W[i] * S, H * S, c); x += W[i] * S })
  s += rect(x1, oy + (F + H) * S, W[1] * S, F * S, n.duoi)
  return s
}
const netW = W.reduce((a, b) => a + b, 0) * S, netH = (2 * F + H) * S
ok('mặt trên/dưới rộng bằng mặt thứ 2 của hàng', W[1] === 143)
ok('4 mặt hàng ngang cùng cao', true)

const padX = 30, gapX = 60, lab = 36, gapY = 14, top = 14
const w = Math.ceil(padX * 2 + netW * 2 + gapX), h = Math.ceil(top + (netH + lab + gapY) * 2)
let body = ''
const keys = ['A', 'B', 'C', 'D']
keys.forEach((k, i) => {
  const ox = padX + (i % 2) * (netW + gapX), oy = top + Math.floor(i / 2) * (netH + lab + gapY)
  body += net(ox, oy, NETS[k])
  body += `<text x="${(ox + netW / 2).toFixed(1)}" y="${(oy + netH + 27).toFixed(1)}" text-anchor="middle" fill="#111" stroke="none" font-family="'Times New Roman',Times,serif" font-weight="700" font-size="24">${k}</text>`
})
console.log(`${w}×${h}`)
ok('khung ≤ 760×450', w <= 760 && h <= 450)
await luu(dir, 'T105000000423', w, h, svgDoc(w, h, body))
