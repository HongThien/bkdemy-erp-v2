// cat-luat.mjs — CẮT LUẬT cho một batch từ spec-giai-bai.md (luật duy nhất, Thùy 15/11). Brief giao trạm KHÔNG viết tay nữa.
//   node scripts/kho/cat-luat.mjs <khối> [--ra <thư mục>] [--dau <tệp đầu riêng của batch>]
//     <khối> = tên mục ở Phần B, vd 9 · 8T · 12  (khớp tiêu đề "## Khối <khối>")
//   Ra (mặc định in ra màn): <ra>/brief-soan.md + <ra>/brief-soat.md
//     = [đầu riêng của batch: danh sách đề, đường dẫn, điểm cần xét — KHÔNG chứa luật]  +  Phần A  +  mục khối ở Phần B  +  Phần C (trạm)
//   Dòng đầu mỗi brief: `luat: <mã>` — mã = 12 ký tự sha256 của (Phần A + mục khối + Phần C). Tệp soạn phải chép đúng dòng này (spec §C4).
//   node scripts/kho/cat-luat.mjs <khối> --ma        — chỉ in mã hiện hành (cổng dùng để so).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '../..')
const args = process.argv.slice(2)
const KHOI = args[0]
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null }
if (!KHOI) { console.error('Dùng: cat-luat.mjs <khối> [--ra <dir>] [--dau <tệp>] [--ma]'); process.exit(2) }

const spec = readFileSync(path.join(ROOT, 'spec-giai-bai.md'), 'utf8').replace(/\r\n/g, '\n')
const phan = (ten) => { // "# PHẦN A" … tới "# PHẦN" kế tiếp
  const m = spec.match(new RegExp(`^# PHẦN ${ten}\\b[\\s\\S]*?(?=^# PHẦN |(?![\\s\\S]))`, 'm'))
  if (!m) throw new Error(`spec thiếu "# PHẦN ${ten}"`)
  return m[0].trim()
}
const A = phan('A'), B = phan('B'), C = phan('C')
const chung = B.match(/^## (Hình — luật chung[^\n]*)\n[\s\S]*?(?=^## |(?![\s\S]))/m)?.[0]?.trim() || ''
const muc = B.match(new RegExp(`^## Khối ${KHOI.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b[^\\n]*\\n[\\s\\S]*?(?=^## |(?![\\s\\S]))`, 'm'))?.[0]?.trim()
if (!muc) { console.error(`spec-giai-bai.md Phần B không có mục "## Khối ${KHOI}"`); process.exit(3) }
// Khối dùng luật khối khác ("dùng luật Khối X") ⇒ ghép thêm mục đó, lần theo bắc cầu (4 → 5 → 5T)
const layMuc = (k) => B.match(new RegExp(`^## Khối ${k}\\b[^\\n]*\\n[\\s\\S]*?(?=^## |(?![\\s\\S]))`, 'm'))?.[0]?.trim()
const dung = [], hang = [muc]
while (hang.length) for (const m of hang.shift().matchAll(/dùng luật (?:của )?khối ([0-9]+T?)/gi)) {
  if (m[1] === KHOI || dung.includes(m[1])) continue
  dung.push(m[1]); const x = layMuc(m[1]); if (x) hang.push(x)
}
const muc2 = dung.map(layMuc).filter(Boolean)

const than = [A, '# PHẦN B — mục của khối', muc, ...muc2, chung, C].filter(Boolean).join('\n\n---\n\n')
const ma = createHash('sha256').update(than).digest('hex').slice(0, 12)
if (args.includes('--ma')) { console.log(ma); process.exit(0) }

const dau = opt('--dau') && existsSync(opt('--dau')) ? readFileSync(opt('--dau'), 'utf8').replace(/\r\n/g, '\n').trim() : ''
const VAI = {
  soan: `> VAI: **TRẠM SOẠN (Sonnet)**. Làm theo spec §C2 trạm 3–5: đọc HẾT luật dưới đây MỘT lần cho cả batch → phân dạng từng câu → đọc lý thuyết + ví dụ của dạng → giải → thử đáp số bằng script → chạy cổng.\n> Dòng đầu tệp soạn chép đúng: \`luat: ${ma}\``,
  soat: `> VAI: **TRẠM KIỂM (Opus)**. Làm theo spec §C5 + §C2 trạm 6: Pha 1 giải mù phần được giao TRƯỚC khi mở bản soạn → Pha 2 soát → chạy cổng → biên bản có dòng \`KẾT LUẬN:\`.\n> Mã luật hiện hành: \`${ma}\` — tệp soạn mang mã khác ⇒ KẾT LUẬN: CHƯA ĐẠT (soạn theo luật cũ).`,
}
const out = (vai) => `luat: ${ma}\n\n# BRIEF ${vai === 'soan' ? 'SOẠN' : 'KIỂM'} — khối ${KHOI} (cắt từ spec-giai-bai.md, KHÔNG sửa tay)\n\n${VAI[vai]}\n\n${dau ? `## ĐẦU RIÊNG CỦA BATCH\n\n${dau}\n\n---\n\n` : ''}${than}\n`
const ra = opt('--ra')
if (!ra) { process.stdout.write(out('soan')); process.exit(0) }
mkdirSync(ra, { recursive: true })
for (const v of ['soan', 'soat']) writeFileSync(path.join(ra, `brief-${v}.md`), out(v))
console.log(`✔ ${ra}/brief-soan.md, brief-soat.md · luat ${ma} · khối ${KHOI}${muc2.length ? ' + ' + dung.join(',') : ''}`)
