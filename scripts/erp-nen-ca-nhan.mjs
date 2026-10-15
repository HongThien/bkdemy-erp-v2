// Nén ảnh nền RIÊNG từng nhân sự (design/bk-ui-src/erp-ca-nhan/NS###_*.png) → public/bk-ui/erp/nen/ca-nhan/ns###.jpg
// Chạy: node scripts/erp-nen-ca-nhan.mjs   — quét cả thư mục, in ra dòng khai báo để dán vào NEN_ERP (src/lib/erpSkin.ts).
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'

const SRC = process.env.ERP_CA_NHAN_SRC ?? 'design/bk-ui-src/erp-ca-nhan'
const OUT = 'public/bk-ui/erp/nen/ca-nhan'
fs.mkdirSync(OUT, { recursive: true })
for (const f of fs.readdirSync(SRC).sort()) {
  const m = /^(NS\d+)_(.+)\.(png|jpe?g|webp)$/i.exec(f)
  if (!m) { if (!f.startsWith('.')) console.warn('Bỏ qua (tên không dạng NS###_ten.png):', f); continue }
  const ma = m[1].toUpperCase()
  const im = await loadImage(`${SRC}/${f}`)
  const W = Math.min(im.width, 1920), H = Math.round((im.height * W) / im.width)
  const c = createCanvas(W, H), x = c.getContext('2d')
  x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, W, H)
  const buf = await c.encode('jpeg', 82)
  const ten = ma.toLowerCase()
  fs.writeFileSync(`${OUT}/${ten}.jpg`, buf)
  console.log(`${f} → ${ten}.jpg ${W}x${H} ${Math.round(buf.length / 1024)} KB`)
}
