// ============================================================================
// RUNNER LỆNH TRA CỨU — claude gọi 1 trong 2 dạng:
//   node scripts/hoidap/tracuu.mjs <ten_lenh> khoi=8 ten_lop=8S1     (khuyên dùng — né quoting)
//   node scripts/hoidap/tracuu.mjs <ten_lenh> '{"khoi":"8"}'
// Không tham số → in danh mục lệnh (tên + mô tả + tham số) để chọn.
// ----------------------------------------------------------------------------
// Cùng lớp rào với query.mjs: chạy trong `begin transaction read only` (Postgres tự
// chặn mọi lệnh ghi — rào cơ chế), trần 200 dòng. Khác ở chỗ SQL do NGƯỜI viết sẵn
// trong tools.mjs, tham số đi đường parameterized ($1...) — model không chạm chữ SQL.
// ============================================================================
import pg from 'pg'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { HOIDAP_TOOLS } from './tools.mjs'

// DATE (oid 1082) trả string 'YYYY-MM-DD' nguyên văn — mặc định pg dựng JS Date theo UTC
// làm '2026-08-24' hiện thành '...08-23T17:00Z', model đọc nhầm ngày ngay.
pg.types.setTypeParser(1082, (v) => v)

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const env = (k) => {
  try { return readFileSync(join(root, '.env'), 'utf8').match(new RegExp(`^\\s*${k}\\s*=\\s*(.+?)\\s*$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '') } catch { return undefined }
}

const ten = process.argv[2]
if (!ten) {
  console.log('DANH MỤC LỆNH (gọi: node scripts/hoidap/tracuu.mjs <ten_lenh> \'{"tham_so":"gia_tri"}\'):\n')
  for (const t of HOIDAP_TOOLS) {
    console.log(`· ${t.name} — ${t.mo_ta}`)
    console.log(`  tham số: ${Object.entries(t.tham_so).map(([k, v]) => `${k} (${v})`).join(' · ') || '(không có)'}\n`)
  }
  process.exit(0)
}

const tool = HOIDAP_TOOLS.find((t) => t.name === ten)
if (!tool) { console.error(`Không có lệnh "${ten}". Chạy không tham số để xem danh mục.`); process.exit(1) }
// Nhận cả JSON lẫn key=value — key=value miễn nhiễm quoting của shell (PowerShell 5.1
// nuốt dấu " lồng nhau; bash thì ổn nhưng cứ né cho lành).
let thamSo = {}
const rest = process.argv.slice(3)
if (rest[0]?.trimStart().startsWith('{')) {
  try { thamSo = JSON.parse(rest[0]) }
  catch { console.error('JSON tham số hỏng — dùng dạng key=value cho chắc, vd: ten_lop=8S1 khoi=8'); process.exit(1) }
} else {
  for (const a of rest) {
    const i = a.indexOf('=')
    if (i < 1) { console.error(`Tham số "${a}" sai dạng — dùng key=value, vd: khoi=8`); process.exit(1) }
    thamSo[a.slice(0, i)] = a.slice(i + 1)
  }
}

const url = env('DATABASE_URL_RO') ?? env('DATABASE_URL')
if (!url) { console.error('Thiếu DATABASE_URL trong .env'); process.exit(1) }

let q
try { q = tool.sql(thamSo) } catch (e) { console.error(e?.message ?? String(e)); process.exit(1) }

const client = new pg.Client({ connectionString: url, statement_timeout: 15_000 })
await client.connect()
try {
  await client.query('begin transaction read only')
  const r = await client.query(q.text, q.values)
  const rows = r.rows.slice(0, 200)
  console.log(JSON.stringify({ lenh: ten, so_dong: r.rowCount, hien_thi: rows.length, rows }, null, 1))
  if (r.rowCount > 200) console.log('⚠ cắt còn 200/' + r.rowCount + ' dòng — lọc hẹp hơn.')
} catch (e) {
  console.error('Query lỗi: ' + (e?.message ?? String(e)))
  process.exitCode = 1
} finally {
  await client.query('rollback').catch(() => {})
  await client.end()
}
