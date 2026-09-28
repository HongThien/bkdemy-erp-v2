// ============================================================================
// thu-migration.mjs — CHẠY THỬ một file migration trong 1 transaction rồi ROLLBACK.
//
//   node scripts/thu-migration.mjs <ten_file.sql> [--kiem <file.sql>]
//
// Vì sao: `npm run migrate` ghi thật; SQL Editor cũng ghi thật. Trước khi áp một migration
// đụng dữ liệu sống (dời dạng, đổi mã, xoá) cần THẤY nó chạy hết không lỗi + đọc được số liệu
// SAU khi chạy — mà không để lại dấu vết. Script này:
//   BEGIN → chạy toàn bộ file → chạy file --kiem (các SELECT, in ra bảng) → ROLLBACK.
// In mọi RAISE NOTICE. Thoát 0 = file chạy trót lọt (trong transaction); ≠0 = có lỗi, in vị trí.
// KHÔNG ghi sổ _migrations, KHÔNG commit. Cần role GHI (DATABASE_URL_RW truyền lúc gọi, hoặc
// DATABASE_URL trong .env) vì phải UPDATE/INSERT thử.
// ============================================================================
import pg from 'pg'
import { readFileSync, existsSync } from 'node:fs'
import { join, basename } from 'node:path'
import { bien, GOC_REPO } from './kho/cau-hinh.mjs'

const args = process.argv.slice(2)
const ten = args.find((a) => !a.startsWith('--'))
const iK = args.indexOf('--kiem')
const tepKiem = iK >= 0 ? args[iK + 1] : null
if (!ten) { console.error('Dùng: node scripts/thu-migration.mjs <ten_file.sql> [--kiem <file.sql>]'); process.exit(2) }
const duong = existsSync(ten) ? ten : join(GOC_REPO, 'supabase', 'migrations', ten)
if (!existsSync(duong)) { console.error('❌ Không thấy file: ' + duong); process.exit(2) }
const url = process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri
if (!url) { console.error('❌ Không có chuỗi kết nối GHI (DATABASE_URL_RW hoặc DATABASE_URL).'); process.exit(2) }

const sql = readFileSync(duong, 'utf8')
const c = new pg.Client({ connectionString: url })
c.on('notice', (n) => console.log('  NOTICE:', n.message))
await c.connect()
console.log(`Chạy thử ${basename(duong)} (${sql.length} ký tự) — sẽ ROLLBACK`)
const t0 = Date.now()
let ma = 0
try {
  await c.query('begin')
  await c.query(sql)
  console.log(`✔ file chạy hết không lỗi (${Date.now() - t0} ms)`)
  if (tepKiem) {
    const kiem = readFileSync(tepKiem, 'utf8')
    // mỗi câu kiểm cách nhau bằng dòng "-- ==" ; in tiêu đề = dòng comment đầu của khối
    for (const khoi of kiem.split(/^-- ==.*$/m).map((s) => s.trim()).filter(Boolean)) {
      const tieuDe = (khoi.match(/^--\s*(.*)$/m) || [])[1] || ''
      const q = khoi.replace(/^--.*$/gm, '').trim()
      if (!q) continue
      console.log('\n▶ ' + tieuDe)
      try { const r = await c.query(q); console.table(r.rows.slice(0, 60)); if (r.rows.length > 60) console.log(`  … ${r.rows.length} dòng`) }
      catch (e) { console.log('  ✘ kiểm lỗi:', e.message) }
    }
  }
} catch (e) {
  ma = 1
  console.error('✘ LỖI:', e.message)
  if (e.position) {
    const p = +e.position, dong = sql.slice(0, p).split('\n').length
    console.error(`  tại dòng ~${dong}: ${sql.slice(Math.max(0, p - 120), p + 80).replace(/\n/g, ' ⏎ ')}`)
  }
  if (e.where) console.error('  where:', e.where)
} finally {
  await c.query('rollback')
  console.log('\nĐã ROLLBACK — DB không đổi.')
  await c.end()
}
process.exit(ma)
