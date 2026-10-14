// Nén 3 hình nền "phòng học" của Trang chính ERP (ChatGPT làm, bộ bk-erp-home-objects-v1) → public/bk-ui/erp/nen/*.jpg
// Chạy: node scripts/erp-nen-hinh.mjs   (ảnh gốc ở design/bk-ui-src/AppHS/bk-erp-home-objects-v1/<hướng>/background.png)
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'

const SRC = process.env.ERP_NEN_SRC ?? 'design/bk-ui-src/AppHS/bk-erp-home-objects-v1'
const OUT = 'public/bk-ui/erp/nen'
fs.mkdirSync(OUT, { recursive: true })
const DS = [['01-ke-hoc-thuat', 'ke_hoc_thuat'], ['02-pegboard', 'pegboard'], ['03-lang-bk', 'lang_bk']]
let tong = 0
for (const [thuMuc, ten] of DS) {
  const src = `${SRC}/${thuMuc}/background.png`
  if (!fs.existsSync(src)) { console.error('Thiếu ' + src); process.exit(1) }
  const im = await loadImage(src)
  const W = Math.min(im.width, 1920), H = Math.round((im.height * W) / im.width)
  const c = createCanvas(W, H), x = c.getContext('2d')
  x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, W, H)
  const buf = await c.encode('jpeg', 82)
  fs.writeFileSync(`${OUT}/${ten}.jpg`, buf); tong += buf.length
  console.log(ten, `${W}x${H}`, Math.round(buf.length / 1024) + ' KB')
}
console.log('tổng', Math.round(tong / 1024) + ' KB')
