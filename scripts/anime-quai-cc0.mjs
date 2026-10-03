// Nén 7 quái CC0 tạm (design/bk-ui-src/AppHS/quai-cc0-sethbyrd/*.png) → public/bk-ui/hs/quai2d/<id>.webp (cao ≤ 360px, cắt sát alpha>20, WebP q85).
// Thùy 03/10: "research kiếm tạm 5–7 con, sau này t design boss riêng". Chạy: node scripts/anime-quai-cc0.mjs
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'
const SRC = 'design/bk-ui-src/AppHS/quai-cc0-sethbyrd', OUT = 'public/bk-ui/hs/quai2d', CAO = 360
fs.mkdirSync(OUT, { recursive: true })
for (const f of fs.readdirSync(SRC).filter((x) => x.endsWith('.png'))) {
  const im = await loadImage(`${SRC}/${f}`)
  const c0 = createCanvas(im.width, im.height), x0 = c0.getContext('2d'); x0.drawImage(im, 0, 0)
  const d = x0.getImageData(0, 0, im.width, im.height).data
  let l = im.width, t = im.height, r = 0, b = 0
  for (let y = 0; y < im.height; y++) for (let x = 0; x < im.width; x++) if (d[(y * im.width + x) * 4 + 3] > 20) { if (x < l) l = x; if (x > r) r = x; if (y < t) t = y; if (y > b) b = y }
  const w = r - l + 1, h = b - t + 1, k = Math.min(1, CAO / h)
  const c = createCanvas(Math.round(w * k), Math.round(h * k)), x = c.getContext('2d')
  x.drawImage(im, l, t, w, h, 0, 0, c.width, c.height)
  const buf = c.toBuffer('image/webp', 85)
  fs.writeFileSync(`${OUT}/${f.replace('.png', '.webp')}`, buf)
  console.log(f, `${c.width}x${c.height}`, Math.round(buf.length / 1024) + 'KB')
}
