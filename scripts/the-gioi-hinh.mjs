// Nén hình icon thả cảm xúc + sticker bình luận Thế giới BK (Đơn 7: design/DON-HANG-THE-GIOI-EMOJI-2.md) — ảnh gốc ChatGPT 1254px
// (tên mặc định tiếng Việt, ngoài git) → WebP nền trong suốt vào public/bk-ui/hs/gami/the-gioi/{tuong-tac,sticker}/<mã>.webp.
// Bảng "tên file gốc → mã DB" ở scripts/the-gioi-hinh-map.json (mỗi mã chọn 1 bản trong các bản ChatGPT vẽ trùng).
//
//   THEGIOI_SRC="C:/.../design/bk-ui-src" NM_DIR="C:/.../node_modules" node scripts/the-gioi-hinh.mjs
//   (NM_DIR: thư mục node_modules có @napi-rs/canvas — worktree mới chưa npm install thì trỏ sang clone gốc.)
// Sau khi chạy: thêm mã vào TUONG_TAC_CO_ANH / STICKER_CO_ANH ở src/screens/hocsinh/gami/hinh.ts (script in sẵn danh sách).
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const goc = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = process.env.THEGIOI_SRC ?? path.join(goc, 'design', 'bk-ui-src')
const NM = process.env.NM_DIR ?? path.join(goc, 'node_modules')
const { loadImage, createCanvas } = createRequire(path.join(NM, 'x.js'))('@napi-rs/canvas')

const map = JSON.parse(fs.readFileSync(path.join(goc, 'scripts', 'the-gioi-hinh-map.json'), 'utf8'))
const OUT = path.join(goc, 'public', 'bk-ui', 'hs', 'gami', 'the-gioi')
const BO = [
  { khoa: 'icon', thu_muc: 'tuong-tac', px: 192 },   // hiển thị ≤ 40px (dải cảm xúc 3× retina) — 192 dư cho bảng "ai đã thả"
  { khoa: 'sticker', thu_muc: 'sticker', px: 256 },   // hiển thị 52–72px
]

let loi = 0
for (const b of BO) {
  fs.mkdirSync(path.join(OUT, b.thu_muc), { recursive: true })
  const ds = []
  let byte = 0
  for (const [ma, ten] of Object.entries(map[b.khoa])) {
    const f = path.join(SRC, ten)
    if (!fs.existsSync(f)) { console.error('❌ thiếu', ma, '←', ten); loi++; continue }
    const img = await loadImage(f)
    const c = createCanvas(b.px, b.px)
    c.getContext('2d').drawImage(img, 0, 0, b.px, b.px)
    const buf = await c.encode('webp', 88)
    fs.writeFileSync(path.join(OUT, b.thu_muc, `${ma}.webp`), buf)
    byte += buf.length; ds.push(ma)
  }
  console.log(`${b.khoa}: ${ds.length} hình, ${(byte / 1024).toFixed(0)} KB — mã: ${ds.sort().join(' ')}`)
}
process.exit(loi ? 1 : 0)
