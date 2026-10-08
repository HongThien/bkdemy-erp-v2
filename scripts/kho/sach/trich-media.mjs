// ============================================================================
// trich-media.mjs — CHÉP ảnh gốc (word/media/<tên>) ra khỏi file Word, đúng tên — đầu vào của kho-rules/dai/hinh-de/dung-hinh-de.ps1.
//
//   node scripts/kho/sach/trich-media.mjs <file.docx> <thư mục ra> [<image25.png> <image109.emf> …]   (không nêu tên ⇒ chép hết)
//
// Tên ảnh lấy từ `anh` của tach-bai.mjs (bài có hình trong đề). Không đổi định dạng ở đây — EMF/WMF đổi PNG ở dung-hinh-de.ps1.
// ============================================================================
import JSZip from 'jszip'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, basename } from 'node:path'

const [docx, ra, ...ten] = process.argv.slice(2)
if (!docx || !ra) { console.error('Dùng: node scripts/kho/sach/trich-media.mjs <file.docx> <thư mục ra> [tên ảnh…]'); process.exit(2) }
mkdirSync(ra, { recursive: true })
const zip = await JSZip.loadAsync(readFileSync(docx))
const ds = ten.length ? ten : Object.keys(zip.files).filter((n) => n.startsWith('word/media/') && !zip.files[n].dir).map((n) => basename(n))
const thieu = []
for (const t of ds) { const f = zip.file('word/media/' + t); if (!f) { thieu.push(t); continue } writeFileSync(join(ra, t), await f.async('nodebuffer')) }
console.log(`✔ chép ${ds.length - thieu.length} ảnh → ${ra}`)
if (thieu.length) { console.error(`✘ không có trong file Word: ${thieu.join(', ')}`); process.exit(1) }
