// FIX: 8A1 "Buổi 7" — GT + BTVN gán nhầm sang CN 23/08 → đúng là T5 23/07.
// Chỉ đổi cột `ngay` + sửa chuỗi ngày trong `ten`. KHÔNG đụng phan/câu/ôn-tập-config
// (config key theo nguon_id/nguon_buoi/lop_id, không theo ngày → vẫn liên kết đúng).
// Chạy: node scripts/_fix_8a1_buoi7_ngay.mjs
import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const txt = readFileSync(join(root, '.env'), 'utf8')
const url = (txt.match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m) ?? [])[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const lopId = '1c813018-8ce0-45c1-b3c4-e2fd6ce8cee3'

const { rows } = await c.query(`
  UPDATE tai_lieu
     SET ngay = '2026-07-23',
         ten  = replace(ten, '23/08/2026', '23/07/2026'),
         updated_at = now()
   WHERE lop_id = $1 AND ngay = '2026-08-23' AND loai IN ('btvn','giao_trinh_buoi')
  RETURNING id, loai, ngay::text, ten`, [lopId])

console.log(`Đã sửa ${rows.length} doc:`)
for (const r of rows) console.log(`  ${r.loai.padEnd(16)} ${r.ngay} | ${r.ten}`)
await c.end()
