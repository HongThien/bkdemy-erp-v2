// ============================================================================
// TOOL QUERY CHỈ-ĐỌC cho bot hỏi–đáp — claude gọi: node scripts/hoidap/query.mjs "select ..."
// ----------------------------------------------------------------------------
// VÌ SAO TỒN TẠI: CEO 29/08 — "bản chất vẫn là cái trợ lý cũ, chỉ là chạy bằng Claude
// Code" ⇒ bot phải TRẢ LỜI ĐƯỢC số liệu, không đá sang tab Trợ lý. Nhưng câu hỏi nhân
// sự là input KHÔNG TIN CẬY đi qua model ⇒ không được đưa connection ghi vào tay claude.
//
// RÀO BẰNG CƠ CHẾ, THEO LỚP (không phải lời dặn trong prompt):
//   1. `begin transaction read only` — Postgres TỰ từ chối mọi INSERT/UPDATE/DELETE/DDL
//      trong transaction này, kể cả khi role kết nối (claude_build) ghi được. Đây là rào chính.
//   2. Chỉ nhận ĐÚNG MỘT statement dạng SELECT/WITH — chặn `select 1; drop ...` từ vỏ.
//   3. statement_timeout 15s + trần 200 dòng — câu hỏi không thể treo máy/tràn context.
//   4. Connection string đọc TẠI ĐÂY (tiến trình script), claude chỉ thấy KẾT QUẢ.
// Claude được allowlist đúng lệnh `node scripts/hoidap/query.mjs` (xem bot.mjs) — không
// có Bash tự do, không Write/Edit.
// ============================================================================
import pg from 'pg'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const env = (file, k) => {
  try { return readFileSync(join(root, file), 'utf8').match(new RegExp(`^\\s*${k}\\s*=\\s*(.+?)\\s*$`, 'm'))?.[1]?.replace(/^["']|["']$/g, '') } catch { return undefined }
}
// Ưu tiên DATABASE_URL_RO (role claude_ro chỉ-đọc thật) nếu máy đã cấu hình; chưa có thì
// DATABASE_URL — vẫn an toàn vì rào số 1 nằm ở transaction, không dựa vào role.
const url = env('.env', 'DATABASE_URL_RO') ?? env('.env', 'DATABASE_URL')
if (!url) { console.error('Thiếu DATABASE_URL trong .env'); process.exit(1) }

const sql = (process.argv[2] ?? '').trim()
// Bóc comment rồi mới kiểm dạng — `/* */ drop ...` không được đội lốt. Cấm hẳn comment
// và dấu ; cho đơn giản: câu SELECT lành không cần cả hai.
if (!sql || /;|--|\/\*/.test(sql) || !/^(select|with)\b/i.test(sql)) {
  console.error('Chỉ nhận ĐÚNG MỘT câu SELECT/WITH, không dấu ";", không comment. Nhận được: ' + sql.slice(0, 120))
  process.exit(1)
}

const client = new pg.Client({ connectionString: url, statement_timeout: 15_000 })
await client.connect()
try {
  await client.query('begin transaction read only')
  const r = await client.query(sql)
  const rows = r.rows.slice(0, 200)
  console.log(JSON.stringify({ so_dong: r.rowCount, hien_thi: rows.length, rows }, null, 1))
  if (r.rowCount > 200) console.log('⚠ cắt còn 200/' + r.rowCount + ' dòng — thêm điều kiện lọc hoặc aggregate.')
} catch (e) {
  console.error('Query lỗi: ' + (e?.message ?? String(e)))
  process.exitCode = 1
} finally {
  await client.query('rollback').catch(() => {})
  await client.end()
}
