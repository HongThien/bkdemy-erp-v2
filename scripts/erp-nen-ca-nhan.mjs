// Nén ảnh RIÊNG từng nhân sự trong design/bk-ui-src/erp-ca-nhan/ → public/bk-ui/erp/nen/ca-nhan/
//   NS###_ten.png          → ns###.jpg                (ẢNH NỀN, ≤1920 rộng, JPEG 82)
//   NS###_meo_than.png     → ns###_meo_than.webp      (TRANG TRÍ nền trong suốt: cắt sát viền, ≤600 rộng)
//   NS###_meo_duoi.png     → ns###_meo_duoi.webp      (đuôi mèo — cắt sát phần thấy được, gốc đuôi ở mép trên)
// Chạy: node scripts/erp-nen-ca-nhan.mjs   — quét cả thư mục. Quy ước: design/ERP-NEN-VA-THE-RIENG.md
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'

const SRC = process.env.ERP_CA_NHAN_SRC ?? 'design/bk-ui-src/erp-ca-nhan'
const OUT = 'public/bk-ui/erp/nen/ca-nhan'
fs.mkdirSync(OUT, { recursive: true })

// Hộp bao của phần có hình thật (alpha > 8) — bỏ viền trong suốt thừa.
function hopBao(x, W, H) {
  const d = x.getImageData(0, 0, W, H).data
  let x0 = W, y0 = H, x1 = -1, y1 = -1
  for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) if (d[(y * W + i) * 4 + 3] > 8) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y }
  return x1 < 0 ? [0, 0, W, H] : [x0, y0, x1 - x0 + 1, y1 - y0 + 1]
}

for (const f of fs.readdirSync(SRC).sort()) {
  const m = /^(NS\d+)_(.+)\.(png|jpe?g|webp)$/i.exec(f)
  if (!m) { if (!f.startsWith('.') && !f.startsWith('_')) console.warn('Bỏ qua (tên không dạng NS###_ten.png):', f); continue }
  const ten = m[1].toLowerCase()
  const im = await loadImage(`${SRC}/${f}`)

  if (/^meo_(than|duoi)$/i.test(m[2])) {
    const c0 = createCanvas(im.width, im.height), x0 = c0.getContext('2d'); x0.drawImage(im, 0, 0)
    const [bx, by, bw, bh] = hopBao(x0, im.width, im.height)
    const k = Math.min(1, 600 / Math.max(bw, bh))
    const W = Math.round(bw * k), H = Math.round(bh * k)
    const c = createCanvas(W, H), x = c.getContext('2d')
    x.imageSmoothingQuality = 'high'; x.drawImage(c0, bx, by, bw, bh, 0, 0, W, H)
    const buf = await c.encode('webp', 88)
    const ra = `${ten}_${m[2].toLowerCase()}.webp`
    fs.writeFileSync(`${OUT}/${ra}`, buf)
    console.log(`${f} → ${ra} ${W}x${H} (tỉ lệ ${(W / H).toFixed(3)}) ${Math.round(buf.length / 1024)} KB`)
    continue
  }

  const W = Math.min(im.width, 1920), H = Math.round((im.height * W) / im.width)
  const c = createCanvas(W, H), x = c.getContext('2d')
  x.imageSmoothingQuality = 'high'; x.drawImage(im, 0, 0, W, H)
  const buf = await c.encode('jpeg', 82)
  fs.writeFileSync(`${OUT}/${ten}.jpg`, buf)
  console.log(`${f} → ${ten}.jpg ${W}x${H} ${Math.round(buf.length / 1024)} KB`)
}
