// Đưa bộ ảnh CẢNH "Phòng học" của Trang chính ERP vào public/bk-ui/erp/canh/<id>/ (app đọc manifest.json + ảnh theo toạ độ).
// Nguồn (ChatGPT giao 14/10, nằm NGOÀI luồng build):
//   ke-hoc-thuat ← design/bk-ui-src/AppHS/bk-erp-home-ke-hoc-thuat-original-v3/ke-hoc-thuat   (theo ảnh chốt: 8 yêu thích · 6 nhóm)
//   pegboard     ← design/bk-ui-src/AppHS/bk-erp-home-production-v2/pegboard                    (8 yêu thích · 4 nhóm)
//   lang-bk      ← design/bk-ui-src/AppHS/bk-erp-home-production-v2/lang-bk                     (8 yêu thích · 4 nhóm)
// Chạy: node scripts/erp-canh-hinh.mjs   — chỉ chép file cần cho app (bỏ preview-*, responsive-*, qa, ocr…). Kiểm trước:
//       node scripts/check-style-erp.mjs [--toi-da-nhom=6] <thư-mục-nguồn>
import fs from 'node:fs'
import path from 'node:path'

const GOC = 'design/bk-ui-src/AppHS'
const OUT = 'public/bk-ui/erp/canh'
const CANH = [
  ['ke-hoc-thuat', `${GOC}/bk-erp-home-ke-hoc-thuat-original-v3/ke-hoc-thuat`],
  ['pegboard', `${GOC}/bk-erp-home-production-v2/pegboard`],
  ['lang-bk', `${GOC}/bk-erp-home-production-v2/lang-bk`],
]
const FILE_RIENG = ['manifest.json', 'library-assets.json', 'background.jpg', 'background-4x3.jpg']
const THU_MUC = ['objects', 'characters', 'library']

let tong = 0
const chep = (a, b) => { fs.mkdirSync(path.dirname(b), { recursive: true }); fs.copyFileSync(a, b); tong += fs.statSync(b).size }
for (const [id, nguon] of CANH) {
  if (!fs.existsSync(nguon)) { console.error('Thiếu nguồn: ' + nguon); process.exit(1) }
  for (const f of FILE_RIENG) if (fs.existsSync(`${nguon}/${f}`)) chep(`${nguon}/${f}`, `${OUT}/${id}/${f}`)
  for (const d of THU_MUC) {
    if (!fs.existsSync(`${nguon}/${d}`)) continue
    for (const f of fs.readdirSync(`${nguon}/${d}`)) if (/\.(png|jpg|webp)$/i.test(f)) chep(`${nguon}/${d}/${f}`, `${OUT}/${id}/${d}/${f}`)
  }
  console.log('✔', id)
}
console.log('tổng', (tong / 1024 / 1024).toFixed(1) + ' MB')
