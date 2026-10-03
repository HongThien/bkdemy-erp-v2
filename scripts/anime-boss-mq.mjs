// Nén boss Minh Quân (design/bk-ui-src/AppHS/Animation/minh-quan-boss/assets — 44 PNG RGBA, khung 768×640 neo (384,580); laser 2048×640 neo (450,580))
// → public/bk-ui/hs/skin/rpg/boss/mq/<tên>.webp (giữ NGUYÊN khung để các ảnh chung neo chân; q95). chandung = nửa thân trên dùng cho khung hội thoại (cạnh 512).
// Chạy: node scripts/anime-boss-mq.mjs
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'
const SRC = 'design/bk-ui-src/AppHS/Animation/minh-quan-boss/assets', OUT = 'public/bk-ui/hs/skin/rpg/boss/mq'
fs.mkdirSync(OUT, { recursive: true })
let tong = 0
for (const f of fs.readdirSync(SRC).filter((x) => x.endsWith('.png'))) {
  const im = await loadImage(`${SRC}/${f}`)
  const chan = f === 'dialogue_upper.png', k = chan ? 512 / Math.max(im.width, im.height) : f === 'missile_projectile.png' ? 1 : Math.min(1, 1 / 1)
  const c = createCanvas(Math.round(im.width * k), Math.round(im.height * k)), g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(im, 0, 0, c.width, c.height)
  const buf = c.toBuffer('image/webp', 95); tong += buf.length
  fs.writeFileSync(`${OUT}/${f.replace('.png', '.webp')}`, buf)
}
console.log('xong', Math.round(tong / 1024) + 'KB')
