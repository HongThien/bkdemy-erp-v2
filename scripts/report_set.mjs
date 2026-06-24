// Luồng fix tự động (Pha 2) — CẬP NHẬT trạng thái 1 report (sau khi agent fix xong).
// Chạy: node scripts/report_set.mjs <id> <trang_thai> [--note="..."] [--branch=...] [--pr=URL]
//   vd: node scripts/report_set.mjs 13dc... da_fix --branch=fix/report-13dc --pr=https://github.com/.../pull/5 --note="Sửa X"
// Trạng thái hợp lệ: moi|cho_fix|tu_choi|tu_lam|da_fix|xong|tra_lai. (Ghi qua DATABASE_URL = claude_build, bỏ RLS.)
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const TT = ['moi', 'cho_fix', 'tu_choi', 'tu_lam', 'da_fix', 'xong', 'tra_lai']
const [, , id, trangThai, ...rest] = process.argv
if (!id || !trangThai) { console.error('Cần: node scripts/report_set.mjs <id> <trang_thai> [--note=] [--branch=] [--pr=]'); process.exit(1) }
if (!TT.includes(trangThai)) { console.error(`trang_thai phải thuộc: ${TT.join('|')}`); process.exit(1) }
const opt = (k) => { const m = rest.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : undefined }

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
if (!url) { console.error('Thiếu DATABASE_URL trong .env'); process.exit(1) }

const set = { trang_thai: trangThai }
if (opt('note') !== undefined) set.fix_note = opt('note')
if (opt('branch') !== undefined) set.branch = opt('branch')
if (opt('pr') !== undefined) set.pr_url = opt('pr')
const cols = Object.keys(set)
const vals = Object.values(set)

const c = new pg.Client({ connectionString: url })
await c.connect()
try {
  const r = await c.query(
    `update bao_loi set ${cols.map((k, i) => `${k} = $${i + 1}`).join(', ')} where id = $${cols.length + 1} returning id, trang_thai`,
    [...vals, id])
  if (!r.rowCount) { console.error('Không thấy report id này.'); process.exit(1) }
  console.log('OK', r.rows[0].id, '→', r.rows[0].trang_thai)
} finally { await c.end() }
