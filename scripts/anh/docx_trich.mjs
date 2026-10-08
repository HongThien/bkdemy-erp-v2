// docx_trich.mjs — TRÍCH file Word bài giảng/bài tập Toán → văn bản có đánh dấu hình + PNG đọc được. Bước 1 của "luồng kho kiểu 1".
//
//   node scripts/anh/docx_trich.mjs "<file.docx>" <thu_muc_ra>
//
// Ra:  <ra>/van_ban.md   mỗi đoạn 1 dòng, hình/công thức đánh dấu NGAY CHỖ xuất hiện:  ⟦image10.wmf⟧
//      <ra>/png/imageN.png|jpeg   WMF/EMF đã đổi PNG (scale 4, nền trắng) + hình jpeg/png gốc → Read tool xem được
// Vì sao phải làm vậy: công thức trong Word là ảnh WMF (text extract mất sạch: "a) ;"), và phải đọc ĐÚNG THỨ TỰ để ghép lại đề.
// Cách đọc ⟦…⟧: ảnh đứng sau "a)" là công thức của ý a); ảnh jpeg lớn = hình vẽ (hay NỔI LỆCH CHỖ so với câu — đối chiếu nội dung hình
// với đề trước khi gắn); WMF mất dấu mũ góc (đọc "ABH = ACH" có thể là góc) → suy từ ngữ cảnh + phần "Hướng dẫn giải".
import JSZip from 'jszip'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { basename, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const [file, ra] = process.argv.slice(2)
if (!file || !ra) { console.error('Dùng: node scripts/anh/docx_trich.mjs "<file.docx>" <thu_muc_ra>'); process.exit(2) }

const zip = await JSZip.loadAsync(readFileSync(file))
const xml = await zip.file('word/document.xml').async('string')
const rels = await zip.file('word/_rels/document.xml.rels').async('string')

const dMedia = join(ra, 'media'), dPng = join(ra, 'png')
mkdirSync(dMedia, { recursive: true })
for (const n of Object.keys(zip.files)) {
  if (n.startsWith('word/media/') && !zip.files[n].dir) writeFileSync(join(dMedia, basename(n)), await zip.file(n).async('nodebuffer'))
}

const anh = {}   // rId → tên file media
for (const m of rels.matchAll(/<Relationship\b[^>]*>/g)) {
  const id = m[0].match(/Id="([^"]+)"/)?.[1], tg = m[0].match(/Target="([^"]+)"/)?.[1]
  if (id && tg && /^media\//.test(tg)) anh[id] = basename(tg)
}

const un = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&')
const dong = []
let nHinh = 0
for (const p of xml.split(/<w:p[ >]/).slice(1)) {
  let s = ''
  // một lượt qua đoạn, GIỮ THỨ TỰ: chữ (w:t, m:t) · tab · ảnh nhúng (r:embed / r:id trỏ vào media)
  for (const m of p.matchAll(/<(?:w|m):t(?:\s[^>]*)?>([^<]*)<\/(?:w|m):t>|<w:tab\/>|(?:r:embed|r:id)="(rId\d+)"/g)) {
    if (m[1] !== undefined) s += un(m[1])
    else if (m[2]) { if (anh[m[2]]) { s += `⟦${anh[m[2]]}⟧`; nHinh++ } }
    else s += ' '
  }
  s = s.replace(/[ \t]+/g, ' ').trim()
  if (s) dong.push(s)
}
writeFileSync(join(ra, 'van_ban.md'), dong.join('\n') + '\n')

const ps1 = join(dirname(fileURLToPath(import.meta.url)), 'wmf_sang_png.ps1')
// Máy có thể chặn chạy file .ps1 (ExecutionPolicy) → nạp NỘI DUNG qua -Command, không đổi cài đặt hệ thống
const lenh = `& ([scriptblock]::Create([IO.File]::ReadAllText('${ps1.replace(/'/g, "''")}'))) -In '${dMedia.replace(/'/g, "''")}' -Out '${dPng.replace(/'/g, "''")}' -Scale 4`
const kq = execFileSync('powershell', ['-NoProfile', '-Command', lenh], { encoding: 'utf8' })
console.log(`${basename(file)}: ${dong.length} dòng · ${nHinh} chỗ có hình · ${kq.trim()}`)
console.log(`→ ${join(ra, 'van_ban.md')}  ·  ảnh: ${dPng}`)
