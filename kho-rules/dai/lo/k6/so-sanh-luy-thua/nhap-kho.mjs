// nhap-kho.mjs — đưa 10 câu SO SÁNH LŨY THỪA (SSLT.soan.md) vào Kho lớp 6, dạng T106020801 "So sánh biểu thức lũy thừa".
//   node kho-rules/dai/lo/k6/so-sanh-luy-thua/nhap-kho.mjs          # chạy thử (ROLLBACK)
//   node kho-rules/dai/lo/k6/so-sanh-luy-thua/nhap-kho.mjs --ghi    # ghi thật
// Cổng 1: `dung-de-tu-soan.mjs --chi-kiem` (khuôn card, KaTeX…). Cổng 2 (script này): nhân chứng độc lập — TÍNH LẠI từng cặp bằng BigInt
// từ ĐỀ, so dấu với dòng "Vậy …" của lời giải; lệch ⇒ không ghi. Câu vào kho da_duyet=false (chờ người duyệt), nguon='le', nguon_giai='ai'.
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { insertCauBatch } from '../../../../../scripts/_kho_insert.mjs'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'

const DANG = 'T106020801'
const GHI = process.argv.includes('--ghi')
const md = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'SSLT.soan.md'), 'utf8').replace(/\r\n/g, '\n')
const than = md.slice(0, md.search(/^## GHI CHÚ/m))
const NGUON = { 'Bài 8 VD': 'Bài 8. So sánh lũy thừa (ví dụ)', 'Bài 8 BTVN': 'Bài 8. Chữa bài tập về nhà', 'Bài 9 VD': 'Bài 9. So sánh lũy thừa (tiếp) (ví dụ)', 'Bài 9 BTVN': 'Bài 9. Chữa bài tập về nhà' }

// "27^{11}" · "27^5.49^8" → BigInt
function tinh(s) {
  return s.split('.').reduce((acc, t) => {
    const m = t.trim().match(/^(\d+)\^\{?(\d+)\}?$/)
    if (!m) throw new Error('không đọc được biểu thức: ' + s)
    return acc * (BigInt(m[1]) ** BigInt(m[2]))
  }, 1n)
}

const cau = []
for (const kc of than.split(/^(?=### )/m).slice(1)) {
  const nhan = kc.match(/^### (.+?) \| /)[1]
  const de = kc.match(/^\*\*Đề:\*\*\s*(.+)$/m)[1].trim()
  const loiGiai = kc.slice(kc.indexOf('**Phần 1. Hướng dẫn**')).trim()
  const m = de.match(/^So sánh hai lũy thừa: \$(.+?)\$ và \$(.+?)\$\.$/)
  if (!m) throw new Error(`${nhan}: đề không đúng khuôn "So sánh hai lũy thừa: $A$ và $B$."`)
  const a = tinh(m[1]), b = tinh(m[2])
  const dauMay = a > b ? '>' : a < b ? '<' : '='
  const ket = loiGiai.split('\n').filter((l) => l.trim()).pop().match(/^Vậy \$(.+?)([<>=])(.+?)\$\.$/)
  if (!ket) throw new Error(`${nhan}: dòng cuối lời giải phải là "Vậy $A?B$."`)
  if (ket[2] !== dauMay) throw new Error(`${nhan}: LỆCH — máy tính ${m[1]} ${dauMay} ${m[2]} nhưng lời giải kết luận ${ket[2]}`)
  if (ket[1].trim() !== m[1] || ket[3].trim() !== m[2]) throw new Error(`${nhan}: kết luận không nhắc đúng hai vế của đề`)
  cau.push({ nhan, dang_chinh: DANG, khoi: '6', loai_cau: 'tu_luan', noi_dung: de, dap_an: null, loi_giai: loiGiai,
    nguon: 'le', nguon_giai: 'ai', ai_model: 'claude-sonnet-5-5', ten_de_goc: NGUON[nhan.replace(/ [a-c]$/, '')] ?? null })
  console.log(`  ✔ ${nhan.padEnd(12)} máy: ${m[1]} ${dauMay} ${m[2]}`)
}
if (cau.length !== 10) throw new Error(`cần 10 câu, có ${cau.length}`)

const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect()
try {
  await c.query('begin')
  const r = await insertCauBatch({ client: c, subject: 'dai', cauList: cau.map(({ nhan, ...q }) => q) })
  console.log(`\n${GHI ? 'GHI THẬT' : 'CHẠY THỬ'}: mới ${r.maCauList.length - r.trung.length} · trùng câu cũ ${r.trung.length}`)
  r.maCauList.forEach((ma, i) => console.log(`  ${cau[i].nhan.padEnd(12)} → ${ma}${r.trung.some((t) => t.idx === i) ? '  (TRÙNG câu đã có)' : ''}`))
  if (GHI) { await c.query('commit'); console.log('✔ đã ghi') } else { await c.query('rollback'); console.log('ROLLBACK — thêm --ghi để ghi thật') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
