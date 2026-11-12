// Cắt hình từ sách scan: dựng trang PDF thành PNG rồi cắt theo khung.
//   node kho-rules/vatly/k12/cong-cu/cat-anh.mjs trang <tap 1|2> <trang_pdf>            → hinh-lt/trang/t<tap>-p<trang>.png (200 dpi), in kích thước
//   node kho-rules/vatly/k12/cong-cu/cat-anh.mjs cat <tap> <trang_pdf> <x0> <y0> <x1> <y1> <ten>
//        (x,y = PHÂN SỐ 0..1 theo bề ngang/bề cao trang) → hinh-lt/anh/<ten>.png (nền trắng, giữ nguyên độ phân giải)
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { createCanvas, loadImage } from '@napi-rs/canvas'
const D = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..', 'hinh-lt')
const SACH = {
  1: 'E:/BK ACADEMY/Vật Lý/VL12/841497160-EBOOK-NẮM-TRỌN-KIẾN-THỨC-MON-VẬT-LI-12-SGK-MỚI-TẬP-1-VẬT-LI-NHIỆT-VA-KHI-LI-TƯỞNG-THẦY-ĐỖ-NGỌC-HA-2 (1).pdf',
  2: 'E:/BK ACADEMY/Vật Lý/VL12/Nắm Trọn Kiến Thức Môn Vật Lý 12 2026 - Tập 2 Từ Trường Và Vật Lý Hạt Nhân (Thầy Đỗ Ngọc Hà).pdf',
}
const [lenh, tap, trang, ...r] = process.argv.slice(2)
const dirT = path.join(D, 'trang'); fs.mkdirSync(dirT, { recursive: true }); fs.mkdirSync(path.join(D, 'anh'), { recursive: true })
const fileT = path.join(dirT, `t${tap}-p${trang}.png`)
if (!fs.existsSync(fileT)) {
  const goc = path.join(dirT, `t${tap}-p${trang}`)
  execFileSync('pdftoppm', ['-r', '200', '-f', trang, '-l', trang, '-png', '-singlefile', SACH[tap], goc])
}
const img = await loadImage(fs.readFileSync(fileT))
if (lenh === 'trang') { console.log(fileT, img.width + 'x' + img.height); process.exit(0) }
if (lenh !== 'cat') throw new Error('lệnh: trang | cat')
const [x0, y0, x1, y1] = r.slice(0, 4).map(Number); const ten = r[4]
if (!(x1 > x0 && y1 > y0) || !ten) throw new Error('khung/ tên sai')
const X0 = Math.round(x0 * img.width), Y0 = Math.round(y0 * img.height), W = Math.round((x1 - x0) * img.width), H = Math.round((y1 - y0) * img.height)
const cv = createCanvas(W, H); const g = cv.getContext('2d')
g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.drawImage(img, X0, Y0, W, H, 0, 0, W, H)
const out = path.join(D, 'anh', ten + '.png'); fs.writeFileSync(out, cv.toBuffer('image/png'))
console.log('✔', out, W + 'x' + H)
